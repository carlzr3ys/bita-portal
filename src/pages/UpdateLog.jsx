import { useState } from 'react'
import { useTheme } from '../context/ThemeContext'

function UpdateLog() {
  const { isDarkMode } = useTheme()
  const [activeTab, setActiveTab] = useState('updated')

  return (
    <div className="page-content">
      <div className="container">
        <div className="update-log-header">
          <h1 className="page-title">
            <i className="fas fa-history" style={{ marginRight: '0.75rem' }}></i>
            Update Log
          </h1>
          <p className="update-log-subtitle">
            Stay informed about the latest changes and upcoming features
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="update-log-tabs">
          <button
            className={`update-log-tab ${activeTab === 'updated' ? 'active' : ''}`}
            onClick={() => setActiveTab('updated')}
          >
            <i className="fas fa-check-circle" style={{ marginRight: '0.5rem' }}></i>
            Updated
          </button>
          <button
            className={`update-log-tab ${activeTab === 'coming-soon' ? 'active' : ''}`}
            onClick={() => setActiveTab('coming-soon')}
          >
            <i className="fas fa-rocket" style={{ marginRight: '0.5rem' }}></i>
            Coming Soon
          </button>
        </div>

        {/* Tab Content */}
        <div className="update-log-content">
          {activeTab === 'updated' && (
            <div className="update-log-section">
              <h2 className="update-section-title">Recent Updates & Bug Fixes</h2>
              
              <div className="update-item">
                <div className="update-item-header">
                  <span className="update-date">November 19, 2025</span>
                  <span className="update-badge new">New</span>
                </div>
                <h3 className="update-title">Update Log System Launched</h3>
                <p className="update-description">
                  We've introduced a new Update Log system to keep you informed about platform changes and upcoming features. 
                  This page provides transparency and helps you stay up-to-date with the latest developments.
                </p>
                <ul className="update-details">
                  <li>New Update Log page added to navigation</li>
                  <li>Two-tab interface for updates and coming soon features</li>
                  <li>Fully responsive design for all devices</li>
                </ul>
              </div>

              <div className="update-item">
                <div className="update-item-header">
                  <span className="update-date">November 19, 2025</span>
                  <span className="update-badge fix">Fix</span>
                </div>
                <h3 className="update-title">Lecturer System Enhancements</h3>
                <p className="update-description">
                  Improved the lecturer authentication and dashboard system with better navigation and access controls.
                </p>
                <ul className="update-details">
                  <li>Fixed lecturer login flow</li>
                  <li>Added "Lecturer View" tab in navigation bar</li>
                  <li>Improved lecturer dashboard UI</li>
                </ul>
              </div>

              <div className="update-item">
                <div className="update-item-header">
                  <span className="update-date">November 19, 2025</span>
                  <span className="update-badge improvement">Improvement</span>
                </div>
                <h3 className="update-title">Storage System Migration</h3>
                <p className="update-description">
                  Migrated from Cloudinary to local cPanel storage for better file management and control.
                </p>
                <ul className="update-details">
                  <li>Implemented local file storage system</li>
                  <li>Added FTP support for Render backend</li>
                  <li>Improved file upload handling</li>
                </ul>
              </div>

              <div className="update-item">
                <div className="update-item-header">
                  <span className="update-date">November 19, 2025</span>
                  <span className="update-badge fix">Fix</span>
                </div>
                <h3 className="update-title">Security Enhancements</h3>
                <p className="update-description">
                  Implemented environment variables and secure credential management for production deployment.
                </p>
                <ul className="update-details">
                  <li>Added .env file support for local development</li>
                  <li>Implemented secure environment variable handling</li>
                  <li>Removed hardcoded credentials from repository</li>
                </ul>
              </div>

              <div className="update-item">
                <div className="update-item-header">
                  <span className="update-date">November 18, 2025</span>
                  <span className="update-badge improvement">Improvement</span>
                </div>
                <h3 className="update-title">Modules System Improvements</h3>
                <p className="update-description">
                  Enhanced the modules upload and management system with better file organization and search functionality.
                </p>
                <ul className="update-details">
                  <li>Added global search functionality</li>
                  <li>Improved category navigation</li>
                  <li>Enhanced file upload interface</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'coming-soon' && (
            <div className="update-log-section">
              <h2 className="update-section-title">Upcoming Features</h2>
              <p className="coming-soon-intro">
                We're continuously working to improve your experience. Here's what's coming next:
              </p>

              <div className="coming-soon-item">
                <div className="coming-soon-icon">
                  <i className="fas fa-chalkboard-teacher"></i>
                </div>
                <div className="coming-soon-content">
                  <h3 className="coming-soon-title">Lecturer Portal & Dashboard</h3>
                  <p className="coming-soon-description">
                    A dedicated portal for lecturers with enhanced dashboard, course management tools, 
                    and student interaction features. Lecturers will be able to manage course materials, 
                    track student progress, and communicate effectively with their classes.
                  </p>
                  <div className="coming-soon-features">
                    <span className="feature-tag">Course Management</span>
                    <span className="feature-tag">Student Analytics</span>
                    <span className="feature-tag">Communication Tools</span>
                  </div>
                </div>
              </div>

              <div className="coming-soon-item">
                <div className="coming-soon-icon">
                  <i className="fas fa-fire"></i>
                </div>
                <div className="coming-soon-content">
                  <h3 className="coming-soon-title">Login Streak Tracking System</h3>
                  <p className="coming-soon-description">
                    Gamify your learning experience with a login streak system! Track your daily login 
                    consistency and build impressive streaks. The longer your streak, the more rewards you unlock.
                  </p>
                  <div className="coming-soon-features">
                    <span className="feature-tag">Daily Tracking</span>
                    <span className="feature-tag">Streak Rewards</span>
                    <span className="feature-tag">Achievements</span>
                  </div>
                </div>
              </div>

              <div className="coming-soon-item">
                <div className="coming-soon-icon">
                  <i className="fas fa-medal"></i>
                </div>
                <div className="coming-soon-content">
                  <h3 className="coming-soon-title">Quiz Streak Badge System</h3>
                  <p className="coming-soon-description">
                    Earn badges and recognition by maintaining quiz streaks! Show off your dedication 
                    to learning with collectible badges that reflect your quiz performance and consistency.
                  </p>
                  <div className="coming-soon-features">
                    <span className="feature-tag">Badge Collection</span>
                    <span className="feature-tag">Performance Tracking</span>
                    <span className="feature-tag">Social Sharing</span>
                  </div>
                </div>
              </div>

              <div className="coming-soon-item">
                <div className="coming-soon-icon">
                  <i className="fas fa-shopping-bag"></i>
                </div>
                <div className="coming-soon-content">
                  <h3 className="coming-soon-title">The Student Shop</h3>
                  <p className="coming-soon-description">
                    Redeem points earned from activities, streaks, and achievements at the Student Shop! 
                    Exchange your hard-earned points for exclusive items, digital rewards, and special perks.
                  </p>
                  <div className="coming-soon-features">
                    <span className="feature-tag">Point System</span>
                    <span className="feature-tag">Exclusive Rewards</span>
                    <span className="feature-tag">Digital Marketplace</span>
                  </div>
                </div>
              </div>

              <div className="coming-soon-footer">
                <p>
                  <i className="fas fa-info-circle" style={{ marginRight: '0.5rem' }}></i>
                  Have suggestions? Contact us through the Contact Admin page!
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default UpdateLog

