# 📊 Setup FreeMySQLDatabase - Step by Step

Panduan lengkap untuk setup MySQL di FreeMySQLDatabase.com

---

## 🌐 Website

**FreeMySQLDatabase**: https://www.freemysqldatabase.com/

---

## 📝 Step 1: Daftar Account

1. Pergi ke: https://www.freemysqldatabase.com/
2. Click **"Sign Up"** atau **"Create Account"**
3. Isi form:
   - **Email**: Your email address
   - **Password**: Strong password (min 8 characters)
   - **Confirm Password**: Re-enter password
4. Verify email (check inbox)
5. Login ke dashboard

---

## 🗄️ Step 2: Create Database

1. **Login** ke FreeMySQLDatabase dashboard
2. Click **"Create Database"** atau **"New Database"** button
3. Isi details:

   ```
   Database Name:    bita_db
   Username:         bita_user (auto-generated atau pilih sendiri)
   Password:         [auto-generated - SAVE INI!]
   Host:             sqlXXX.freemysqldatabase.com (copy ni)
   Port:             3306 (standard MySQL port)
   ```

4. Click **"Create"** atau **"Submit"**

### ⚠️ PENTING: Save Credentials!

Simpan semua info ni dalam file selamat:

```
Host:     sqlXXX.freemysqldatabase.com
Port:     3306
Database: bita_db
Username: bita_user
Password: xxxxxxxx
```

---

## 📤 Step 3: Export Database dari Localhost

### Menggunakan phpMyAdmin:

1. **Buka phpMyAdmin**: `http://localhost/phpmyadmin`
2. **Select database**: `bita_db` (left sidebar)
3. **Click tab "Export"**
4. **Method**: Pilih **"Quick"**
5. **Format**: **SQL**
6. **Click "Go"** untuk download

File akan download sebagai `bita_db.sql`

### Menggunakan Command Line:

```bash
# Windows (XAMPP)
C:\xampp\mysql\bin\mysqldump.exe -u root -p bita_db > bita_db.sql

# Mac/Linux
mysqldump -u root -p bita_db > bita_db.sql
```

---

## 📥 Step 4: Import ke FreeMySQLDatabase

### Method 1: Via phpMyAdmin (Jika Available)

1. Login ke FreeMySQLDatabase dashboard
2. Look for **"phpMyAdmin"** link atau button
3. Click untuk open phpMyAdmin
4. Select database anda (bita_db)
5. Click tab **"Import"**
6. **Choose File**: Select `bita_db.sql`
7. Click **"Go"** atau **"Import"**
8. Tunggu process selesai
9. Verify semua tables imported

### Method 2: Via MySQL Workbench

1. **Download MySQL Workbench**: https://dev.mysql.com/downloads/workbench/
2. **Create New Connection**:
   - **Connection Name**: FreeMySQLDatabase
   - **Hostname**: `sqlXXX.freemysqldatabase.com`
   - **Port**: `3306`
   - **Username**: [your_username]
   - **Password**: [your_password]
   - Click **"Test Connection"** (should work)
   - Click **"OK"**

3. **Connect** to database

4. **Import SQL File**:
   - Go to: **File** → **Run SQL Script**
   - Select file: `bita_db.sql`
   - Click **"Run"** atau press `Ctrl+Shift+Enter`
   - Tunggu import selesai

5. **Verify**:
   - Refresh database
   - Check semua tables ada:
     - `users`
     - `admins`
     - `module_categories`
     - `module_files`
     - `admin_contact_requests`
     - etc.

### Method 3: Via Command Line

```bash
mysql -h sqlXXX.freemysqldatabase.com -u [username] -p [database_name] < bita_db.sql
```

Masukkan password bila diminta.

---

## ✅ Step 5: Test Connection

### Via MySQL Workbench:

1. Open connection
2. Run query:
   ```sql
   SELECT COUNT(*) FROM users;
   ```
3. Should return number of users

### Via PHP Script:

Create file `test_db_connection.php`:

```php
<?php
$host = 'sqlXXX.freemysqldatabase.com';
$user = 'your_username';
$pass = 'your_password';
$db = 'bita_db';

$conn = new mysqli($host, $user, $pass, $db);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

echo "Connected successfully!<br>";
echo "Database: " . $db . "<br>";

// Test query
$result = $conn->query("SELECT COUNT(*) as total FROM users");
$row = $result->fetch_assoc();
echo "Total users: " . $row['total'];

$conn->close();
?>
```

Upload ke backend hosting dan test.

---

## 🔐 Step 6: Update config.php

Update `config.php` dengan credentials dari FreeMySQLDatabase:

```php
<?php
// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'sqlXXX.freemysqldatabase.com');
define('DB_USER', getenv('DB_USER') ?: 'your_username');
define('DB_PASS', getenv('DB_PASS') ?: 'your_password');
define('DB_NAME', getenv('DB_NAME') ?: 'bita_db');
?>
```

**Untuk Production:**
- Gunakan environment variables (Koyeb/InfinityFree)
- Jangan hardcode credentials dalam code

---

## 📋 FreeMySQLDatabase Limitations (Free Tier)

Be aware of these limitations:

- **Database Size**: Limited (check current limits)
- **Connections**: Limited concurrent connections
- **Backup**: Manual backup only (export SQL)
- **Support**: Email support (community support)

**Recommendation:**
- Regular backups (export SQL monthly)
- Monitor database size
- Optimize database (remove unused data)

---

## 🔄 Regular Backups

### Manual Backup (Recommended):

1. **Via phpMyAdmin**:
   - Select database
   - Export → Quick → SQL
   - Download file

2. **Via MySQL Workbench**:
   - Right-click database → **"Dump Database to SQL File"**
   - Save file

3. **Via Command Line**:
   ```bash
   mysqldump -h sqlXXX.freemysqldatabase.com -u [user] -p [db] > backup_$(date +%Y%m%d).sql
   ```

**Schedule**: Backup monthly atau sebelum major updates.

---

## 🆘 Troubleshooting

### Issue: Cannot Connect

**Solution:**
1. Verify `Host`, `Port`, `Username`, `Password`
2. Check firewall (port 3306 should be open)
3. Try connecting via MySQL Workbench first
4. Check FreeMySQLDatabase status page

### Issue: Import Failed

**Solution:**
1. Check file size (might be too large)
2. Split large SQL file into smaller chunks
3. Check SQL syntax errors
4. Verify database exists
5. Try importing via MySQL Workbench

### Issue: Connection Timeout

**Solution:**
1. Check internet connection
2. Verify host address correct
3. Try different MySQL client
4. Contact FreeMySQLDatabase support

---

## 📞 Support

**FreeMySQLDatabase Support:**
- Email: Check website for support email
- Documentation: Check website docs
- Community: Check forums

---

## ✅ Checklist

- [ ] Account created
- [ ] Database created
- [ ] Credentials saved securely
- [ ] Database exported from localhost
- [ ] Database imported to FreeMySQLDatabase
- [ ] Connection tested
- [ ] All tables verified
- [ ] config.php updated
- [ ] Backup strategy planned

---

**Done! Database ready untuk production! 🎉**

