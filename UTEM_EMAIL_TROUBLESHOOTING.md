# 🔍 UTeM Email Troubleshooting Guide

Masalah: Email boleh hantar ke email lain, tapi ke **@student.utem.edu.my** tak sampai.

## 🔎 Kemungkinan Punca

### 1. **Email Masuk Spam/Junk Folder** (Most Common!)
- UTeM email servers kadang filter emails dari external sources
- Check **Spam/Junk folder** dalam UTeM email
- Student perlu check spam folder, bukan inbox sahaja

### 2. **UTeM Email Server Block External SMTP**
- UTeM email servers mungkin block emails dari Gmail SMTP
- Ini adalah common security measure untuk prevent spam
- Email technically "sent" tapi blocked oleh UTeM server

### 3. **Domain Reputation Issue**
- Sender domain (`bitaadm2425@gmail.com`) mungkin belum trusted oleh UTeM
- UTeM email filters mungkin reject emails dari new/unverified senders

### 4. **SPF/DKIM Records**
- UTeM email servers check SPF/DKIM records
- Gmail automatically handles this, tapi kadang masih rejected

## ✅ Solutions & Fixes

### Solution 1: Update Sender Email (Already Fixed!)
```php
// Now using verified Gmail address as sender
$fromEmail = 'bitaadm2425@gmail.com'; // Verified Gmail account
```
- System dah update untuk guna Gmail verified address
- Ini membantu avoid domain blocking issues

### Solution 2: Check Spam Folder
**Important:** Minta student check **Spam/Junk folder**, bukan inbox sahaja!
- Email mungkin dah sampai, tapi masuk spam
- Student perlu check spam folder
- Kalau ada dalam spam, mark as "Not Spam" untuk future emails

### Solution 3: Add Whitelist (If Possible)
- Contact UTeM IT department untuk whitelist sender email
- Request: `bitaadm2425@gmail.com`
- Explain: Ini adalah official BITA Portal email notification system

### Solution 4: Use UTeM Email Server (Alternative)
Jika UTeM ada SMTP server untuk internal use:
```php
// In config.php
define('SMTP_HOST', 'smtp.utem.edu.my'); // UTeM SMTP (if available)
define('SMTP_PORT', 587);
define('SMTP_USER', 'bita@utem.edu.my'); // UTeM email address
define('SMTP_PASS', 'utem-password');
```

### Solution 5: Enable SMTP Debug (For Testing)
Uncomment dalam `api/send_email_phpmailer.php`:
```php
$mail->SMTPDebug = \PHPMailer\PHPMailer\SMTP::DEBUG_SERVER;
```
Ini akan show detailed SMTP conversation untuk debug.

## 🧪 Testing Steps

### Step 1: Test dengan Email Lain
1. Hantar test email ke Gmail/Hotmail/etc
2. Confirm email sampai ✅
3. Confirm sender: `bitaadm2425@gmail.com`

### Step 2: Test dengan UTeM Email
1. Hantar test email ke UTeM student email
2. Check inbox AND spam folder
3. Kalau tak ada dalam kedua-dua, email likely blocked oleh UTeM

### Step 3: Check Email Headers
Jika email sampai dalam spam:
- Open email → View headers
- Check "Received" headers untuk tengok path
- Check "X-Spam" score atau reasons

## 📝 Notes untuk Students

Tambah dalam email template:
```
Important: Please check your Spam/Junk folder if you don't see this email in your inbox.
```

Atau tambah dalam success message:
```
Email telah dihantar. Sila check inbox DAN spam folder anda.
```

## 🔧 Additional Improvements

### 1. Add Email Logging
Log semua emails yang dihantar untuk tracking:
```php
// Log email sending
$logMessage = date('Y-m-d H:i:s') . " - Email sent to: $to - Status: " . ($result ? 'Success' : 'Failed');
error_log($logMessage);
```

### 2. Add Retry Logic
Jika email failed, retry dengan delay:
```php
// Retry email sending 3 times
for ($i = 0; $i < 3; $i++) {
    if (sendEmail(...)) {
        break;
    }
    sleep(2); // Wait 2 seconds before retry
}
```

### 3. Add Delivery Receipt
Gunakan read receipt (jika support):
```php
$mail->ConfirmReadingTo = $fromEmail;
```

## 🎯 Immediate Actions

1. ✅ **Update Sender Email** - Done! System dah guna verified Gmail address
2. ✅ **Add Better Headers** - Done! Added priority headers
3. ⚠️ **Check Spam Folder** - Minta students check spam folder
4. ⚠️ **Contact UTeM IT** - If possible, request whitelist sender email

## 📞 Next Steps

Jika masih tak dapat:
1. Check PHP error logs untuk SMTP errors
2. Enable SMTP debug untuk see detailed conversation
3. Test dengan different UTeM email addresses
4. Contact UTeM IT department untuk assistance

---

**Current Status:**
- ✅ Sender email: `bitaadm2425@gmail.com` (Verified Gmail)
- ✅ SMTP: Gmail SMTP (smtp.gmail.com:587)
- ✅ Encryption: STARTTLS
- ⚠️ **Students perlu check spam folder!**

