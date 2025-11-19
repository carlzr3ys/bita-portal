# 📊 Backend Repo Analysis

Analysis untuk backend repository: https://github.com/carlzr3ys/bita-backend.git

---

## 🔍 Current Repo Structure (from GitHub)

Berdasarkan repo di GitHub, structure adalah:

```
bita-backend/
├── phpmailer/
│   └── src/
│       ├── DSNConfigurator.php
│       ├── Exception.php
│       ├── OAuth.php
│       ├── OAuthTokenProvider.php
│       ├── PHPMailer.php
│       ├── POP3.php
│       └── SMTP.php
├── accept_message_request.php      ← Di ROOT
├── add_user.php                    ← Di ROOT
├── admin_login.php                 ← Di ROOT
├── admin_logout.php                ← Di ROOT
├── approve_user.php                ← Di ROOT
├── check_admin.php                 ← Di ROOT
├── check_admin_session.php         ← Di ROOT
├── check_session.php               ← Di ROOT
├── contact_admin.php               ← Di ROOT
├── cors.php                        ← Di ROOT
├── create_admin_logs_table.php     ← Di ROOT
├── create_category.php             ← Di ROOT
├── delete_admin.php                ← Di ROOT
├── delete_category.php             ← Di ROOT
├── delete_contact_request.php      ← Di ROOT
├── login.php                       ← Di ROOT
├── logout.php                      ← Di ROOT
├── register.php                    ← Di ROOT
├── reject_user.php                 ← Di ROOT
├── resolve_contact_request.php     ← Di ROOT
├── save_admin.php                  ← Di ROOT
├── send_email.php                  ← Di ROOT
├── send_email.py                   ← Di ROOT
├── send_email_phpmailer.php        ← Di ROOT
├── send_email_python.php           ← Di ROOT
├── send_message.php                ← Di ROOT
├── test_backend.php                ← Di ROOT
├── ... (dan banyak lagi)
└── index.php                       ← Di ROOT
```

**Languages:**
- PHP: 98.2%
- Python: 1.8%

---

## ⚠️ Current Issue

### Frontend (React) calls API dengan prefix `/api/`:
- `/api/login.php`
- `/api/check_session.php`
- `/api/register.php`
- `/api/get_user.php`
- etc.

### Backend Repo structure:
- Semua PHP files di **ROOT level** (tidak ada folder `api/`)
- Files seperti: `login.php`, `check_session.php`, `register.php`

### Local Structure:
- Files dalam folder `api/`
- Structure: `api/login.php`, `api/check_session.php`, etc.

---

## 🔧 Solutions

### Option 1: Update `.htaccess` untuk Route `/api/*` ke Root Files (Recommended)

Ini solution paling mudah - tidak perlu ubah structure repo atau frontend.

**Create `.htaccess` di root backend:**

```apache
RewriteEngine On

# Route /api/* requests to root PHP files
RewriteCond %{REQUEST_URI} ^/api/(.+\.php)$
RewriteCond %{DOCUMENT_ROOT}/%1 -f
RewriteRule ^api/(.+\.php)$ $1 [L]

# For root index.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ index.php [L,QSA]
```

**How it works:**
- Frontend calls: `https://backend.com/api/login.php`
- `.htaccess` routes to: `https://backend.com/login.php`
- File exists di root → Works! ✅

### Option 2: Move Files dari Root ke Folder `api/` di Repo

**Pros:**
- Structure lebih organized
- Match dengan local development

**Cons:**
- Perlu update semua files di repo
- Perlu test semua routes

### Option 3: Update Frontend untuk Call Root Files

**Pros:**
- Match dengan repo structure

**Cons:**
- Perlu update semua API calls di frontend
- Kurang organized (no `/api/` prefix)
- Potential CORS issues

---

## ✅ Recommended Solution: Option 1

Guna `.htaccess` untuk route `/api/*` ke root files. Ini adalah solution paling clean dan tidak perlu ubah code.

