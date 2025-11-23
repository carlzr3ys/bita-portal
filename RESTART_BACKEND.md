# 🔄 Restart Backend untuk Apply Changes

## ✅ Perubahan yang Dibuat

Saya dah tambah **route mapping** untuk support old PHP endpoints dalam Node.js backend.

**Old PHP endpoints sekarang akan work:**
- `/api/login.php` → `/api/auth/login`
- `/api/logout.php` → `/api/auth/logout`
- `/api/check_session.php` → `/api/auth/check_session`
- `/api/admin_login.php` → `/api/admin/login`
- `/api/lecturer_login.php` → `/api/lecturer/login`
- Dan lain-lain...

---

## 🔄 Cara Restart Backend

### **Step 1: Stop Backend**

Dalam terminal backend, press:
```
Ctrl+C
```

### **Step 2: Start Backend Lagi**

```bash
npm run server
```

### **Step 3: Test**

1. **Test backend:**
   ```
   http://localhost:3001/api/test_backend
   ```

2. **Test old endpoint:**
   ```
   http://localhost:3001/api/login.php
   ```
   (Should return method not allowed or similar - endpoint exists!)

3. **Test frontend:**
   - Buka: `http://localhost:5173`
   - Try login
   - Should work sekarang! ✅

---

## ⚠️ Important

**Frontend perlu restart juga** untuk apply configuration changes:

1. **Stop frontend:** `Ctrl+C` dalam terminal frontend
2. **Start frontend:** `npm run dev`

---

## ✅ Checklist

- [ ] Backend restarted (`npm run server`)
- [ ] Frontend restarted (`npm run dev`)
- [ ] Test backend: `http://localhost:3001/api/test_backend` → Working
- [ ] Test login dalam frontend → Should work!

---

**Restart backend dan frontend sekarang, then try login lagi!**

