# Environment Variables Setup

Copy the following content to a `.env` file in the project root:

```env
# BITA Backend Environment Variables

# Server Configuration
NODE_ENV=development
PORT=3001
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your-super-secret-session-key-change-this-in-production

# Database Configuration (MySQL)
DB_HOST=localhost
DB_USER=root
DB_PASS=
DB_NAME=bita_db

# SMTP Configuration (for emails)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password

# File Upload Configuration
UPLOAD_DIR=./uploads
MAX_FILE_SIZE=52428800
# 50MB in bytes

# FTP Storage Configuration (Optional - for remote storage)
USE_FTP_STORAGE=false
FTP_HOST=
FTP_USER=
FTP_PASS=
FTP_PORT=21
FTP_USE_SSL=false
FTP_BASE_DIR=/public_html/
CPANEL_DOMAIN=

# Production URLs (for deployment)
# FRONTEND_URL=https://bitaportal.netlify.app
# DB_HOST=your-production-db-host
# DB_USER=your-production-db-user
# DB_PASS=your-production-db-password
# DB_NAME=your-production-db-name
```

## Instructions

1. Create a `.env` file in the project root
2. Copy the above content
3. Fill in your actual values
4. **DO NOT commit** the `.env` file to Git (already in `.gitignore`)