### Implementation:

1. **Create `.htaccess` di root backend repo:**
   ```apache
   # Enable Rewrite Engine
   RewriteEngine On
   
   # Route /api/* requests to root PHP files (remove /api/ prefix)
   RewriteCond %{REQUEST_URI} ^/api/(.+\.php)$
   RewriteCond %{DOCUMENT_ROOT}/%1 -f
   RewriteRule ^api/(.+\.php)$ $1 [L]
   
   # Route non-file requests to index.php
   RewriteCond %{REQUEST_FILENAME} !-f
   RewriteCond %{REQUEST_FILENAME} !-d
   RewriteRule ^(.*)$ index.php [L,QSA]
   
   # CORS headers (if needed)
   Header always set Access-Control-Allow-Origin "*"
   Header always set Access-Control-Allow-Methods "GET, POST, PUT, DELETE, OPTIONS"
   Header always set Access-Control-Allow-Headers "Content-Type, Authorization"
   ```

2. **Update `index.php` untuk handle root requests:**
   ```php
   <?php
   // Check if request is for API
   $requestUri = $_SERVER['REQUEST_URI'] ?? '';
   
   // If accessing root, show API info
   if ($requestUri === '/' || $requestUri === '/index.php') {
       header('Content-Type: application/json');
       echo json_encode([
           'success' => true,
           'message' => 'BITA API Backend is running',
           'version' => '1.0.0'
       ]);
       exit;
   }
   
   // Let .htaccess handle /api/* routing
   http_response_code(404);
   echo json_encode(['success' => false, 'message' => 'Not Found']);
   ?>
   ```

3. **Update `config.php` location:**
   - Pastikan `config.php` ada di root (sama level dengan PHP files)
   - Atau update semua `require_once 'config.php'` dengan correct path

---

## 📁 Files Needed di Backend Repo

### Required Files:
- [x] `index.php` - Entry point untuk Koyeb
- [ ] `.htaccess` - Route `/api/*` ke root files
- [x] `composer.json` - PHP dependencies
- [ ] `config.php` - Database & SMTP configuration (atau guna env vars)
- [x] `phpmailer/` - PHPMailer library
- [ ] `uploads/` folder structure (create via deployment atau manual)

### Optional Files:
- `Procfile` - Untuk Koyeb (if needed)
- `.gitignore` - Exclude sensitive files
- `README.md` - Documentation

---

## 🚀 Deployment Checklist

### Backend Repo (Koyeb):
- [ ] All PHP files di root level
- [ ] `.htaccess` untuk route `/api/*`
- [ ] `index.php` untuk entry point
- [ ] `composer.json` untuk dependencies
- [ ] `config.php` atau environment variables
- [ ] `phpmailer/` folder included
- [ ] Environment variables configured di Koyeb

### Frontend Repo (Netlify):
- [ ] React app build
- [ ] API URL configured: `VITE_API_URL=https://your-backend.koyeb.app`
- [ ] CORS updated di backend
- [ ] `_redirects` file untuk React Router

---

## 🔗 How It Works

### Request Flow:

```
Frontend (Netlify)
  ↓
  GET https://backend.koyeb.app/api/login.php
  ↓
Backend (Koyeb) - .htaccess
  ↓
  Rewrite: /api/login.php → /login.php
  ↓
  File: login.php (di root)
  ↓
  Response: JSON
```

---

## 📝 Next Steps

1. **Add `.htaccess` to backend repo**
2. **Update `config.php` untuk guna environment variables**
3. **Test routing dengan `test_backend.php`**
4. **Deploy to Koyeb**
5. **Configure environment variables di Koyeb**
6. **Test API endpoints**

---

## ✅ Summary

**Repo structure:** All PHP files di root level ✅
**Frontend calls:** `/api/login.php` ✅
**Solution:** `.htaccess` route `/api/*` → root files ✅
**Result:** Works without changing code! 🎉

