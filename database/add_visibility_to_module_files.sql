-- Add visibility column to module_files table
-- Visibility options: 'Public', 'Private', 'Admin Only'

ALTER TABLE module_files 
ADD COLUMN visibility ENUM('Public', 'Private', 'Admin Only') DEFAULT 'Public' NOT NULL AFTER description,
ADD INDEX idx_visibility (visibility);

-- Update existing files to have Public visibility by default
UPDATE module_files SET visibility = 'Public' WHERE visibility IS NULL;

