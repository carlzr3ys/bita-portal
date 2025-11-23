# BITA Portal API - Node.js Backend

Backend API untuk BITA Portal yang dikonversi dari PHP ke Node.js.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Copy `.env.example` ke `.env` dan sesuaikan konfigurasi:
```bash
cp .env.example .env
```

3. Edit file `.env` dengan konfigurasi database dan lainnya sesuai kebutuhan.

4. Jalankan server:
```bash
npm start
```

Untuk development dengan auto-reload:
```bash
npm run dev
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/admin/login` - Admin login
- `POST /api/auth/lecturer/login` - Lecturer login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `POST /api/auth/admin/logout` - Admin logout
- `POST /api/auth/lecturer/logout` - Lecturer logout
- `GET /api/auth/check-session` - Check user session
- `GET /api/auth/check-admin-session` - Check admin session
- `GET /api/auth/check-lecturer-session` - Check lecturer session

### Users
- `GET /api/users/all` - Get all users (admin only)
- `GET /api/users/pending` - Get pending users (admin only)
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/profile/:id` - Get user profile
- `POST /api/users/update-profile` - Update user profile
- `POST /api/users/approve` - Approve user (admin only)
- `POST /api/users/reject` - Reject user (admin only)
- `DELETE /api/users/:id` - Delete user (admin only)
- `GET /api/users/members/all` - Get all members
- `GET /api/users/alumni/all` - Get all alumni

### Admin
- `GET /api/admin/all` - Get all admins (superadmin only)
- `POST /api/admin/save` - Create/update admin (superadmin only)
- `DELETE /api/admin/:id` - Delete admin (superadmin only)
- `GET /api/admin/logs` - Get admin logs

### Modules
- `GET /api/modules/all` - Get all modules (legacy)
- `GET /api/modules/files/all` - Get all module files (admin only)
- `GET /api/modules/files/week/:weekId` - Get week files
- `POST /api/modules/files/upload` - Upload module file
- `POST /api/modules/files/update` - Update module file
- `DELETE /api/modules/files/:id` - Delete module file
- `POST /api/modules/files/toggle-pin` - Toggle pin file (admin only)
- `GET /api/modules/files/my-uploads` - Get my uploads

### Categories
- `GET /api/categories/all` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories/create` - Create category (admin only)
- `POST /api/categories/update` - Update category (admin only)
- `DELETE /api/categories/:id` - Delete category (admin only)

### Messages
- `GET /api/messages/conversations` - Get conversations (admin only)
- `GET /api/messages/requests` - Get message requests (admin only)
- `POST /api/messages/accept-request` - Accept message request (admin only)
- `POST /api/messages/send` - Send message (admin only)
- `GET /api/messages/:conversationId` - Get messages for conversation

### Contact
- `POST /api/contact/contact` - Contact admin (user only)
- `GET /api/contact/requests` - Get contact requests (admin only)
- `POST /api/contact/resolve` - Resolve contact request (admin only)
- `POST /api/contact/undo-resolve` - Undo resolve contact request (admin only)
- `DELETE /api/contact/:id` - Delete contact request (admin only)

### Stats
- `GET /api/stats/admin` - Get admin stats

## Environment Variables

Lihat `.env.example` untuk daftar lengkap environment variables yang diperlukan.

## Notes

- Semua endpoint menggunakan session-based authentication
- File uploads disimpan di folder `uploads/` (dapat dikonfigurasi via `UPLOAD_DIR`)
- Database menggunakan MySQL/MariaDB
- Session menggunakan express-session dengan cookie-based storage
