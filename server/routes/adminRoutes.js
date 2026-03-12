const express = require('express');
const {
    getAllComplaints,
    getDashboardAnalytics,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const router = express.Router();

router.get('/complaints', protect, authorize('admin'), getAllComplaints);
router.get('/dashboard', protect, authorize('admin'), getDashboardAnalytics);

module.exports = router;
