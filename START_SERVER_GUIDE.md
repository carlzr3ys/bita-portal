# 🚀 Cara Start Backend Server dengan Betul

## ❌ Masalah yang Anda Hadapi

1. `npm run server` nampak stuck
2. `localhost` refuse connection (ERR_CONNECTION_REFUSED)
3. Frontend boleh run tapi login gagal

## ✅ Penyelesaian

### **Step 1: Buat/Update `.env` File**

Create file `.env` di root project (kalau belum ada):

```env
# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=bita-secret-key-change-this-in-production

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bita_db

# Frontend API URL - IMPORTANT!
VITE_API_URL=http://localhost:3001
```

**⚠️ PENTING:** Pastikan `VITE_API_URL=http://localhost:3001` ada!

### **Step 2: Install Dependencies (Kalau Belum)**

```bash
npm install
```

Ini akan install semua packages termasuk:
- express
- mysql2
- dotenv
- bcrypt
- multer
- cors
- express-session
- nodemailer

### **Step 3: Start Backend Server**

Buka **terminal baru** (jangan tutup terminal frontend):

```bash
npm run server
```

Atau dengan auto-reload:

```bash
npm run server:dev
```

**Output yang betul:**
```
🚀 BITA Backend Server running on port 3001
📡 Environment: development
🌐 Frontend URL: http://localhost:5173
💾 Database: localhost/bita_db
```

**⚠️ Server akan nampak "stuck" - ini NORMAL!** Server sedang waiting untuk requests. Jangan tutup terminal ini.

### **Step 4: Start Frontend (Terminal Lain)**

Buka **terminal kedua** untuk frontend:

```bash
npm run dev
```

Frontend akan run di `http://localhost:5173`

### **Step 5: Test Backend**

Buka browser dan test:

1. **Test Backend Health:**
   ```
   http://localhost:3001/api/test_backend
   ```

   Should return:
   ```json
   {
     "success": true,
     "message": "Backend is running!",
     "backend_status": "online",
     "database_status": "connected"
   }
   ```

2. **Test Root Endpoint:**
   ```
   http://localhost:3001/
   ```

   Should return API info.

### **Step 6: Test Login**

1. Buka frontend: `http://localhost:5173`
2. Try login
3. Check browser console (F12) untuk errors

---

## 🔍 Troubleshooting

### **Problem: "Cannot connect to backend server"**

**Solution:**
1. Check `.env` file ada `VITE_API_URL=http://localhost:3001`
2. Restart frontend (`Ctrl+C` then `npm run dev` again)
3. Check backend server running (should show port 3001)

### **Problem: "ERR_CONNECTION_REFUSED"**

**Solution:**
1. Backend server mungkin tidak start
2. Check untuk errors dalam terminal backend
3. Verify port 3001 tidak digunakan oleh app lain:
   ```powershell
   netstat -ano | findstr :3001
   ```

### **Problem: Database Connection Failed**

**Solution:**
1. Check XAMPP MySQL running
2. Check `.env` file database credentials betul:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=bita_db
   ```

### **Problem: Server Stuck/Crashed**

**Solution:**
1. Check terminal untuk error messages
2. Common errors:
   - Missing dependencies → `npm install`
   - Port already in use → Kill process on port 3001
   - Database connection error → Check MySQL running

---

## 📋 Quick Checklist

- [ ] `.env` file exists dengan `VITE_API_URL=http://localhost:3001`
- [ ] Dependencies installed: `npm install`
- [ ] XAMPP MySQL running
- [ ] Backend server running: `npm run server` (terminal 1)
- [ ] Frontend running: `npm run dev` (terminal 2)
- [ ] Test backend: `http://localhost:3001/api/test_backend`

---

## 🎯 Expected Flow

### **Terminal 1 (Backend):**
```bash
npm run server
```
Output:
```
🚀 BITA Backend Server running on port 3001
```
**(Server akan "stuck" di sini - ini NORMAL!)**

### **Terminal 2 (Frontend):**
```bash
npm run dev
```
Output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### **Browser:**
- Frontend: `http://localhost:5173`
- Backend test: `http://localhost:3001/api/test_backend`

---

## ⚠️ Common Mistakes

1. **❌ Tutup terminal backend** - Server akan stop
2. **❌ Lupa update `.env`** - Frontend akan connect ke wrong backend
3. **❌ MySQL tidak running** - Database connection akan fail
4. **❌ Port conflict** - Port 3001 sudah digunakan

---

## ✅ Success Indicators

1. Backend terminal show: `🚀 BITA Backend Server running on port 3001`
2. Browser dapat access: `http://localhost:3001/api/test_backend`
3. Frontend dapat login tanpa "Cannot connect" error
4. Console show successful API calls

---

**Masih stuck?** Check terminal output untuk error messages!

