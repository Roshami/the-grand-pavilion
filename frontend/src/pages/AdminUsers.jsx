import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { ShieldCheckIcon, ShieldExclamationIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../context/AuthContext'; // ✅ MUST IMPORT

export default function AdminUsers() {
  // ✅ CRITICAL: Get user from AuthContext at component level
  const { user: currentUser } = useAuth(); // Renamed to avoid conflicts
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      const params = roleFilter !== 'all' ? `?role=${roleFilter}` : '';
      // ✅ FIXED ENDPOINT: Changed to /admin/users
      const res = await api.get(`/admin/users${params}`);
      
      // Handle response structure
      const usersData = res.data.success ? res.data.data : res.data;
      // ✅ Add isCurrentUser marker
      const usersWithMarkers = (usersData || []).map(u => ({
        ...u,
        isCurrentUser: u._id === currentUser?._id
      }));
      
      setUsers(usersWithMarkers);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching users:', err);
      alert(`Failed to load users: ${err.response?.data?.message || err.message}`);
      setLoading(false);
      setUsers([]);
    }
  };

  // ✅ FIXED: Uses currentUser from component scope
  const updateRole = async (userId, newRole) => {
    // ✅ SAFETY CHECK: Ensure currentUser exists
    if (!currentUser) {
      alert('Error: User session not found. Please login again.');
      return;
    }

    // Prevent self-demote warning
    if (userId === currentUser._id && newRole !== 'admin') {
      if (!window.confirm('⚠️ Warning: You are about to demote yourself! This will log you out immediately. Continue?')) {
        return;
      }
    }
    
    if (!window.confirm(`Change user role to ${newRole}?`)) return;
    
    try {
      // ✅ CORRECT ENDPOINT with user ID
      await api.put(`/admin/users/${userId}/role`, { role: newRole });
      
      alert('✅ User role updated successfully!');
      fetchUsers(); // Refresh list
    } catch (err) {
      const message = err.response?.data?.message || 
                     err.response?.data?.error || 
                     'Failed to update user role';
      alert(`❌ Error: ${message}`);
      console.error('Update role error:', err);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-burgundy-800">Manage Users</h1>
        <select
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
        >
          <option value="all">All Users</option>
          <option value="customer">Customers</option>
          <option value="staff">Staff</option>
          <option value="admin">Admins</option>
        </select>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Member Since</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="shrink-0 h-10 w-10">
                        <div className={`rounded-full h-10 w-10 flex items-center justify-center font-bold ${
                          user.role === 'admin' ? 'bg-purple-200 text-purple-800' :
                          user.role === 'staff' ? 'bg-blue-200 text-blue-800' :
                          'bg-green-200 text-green-800'
                        }`}>
                          {user.name?.charAt(0) || '?'}
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        {user.isCurrentUser && (
                          <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded mt-1 inline-block">
                            You (Admin)
                          </span>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {user.phone}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.isCurrentUser ? (
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                      </span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => updateRole(user._id, e.target.value)}
                        className="px-2 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50 transition"
                      >
                        <option value="customer">Customer</option>
                        <option value="staff">Staff</option>
                        <option value="admin">Admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                    {new Date(user.createdAt).toLocaleDateString('en-US', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    {user.isCurrentUser ? (
                      <span className="text-gray-400">Cannot modify self</span>
                    ) : (
                      <button
                        onClick={() => updateRole(user._id, user.role === 'admin' ? 'staff' : 'admin')}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          user.role === 'admin' 
                            ? 'bg-red-100 text-red-800 hover:bg-red-200' 
                            : 'bg-purple-100 text-purple-800 hover:bg-purple-200'
                        }`}
                      >
                        {user.role === 'admin' ? 'Demote' : 'Promote to Admin'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {users.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-4">👥</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Users Found</h3>
          <p className="text-gray-600">Try changing the role filter to see users</p>
        </div>
      )}
    </div>
  );
}