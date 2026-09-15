const express = require('express');
const router = express.Router();
const { 
    createComplaint, 
    getCitizenComplaints, 
    getComplaintById, 
    getComplaintByTrackingId, 
    updateComplaintStatus,
    getPoliceAssignedComplaints,
    getPublicHeatmapData
} = require('../controllers/complaintController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public Routes
router.get('/public/heatmap', getPublicHeatmapData);

// Citizen Routes
router.post('/', protect, authorize('citizen'), upload.array('evidence', 5), createComplaint);
router.get('/my-complaints', protect, authorize('citizen'), getCitizenComplaints);
router.get('/track/:complaintId', protect, getComplaintByTrackingId);

// Police Routes
router.get('/assigned', protect, authorize('police'), getPoliceAssignedComplaints);
router.put('/:id/status', protect, authorize('police', 'admin'), updateComplaintStatus);

// Shared/Admin Routes
router.get('/:id', protect, getComplaintById);

module.exports = router;
