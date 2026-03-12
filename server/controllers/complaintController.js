const Complaint = require('../models/Complaint');
const mongoose = require('mongoose');

// In-memory mock storage for Preview Mode
let mockComplaints = [];

const createComplaint = async (req, res) => {
    console.log('Incoming Complaint Request:', req.body);
    console.log('File Info:', req.file);

    if (!req.body) {
        console.error('Submission Error: req.body is undefined');
        return res.status(400).json({ message: 'Request body is empty. Please ensure you are sending data correctly.' });
    }

    const { title, description, category, location, latitude, longitude } = req.body;
    const image = req.file ? `/uploads/${req.file.filename}` : req.body.image;

    if (mongoose.connection.readyState !== 1) {
        const newComplaint = {
            _id: 'mock_' + Date.now(),
            title,
            description,
            category,
            location,
            latitude: Number(latitude),
            longitude: Number(longitude),
            image,
            status: 'Submitted',
            createdBy: req.user._id,
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockComplaints.push(newComplaint);
        return res.status(201).json(newComplaint);
    }

    try {
        const complaint = new Complaint({
            title,
            description,
            category,
            location,
            latitude: Number(latitude),
            longitude: Number(longitude),
            image,
            priority: req.body.priority,
            createdBy: req.user._id,
        });
        const createdComplaint = await complaint.save();
        console.log('Complaint saved successfully:', createdComplaint._id);
        res.status(201).json(createdComplaint);
    } catch (error) {
        console.error('Database Save Error:', error);
        res.status(500).json({ message: error.message });
    }
};

const getMyComplaints = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json(mockComplaints.filter(c => c.createdBy === req.user._id));
    }
    const complaints = await Complaint.find({ createdBy: req.user._id });
    res.json(complaints);
};

const getAllComplaints = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json(mockComplaints);
    }
    const complaints = await Complaint.find({}).populate('createdBy', 'name email');
    res.json(complaints);
};

const updateComplaintStatus = async (req, res) => {
    const { status, assignedDepartment, resolutionProof } = req.body;

    if (mongoose.connection.readyState !== 1) {
        const index = mockComplaints.findIndex(c => c._id === req.params.id);
        if (index !== -1) {
            mockComplaints[index] = {
                ...mockComplaints[index],
                status: status || mockComplaints[index].status,
                assignedDepartment: assignedDepartment || mockComplaints[index].assignedDepartment,
                resolutionProof: resolutionProof || mockComplaints[index].resolutionProof,
                updatedAt: new Date()
            };
            return res.json(mockComplaints[index]);
        }
        return res.status(404).json({ message: 'Mock complaint not found' });
    }

    const complaint = await Complaint.findById(req.params.id);
    if (complaint) {
        complaint.status = status || complaint.status;
        complaint.assignedDepartment = assignedDepartment || complaint.assignedDepartment;

        if (req.file) {
            complaint.resolutionProof = `/uploads/${req.file.filename}`;
        } else if (resolutionProof) {
            complaint.resolutionProof = resolutionProof;
        }

        if (status === 'Resolved') {
            complaint.resolvedBy = req.user._id;
        }
        const updatedComplaint = await complaint.save();
        res.json(updatedComplaint);
    } else {
        res.status(404).json({ message: 'Complaint not found' });
    }
};

const getDashboardAnalytics = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        const total = mockComplaints.length;
        const resolved = mockComplaints.filter(c => c.status === 'Resolved').length;
        const pending = total - resolved;

        // Group by category
        const categoryGroups = {};
        mockComplaints.forEach(c => {
            categoryGroups[c.category] = (categoryGroups[c.category] || 0) + 1;
        });
        const categories = Object.keys(categoryGroups).map(key => ({
            _id: key,
            count: categoryGroups[key]
        }));

        return res.json({ total, resolved, pending, categories });
    }

    const total = await Complaint.countDocuments();
    const resolved = await Complaint.countDocuments({ status: 'Resolved' });
    const pending = await Complaint.countDocuments({ status: { $ne: 'Resolved' } });
    const categories = await Complaint.aggregate([{ $group: { _id: '$category', count: { $sum: 1 } } }]);

    res.json({ total, resolved, pending, categories });
};

const getOfficerComplaints = async (req, res) => {
    if (mongoose.connection.readyState !== 1) {
        return res.json(mockComplaints.filter(c => c.status !== 'Submitted'));
    }
    const complaints = await Complaint.find({ status: { $ne: 'Submitted' } });
    res.json(complaints);
};

module.exports = {
    createComplaint,
    getMyComplaints,
    getAllComplaints,
    updateComplaintStatus,
    getDashboardAnalytics,
    getOfficerComplaints,
};
