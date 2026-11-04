import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';

// Common Layout
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import BusinessListPage from './pages/BusinessListPage';
import BusinessDetailPage from './pages/BusinessDetailPage';
import InteractiveMapPage from './pages/InteractiveMapPage';
import ItineraryPlannerPage from './pages/ItineraryPlannerPage';
import RecommendationsPage from './pages/RecommendationsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import TouristDashboardPage from './pages/TouristDashboardPage';
import BusinessDashboardPage from './pages/BusinessDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return children;
};

const AppContent = () => {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-[#fbfbfa] text-slate-800">
      <Navbar />
      <main className="flex-1">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/destinations" element={<DestinationsPage />} />
          <Route path="/destinations/:id" element={<DestinationDetailPage />} />
          <Route path="/businesses" element={<BusinessListPage />} />
          <Route path="/businesses/:id" element={<BusinessDetailPage />} />
          <Route path="/map" element={<InteractiveMapPage />} />
          <Route path="/itinerary-planner" element={<ItineraryPlannerPage />} />
          <Route path="/recommendations" element={<RecommendationsPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected Dashboards */}
          <Route
            path="/dashboard/tourist"
            element={
              <ProtectedRoute allowedRoles={['tourist', 'admin']}>
                <TouristDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/owner"
            element={
              <ProtectedRoute allowedRoles={['business_owner', 'admin']}>
                <BusinessDashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <AdminDashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;