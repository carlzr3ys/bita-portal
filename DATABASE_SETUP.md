# Database Setup Guide - BITA Website

## Prerequisites
- XAMPP installed and running
- MySQL service started in XAMPP Control Panel

## Step 1: Create Database

1. Open phpMyAdmin: `http://localhost/phpmyadmin`
2. Click "New" to create a new database
3. Database name: `bita_db`
4. Collation: `utf8mb4_general_ci`
5. Click "Create"

## Step 2: Import SQL Schema

1. In phpMyAdmin, select the `bita_db` database
2. Click on "SQL" tab
3. Copy and paste the following SQL:

```sql
-- 1. Users Table
-- Stores registered BITA students
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    matric VARCHAR(20) NOT NULL UNIQUE,
    email VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    program VARCHAR(50) NOT NULL,
    verified_by_card BOOLEAN DEFAULT FALSE,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Admin Contact Requests
-- Stores requests if OCR fails or student cannot register
CREATE TABLE admin_contact_requests (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    matric VARCHAR(20) NOT NULL,
    phone VARCHAR(20),
    message TEXT,
    status ENUM('Pending','Resolved') DEFAULT 'Pending',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    resolved_at DATETIME NULL
);

-- 3. BITA Members Table
-- Stores current BITA students info
CREATE TABLE bita_members (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    matric VARCHAR(20) NOT NULL UNIQUE,
    year INT,
    batch VARCHAR(20),
    phone VARCHAR(20),
    email VARCHAR(50),
    bio TEXT,
    description TEXT,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    tiktok VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 4. Alumni Table
-- Stores alumni info
CREATE TABLE alumni (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    matric VARCHAR(20) NOT NULL UNIQUE,
    batch VARCHAR(20),
    current_company VARCHAR(100),
    bio TEXT,
    description TEXT,
    instagram VARCHAR(255),
    facebook VARCHAR(255),
    twitter VARCHAR(255),
    linkedin VARCHAR(255),
    tiktok VARCHAR(255),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. Modules / Tutorials Table
-- Stores course content for BITA, with categories, files, tracking
CREATE TABLE modules (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    year INT, -- Year of study
    semester INT, -- Semester
    subject VARCHAR(100), -- Subject name
    category VARCHAR(50), -- Category for sorting/filtering
    file_url VARCHAR(255), -- File path (PDF, Word, etc.)
    file_type VARCHAR(20), -- Optional: "pdf", "docx", etc.
    views INT DEFAULT 0, -- Track views count
    downloads INT DEFAULT 0, -- Track downloads count
    uploaded_by INT, -- Reference to users.id who uploaded
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (uploaded_by) REFERENCES users(id)
);
```

4. Click "Go" to execute

## Step 3: Configure Database Connection

1. Open `config.php` file
2. Verify database settings:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Default XAMPP password is empty
   define('DB_NAME', 'bita_db');
   ```

3. If you changed MySQL root password, update `DB_PASS` in `config.php`

## Step 4: Test Connection

1. Start Apache and MySQL in XAMPP Control Panel
2. Place project files in `htdocs/bita` folder
3. Open browser: `http://localhost/bita`
4. Try registering a new user to test database connection

## Step 5: Add Sample Data (Optional)

### Add Sample Alumni:
```sql
INSERT INTO alumni (name, matric, batch, current_company, bio) VALUES
('John Doe', 'BIT123456', '2023', 'Cloud Engineer at Tech Corp', 'Graduated with honors'),
('Jane Smith', 'BIT123457', '2023', 'DevOps Specialist at Cloud Solutions', 'Passionate about cloud computing');
```

### Add Sample Members:
```sql
INSERT INTO bita_members (name, matric, year, batch) VALUES
('Sarah Johnson', 'BIT2024001', 2, '2024'),
('Michael Chen', 'BIT2024002', 2, '2024'),
('Fatimah Abdullah', 'BIT2024003', 3, '2023');
```

### Add Sample Modules:
```sql
INSERT INTO modules (title, slug, year, semester, subject, category) VALUES
('Cloud Computing Fundamentals', 'cloud-fundamentals', 2, 1, 'Cloud Computing', 'Fundamentals'),
('AWS Services Overview', 'aws-services', 2, 2, 'Cloud Computing', 'Services'),
('Linux Basics', 'linux-basics', 1, 2, 'Operating Systems', 'Linux');
```

## Troubleshooting

### Error: "Connection failed"
- Check if MySQL is running in XAMPP
- Verify database name is `bita_db`
- Check username/password in `config.php`

### Error: "Table doesn't exist"
- Make sure you ran all SQL CREATE TABLE statements
- Check if database `bita_db` is selected

### Error: "Access denied"
- Check MySQL username/password
- Default XAMPP: username `root`, password empty

### Error: "Duplicate entry"
- Email or matric number already exists
- Use different values or delete existing record

## Database Structure Overview

### Tables:
1. **users** - Registered BITA students
2. **admin_contact_requests** - Manual verification requests
3. **bita_members** - Current BITA students
4. **alumni** - Graduated BITA students
5. **modules** - Course content and tutorials

## Security Notes

- Never commit `config.php` with real passwords to version control
- Use strong passwords for production
- Regularly backup database
- Use prepared statements (already implemented in API)

## Backup Database

1. In phpMyAdmin, select `bita_db`
2. Click "Export" tab
3. Choose "Quick" or "Custom" method
4. Click "Go" to download SQL file

## Restore Database

1. In phpMyAdmin, select `bita_db`
2. Click "Import" tab
3. Choose SQL file
4. Click "Go" to import

