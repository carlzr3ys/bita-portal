# ⚡ Quick Fix - Backend Server Issues

## 🐛 Masalah

1. `npm run server` nampak stuck
2. Frontend cannot connect to backend
3. Login error: "Cannot connect to backend server"

## ✅ Penyelesaian Cepat

### **Step 1: Pastikan .env File Betul**

Check `.env` file ada line ini:

```env
VITE_API_URL=http://localhost:3001
```

Kalau tak ada, tambah line tu.

### **Step 2: Install Dependencies**

```bash
npm install
```

### **Step 3: Start Backend (Terminal 1)**

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

**⚠️ Server akan "stuck" di sini - ini NORMAL!** Server sedang waiting untuk requests. **JANGAN tutup terminal ini!**

### **Step 4: Start Frontend (Terminal 2 - Baru!)**

Buka **terminal baru** (jangan tutup terminal backend):

```bash
npm run dev
```

### **Step 5: Test**

1. **Test backend directly:**
   - Buka browser: `http://localhost:3001/api/test_backend`
   - Should return JSON dengan `"backend_status": "online"`

2. **Test frontend:**
   - Buka: `http://localhost:5173`
   - Try login
   - Check browser console (F12) untuk errors

---

## 🔍 Troubleshooting

### Server Stuck?

**Ini NORMAL!** Node.js servers run continuously. Server akan nampak "stuck" sebab dia waiting untuk HTTP requests.

**Test dengan:**
- Buka browser: `http://localhost:3001/api/test_backend`
- Kalau dapat response = server working!

### Frontend Cannot Connect?

**Check:**
1. `.env` file ada `VITE_API_URL=http://localhost:3001`
2. Restart frontend (`Ctrl+C` then `npm run dev` again)
3. Backend terminal still running (jangan tutup!)
4. Check browser console (F12) untuk error details

### Port Already in Use?

```powershell
# Check port 3001
netstat -ano | findstr :3001

# Kill process (ganti <PID> dengan number dari atas)
taskkill /PID <PID> /F
```

### Database Connection Error?

**Check:**
1. XAMPP MySQL running
2. `.env` file:
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASS=
   DB_NAME=bita_db
   ```

---

## ✅ Checklist

- [ ] `.env` file ada `VITE_API_URL=http://localhost:3001`
- [ ] `npm install` dah run
- [ ] XAMPP MySQL running
- [ ] Terminal 1: Backend running (`npm run server`)
- [ ] Terminal 2: Frontend running (`npm run dev`)
- [ ] Browser test: `http://localhost:3001/api/test_backend` working
- [ ] Frontend test: `http://localhost:5173` dapat connect

---

## 🎯 Expected Behavior

### Terminal 1 (Backend):
```
🚀 BITA Backend Server running on port 3001
```
**(Stuck di sini = NORMAL! Jangan tutup!)**

### Terminal 2 (Frontend):
```
  VITE v5.x.x  ready in xxx ms
  ➜  Local:   http://localhost:5173/
```

### Browser:
- Backend: `http://localhost:3001/api/test_backend` → JSON response ✅
- Frontend: `http://localhost:5173` → Website loads ✅
- Login: Works without "Cannot connect" error ✅

---

**Masih stuck?** Check terminal untuk error messages atau test backend direct dengan browser!

