import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

// Public Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Awareness from './pages/Awareness';

// Citizen Dashboard Pages
import UserDashboard from './pages/user/UserDashboard';
import CreatePickup from './pages/user/CreatePickup';
import MyPickups from './pages/user/MyPickups';
import PickupDetail from './pages/user/PickupDetail';
import Rewards from './pages/user/Rewards';

// Collector Dashboard Pages
import CollectorDashboard from './pages/collector/CollectorDashboard';
import CollectorAssignedPickups from './pages/collector/AssignedPickups';
import CollectorAvailablePickups from './pages/collector/AvailablePickups';

// Admin Dashboard Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import ManageUsers from './pages/admin/ManageUsers';
import ManageCollectors from './pages/admin/ManageCollectors';
import ManageRequests from './pages/admin/ManageRequests';
import Reports from './pages/admin/Reports';

const App = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          {/* Public Routes with Navbar/Footer (we render navbar inside layout or directly if needed, for public pages we can wrap them in a simple layout or render standard layout) */}
          <Route path="/" element={<><DashboardLayout /></>}>
            <Route index element={<Landing />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="awareness" element={<Awareness />} />
          </Route>

          {/* Citizen Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowedRoles={['user']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<UserDashboard />} />
            <Route path="pickup/new" element={<CreatePickup />} />
            <Route path="pickups" element={<MyPickups />} />
            <Route path="pickups/:id" element={<PickupDetail />} />
            <Route path="rewards" element={<Rewards />} />
          </Route>

          {/* Collector Dashboard Routes */}
          <Route
            path="/collector"
            element={
              <ProtectedRoute allowedRoles={['collector']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<CollectorDashboard />} />
            <Route path="available" element={<CollectorAvailablePickups />} />
            <Route path="pickups" element={<CollectorAssignedPickups />} />
          </Route>

          {/* Admin Dashboard Routes */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="collectors" element={<ManageCollectors />} />
            <Route path="requests" element={<ManageRequests />} />
            <Route path="reports" element={<Reports />} />
          </Route>

          {/* Fallback Redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
