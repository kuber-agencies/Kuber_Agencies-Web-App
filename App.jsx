import { Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';

// Layout
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import WhatsAppButton from './components/WhatsAppButton';

// Public pages
import Home from './pages/Home';
import CompanyProfile from './pages/CompanyProfile';
import GovernmentTenders from './pages/GovernmentTenders';
import Products from './pages/Products';
import RFQPage from './pages/RFQPage';
import DocumentCenter from './pages/DocumentCenter';

// Admin pages
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminProducts from './pages/admin/AdminProducts';
import AdminRFQs from './pages/admin/AdminRFQs';
import AdminProjects from './pages/admin/AdminProjects';
import AdminDocuments from './pages/admin/AdminDocuments';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/admin/login" replace />;
};

const PublicLayout = ({ children }) => (
  <>
    <Navbar />
    <main>{children}</main>
    <Footer />
    <WhatsAppButton />
  </>
);

export default function App() {
  return (
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: { fontFamily: "'Source Sans 3', sans-serif", fontSize: '14px' }
        }}
      />
      <Routes>
        {/* Public */}
        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/company-profile" element={<PublicLayout><CompanyProfile /></PublicLayout>} />
        <Route path="/government-tenders" element={<PublicLayout><GovernmentTenders /></PublicLayout>} />
        <Route path="/products" element={<PublicLayout><Products /></PublicLayout>} />
        <Route path="/request-quote" element={<PublicLayout><RFQPage /></PublicLayout>} />
        <Route path="/documents" element={<PublicLayout><DocumentCenter /></PublicLayout>} />

        {/* Admin */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        <Route path="/admin/products" element={<ProtectedRoute><AdminProducts /></ProtectedRoute>} />
        <Route path="/admin/rfqs" element={<ProtectedRoute><AdminRFQs /></ProtectedRoute>} />
        <Route path="/admin/projects" element={<ProtectedRoute><AdminProjects /></ProtectedRoute>} />
        <Route path="/admin/documents" element={<ProtectedRoute><AdminDocuments /></ProtectedRoute>} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
