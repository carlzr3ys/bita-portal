import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useTheme } from '../context/ThemeContext'

function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, user, logout } = useAuth()
  const { isDarkMode, toggleTheme } = useTheme()
  const [isThemeAnimating, setIsThemeAnimating] = useState(false)

  const handleThemeClick = () => {
    setIsThemeAnimating(true)
    toggleTheme()
    setTimeout(() => {
      setIsThemeAnimating(false)
    }, 600)
  }

  const handleLogout = async () => {
    if (confirm('Are you sure you want to logout?')) {
      await logout()
      window.location.href = '/'
    }
  }

  const isActive = (path) => {
    return location.pathname === path ? 'active' : ''
  }

  return (
    <>
      {/* Overlay untuk close menu */}
      {isOpen && (
        <div 
          className="menu-overlay"
          onClick={() => setIsOpen(false)}
        />
      )}
      <nav className="navbar">
        <div className="nav-container">
          <div 
            className={`hamburger ${isOpen ? 'hidden' : ''}`}
            id="hamburger"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            <div className="hamburger-inner">
              <span className="bar bar-top"></span>
              <span className="bar bar-middle"></span>
              <span className="bar bar-bottom"></span>
            </div>
          </div>
          <div className="nav-logo">
            <Link to="/" onClick={() => setIsOpen(false)}>BITA</Link>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Theme Toggle Button */}
            <button
              onClick={handleThemeClick}
              className={`theme-toggle ${isThemeAnimating ? 'animating' : ''}`}
              aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
              aria-pressed={isDarkMode}
              title={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              <i className={isDarkMode ? 'fas fa-sun' : 'fas fa-moon'}></i>
            </button>
          </div>
          <ul className={`nav-menu ${isOpen ? 'active' : ''}`} id="navMenu">
          {!isAuthenticated ? (
            <>
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive('/')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-home" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Home
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/about" className={`nav-link ${isActive('/about')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>About
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/update-log" className={`nav-link ${isActive('/update-log')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-history" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Update Log
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link btn-register" onClick={() => setIsOpen(false)}>
                  <i className="fas fa-user-plus" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Register
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/login" className={`nav-link ${isActive('/login')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-sign-in-alt" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Login
                </Link>
              </li>
            </>
          ) : (
            <>
              <li className="nav-item">
                <Link to="/alumni" className={`nav-link ${isActive('/alumni')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-graduation-cap" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Alumni
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/members" className={`nav-link ${isActive('/members')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-users" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>BITA Members
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/modules" className={`nav-link ${isActive('/modules')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-book" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Modules
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/update-log" className={`nav-link ${isActive('/update-log')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-history" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Update Log
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/contact-admin" className={`nav-link ${isActive('/contact-admin')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-envelope" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Contact Admin
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/dashboard" className={`nav-link ${isActive('/dashboard')}`} onClick={() => setIsOpen(false)}>
                  <i className="fas fa-user-circle" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Profile
                </Link>
              </li>
              <li className="nav-item">
                <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); setIsOpen(false); }} className="nav-link btn-register">
                  <i className="fas fa-sign-out-alt" style={{ marginRight: '0.75rem', width: '20px', textAlign: 'center' }}></i>Logout
                </a>
              </li>
            </>
          )}
          </ul>
        </div>
      </nav>
    </>
  )
}

export default Navbar

