import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StaffLayout from '../components/layout/StaffLayout';
import StaffDashboard from './StaffDashboard';
import AdminBookings from './AdminBookings'; // Reuse with staff permissions
import AdminFacilities from './AdminFacilities'; // Reuse with staff permissions

export default function Staff() {
  const { user } = useAuth();

  // Only staff and admins can access staff panel
  if (user?.role !== 'staff' && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
    <StaffLayout>
      <Routes>
        <Route index element={<StaffDashboard />} />
        <Route path="bookings/*" element={<AdminBookings />} />
        <Route path="facilities/*" element={<AdminFacilities />} />
      </Routes>
    </StaffLayout>
  );
}