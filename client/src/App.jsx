import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import CitizenLayout from './components/layout/CitizenLayout';
import OfficerLayout from './components/layout/OfficerLayout';
import AdminLayout from './components/layout/AdminLayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import CitizenDashboard from './pages/CitizenDashboard';
import SubmitComplaint from './pages/SubmitComplaint';
import Tracking from './pages/Tracking';
import ComplaintHistory from './pages/ComplaintHistory';
import ComplaintDetail from './pages/ComplaintDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminComplaints from './pages/AdminComplaints';
import AdminDepartments from './pages/AdminDepartments';
import AdminAnalytics from './pages/AdminAnalytics';
import OfficerPanel from './pages/OfficerPanel';
import OfficerAssigned from './pages/OfficerAssigned';
import OfficerHistory from './pages/OfficerHistory';

const ProtectedRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user) return <Navigate to="/login" />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
};

const PublicLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-grow">
      {children}
    </main>
  </div>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
          <Route path="/login" element={<PublicLayout><Login /></PublicLayout>} />
          <Route path="/register" element={<PublicLayout><Register /></PublicLayout>} />

          {/* Citizen Routes */}
          <Route path="/citizen" element={<CitizenLayout />}>
            <Route path="dashboard" element={<CitizenDashboard />} />
            <Route path="new-complaint" element={<SubmitComplaint />} />
            <Route path="tracking" element={<Tracking />} />
            <Route path="history" element={<ComplaintHistory />} />
            <Route path="complaints/:id" element={<ComplaintDetail />} />
            <Route index element={<Navigate to="/citizen/dashboard" replace />} />
          </Route>

          {/* Officer Routes */}
          <Route path="/officer" element={<OfficerLayout />}>
            <Route index element={<Navigate to="/officer/dashboard" />} />
            <Route path="dashboard" element={<OfficerPanel />} />
            <Route path="assigned" element={<OfficerAssigned />} />
            <Route path="history" element={<OfficerHistory />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="complaints" element={<AdminComplaints />} />
            <Route path="departments" element={<AdminDepartments />} />
            <Route path="analytics" element={<AdminAnalytics />} />
          </Route>

          {/* Legacy Redirects for backwards compatibility if needed */}
          <Route path="/dashboard" element={<Navigate to="/citizen/dashboard" replace />} />
          <Route path="/tracking" element={<Navigate to="/citizen/tracking" replace />} />
          <Route path="/submit" element={<Navigate to="/citizen/new-complaint" replace />} />
          <Route path="/admin-dashboard" element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="/officer-panel" element={<Navigate to="/officer/dashboard" replace />} />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
