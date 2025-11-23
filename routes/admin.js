const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { checkAdminSession } = require('../middleware/auth');
const { hashPassword } = require('../utils/helpers');

// Get all admins (superadmin only)
router.get('/all', checkAdminSession, async (req, res) => {
  try {
    // Check if superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Superadmin only.'
      });
    }

    const admins = await query(
      'SELECT id, name, email, role, created_at, last_login FROM admin ORDER BY created_at DESC'
    );

    res.json({
      success: true,
      admins: admins
    });
  } catch (error) {
    console.error('Get admins error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Save admin (create or update) - superadmin only
router.post('/save', checkAdminSession, async (req, res) => {
  try {
    // Check if superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Superadmin only.'
      });
    }

    const { admin_id, name, email, password, role } = req.body;

    if (!name || !email || !role) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and role are required'
      });
    }

    // Validate email
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Validate role
    if (!['superadmin', 'moderator'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role'
      });
    }

    // If creating new admin, password is required
    if (!admin_id && !password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required for new admin'
      });
    }

    // If password provided, validate length
    if (password && password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    if (admin_id) {
      // Update existing admin
      const adminId = parseInt(admin_id);

      // Check if admin exists
      const [admins] = await query('SELECT role FROM admin WHERE id = ?', [adminId]);
      if (admins.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Admin not found'
        });
      }

      const targetAdmin = admins[0];

      // Cannot edit other superadmins
      if (targetAdmin.role === 'superadmin' && adminId !== req.admin.id) {
        return res.status(403).json({
          success: false,
          message: 'Cannot edit other super admins'
        });
      }

      // Superadmin cannot change their own role
      if (adminId === req.admin.id && req.admin.role === 'superadmin' && role !== 'superadmin') {
        return res.status(400).json({
          success: false,
          message: 'Cannot change your own role from superadmin'
        });
      }

      // Check if email already exists
      const [existing] = await query('SELECT id FROM admin WHERE email = ? AND id != ?', [email, adminId]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      // Update admin
      if (password) {
        const hashedPassword = await hashPassword(password);
        await query(
          'UPDATE admin SET name = ?, email = ?, password = ?, role = ? WHERE id = ?',
          [name, email, hashedPassword, role, adminId]
        );
      } else {
        await query(
          'UPDATE admin SET name = ?, email = ?, role = ? WHERE id = ?',
          [name, email, role, adminId]
        );
      }

      // TODO: Log admin action

      res.json({
        success: true,
        message: 'Admin updated successfully'
      });
    } else {
      // Create new admin
      // Check if email already exists
      const [existing] = await query('SELECT id FROM admin WHERE email = ?', [email]);
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Email already exists'
        });
      }

      const hashedPassword = await hashPassword(password);
      const [result] = await query(
        'INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hashedPassword, role]
      );

      // TODO: Log admin action

      res.json({
        success: true,
        message: 'Admin created successfully'
      });
    }
  } catch (error) {
    console.error('Save admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to save admin: ' + error.message
    });
  }
});

// Delete admin (superadmin only)
router.delete('/:id', checkAdminSession, async (req, res) => {
  try {
    // Check if superadmin
    if (req.admin.role !== 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Superadmin only.'
      });
    }

    const adminId = parseInt(req.params.id);

    // Cannot delete yourself
    if (adminId === req.admin.id) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete yourself'
      });
    }

    // Check if target is superadmin
    const [admins] = await query('SELECT role FROM admin WHERE id = ?', [adminId]);
    if (admins.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Admin not found'
      });
    }

    if (admins[0].role === 'superadmin') {
      return res.status(403).json({
        success: false,
        message: 'Cannot delete superadmin'
      });
    }

    await query('DELETE FROM admin WHERE id = ?', [adminId]);

    // TODO: Log admin action

    res.json({
      success: true,
      message: 'Admin deleted successfully'
    });
  } catch (error) {
    console.error('Delete admin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete admin: ' + error.message
    });
  }
});

// Get admin logs
router.get('/logs', checkAdminSession, async (req, res) => {
  try {
    const logs = await query(
      'SELECT id, admin_id, action, entity_type, entity_id, entity_name, details, created_at FROM admin_logs ORDER BY created_at DESC LIMIT 100'
    );

    res.json({
      success: true,
      logs: logs
    });
  } catch (error) {
    console.error('Get admin logs error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

