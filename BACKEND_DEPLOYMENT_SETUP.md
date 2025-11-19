# 🚀 Backend Deployment Setup untuk Koyeb

Panduan setup backend repo untuk deploy ke Koyeb dengan structure files di root.

---

## 📋 Current Situation

### Backend Repo Structure (GitHub):
```
bita-backend/
├── login.php              ← Di ROOT
├── register.php           ← Di ROOT
├── check_session.php      ← Di ROOT
├── index.php              ← Di ROOT
├── config.php             ← Di ROOT (atau perlu create)
├── phpmailer/
└── ... (semua PHP files di root)
```

### Frontend Calls:
- `/api/login.php`
- `/api/check_session.php`
- `/api/register.php`
- etc.

### Solution:
- Guna `.htaccess` untuk route `/api/*` → root files

---

## 📁 Files Needed di Backend Repo

### 1. `.htaccess` (NEW - IMPORTANT!)

Create file `.htaccess` di root backend repo:

```apache
# BITA Backend API - Apache Rewrite Rules
# Routes /api/* requests to root PHP files

RewriteEngine On

# Route /api/* requests to root PHP files (remove /api/ prefix)
RewriteCond %{REQUEST_URI} ^/api/(.+\.php)$
RewriteCond %{DOCUMENT_ROOT}/%1 -f
RewriteRule ^api/(.+\.php)$ $1 [L]

# For root index.php (health check)
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_URI} !^/api/
RewriteRule ^(.*)$ index.php [L,QSA]

# CORS Headers (if needed - or handle in cors.php)
<IfModule mod_headers.c>
    Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
    Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
</IfModule>
```

### 2. `index.php` (UPDATE)

Update `index.php` untuk handle root requests:

```php
<?php
/**
 * Koyeb Root Index File
 * 
 * This file is important for Koyeb to auto-detect PHP runtime.
 * Also serves as health check endpoint.
 */

// Check if request is for API
$requestUri = $_SERVER['REQUEST_URI'] ?? '';

// If accessing root, show API info
if ($requestUri === '/' || $requestUri === '/index.php') {
    header('Content-Type: application/json');
    echo json_encode([
        'success' => true,
        'message' => 'BITA API Backend is running',
        'version' => '1.0.0',
        'status' => 'ok'
    ]);
    exit;
}

// If request starts with /api, .htaccess will route it
// This shouldn't be reached if .htaccess is working
if (strpos($requestUri, '/api/') === 0) {
    http_response_code(404);
    header('Content-Type: application/json');
    echo json_encode([
        'success' => false,
        'message' => 'API endpoint not found. Check .htaccess routing.'
    ]);
    exit;
}

// Default: return 404
http_response_code(404);
header('Content-Type: application/json');
echo json_encode([
    'success' => false,
    'message' => 'Not Found'
]);
exit;
```

### 3. `config.php` (VERIFY/CREATE)

Pastikan `config.php` ada di root dan guna environment variables:

```php
<?php
// Database Configuration
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_NAME', getenv('DB_NAME') ?: 'bita_db');

// SMTP Configuration
define('SMTP_HOST', getenv('SMTP_HOST') ?: 'smtp.gmail.com');
define('SMTP_PORT', getenv('SMTP_PORT') ?: 587);
define('SMTP_USER', getenv('SMTP_USER') ?: 'bitaadm2425@gmail.com');
define('SMTP_PASS', getenv('SMTP_PASS') ?: '');

// Database Connection
function getDBConnection() {
    $conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME);
    
    if ($conn->connect_error) {
        die("MySQL Connection failed: " . $conn->connect_error);
    }
    
    $conn->set_charset("utf8");
    return $conn;
}

// Start session
if (session_status() === PHP_SESSION_NONE) {
    ini_set('session.cookie_httponly', 1);
    ini_set('session.use_only_cookies', 1);
    ini_set('session.cookie_samesite', 'Lax');
    session_start();
}
?>
```

### 4. `composer.json` (VERIFY)

Pastikan `composer.json` ada:

```json
{
  "name": "bita/backend",
  "description": "Backend API for BITA Cloud Computing",
  "type": "project",
  "require": {
    "php": ">=8.0",
    "phpmailer/phpmailer": "^7.0"
  },
  "autoload": {}
}
```

