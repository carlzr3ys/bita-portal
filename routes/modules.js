const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { query } = require('../db');
const { checkUserSession, checkAdminSession } = require('../middleware/auth');
const config = require('../config');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const weekId = req.body.week_id || 'general';
    const uploadPath = path.join(config.upload.dir, 'modules', weekId.toString());
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
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['pdf', 'doc', 'docx', 'ppt', 'pptx', 'xls', 'xlsx', 'txt', 'zip', 'rar', 'jpg', 'jpeg', 'png', 'gif'];
    const ext = path.extname(file.originalname).toLowerCase().substring(1);
    if (allowedTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('File type not allowed'));
    }
  }
});

// Format file size
function formatFileSize(bytes) {
  if (bytes >= 1073741824) {
    return (bytes / 1073741824).toFixed(2) + ' GB';
  } else if (bytes >= 1048576) {
    return (bytes / 1048576).toFixed(2) + ' MB';
  } else if (bytes >= 1024) {
    return (bytes / 1024).toFixed(2) + ' KB';
  } else {
    return bytes + ' bytes';
  }
}

// Get category path
async function getCategoryPath(weekId) {
  if (!weekId) return 'Unknown Location';
  
  const path = [];
  let currentId = weekId;
  let level = 0;
  const maxLevels = 5;

  while (currentId && level < maxLevels) {
    const [categories] = await query(
      'SELECT id, name, parent_id, level FROM module_categories WHERE id = ?',
      [currentId]
    );

    if (categories.length === 0) break;

    const category = categories[0];
    path.unshift(category.name);
    currentId = category.parent_id;
    level++;

    if (!currentId) break;
  }

  return path.join(' > ');
}

