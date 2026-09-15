const { User, Complaint, Notification } = require('../models');
const { Op } = require('sequelize');
const { sequelize } = require('../config/db');

const getAllComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                { model: User, as: 'citizen', attributes: ['id', 'name', 'email'] },
                { model: User, as: 'officer', attributes: ['id', 'name'] }
            ]
        });
        
        // Map _id for frontend components that expect Mongoose format
        const formatted = complaints.map(c => {
            const json = c.toJSON();
            return {
                ...json,
                _id: json.id,
                citizenId: json.citizen ? { ...json.citizen, _id: json.citizen.id } : null,
                assignedOfficer: json.officer ? { ...json.officer, _id: json.officer.id } : null
            };
        });
        
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const assignOfficer = async (req, res) => {
    try {
        const { officerId } = req.body;
        const complaint = await Complaint.findByPk(req.params.id);

        if (!complaint) return res.status(404).json({ message: 'Complaint not found' });

        const officer = await User.findByPk(officerId);
        if (!officer || officer.role !== 'police') {
            return res.status(400).json({ message: 'Valid police officer ID required' });
        }

        const previousStatus = complaint.status;
        complaint.assignedOfficer = officerId;
        complaint.status = 'Assigned';
        await complaint.save();

        const { StatusHistory } = require('../models');
        await StatusHistory.create({
            complaintId: complaint.id,
            previousStatus: previousStatus,
            newStatus: 'Assigned',
            remarks: `Admin assigned case to Officer ${officer.name}`,
            updatedBy: req.user.id
        });

        await Notification.create({
            userId: officerId,
            title: 'New Complaint Assigned',
            message: `Complaint ${complaint.complaintId} has been assigned to you.`
        });

        await Notification.create({
            userId: complaint.citizenId,
            title: 'Officer Assigned',
            message: `Officer ${officer.name} has been assigned to your complaint ${complaint.complaintId}.`
        });

        // Send Email Notification to Citizen
        const citizen = await User.findByPk(complaint.citizenId);
        if (citizen) {
            const { sendEmail } = require('../utils/emailService');
            const emailText = `Dear ${citizen.name},\n\nAn officer has been assigned to your case.\n\nTracking ID: ${complaint.complaintId}\nAssigned Officer: ${officer.name}\nStation: ${officer.policeStation}\n\nYou can track the officer's live dispatch location on the citizen portal.\n\nRegards,\nPolice Reporting System`;
            
            const emailHtml = `
                <h2>Police Officer Dispatched</h2>
                <p>Dear ${citizen.name},</p>
                <p>An officer has been officially assigned to your incident report (<strong>${complaint.complaintId}</strong>).</p>
                <ul>
                    <li><strong>Assigned Officer:</strong> ${officer.name}</li>
                    <li><strong>Police Station:</strong> ${officer.policeStation}</li>
                </ul>
                <p>You can check the live tracking map and status timeline on the citizen portal.</p>
                <br/><p>Regards,<br/><strong>Police Reporting System Command Center</strong></p>
            `;
            await sendEmail(citizen.email, `Officer Assigned: ${complaint.complaintId}`, emailText, emailHtml);
        }

        res.json({ message: 'Officer assigned successfully', complaint: {...complaint.toJSON(), _id: complaint.id} });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ 
            where: { role: 'citizen' },
            attributes: { exclude: ['password'] }
        });
        const formatted = users.map(u => ({...u.toJSON(), _id: u.id}));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAllOfficers = async (req, res) => {
    try {
        const officers = await User.findAll({ 
            where: { role: 'police' },
            attributes: { exclude: ['password'] }
        });
        const formatted = officers.map(u => ({...u.toJSON(), _id: u.id}));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const createOfficer = async (req, res) => {
    try {
        const { name, email, phone, password, officerId, department, policeStation, city } = req.body;

        const userExists = await User.findOne({ where: { email } });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        const officerExists = await User.findOne({ where: { officerId } });
        if (officerExists) return res.status(400).json({ message: 'Officer ID already exists' });

        const officer = await User.create({
            name, email, phone, password, role: 'police',
            officerId, department, policeStation, city
        });

        res.status(201).json({ message: 'Officer created successfully', _id: officer.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

const getAnalytics = async (req, res) => {
    try {
        const totalComplaints = await Complaint.count();
        const pendingComplaints = await Complaint.count({ where: { status: { [Op.in]: ['Submitted', 'Under Review'] } } });
        const activeComplaints = await Complaint.count({ where: { status: { [Op.in]: ['Assigned', 'Under Investigation'] } } });
        const resolvedComplaints = await Complaint.count({ where: { status: 'Resolved' } });
        
        const totalUsers = await User.count({ where: { role: 'citizen' } });

        // Using Sequelize raw queries for aggregation to match previous mongoose aggregate format
        const crimeTypes = await Complaint.findAll({
            attributes: [
                ['crimeType', '_id'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['crimeType'],
            raw: true
        });

        const statusDistribution = await Complaint.findAll({
            attributes: [
                ['status', '_id'],
                [sequelize.fn('COUNT', sequelize.col('id')), 'count']
            ],
            group: ['status'],
            raw: true
        });

        res.json({
            stats: { totalComplaints, pendingComplaints, activeComplaints, resolvedComplaints, totalUsers },
            crimeTypes,
            statusDistribution
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getAllComplaints, assignOfficer, getAllUsers, getAllOfficers, createOfficer, getAnalytics
};
