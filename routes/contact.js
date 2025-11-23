const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { checkUserSession, checkAdminSession } = require('../middleware/auth');

// Contact admin (user only)
router.post('/contact', checkUserSession, async (req, res) => {
  try {
    const { subject, message } = req.body;
    const userId = req.session.user_id;

    if (!subject || !message) {
      return res.status(400).json({
        success: false,
        message: 'Subject and message are required'
      });
    }

    const [result] = await query(
      'INSERT INTO contact_requests (user_id, subject, message, status) VALUES (?, ?, ?, ?)',
      [userId, subject.trim(), message.trim(), 'pending']
    );

    res.json({
      success: true,
      message: 'Contact request submitted successfully',
      request_id: result.insertId
    });
  } catch (error) {
    console.error('Contact admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit contact request: ' + error.message
    });
  }
});

// Get admin contact requests (admin only)
router.get('/requests', checkAdminSession, async (req, res) => {
  try {
    const requests = await query(`
      SELECT 
        cr.id,
        cr.user_id,
        cr.subject,
        cr.message,
        cr.status,
        cr.created_at,
        cr.resolved_at,
        u.name as user_name,
        u.email as user_email,
        u.matric as user_matric
      FROM contact_requests cr
      INNER JOIN users u ON cr.user_id = u.id
      ORDER BY cr.created_at DESC
    `);

    res.json({
      success: true,
      requests: requests
    });
  } catch (error) {
    console.error('Get contact requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Resolve contact request (admin only)
router.post('/resolve', checkAdminSession, async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    await query(
      'UPDATE contact_requests SET status = ?, resolved_at = NOW() WHERE id = ?',
      ['resolved', request_id]
    );

    res.json({
      success: true,
      message: 'Contact request resolved successfully'
    });
  } catch (error) {
    console.error('Resolve contact request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to resolve contact request: ' + error.message
    });
  }
});

// Undo resolve contact request (admin only)
router.post('/undo-resolve', checkAdminSession, async (req, res) => {
  try {
    const { request_id } = req.body;

    if (!request_id) {
      return res.status(400).json({
        success: false,
        message: 'Request ID is required'
      });
    }

    await query(
      'UPDATE contact_requests SET status = ?, resolved_at = NULL WHERE id = ?',
      ['pending', request_id]
    );

    res.json({
      success: true,
      message: 'Contact request status reverted successfully'
    });
  } catch (error) {
    console.error('Undo resolve contact request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revert contact request: ' + error.message
    });
  }
});

// Delete contact request (admin only)
router.delete('/:id', checkAdminSession, async (req, res) => {
  try {
    const requestId = parseInt(req.params.id);

    await query('DELETE FROM contact_requests WHERE id = ?', [requestId]);

    res.json({
      success: true,
      message: 'Contact request deleted successfully'
    });
  } catch (error) {
    console.error('Delete contact request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete contact request: ' + error.message
    });
  }
});

module.exports = router;

