-- ============================================
-- Admin Contact Requests Table
-- ============================================
-- Stores user problems/requests submitted through Contact Admin form
-- Used for: Users can submit problems/questions to admin
-- Table: admin_contact_requests
-- ============================================

-- Drop table if exists (for recreation)
DROP TABLE IF EXISTS admin_contact_requests;

-- Create table
CREATE TABLE admin_contact_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL COMMENT 'Full name from users table',
    matric VARCHAR(20) NOT NULL COMMENT 'Matric number from users table',
    phone VARCHAR(20) NULL COMMENT 'Phone number (optional)',
    message TEXT NOT NULL COMMENT 'Problem/question message',
    status ENUM('Pending','Resolved') DEFAULT 'Pending' COMMENT 'Request status',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT 'When request was submitted',
    resolved_at DATETIME NULL COMMENT 'When request was resolved',
    INDEX idx_status (status),
    INDEX idx_matric (matric),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- ============================================
-- Usage:
-- ============================================
-- 1. Users submit requests via Contact Admin form
-- 2. Admin can view all requests in Admin Dashboard > User Problems tab
-- 3. Admin can mark requests as 'Resolved'
-- 
-- Example INSERT:
-- INSERT INTO admin_contact_requests (name, matric, phone, message, status) 
-- VALUES ('John Doe', 'B032410001', '0123456789', 'I need help with my account', 'Pending');
-- 
-- Example UPDATE (Mark as Resolved):
-- UPDATE admin_contact_requests 
-- SET status = 'Resolved', resolved_at = NOW() 
-- WHERE id = 1;
-- ============================================
