import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { CalendarIcon, UserGroupIcon, CurrencyDollarIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline';

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0,
    revenue: 0,
    customers: 0,
    facilities: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState(null);

useEffect(() => {
  const fetchDashboardData = async () => {
    try {
      const res = await api.get('/admin/dashboard');
      setStats(res.data.data);
      setRecentBookings(res.data.data.recentBookings || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard data. Please try again later.');
      setLoading(false);
    }
  };

  fetchDashboardData();
}, []);

  const statCards = [
    {
      name: 'Total Bookings',
      value: stats.totalBookings,
      icon: CalendarIcon,
      color: 'bg-blue-500'
    },
    {
      name: 'Confirmed',
      value: stats.confirmedBookings,
      icon: CheckCircleIcon,
      color: 'bg-green-500'
    },
    {
      name: 'Pending',
      value: stats.pendingBookings,
      icon: CalendarIcon,
      color: 'bg-yellow-500'
    },
    {
      name: 'Cancelled',
      value: stats.cancelledBookings,
      icon: XCircleIcon,
      color: 'bg-red-500'
    },
    {
      name: 'Total Revenue',
      value: `Rs. ${stats.revenue.toLocaleString()}`,
      icon: CurrencyDollarIcon,
      color: 'bg-purple-500'
    },
    {
      name: 'Customers',
      value: stats.customers,
      icon: UserGroupIcon,
      color: 'bg-indigo-500'
    }
  ];

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold text-burgundy-800">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back! Here's what's happening today.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-8">
        {statCards.map((stat) => (
          <div key={stat.name} className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition">
            <div className="flex items-center">
              <div className={`shrink-0 ${stat.color} rounded-lg p-3`}>
                <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Bookings */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-800">Recent Bookings</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Booking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Facility</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guests</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentBookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                recentBookings.map((booking) => (
                  <tr key={booking._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {booking.bookingNumber}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.customerDetails?.name || 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.facilityName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(booking.date).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'short', 
                        day: 'numeric' 
                      })}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {booking.guestCount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <Link 
                        to={`/admin/bookings/${booking._id}`}
                        className="text-burgundy-600 hover:text-burgundy-900"
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
        
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 text-right">
          <Link 
            to="/admin/bookings"
            className="text-burgundy-600 hover:text-burgundy-900 font-medium"
          >
            View All Bookings →
          </Link>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-linear-to-br from-burgundy-50 to-cream-50 rounded-xl p-6">
          <h3 className="text-lg font-bold text-burgundy-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <Link 
              to="/admin/bookings/new"
              className="block w-full bg-burgundy-600 text-white text-center py-2 rounded-lg hover:bg-burgundy-700 transition"
            >
              Create New Booking
            </Link>
            <Link 
              to="/admin/facilities/new"
              className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Add New Facility
            </Link>
            <Link 
              to="/admin/menu/new"
              className="block w-full bg-gray-200 text-gray-800 text-center py-2 rounded-lg hover:bg-gray-300 transition"
            >
              Add Menu Item
            </Link>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-burgundy-800 mb-4">Booking Status</h3>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Confirmed</span>
              <span className="text-sm font-bold text-green-600">{stats.confirmedBookings}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-green-500 rounded-full" 
                style={{ width: `${(stats.confirmedBookings / stats.totalBookings) * 100 || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-600">Pending</span>
              <span className="text-sm font-bold text-yellow-600">{stats.pendingBookings}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-yellow-500 rounded-full" 
                style={{ width: `${(stats.pendingBookings / stats.totalBookings) * 100 || 0}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center mt-3">
              <span className="text-sm text-gray-600">Cancelled</span>
              <span className="text-sm font-bold text-red-600">{stats.cancelledBookings}</span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full">
              <div 
                className="h-full bg-red-500 rounded-full" 
                style={{ width: `${(stats.cancelledBookings / stats.totalBookings) * 100 || 0}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <h3 className="text-lg font-bold text-burgundy-800 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="shrink-0">
                <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  B
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">New booking created</p>
                <p className="text-xs text-gray-500">2 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="shrink-0">
                <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  U
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">New user registered</p>
                <p className="text-xs text-gray-500">5 hours ago</p>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="shrink-0">
                <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                  F
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Facility updated</p>
                <p className="text-xs text-gray-500">Yesterday</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}