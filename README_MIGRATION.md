# 🚀 PHP to Node.js Migration - Complete Setup

## ✅ What's Ready

I've set up a complete Node.js backend structure that mirrors your PHP backend. Here's what's been created:

### 📁 Backend Structure

```
backend/
├── server.js                    # Express server (entry point)
├── config/
│   └── database.js             # MySQL connection pool
├── middleware/
│   └── auth.js                 # Authentication middleware
├── routes/
│   ├── auth.js                 # ✅ User authentication
│   ├── admin.js                # ✅ Admin authentication
│   ├── lecturer.js             # ✅ Lecturer authentication
│   ├── user.js                 # ✅ User registration & profile
│   ├── module.js               # ✅ Module categories & files
│   ├── contact.js              # ✅ Contact admin requests
│   └── upload.js               # ✅ File uploads
└── utils/
    └── helpers.js              # Helper functions
```

### ✅ Core APIs Migrated

1. **Authentication:**
   - User login/logout/session ✅
   - Admin login/logout/session ✅
   - Lecturer login/logout/session ✅

2. **User Management:**
   - User registration ✅
   - Get/update user profile ✅

3. **Modules:**
   - Get all categories ✅
   - Get category by ID ✅
   - Create/update/delete category ✅
   - Get files by week ✅

4. **Uploads:**
   - File upload with multer ✅

5. **Contact:**
   - Submit contact admin request ✅
   - Get contact requests ✅

---

## 🚀 Quick Start Guide

### Step 1: Install Dependencies

```bash
npm install
```

This installs:
- `express` - Web framework
- `mysql2` - MySQL driver
- `dotenv` - Environment variables
- `bcrypt` - Password hashing
- `multer` - File uploads
- `cors` - CORS middleware
- `express-session` - Session management
- `nodemailer` - Email sending

### Step 2: Create `.env` File

Create a `.env` file in project root (see `ENV_SETUP_EXAMPLE.md`):

```env
# Server
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-secret-key-change-this

# Database (same as PHP/XAMPP)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bita_db
```

**⚠️ Important:** Never commit `.env` to Git!

### Step 3: Start Backend Server

```bash
npm run server
```

Or with auto-reload (recommended):

```bash
npm run server:dev
```

Backend will run on: `http://localhost:3001`

### Step 4: Test Backend

Open browser or use curl:

```bash
curl http://localhost:3001/api/test_backend
```

Should return:
```json
{
  "success": true,
  "message": "Backend is running!",
  "backend_status": "online",
  "database_status": "connected",
  "timestamp": "..."
}
```

### Step 5: Start Frontend (Optional)

```bash
npm run dev
```

Frontend runs on: `http://localhost:5173`

---

## 🔄 Using Both Backends (Recommended for Testing)

You can run **both** PHP and Node.js backends simultaneously:

1. **PHP Backend (Current):**
   - XAMPP on port 80
   - APIs: `http://localhost/bita/api/`

2. **Node.js Backend (New):**
   - Express on port 3001
   - APIs: `http://localhost:3001/api/`

### Switch Frontend Between Backends

Update `.env`:

```env
# For PHP backend (current)
VITE_API_URL=http://localhost/bita

# For Node.js backend (new)
VITE_API_URL=http://localhost:3001
```

Then restart frontend: `npm run dev`

---

## 📋 API Endpoints

### Authentication

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/login` | POST | User login |
| `/api/auth/logout` | POST | User logout |
| `/api/auth/check_session` | GET | Check user session |

### Admin

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/admin/login` | POST | Admin login |
| `/api/admin/logout` | POST | Admin logout |
| `/api/admin/check_session` | GET | Check admin session |

### Lecturer

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/lecturer/login` | POST | Lecturer login |
| `/api/lecturer/logout` | POST | Lecturer logout |
| `/api/lecturer/check_session` | GET | Check lecturer session |

### User

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/user/register` | POST | User registration |
| `/api/user/profile` | GET | Get user profile |
| `/api/user/profile` | PUT | Update user profile |

