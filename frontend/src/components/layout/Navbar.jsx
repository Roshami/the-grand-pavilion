import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to="/" className="shrink-0 flex items-center">
              <div className="bg-burgundy-600 text-cream-50 rounded-lg mr-2">
                <img
                  src="/logo.jpg"
                  alt="The Grand Pavilion Logo"
                  className="h-12 w-12 object-cover rounded-lg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                />
              </div>
              <span className="text-2xl font-serif font-bold text-burgundy-800 ml-2">
                The Grand Pavilion
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-700 hover:text-burgundy-600 font-medium"
            >
              Home
            </Link>
            <Link
              to="/venue"
              className="text-gray-700 hover:text-burgundy-600 font-medium"
            >
              Venue
            </Link>
            <Link
              to="/menu"
              className="text-gray-700 hover:text-burgundy-600 font-medium"
            >
              Menu
            </Link>

            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className="text-gray-700 hover:text-burgundy-600 font-medium"
                >
                  My Bookings
                </Link>
                {/* Admin Link - Only show if user is admin */}
                {user.role === 'admin' && (
                  <Link
                    to="/admin"
                    className="text-gray-700 hover:text-burgundy-600 font-medium"
                  >
                    Admin
                  </Link>
                )}

                <button
                  onClick={handleLogout}
                  className="bg-burgundy-600 text-white px-4 py-2 rounded-md hover:bg-burgundy-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-burgundy-600 font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/booking"
                  className="bg-burgundy-600 text-white px-4 py-2 rounded-md hover:bg-burgundy-700 transition"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <svg
                className="h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                {isOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg">
            <Link
              to="/"
              className="block px-3 py-2 text-gray-700 hover:text-burgundy-600"
            >
              Home
            </Link>
            <Link
              to="/venue"
              className="block px-3 py-2 text-gray-700 hover:text-burgundy-600"
            >
              Venue
            </Link>
            <Link
              to="/menu"
              className="block px-3 py-2 text-gray-700 hover:text-burgundy-600"
            >
              Menu
            </Link>
            {user ? (
              <>
                <Link
                  to="/my-bookings"
                  className="block px-3 py-2 text-gray-700 hover:text-burgundy-600"
                >
                  My Bookings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-white bg-burgundy-600 hover:bg-burgundy-700 rounded-md mt-2"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block px-3 py-2 text-gray-700 hover:text-burgundy-600"
                >
                  Login
                </Link>
                <Link
                  to="/booking"
                  className="block px-3 py-2 text-center text-white bg-burgundy-600 hover:bg-burgundy-700 rounded-md mt-2"
                >
                  Book Now
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
