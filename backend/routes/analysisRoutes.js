const express = require('express');
const router = express.Router();
const {
  createAnalysis,
  getAnalyses,
  getDashboardStats,
  getAnalysisById,
  updateAnalysisStatus,
  reanalyzeAnalysis,
  deleteAnalysis,
} = require('../controllers/analysisController');
const {
  uploadEvidence,
  getAnalysisEvidence,
} = require('../controllers/evidenceController');
const {
  downloadPDFReport,
  getJSONReport,
} = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

// Dashboard statistics
router.get('/dashboard/stats', protect, getDashboardStats);

// Main Analysis CRUD
router.route('/')
  .post(protect, createAnalysis)
  .get(protect, getAnalyses);

router.route('/:id')
  .get(protect, getAnalysisById)
  .delete(protect, deleteAnalysis);

router.patch('/:id/status', protect, updateAnalysisStatus);
router.post('/:id/reanalyze', protect, reanalyzeAnalysis);

// Evidence subroutes
router.route('/:id/evidence')
  .post(protect, upload.single('file'), uploadEvidence)
  .get(protect, getAnalysisEvidence);

// Reports subroutes
router.get('/:id/report', protect, getJSONReport);
router.get('/:id/report/pdf', protect, downloadPDFReport);

module.exports = router;
