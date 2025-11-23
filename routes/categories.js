const express = require('express');
const router = express.Router();
const { query } = require('../db');
const { checkAdminSession } = require('../middleware/auth');

// Build tree structure
function buildTree(categories, parentId = null) {
  const tree = [];
  categories.forEach(category => {
    if (category.parent_id == parentId) {
      const children = buildTree(categories, category.id);
      if (children.length > 0) {
        category.children = children;
      }
      tree.push(category);
    }
  });
  return tree;
}

// Get all categories
router.get('/all', async (req, res) => {
  try {
    const categories = await query(
      'SELECT id, name, level, parent_id, description, display_order, created_at, updated_at FROM module_categories ORDER BY level ASC, parent_id ASC, display_order ASC, name ASC'
    );

    const tree = buildTree(categories);

    res.json({
      success: true,
      categories: categories,
      tree: tree
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get category by ID
router.get('/:id', async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    const [categories] = await query(
      'SELECT id, name, level, parent_id, description, display_order, created_at, updated_at FROM module_categories WHERE id = ?',
      [categoryId]
    );

    if (categories.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Category not found'
      });
    }

    res.json({
      success: true,
      category: categories[0]
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Create category (admin only)
router.post('/create', checkAdminSession, async (req, res) => {
  try {
    const { name, level, parent_id, description, display_order } = req.body;

    if (!name || level === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Name and level are required'
      });
    }

    const categoryLevel = parseInt(level);
    if (categoryLevel < 1 || categoryLevel > 5) {
      return res.status(400).json({
        success: false,
        message: 'Level must be between 1 and 5'
      });
    }

    const parentId = parent_id ? parseInt(parent_id) : null;

    // Validate parent exists if provided
    if (parentId) {
      const [parents] = await query('SELECT id, level FROM module_categories WHERE id = ?', [parentId]);
      if (parents.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Parent category not found'
        });
      }

      // Validate level is parent level + 1
      if (parents[0].level + 1 !== categoryLevel) {
        return res.status(400).json({
          success: false,
          message: 'Invalid level for this parent'
        });
      }
    }

    // Check for duplicate name at same level and parent
    if (parentId) {
      const [existing] = await query(
        'SELECT id FROM module_categories WHERE name = ? AND level = ? AND parent_id = ?',
        [name, categoryLevel, parentId]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists at this level'
        });
      }
    } else {
      const [existing] = await query(
        'SELECT id FROM module_categories WHERE name = ? AND level = ? AND parent_id IS NULL',
        [name, categoryLevel]
      );
      if (existing.length > 0) {
        return res.status(400).json({
          success: false,
          message: 'Category with this name already exists at this level'
        });
      }
    }

    const displayOrder = display_order ? parseInt(display_order) : 0;
    const adminId = req.admin.id;

    const [result] = await query(
      'INSERT INTO module_categories (name, level, parent_id, description, display_order, created_by) VALUES (?, ?, ?, ?, ?, ?)',
      [name, categoryLevel, parentId, description || null, displayOrder, adminId]
    );

    // TODO: Log admin action

    res.json({
      success: true,
      message: 'Category created successfully',
      category_id: result.insertId
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create category: ' + error.message
    });
  }
});

// Update category (admin only)
router.post('/update', checkAdminSession, async (req, res) => {
  try {
    const { category_id, name, description, display_order } = req.body;

    if (!category_id || !name) {
      return res.status(400).json({
        success: false,
        message: 'Category ID and name are required'
      });
    }

    const categoryId = parseInt(category_id);
    const displayOrder = display_order ? parseInt(display_order) : 0;

    await query(
      'UPDATE module_categories SET name = ?, description = ?, display_order = ?, updated_at = NOW() WHERE id = ?',
      [name, description || null, displayOrder, categoryId]
    );

    // TODO: Log admin action

    res.json({
      success: true,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update category: ' + error.message
    });
  }
});

// Delete category (admin only)
router.delete('/:id', checkAdminSession, async (req, res) => {
  try {
    const categoryId = parseInt(req.params.id);

    // Check if category has children
    const [children] = await query('SELECT id FROM module_categories WHERE parent_id = ?', [categoryId]);
    if (children.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with children. Please delete children first.'
      });
    }

    // Check if category has files
    const [files] = await query('SELECT id FROM module_files WHERE week_id = ?', [categoryId]);
    if (files.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete category with files. Please delete files first.'
      });
    }

    await query('DELETE FROM module_categories WHERE id = ?', [categoryId]);

    // TODO: Log admin action

    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete category: ' + error.message
    });
  }
});

module.exports = router;

