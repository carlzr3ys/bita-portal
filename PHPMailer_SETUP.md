# PHPMailer Setup Guide - BITA Portal

Panduan untuk setup email menggunakan **PHPMailer** (Pure PHP, No Python Required!)

## 🎯 Kenapa PHPMailer?

- ✅ **Pure PHP** - Tak perlu Python atau external dependencies
- ✅ **Very Popular** - Industry standard untuk PHP email
- ✅ **Reliable** - Support SMTP dengan TLS/SSL
- ✅ **Easy Setup** - Install sekali, guna terus
- ✅ **Well Maintained** - Active development dan community

## 📦 Installation Methods

### Method 1: Manual Download (Recommended untuk XAMPP)

1. **Download PHPMailer:**
   - Pergi ke: https://github.com/PHPMailer/PHPMailer/releases
   - Download latest version (e.g., `PHPMailer-6.9.1.zip`)

2. **Extract dan Install:**
   ```bash
   # Extract PHPMailer zip file
   # Copy folder structure to:
   api/phpmailer/
     ├── src/
     │   ├── PHPMailer.php
     │   ├── SMTP.php
     │   └── Exception.php
     └── ...
   ```

3. **Verify Installation:**
   - Check if file exists: `api/phpmailer/src/PHPMailer.php`
   - System akan auto-detect dan guna PHPMailer

### Method 2: Composer (Jika ada Composer)

```bash
cd c:\xampp\htdocs\bita
composer require phpmailer/phpmailer
```

PHPMailer akan install dalam `vendor/phpmailer/phpmailer/`

## ⚙️ Configuration

### Setup SMTP dalam `config.php`

```php
// SMTP Configuration for PHPMailer
define('SMTP_HOST', 'smtp.gmail.com');      // Gmail SMTP
define('SMTP_PORT', 587);                    // Port untuk TLS
define('SMTP_USER', 'bitaadm2425@gmail.com'); // Gmail anda
define('SMTP_PASS', 'zvus dklg hxvh pkdz');    // Gmail App Password
```

### Gmail Setup (Recommended untuk Testing)

1. **Enable 2-Step Verification:**
   - https://myaccount.google.com/security
   - Turn on "2-Step Verification"

2. **Create App Password:**
   - https://myaccount.google.com/apppasswords
   - Select "Mail" dan device
   - Copy generated password
   - **Important:** Guna App Password ini dalam `SMTP_PASS`, BUKAN regular password   zvus dklg hxvh pkdz

### Outlook Setup

```php
define('SMTP_HOST', 'smtp-mail.outlook.com');
define('SMTP_PORT', 587);
define('SMTP_USER', 'your-email@outlook.com');
define('SMTP_PASS', 'your-password');
```

### Custom SMTP Server

```php
define('SMTP_HOST', 'smtp.your-domain.com');
define('SMTP_PORT', 587);  // atau 465 untuk SSL
define('SMTP_USER', 'your-email@your-domain.com');
define('SMTP_PASS', 'your-password');
```

## 🔄 How It Works

System akan **auto-detect** dan guna PHPMailer jika:
1. ✅ PHPMailer installed
2. ✅ SMTP configuration dalam `config.php`

**Priority Order:**
1. **PHPMailer** (Pure PHP, Recommended) ⭐
2. Python email script (if available)
3. PHP mail() function (fallback, least reliable)

## 🧪 Testing

### Test PHPMailer Installation

1. **Check if PHPMailer detected:**
   - Buka: `http://localhost/bita/api/test_email.php?email=your@email.com`
   - Check console/response untuk "PHPMailer" messages

2. **Test Email Sending:**
   - Same test script akan guna PHPMailer automatically
   - Check inbox (dan spam folder)

### Manual Test (Optional)

Create `api/test_phpmailer.php`:
```php
<?php
require_once '../config.php';
require_once 'send_email_phpmailer.php';

$smtpConfig = getSMTPConfigPHPMailer();
if (PHPMAILER_AVAILABLE) {
    echo "✅ PHPMailer is available<br>";
    if (!empty($smtpConfig['host']) && !empty($smtpConfig['user'])) {
        echo "✅ SMTP is configured<br>";
    } else {
        echo "❌ SMTP not configured<br>";
    }
} else {
    echo "❌ PHPMailer is not installed<br>";
}
?>
```

## 🐛 Troubleshooting

### PHPMailer not found
```
PHPMailer is not installed
```
**Solution:**
- Download dan extract PHPMailer ke `api/phpmailer/`
- Check file structure: `api/phpmailer/src/PHPMailer.php` exists

### SMTP Authentication Error
```
SMTP Error: Could not authenticate
```
**Solution:**
- Check `SMTP_USER` dan `SMTP_PASS` betul
- Untuk Gmail: Guna App Password (bukan regular password)
- Enable "Less Secure App Access" (jika available) atau guna App Password

### Connection Timeout
```
SMTP Error: Connection timed out
```
**Solution:**
- Check `SMTP_HOST` dan `SMTP_PORT` betul
- Check firewall tidak block SMTP port (587 atau 465)
- Try port 465 dengan SSL instead of 587 dengan STARTTLS

### Port 465 SSL Error
Jika port 465, tukar dalam `send_email_phpmailer.php`:
```php
$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Untuk SSL (port 465)
// atau
$mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS; // Untuk STARTTLS (port 587)
```

## 📝 File Structure

```
api/
├── send_email.php              # Main email functions (auto-detect)
├── send_email_phpmailer.php    # PHPMailer wrapper (NEW!)
├── send_email_python.php       # Python wrapper (optional)
├── send_email.py               # Python script (optional)
├── phpmailer/                  # PHPMailer installation folder
│   └── src/
│       ├── PHPMailer.php
│       ├── SMTP.php
│       └── Exception.php
└── test_email.php              # Test script
```

## ✅ Advantages of PHPMailer

1. **No External Dependencies** - Pure PHP, tak perlu Python
2. **Better Error Messages** - Detailed error reporting
3. **Security** - Built-in security features
4. **Features** - Support attachments, embedded images, etc.
5. **Documentation** - Excellent documentation dan examples

## 📚 Resources

- PHPMailer GitHub: https://github.com/PHPMailer/PHPMailer
- PHPMailer Documentation: https://github.com/PHPMailer/PHPMailer/wiki
- Gmail App Passwords: https://support.google.com/accounts/answer/185833

## 🚀 Quick Start

1. Download PHPMailer → Extract to `api/phpmailer/`
2. Configure SMTP dalam `config.php`
3. Test dengan `api/test_email.php`
4. Done! ✅

**That's it!** PHPMailer akan automatically digunakan untuk semua email sending.

