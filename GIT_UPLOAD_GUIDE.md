# 📤 Panduan Upload ke GitHub Repo via CMD

Panduan step-by-step untuk upload code ke GitHub repository menggunakan Command Prompt (CMD).

---

## 🎯 Prerequisites

1. **Git installed** di Windows
   - Download: https://git-scm.com/download/win
   - Verify: `git --version`

2. **GitHub account** sudah ada

3. **Repository dah create** di GitHub:
   - Backend: https://github.com/carlzr3ys/bita-backend.git
   - Frontend: (akan create kemudian)

---

## 📋 Step-by-Step: Upload Backend ke GitHub

### Step 1: Open Command Prompt (CMD)

1. Press `Windows + R`
2. Type `cmd`
3. Press Enter
4. Navigate ke project folder:
   ```cmd
   cd C:\xampp\htdocs\bita
   ```

### Step 2: Initialize Git (Jika Belum)

```cmd
git init
```

### Step 3: Create .gitignore (Penting!)

Create file `.gitignore` untuk exclude files yang tak perlu upload:

```cmd
echo node_modules/ > .gitignore
echo vendor/ >> .gitignore
echo uploads/ >> .gitignore
echo dist/ >> .gitignore
echo .env >> .gitignore
echo config/firebase_config.php >> .gitignore
echo config/serviceAccountKey.json >> .gitignore
echo *.log >> .gitignore
```

Atau create file `.gitignore` manually dengan content:

```
# Dependencies
node_modules/
vendor/

# Build outputs
dist/

# Uploads (sensitive files)
uploads/

# Environment variables
.env
.env.local

# Firebase config (sensitive)
config/firebase_config.php
config/serviceAccountKey.json

# Logs
*.log

# IDE
.vscode/
.idea/

# OS
.DS_Store
Thumbs.db
```

### Step 4: Add All Files

```cmd
git add .
```

Atau add specific files sahaja:

```cmd
git add api/
git add config.php
git add index.php
git add .htaccess
git add composer.json
git add *.md
```

### Step 5: Commit Changes

```cmd
git commit -m "Initial commit: BITA Backend API"
```

Atau dengan detail message:

```cmd
git commit -m "Add BITA Backend API

- PHP API endpoints
- Database configuration
- PHPMailer integration
- Deployment setup files
- Documentation"
```

### Step 6: Add Remote Repository

**Untuk Backend Repo:**
```cmd
git remote add origin https://github.com/carlzr3ys/bita-backend.git
```

**Verify remote:**
```cmd
git remote -v
```

### Step 7: Push to GitHub

**First time push:**
```cmd
git branch -M main
git push -u origin main
```

**Future pushes:**
```cmd
git push
```

### Step 8: Enter Credentials

GitHub akan prompt untuk:
- **Username**: GitHub username anda
- **Password**: Gunakan **Personal Access Token** (bukan password biasa)

**Create Personal Access Token:**
1. GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Generate new token
3. Select scopes: `repo` (full control)
4. Copy token
5. Use token sebagai password

---

## 🔄 Future Updates

### Upload Changes:

```cmd
# 1. Check status
git status

# 2. Add changed files
git add .

# 3. Commit
git commit -m "Update: description of changes"

# 4. Push
git push
```

### Update dari GitHub:

```cmd
git pull
```

---

## 📁 Upload Specific Files Only

### Upload API files sahaja:

```cmd
git add api/
git commit -m "Update API endpoints"
git push
```

### Upload config sahaja:

```cmd
git add config.php
git commit -m "Update config"
git push
```

---

## 🚨 Troubleshooting

### Error: "fatal: remote origin already exists"

**Solution:**
```cmd
git remote remove origin
git remote add origin https://github.com/carlzr3ys/bita-backend.git
```

### Error: "failed to push some refs"

**Solution:**
```cmd
git pull origin main --allow-unrelated-histories
git push
```

### Error: Authentication failed

**Solution:**
1. Use Personal Access Token (not password)
2. Or use SSH instead:
   ```cmd
   git remote set-url origin git@github.com:carlzr3ys/bita-backend.git
   ```

### Error: "LF will be replaced by CRLF"

**Solution:**
```cmd
git config core.autocrlf true
```

---

## 📝 Quick Command Reference

```cmd
# Initialize
git init

# Add files
git add .

# Commit
git commit -m "Your message"

# Add remote
git remote add origin https://github.com/USERNAME/REPO.git

# Push
git push -u origin main

# Check status
git status

# View history
git log

# View remotes
git remote -v
```

---

## ✅ Checklist

- [ ] Git installed (`git --version`)
- [ ] Navigate to project folder
- [ ] Initialize git (`git init`)
- [ ] Create `.gitignore`
- [ ] Add files (`git add .`)
- [ ] Commit (`git commit -m "message"`)
- [ ] Add remote (`git remote add origin`)
- [ ] Push (`git push -u origin main`)
- [ ] Verify di GitHub website

---

## 🎯 Next Steps

**Backend Repo:**
- [ ] Upload backend files ke `bita-backend` repo
- [ ] Verify semua files dah ada
- [ ] Test deployment di Koyeb

**Frontend Repo:**
- [ ] Create new repo: `bita-frontend`
- [ ] Upload React app
- [ ] Deploy ke Netlify

---

**Done! Your code is now on GitHub! 🚀**