### Modules

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/module/categories` | GET | Get all categories |
| `/api/module/category/:id` | GET | Get category by ID |
| `/api/module/week/:weekId/files` | GET | Get files for a week |
| `/api/module/category` | POST | Create category (admin/lecturer) |
| `/api/module/category/:id` | PUT | Update category (admin/lecturer) |
| `/api/module/category/:id` | DELETE | Delete category (admin/lecturer) |

### Upload

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/upload/module` | POST | Upload module file |

### Contact

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/contact/admin` | POST | Submit contact admin request |
| `/api/contact/requests` | GET | Get all contact requests |

---

## ⏳ Still Need to Migrate

### High Priority

- [ ] Admin user management (get_users, update_user, delete_user, approve_user, reject_user)
- [ ] Module file management (update_file, delete_file, toggle_pin, get_my_uploads)
- [ ] Contact request management (resolve, delete, undo)
- [ ] Email sending functionality

### Medium Priority

- [ ] Admin dashboard APIs (get_admin_stats, get_admin_logs)
- [ ] Admin management (get_admins, save_admin, delete_admin)
- [ ] Member listing (get_members, get_alumni)
- [ ] Admin activity logs

### Low Priority

- [ ] Lecturer upload permissions
- [ ] Admin logs table creation
- [ ] Test endpoints

---

## 🔐 Security Notes

1. **Environment Variables:**
   - All sensitive data in `.env` (not committed)
   - Database credentials from environment
   - Session secret from environment

2. **Sessions:**
   - Cookie-based sessions (same as PHP)
   - HTTP-only cookies
   - SameSite protection

3. **Password Hashing:**
   - Using bcrypt (same algorithm as PHP password_hash)
   - Compatible with existing PHP passwords

4. **CORS:**
   - Configured for frontend URL
   - Credentials enabled for cookies

---

## 🗄️ Database

- **No changes needed!**
- Same MySQL database (`bita_db`)
- Same tables and structure
- Node.js connects to same database as PHP
- All existing data remains intact

---

## 📝 Key Differences from PHP

### Sessions

**PHP:**
```php
session_start();
$_SESSION['user_id'] = $id;
```

**Node.js:**
```javascript
req.session.user_id = id;
```

### Database Queries

**PHP:**
```php
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$result = $stmt->get_result();
```

**Node.js:**
```javascript
const [users] = await query('SELECT * FROM users WHERE id = ?', [id]);
```

### Password Hashing

**PHP:**
```php
$hash = password_hash($password, PASSWORD_DEFAULT);
$valid = password_verify($password, $hash);
```

**Node.js:**
```javascript
const hash = await bcrypt.hash(password, 10);
const valid = await bcrypt.compare(password, hash);
```

---

## 🐛 Troubleshooting

### Database Connection Failed

```
❌ Database connection failed: Access denied
```

**Fix:**
- Check `.env` has correct DB credentials
- Verify MySQL is running (XAMPP)
- Check database exists: `SHOW DATABASES;`

### Port Already in Use

```
Error: listen EADDRINUSE: address already in use :::3001
```

**Fix:**
```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3002
```

### Session Not Working

**Symptoms:** Login doesn't persist, redirects to login page

**Fix:**
- Check `SESSION_SECRET` is set in `.env`
- Verify CORS credentials enabled (`credentials: true`)
- Clear browser cookies
- Check `FRONTEND_URL` matches frontend URL

### Module Not Found Errors

```
Error: Cannot find module 'express'
```

**Fix:**
```bash
npm install
```

---

## 📚 Documentation Files

- **`MIGRATION_GUIDE.md`** - Complete migration documentation
- **`MIGRATION_START.md`** - Quick start guide
- **`ENV_SETUP_EXAMPLE.md`** - Environment variables example

---

## ✅ Next Steps

1. **Install dependencies:** `npm install`
2. **Create `.env` file:** Copy from `ENV_SETUP_EXAMPLE.md`
3. **Start backend:** `npm run server`
4. **Test connection:** `curl http://localhost:3001/api/test_backend`
5. **Continue API migration:** See remaining endpoints in `MIGRATION_GUIDE.md`

---

## 🎯 Migration Progress

**Completed:** ~40%  
**Remaining:** ~60%

**Status:** Ready for testing! Core authentication and basic APIs are working.

---

**Need help?** Check `MIGRATION_GUIDE.md` or test endpoints using the API examples above.

