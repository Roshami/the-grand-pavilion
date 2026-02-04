import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
//App.css
import './App.css';

// Pages
import Home from './pages/Home';
import Venue from './pages/Venue';
import Menu from './pages/Menu';
import Booking from './pages/Booking';

import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin'; // ADD THIS

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';

function ProtectedRoute({
  children,
  requireAuth = true,
  requireAdmin = false,
}) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  // Redirect if not authenticated
  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect if authenticated but shouldn't be (e.g., login page)
  if (!requireAuth && user) {
    return <Navigate to="/" replace />;
  }

   // CRITICAL FIX: Redirect if admin required but user is not admin
  if (requireAdmin && user?.role !== 'admin') {
    console.warn('Access denied: Admin role required');
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

              {/* Protected Routes */}
              <Route
                path="/booking"
                element={
                  <ProtectedRoute>
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
             

              {/* Auth Routes */}
              <Route
                path="/login"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <>
                      <Navbar />
                      <main className="grow">
                        <Login />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/register"
                element={
                  <ProtectedRoute requireAuth={false}>
                    <>
                      <Navbar />
                      <main className="grow">
                        <Register />
                      </main>
                      <Footer />
                    </>
                  </ProtectedRoute>
                }
              />

              {/* Admin Routes */}
              <Route
                path="/admin/*"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <Admin />
                  </ProtectedRoute>
                }
              />
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
