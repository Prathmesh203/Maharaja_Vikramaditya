const asyncHandler = require('express-async-handler');
const User = require('../model/usermodel');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private (Admin)
const getStats = asyncHandler(async (req, res) => {
    const totalCompanies = await User.countDocuments({ role: 'company' });
    const totalStudents = await User.countDocuments({ role: 'student' });
    const pendingCompanies = await User.countDocuments({ role: 'company', status: 'pending' });
    const pendingStudents = await User.countDocuments({ role: 'student', status: 'pending' });

    res.json({
        totalCompanies,
        totalStudents,
        pendingApprovals: pendingCompanies + pendingStudents
    });
});

// @desc    Get pending users (companies or students)
// @route   GET /api/admin/pending
// @access  Private (Admin)
const getPendingUsers = asyncHandler(async (req, res) => {
    const { role } = req.query;
    
    const query = { status: 'pending' };
    if (role) {
        query.role = role;
    } else {
        query.role = { $in: ['company', 'student'] };
    }

    const users = await User.find(query).select('-password');
    res.json(users);
});

// @desc    Approve or Reject user
// @route   PUT /api/admin/users/:id/status
// @access  Private (Admin)
const updateUserStatus = asyncHandler(async (req, res) => {
    const { status } = req.body; // 'approved' or 'rejected'
    const user = await User.findById(req.params.id);

    if (!user) {
        res.status(404);
        throw new Error('User not found');
    }

    user.status = status;
    await user.save();

    res.json({ message: `User ${status} successfully` });
});

module.exports = { getStats, getPendingUsers, updateUserStatus };
