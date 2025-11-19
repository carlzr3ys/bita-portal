import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Home() {
  const { isAuthenticated } = useAuth()

  return (
    <>
      {/* Hero Section */}
      <section className="hero">
        {/* Animated Clouds Background */}
        <div className="clouds-container">
          <div className="cloud cloud-1"></div>
          <div className="cloud cloud-2"></div>
          <div className="cloud cloud-3"></div>
          <div className="cloud cloud-4"></div>
          <div className="cloud cloud-5"></div>
        </div>

        {/* Starfall Animation - Only in Dark Mode */}
        <div className="starfall-container">
          <div className="starfall starfall-1"></div>
          <div className="starfall starfall-2"></div>
          <div className="starfall starfall-3"></div>
          <div className="starfall starfall-4"></div>
          <div className="starfall starfall-5"></div>
        </div>

        <div className="hero-content">
          {/* BITA Logo Text */}
          <div className="bita-logo-container">
            <div className="bita-text">
              <h1 className="bita-logo-title">Welcome to BITA Portal</h1>
              <p className="bita-logo-subtitle">CLOUD COMPUTING</p>
            </div>
          </div>
          
          <h2 className="hero-subtitle">Bridging Innovation, Technology & Advancement</h2>
          <p className="hero-description">A platform for BITA Cloud Computing students and alumni to connect, learn, and grow together.</p>
          <div className="hero-buttons">
            {!isAuthenticated ? (
              <Link to="/register" className="btn btn-primary">Get Started</Link>
            ) : (
              <Link to="/dashboard" className="btn btn-primary">Go to Dashboard</Link>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features">
        <div className="container">
          <h2 className="section-title">What BITA Portal Offers</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-users"></i>
              </div>
              <h3>Alumni Network</h3>
              <p>Connect with BITA graduates and build your professional network.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-book"></i>
              </div>
              <h3>Learning Modules</h3>
              <p>Access comprehensive Cloud Computing tutorials and resources.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Secure Registration</h3>
              <p>Verified registration system exclusively for BITA students.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <i className="fas fa-mobile-alt"></i>
              </div>
              <h3>Mobile Friendly</h3>
              <p>Fully responsive design that works on all devices.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!isAuthenticated && (
        <section className="cta">
          <div className="container">
            <h2>Ready to Join BITA?</h2>
            <p>Register now and become part of our growing community</p>
            <Link to="/register" className="btn btn-primary btn-large">Register Now</Link>
          </div>
        </section>
      )}
    </>
  )
}

export default Home

