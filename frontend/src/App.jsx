import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';

// Pages
import Home from './pages/Home';
import Venue from './pages/Venue';
import Menu from './pages/Menu';
import Booking from './pages/Booking';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminFacilities from './pages/AdminFacilities';
import AdminMenu from './pages/AdminMenu';
import AdminUsers from './pages/AdminUsers';
import AdminReports from './pages/AdminReports';
import AdminSettings from './pages/AdminSettings';
import AdminLayout from './components/layout/AdminLayout';
import Staff from './pages/Staff';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import StaffLayout from './components/layout/StaffLayout';
import StaffDashboard from './pages/StaffDashboard';
import StaffTodayBookings from './pages/StaffTodayBookings';

// ✅ CORRECTED: ProtectedRoute with role handling
function ProtectedRoute({ children, allowedRoles = null }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Check role if specified
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    console.warn(
      `Access denied: Requires role ${allowedRoles.join(' or ')}, got ${user.role}`,
    );
    return <Navigate to="/" replace />;
  }

  return children;
}

// ✅ NEW: PublicRoute for login/register (redirect if authenticated)
function PublicRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  // Redirect to home if already logged in
  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="flex flex-col min-h-screen">
          <Routes>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                <>
                  <Navbar />
                  <main className="grow">
                    <Home />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/venue"
              element={
                <>
                  <Navbar />
                  <main className="grow">
                    <Venue />
                  </main>
                  <Footer />
                </>
              }
            />
            <Route
              path="/menu"
              element={
                <>
                  <Navbar />
                  <main className="grow">
                    <Menu />
                  </main>
                  <Footer />
                </>
              }
            />

            {/* Protected Routes - Customer + Staff + Admin */}
            <Route
              path="/booking"
              element={
                <ProtectedRoute allowedRoles={['customer', 'staff', 'admin']}>
                  <>
                    <Navbar />
                    <main className="grow">
                      <Booking />
                    </main>
                    <Footer />
                  </>
                </ProtectedRoute>
              }
            />

            {/* Public Auth Routes - Only for unauthenticated users */}
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <>
                    <Navbar />
                    <main className="grow">
                      <Login />
                    </main>
                    <Footer />
                  </>
                </PublicRoute>
              }
            />
            <Route
              path="/register"
              element={
                <PublicRoute>
                  <>
                    <Navbar />
                    <main className="grow">
                      <Register />
                    </main>
                    <Footer />
                  </>
                </PublicRoute>
              }
            />

            {/* Admin Routes - ONLY admin */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={['admin']}>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminDashboard />} />
              <Route path="bookings/*" element={<AdminBookings />} />
              <Route path="facilities/*" element={<AdminFacilities />} />
              <Route path="menu/*" element={<AdminMenu />} />
              <Route path="users/*" element={<AdminUsers />} />
              <Route path="reports/*" element={<AdminReports />} />
              <Route path="settings/*" element={<AdminSettings />} />
            </Route>

            {/* ✅ CORRECTED: Staff Routes with NESTED children */}
            <Route
              path="/staff"
              element={
                <ProtectedRoute allowedRoles={['staff', 'admin']}>
                  <StaffLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<StaffDashboard />} />
              <Route path="bookings/today" element={<StaffTodayBookings />} />
              <Route path="bookings/*" element={<AdminBookings />} />
              <Route path="facilities/*" element={<AdminFacilities />} />
            </Route>
          </Routes>

          <ToastContainer
            position="top-right"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
          />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
