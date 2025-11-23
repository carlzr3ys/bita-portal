# PHP to Node.js Migration - Quick Start

## ✅ What's Been Set Up

### 1. Backend Structure Created

```
backend/
├── server.js                 # Express server
├── config/
│   └── database.js          # MySQL connection pool
├── middleware/
│   └── auth.js              # Auth middleware (user, admin, lecturer)
├── routes/
│   ├── auth.js              # ✅ User login/logout/session
│   ├── admin.js             # ✅ Admin login/logout/session
│   ├── lecturer.js          # ✅ Lecturer login/logout/session
│   ├── user.js              # ✅ User registration/profile
│   ├── module.js            # ✅ Module categories CRUD
│   ├── contact.js           # ✅ Contact admin requests
│   └── upload.js            # ✅ File uploads
└── utils/
    └── helpers.js           # Helper functions
```

### 2. Core APIs Migrated

- ✅ User authentication (login, logout, check session)
- ✅ Admin authentication (login, logout, check session)
- ✅ Lecturer authentication (login, logout, check session)
- ✅ User registration
- ✅ User profile (get, update)
- ✅ Module categories (get, create, update, delete)
- ✅ Module files (get by week)
- ✅ File uploads
- ✅ Contact admin requests

### 3. Dependencies Added to package.json

- `express` - Web framework
- `mysql2` - MySQL driver
- `dotenv` - Environment variables
- `bcrypt` - Password hashing
- `multer` - File uploads
- `cors` - CORS middleware
- `express-session` - Session management
- `nodemailer` - Email sending

---

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create .env File

Create `.env` file in project root (see `ENV_SETUP_EXAMPLE.md`):

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-secret-key-change-this

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bita_db
```

### Step 3: Start Backend

```bash
npm run server
```

Or with auto-reload:

```bash
npm run server:dev
```

Backend will run on `http://localhost:3001`

### Step 4: Test Backend

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

---

## 📋 Next Steps

### 1. Update Frontend API Configuration

The frontend currently uses PHP APIs. To switch to Node.js:

**Option A: Update `.env` file for local development:**

```env
VITE_API_URL=http://localhost:3001
```

**Option B: Keep both backends running:**
- PHP backend: `http://localhost:80/bita/api/`
- Node.js backend: `http://localhost:3001/api/`

Switch by changing `VITE_API_URL` in `.env`

### 2. Continue API Migration

Still need to migrate:

- [ ] Admin user management (get_users, update_user, delete_user, approve_user, reject_user)
- [ ] Admin dashboard APIs (get_admin_stats, get_admin_logs)
- [ ] Module file management (update_file, delete_file, toggle_pin, get_my_uploads)
- [ ] Contact request management (resolve, delete, undo)
- [ ] Member listing (get_members, get_alumni)
- [ ] Email sending functionality
- [ ] Admin management (get_admins, save_admin, delete_admin)

### 3. Testing Checklist

After migration, test each endpoint:

- [ ] User login/logout
- [ ] Admin login/logout
- [ ] Lecturer login/logout
- [ ] User registration
- [ ] User profile (get/update)
- [ ] Module categories (CRUD)
- [ ] File uploads
- [ ] Contact admin requests

---

## 🔄 Running Both Backends

### Current Setup (Recommended for Testing)

1. **PHP Backend (Current):**
   - XAMPP running on port 80
   - APIs at `http://localhost/bita/api/`

2. **Node.js Backend (New):**
   - Running on port 3001
   - APIs at `http://localhost:3001/api/`

### Switch Frontend Between Backends

Update `.env`:

```env
# For PHP backend
VITE_API_URL=http://localhost/bita

# For Node.js backend
VITE_API_URL=http://localhost:3001
```

Then restart frontend: `npm run dev`

---

## 🗄️ Database

- **No database migration needed!**
- Same MySQL database (`bita_db`)
- Same tables and structure
- Node.js connects to same database as PHP

---

## 🔐 Sessions

- **PHP:** Uses PHP sessions (`$_SESSION`)
- **Node.js:** Uses express-session (same cookie-based approach)
- Sessions stored in memory (can be configured for Redis/DB in production)

---

## 📝 Notes

1. **Environment Variables:**
   - Create `.env` file from `ENV_SETUP_EXAMPLE.md`
   - Never commit `.env` to Git (already in `.gitignore`)

2. **File Uploads:**
   - Files stored in `./uploads/` directory
   - Same structure as PHP version

3. **CORS:**
   - Configured for `FRONTEND_URL` from `.env`
   - Default: `http://localhost:5173`

4. **Error Handling:**
   - All errors return JSON with `success: false`
   - Error messages logged to console

---

## 🐛 Troubleshooting

### Database Connection Failed

- Check `.env` has correct DB credentials
- Verify MySQL is running (XAMPP)
- Check database exists

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Or change PORT in .env
PORT=3002
```

### Session Not Working

- Check `SESSION_SECRET` is set in `.env`
- Verify CORS credentials enabled
- Clear browser cookies

---

## 📚 Documentation

- **Full Migration Guide:** `MIGRATION_GUIDE.md`
- **Environment Setup:** `ENV_SETUP_EXAMPLE.md`
- **API Endpoints:** See `MIGRATION_GUIDE.md`

---

## ✅ Migration Progress

**Completed:** ~40%  
**Remaining:** ~60%

**Next Priority:**
1. Admin user management APIs
2. Module file management APIs
3. Email functionality
4. Admin dashboard APIs

