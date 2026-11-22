const express = require('express');
const router = express.Router();
const { deleteEvidence } = require('../controllers/evidenceController');
const { protect } = require('../middleware/authMiddleware');

router.delete('/:id', protect, deleteEvidence);

module.exports = router;
