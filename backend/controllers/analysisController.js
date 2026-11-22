const Analysis = require('../models/Analysis');
const AnalysisResult = require('../models/AnalysisResult');
const Evidence = require('../models/Evidence');
const { analyzeIncident } = require('../services/aiService');

// @desc    Create new analysis & execute AI reasoning
// @route   POST /api/analysis
const createAnalysis = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      severity,
      symptoms,
      errorMessages,
      timeOfOccurrence,
      recentChanges,
      additionalInfo,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }

    // 1. Create Analysis in DB
    const analysis = await Analysis.create({
      userId: req.user._id,
      title,
      description,
      category: category || 'Other technical issues',
      severity: severity || 'Medium',
      symptoms: Array.isArray(symptoms) ? symptoms : symptoms ? symptoms.split(',').map(s => s.trim()) : [],
      errorMessages: errorMessages || '',
      timeOfOccurrence: timeOfOccurrence || '',
      recentChanges: recentChanges || '',
      additionalInfo: additionalInfo || '',
    });

    // 2. Run AI RCA Orchestration
    const userApiKey = req.user.preferredProvider === 'gemini' ? req.user.apiKeyGemini : req.user.apiKeyOpenAI;
    const aiOutput = await analyzeIncident({
      title: analysis.title,
      description: analysis.description,
      category: analysis.category,
      severity: analysis.severity,
      symptoms: analysis.symptoms,
      errorMessages: analysis.errorMessages,
      timeOfOccurrence: analysis.timeOfOccurrence,
      recentChanges: analysis.recentChanges,
      additionalInfo: analysis.additionalInfo,
      evidenceList: [],
      userApiKey,
      provider: req.user.preferredProvider,
    });

    // 3. Save Structured Result
    const analysisResult = await AnalysisResult.create({
      analysisId: analysis._id,
      problemSummary: aiOutput.problemSummary,
      identifiedSymptoms: aiOutput.identifiedSymptoms || analysis.symptoms,
      possibleCauses: aiOutput.possibleCauses,
      mostLikelyCause: aiOutput.mostLikelyCause,
      fiveWhys: aiOutput.fiveWhys,
      finalRootCause: aiOutput.finalRootCause,
      recommendations: aiOutput.recommendations,
      alternativeExplanations: aiOutput.alternativeExplanations,
      investigationSteps: aiOutput.investigationSteps,
      missingInformation: aiOutput.missingInformation,
      confidenceAssessment: aiOutput.confidenceAssessment,
      modelUsed: aiOutput.modelUsed || 'RCA Engine',
    });

    res.status(201).json({
      analysis,
      result: analysisResult,
    });
  } catch (error) {
    console.error('[Create Analysis Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all analyses for logged in user with search & filters
// @route   GET /api/analysis
const getAnalyses = async (req, res) => {
  try {
    const { search, category, severity, status } = req.query;
    const query = { userId: req.user._id };

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { errorMessages: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (severity && severity !== 'All') {
      query.severity = severity;
    }

    if (status && status !== 'All') {
      query.status = status;
    }

    const analyses = await Analysis.find(query).sort({ createdAt: -1 });
    res.json(analyses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dashboard metrics & statistics
// @route   GET /api/analysis/dashboard/stats
const getDashboardStats = async (req, res) => {
  try {
    const userId = req.user._id;

    const totalAnalyses = await Analysis.countDocuments({ userId });
    const openIncidents = await Analysis.countDocuments({ userId, status: 'Open' });
    const inProgressIncidents = await Analysis.countDocuments({ userId, status: 'In Progress' });
    const resolvedIncidents = await Analysis.countDocuments({ userId, status: 'Resolved' });
    const highSeverityIncidents = await Analysis.countDocuments({
      userId,
      severity: { $in: ['High', 'Critical'] },
    });

    // Category aggregation
    const categoryCounts = await Analysis.aggregate([
      { $match: { userId } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Severity aggregation
    const severityCounts = await Analysis.aggregate([
      { $match: { userId } },
      { $group: { _id: '$severity', count: { $sum: 1 } } },
    ]);

    // Recent 5 investigations
    const recentAnalyses = await Analysis.find({ userId })
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      totalAnalyses,
      openIncidents,
      inProgressIncidents,
      resolvedIncidents,
      highSeverityIncidents,
      categoryCounts,
      severityCounts,
      recentAnalyses,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get analysis by ID with full details, result & evidence
// @route   GET /api/analysis/:id
const getAnalysisById = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Incident analysis not found' });
    }

    const result = await AnalysisResult.findOne({ analysisId: analysis._id });
    const evidenceList = await Evidence.find({ analysisId: analysis._id }).sort({ createdAt: -1 });

    res.json({
      analysis,
      result,
      evidenceList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update analysis status (e.g., Open -> Resolved)
// @route   PATCH /api/analysis/:id/status
const updateAnalysisStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    analysis.status = status;
    await analysis.save();

    res.json(analysis);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Re-run AI Analysis (e.g. after adding evidence logs)
// @route   POST /api/analysis/:id/reanalyze
const reanalyzeAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const evidenceList = await Evidence.find({ analysisId: analysis._id });

    const userApiKey = req.user.preferredProvider === 'gemini' ? req.user.apiKeyGemini : req.user.apiKeyOpenAI;
    const aiOutput = await analyzeIncident({
      title: analysis.title,
      description: analysis.description,
      category: analysis.category,
      severity: analysis.severity,
      symptoms: analysis.symptoms,
      errorMessages: analysis.errorMessages,
      timeOfOccurrence: analysis.timeOfOccurrence,
      recentChanges: analysis.recentChanges,
      additionalInfo: analysis.additionalInfo,
      evidenceList,
      userApiKey,
      provider: req.user.preferredProvider,
    });

    const updatedResult = await AnalysisResult.findOneAndUpdate(
      { analysisId: analysis._id },
      {
        problemSummary: aiOutput.problemSummary,
        identifiedSymptoms: aiOutput.identifiedSymptoms || analysis.symptoms,
        possibleCauses: aiOutput.possibleCauses,
        mostLikelyCause: aiOutput.mostLikelyCause,
        fiveWhys: aiOutput.fiveWhys,
        finalRootCause: aiOutput.finalRootCause,
        recommendations: aiOutput.recommendations,
        alternativeExplanations: aiOutput.alternativeExplanations,
        investigationSteps: aiOutput.investigationSteps,
        missingInformation: aiOutput.missingInformation,
        confidenceAssessment: aiOutput.confidenceAssessment,
        modelUsed: aiOutput.modelUsed || 'RCA Engine',
      },
      { new: true, upsert: true }
    );

    res.json({
      analysis,
      result: updatedResult,
      evidenceList,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete analysis & associated results and evidence
// @route   DELETE /api/analysis/:id
const deleteAnalysis = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    await Analysis.deleteOne({ _id: analysis._id });
    await AnalysisResult.deleteOne({ analysisId: analysis._id });
    await Evidence.deleteMany({ analysisId: analysis._id });

    res.json({ message: 'Analysis and all associated evidence removed' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createAnalysis,
  getAnalyses,
  getDashboardStats,
  getAnalysisById,
  updateAnalysisStatus,
  reanalyzeAnalysis,
  deleteAnalysis,
};
