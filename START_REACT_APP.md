# Cara Start React App - BITA Website

## ❌ MASALAH ANDA:

Anda access `http://localhost/bita` dan dapat:
```json
{"success":false,"message":"Not Found"}
```

**Sebab:** React app **TIDAK RUNNING** - perlu start Vite dev server dulu!

---

## ✅ CARA BETUL:

### Step 1: Buka Terminal/Command Prompt

1. Tekan `Windows + R`
2. Type: `cmd` atau `powershell`
3. Tekan Enter

### Step 2: Navigate ke Folder Project

```bash
cd C:\xampp\htdocs\bita
```

### Step 3: Pastikan XAMPP Running

**Buka XAMPP Control Panel:**
- Pastikan **Apache** running (hijau)
- Pastikan **MySQL** running (hijau)

### Step 4: Start React App

```bash
npm start
```

atau

```bash
npm run dev
```

### Step 5: Browser Akan Auto-Open

Browser akan automatically buka di:
```
http://localhost:5173
```

**INI ADALAH URL YANG BETUL!** ✅

---

## 📝 PENJELASAN:

### URL Yang Betul vs Salah:

| URL | Apa Itu? | Status |
|-----|----------|--------|
| `http://localhost/bita` | PHP Backend sahaja (index.php) | ❌ Bukan untuk React app |
| `http://localhost:5173` | React App + Vite Dev Server | ✅ **INILAH YANG BETUL!** |
| `http://localhost/bita/api/*` | PHP API endpoints | ✅ Untuk backend API sahaja |

### Cara Ia Berfungsi:

1. **Vite Dev Server** (port 5173):
   - Serve React app
   - Handle routing
   - Hot reload untuk development

2. **Vite Proxy**:
   - Semua request ke `/api/*` akan di-proxy ke `http://localhost/bita/api/*`
   - Jadi API calls akan tetap work dengan XAMPP Apache

3. **XAMPP Apache** (port 80):
   - Serve PHP backend files
   - Handle database connections
   - Process API requests

---

## 🎯 CHECKLIST SEBELUM START:

- [ ] XAMPP Apache running (port 80)
- [ ] XAMPP MySQL running
- [ ] Terminal/Command Prompt open
- [ ] Sudah navigate ke folder: `C:\xampp\htdocs\bita`
- [ ] Run `npm start` atau `npm run dev`
- [ ] Browser auto-open di `http://localhost:5173`

---

## 🚨 ERROR YANG MUNGKIN TERCATAT:

### Error: `npm` is not recognized

**Sebab:** Node.js belum install atau tidak dalam PATH

**Fix:**
1. Install Node.js: https://nodejs.org/
2. Restart terminal
3. Run `npm --version` untuk verify

### Error: Port 5173 already in use

**Sebab:** Port 5173 sudah digunakan

**Fix:**
1. Close application yang guna port 5173
2. Atau tukar port dalam `vite.config.js`

### Error: Cannot connect to XAMPP Apache

**Sebab:** XAMPP Apache tidak running

**Fix:**
1. Buka XAMPP Control Panel
2. Start Apache (hijau)

---

## 📱 CARA GUNA WEBSITE:

### 1. Start Development:

```bash
# Terminal 1: Start React App
cd C:\xampp\htdocs\bita
npm start

# Browser akan auto-open di http://localhost:5173
```

### 2. Access Website:

```
http://localhost:5173
```

**INI ADALAH URL YANG BETUL!** ✅

### 3. Test Contact Admin Form:

1. Login dulu (jika belum)
2. Pergi ke "Contact Admin" page
3. Isi form:
   - Message (wajib)
   - Phone (optional)
4. Submit
5. Check console (F12 → Console tab) untuk debug

---

## 🔍 DEBUG CONTACT ADMIN FORM:

Setelah React app running di `http://localhost:5173`:

1. **Tekan F12** → Buka Console tab
2. **Submit form** di Contact Admin page
3. **Screenshot console** yang menunjukkan:
   - "Submitting form data: ..."
   - "User data: ..."
   - "Response status: ..."
   - "API Response: ..."

---

## ✅ QUICK START:

```bash
# 1. Buka Terminal
cd C:\xampp\htdocs\bita

# 2. Pastikan XAMPP Running (check XAMPP Control Panel)

# 3. Start React App
npm start

# 4. Browser akan auto-open di http://localhost:5173
```

---

**TIPS:** 
- Jangan tutup terminal semasa development - React app perlu running
- Untuk stop React app: tekan `Ctrl + C` dalam terminal
- Setiap kali nak test website, kena run `npm start` dulu!

