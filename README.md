# BITA Website

A comprehensive platform for BITA (Bachelor of Information Technology in Application) students and alumni.

## Features

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Secure Registration**: OCR-based verification using matriculation cards
- **Alumni Network**: Connect with graduated BITA students
- **Member Directory**: View current BITA students
- **Learning Modules**: Comprehensive Cloud Computing tutorials
- **Modern UI**: Clean, professional design with intuitive navigation

## Registration Flow

1. **Upload Matric Card**: Student uploads or takes a photo of their matriculation card
2. **OCR Detection**: System uses Tesseract.js to extract information (name, matric number, program)
3. **Verification**: System verifies that the student is enrolled in BITA program
4. **Confirmation**: Student reviews and edits detected information if needed
5. **Account Creation**: Student creates account with email and password
6. **Success**: Welcome message and access to dashboard

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **OCR**: Tesseract.js for client-side text recognition
- **Storage**: localStorage (for demo - replace with Firebase/Supabase in production)
- **Icons**: Font Awesome 6.4.0

## Setup Instructions

### Prerequisites

- Node.js and npm installed
- XAMPP (Apache dan MySQL) - untuk backend PHP dan database
- Modern web browser (Chrome, Firefox, Safari, Edge)

### Installation

1. **Install Node.js dependencies:**
   ```bash
   npm install
   ```

2. **Start XAMPP:**
   - Buka XAMPP Control Panel
   - Start **Apache** dan **MySQL**
   - Pastikan Apache running di `http://localhost`
   - Pastikan MySQL running

3. **Check XAMPP status (optional):**
   ```bash
   npm run check-xampp
   ```

4. **Start development server:**
   ```bash
   npm start
   ```

5. **Browser akan auto-open di:** `http://localhost:8080`

### Development Server

Development server ini akan:
- ✅ Serve frontend files (HTML/CSS/JS) di port 8080
- ✅ Proxy API calls ke XAMPP Apache (port 80)
- ✅ Auto-open browser bila start

**Important:** Pastikan XAMPP Apache dan MySQL running sebelum start npm server!

### Alternative Setup (Without Node.js)

Simply open `index.html` in a modern web browser. Note that some features may require a local server due to CORS restrictions.

## Project Structure

```
BITA/
├── index.html              # Home page
├── register.html           # Registration flow
├── alumni.html             # Alumni directory
├── members.html            # Current members
├── modules.html            # Learning modules
├── about.html              # About page
├── contact-admin.html      # Contact admin form
├── dashboard.html          # User dashboard
├── styles.css              # Main stylesheet
├── script.js               # Main navigation script
├── register.js             # Registration logic & OCR
├── alumni.js               # Alumni data loading
├── members.js              # Members data loading
├── modules.js              # Module navigation
├── contact-admin.js        # Contact form handler
├── dashboard.js            # Dashboard logic
├── package.json            # Dependencies
└── README.md               # This file
```

## Key Features Explained

### OCR Registration

The registration system uses Tesseract.js to extract text from matriculation card images. The system:
- Detects name, matric number, and program
- Validates that the program is BITA
- Allows manual editing if OCR misreads information
- Blocks non-BITA students automatically

### Responsive Navigation

- Desktop: Full horizontal navigation bar
- Mobile: Hamburger menu that expands to show all links
- All pages accessible on small screens

### Modules Page

- Desktop: Sidebar navigation with content area
- Mobile: Collapsible sidebar menu
- W3Schools-style code blocks and examples
- Topics: Cloud Computing Fundamentals, Services, Linux, Networking, DevOps

## Production Deployment

For production deployment, you should:

1. **Replace localStorage with a backend**:
   - Set up Firebase Authentication
   - Use Firestore for user data storage
   - Implement proper user management

2. **Enhance OCR**:
   - Consider using Google Cloud Vision API for better accuracy
   - Add server-side validation
   - Implement image preprocessing

3. **Add Authentication**:
   - Implement login/logout functionality
   - Add session management
   - Secure API endpoints

4. **Database Integration**:
   - Store alumni and member data in a database
   - Implement admin panel for data management
   - Add search and filter functionality

5. **Security**:
   - Implement proper password hashing
   - Add CSRF protection
   - Secure API endpoints
   - Validate all user inputs

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Notes

- The current implementation uses localStorage for demo purposes
- OCR accuracy depends on image quality and card format
- For production, integrate with a proper backend and database
- Admin requests are stored in localStorage (replace with backend in production)

## License

MIT License - feel free to use and modify as needed.

## Support

For issues or questions, please contact the BITA admin team through the Contact Admin page.

