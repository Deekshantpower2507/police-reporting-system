const express = require('express');
const router = express.Router();
const { 
    getAllComplaints, 
    assignOfficer, 
    getAllUsers, 
    getAllOfficers, 
    createOfficer, 
    getAnalytics 
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin'));

router.get('/complaints', getAllComplaints);
router.put('/complaints/:id/assign', assignOfficer);
router.get('/users', getAllUsers);
router.get('/officers', getAllOfficers);
router.post('/officers', createOfficer);
router.get('/analytics', getAnalytics);

module.exports = router;