### 5. Update All PHP Files

Pastikan semua PHP files di root guna correct path untuk `config.php`:

**Before:**
```php
require_once '../config.php';  // ❌ Wrong for root structure
```

**After:**
```php
require_once __DIR__ . '/config.php';  // ✅ Correct for root structure
```

---

## 🔧 Update Required in PHP Files

Check semua PHP files dan update `require_once` statements:

### Find & Replace:
- `require_once '../config.php'` → `require_once __DIR__ . '/config.php'`
- `require_once '../api/config.php'` → `require_once __DIR__ . '/config.php'`
- `require_once 'config.php'` → Keep as is (if already correct)

### Example:

**login.php:**
```php
<?php
require_once __DIR__ . '/config.php';
require_once __DIR__ . '/cors.php';

// ... rest of code
```

**check_session.php:**
```php
<?php
require_once __DIR__ . '/config.php';

// ... rest of code
```

---

## 🚀 Deployment Steps

### 1. Update Backend Repo

1. **Add `.htaccess`** ke root repo
2. **Update `index.php`** (jika belum)
3. **Verify `config.php`** ada di root
4. **Update all PHP files** untuk guna correct `config.php` path
5. **Commit & Push:**
   ```bash
   git add .
   git commit -m "Add .htaccess for /api/* routing and update paths"
   git push origin main
   ```

### 2. Deploy to Koyeb

1. **Connect GitHub** di Koyeb
2. **Select repository**: `carlzr3ys/bita-backend`
3. **Runtime**: Auto-detect PHP (from `index.php` and `composer.json`)
4. **Build command**: (kosongkan - no build needed)
5. **Run command**: (kosongkan - Apache will serve)

### 3. Configure Environment Variables

Di Koyeb dashboard → App → Settings → Environment variables:

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

### 4. Test

1. **Health check:**
   ```
   https://your-app.koyeb.app/
   ```
   Should return: `{"success":true,"message":"BITA API Backend is running"}`

2. **Test API:**
   ```
   https://your-app.koyeb.app/api/test_backend.php
   ```
   Should work (routed to `/test_backend.php`)

3. **Test login:**
   ```
   POST https://your-app.koyeb.app/api/login.php
   ```
   Should work (routed to `/login.php`)

---

## 📝 Checklist

### Before Deploy:
- [ ] `.htaccess` created di root
- [ ] `index.php` updated
- [ ] `config.php` ada di root
- [ ] All PHP files updated untuk correct `config.php` path
- [ ] `composer.json` verified
- [ ] `phpmailer/` folder included
- [ ] Tested locally (jika possible)

### After Deploy:
- [ ] Environment variables configured
- [ ] Health check working (`/`)
- [ ] API endpoints working (`/api/*`)
- [ ] Database connection working
- [ ] CORS working (frontend can call API)
- [ ] Email sending working

---

## 🔍 Troubleshooting

### Issue: 404 on `/api/login.php`

**Solution:**
1. Check `.htaccess` exists
2. Verify `login.php` exists di root
3. Check Apache mod_rewrite enabled (Koyeb should have it)
4. Check Koyeb logs

### Issue: Config not found

**Solution:**
1. Verify `config.php` di root
2. Check `require_once __DIR__ . '/config.php'` in PHP files
3. Check file permissions

### Issue: CORS errors

**Solution:**
1. Update `cors.php` dengan frontend URL
2. Check `.htaccess` CORS headers
3. Verify `Access-Control-Allow-Credentials: true` for cookies

---

## ✅ Summary

**Structure:**
- Backend repo: All PHP files di root ✅
- Frontend calls: `/api/login.php` ✅
- Solution: `.htaccess` routes `/api/*` → root files ✅

**Files needed:**
1. `.htaccess` - Route `/api/*` to root
2. `index.php` - Entry point
3. `config.php` - Configuration (env vars)
4. `composer.json` - Dependencies

**Result:**
- Frontend tetap call `/api/login.php` ✅
- Backend serve dari root `/login.php` ✅
- Works perfectly! 🎉

