const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { checkAdminSession } = require('../middleware/auth');

// Get admin stats
router.get('/admin', checkAdminSession, async (req, res) => {
  try {
    // Get pending count
    const [pendingResult] = await query('SELECT COUNT(*) as count FROM users WHERE is_verified = 0');
    const pendingCount = pendingResult[0].count;

    // Get total users count
    const [totalResult] = await query('SELECT COUNT(*) as count FROM users WHERE is_verified = 1');
    const totalUsers = totalResult[0].count;

    res.json({
      success: true,
      pending_count: parseInt(pendingCount),
      pending_users: parseInt(pendingCount), // For compatibility
      total_users: parseInt(totalUsers)
    });
  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

