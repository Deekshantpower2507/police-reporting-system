const { Complaint, StatusHistory, Notification, User } = require('../models');
const { Op } = require('sequelize');

const generateComplaintId = async () => {
    const year = new Date().getFullYear();
    const count = await Complaint.count({
        where: {
            createdAt: {
                [Op.gte]: new Date(`${year}-01-01`),
                [Op.lt]: new Date(`${year + 1}-01-01`)
            }
        }
    });
    return `CR-${year}-${String(count + 1).padStart(6, '0')}`;
};

const createComplaint = async (req, res) => {
    try {
        const parsedBody = { ...req.body };
        if (typeof parsedBody.victimInformation === 'string') parsedBody.victimInformation = JSON.parse(parsedBody.victimInformation);
        if (typeof parsedBody.suspectInformation === 'string') parsedBody.suspectInformation = JSON.parse(parsedBody.suspectInformation);
        
        if (parsedBody.assignedOfficer === '') {
            parsedBody.assignedOfficer = null;
        }

        const complaintId = await generateComplaintId();
        
        let evidence = [];
        if (req.files && req.files.length > 0) {
            evidence = req.files.map(file => ({
                filename: file.filename,
                path: `/uploads/${file.filename}`,
                mimetype: file.mimetype
            }));
        }

        const complaint = await Complaint.create({
            ...parsedBody,
            complaintId,
            citizenId: req.user.id,
            evidence
        });

        await StatusHistory.create({
            complaintId: complaint.id,
            newStatus: 'Submitted',
            remarks: 'Complaint successfully submitted online',
            updatedBy: req.user.id
        });

        await Notification.create({
            userId: req.user.id,
            title: 'Complaint Submitted',
            message: `Your complaint has been successfully submitted. Reference ID: ${complaintId}`
        });

        // Send Email Notification
        const { sendEmail } = require('../utils/emailService');
        const emailText = `Dear ${req.user.name},\n\nYour complaint has been successfully submitted.\n\nTracking ID: ${complaintId}\nCrime Type: ${complaint.crimeType}\n\nYou can track the live status of your case on the citizen portal.\n\nRegards,\nPolice Reporting System`;
        
        const emailHtml = `
            <h2>Complaint Successfully Filed</h2>
            <p>Dear ${req.user.name},</p>
            <p>Your incident report has been securely logged into our system.</p>
            <ul>
                <li><strong>Tracking ID:</strong> ${complaintId}</li>
                <li><strong>Crime Type:</strong> ${complaint.crimeType}</li>
            </ul>
            <p>You can track the live status and geographical dispatch of your case on the citizen portal.</p>
            <br/><p>Regards,<br/><strong>Police Reporting System Command Center</strong></p>
        `;
        await sendEmail(req.user.email, `Incident Report Confirmation: ${complaintId}`, emailText, emailHtml);

        res.status(201).json(complaint);
    } catch (error) {
        console.error('Error creating complaint:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getCitizenComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.findAll({ 
            where: { citizenId: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        
        // Frontend expects _id mapping
        const formatted = complaints.map(c => ({...c.toJSON(), _id: c.id}));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findByPk(req.params.id, {
            include: [
                { model: User, as: 'citizen', attributes: ['id', 'name', 'email', 'phone'] },
                { model: User, as: 'officer', attributes: ['id', 'name', 'officerId', 'policeStation', 'department'] }
            ]
        });
            
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        
        if (req.user.role === 'citizen' && complaint.citizenId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized to view this complaint' });
        }

        const history = await StatusHistory.findAll({ 
            where: { complaintId: complaint.id },
            order: [['createdAt', 'ASC']],
            include: [{ model: User, as: 'updater', attributes: ['id', 'name', 'role'] }]
        });

        // Add _id for frontend compatibility
        const formattedComplaint = { ...complaint.toJSON(), _id: complaint.id, assignedOfficer: complaint.officer, citizenId: complaint.citizen };
        if (formattedComplaint.citizenId) formattedComplaint.citizenId._id = formattedComplaint.citizenId.id;

        res.json({ complaint: formattedComplaint, history });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getComplaintByTrackingId = async (req, res) => {
    try {
        const complaint = await Complaint.findOne({ 
            where: { complaintId: req.params.complaintId },
            include: [{ model: User, as: 'officer', attributes: ['id', 'name', 'policeStation'] }]
        });
            
        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });
        
        if (req.user.role === 'citizen' && complaint.citizenId !== req.user.id) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const history = await StatusHistory.findAll({ 
            where: { complaintId: complaint.id },
            order: [['createdAt', 'ASC']]
        });

        const formattedComplaint = { ...complaint.toJSON(), _id: complaint.id, assignedOfficer: complaint.officer };

        res.json({ complaint: formattedComplaint, history });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const updateComplaintStatus = async (req, res) => {
    try {
        const { status, remarks } = req.body;
        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        if (req.user.role === 'police' && complaint.assignedOfficer !== req.user.id) {
            return res.status(403).json({ message: 'Not assigned to this complaint' });
        }

        const previousStatus = complaint.status;
        complaint.status = status;
        
        if (remarks) {
            const currentRemarks = complaint.investigationRemarks || [];
            currentRemarks.push({
                remark: remarks,
                addedBy: req.user.id,
                timestamp: new Date()
            });
            complaint.investigationRemarks = currentRemarks;
        }
        
        await complaint.save();

        await StatusHistory.create({
            complaintId: complaint.id,
            previousStatus,
            newStatus: status,
            remarks,
            updatedBy: req.user.id
        });

        await Notification.create({
            userId: complaint.citizenId,
            title: `Complaint Status Updated`,
            message: `Your complaint (${complaint.complaintId}) is now ${status}.`
        });

        // Send Email Notification to Citizen
        const citizen = await User.findByPk(complaint.citizenId);
        if (citizen) {
            const { sendEmail } = require('../utils/emailService');
            const emailText = `Dear ${citizen.name},\n\nThe status of your complaint (${complaint.complaintId}) has been updated to: ${status}.\n\nRemarks: ${remarks || 'None provided'}\n\nTrack the live status on the citizen portal.\n\nRegards,\nPolice Reporting System`;
            
            const emailHtml = `
                <h2>Complaint Status Update</h2>
                <p>Dear ${citizen.name},</p>
                <p>The status of your incident report (<strong>${complaint.complaintId}</strong>) has been officially updated to: <strong style="color:blue;">${status}</strong>.</p>
                ${remarks ? `<p><strong>Official Remarks:</strong> ${remarks}</p>` : ''}
                <p>You can check the live tracking map and status timeline on the citizen portal.</p>
                <br/><p>Regards,<br/><strong>Police Reporting System Command Center</strong></p>
            `;
            await sendEmail(citizen.email, `Update on Complaint: ${complaint.complaintId}`, emailText, emailHtml);
        }

        res.json({...complaint.toJSON(), _id: complaint.id});
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPoliceAssignedComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.findAll({ 
            where: { assignedOfficer: req.user.id },
            order: [['createdAt', 'DESC']]
        });
        
        const formatted = complaints.map(c => ({...c.toJSON(), _id: c.id}));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getPublicHeatmapData = async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            where: { status: { [Op.notIn]: ['Rejected'] } },
            attributes: ['complaintId', 'crimeType', 'city', 'status', 'createdAt']
        });
        res.json(complaints);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    createComplaint,
    getCitizenComplaints,
    getComplaintById,
    getComplaintByTrackingId,
    updateComplaintStatus,
    getPoliceAssignedComplaints,
    getPublicHeatmapData
};
