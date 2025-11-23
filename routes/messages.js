const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { checkUserSession, checkAdminSession } = require('../middleware/auth');

// Get conversations (admin only)
router.get('/conversations', checkAdminSession, async (req, res) => {
  try {
    const adminId = req.admin.id;

    const conversations = await query(`
      SELECT 
        c.id as conversation_id,
        c.user_id,
        c.status,
        c.last_message_at,
        c.created_at,
        u.name as user_name,
        u.matric as user_matric,
        u.email as user_email,
        u.program as user_program,
        (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = 0 AND sender_type = 'user') as unread_count
      FROM conversations c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.admin_id = ? AND c.status = 'active'
      ORDER BY c.last_message_at DESC, c.created_at DESC
    `, [adminId]);

    const formatted = conversations.map(row => ({
      id: row.conversation_id,
      user_id: row.user_id,
      user_name: row.user_name,
      user_matric: row.user_matric,
      user_email: row.user_email,
      user_program: row.user_program,
      status: row.status,
      last_message: row.last_message,
      last_message_time: row.last_message_time,
      created_at: row.created_at,
      unread_count: parseInt(row.unread_count)
    }));

    res.json({
      success: true,
      conversations: formatted,
      count: formatted.length
    });
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get message requests (pending conversations) - admin only
router.get('/requests', checkAdminSession, async (req, res) => {
  try {
    const conversations = await query(`
      SELECT 
        c.id as conversation_id,
        c.user_id,
        c.status,
        c.last_message_at,
        c.created_at,
        u.name as user_name,
        u.matric as user_matric,
        u.email as user_email,
        u.program as user_program,
        (SELECT message FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
        (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time,
        (SELECT COUNT(*) FROM messages WHERE conversation_id = c.id AND is_read = 0 AND sender_type = 'user') as unread_count
      FROM conversations c
      INNER JOIN users u ON c.user_id = u.id
      WHERE c.status = 'pending'
      ORDER BY c.last_message_at DESC, c.created_at DESC
    `);

    const formatted = conversations.map(row => ({
      id: row.conversation_id,
      user_id: row.user_id,
      user_name: row.user_name,
      user_matric: row.user_matric,
      user_email: row.user_email,
      user_program: row.user_program,
      status: row.status,
      last_message: row.last_message,
      last_message_time: row.last_message_time,
      created_at: row.created_at,
      unread_count: parseInt(row.unread_count)
    }));

    res.json({
      success: true,
      conversations: formatted,
      count: formatted.length
    });
  } catch (error) {
    console.error('Get message requests error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Accept message request (admin only)
router.post('/accept-request', checkAdminSession, async (req, res) => {
  try {
    const { conversation_id } = req.body;

    if (!conversation_id) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID is required'
      });
    }

    const conversationId = parseInt(conversation_id);
    const adminId = req.admin.id;

    // Check if conversation exists and is pending
    const [conversations] = await query(
      'SELECT id, status, admin_id FROM conversations WHERE id = ?',
      [conversationId]
    );

    if (conversations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const conversation = conversations[0];

    if (conversation.status !== 'pending') {
      return res.status(400).json({
        success: false,
        message: 'Conversation is not pending'
      });
    }

    if (conversation.admin_id !== null) {
      return res.status(400).json({
        success: false,
        message: 'Conversation already accepted by another admin'
      });
    }

    // Update conversation: assign admin and change status to active
    await query(
      'UPDATE conversations SET admin_id = ?, status = ? WHERE id = ?',
      [adminId, 'active', conversationId]
    );

    res.json({
      success: true,
      message: 'Conversation accepted successfully',
      conversation_id: conversationId
    });
  } catch (error) {
    console.error('Accept message request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to accept conversation: ' + error.message
    });
  }
});

// Send message (admin only)
router.post('/send', checkAdminSession, async (req, res) => {
  try {
    const { conversation_id, message } = req.body;

    if (!conversation_id || !message) {
      return res.status(400).json({
        success: false,
        message: 'Conversation ID and message are required'
      });
    }

    if (!message.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Message cannot be empty'
      });
    }

    const conversationId = parseInt(conversation_id);
    const adminId = req.admin.id;

    // Verify admin has access to this conversation
    const [conversations] = await query(
      'SELECT admin_id, status FROM conversations WHERE id = ?',
      [conversationId]
    );

    if (conversations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    const conversation = conversations[0];

    if (conversation.admin_id !== null && conversation.admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // If conversation is pending and admin is sending first message, accept it
    if (conversation.status === 'pending' && conversation.admin_id === null) {
      await query(
        'UPDATE conversations SET admin_id = ?, status = ? WHERE id = ?',
        [adminId, 'active', conversationId]
      );
    }

    // Insert message
    const [result] = await query(
      'INSERT INTO messages (conversation_id, sender_id, sender_type, message) VALUES (?, ?, ?, ?)',
      [conversationId, adminId, 'admin', message.trim()]
    );

    // Update conversation last_message_at
    await query(
      'UPDATE conversations SET last_message_at = NOW() WHERE id = ?',
      [conversationId]
    );

    res.json({
      success: true,
      message: 'Message sent successfully',
      message_id: result.insertId,
      conversation_id: conversationId
    });
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send message: ' + error.message
    });
  }
});

// Get messages for a conversation
router.get('/:conversationId', checkAdminSession, async (req, res) => {
  try {
    const conversationId = parseInt(req.params.conversationId);
    const adminId = req.admin.id;

    // Verify admin has access
    const [conversations] = await query(
      'SELECT admin_id FROM conversations WHERE id = ?',
      [conversationId]
    );

    if (conversations.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversations[0].admin_id !== adminId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages
    const messages = await query(
      'SELECT id, conversation_id, sender_id, sender_type, message, is_read, created_at FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );

    // Mark messages as read
    await query(
      'UPDATE messages SET is_read = 1 WHERE conversation_id = ? AND sender_type = ? AND is_read = 0',
      [conversationId, 'user']
    );

    res.json({
      success: true,
      messages: messages
    });
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

