import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import {
  CalendarIcon,
  ChartBarIcon,
  CurrencyDollarIcon,
} from '@heroicons/react/24/outline';

export default function AdminReports() {
  const [reportType, setReportType] = useState('bookings');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const generateReport = async () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }

    setLoading(true);
    try {
      const params = new URLSearchParams({ startDate, endDate });

      let res;
      if (reportType === 'bookings') {
        res = await api.get(`/admin/reports/bookings?${params.toString()}`);
      } else if (reportType === 'revenue') {
        res = await api.get(`/admin/reports/revenue?${params.toString()}`);
      } else if (reportType === 'customers') {
        res = await api.get(`/admin/reports/customers?${params.toString()}`);
      }

      setReportData(res.data.data);
      setLoading(false);
    } catch (err) {
      console.error('Error generating report:', err);
      alert(err.response?.data?.message || 'Failed to generate report');
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-burgundy-800">
        Reports & Analytics
      </h1>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Report Type
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            >
              <option value="bookings">Booking Reports</option>
              <option value="revenue">Revenue Reports</option>
              <option value="customers">Customer Reports</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={generateReport}
              disabled={loading}
              className="w-full bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 transition disabled:opacity-50"
            >
              {loading ? 'Generating...' : 'Generate Report'}
            </button>
          </div>
        </div>

        {reportData && (
          <div className="space-y-6">
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="shrink-0 bg-blue-100 rounded-lg p-3">
                    <CalendarIcon className="h-6 w-6 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-blue-700">
                      Total Bookings
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      {reportData.totalBookings || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-green-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="shrink-0 bg-green-100 rounded-lg p-3">
                    <CurrencyDollarIcon className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-green-700">
                      Total Revenue
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      Rs. {(reportData.totalRevenue || 0).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-purple-50 rounded-xl p-6">
                <div className="flex items-center">
                  <div className="shrink-0 bg-purple-100 rounded-lg p-3">
                    <ChartBarIcon className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-purple-700">
                      Avg. Booking Value
                    </p>
                    <p className="text-2xl font-bold text-gray-900 mt-1">
                      Rs.{' '}
                      {reportData.totalBookings
                        ? Math.round(
                            (reportData.totalRevenue || 0) /
                              reportData.totalBookings,
                          ).toLocaleString()
                        : 0}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Type Breakdown */}
            {reportData.bookingsByType && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Bookings by Type
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(reportData.bookingsByType).map(
                    ([type, count]) => (
                      <div key={type} className="bg-gray-50 rounded-lg p-4">
                        <p className="text-sm text-gray-600 capitalize">
                          {type}
                        </p>
                        <p className="text-3xl font-bold text-burgundy-600 mt-2">
                          {count}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Status Breakdown */}
            {reportData.bookingsByStatus && (
              <div className="mb-8">
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Bookings by Status
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {Object.entries(reportData.bookingsByStatus).map(
                    ([status, count]) => (
                      <div
                        key={status}
                        className="bg-gray-50 rounded-lg p-4 text-center"
                      >
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-medium mb-2 ${
                            status === 'confirmed'
                              ? 'bg-green-100 text-green-800'
                              : status === 'pending'
                                ? 'bg-yellow-100 text-yellow-800'
                                : status === 'cancelled'
                                  ? 'bg-red-100 text-red-800'
                                  : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </span>
                        <p className="text-2xl font-bold text-gray-900 mt-1">
                          {count}
                        </p>
                      </div>
                    ),
                  )}
                </div>
              </div>
            )}

            {/* Top Customers */}
            {reportData.topCustomers && reportData.topCustomers.length > 0 && (
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Top Customers
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Customer
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Bookings
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Total Spent
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {reportData.topCustomers.map((customer, index) => (
                        <tr
                          key={index}
                          className={index < 3 ? 'bg-amber-50' : ''}
                        >
                          <td className="px-6 py-4 whitespace-nowrap font-medium">
                            {customer.customer}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {customer.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-gray-700">
                            {customer.totalBookings}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap font-bold text-burgundy-600">
                            Rs. {customer.totalSpent.toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
