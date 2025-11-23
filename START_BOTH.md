# 🚀 Cara Start Backend DAN Frontend

## ❌ Masalah

- Backend sudah running ✅
- Frontend "ERR_CONNECTION_REFUSED" ❌

**Masalah:** Frontend tidak running atau belum restart!

---

## ✅ Penyelesaian

### **PENTING: Perlu 2 Terminal Berbeza!**

#### **Terminal 1: Backend (JANGAN tutup!)**
```bash
npm run server
```

Output:
```
🚀 BITA Backend Server running on port 3001
```

**⚠️ Jangan tutup terminal ini!**

---

#### **Terminal 2: Frontend (BARU!)**

**Buka terminal BARU** (jangan tutup terminal backend):

```bash
npm run dev
```

Output:
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

**Frontend akan buka di:** `http://localhost:5173`

---

## 🔍 Troubleshooting

### **Problem: Frontend still cannot connect**

**Check:**
1. Frontend sudah running? (Check Terminal 2)
2. Restart frontend (`Ctrl+C` then `npm run dev` again)
3. Backend still running? (Check Terminal 1)
4. Test backend: `http://localhost:3001/api/test_backend`

### **Problem: Frontend tak start**

**Check:**
1. Dependencies installed?
   ```bash
   npm install
   ```
2. Port 5173 available?
   ```powershell
   netstat -ano | findstr :5173
   ```
3. Error dalam terminal frontend?

### **Problem: "Cannot connect to backend server"**

**Check:**
1. `.env` file ada `VITE_API_URL=http://localhost:3001`
2. **RESTART frontend** (`Ctrl+C` then `npm run dev`) - supaya baca .env baru
3. Backend running? Test: `http://localhost:3001/api/test_backend`

---

## 📋 Complete Setup

### **Step 1: Terminal 1 - Start Backend**
```bash
npm run server
```
✅ Wait for: `🚀 BITA Backend Server running on port 3001`

### **Step 2: Terminal 2 - Start Frontend**
```bash
npm run dev
```
✅ Wait for: `➜  Local:   http://localhost:5173/`

### **Step 3: Test**

1. **Test Backend:**
   ```
   http://localhost:3001/api/test_backend
   ```
   Should return JSON ✅

2. **Test Frontend:**
   ```
   http://localhost:5173
   ```
   Should show website ✅

3. **Test Login:**
   - Buka: `http://localhost:5173`
   - Open DevTools (F12) → Console
   - Try login
   - Should connect to backend ✅

---

## ✅ Checklist

- [ ] **Terminal 1:** Backend running (`npm run server`) - Jangan tutup!
- [ ] **Terminal 2:** Frontend running (`npm run dev`) - Terminal baru!
- [ ] Backend test: `http://localhost:3001/api/test_backend` → Working
- [ ] Frontend test: `http://localhost:5173` → Website loads
- [ ] `.env` file ada `VITE_API_URL=http://localhost:3001`
- [ ] Frontend restarted untuk baca .env baru

---

## 🎯 Expected Result

### **Terminal 1 (Backend):**
```
🚀 BITA Backend Server running on port 3001
📡 Environment: development
🌐 Frontend URL: http://localhost:5173
💾 Database: localhost/bita_db
```
**(Stuck di sini = NORMAL! Jangan tutup!)**

### **Terminal 2 (Frontend):**
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```
**(Website ready!)**

### **Browser:**
- `http://localhost:5173` → Website loads ✅
- Login works ✅
- No "Cannot connect" error ✅

---

## ⚠️ Common Mistakes

1. **❌ Tutup terminal backend** - Frontend akan lose connection!
2. **❌ Run frontend dalam terminal yang sama** - Perlu 2 terminal!
3. **❌ Lupa restart frontend** - Perlu restart untuk baca .env baru
4. **❌ Frontend tidak running** - Perlu `npm run dev`!

---

**Remember:**
- **Backend** = Terminal 1 (port 3001)
- **Frontend** = Terminal 2 (port 5173)
- **Kedua-dua perlu running!**

