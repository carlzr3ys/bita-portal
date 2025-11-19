import { Link } from 'react-router-dom'

function About() {
  return (
    <div className="page-content">
      <div className="container">
        <h1 className="page-title">About BITA</h1>
        
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <section style={{ marginBottom: '3rem' }}>
            <div style={{ 
              backgroundColor: 'var(--bg-light)', 
              padding: '1.5rem', 
              borderRadius: '10px', 
              marginBottom: '2rem',
              borderLeft: '4px solid var(--primary-color)'
            }}>
              <h2 style={{ color: 'var(--primary-color)', marginBottom: '0.5rem', fontSize: '1.5rem' }}>
                Bachelor of Technology (Cloud Computing and Application)
              </h2>
              <p style={{ color: 'var(--text-light)', fontSize: '0.9rem', margin: 0 }}>
                MQA/PA14792 | Faculty of Information & Communication Technology (FTMK)<br />
                Universiti Teknikal Malaysia Melaka (UTeM)
              </p>
            </div>
            
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Program Overview</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '1rem' }}>
              The Bachelor of Technology in Cloud Computing and Application (BITA) is aimed at producing 
              knowledgeable and highly skilled graduates in the field of Information and Communications 
              Technology (ICT). Graduates pursuing this programme are equipped with the necessary knowledge 
              and specialised skills in cloud computing technology to meet the needs of the industry.
            </p>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)' }}>
              The programme focuses on the delivery of computing services, including servers, storage, 
              databases, networking, software, analytics, and intelligence, over the internet ("the cloud"). 
              Students will gain hands-on experience with modern cloud platforms and technologies, preparing 
              them for successful careers in the rapidly evolving cloud computing industry.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Career Prospects</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '1.5rem' }}>
              There is a wide range of career opportunities in the field of Information and Communication 
              Technology available for graduates who specialise in cloud computing, either in the government 
              or private sector. Among the career opportunities are:
            </p>
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
              gap: '1rem',
              marginBottom: '1.5rem'
            }}>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-cloud" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Architect</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-cogs" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Engineer</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-database" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Data Scientist</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-robot" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Automation Engineer</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-user-tie" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Consultant</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-shield-alt" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Security Analyst</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-network-wired" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Network Engineer</h3>
              </div>
              <div style={{ 
                padding: '1rem', 
                backgroundColor: 'var(--bg-light)', 
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary-color)'
              }}>
                <i className="fas fa-user-cog" style={{ color: 'var(--primary-color)', fontSize: '1.5rem', marginBottom: '0.5rem' }}></i>
                <h3 style={{ margin: '0.5rem 0', fontSize: '1rem' }}>Cloud Administrator</h3>
              </div>
            </div>
            <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-color)', fontStyle: 'italic' }}>
              Other than that, graduates also have the opportunity to further their studies at the postgraduate level.
            </p>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>What BITA Portal Offers</h2>
            <div className="features-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <h3>Quality Education</h3>
                <p>Comprehensive curriculum covering cloud computing fundamentals, services, infrastructure, networking, and modern cloud technologies.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-network-wired"></i>
                </div>
                <h3>Alumni Network</h3>
                <p>Connect with BITA graduates who are making their mark in the cloud computing industry worldwide.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-laptop-code"></i>
                </div>
                <h3>Hands-On Learning</h3>
                <p>Practical modules and tutorials with real-world cloud computing examples and industry-standard practices.</p>
              </div>
              <div className="feature-card">
                <div className="feature-icon">
                  <i className="fas fa-shield-alt"></i>
                </div>
                <h3>Secure Platform</h3>
                <p>Verified registration system ensuring only BITA students from FTMK UTeM can access our resources.</p>
              </div>
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>About This Portal</h2>
            <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '1rem' }}>
              This BITA Portal is a dedicated platform for students and alumni of the Bachelor of Technology 
              (Cloud Computing and Application) programme at FTMK, Universiti Teknikal Malaysia Melaka. 
              The portal provides a centralized hub for learning resources, module materials, and community 
              networking.
            </p>
            <div style={{ 
              backgroundColor: 'var(--bg-light)', 
              padding: '1.5rem', 
              borderRadius: '10px',
              marginTop: '1.5rem'
            }}>
              <h3 style={{ color: 'var(--primary-color)', marginBottom: '1rem', fontSize: '1.2rem' }}>Registration System</h3>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-color)', margin: 0 }}>
                Our registration system uses advanced OCR technology to verify student identity through 
                matriculation cards. This ensures that only legitimate BITA students from FTMK UTeM can 
                register and access our platform. If you encounter any issues during registration, our 
                admin team is available to assist with manual verification.
              </p>
            </div>
          </section>

          <section style={{ marginBottom: '3rem' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Contact Information</h2>
            <div style={{ 
              backgroundColor: 'var(--bg-light)', 
              padding: '1.5rem', 
              borderRadius: '10px'
            }}>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-color)', marginBottom: '0.5rem' }}>
                <strong>Faculty of Information & Communication Technology (FTMK)</strong><br />
                Universiti Teknikal Malaysia Melaka<br />
                Hang Tuah Jaya, 76100 Durian Tunggal<br />
                Melaka, Malaysia
              </p>
              <p style={{ fontSize: '1rem', lineHeight: '1.8', color: 'var(--text-color)', margin: 0 }}>
                <br />
                <i className="fas fa-phone" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                Telephone: +606 2702411<br />
                <i className="fas fa-fax" style={{ color: 'var(--primary-color)', marginRight: '0.5rem' }}></i>
                Fax: +606 2701048
              </p>
              <p style={{ fontSize: '0.9rem', lineHeight: '1.8', color: 'var(--text-light)', marginTop: '1rem', marginBottom: 0 }}>
                <a 
                  href="https://ftmk.utem.edu.my/web/index.php/academics/undergraduate/bachelor-of-technology-in-cloud-computing-and-application/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--primary-color)', textDecoration: 'none' }}
                >
                  <i className="fas fa-external-link-alt" style={{ marginRight: '0.5rem' }}></i>
                  Visit Official FTMK Website
                </a>
              </p>
            </div>
          </section>

          <section style={{ textAlign: 'center', padding: '2rem', backgroundColor: 'var(--bg-light)', borderRadius: '10px' }}>
            <h2 style={{ color: 'var(--primary-color)', marginBottom: '1rem' }}>Get Started</h2>
            <p style={{ marginBottom: '2rem', color: 'var(--text-color)' }}>
              Ready to join the BITA Portal? Register now and start your journey!
            </p>
            <Link to="/register" className="btn btn-primary btn-large">Register Now</Link>
          </section>
        </div>
      </div>
    </div>
  )
}

export default About

