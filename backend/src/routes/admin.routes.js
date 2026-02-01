const express = require('express');
const router = express.Router();
const { getStats, getPendingUsers, updateUserStatus } = require('../controllers/admin.controller');
const { protect } = require('../middleware/auth.middleware');

// Middleware to check for admin role
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401);
        throw new Error('Not authorized as an admin');
    }
};

router.get('/stats', protect, admin, getStats);
router.get('/pending', protect, admin, getPendingUsers);
router.put('/users/:id/status', protect, admin, updateUserStatus);

module.exports = router;
