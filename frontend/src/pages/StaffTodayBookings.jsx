import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { 
  CalendarIcon, 
  ClockIcon, 
  CheckCircleIcon, 
  XCircleIcon,
  EyeIcon,
  UserIcon,
  ChatBubbleLeftIcon,
  TableCellsIcon,
  ArrowsRightLeftIcon,
  PrinterIcon
} from '@heroicons/react/24/outline';

export default function StaffTodayBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('grouped'); // 'grouped' or 'timeline'
  const [staffNotes, setStaffNotes] = useState({});
  const today = new Date().toISOString().split('T')[0];
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodayBookings();
  }, []);

  const fetchTodayBookings = async () => {
    try {
      const res = await api.get(`/bookings/daily/${today}`);
      
      const allBookings = [];
      if (res.data.groupedBookings) {
        Object.values(res.data.groupedBookings).forEach(timeGroup => {
          allBookings.push(...timeGroup);
        });
      }
      
      // Sort by time
      allBookings.sort((a, b) => 
        a.timeSlot.start.localeCompare(b.timeSlot.start)
      );
      
      setBookings(allBookings);
      
      // Initialize staff notes
      const notes = {};
      allBookings.forEach(booking => {
        notes[booking._id] = booking.staffNotes || '';
      });
      setStaffNotes(notes);
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching today\'s bookings:', err);
      setError(err.response?.data?.message || 'Failed to load today\'s bookings');
      setLoading(false);
    }
  };

  // Group bookings by time slot
  const groupedBookings = useMemo(() => {
    const groups = {};
    bookings.forEach(booking => {
      const timeKey = booking.timeSlot.start;
      if (!groups[timeKey]) {
        groups[timeKey] = [];
      }
      groups[timeKey].push(booking);
    });
    return groups;
  }, [bookings]);

  const timeSlots = useMemo(() => 
    Object.keys(groupedBookings).sort(), 
  [groupedBookings]);

  const updateBookingStatus = async (bookingId, newStatus) => {
    if (!window.confirm(`Mark this booking as ${newStatus}?`)) return;
    
    try {
      await api.put(`/bookings/${bookingId}/status`, { 
        status: newStatus,
        staffNotes: staffNotes[bookingId] || ''
      });
      alert(`✅ Booking marked as ${newStatus}!`);
      fetchTodayBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status');
    }
  };

  const handleCheckIn = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { 
        status: 'confirmed',
        staffNotes: `Checked in at ${new Date().toLocaleTimeString()} | ${staffNotes[bookingId] || ''}`
      });
      alert('✅ Customer checked in successfully!');
      fetchTodayBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to check in customer');
    }
  };

  const handleTableAssignment = async (bookingId, tableNumber) => {
    if (!window.confirm(`Assign ${tableNumber} to this booking?`)) return;
    
    try {
      // In a real app, this would update the booking with table assignment
      await api.put(`/bookings/${bookingId}/status`, { 
        status: 'confirmed',
        staffNotes: `Table: ${tableNumber} | ${staffNotes[bookingId] || ''}`
      });
      alert(`✅ Table ${tableNumber} assigned successfully!`);
      fetchTodayBookings();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to assign table');
    }
  };

  const handleNotesChange = (bookingId, value) => {
    setStaffNotes(prev => ({ ...prev, [bookingId]: value }));
  };

  const handleNotesSave = async (bookingId) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { 
        status: bookings.find(b => b._id === bookingId)?.status,
        staffNotes: staffNotes[bookingId]
      });
      alert('✅ Notes saved successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to save notes');
    }
  };

  const getStatusBadge = (status) => {
    const config = {
      confirmed: { bg: 'bg-green-100', text: 'text-green-800', border: 'border-green-200', icon: CheckCircleIcon },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', icon: ClockIcon },
      completed: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', icon: CheckCircleIcon },
      cancelled: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', icon: XCircleIcon },
      'checked-in': { bg: 'bg-purple-100', text: 'text-purple-800', border: 'border-purple-200', icon: UserIcon }
    };
    
    const { bg, text, border, icon: Icon } = config[status] || config.pending;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${bg} ${text} ${border}`}>
        <Icon className="h-3 w-3 mr-1" />
        {status.replace('-', ' ').charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
      </span>
    );
  };

  const getTableSuggestions = (capacity) => {
    // In a real app, this would fetch available tables from backend
    if (capacity <= 4) return ['T1', 'T2', 'T3'];
    if (capacity <= 8) return ['T4', 'T5', 'T6'];
    return ['Grand Hall', 'Garden Area'];
  };

  if (loading) return <LoadingSpinner text="Loading today's bookings..." />;
  if (error) return (
    <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg mb-6">
      <div className="flex items-center">
        <XCircleIcon className="h-5 w-5 text-red-400 mr-3" />
        <p className="text-red-700">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header with Actions */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl font-serif font-bold text-emerald-800">Today's Bookings</h1>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              {bookings.length} Total
            </span>
          </div>
          <p className="text-gray-600 mt-1 flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-emerald-600" />
            {new Date(today).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/staff/bookings/new')}
            className="flex items-center bg-emerald-600 text-white px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition"
          >
            <UserIcon className="h-5 w-5 mr-2" />
            Add Walk-in
          </button>
          
          <div className="flex border rounded-lg overflow-hidden">
            <button
              onClick={() => setViewMode('grouped')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'grouped'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Grouped View
            </button>
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-4 py-2 text-sm font-medium ${
                viewMode === 'timeline'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Timeline View
            </button>
          </div>
          
          <button
            onClick={() => window.print()}
            className="flex items-center bg-white text-emerald-700 border border-emerald-300 px-4 py-2.5 rounded-lg hover:bg-emerald-50 transition"
          >
            <PrinterIcon className="h-4 w-4 mr-2" />
            Print Schedule
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Confirmed', value: bookings.filter(b => b.status === 'confirmed').length, color: 'bg-green-500' },
          { label: 'Checked In', value: bookings.filter(b => b.status === 'completed').length, color: 'bg-blue-500' },
          { label: 'Pending', value: bookings.filter(b => b.status === 'pending').length, color: 'bg-yellow-500' },
          { label: 'Total Guests', value: bookings.reduce((sum, b) => sum + b.guestCount, 0), color: 'bg-purple-500' }
        ].map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow p-4 border border-gray-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-full ${stat.color} bg-opacity-20 flex items-center justify-center`}>
                <div className={`w-4 h-4 rounded-full ${stat.color}`}></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Grouped View */}
      {viewMode === 'grouped' && (
        <div className="space-y-6">
          {timeSlots.length === 0 ? (
            <div className="bg-white rounded-xl shadow-md p-12 text-center border-2 border-dashed border-gray-200">
              <div className="text-8xl mb-6">✨</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-2">No Bookings Today</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                Enjoy a quiet day! You can still add walk-in customers as they arrive.
              </p>
              <button
                onClick={() => navigate('/staff/bookings/new')}
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700"
              >
                <UserIcon className="h-5 w-5 mr-2" />
                Add Walk-in Customer
              </button>
            </div>
          ) : (
            timeSlots.map(timeSlot => (
              <div key={timeSlot} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                <div className="bg-linear-to-r from-emerald-50 to-emerald-100 px-6 py-4 border-b border-emerald-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <ClockIcon className="h-6 w-6 text-emerald-700 mr-3" />
                      <h2 className="text-xl font-bold text-emerald-800">{timeSlot} - {parseInt(timeSlot.split(':')[0]) + 2}:00</h2>
                    </div>
                    <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                      {groupedBookings[timeSlot].length} Booking{groupedBookings[timeSlot].length !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {groupedBookings[timeSlot].map((booking) => (
                    <div 
                      key={booking._id} 
                      className={`p-5 hover:bg-gray-50 transition-colors ${
                        booking.status === 'completed' ? 'bg-blue-50' : 
                        booking.status === 'cancelled' ? 'bg-red-50 opacity-70' : ''
                      }`}
                    >
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        {/* Customer Info */}
                        <div className="md:col-span-1">
                          <div className="flex items-start">
                            <div className="shrink-0">
                              <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                                <span className="font-bold text-emerald-800 text-lg">
                                  {booking.customerDetails?.name?.charAt(0) || '?'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-3 flex-1">
                              <p className="font-bold text-gray-900">{booking.customerDetails?.name || 'N/A'}</p>
                              <p className="text-sm text-gray-500 flex items-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                                {booking.customerDetails?.phone || 'N/A'}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1">
                                {booking.specialRequests && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-amber-100 text-amber-800">
                                    <ChatBubbleLeftIcon className="h-3 w-3 mr-1" />
                                    Special Request
                                  </span>
                                )}
                                {booking.eventName && (
                                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    {booking.eventType}
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Booking Details */}
                        <div className="md:col-span-1">
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs text-gray-500">Facility</p>
                              <p className="font-medium text-gray-900">{booking.facilityName}</p>
                              <p className="text-sm text-gray-500 capitalize">{booking.type}</p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500">Guests</p>
                              <div className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {booking.guestCount}
                              </div>
                            </div>
                            {booking.tableNumber && (
                              <div>
                                <p className="text-xs text-gray-500">Table</p>
                                <p className="font-medium text-gray-900">{booking.tableNumber}</p>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Actions & Status */}
                        <div className="md:col-span-2">
                          <div className="flex flex-col h-full justify-between">
                            <div>
                              <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                  {getStatusBadge(booking.status)}
                                </div>
                                <div className="flex space-x-2">
                                  {booking.status !== 'completed' && booking.status !== 'cancelled' && (
                                    <button
                                      onClick={() => handleCheckIn(booking._id)}
                                      className="px-3 py-1.5 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-xs font-medium flex items-center"
                                    >
                                      <UserIcon className="h-3 w-3 mr-1" /> Check-in
                                    </button>
                                  )}
                                  {booking.status !== 'cancelled' && (
                                    <button
                                      onClick={() => updateBookingStatus(booking._id, 'cancelled')}
                                      className="px-3 py-1.5 bg-red-600 text-white rounded-md hover:bg-red-700 text-xs font-medium flex items-center"
                                    >
                                      <XCircleIcon className="h-3 w-3 mr-1" /> Cancel
                                    </button>
                                  )}
                                  <button
                                    onClick={() => navigate(`/staff/bookings/${booking._id}`)}
                                    className="px-3 py-1.5 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 text-xs font-medium flex items-center"
                                  >
                                    <EyeIcon className="h-3 w-3 mr-1" /> Details
                                  </button>
                                </div>
                              </div>
                              
                              {/* Special Requests */}
                              {booking.specialRequests && (
                                <div className="mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
                                  <p className="text-xs font-medium text-amber-800 mb-1 flex items-center">
                                    <ChatBubbleLeftIcon className="h-3 w-3 mr-1" /> Special Requests:
                                  </p>
                                  <p className="text-sm text-amber-900">{booking.specialRequests}</p>
                                </div>
                              )}
                              
                              {/* Staff Notes */}
                              <div className="mt-3">
                                <label className="block text-xs font-medium text-gray-700 mb-1 items-center">
                                  <ChatBubbleLeftIcon className="h-3 w-3 mr-1" /> Staff Notes
                                </label>
                                <div className="flex gap-2">
                                  <input
                                    type="text"
                                    value={staffNotes[booking._id] || ''}
                                    onChange={(e) => handleNotesChange(booking._id, e.target.value)}
                                    onBlur={() => handleNotesSave(booking._id)}
                                    placeholder="Add notes for staff..."
                                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                                  />
                                  <button
                                    onClick={() => handleNotesSave(booking._id)}
                                    className="px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition text-xs font-medium"
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            </div>
                            
                            {/* Table Assignment (for pending bookings) */}
                            {booking.status === 'pending' && (
                              <div className="mt-4 pt-4 border-t border-gray-100">
                                <label className="block text-xs font-medium text-gray-700 mb-2 items-center">
                                  <TableCellsIcon className="h-3 w-3 mr-1" /> Assign Table
                                </label>
                                <div className="flex flex-wrap gap-2">
                                  {getTableSuggestions(booking.guestCount).map(table => (
                                    <button
                                      key={table}
                                      onClick={() => handleTableAssignment(booking._id, table)}
                                      className="px-3 py-1.5 border-2 border-emerald-300 text-emerald-700 rounded-md hover:bg-emerald-50 text-xs font-medium transition"
                                    >
                                      {table}
                                    </button>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* Timeline View (Simplified) */}
      {viewMode === 'timeline' && (
        <div className="bg-white rounded-xl shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Timeline View</h2>
          <div className="space-y-8">
            {timeSlots.map(timeSlot => (
              <div key={timeSlot} className="border-l-4 border-emerald-500 pl-4">
                <div className="flex items-center mb-3">
                  <ClockIcon className="h-5 w-5 text-emerald-600 mr-2" />
                  <h3 className="text-lg font-bold text-emerald-800">{timeSlot}</h3>
                  <span className="ml-3 px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded text-xs font-medium">
                    {groupedBookings[timeSlot].length} bookings
                  </span>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedBookings[timeSlot].map(booking => (
                    <div key={booking._id} className="border rounded-lg p-4 bg-gray-50 hover:bg-gray-100 transition">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-bold text-gray-900">{booking.customerDetails?.name}</p>
                          <p className="text-sm text-gray-600">{booking.facilityName}</p>
                        </div>
                        {getStatusBadge(booking.status)}
                      </div>
                      
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Guests:</span>
                          <span className="font-medium">{booking.guestCount}</span>
                        </div>
                        {booking.specialRequests && (
                          <p className="mt-2 text-xs text-amber-800 bg-amber-100 p-2 rounded">
                            📝 {booking.specialRequests}
                          </p>
                        )}
                      </div>
                      
                      <div className="mt-3 flex justify-end space-x-2">
                        <button
                          onClick={() => handleCheckIn(booking._id)}
                          className="px-2 py-1 bg-blue-600 text-white rounded text-xs"
                          disabled={booking.status !== 'pending'}
                        >
                          Check-in
                        </button>
                        <button
                          onClick={() => navigate(`/staff/bookings/${booking._id}`)}
                          className="px-2 py-1 bg-gray-200 text-gray-800 rounded text-xs"
                        >
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions Footer */}
      <div className="bg-linear-to-r from-emerald-50 to-blue-50 rounded-xl p-6 border border-emerald-100">
        <div className="max-w-4xl mx-auto">
          <h3 className="text-lg font-bold text-emerald-800 mb-4 text-center">Quick Actions for Staff</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button
              onClick={() => navigate('/staff/bookings/new')}
              className="w-full bg-emerald-600 text-white py-3 rounded-lg hover:bg-emerald-700 transition font-medium flex items-center justify-center"
            >
              <UserIcon className="h-5 w-5 mr-2" /> Add Walk-in
            </button>
            <button
              onClick={() => window.print()}
              className="w-full bg-white text-emerald-700 border-2 border-emerald-600 py-3 rounded-lg hover:bg-emerald-50 transition font-medium flex items-center justify-center"
            >
              <PrinterIcon className="h-5 w-5 mr-2" /> Print Schedule
            </button>
            <button
              onClick={fetchTodayBookings}
              className="w-full bg-gray-100 text-gray-800 py-3 rounded-lg hover:bg-gray-200 transition font-medium flex items-center justify-center"
            >
              <ArrowsRightLeftIcon className="h-5 w-5 mr-2" /> Refresh Data
            </button>
          </div>
          
          <div className="mt-6 pt-4 border-t border-emerald-200 text-center text-sm text-gray-600">
            <p>
              <span className="font-bold text-emerald-800">Shift:</span> 10:00 AM - 10:00 PM | 
              <span className="font-bold text-emerald-800 ml-2">Current Time:</span> {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
            </p>
            <p className="mt-1 text-xs text-gray-500">
              💡 Tip: Use "Check-in" when customers arrive, and add staff notes for important information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}