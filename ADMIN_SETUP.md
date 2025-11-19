# Admin Setup Guide

## Step 1: Create Admin Table

Make sure you have created the `admin` table in your database. Run this SQL in phpMyAdmin:

```sql
CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    session_token VARCHAR(255) DEFAULT NULL,
    last_login DATETIME DEFAULT NULL,
    role ENUM('superadmin','moderator') DEFAULT 'moderator',
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## Step 2: Setup XAMPP (IMPORTANT!)

**You MUST use XAMPP Apache to run PHP files!**

1. **Copy project to XAMPP htdocs:**
   - Copy semua file BITA project ke: `C:\xampp\htdocs\bita\`
   - Atau jika nak guna folder current, create symlink atau copy

2. **Start XAMPP:**
   - Open XAMPP Control Panel
   - Start **Apache** dan **MySQL**

3. **Access via XAMPP:**
   - URL: `http://localhost/bita/setup_admin.php`
   - (NOT `http://localhost:8080` - itu untuk static files sahaja)

## Step 3: Create Admin Account

You have **3 options** to create an admin account:

### Option 1: Using Setup Page (Recommended)

1. **Make sure XAMPP Apache is running**

2. Open your browser and go to:
   ```
   http://localhost/bita/setup_admin.php
   ```
   (Jika folder anda bukan `bita`, guna folder name anda)

2. Fill in the form:
   - **Admin Name**: Your name
   - **Email**: Admin email (e.g., admin@bita.utem.edu.my)
   - **Password**: Strong password (min 8 characters)
   - **Confirm Password**: Same password
   - **Role**: Choose `superadmin` or `moderator`

3. Click "Create Admin Account"

4. **IMPORTANT**: Delete `setup_admin.php` file after creating admin for security!

### Option 2: Using SQL (Manual)

1. Generate password hash using PHP:
   ```php
   <?php
   echo password_hash('your_password_here', PASSWORD_DEFAULT);
   ?>
   ```

2. Run this SQL in phpMyAdmin:
   ```sql
   INSERT INTO admin (name, email, password, role) 
   VALUES (
       'Admin Name',
       'admin@bita.utem.edu.my',
       'PASTE_HASHED_PASSWORD_HERE',
       'superadmin'
   );
   ```

### Option 3: Using PHP Script

Create a temporary file `create_admin.php`:

```php
<?php
require_once 'config.php';

$name = 'Admin Name';
$email = 'admin@bita.utem.edu.my';
$password = 'your_password_here';
$role = 'superadmin';

$hashedPassword = password_hash($password, PASSWORD_DEFAULT);

$conn = getDBConnection();
$stmt = $conn->prepare("INSERT INTO admin (name, email, password, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $hashedPassword, $role);

if ($stmt->execute()) {
    echo "Admin created successfully!";
} else {
    echo "Error: " . $stmt->error;
}

$stmt->close();
$conn->close();
?>
```

Run it once, then delete the file.

## Step 4: Login to Admin Panel

1. **Make sure XAMPP Apache is running**

2. Go to: `http://localhost/bita/admin/login.html`
   (Guna XAMPP, bukan npm server!)
2. Enter your admin email and password
3. You'll be redirected to the admin dashboard

## Admin Dashboard Features

- **View Pending Registrations**: See all users waiting for approval
- **View Matric Cards**: Click "View Card" to see uploaded matric card images
- **Approve Users**: Approve user registration (sets `is_verified = 1`)
- **Reject Users**: Reject and remove user registration
- **Statistics**: View pending count and total approved users

## Security Notes

1. **Delete setup files** after creating admin:
   - `setup_admin.php` (if used)
   - Any temporary `create_admin.php` files

2. **Use strong passwords** for admin accounts

3. **Limit admin access** - only trusted personnel should have admin accounts

4. **Regular backups** - backup your database regularly

## Troubleshooting

### "Admin table does not exist"
- Make sure you've run the CREATE TABLE SQL for the `admin` table

### "Email already exists"
- The email is already registered. Use a different email or login with existing account

### "Cannot login"
- Check if email and password are correct
- Make sure the admin account exists in the database
- Check browser console for errors

### "Unauthorized" error
- Your session may have expired. Logout and login again
- Make sure you're accessing admin pages from the correct URL

