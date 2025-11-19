# ⚡ Quick Git Commands untuk Upload

Command cepat untuk upload backend ke GitHub.

---

## 🚀 Quick Start (Copy & Paste)

### 1. Initialize & Setup (First Time Only)

```cmd
cd C:\xampp\htdocs\bita
git init
git branch -M main
git remote add origin https://github.com/carlzr3ys/bita-backend.git
```

### 2. Add & Commit

```cmd
git add .
git commit -m "Initial commit: BITA Backend API"
```

### 3. Push to GitHub

```cmd
git push -u origin main
```

**Masukkan credentials:**
- Username: GitHub username anda
- Password: **Personal Access Token** (bukan password biasa!)

---

## 📤 Upload Updates (Future)

```cmd
git add .
git commit -m "Update: description"
git push
```

---

## 📋 Full Commands Explained

### Check Status
```cmd
git status
```
Lihat apa files yang berubah.

### Add Files
```cmd
git add .                    # Add semua files
git add api/                 # Add folder api sahaja
git add index.php            # Add file specific
```

### Commit Changes
```cmd
git commit -m "Your message"
```

### Push to GitHub
```cmd
git push                     # Push ke branch current
git push origin main         # Push ke branch main
```

---

## 🔐 Setup Personal Access Token

**Kenapa perlu?**
GitHub dah tak guna password, kena guna token.

**Cara dapat:**
1. GitHub.com → Settings → Developer settings
2. Personal access tokens → Tokens (classic)
3. Generate new token
4. Select scope: **`repo`** (full control)
5. Copy token (save dengan selamat!)
6. Guna token sebagai password bila push

---

## 🎯 Upload Backend Files Sahaja

Jika nak upload backend sahaja (untuk backend repo):

```cmd
git add api/
git add config.php
git add index.php
git add .htaccess
git add composer.json
git add *.md
git commit -m "Backend files for deployment"
git push
```

---

## ✅ Verify Upload

Check di GitHub website:
- https://github.com/carlzr3ys/bita-backend

All files should be there! ✅

---

## 🆘 Common Issues

### "remote origin already exists"
```cmd
git remote remove origin
git remote add origin https://github.com/carlzr3ys/bita-backend.git
```

### "Authentication failed"
- Pastikan guna **Personal Access Token**, bukan password
- Or setup SSH key (advanced)

### "LF will be replaced by CRLF"
```cmd
git config core.autocrlf true
```

---

**Selamat Upload! 🚀**

