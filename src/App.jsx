import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { AdminProvider } from './context/AdminContext'
import { LecturerProvider } from './context/LecturerContext'
import { ThemeProvider } from './context/ThemeContext'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import About from './pages/About'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Alumni from './pages/Alumni'
import Members from './pages/Members'
import UserProfile from './pages/UserProfile'
import Modules from './pages/Modules'
import ContactAdmin from './pages/ContactAdmin'
import UpdateLog from './pages/UpdateLog'
import AdminDashboard from './pages/admin/AdminDashboard'
import LecturerDashboard from './pages/lecturer/LecturerDashboard'
import Footer from './components/Footer'

function AppContent() {
  const location = useLocation()
  const isAdminPage = location.pathname.startsWith('/admin')
  const isLecturerPage = location.pathname.startsWith('/lecturer')

  return (
    <div className="App">
      {!isAdminPage && !isLecturerPage && <Navbar />}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/alumni" element={<Alumni />} />
          <Route path="/members" element={<Members />} />
          <Route path="/profile/:id" element={<UserProfile />} />
          <Route path="/modules" element={<Modules />} />
          <Route path="/update-log" element={<UpdateLog />} />
          <Route path="/contact-admin" element={<ContactAdmin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/lecturer/dashboard" element={<LecturerDashboard />} />
        </Routes>
      </main>
      {!isAdminPage && !isLecturerPage && <Footer />}
    </div>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AdminProvider>
          <LecturerProvider>
            <Router>
              <AppContent />
            </Router>
          </LecturerProvider>
        </AdminProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App

