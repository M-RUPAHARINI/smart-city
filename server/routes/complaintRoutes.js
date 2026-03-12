const express = require('express');
const {
    createComplaint,
    getMyComplaints,
    updateComplaintStatus,
    getOfficerComplaints,
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const router = express.Router();

// Ensure uploads directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.route('/')
    .post(upload.single('image'), protect, authorize('citizen'), createComplaint)
    .get(protect, authorize('citizen'), getMyComplaints);

router.get('/officer', protect, authorize('officer'), getOfficerComplaints);

router.route('/:id/status')
    .put(upload.single('image'), protect, authorize('admin', 'officer'), updateComplaintStatus);

module.exports = router;
