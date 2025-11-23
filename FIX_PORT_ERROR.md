# 🔧 Fix: Port 3001 Already in Use

## ❌ Error
```
Error: listen EADDRINUSE: address already in use :::3001
```

**Meaning:** Port 3001 sudah digunakan oleh process lain (kemungkinan besar server Node.js yang sebelumnya masih running).

---

## ✅ Penyelesaian

### **Option 1: Kill Process yang Menggunakan Port 3001**

#### **Step 1: Find Process ID (PID)**

```powershell
netstat -ano | findstr :3001
```

Output akan macam ni:
```
TCP    0.0.0.0:3001    0.0.0.0:0    LISTENING    12345
```

Nombor terakhir (contoh: `12345`) adalah **PID**.

#### **Step 2: Kill Process**

```powershell
taskkill /PID 12345 /F
```

(Replace `12345` dengan PID yang betul dari step 1)

#### **Step 3: Start Server Lagi**

```bash
npm run server
```

---

### **Option 2: Guna Port Lain**

#### **Step 1: Update `.env` File**

Tambah atau update line ini dalam `.env`:

```env
PORT=3002
VITE_API_URL=http://localhost:3002
```

#### **Step 2: Restart Server**

```bash
npm run server
```

Server akan run pada port 3002.

**⚠️ Jangan lupa update `.env` dengan `VITE_API_URL=http://localhost:3002`!**

---

### **Option 3: Kill Semua Node.js Processes**

**⚠️ WARNING:** Ini akan kill semua Node.js processes!

```powershell
taskkill /F /IM node.exe
```

Lepas tu start server lagi:

```bash
npm run server
```

---

## 🎯 Recommended: Option 1

**Paling selamat** - hanya kill process yang specific.

### **Quick Command (Copy & Paste):**

```powershell
# Find PID
$pid = (Get-NetTCPConnection -LocalPort 3001 -ErrorAction SilentlyContinue).OwningProcess

# Kill process
if ($pid) {
    taskkill /PID $pid /F
    Write-Host "✅ Process killed. Now run: npm run server"
} else {
    Write-Host "❌ No process found on port 3001"
}
```

---

## ✅ After Fixing

1. **Kill process** (Option 1, 2, atau 3)
2. **Start server:**
   ```bash
   npm run server
   ```
3. **Should show:**
   ```
   🚀 BITA Backend Server running on port 3001
   ```

---

## 🔍 Prevention

**Untuk elak masalah ni di masa depan:**

1. **Always stop server properly:**
   - Press `Ctrl+C` dalam terminal backend
   - Jangan tutup terminal secara paksa

2. **Or use nodemon** (auto-restart, tapi handle process better):
   ```bash
   npm run server:dev
   ```

---

**After kill process, try `npm run server` lagi!**

