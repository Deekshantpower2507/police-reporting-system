const express = require('express');
const router = express.Router();
const { 
    getActiveBulletins,
    getAllBulletins,
    createBulletin,
    updateBulletinStatus,
    deleteBulletin
} = require('../controllers/bulletinController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public route
router.get('/', getActiveBulletins);

// Admin routes
router.get('/all', protect, authorize('admin'), getAllBulletins);
router.post('/', protect, authorize('admin'), upload.single('image'), createBulletin);
router.put('/:id/status', protect, authorize('admin'), updateBulletinStatus);
router.delete('/:id', protect, authorize('admin'), deleteBulletin);

module.exports = router;
