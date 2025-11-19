# 🚀 Panduan Lengkap Publish Website BITA

Panduan step-by-step untuk publish website BITA dengan **FreeMySQLDatabase** untuk MySQL hosting.

---

## 📋 Senarai Kandungan

1. [Persediaan](#persediaan)
2. [Setup MySQL di FreeMySQLDatabase](#setup-mysql-di-freemysqldatabase)
3. [Export & Import Database](#export--import-database)
4. [Setup Frontend (React) - Netlify](#setup-frontend-react---netlify)
5. [Setup Backend (PHP) - Koyeb/InfinityFree](#setup-backend-php---koyebinfinityfree)
6. [Configure Environment Variables](#configure-environment-variables)
7. [Update Config Files](#update-config-files)
8. [Upload Files](#upload-files)
9. [Testing](#testing)
10. [Troubleshooting](#troubleshooting)

---

## 1. Persediaan

### Checklist sebelum publish:

- [ ] Website berfungsi di localhost
- [ ] Semua features tested
- [ ] Database structure complete
- [ ] File uploads folder ready
- [ ] Build React app untuk production

### Tools yang diperlukan:

- **FreeMySQLDatabase Account** - https://www.freemysqldatabase.com/
- **Netlify Account** (Frontend) - https://www.netlify.com/ (FREE)
- **Koyeb Account** (Backend PHP) - https://www.koyeb.com/ (FREE tier available)
- **ATAU InfinityFree** (Backend PHP) - https://www.infinityfree.com/ (FREE)
- **FTP Client** (untuk upload files) - FileZilla atau WinSCP
- **phpMyAdmin** atau MySQL Workbench (untuk database)

---

## 2. Setup MySQL di FreeMySQLDatabase

### Step 1: Daftar Account

1. Pergi ke **https://www.freemysqldatabase.com/**
2. Click **"Sign Up"** atau **"Register"**
3. Isi form registration:
   - Email
   - Password
   - Verify email

### Step 2: Create Database

1. Login ke FreeMySQLDatabase dashboard
2. Click **"Create Database"** atau **"New Database"**
3. Isi details:
   - **Database Name**: `bita_db` (atau nama lain)
   - **Username**: auto-generated (atau pilih sendiri)
   - **Password**: auto-generated (SAVE INI!)
   - **Host**: Copy host address (biasanya `sqlXXX.freemysqldatabase.com`)
   - **Port**: Biasanya `3306`

### Step 3: Save Database Credentials

**⚠️ PENTING: Save semua credentials ni!**

```
Host: sqlXXX.freemysqldatabase.com
Port: 3306
Database: bita_db
Username: [your_username]
Password: [your_password]
```

Simpan dalam file atau password manager yang selamat.

---

## 3. Export & Import Database

### Step 1: Export Database dari Localhost (XAMPP)

1. Buka **phpMyAdmin**: `http://localhost/phpmyadmin`
2. Pilih database **`bita_db`**
3. Click tab **"Export"**
4. Pilih **"Quick"** method
5. Format: **SQL**
6. Click **"Go"** untuk download file SQL

### Step 2: Import ke FreeMySQLDatabase

**Cara 1: Menggunakan phpMyAdmin (jika ada)**

1. Login ke FreeMySQLDatabase dashboard
2. Buka **phpMyAdmin** link (jika available)
3. Select database anda
4. Click tab **"Import"**
5. Choose file SQL yang di-export tadi
6. Click **"Go"**

**Cara 2: Menggunakan MySQL Command Line**

```bash
mysql -h sqlXXX.freemysqldatabase.com -u [username] -p [database_name] < bita_db.sql
```

**Cara 3: Menggunakan MySQL Workbench**

1. Open MySQL Workbench
2. Create new connection dengan credentials dari FreeMySQLDatabase
3. Connect
4. Open SQL file: File → Run SQL Script
5. Select file `bita_db.sql`
6. Execute

### Step 3: Verify Import

1. Check semua tables ada:
   - `users`
   - `admins`
   - `module_categories`
   - `module_files`
   - `admin_contact_requests`
   - etc.

---

## 4. Setup Frontend (React) - Netlify

### Step 1: Build React App

```bash
# Di terminal, navigate ke project folder
cd C:\xampp\htdocs\bita

# Install dependencies (jika belum)
npm install

# Build untuk production
npm run build
```

Build akan create folder `dist/` dengan semua static files.

### Step 2: Update vite.config.js untuk Production

Pastikan `vite.config.js` ada base path:

```javascript
export default defineConfig({
  plugins: [react()],
  base: '/', // Atau base path untuk subdomain
  build: {
    outDir: 'dist',
    emptyOutDir: true
  }
})
```

### Step 3: Deploy ke Netlify

**Cara 1: Drag & Drop (Paling Mudah)**

1. Pergi ke **https://app.netlify.com/**
2. Login dengan GitHub/Email
3. Click **"Add new site"** → **"Deploy manually"**
4. Drag folder `dist/` ke Netlify
5. Tunggu deploy selesai
6. Netlify akan provide URL: `https://random-name-123.netlify.app`

**Cara 2: Git Integration (Recommended)**

1. Push code ke GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/[username]/bita-website.git
   git push -u origin main
   ```

2. Di Netlify:
   - Click **"Add new site"** → **"Import an existing project"**
   - Connect GitHub account
   - Select repository
   - Build settings:
     - **Build command**: `npm run build`
     - **Publish directory**: `dist`
   - Click **"Deploy site"**

### Step 4: Configure Environment Variables (Netlify)

1. Di Netlify dashboard → Site settings
2. Go to **"Environment variables"**
3. Add variables:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

### Step 5: Create _redirects file

Create file `public/_redirects` (atau `dist/_redirects`):

```
/*    /index.html   200
```

Ini untuk React Router support.

---

## 5. Setup Backend (PHP) - Koyeb/InfinityFree

### Option A: Koyeb (Recommended - Modern)

#### Step 1: Daftar Account

1. Pergi ke **https://www.koyeb.com/**
2. Click **"Get Started"**
3. Login dengan GitHub (recommended)

#### Step 2: Prepare PHP Backend

1. Create file `index.php` di root backend folder:
   ```php
   <?php
   // Simple health check
   echo json_encode(['status' => 'ok', 'message' => 'BITA API Server']);
   ?>
   ```

2. Create `Procfile` (jika belum ada):
   ```
   web: vendor/bin/heroku-php-apache2
   ```

#### Step 3: Deploy ke Koyeb

**Cara 1: Via Git**

1. Di Koyeb dashboard → **"Create App"**
2. Select **"GitHub"** sebagai source
3. Select repository
4. Runtime: **PHP**
5. Build command: (kosongkan)
6. Run command: (kosongkan)
7. Click **"Deploy"**

**Cara 2: Via Koyeb CLI**

```bash
# Install Koyeb CLI
# Windows: Download dari website
# Mac/Linux: curl -fsSL https://koyeb.com/cli.sh | sh

# Login
koyeb login

# Deploy
cd api
koyeb apps create bita-api
koyeb services create \
  --app bita-api \
  --type web \
  --git koyeb/bita-website \
  --git-branch main \
  --git-build-command "" \
  --git-run-command ""
```

#### Step 4: Configure Environment Variables (Koyeb)

1. Di Koyeb dashboard → App → Settings
2. Go to **"Environment variables"**
3. Add:
   ```
   DB_HOST=sqlXXX.freemysqldatabase.com
   DB_USER=your_username
   DB_PASS=your_password
   DB_NAME=bita_db
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=bitaadm2425@gmail.com
   SMTP_PASS=your_app_password
   ```

### Option B: InfinityFree (Alternative - Traditional Hosting)

#### Step 1: Daftar Account

1. Pergi ke **https://www.infinityfree.com/**
2. Click **"Sign Up"**
3. Isi form registration

#### Step 2: Create Website

1. Login ke InfinityFree control panel
2. Click **"Create Account"**
3. Isi details:
   - **Domain**: Pilih free domain (atau use custom)
   - **Plan**: Free
   - **PHP Version**: 8.0 atau terbaru

#### Step 3: Upload Files via FTP

1. Download FTP credentials dari InfinityFree panel:
   - **FTP Host**: `ftp.xxx.infinityfreeapp.com`
   - **FTP Username**: [your_username]
   - **FTP Password**: [your_password]

2. Connect dengan FileZilla/WinSCP:
   - Host: `ftp.xxx.infinityfreeapp.com`
   - Username: [your_username]
   - Password: [your_password]
   - Port: 21

3. Upload semua files dari folder `api/` ke `htdocs/` atau `public_html/`

---

## 6. Configure Environment Variables

### Update config.php

Update `config.php` untuk guna environment variables:

```php
<?php
// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'sqlXXX.freemysqldatabase.com');
define('DB_USER', getenv('DB_USER') ?: 'your_username');
define('DB_PASS', getenv('DB_PASS') ?: 'your_password');
define('DB_NAME', getenv('DB_NAME') ?: 'bita_db');

// SMTP Configuration
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 587);
define('SMTP_USER', getenv('SMTP_USER') ?: 'bitaadm2425@gmail.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: 'your_app_password');
?>
```

### For Koyeb

Set environment variables di Koyeb dashboard:
- `DB_HOST`
- `DB_USER`
- `DB_PASS`
- `DB_NAME`
- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`

### For InfinityFree

Create file `.htaccess` atau update `config.php` dengan direct values (kurang secure tapi work).

---

## 7. Update Config Files

### Update CORS (api/cors.php)

```php
<?php
// Update allowed origins
$allowed_origins = [
    'https://your-netlify-site.netlify.app',
    'https://your-custom-domain.com'
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';

if (in_array($origin, $allowed_origins)) {
    header("Access-Control-Allow-Origin: $origin");
}

header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Access-Control-Allow-Credentials: true');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}
?>
```

### Update React App API URL

Create file `.env.production`:

```
VITE_API_URL=https://your-backend-url.com/api
```

Atau update di `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  define: {
    'import.meta.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'https://your-backend-url.com/api')
  }
})
```

---

## 8. Upload Files

### Create uploads Folder

1. Di backend hosting (Koyeb/InfinityFree):
   - Create folder `uploads/`
   - Create subfolder `uploads/matric_cards/`
   - Create subfolder `uploads/module_files/`

2. Set permissions:
   ```bash
   chmod 755 uploads
   chmod 755 uploads/matric_cards
   chmod 755 uploads/module_files
   ```

### For InfinityFree (via FTP)

1. Connect dengan FileZilla
2. Navigate ke `htdocs/`
3. Create folder `uploads/`
4. Create subfolders

### For Koyeb (via Git)

1. Add folder `uploads/` to Git (dengan `.gitkeep` file)
2. Push ke repository
3. Set permissions via Koyeb console (jika available)

---

## 9. Testing

### Test Checklist:

1. **Frontend (Netlify)**:
   - [ ] Website load dengan betul
   - [ ] React Router working
   - [ ] All pages accessible
   - [ ] Images load
   - [ ] CSS working

2. **Backend API**:
   - [ ] Test: `https://your-backend.com/api/test_backend.php`
   - [ ] Should return: `{"status":"ok"}`
   - [ ] Database connection working

3. **Database**:
   - [ ] Can connect via phpMyAdmin
   - [ ] Can query data
   - [ ] Tables exist

4. **Authentication**:
   - [ ] Login working
   - [ ] Registration working
   - [ ] Session management working

5. **File Upload**:
   - [ ] Can upload matric card
   - [ ] Can upload module files
   - [ ] Files saved correctly

6. **Email**:
   - [ ] Can send registration approval email
   - [ ] Can send rejection email

---

## 10. Troubleshooting

### Issue: CORS Error

**Solution:**
1. Check `api/cors.php` allowed origins
2. Update dengan correct frontend URL
3. Ensure `Access-Control-Allow-Credentials: true`

### Issue: Database Connection Failed

**Solution:**
1. Verify credentials di FreeMySQLDatabase
2. Check `DB_HOST`, `DB_USER`, `DB_PASS`, `DB_NAME`
3. Test connection via MySQL client
4. Check firewall rules (biasanya port 3306)

### Issue: File Upload Not Working

**Solution:**
1. Check folder permissions (`chmod 755 uploads/`)
2. Check `uploads_max_filesize` di php.ini
3. Verify folder exists di server
4. Check error logs

### Issue: Session Not Working

**Solution:**
1. Check `session.save_path` di php.ini
2. Ensure cookies enabled di browser
3. Check CORS credentials setting
4. Verify session storage available

### Issue: Environment Variables Not Loading

**Solution:**
1. Verify environment variables set correctly
2. Check variable names (case-sensitive)
3. Restart application after setting variables
4. Check logs for errors

---

## 📝 Quick Reference

### FreeMySQLDatabase
- Website: https://www.freemysqldatabase.com/
- Support: Email support
- Free tier: Yes (with limitations)

### Netlify (Frontend)
- Website: https://www.netlify.com/
- Free tier: Yes
- Custom domain: Yes
- SSL: Automatic

### Koyeb (Backend)
- Website: https://www.koyeb.com/
- Free tier: Yes (with limitations)
- Git integration: Yes
- Auto SSL: Yes

### InfinityFree (Backend Alternative)
- Website: https://www.infinityfree.com/
- Free tier: Yes
- PHP: Yes (up to 8.0)
- FTP: Yes

---

## 🎉 Selamat Publish!

Sekarang website anda sudah live! Jangan lupa:

1. ✅ Test semua features
2. ✅ Monitor error logs
3. ✅ Backup database regularly
4. ✅ Update security patches
5. ✅ Monitor performance

---

## 📞 Support

Jika ada masalah:
1. Check error logs
2. Verify all configurations
3. Test each component separately
4. Check documentation for each service

**Good luck! 🚀**

