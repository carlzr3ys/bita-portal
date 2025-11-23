const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { hashPassword, verifyPassword, isValidEmail, extractBatchFromMatric, generateSessionToken } = require('../utils/helpers');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const config = require('../config');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(config.upload.dir, 'matric_cards');
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: config.upload.maxSize },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Please upload PNG, JPG, or JPEG image'));
    }
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const [users] = await query(
      'SELECT id, name, matric, email, password, program, is_verified FROM users WHERE email = ?',
      [email.trim()]
    );

    if (users.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const user = users[0];

    // Verify password
    const isValid = await verifyPassword(password, user.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check if user is verified
    if (!user.is_verified) {
      return res.status(403).json({
        success: false,
        message: 'Your account is pending admin approval. Please wait for verification.'
      });
    }

    // Set session
    req.session.user_id = user.id;
    req.session.user_email = user.email;
    req.session.user_name = user.name;

    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        name: user.name,
        matric: user.matric,
        email: user.email,
        program: user.program
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Admin Login
router.post('/admin/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const [admins] = await query(
      'SELECT id, name, email, password, role FROM admin WHERE email = ?',
      [email.trim()]
    );

    if (admins.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const admin = admins[0];

    // Verify password
    const isValid = await verifyPassword(password, admin.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Generate session token
    const sessionToken = generateSessionToken();

    // Update admin session token
    await query(
      'UPDATE admin SET session_token = ?, last_login = NOW() WHERE id = ?',
      [sessionToken, admin.id]
    );

    // Set session
    req.session.admin_id = admin.id;
    req.session.admin_email = admin.email;
    req.session.admin_name = admin.name;
    req.session.admin_role = admin.role;
    req.session.admin_session_token = sessionToken;

    res.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Lecturer Login
router.post('/lecturer/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password required'
      });
    }

    const [lecturers] = await query(
      'SELECT id, name, email, password FROM lecturers WHERE email = ?',
      [email.trim()]
    );

    if (lecturers.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const lecturer = lecturers[0];

    // Verify password
    const isValid = await verifyPassword(password, lecturer.password);
    if (!isValid) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Set session
    req.session.lecturer_id = lecturer.id;
    req.session.lecturer_email = lecturer.email;
    req.session.lecturer_name = lecturer.name;

    res.json({
      success: true,
      message: 'Login successful',
      lecturer: {
        id: lecturer.id,
        name: lecturer.name,
        email: lecturer.email
      }
    });
  } catch (error) {
    console.error('Lecturer login error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// User Register
router.post('/register', upload.single('matricCard'), async (req, res) => {
  try {
    const { name, matric, email, password, program } = req.body;

    if (!name || !matric || !email || !password || !program) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a photo of your matric card'
      });
    }

    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format. Must be @student.utem.edu.my'
      });
    }

    // Validate password
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters'
      });
    }

    // Validate program
    if (!program.toUpperCase().includes('BITA') && !program.toUpperCase().includes('BIT')) {
      return res.status(403).json({
        success: false,
        message: 'Only BITA students can register'
      });
    }

    // Validate matric format
    const matricUpper = matric.toUpperCase();
    if (!/^B03\d{6,}$/.test(matricUpper)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid matric number format. Must start with B03 followed by digits (e.g., B032510017)'
      });
    }

    // Extract batch
    const batch = extractBatchFromMatric(matricUpper);
    if (!batch) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract batch from matric number. Please check your matric number format.'
      });
    }

    // Check if email exists
    const [existingEmail] = await query('SELECT id FROM users WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Email already registered'
      });
    }

    // Check if matric exists
    const [existingMatric] = await query('SELECT id FROM users WHERE matric = ?', [matricUpper]);
    if (existingMatric.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'Matric number already registered'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate file URL
    const fileUrl = `/uploads/matric_cards/${req.file.filename}`;

    // Insert user
    const [result] = await query(
      'INSERT INTO users (name, matric, email, password, program, matric_card, batch, is_verified) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [name, matricUpper, email, hashedPassword, program, fileUrl, batch, 0]
    );

    res.status(201).json({
      success: true,
      message: 'Registration submitted successfully. Your account is pending admin approval before you can login.',
      user: {
        id: result.insertId,
        name: name,
        matric: matricUpper,
        email: email,
        program: program,
        batch: batch
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    // Delete uploaded file if database insert fails
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({
      success: false,
      message: 'Registration failed: ' + error.message
    });
  }
});

// User Logout
router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Admin Logout
router.post('/admin/logout', async (req, res) => {
  try {
    if (req.session.admin_id) {
      // Clear session token from database
      await query('UPDATE admin SET session_token = NULL WHERE id = ?', [req.session.admin_id]);
    }

    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({
          success: false,
          message: 'Logout failed'
        });
      }
      res.json({
        success: true,
        message: 'Logged out successfully'
      });
    });
  } catch (error) {
    console.error('Admin logout error:', error);
    res.status(500).json({
      success: false,
      message: 'Logout failed'
    });
  }
});

// Lecturer Logout
router.post('/lecturer/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Logout failed'
      });
    }
    res.json({
      success: true,
      message: 'Logged out successfully'
    });
  });
});

// Check User Session
router.get('/check-session', (req, res) => {
  if (!req.session || !req.session.user_id) {
    return res.json({
      success: true,
      authenticated: false
    });
  }

  res.json({
    success: true,
    authenticated: true,
    user: {
      id: req.session.user_id,
      email: req.session.user_email,
      name: req.session.user_name
    }
  });
});

// Check Admin Session
router.get('/check-admin-session', async (req, res) => {
  try {
    if (!req.session || !req.session.admin_id || !req.session.admin_session_token) {
      return res.json({
        success: true,
        authenticated: false
      });
    }

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

    res.json({
      success: true,
      authenticated: true,
      admin: admins[0]
    });
  } catch (error) {
    console.error('Check admin session error:', error);
    res.json({
      success: true,
      authenticated: false
    });
  }
});

// Check Lecturer Session
router.get('/check-lecturer-session', (req, res) => {
  if (!req.session || !req.session.lecturer_id) {
    return res.json({
      success: true,
      authenticated: false
    });
  }

  res.json({
    success: true,
    authenticated: true,
    lecturer: {
      id: req.session.lecturer_id,
      email: req.session.lecturer_email,
      name: req.session.lecturer_name
    }
  });
});

module.exports = router;

