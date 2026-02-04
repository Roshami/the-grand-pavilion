import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { CheckCircleIcon, XCircleIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';


export default function AdminBookings() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    if (id) {
      fetchBookingDetails(id);
    } else {
      fetchBookings();
    }
  }, [id, statusFilter, dateFilter]);

  const fetchBookings = async () => {
    try {
      const params = new URLSearchParams();
      if (statusFilter !== 'all') params.append('status', statusFilter);
      if (dateFilter) params.append('date', dateFilter);
      
      const res = await api.get(`/bookings?${params.toString()}`);
      setBookings(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setLoading(false);
    }
  };

  const fetchBookingDetails = async (bookingId) => {
    try {
      const res = await api.get(`/bookings/${bookingId}`);
      setBooking(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching booking details:', err);
      setLoading(false);
    }
  };

  const updateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      alert('Booking status updated successfully');
      if (id) {
        fetchBookingDetails(id);
      } else {
        fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const cancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    
    try {
      await api.put(`/bookings/${bookingId}/cancel`);
      alert('Booking cancelled successfully');
      navigate('/admin/bookings');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Single Booking View
  if (id && booking) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-serif font-bold text-burgundy-800">Booking Details</h1>
          <Link to="/admin/bookings" className="text-burgundy-600 hover:text-burgundy-800">
            ← Back to Bookings
          </Link>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Booking Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Booking Number</span>
                  <p className="font-mono font-bold text-lg">{booking.bookingNumber}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Confirmation Code</span>
                  <p className="font-mono font-bold text-lg">{booking.confirmationCode}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Status</span>
                  <p className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    booking.status === 'confirmed' ? 'bg-green-100 text-green-800' :
                    booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    booking.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                  </p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Type</span>
                  <p className="font-medium capitalize">{booking.type}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <span className="text-sm text-gray-500">Name</span>
                  <p className="font-medium">{booking.customerDetails?.name}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Phone</span>
                  <p className="font-medium">{booking.customerDetails?.phone}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Email</span>
                  <p className="font-medium">{booking.customerDetails?.email}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Event Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <span className="text-sm text-gray-500">Facility</span>
                <p className="font-medium">{booking.facilityName}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Date</span>
                <p className="font-medium">
                  {new Date(booking.date).toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Time</span>
                <p className="font-medium">{booking.timeSlot.start} - {booking.timeSlot.end}</p>
              </div>
              <div>
                <span className="text-sm text-gray-500">Guests</span>
                <p className="font-medium">{booking.guestCount}</p>
              </div>
              {booking.eventName && (
                <div>
                  <span className="text-sm text-gray-500">Event Name</span>
                  <p className="font-medium">{booking.eventName}</p>
                </div>
              )}
              {booking.eventType && (
                <div>
                  <span className="text-sm text-gray-500">Event Type</span>
                  <p className="font-medium capitalize">{booking.eventType}</p>
                </div>
              )}
            </div>
          </div>

          {booking.specialRequests && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Special Requests</h3>
              <p className="text-gray-700">{booking.specialRequests}</p>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200 flex justify-between">
            <div>
              <h3 className="text-lg font-bold text-gray-800 mb-2">Pricing</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Facility Charge:</span>
                  <span className="font-bold">Rs. {booking.pricing.facilityCharge.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Food Total:</span>
                  <span className="font-bold">Rs. {booking.pricing.foodTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span>Add-ons:</span>
                  <span className="font-bold">Rs. {booking.pricing.addonTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between pt-2 border-t border-gray-200">
                  <span className="font-bold">Total:</span>
                  <span className="font-bold text-lg text-burgundy-600">Rs. {booking.pricing.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              {booking.status === 'pending' && (
                <button
                  onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                  className="flex items-center bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                >
                  <CheckCircleIcon className="h-5 w-5 mr-2" />
                  Confirm Booking
                </button>
              )}
              {booking.status !== 'cancelled' && (
                <button
                  onClick={() => cancelBooking(booking._id)}
                  className="flex items-center bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                >
                  <XCircleIcon className="h-5 w-5 mr-2" />
                  Cancel Booking
                </button>
              )}
              <button
                onClick={() => window.print()}
                className="flex items-center bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Print Invoice
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Bookings List View
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-burgundy-800">Manage Bookings</h1>
        <Link 
          to="/admin/bookings/new" 
          className="bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 transition"
        >
          Create New Booking
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setStatusFilter('all');
                setDateFilter('');
              }}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
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
              {bookings.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-4 text-center text-gray-500">
                    No bookings found
                  </td>
                </tr>
              ) : (
                bookings.map((booking) => (
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
                        className="text-burgundy-600 hover:text-burgundy-900 mr-3"
                      >
                        View
                      </Link>
                      {booking.status === 'pending' && (
                        <button
                          onClick={() => updateBookingStatus(booking._id, 'confirmed')}
                          className="text-green-600 hover:text-green-900 mr-3"
                        >
                          Confirm
                        </button>
                      )}
                      {booking.status !== 'cancelled' && (
                        <button
                          onClick={() => cancelBooking(booking._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancel
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}