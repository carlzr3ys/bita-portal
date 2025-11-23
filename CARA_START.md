# 🚀 Cara Start Backend & Frontend dengan Betul

## ❌ Masalah yang Anda Hadapi

1. `npm run server` nampak **stuck** (ini NORMAL!)
2. Frontend boleh run tapi login gagal
3. Error: "Cannot connect to backend server"

## ✅ Penyelesaian

### **PENTING: Server "Stuck" = NORMAL!**

Server akan nampak "stuck" sebab dia **waiting untuk HTTP requests**. Jangan tutup terminal server!

---

## 📋 Step-by-Step

### **Step 1: Update .env File**

Pastikan file `.env` ada line ini:

```env
VITE_API_URL=http://localhost:3001
```

Kalau tak ada, tambah sendiri.

### **Step 2: Install Dependencies (Kalau Belum)**

```bash
npm install
```

### **Step 3: Start Backend Server (Terminal 1)**

Buka **terminal baru**:

```bash
npm run server
```

**Output yang betul:**
```
🚀 BITA Backend Server running on port 3001
📡 Environment: development
🌐 Frontend URL: http://localhost:5173
💾 Database: localhost/bita_db
```

**⚠️ Server akan "stuck" di sini - ini NORMAL!** 
- Server sedang running dan waiting untuk requests
- **JANGAN tutup terminal ini!**
- Buka terminal **BARU** untuk frontend

### **Step 4: Start Frontend (Terminal 2 - BARU!)**

Buka **terminal baru lagi** (jangan tutup terminal backend):

```bash
npm run dev
```

**Output yang betul:**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### **Step 5: Test Backend Directly**

Buka browser dan test backend:

```
http://localhost:3001/api/test_backend
```

**Should return JSON:**
```json
{
  "success": true,
  "message": "Backend is running!",
  "backend_status": "online",
  "database_status": "connected"
}
```

Kalau dapat response = **backend working!** ✅

### **Step 6: Test Frontend**

1. Buka browser: `http://localhost:5173`
2. Open DevTools (F12) → Console tab
3. Try login
4. Check console untuk errors

---

## 🔍 Troubleshooting

### **Problem: Server Stuck?**

**Ini NORMAL!** Server running correctly. Test dengan:
- Buka browser: `http://localhost:3001/api/test_backend`
- Kalau dapat response = server working!

### **Problem: Frontend Cannot Connect?**

**Check:**
1. `.env` file ada `VITE_API_URL=http://localhost:3001`
2. Restart frontend (`Ctrl+C` then `npm run dev` again)
3. Backend terminal still running (jangan tutup!)
4. Check browser console (F12) untuk error details

### **Problem: ERR_CONNECTION_REFUSED?**

**Check:**
1. Backend server running? (Check terminal 1)
2. Port 3001 available?
   ```powershell
   netstat -ano | findstr :3001
   ```
3. Restart backend server

### **Problem: Database Connection Error?**

**Check:**
1. XAMPP MySQL running?
2. `.env` file database settings betul:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=bita_db
   ```

---

## ✅ Quick Checklist

- [ ] `.env` file ada `VITE_API_URL=http://localhost:3001`
- [ ] Dependencies installed (`npm install`)
- [ ] XAMPP MySQL running
- [ ] **Terminal 1:** Backend running (`npm run server`) - **JANGAN tutup!**
- [ ] **Terminal 2:** Frontend running (`npm run dev`)
- [ ] Browser test: `http://localhost:3001/api/test_backend` → Working ✅
- [ ] Frontend test: `http://localhost:5173` → Login working ✅

---

## 🎯 Expected Behavior

### **Terminal 1 (Backend):**
```
🚀 BITA Backend Server running on port 3001
```
**(Stuck di sini = NORMAL! Server sedang waiting untuk requests)**

### **Terminal 2 (Frontend):**
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### **Browser:**
- Backend: `http://localhost:3001/api/test_backend` → JSON response ✅
- Frontend: `http://localhost:5173` → Website loads ✅
- Login: No "Cannot connect" error ✅

---

## ⚠️ Common Mistakes

1. **❌ Tutup terminal backend** - Server akan stop!
2. **❌ Lupa update `.env`** - Frontend akan connect ke wrong backend
3. **❌ Run frontend dalam terminal yang sama** - Perlu 2 terminal separate
4. **❌ MySQL tidak running** - Database connection akan fail

---

## 📝 Summary

1. **Server "stuck" = NORMAL** - Server waiting untuk requests
2. **Perlu 2 terminal** - Satu untuk backend, satu untuk frontend
3. **Backend port:** 3001
4. **Frontend port:** 5173
5. **Update `.env`** dengan `VITE_API_URL=http://localhost:3001`

**Still stuck?** Check terminal output untuk error messages!

