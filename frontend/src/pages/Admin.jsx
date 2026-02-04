import { Routes, Route, Navigate} from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import AdminBookings from './AdminBookings';
import AdminFacilities from './AdminFacilities';
import AdminMenu from './AdminMenu';
import AdminUsers from './AdminUsers';
import AdminReports from './AdminReports';
import AdminSettings from './AdminSettings';
import AdminLayout from '../components/layout/AdminLayout';


export default function Admin() {
  const { user } = useAuth();

  // Only admins can access admin panel
  if (user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return (
      <AdminLayout>
        <Routes>
          <Route index element={<AdminDashboard />} />
          <Route path="bookings/*" element={<AdminBookings />} />
          <Route path="facilities/*" element={<AdminFacilities />} />
          <Route path="menu/*" element={<AdminMenu />} />
          <Route path="users/*" element={<AdminUsers />} />
          <Route path="reports/*" element={<AdminReports />} />
          <Route path="settings/*" element={<AdminSettings />} />
        </Routes>
      </AdminLayout>
  );
}
