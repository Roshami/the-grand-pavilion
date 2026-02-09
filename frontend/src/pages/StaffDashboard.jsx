import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import {
  CalendarIcon,
  UserGroupIcon,
  CheckCircleIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';

export default function StaffDashboard() {
  const [stats, setStats] = useState({
    todayBookings: 0,
    pendingBookings: 0,
    confirmedBookings: 0,
    completedToday: 0,
  });
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Get today's date
      const today = new Date().toISOString().split('T')[0];

      // Fetch today's bookings
      const bookingsRes = await api.get(`/bookings/daily/${today}`);
      const bookings = bookingsRes.data.groupedBookings || {};

      // Flatten and count
      const allBookings = Object.values(bookings).flat();
      const pending = allBookings.filter((b) => b.status === 'pending').length;
      const confirmed = allBookings.filter(
        (b) => b.status === 'confirmed',
      ).length;
      const completed = allBookings.filter(
        (b) => b.status === 'completed',
      ).length;

      setStats({
        todayBookings: allBookings.length,
        pendingBookings: pending,
        confirmedBookings: confirmed,
        completedToday: completed,
      });

      // Get detailed bookings for display
      setTodayBookings(allBookings.slice(0, 10)); // First 10

      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-emerald-800">
          Staff Dashboard
        </h1>
        <p className="text-gray-600 mt-2">
          Manage today's bookings and operations
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-emerald-500">
          <div className="flex items-center">
            <div className="shrink-0 bg-emerald-100 rounded-lg p-3">
              <CalendarIcon
                className="h-6 w-6 text-emerald-600"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Today's Bookings
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.todayBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-yellow-500">
          <div className="flex items-center">
            <div className="shrink-0 bg-yellow-100 rounded-lg p-3">
              <ClockIcon
                className="h-6 w-6 text-yellow-600"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Pending</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.pendingBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
          <div className="flex items-center">
            <div className="shrink-0 bg-green-100 rounded-lg p-3">
              <CheckCircleIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Confirmed</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.confirmedBookings}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 border-l-4 border-blue-500">
          <div className="flex items-center">
            <div className="shrink-0 bg-blue-100 rounded-lg p-3">
              <UserGroupIcon
                className="h-6 w-6 text-blue-600"
                aria-hidden="true"
              />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">
                Completed Today
              </p>
              <p className="text-2xl font-bold text-gray-900 mt-1">
                {stats.completedToday}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Today's Bookings */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-800">Today's Bookings</h2>
          <Link
            to="/staff/bookings"
            className="text-emerald-600 hover:text-emerald-800 font-medium"
          >
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Time
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Facility
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guests
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {todayBookings.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    No bookings scheduled for today
                  </td>
                </tr>
              ) : (
                todayBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.timeSlot.start} - {booking.timeSlot.end}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.customerDetails?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.facilityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.guestCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : booking.status === 'completed'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() +
                          booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link
                        to={`/staff/bookings/${booking._id}`}
                        className="text-emerald-600 hover:text-emerald-900"
                      >
                        View Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-linear-to-br from-emerald-50 to-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-emerald-800 mb-4">
            Quick Actions
          </h3>
          <div className="space-y-3">
            <Link
              to="/staff/bookings/new"
              className="block w-full bg-emerald-600 text-white text-center py-2 rounded-lg hover:bg-emerald-700 transition"
            >
              Create New Booking
            </Link>
            <Link
              to="/staff/facilities"
              className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-300 transition"
            >
              View Facility Status
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-emerald-800 mb-4">
            Shift Summary
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total Bookings</span>
              <span className="text-lg font-bold text-gray-900">
                {stats.todayBookings}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-emerald-500 rounded-full"
                style={{
                  width: `${Math.min((stats.todayBookings / 50) * 100, 100)}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-600">Completed</span>
              <span className="text-lg font-bold text-green-600">
                {stats.completedToday}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{
                  width: `${Math.min((stats.completedToday / stats.todayBookings) * 100 || 0, 100)}%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-200">
              <span className="text-sm font-medium text-gray-800">
                Shift End
              </span>
              <span className="text-sm text-gray-600">10:00 PM</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
