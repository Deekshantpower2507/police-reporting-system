const { Bulletin, User } = require('../models');

// @route   GET /api/bulletins
// @desc    Get all active bulletins
// @access  Public
const getActiveBulletins = async (req, res) => {
    try {
        const bulletins = await Bulletin.findAll({
            where: { status: 'Active' },
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'admin', attributes: ['name', 'department'] }]
        });
        const formatted = bulletins.map(b => ({ ...b.toJSON(), _id: b.id }));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   GET /api/bulletins/all
// @desc    Get all bulletins (for admin)
// @access  Admin
const getAllBulletins = async (req, res) => {
    try {
        const bulletins = await Bulletin.findAll({
            order: [['createdAt', 'DESC']],
            include: [{ model: User, as: 'admin', attributes: ['name'] }]
        });
        const formatted = bulletins.map(b => ({ ...b.toJSON(), _id: b.id }));
        res.json(formatted);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   POST /api/bulletins
// @desc    Create a new bulletin
// @access  Admin
const createBulletin = async (req, res) => {
    try {
        const { type, title, description, contactInfo } = req.body;
        
        let image = null;
        if (req.file) {
            image = `/uploads/${req.file.filename}`;
        }

        const bulletin = await Bulletin.create({
            type,
            title,
            description,
            image,
            contactInfo: contactInfo || 'Contact Local Police Station or dial 100.',
            createdBy: req.user.id
        });

        res.status(201).json({ ...bulletin.toJSON(), _id: bulletin.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   PUT /api/bulletins/:id/status
// @desc    Update bulletin status
// @access  Admin
const updateBulletinStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const bulletin = await Bulletin.findByPk(req.params.id);

        if (!bulletin) {
            return res.status(404).json({ message: 'Bulletin not found' });
        }

        bulletin.status = status;
        await bulletin.save();

        res.json({ ...bulletin.toJSON(), _id: bulletin.id });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

// @route   DELETE /api/bulletins/:id
// @desc    Delete a bulletin
// @access  Admin
const deleteBulletin = async (req, res) => {
    try {
        const bulletin = await Bulletin.findByPk(req.params.id);
        if (!bulletin) {
            return res.status(404).json({ message: 'Bulletin not found' });
        }

        await bulletin.destroy();
        res.json({ message: 'Bulletin removed' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = {
    getActiveBulletins,
    getAllBulletins,
    createBulletin,
    updateBulletinStatus,
    deleteBulletin
};
