# XAMPP Setup Guide untuk BITA Website

## Langkah 1: Install XAMPP

1. Download XAMPP dari: https://www.apachefriends.org/
2. Install XAMPP (pilih Apache dan MySQL)
3. Start XAMPP Control Panel

## Langkah 2: Setup Database

1. Buka XAMPP Control Panel
2. Start **Apache** dan **MySQL**
3. Buka phpMyAdmin: `http://localhost/phpmyadmin`
4. Buat database baru:
   - Klik "New"
   - Nama database: `bita_db`
   - Collation: `utf8mb4_general_ci`
   - Klik "Create"
5. Import SQL schema (lihat `DATABASE_SETUP.md`)

## Langkah 3: Letak File Website

1. Copy semua file BITA website ke folder:
   ```
   C:\xampp\htdocs\bita\
   ```

2. Struktur folder:
   ```
   C:\xampp\htdocs\bita\
   ├── index.html
   ├── register.html
   ├── login.html
   ├── dashboard.html
   ├── alumni.html
   ├── members.html
   ├── modules.html
   ├── about.html
   ├── contact-admin.html
   ├── config.php
   ├── api/
   │   ├── register.php
   │   ├── login.php
   │   ├── logout.php
   │   ├── get_user.php
   │   ├── get_alumni.php
   │   ├── get_members.php
   │   ├── contact_admin.php
   │   ├── get_modules.php
   │   └── check_session.php
   ├── styles.css
   ├── script.js
   └── ... (file-file lain)
   ```

## Langkah 4: Konfigurasi Database

1. Buka file `config.php`
2. Pastikan setting betul:
   ```php
   define('DB_HOST', 'localhost');
   define('DB_USER', 'root');
   define('DB_PASS', ''); // Kosong untuk XAMPP default
   define('DB_NAME', 'bita_db');
   ```

3. Jika anda ubah password MySQL, update `DB_PASS`

## Langkah 5: Test Website

1. Pastikan Apache dan MySQL running di XAMPP
2. Buka browser: `http://localhost/bita`
3. Test registration dan login

## Troubleshooting

### Apache tidak start
- Check port 80 tidak digunakan aplikasi lain
- Tukar port di XAMPP Control Panel → Config → Apache → httpd.conf
- Cari `Listen 80` tukar ke `Listen 8080`
- Akses: `http://localhost:8080/bita`

### MySQL tidak start
- Check port 3306 tidak digunakan
- Restart XAMPP
- Check error log di XAMPP Control Panel

### Database connection error
- Pastikan MySQL running
- Check database `bita_db` wujud
- Verify username/password di `config.php`

### PHP error
- Pastikan PHP enabled di Apache
- Check PHP version (perlu PHP 7.0 atau lebih tinggi)
- Check error log: `C:\xampp\apache\logs\error.log`

### File tidak load
- Check file path betul
- Pastikan file dalam folder `htdocs/bita`
- Check file permissions

## URL Akses

- Homepage: `http://localhost/bita/`
- Register: `http://localhost/bita/register.html`
- Login: `http://localhost/bita/login.html`
- Dashboard: `http://localhost/bita/dashboard.html`
- Alumni: `http://localhost/bita/alumni.html`
- Members: `http://localhost/bita/members.html`
- Modules: `http://localhost/bita/modules.html`

## Tips

1. **Backup Database**: Sentiasa backup database sebelum buat perubahan
2. **Error Log**: Check error log jika ada masalah
3. **phpMyAdmin**: Gunakan untuk manage database dengan mudah
4. **File Permissions**: Pastikan PHP boleh write ke folder jika perlu

## Production Deployment

Untuk production:
1. Guna web hosting dengan PHP dan MySQL
2. Upload semua file ke server
3. Import database ke server
4. Update `config.php` dengan database credentials server
5. Setup domain name

## Support

Jika ada masalah:
1. Check XAMPP error logs
2. Check browser console (F12)
3. Verify database connection
4. Check file paths

