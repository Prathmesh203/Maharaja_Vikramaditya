const express = require('express');
const router = express.Router();
const { applyToDrive, getStudentApplications, getDriveApplications, updateApplicationStatus, getCompanyStats } = require('../controllers/application.controller');
const { protect } = require('../middleware/auth.middleware');

router.post('/', protect, applyToDrive);
router.get('/my', protect, getStudentApplications);
router.get('/drive/:driveId', protect, getDriveApplications);
router.put('/:id/status', protect, updateApplicationStatus); // New route
router.get('/stats', protect, getCompanyStats);

module.exports = router;
