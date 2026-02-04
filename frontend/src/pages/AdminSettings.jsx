import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { CheckIcon, PhotoIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';

export default function AdminSettings() {
  const [settings, setSettings] = useState({
    name: '',
    tagline: '',
    contact: {
      phone: '',
      email: '',
      website: ''
    },
    address: {
      street: '',
      city: '',
      postalCode: ''
    },
    openingHours: {
      monday: { open: '10:00', close: '22:00' },
      tuesday: { open: '10:00', close: '22:00' },
      wednesday: { open: '10:00', close: '22:00' },
      thursday: { open: '10:00', close: '22:00' },
      friday: { open: '10:00', close: '23:00' },
      saturday: { open: '10:00', close: '23:00' },
      sunday: { open: '10:00', close: '22:00' }
    },
    mealTimings: {
      breakfast: { start: '07:00', end: '10:00' },
      lunch: { start: '12:00', end: '15:00' },
      dinner: { start: '18:00', end: '22:00' }
    },
    about: '',
    socialMedia: {
      facebook: '',
      instagram: '',
      whatsapp: ''
    }
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await api.get('/restaurant/info');
      if (res.data.data) {
        setSettings(res.data.data);
        if (res.data.data.coverImage) {
          setLogoPreview(res.data.data.coverImage);
        }
      }
      setLoading(false);
    } catch (err) {
      console.error('Error fetching settings:', err);
      setLoading(false);
    }
  };

  const handleInputChange = (e, path = []) => {
    const { name, value } = e.target;
    setSettings(prev => {
      const newState = { ...prev };
      let current = newState;
      
      // Navigate to the correct nested object
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      
      // Set the value
      if (path.length > 0) {
        current[path[path.length - 1]] = value;
      } else {
        newState[name] = value;
      }
      
      return newState;
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      // TODO: Upload logo if changed
      await api.put('/restaurant/info', settings);
      alert('Settings updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update settings');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-serif font-bold text-burgundy-800">Restaurant Settings</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6">
        {/* Basic Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Restaurant Name</label>
              <input
                type="text"
                name="name"
                value={settings.name}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
              <input
                type="text"
                name="tagline"
                value={settings.tagline}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">About Us</label>
              <textarea
                name="about"
                value={settings.about}
                onChange={handleInputChange}
                rows="3"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              />
            </div>
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Contact Information</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={settings.contact?.phone || ''}
                onChange={(e) => handleInputChange(e, ['contact', 'phone'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                value={settings.contact?.email || ''}
                onChange={(e) => handleInputChange(e, ['contact', 'email'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
              <input
                type="url"
                value={settings.contact?.website || ''}
                onChange={(e) => handleInputChange(e, ['contact', 'website'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              />
            </div>
          </div>
        </div>
        
        {/* Address */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Address</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
              <input
                type="text"
                value={settings.address?.street || ''}
                onChange={(e) => handleInputChange(e, ['address', 'street'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                value={settings.address?.city || ''}
                onChange={(e) => handleInputChange(e, ['address', 'city'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
              <input
                type="text"
                value={settings.address?.postalCode || ''}
                onChange={(e) => handleInputChange(e, ['address', 'postalCode'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
              />
            </div>
          </div>
        </div>
        
        {/* Opening Hours */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Opening Hours</h2>
          
          <div className="space-y-4">
            {Object.entries(settings.openingHours || {}).map(([day, hours]) => (
              <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="font-medium capitalize">{day}</span>
                <div className="flex space-x-3">
                  <input
                    type="time"
                    value={hours.open}
                    onChange={(e) => {
                      const newHours = { ...settings.openingHours };
                      newHours[day].open = e.target.value;
                      setSettings(prev => ({ ...prev, openingHours: newHours }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-burgundy-500 focus:border-burgundy-500"
                  />
                  <span className="text-gray-500">to</span>
                  <input
                    type="time"
                    value={hours.close}
                    onChange={(e) => {
                      const newHours = { ...settings.openingHours };
                      newHours[day].close = e.target.value;
                      setSettings(prev => ({ ...prev, openingHours: newHours }));
                    }}
                    className="px-3 py-2 border border-gray-300 rounded focus:ring-burgundy-500 focus:border-burgundy-500"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Social Media */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Social Media Links</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facebook URL</label>
              <input
                type="url"
                value={settings.socialMedia?.facebook || ''}
                onChange={(e) => handleInputChange(e, ['socialMedia', 'facebook'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                placeholder="https://facebook.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Instagram URL</label>
              <input
                type="url"
                value={settings.socialMedia?.instagram || ''}
                onChange={(e) => handleInputChange(e, ['socialMedia', 'instagram'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                placeholder="https://instagram.com/..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp Number</label>
              <input
                type="tel"
                value={settings.socialMedia?.whatsapp || ''}
                onChange={(e) => handleInputChange(e, ['socialMedia', 'whatsapp'])}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-burgundy-500 focus:border-burgundy-500"
                placeholder="+94771234567"
              />
            </div>
          </div>
        </div>
        
        {/* Logo Upload */}
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Restaurant Logo</h2>
          
          <div className="flex items-center space-x-6">
            {logoPreview && (
              <div className="w-32 h-32 rounded-lg overflow-hidden border-2 border-dashed border-gray-300">
                <img src={logoPreview} alt="Logo preview" className="w-full h-full object-contain p-2" />
              </div>
            )}
            <div>
              <label className="flex items-center cursor-pointer">
                <PhotoIcon className="h-6 w-6 text-gray-400 mr-2" />
                <span className="text-burgundy-600 hover:text-burgundy-800 font-medium">
                  {logoFile ? 'Change Logo' : 'Upload Logo'}
                </span>
                <input
                  type="file"
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </label>
              <p className="text-xs text-gray-500 mt-1">Recommended: 500x500px, PNG or JPG</p>
            </div>
          </div>
        </div>
        
        {/* Save Button */}
        <div className="pt-6 border-t border-gray-200 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center bg-burgundy-600 text-white px-6 py-3 rounded-lg hover:bg-burgundy-700 transition disabled:opacity-50"
          >
            <CheckIcon className="h-5 w-5 mr-2" />
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}