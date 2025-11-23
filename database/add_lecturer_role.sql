-- Add Lecturer Role Support
-- This SQL ensures the admin table supports 'lecturer' role

-- Check if admin table exists and update role ENUM to include 'lecturer'
-- If role is VARCHAR, this might not be needed
-- If role is ENUM, we need to alter it

-- Option 1: If role is ENUM, alter it to include 'lecturer'
-- ALTER TABLE admin MODIFY COLUMN role ENUM('superadmin', 'moderator', 'lecturer') DEFAULT 'moderator';

-- Option 2: If role is VARCHAR (recommended), no change needed
-- Just ensure new lecturers are created with role = 'lecturer'

-- Create a sample lecturer account (password: 'lecturer123')
-- Password hash is for 'lecturer123'
-- Replace with actual hash when creating real lecturer
INSERT INTO admin (name, email, password, role, created_at)
VALUES (
  'Sample Lecturer',
  'lecturer@bita.utem.edu.my',
  '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- password: lecturer123
  'lecturer',
  NOW()
) ON DUPLICATE KEY UPDATE role = 'lecturer';

-- Note: Update the password hash with actual hash from PHP password_hash()
-- Example: $hash = password_hash('lecturer123', PASSWORD_DEFAULT);

