-- Add upload_allowed column to module_files table
-- This column allows lecturers to control which files users can upload

ALTER TABLE module_files
ADD COLUMN upload_allowed TINYINT(1) DEFAULT 1 COMMENT 'Allow users to upload this file type (1 = allowed, 0 = not allowed)';

-- Set default to 1 (allowed) for existing files
UPDATE module_files SET upload_allowed = 1 WHERE upload_allowed IS NULL;

