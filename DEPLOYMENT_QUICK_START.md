# ⚡ Quick Start - Deploy BITA Website

Panduan cepat untuk deploy website BITA dalam 15 minit!

---

## 🎯 Ringkasan Setup

```
Frontend (React):  Netlify
Backend (PHP):     Koyeb atau InfinityFree  
Database (MySQL):  FreeMySQLDatabase
File Storage:      Backend hosting (uploads folder)
```

---

## 📦 Step 1: Setup FreeMySQLDatabase (5 minit)

1. **Daftar**: https://www.freemysqldatabase.com/
2. **Create Database**: 
   - Name: `bita_db`
   - Save credentials: `Host`, `Username`, `Password`
3. **Export dari localhost**:
   ```bash
   # Via phpMyAdmin
   http://localhost/phpmyadmin → Export → SQL
   ```
4. **Import ke FreeMySQLDatabase**:
   - Via phpMyAdmin (jika ada) atau MySQL Workbench
   - Upload file SQL

✅ **Done!** Database ready.

---

## 🚀 Step 2: Deploy Frontend ke Netlify (5 minit)

1. **Build React app**:
   ```bash
   npm run build
   ```

2. **Deploy ke Netlify**:
   - Go to: https://app.netlify.com/
   - Drag folder `dist/` ke Netlify
   - Tunggu deploy selesai
   - Dapat URL: `https://xxx.netlify.app`

3. **Setup _redirects** (untuk React Router):
   - Create file `public/_redirects`:
   ```
   /*    /index.html   200
   ```
   - Rebuild: `npm run build`
   - Redeploy

✅ **Done!** Frontend live di Netlify.

---

## 🔧 Step 3: Deploy Backend ke Koyeb (5 minit)

### Option A: Koyeb (Recommended)

1. **Prepare backend**:
   - Ensure folder `api/` ada semua PHP files
   - Include `composer.json` jika guna PHPMailer

2. **Deploy via Git**:
   ```bash
   # Push to GitHub
   git init
   git add .
   git commit -m "Deploy"
   git push origin main
   ```

3. **Deploy di Koyeb**:
   - Go to: https://www.koyeb.com/
   - Create App → Connect GitHub
   - Select repository
   - Runtime: **PHP**
   - Build command: (kosong)
   - Run command: (kosong)

4. **Set Environment Variables**:
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

5. **Get backend URL**: `https://xxx.koyeb.app`

### Option B: InfinityFree (Alternative)

1. **Get FTP credentials** dari InfinityFree panel
2. **Connect dengan FileZilla**:
   - Upload semua files dari `api/` ke `htdocs/`
3. **Update `config.php`** dengan direct database credentials

✅ **Done!** Backend live.

---

## 🔗 Step 4: Connect Frontend & Backend (2 minit)

1. **Update CORS** (`api/cors.php`):
   ```php
   $allowed_origins = [
       'https://your-netlify-site.netlify.app'
   ];
   ```

2. **Update React API URL**:
   - Create `.env.production`:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```
   - Rebuild: `npm run build`
   - Redeploy ke Netlify

3. **Update Netlify Environment Variables**:
   ```
   VITE_API_URL=https://your-backend-url.com/api
   ```

✅ **Done!** Frontend & Backend connected.

---

## ✅ Step 5: Test (3 minit)

1. **Frontend**: Visit Netlify URL
2. **Backend**: Test `https://your-backend.com/api/test_backend.php`
3. **Login**: Test login dengan existing user
4. **Upload**: Test file upload

✅ **All working!** Website live! 🎉

---

## 📋 Checklist

- [ ] Database imported ke FreeMySQLDatabase
- [ ] Frontend deployed ke Netlify
- [ ] Backend deployed ke Koyeb/InfinityFree
- [ ] Environment variables configured
- [ ] CORS updated
- [ ] React API URL updated
- [ ] Test login working
- [ ] Test file upload working
- [ ] Test email sending working

---

## 🆘 Quick Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Update `api/cors.php` dengan frontend URL |
| Database error | Verify credentials di environment variables |
| File upload failed | Check folder permissions (chmod 755) |
| 404 on routes | Ensure `_redirects` file exists |

---

## 🎯 URLs Reference

```
Frontend: https://xxx.netlify.app
Backend:  https://xxx.koyeb.app/api
Database: sqlXXX.freemysqldatabase.com:3306
```

---

**Done! Your website is now live! 🚀**

