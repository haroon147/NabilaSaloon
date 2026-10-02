import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/useAuth';

import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

import ClientLayout from './layouts/ClientLayout';
import ClientHome from './pages/client/HomePage';
import ClientServices from './pages/client/ServicesPage';
import BookingFlow from './pages/client/BookingFlowPage';
import MyBookings from './pages/client/MyBookingsPage';
import ClientProfile from './pages/shared/ProfilePage';

import EmployeeLayout from './layouts/EmployeeLayout';
import EmployeeSchedule from './pages/employee/SchedulePage';
import EmployeeAvailability from './pages/employee/AvailabilityPage';

import AdminLayout from './layouts/AdminLayout';
import AdminDashboard from './pages/admin/DashboardPage';
import AdminBookings from './pages/admin/BookingsPage';
import AdminTeam from './pages/admin/TeamPage';

function RequireAuth({ children, role }: { children: React.ReactElement; role?: string }) {
  const { user, authChecked } = useAuth();
  if (!authChecked) return null;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  const { user, authChecked } = useAuth();

  if (!authChecked) return null;

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to={`/${user.role}`} replace /> : <LoginPage />} />
      <Route path="/register" element={user ? <Navigate to={`/${user.role}`} replace /> : <RegisterPage />} />

      {/* Client routes */}
      <Route path="/client" element={<RequireAuth role="client"><ClientLayout /></RequireAuth>}>
        <Route index element={<ClientHome />} />
        <Route path="services" element={<ClientServices />} />
        <Route path="book" element={<BookingFlow />} />
        <Route path="bookings" element={<MyBookings />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      {/* Employee routes */}
      <Route path="/employee" element={<RequireAuth role="employee"><EmployeeLayout /></RequireAuth>}>
        <Route index element={<EmployeeSchedule />} />
        <Route path="availability" element={<EmployeeAvailability />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<RequireAuth role="admin"><AdminLayout /></RequireAuth>}>
        <Route index element={<AdminDashboard />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="team" element={<AdminTeam />} />
        <Route path="profile" element={<ClientProfile />} />
      </Route>

      <Route path="/" element={
        user ? <Navigate to={`/${user.role}`} replace /> : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
