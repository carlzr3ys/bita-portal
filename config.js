require('dotenv').config();

module.exports = {
  // Database Configuration
  db: {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'bita_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  },

  // SMTP Configuration
  smtp: {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || '',
    pass: process.env.SMTP_PASS || ''
  },

  // File Upload Configuration
  upload: {
    dir: process.env.UPLOAD_DIR || __dirname + '/uploads/',
    maxSize: 5 * 1024 * 1024, // 5MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
  },

  // FTP Storage Configuration (Optional)
  ftp: {
    useFtpStorage: process.env.USE_FTP_STORAGE === 'true' || false,
    host: process.env.FTP_HOST || '',
    user: process.env.FTP_USER || '',
    password: process.env.FTP_PASS || '',
    port: parseInt(process.env.FTP_PORT) || 21,
    useSsl: process.env.FTP_USE_SSL === 'true' || false,
    baseDir: process.env.FTP_BASE_DIR || '/public_html/',
    domain: process.env.CPANEL_DOMAIN || ''
  },

  // CORS Configuration
  cors: {
    origin: process.env.NETLIFY_URL || process.env.ALLOWED_ORIGIN || '*',
    credentials: true
  },

  // Session Configuration
  session: {
    secret: process.env.SESSION_SECRET || 'bita-secret-key-change-in-production',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
  },

  // Server Configuration
  server: {
    port: process.env.PORT || 3000
  }
};

