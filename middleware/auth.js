const { query } = require('../db');

// Check user session
async function checkUserSession(req, res, next) {
  if (!req.session || !req.session.user_id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  next();
}

// Check admin session
async function checkAdminSession(req, res, next) {
  if (!req.session || !req.session.admin_id || !req.session.admin_session_token) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }

  try {
    // Verify session token
    const [admins] = await query(
      'SELECT id, name, email, role FROM admin WHERE id = ? AND session_token = ?',
      [req.session.admin_id, req.session.admin_session_token]
    );

    if (admins.length === 0) {
      req.session.destroy();
      return res.status(401).json({
        success: false,
        message: 'Unauthorized'
      });
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    console.error('Admin session check error:', error);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Check lecturer session
async function checkLecturerSession(req, res, next) {
  if (!req.session || !req.session.lecturer_id) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized'
    });
  }
  next();
}

// Check admin session (for endpoints that return authenticated status)
async function checkAdminSessionOptional(req, res, next) {
  if (!req.session || !req.session.admin_id || !req.session.admin_session_token) {
    return res.json({
      success: true,
      authenticated: false
    });
  }

  try {
    const [admins] = await query(
      'SELECT id, name, email, role FROM admin WHERE id = ? AND session_token = ?',
      [req.session.admin_id, req.session.admin_session_token]
    );

    if (admins.length === 0) {
      req.session.destroy();
      return res.json({
        success: true,
        authenticated: false
      });
    }

    req.admin = admins[0];
    next();
  } catch (error) {
    console.error('Admin session check error:', error);
    return res.json({
      success: true,
      authenticated: false
    });
  }
}

module.exports = {
  checkUserSession,
  checkAdminSession,
  checkLecturerSession,
  checkAdminSessionOptional
};

