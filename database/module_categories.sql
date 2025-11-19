-- Module Categories Table
-- Hierarchical structure: Category > Subcategory > Subject > Type > Week
CREATE TABLE IF NOT EXISTS module_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    level INT NOT NULL, -- 1=Category, 2=Subcategory, 3=Subject, 4=Type, 5=Week
    parent_id INT NULL, -- Reference to parent category
    description TEXT,
    display_order INT DEFAULT 0, -- For ordering within same level and parent
    created_by INT NULL, -- Admin who created it (nullable)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (parent_id) REFERENCES module_categories(id) ON DELETE CASCADE,
    INDEX idx_parent_level (parent_id, level),
    INDEX idx_level (level),
    INDEX idx_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Add foreign key for created_by if admins table exists (optional)
-- This will only work if admins table exists
-- If admins table doesn't exist, created_by will just be an integer reference

-- Module Files Table
-- Stores uploaded files in weeks (level 5)
CREATE TABLE IF NOT EXISTS module_files (
    id INT AUTO_INCREMENT PRIMARY KEY,
    week_id INT NOT NULL, -- Reference to module_categories where level=5
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT, -- Size in bytes
    file_type VARCHAR(50), -- pdf, docx, pptx, etc.
    uploaded_by INT NOT NULL, -- User who uploaded
    description TEXT,
    views INT DEFAULT 0,
    downloads INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (week_id) REFERENCES module_categories(id) ON DELETE CASCADE,
    FOREIGN KEY (uploaded_by) REFERENCES users(id),
    INDEX idx_week_id (week_id),
    INDEX idx_uploaded_by (uploaded_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

