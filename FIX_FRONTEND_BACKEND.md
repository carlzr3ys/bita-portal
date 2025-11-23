# 🔧 Fix: Frontend Cannot Connect to Backend

## ❌ Masalah

Backend sudah running ✅ tapi frontend dapat error:
```
Backend server is not responding. Please try again later.
```

## ✅ Diagnosis

**Backend Status:**
- ✅ Running on port 3001
- ✅ Responding to `/api/test_backend`
- ✅ CORS configured correctly
- ✅ Database connected

**Masalah:** Frontend masih gunakan **old PHP endpoints** yang tidak wujud dalam Node.js backend!

---

## 🔍 API Endpoint Differences

### **PHP Backend (Old):**
```
/api/login.php
/api/logout.php
/api/check_session.php
/api/register.php
```

### **Node.js Backend (New):**
```
/api/auth/login
/api/auth/logout
/api/auth/check_session
/api/user/register
```

**⚠️ Frontend masih call `/api/login.php` tapi Node.js backend guna `/api/auth/login`!**

---

## ✅ Solution

### **Option 1: Update Frontend to Use New Endpoints (Recommended)**

Update frontend code untuk guna Node.js endpoints:

**Before (PHP):**
```javascript
fetch('/api/login.php', {...})
```

**After (Node.js):**
```javascript
fetch('/api/auth/login', {...})
```

### **Option 2: Add Route Mapping in Backend (Quick Fix)**

Update `backend/server.js` untuk map old endpoints:

```javascript
// Map old PHP endpoints to new Node.js routes
app.post('/api/login.php', (req, res) => {
  // Forward to new auth route
  req.url = '/api/auth/login';
  app._router.handle(req, res);
});
```

### **Option 3: Keep Using PHP Backend for Now**

Kalau masih banyak endpoints belum migrate, guna PHP backend dulu:

**Update `.env`:**
```env
# Comment out Node.js
# VITE_API_URL=http://localhost:3001

# Use PHP backend
VITE_API_URL=http://localhost/bita
```

**Then restart frontend.**

---

## 🎯 Recommended: Quick Fix Route Mapping

Tambah route mapping dalam `backend/server.js` untuk support both old and new endpoints:

```javascript
// After route imports, before other routes
import { authRoutes } from './routes/auth.js';

// Map old PHP endpoints to new routes
app.post('/api/login.php', (req, res, next) => {
  req.url = '/api/auth/login';
  req.path = '/api/auth/login';
  authRoutes(req, res, next);
});

app.post('/api/logout.php', (req, res, next) => {
  req.url = '/api/auth/logout';
  req.path = '/api/auth/logout';
  authRoutes(req, res, next);
});

app.get('/api/check_session.php', (req, res, next) => {
  req.url = '/api/auth/check_session';
  req.path = '/api/auth/check_session';
  authRoutes(req, res, next);
});
```

---

## 📋 Action Plan

1. **Check frontend console (F12)** untuk tengok exact endpoint yang dipanggil
2. **Add route mapping** dalam backend untuk support old endpoints
3. **Or update frontend** untuk guna new endpoints
4. **Restart frontend** untuk apply changes

---

## 🔍 Debug Steps

1. **Open browser console (F12)**
2. **Go to Network tab**
3. **Try login**
4. **Check failed requests:**
   - What URL is being called?
   - What's the error message?
   - What's the response status?

**Share the console output untuk saya boleh fix dengan tepat!**

---

**Mari saya tambah route mapping untuk support old PHP endpoints dalam Node.js backend!**
