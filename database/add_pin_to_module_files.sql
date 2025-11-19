-- Add is_pinned column to module_files table
-- Pinned files will appear at the top of the list

ALTER TABLE module_files 
ADD COLUMN is_pinned TINYINT(1) DEFAULT 0 NOT NULL AFTER downloads,
ADD INDEX idx_is_pinned (is_pinned);

-- Update existing files to have is_pinned = 0 (not pinned)
UPDATE module_files SET is_pinned = 0 WHERE is_pinned IS NULL;

