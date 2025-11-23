const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { checkUserSession, checkAdminSession } = require('../middleware/auth');

// Get all users (admin only)
router.get('/all', checkAdminSession, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, name, matric, email, program, is_verified, created_at, updated_at FROM users WHERE is_verified = 1 ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users: Array.isArray(users) ? users : []
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get pending users (admin only)
router.get('/pending', checkAdminSession, async (req, res) => {
  try {
    const users = await query(
      'SELECT id, name, matric, email, program, batch, matric_card, created_at FROM users WHERE is_verified = 0 ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      users: users
    });
  } catch (error) {
    console.error('Get pending users error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user by ID
router.get('/:id', checkUserSession, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    const [users] = await query(
      'SELECT id, name, matric, email, program, year, batch, phone, email_alt, bio, description, instagram, facebook, twitter, linkedin, tiktok, matric_card, is_verified, created_at, updated_at FROM users WHERE id = ? AND is_verified = 1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or not verified'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get user profile (for viewing other users)
router.get('/profile/:id', async (req, res) => {
  try {
    // Check if user or admin is authenticated
    if (!req.session.user_id && !req.session.admin_id) {
      return res.status(401).json({
        success: false,
        message: 'Not authenticated'
      });
    }

    const userId = parseInt(req.params.id);

    if (userId <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid user ID'
      });
    }

    const [users] = await query(
      'SELECT id, name, matric, email, program, year, batch, phone, email_alt, bio, description, instagram, facebook, twitter, linkedin, tiktok, matric_card, is_verified, created_at, updated_at FROM users WHERE id = ? AND is_verified = 1',
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found or not verified'
      });
    }

    res.json({
      success: true,
      user: users[0]
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update user profile
router.post('/update-profile', checkUserSession, async (req, res) => {
  try {
    const userId = req.session.user_id;
    const data = req.body;

    // Allowed fields
    const allowedFields = [
      'name', 'phone', 'email_alt', 'year',
      'bio', 'description',
      'instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'
    ];

    // Validate name if provided
    if (data.name && !data.name.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Name cannot be empty'
      });
    }

    // Process and validate URLs for social media
    const urlFields = ['instagram', 'facebook', 'twitter', 'linkedin', 'tiktok'];
    urlFields.forEach(field => {
      if (data[field] && data[field].trim()) {
        const url = data[field].trim();
        if (!/^https?:\/\//.test(url)) {
          data[field] = 'https://' + url;
        }
      }
    });

    // Build update query
    const updateFields = [];
    const params = [];

    allowedFields.forEach(field => {
      if (data[field] !== undefined) {
        const value = data[field].trim();
        updateFields.push(`${field} = ?`);
        params.push(value === '' ? null : value);
      }
    });

    if (updateFields.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
    }

    updateFields.push('updated_at = NOW()');
    params.push(userId);

    const sql = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    await query(sql, params);

    res.json({
      success: true,
      message: 'Profile updated successfully'
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile: ' + error.message
    });
  }
});

// Approve user (admin only)
router.post('/approve', checkAdminSession, async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID required'
      });
    }

    // Get user info before update
    const [users] = await query(
      'SELECT name, email, matric FROM users WHERE id = ?',
      [user_id]
    );

    if (users.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const user = users[0];

    // Update user to verified
    await query(
      'UPDATE users SET is_verified = 1, verification_comment = NULL, updated_at = NOW() WHERE id = ?',
      [user_id]
    );

    // Log admin action (if log_admin_action function exists)
    // TODO: Implement logAdminAction

    // Send approval email (if sendApprovalEmail function exists)
    // TODO: Implement email sending

    res.json({
      success: true,
      message: 'User approved successfully'
    });
  } catch (error) {
    console.error('Approve user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to approve user: ' + error.message
    });
  }
});

// Reject user (admin only)
router.post('/reject', checkAdminSession, async (req, res) => {
  try {
    const { user_id, comment } = req.body;

    if (!user_id) {
      return res.status(400).json({
        success: false,
        message: 'User ID required'
      });
    }

    // Delete user
    await query('DELETE FROM users WHERE id = ?', [user_id]);

    res.json({
      success: true,
      message: 'User rejected and deleted successfully'
    });
  } catch (error) {
    console.error('Reject user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to reject user: ' + error.message
    });
  }
});

// Delete user (admin only)
router.delete('/:id', checkAdminSession, async (req, res) => {
  try {
    const userId = parseInt(req.params.id);

    await query('DELETE FROM users WHERE id = ?', [userId]);

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user: ' + error.message
    });
  }
});

// Get members (alumni/verified users)
router.get('/members/all', async (req, res) => {
  try {
    const users = await query(
      'SELECT id, name, matric, program, batch, bio, description, instagram, facebook, twitter, linkedin, tiktok, created_at FROM users WHERE is_verified = 1 ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      members: users
    });
  } catch (error) {
    console.error('Get members error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get alumni
router.get('/alumni/all', async (req, res) => {
  try {
    const alumni = await query(
      'SELECT id, name, matric, batch, current_company, bio, description, instagram, facebook, twitter, linkedin, tiktok, created_at FROM alumni ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      alumni: alumni
    });
  } catch (error) {
    console.error('Get alumni error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

