import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/citizen/Dashboard';
import ReportCrime from './pages/citizen/ReportCrime';
import TrackComplaint from './pages/citizen/TrackComplaint';
import MyComplaints from './pages/citizen/MyComplaints';
import ComplaintDetails from './pages/shared/ComplaintDetails';

import PoliceDashboard from './pages/police/Dashboard';
import PoliceInvestigation from './pages/police/Investigation';

// New Pages
import Bulletins from './pages/shared/Bulletins';
import SafetyMap from './pages/shared/SafetyMap';
import ManageBulletins from './pages/admin/ManageBulletins';
import GhostMode from './pages/shared/GhostMode';

import AdminDashboard from './pages/admin/Dashboard';
import AdminComplaints from './pages/admin/Complaints';
import AdminUsers from './pages/admin/Users';
import AdminOfficers from './pages/admin/Officers';

import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow pt-16">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/bulletins" element={<Bulletins />} />
              <Route path="/safety-map" element={<SafetyMap />} />
              <Route path="/track" element={<TrackComplaint />} />
              <Route path="/ghost-mode" element={<GhostMode />} />

              {/* Citizen Routes */}
              <Route path="/citizen/dashboard" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <CitizenDashboard />
                </ProtectedRoute>
              } />
              <Route path="/citizen/report" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <ReportCrime />
                </ProtectedRoute>
              } />
              <Route path="/citizen/complaints" element={
                <ProtectedRoute allowedRoles={['citizen']}>
                  <MyComplaints />
                </ProtectedRoute>
              } />
              <Route path="/complaint/:id" element={
                <ProtectedRoute allowedRoles={['citizen', 'police', 'admin']}>
                  <ComplaintDetails />
                </ProtectedRoute>
              } />

              {/* Police Routes */}
              <Route path="/police/dashboard" element={
                <ProtectedRoute allowedRoles={['police']}>
                  <PoliceDashboard />
                </ProtectedRoute>
              } />
              <Route path="/police/investigation/:id" element={
                <ProtectedRoute allowedRoles={['police', 'admin']}>
                  <PoliceInvestigation />
                </ProtectedRoute>
              } />

              {/* Admin Routes */}
              <Route path="/admin/dashboard" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />
              <Route path="/admin/complaints" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminComplaints />
                </ProtectedRoute>
              } />
              <Route path="/admin/users" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminUsers />
                </ProtectedRoute>
              } />
              <Route path="/admin/officers" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminOfficers />
                </ProtectedRoute>
              } />
              <Route path="/admin/bulletins" element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <ManageBulletins />
                </ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
