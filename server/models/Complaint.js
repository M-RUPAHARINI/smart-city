const mongoose = require('mongoose');

const complaintSchema = mongoose.Schema(
    {
        title: { type: String, required: true },
        description: { type: String, required: true },
        category: {
            type: String,
            required: true,
            enum: ['Roads', 'Garbage', 'Water Supply', 'Electricity', 'Street Lights', 'Public Safety', 'Others'],
        },
        location: { type: String, required: true },
        latitude: { type: Number },
        longitude: { type: Number },
        image: { type: String },
        priority: {
            type: String,
            enum: ['Low', 'Medium', 'High', 'Emergency'],
            default: 'Medium',
        },
        status: {
            type: String,
            enum: ['Submitted', 'Assigned', 'In Progress', 'Resolved'],
            default: 'Submitted',
        },
        assignedDepartment: { type: String },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'User',
        },
        resolvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        resolutionProof: { type: String },
    },
    { timestamps: true }
);

const Complaint = mongoose.model('Complaint', complaintSchema);
module.exports = Complaint;
