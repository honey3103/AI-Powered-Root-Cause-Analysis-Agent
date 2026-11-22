const Analysis = require('../models/Analysis');
const AnalysisResult = require('../models/AnalysisResult');
const Evidence = require('../models/Evidence');
const { buildPDFReport } = require('../services/pdfService');

// @desc    Download PDF RCA Report
// @route   GET /api/analysis/:id/report/pdf
const downloadPDFReport = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const result = await AnalysisResult.findOne({ analysisId: analysis._id });
    if (!result) {
      return res.status(404).json({ message: 'Analysis result not generated yet' });
    }

    const evidenceList = await Evidence.find({ analysisId: analysis._id });

    const safeTitle = analysis.title.replace(/[^a-zA-Z0-9_-]/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="RCA_Report_${safeTitle}.pdf"`);

    buildPDFReport(analysis, result, evidenceList, res);
  } catch (error) {
    console.error('[Download PDF Error]:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get structured report data for online viewing / printing
// @route   GET /api/analysis/:id/report
const getJSONReport = async (req, res) => {
  try {
    const analysis = await Analysis.findOne({ _id: req.params.id, userId: req.user._id });
    if (!analysis) {
      return res.status(404).json({ message: 'Analysis not found' });
    }

    const result = await AnalysisResult.findOne({ analysisId: analysis._id });
    const evidenceList = await Evidence.find({ analysisId: analysis._id });

    res.json({
      analysis,
      result,
      evidenceList,
      generatedAt: new Date(),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  downloadPDFReport,
  getJSONReport,
};
