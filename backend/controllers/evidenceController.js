const Evidence = require('../models/Evidence');
const Analysis = require('../models/Analysis');
const { extractTextFromBuffer, analyzeExtractedText } = require('../services/evidenceParser');

// @desc    Upload & extract evidence file for an analysis
// @route   POST /api/analysis/:id/evidence
const uploadEvidence = async (req, res) => {
  try {
    const analysisId = req.params.id;
    const analysis = await Analysis.findOne({ _id: analysisId, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis incident not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload a file (.txt, .log, .csv, .pdf)' });
    }

    const { originalname, size, buffer } = req.file;

    // 1. Extract Raw Text
    const rawText = await extractTextFromBuffer(buffer, originalname);

    // 2. Perform Evidence Pattern Extraction
    const { rawContent, detectedErrors, detectedWarnings, detectedTimestamps } = analyzeExtractedText(rawText);

    // 3. Save Evidence to Database
    const evidence = await Evidence.create({
      analysisId: analysis._id,
      userId: req.user._id,
      fileName: originalname,
      fileType: req.file.mimetype || 'application/octet-stream',
      fileSize: size,
      extractedContent: rawContent,
      detectedErrors,
      detectedWarnings,
      detectedTimestamps,
    });

    // 4. Update count on analysis
    const count = await Evidence.countDocuments({ analysisId: analysis._id });
    analysis.evidenceCount = count;
    await analysis.save();

    res.status(201).json({
      message: 'Evidence successfully processed and added',
      evidence,
    });
  } catch (error) {
    console.error('[Upload Evidence Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all evidence for an analysis
// @route   GET /api/analysis/:id/evidence
const getAnalysisEvidence = async (req, res) => {
  try {
    const analysisId = req.params.id;
    const analysis = await Analysis.findOne({ _id: analysisId, userId: req.user._id });

    if (!analysis) {
      return res.status(404).json({ message: 'Analysis incident not found' });
    }

    const evidenceList = await Evidence.find({ analysisId: analysis._id }).sort({ createdAt: -1 });
    res.json(evidenceList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete an evidence item
// @route   DELETE /api/evidence/:id
const deleteEvidence = async (req, res) => {
  try {
    const evidence = await Evidence.findOne({ _id: req.params.id, userId: req.user._id });

    if (!evidence) {
      return res.status(404).json({ message: 'Evidence file not found' });
    }

    const analysisId = evidence.analysisId;
    await Evidence.deleteOne({ _id: evidence._id });

    // Update count
    const count = await Evidence.countDocuments({ analysisId });
    await Analysis.updateOne({ _id: analysisId }, { evidenceCount: count });

    res.json({ message: 'Evidence file deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadEvidence,
  getAnalysisEvidence,
  deleteEvidence,
};
