# BITA Website - React Version

Website BITA sekarang menggunakan **React + Vite** untuk development yang lebih smooth dan mudah di-manage!

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Pastikan XAMPP Running

- Start **Apache** dan **MySQL** di XAMPP Control Panel

### 3. Start Development Server

```bash
npm start
# atau
npm run dev
```

Browser akan auto-open di `http://localhost:5173`

## 📁 Project Structure

```
bita/
├── src/
│   ├── components/       # Reusable React components
│   │   ├── Navbar.jsx
│   │   └── Footer.jsx
│   ├── pages/            # Page components
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Alumni.jsx
│   │   ├── Members.jsx
│   │   ├── Modules.jsx
│   │   └── ContactAdmin.jsx
│   ├── context/          # React Context (Authentication)
│   │   └── AuthContext.jsx
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions
│   ├── App.jsx           # Main App component with routing
│   └── main.jsx          # Entry point
├── api/                  # PHP Backend (unchanged)
├── public/               # Static files
├── styles.css            # Global styles
├── vite.config.js        # Vite configuration
└── package.json          # Dependencies

```

## 🎯 Features

### ✅ React + JSX
- Component-based architecture
- JSX syntax (easier to manage)
- React Hooks for state management
- React Context for authentication

### ✅ React Router
- Client-side routing
- Protected routes
- Navigation with `<Link>` components

### ✅ Vite
- Fast HMR (Hot Module Replacement)
- Lightning-fast builds
- Auto-refresh on file changes

### ✅ Authentication
- React Context API for global auth state
- Protected routes automatically redirect to login
- Session management with PHP backend

## 📝 Available Scripts

```bash
npm start          # Start dev server (port 5173)
npm run dev        # Same as npm start
npm run build      # Build for production
npm run preview    # Preview production build
npm run check-xampp # Check if XAMPP is running
```

## 🔧 Configuration

### Vite Proxy

API calls are proxied to XAMPP:
- `/api/*` → `http://localhost/bita/api/*`
- `/admin/*` → `http://localhost/bita/admin/*`

### Environment

No environment variables needed! Everything works with:
- Frontend: `http://localhost:5173` (Vite dev server)
- Backend: `http://localhost/bita` (XAMPP Apache)

## 🎨 Development Workflow

1. **Edit React Components** in `src/pages/` or `src/components/`
2. **Save file** → Vite automatically refreshes
3. **See changes instantly** in browser
4. **No page reload needed** for most changes!

## 📦 Dependencies

- `react` - React library
- `react-dom` - React DOM renderer
- `react-router-dom` - Client-side routing
- `vite` - Build tool & dev server
- `tesseract.js` - OCR for matric card scanning

## 🚨 Important Notes

- **PHP Backend Unchanged** - All PHP files remain in `api/` directory
- **Database** - Still uses XAMPP MySQL
- **Styles** - Global CSS in `styles.css` works with React
- **Old HTML Files** - Can be kept for reference but won't be used

## 🔄 Migration Notes

Old structure:
- HTML files (`index.html`, `login.html`, etc.)
- Vanilla JavaScript (`login.js`, `dashboard.js`, etc.)
- Manual DOM manipulation

New structure:
- React components (`src/pages/Home.jsx`, etc.)
- JSX syntax
- React Hooks and Context
- Automatic re-renders

## 📖 How to Use

### Adding a New Page

1. Create component in `src/pages/NewPage.jsx`
2. Add route in `src/App.jsx`:
   ```jsx
   <Route path="/new-page" element={<NewPage />} />
   ```

### Using Authentication

```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { isAuthenticated, user, login, logout } = useAuth()
  
  // Use auth state...
}
```

### Making API Calls

```jsx
const response = await fetch('http://localhost/bita/api/endpoint.php', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include',
  body: JSON.stringify(data)
})
```

## 🎉 Benefits

1. **Faster Development** - Hot reload, instant feedback
2. **Better Code Organization** - Component-based, reusable
3. **Easier to Maintain** - JSX is more readable than template strings
4. **Modern Stack** - React ecosystem
5. **Smoother UX** - Client-side routing, no page reloads

## 🐛 Troubleshooting

### Port 5173 already in use
Change port in `vite.config.js`:
```js
server: {
  port: 3000, // or any other port
}
```

### API calls not working
- Check XAMPP Apache is running
- Verify proxy settings in `vite.config.js`
- Check CORS headers in PHP files

### Build errors
```bash
rm -rf node_modules package-lock.json
npm install
```

---

Happy coding! 🎊

