# PHP to Node.js Migration Guide

## Overview

This guide documents the migration from PHP backend to Node.js/Express backend while maintaining all existing functionality.

## Project Structure

```
bita/
├── backend/
│   ├── config/
│   │   └── database.js          # MySQL connection pool
│   ├── middleware/
│   │   └── auth.js              # Authentication middleware
│   ├── routes/
│   │   ├── auth.js              # User authentication
│   │   ├── admin.js             # Admin authentication
│   │   ├── lecturer.js          # Lecturer authentication
│   │   ├── user.js              # User registration & profile
│   │   ├── module.js            # Module categories & files
│   │   ├── contact.js           # Contact admin requests
│   │   └── upload.js            # File uploads
│   ├── utils/
│   │   └── helpers.js           # Helper functions
│   └── server.js                # Express server entry point
├── src/                         # React frontend (unchanged)
├── api/                         # Old PHP APIs (can be removed after migration)
├── .env                         # Environment variables (not in git)
└── package.json                 # Updated with Node.js dependencies
```

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

This will install:
- `express` - Web framework
- `mysql2` - MySQL database driver
- `dotenv` - Environment variable management
- `bcrypt` - Password hashing
- `multer` - File upload handling
- `cors` - CORS middleware
- `express-session` - Session management
- `nodemailer` - Email sending

### 2. Create Environment File

Create a `.env` file in the project root (see `ENV_SETUP_EXAMPLE.md`):

```env
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-secret-key

DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bita_db

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3. Start Backend Server

```bash
npm run server
```

Or with auto-reload (nodemon):

```bash
npm run server:dev
```

Backend will run on `http://localhost:3001`

### 4. Update Frontend API Configuration

Update `src/utils/api.js` to point to Node.js backend:

```javascript
// For development
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

// For production
// const API_BASE_URL = 'https://your-production-backend.com';
```

### 5. Start Frontend

```bash
npm run dev
```

Frontend will run on `http://localhost:5173`

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/check_session` - Check user session

### Admin

- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/check_session` - Check admin session

### Lecturer

- `POST /api/lecturer/login` - Lecturer login
- `POST /api/lecturer/logout` - Lecturer logout
- `GET /api/lecturer/check_session` - Check lecturer session

### User

- `POST /api/user/register` - User registration
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

### Modules

- `GET /api/module/categories` - Get all categories
- `GET /api/module/category/:id` - Get category by ID
- `GET /api/module/week/:weekId/files` - Get files for a week
- `POST /api/module/category` - Create category (admin/lecturer)
- `PUT /api/module/category/:id` - Update category (admin/lecturer)
- `DELETE /api/module/category/:id` - Delete category (admin/lecturer)

### Contact

- `POST /api/contact/admin` - Submit contact admin request
- `GET /api/contact/requests` - Get all contact requests (admin)

### Upload

- `POST /api/upload/module` - Upload module file

## Migration Status

### ✅ Completed

- [x] Backend server setup
- [x] Database connection
- [x] Authentication middleware
- [x] User authentication (login, logout, session)
- [x] Admin authentication (login, logout, session)
- [x] Lecturer authentication (login, logout, session)
- [x] User registration
- [x] User profile (get, update)
- [x] Module categories (CRUD)
- [x] Module files (get files by week)
- [x] File uploads
- [x] Contact admin requests

### 🚧 In Progress

- [ ] Admin user management APIs
- [ ] Email sending functionality
- [ ] File deletion
- [ ] Admin dashboard APIs
- [ ] Module file management (update, delete, pin)
- [ ] Contact request management (resolve, delete)
- [ ] Member listing APIs
- [ ] Alumni APIs
- [ ] Admin logs
- [ ] Admin stats

### ⏳ Pending

- [ ] Complete all API migrations
- [ ] Frontend API URL updates
- [ ] Testing all endpoints
- [ ] Production deployment configuration

## Key Differences from PHP

### Session Management

**PHP:**
```php
session_start();
$_SESSION['user_id'] = $user_id;
```

**Node.js:**
```javascript
req.session.user_id = user_id;
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
$isValid = password_verify($password, $hash);
```

**Node.js:**
```javascript
const hash = await bcrypt.hash(password, 10);
const isValid = await bcrypt.compare(password, hash);
```

## Testing

### Test Backend Connection

```bash
curl http://localhost:3001/api/test_backend
```

### Test Login

```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@student.utem.edu.my","password":"test123"}'
```

## Deployment

### Development

1. Start MySQL (XAMPP)
2. Start backend: `npm run server`
3. Start frontend: `npm run dev`

### Production

1. Set environment variables
2. Build frontend: `npm run build`
3. Start backend: `npm run server`
4. Serve frontend build from `/dist`

## Notes

- All database tables remain unchanged
- Session storage uses express-session (can be configured for Redis/DB)
- File uploads stored in `./uploads/` directory
- CORS configured for frontend URL
- All APIs return JSON responses

## Troubleshooting

### Database Connection Failed

- Check `.env` file has correct DB credentials
- Verify MySQL is running
- Check database exists

### Port Already in Use

- Change `PORT` in `.env` file
- Or kill process using port 3001

### Session Not Working

- Check `SESSION_SECRET` is set in `.env`
- Verify CORS credentials enabled
- Check cookie settings

## Next Steps

1. Complete remaining API migrations
2. Update frontend to use new backend URLs
3. Test all functionality end-to-end
4. Configure production deployment
5. Remove old PHP files after verification