// Get modules (legacy - for old modules table)
router.get('/all', async (req, res) => {
  try {
    const modules = await query(
      'SELECT id, title, slug, year, semester, subject, category, file_url, file_type, views, downloads, created_at, updated_at FROM modules ORDER BY year ASC, semester ASC, category ASC, title ASC'
    );

    res.json({
      success: true,
      modules: modules
    });
  } catch (error) {
    console.error('Get modules error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get all module files (admin only)
router.get('/files/all', checkAdminSession, async (req, res) => {
  try {
    const isSuperAdmin = req.admin.role === 'superadmin';

    // Check if columns exist
    const [visibilityCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'visibility'");
    const hasVisibilityColumn = visibilityCheck.length > 0;

    const [pinnedCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'is_pinned'");
    const hasPinnedColumn = pinnedCheck.length > 0;

    let sql = `SELECT mf.id, mf.week_id, mf.file_name, mf.file_path, mf.file_size, mf.file_type, 
               mf.uploaded_by, mf.description, mf.views, mf.downloads, mf.created_at`;

    if (hasPinnedColumn) {
      sql += ', mf.is_pinned';
    } else {
      sql += ', 0 as is_pinned';
    }

    if (hasVisibilityColumn) {
      sql += ', mf.visibility';
    } else {
      sql += ', \'Public\' as visibility';
    }

    sql += `, mc.name as week_name, mc.level as week_level,
            u.name as uploader_name, u.matric as uploader_matric, u.email as uploader_email
            FROM module_files mf
            LEFT JOIN module_categories mc ON mf.week_id = mc.id
            LEFT JOIN users u ON mf.uploaded_by = u.id`;

    // Filter by visibility for non-superadmin
    if (hasVisibilityColumn && !isSuperAdmin) {
      sql += " WHERE (mf.visibility != 'Private' OR mf.visibility IS NULL)";
    } else {
      sql += ' WHERE 1=1';
    }

    sql += hasPinnedColumn ? ' ORDER BY mf.is_pinned DESC, mf.created_at DESC' : ' ORDER BY mf.created_at DESC';

    const files = await query(sql);

    // Format files
    for (const file of files) {
      file.file_size_formatted = formatFileSize(file.file_size);
      if (!file.visibility) file.visibility = 'Public';
      file.category_path = await getCategoryPath(file.week_id);
    }

    res.json({
      success: true,
      files: files,
      count: files.length
    });
  } catch (error) {
    console.error('Get all module files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get week files (user)
router.get('/files/week/:weekId', checkUserSession, async (req, res) => {
  try {
    const weekId = parseInt(req.params.weekId);
    const userId = req.session.user_id;
    const isAdmin = req.session.admin_id ? true : false;

    // Check if visibility column exists
    const [visibilityCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'visibility'");
    const hasVisibilityColumn = visibilityCheck.length > 0;

    let sql;
    let params;

    if (hasVisibilityColumn) {
      sql = `SELECT mf.id, mf.week_id, mf.file_name, mf.file_path, mf.file_size, mf.file_type, 
             mf.uploaded_by, mf.description, mf.views, mf.downloads, mf.is_pinned, mf.visibility, mf.created_at,
             u.name as uploader_name, u.matric as uploader_matric
             FROM module_files mf
             LEFT JOIN users u ON mf.uploaded_by = u.id
             WHERE mf.week_id = ?
             AND (
               mf.visibility = 'Public' 
               OR (mf.visibility = 'Private' AND mf.uploaded_by = ?)
               OR (mf.visibility = 'Admin Only' AND (mf.uploaded_by = ? OR ? = 1))
             )
             ORDER BY mf.is_pinned DESC, mf.created_at DESC`;
      params = [weekId, userId, userId, isAdmin ? 1 : 0];
    } else {
      sql = `SELECT mf.id, mf.week_id, mf.file_name, mf.file_path, mf.file_size, mf.file_type, 
             mf.uploaded_by, mf.description, mf.views, mf.downloads, mf.is_pinned, mf.created_at,
             u.name as uploader_name, u.matric as uploader_matric
             FROM module_files mf
             LEFT JOIN users u ON mf.uploaded_by = u.id
             WHERE mf.week_id = ?
             ORDER BY mf.is_pinned DESC, mf.created_at DESC`;
      params = [weekId];
    }

    const files = await query(sql, params);

    // Format files
    for (const file of files) {
      file.file_size_formatted = formatFileSize(file.file_size);
      if (!file.visibility) file.visibility = 'Public';
      file.category_path = await getCategoryPath(file.week_id);
    }

    res.json({
      success: true,
      files: files
    });
  } catch (error) {
    console.error('Get week files error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Upload module file
router.post('/files/upload', checkUserSession, upload.single('file'), async (req, res) => {
  try {
    const { week_id, description, visibility } = req.body;
    const userId = req.session.user_id;

    if (!week_id) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Week ID is required'
      });
    }

    const weekId = parseInt(week_id);

    // Verify week exists and is level 5
    const [weeks] = await query(
      'SELECT id, name, level FROM module_categories WHERE id = ? AND level = 5',
      [weekId]
    );

    if (weeks.length === 0) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid week. Only weeks (level 5) can have files.'
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded or upload error'
      });
    }

    const fileSize = req.file.size;
    const fileExt = path.extname(req.file.originalname).toLowerCase().substring(1);
    const fileName = req.file.filename;
    const filePath = `/uploads/modules/${weekId}/${fileName}`;
    const fileVisibility = visibility || 'Public';

    // Check if columns exist
    const [visibilityCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'visibility'");
    const hasVisibilityColumn = visibilityCheck.length > 0;

    const [pinnedCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'is_pinned'");
    const hasPinnedColumn = pinnedCheck.length > 0;

    let sql, params;

    if (hasPinnedColumn && hasVisibilityColumn) {
      sql = 'INSERT INTO module_files (week_id, file_name, file_path, file_size, file_type, uploaded_by, description, visibility, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)';
      params = [weekId, fileName, filePath, fileSize, fileExt, userId, description || '', fileVisibility];
    } else if (hasPinnedColumn) {
      sql = 'INSERT INTO module_files (week_id, file_name, file_path, file_size, file_type, uploaded_by, description, is_pinned) VALUES (?, ?, ?, ?, ?, ?, ?, 0)';
      params = [weekId, fileName, filePath, fileSize, fileExt, userId, description || ''];
    } else if (hasVisibilityColumn) {
      sql = 'INSERT INTO module_files (week_id, file_name, file_path, file_size, file_type, uploaded_by, description, visibility) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
      params = [weekId, fileName, filePath, fileSize, fileExt, userId, description || '', fileVisibility];
    } else {
      sql = 'INSERT INTO module_files (week_id, file_name, file_path, file_size, file_type, uploaded_by, description) VALUES (?, ?, ?, ?, ?, ?, ?)';
      params = [weekId, fileName, filePath, fileSize, fileExt, userId, description || ''];
    }

    const [result] = await query(sql, params);

    res.json({
      success: true,
      message: 'File uploaded successfully',
      file_id: result.insertId,
      file: {
        id: result.insertId,
        file_name: fileName,
        file_path: filePath,
        file_size: fileSize,
        file_type: fileExt
      }
    });
  } catch (error) {
    console.error('Upload file error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({
      success: false,
      message: 'Failed to upload file: ' + error.message
    });
  }
});

// Update module file
router.post('/files/update', checkUserSession, async (req, res) => {
  try {
    const { file_id, description, visibility } = req.body;
    const userId = req.session.user_id;
    const isAdmin = req.session.admin_id ? true : false;

    if (!file_id) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }

    const fileId = parseInt(file_id);

    // Validate visibility
    if (visibility && !['Public', 'Private', 'Admin Only'].includes(visibility)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid visibility setting'
      });
    }

    // Check if file exists
    const [files] = await query('SELECT id, uploaded_by FROM module_files WHERE id = ?', [fileId]);

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    // Check ownership
    if (files[0].uploaded_by !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You can only edit your own files.'
      });
    }

    // Check if columns exist
    const [visibilityCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'visibility'");
    const hasVisibilityColumn = visibilityCheck.length > 0;

    const [updatedCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'updated_at'");
    const hasUpdatedColumn = updatedCheck.length > 0;

    let sql, params;

    if (hasVisibilityColumn && hasUpdatedColumn) {
      sql = 'UPDATE module_files SET description = ?, visibility = ?, updated_at = NOW() WHERE id = ?';
      params = [description || '', visibility || 'Public', fileId];
    } else if (hasVisibilityColumn) {
      sql = 'UPDATE module_files SET description = ?, visibility = ? WHERE id = ?';
      params = [description || '', visibility || 'Public', fileId];
    } else if (hasUpdatedColumn) {
      sql = 'UPDATE module_files SET description = ?, updated_at = NOW() WHERE id = ?';
      params = [description || '', fileId];
    } else {
      sql = 'UPDATE module_files SET description = ? WHERE id = ?';
      params = [description || '', fileId];
    }

    await query(sql, params);

    res.json({
      success: true,
      message: 'File updated successfully'
    });
  } catch (error) {
    console.error('Update file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update file: ' + error.message
    });
  }
});

// Delete module file
router.delete('/files/:id', checkUserSession, async (req, res) => {
  try {
    const fileId = parseInt(req.params.id);
    const userId = req.session.user_id;
    const isAdmin = req.session.admin_id ? true : false;

    // Check if file exists
    const [files] = await query('SELECT id, file_path, uploaded_by FROM module_files WHERE id = ?', [fileId]);

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const file = files[0];

    // Check ownership
    if (file.uploaded_by !== userId && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own files'
      });
    }

    // Delete file from filesystem
    if (file.file_path) {
      const relativePath = file.file_path.replace('/uploads/', '');
      const fullPath = path.join(config.upload.dir, relativePath);
      if (fs.existsSync(fullPath)) {
        fs.unlinkSync(fullPath);
      }
    }

    // Delete from database
    await query('DELETE FROM module_files WHERE id = ?', [fileId]);

    res.json({
      success: true,
      message: 'File deleted successfully'
    });
  } catch (error) {
    console.error('Delete file error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete file: ' + error.message
    });
  }
});

// Toggle pin file (admin only)
router.post('/files/toggle-pin', checkAdminSession, async (req, res) => {
  try {
    const { file_id } = req.body;

    if (!file_id) {
      return res.status(400).json({
        success: false,
        message: 'File ID is required'
      });
    }

    const fileId = parseInt(file_id);

    // Check if is_pinned column exists
    const [pinnedCheck] = await query("SHOW COLUMNS FROM module_files LIKE 'is_pinned'");
    const hasPinnedColumn = pinnedCheck.length > 0;

    if (!hasPinnedColumn) {
      return res.status(400).json({
        success: false,
        message: 'Pin feature not available'
      });
    }

    // Get current pin status
    const [files] = await query('SELECT is_pinned FROM module_files WHERE id = ?', [fileId]);

    if (files.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'File not found'
      });
    }

    const newPinStatus = files[0].is_pinned ? 0 : 1;

    await query('UPDATE module_files SET is_pinned = ? WHERE id = ?', [newPinStatus, fileId]);

    res.json({
      success: true,
      message: 'File pin status updated',
      is_pinned: newPinStatus === 1
    });
  } catch (error) {
    console.error('Toggle pin error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle pin: ' + error.message
    });
  }
});

// Get my uploads
router.get('/files/my-uploads', checkUserSession, async (req, res) => {
  try {
    const userId = req.session.user_id;

    const files = await query(`
      SELECT mf.id, mf.week_id, mf.file_name, mf.file_path, mf.file_size, mf.file_type, 
             mf.description, mf.views, mf.downloads, mf.is_pinned, mf.visibility, mf.created_at,
             mc.name as week_name
      FROM module_files mf
      LEFT JOIN module_categories mc ON mf.week_id = mc.id
      WHERE mf.uploaded_by = ?
      ORDER BY mf.created_at DESC
    `, [userId]);

    // Format files
    for (const file of files) {
      file.file_size_formatted = formatFileSize(file.file_size);
      if (!file.visibility) file.visibility = 'Public';
      file.category_path = await getCategoryPath(file.week_id);
    }

    res.json({
      success: true,
      files: files
    });
  } catch (error) {
    console.error('Get my uploads error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router;

