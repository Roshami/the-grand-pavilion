import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

export default function AdminFacilities() {
  const navigate = useNavigate();
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchFacilities();
  }, []);

  const fetchFacilities = async () => {
    try {
      const res = await api.get('/facilities');
      setFacilities(res.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching facilities:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this facility? This cannot be undone.')) return;
    
    setDeletingId(id);
    try {
      await api.delete(`/facilities/${id}`);
      alert('Facility deleted successfully');
      fetchFacilities();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete facility');
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-burgundy-800">Manage Facilities</h1>
        <button 
          onClick={() => navigate('/admin/facilities/new')}
          className="flex items-center bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 transition"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add New Facility
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {facilities.map((facility) => (
          <div key={facility._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
            <div className="p-5">
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center">
                    <h3 className="text-xl font-bold text-burgundy-800">{facility.name}</h3>
                    <span className={`ml-3 px-2 py-1 rounded-full text-xs font-medium ${
                      facility.isAvailable ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {facility.isAvailable ? 'Available' : 'Unavailable'}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1 capitalize">{facility.type}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  facility.type === 'table' ? 'bg-blue-100 text-blue-800' :
                  facility.type === 'hall' ? 'bg-purple-100 text-purple-800' :
                  facility.type === 'room' ? 'bg-green-100 text-green-800' :
                  'bg-amber-100 text-amber-800'
                }`}>
                  {facility.type === 'table' ? 'Table' : 'Hall'}
                </span>
              </div>
              
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-sm text-gray-500">Capacity</p>
                  <p className="font-bold text-lg">{facility.capacity} guests</p>
                </div>
                {facility.dimensions?.area && (
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-sm text-gray-500">Area</p>
                    <p className="font-bold text-lg">{facility.dimensions.area} sq ft</p>
                  </div>
                )}
              </div>
              
              {facility.features && facility.features.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-gray-500 mb-2">Features</p>
                  <div className="flex flex-wrap gap-1">
                    {facility.features.map((feature, index) => (
                      <span key={index} className="text-xs bg-cream-100 text-burgundy-700 px-2 py-1 rounded">
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
              
              <div className="mt-5 pt-4 border-t border-gray-200 flex justify-between">
                <button
                  onClick={() => navigate(`/admin/facilities/edit/${facility._id}`)}
                  className="flex items-center text-burgundy-600 hover:text-burgundy-800"
                >
                  <PencilIcon className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(facility._id)}
                  disabled={deletingId === facility._id}
                  className="flex items-center text-red-600 hover:text-red-800 disabled:opacity-50"
                >
                  <TrashIcon className="h-4 w-4 mr-1" />
                  {deletingId === facility._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {facilities.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-4">🏛️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Facilities Added</h3>
          <p className="text-gray-600 mb-6">Add your first table or hall to get started</p>
          <button 
            onClick={() => navigate('/admin/facilities/new')}
            className="bg-burgundy-600 text-white px-6 py-3 rounded-lg hover:bg-burgundy-700 transition font-medium"
          >
            Add Facility
          </button>
        </div>
      )}
    </div>
  );
}