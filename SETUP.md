# BITA Website - Setup Guide

## Quick Start

### Option 1: Using npm (Recommended)

1. **Install Node.js** (if not already installed)
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm start
   ```

4. **Open Browser**
   - The server will automatically open at `http://localhost:8080`
   - Or manually navigate to the URL shown in terminal

### Option 2: Direct Browser (Simple Testing)

1. **Open `index.html`** directly in your browser
   - Note: Some features may require a local server due to CORS

2. **Use Python Simple Server** (if available):
   ```bash
   # Python 3
   python -m http.server 8080
   
   # Python 2
   python -m SimpleHTTPServer 8080
   ```

## Testing the Registration Flow

### Testing OCR with Sample Cards

1. **Prepare a Test Image**:
   - Take a photo of a matriculation card (or use a sample)
   - Ensure good lighting and clear text
   - Supported formats: JPG, PNG

2. **Test Registration**:
   - Navigate to Register page
   - Upload the card image
   - Click "Scan Card"
   - Review detected information
   - Complete registration

### Expected OCR Results

The OCR should detect:
- **Name**: Student's full name
- **Matric Number**: Format like BIT123456
- **Program**: Should contain "BITA" or "BIT"

### Troubleshooting OCR

If OCR fails or misreads:
- Ensure image is clear and well-lit
- Try different angles or lighting
- Use "Contact Admin" button for manual verification
- Check browser console for errors

## File Structure

```
BITA/
├── index.html              # Home page
├── register.html           # Registration (OCR flow)
├── alumni.html             # Alumni directory
├── members.html            # Current members
├── modules.html            # Learning modules
├── about.html              # About page
├── contact-admin.html      # Contact admin
├── dashboard.html          # User dashboard
├── styles.css              # All styles
├── script.js               # Navigation
├── register.js             # Registration & OCR
├── alumni.js               # Alumni data
├── members.js              # Members data
├── modules.js              # Module navigation
├── contact-admin.js        # Contact form
├── dashboard.js            # Dashboard logic
├── package.json            # Dependencies
├── README.md               # Documentation
└── SETUP.md                # This file
```

## Browser Compatibility

Tested and working on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

## Mobile Testing

### Desktop Browser DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select device or custom dimensions
4. Test navigation and responsive features

### Real Device Testing
1. Find your computer's IP address
2. Access from mobile: `http://YOUR_IP:8080`
3. Test on actual device for best results

## Production Deployment

### Current Setup (Demo)
- Uses localStorage for data storage
- Client-side OCR with Tesseract.js
- No backend required

### Production Recommendations

1. **Backend Integration**:
   - Set up Firebase or Supabase
   - Implement proper authentication
   - Use Firestore/database for user data

2. **Enhanced OCR**:
   - Consider Google Cloud Vision API
   - Add server-side image preprocessing
   - Implement better error handling

3. **Security**:
   - Hash passwords properly
   - Add CSRF protection
   - Validate all inputs server-side
   - Use HTTPS

4. **Performance**:
   - Minify CSS/JS
   - Optimize images
   - Enable caching
   - Use CDN for assets

## Common Issues

### OCR Not Working
- **Issue**: Tesseract.js not loading
- **Solution**: Check internet connection (CDN), or download Tesseract.js locally

### Navigation Not Working on Mobile
- **Issue**: Hamburger menu not appearing
- **Solution**: Clear browser cache, check CSS is loaded

### Registration Data Not Saving
- **Issue**: localStorage not working
- **Solution**: Check browser allows localStorage, try different browser

### Images Not Uploading
- **Issue**: File input not working
- **Solution**: Check file format (JPG/PNG), file size limits

## Support

For issues or questions:
1. Check browser console for errors
2. Review README.md for detailed documentation
3. Contact admin through Contact Admin page

## Next Steps

After setup:
1. Test all pages and navigation
2. Test registration flow with sample cards
3. Customize content (alumni, members, modules)
4. Plan backend integration for production
5. Set up domain and hosting

