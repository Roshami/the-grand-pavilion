import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import FacilityCard from '../components/venue/FacilityCard';
import { CalendarIcon, ClockIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import Button from '../components/ui/Button';

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [step, setStep] = useState(1); // 1: facility, 2: details, 3: confirmation
  
  // State
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState(location.state?.facility || null);
  const [date, setDate] = useState('');
  const [timeSlot, setTimeSlot] = useState('dinner');
  const [guestCount, setGuestCount] = useState(2);
  const [specialRequests, setSpecialRequests] = useState('');
  const [bookingConfirmed, setBookingConfirmed] = useState(false);
  const [bookingNumber, setBookingNumber] = useState('');
  
  useEffect(() => {
    const fetchFacilities = async () => {
      try {
        const res = await api.get('/facilities');
        setFacilities(res.data.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching facilities:', err);
        setLoading(false);
      }
    };

    fetchFacilities();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (step === 1) {
      if (!selectedFacility) {
        alert('Please select a facility');
        return;
      }
      setStep(2);
      return;
    }
    
    if (step === 2) {
      if (!date) {
        alert('Please select a date');
        return;
      }
      
      try {
        // Check availability first
        const availabilityRes = await api.get('/facilities/availability', {
          params: { 
            date, 
            startTime: timeSlot === 'breakfast' ? '07:00' : timeSlot === 'lunch' ? '12:00' : '18:00',
            endTime: timeSlot === 'breakfast' ? '10:00' : timeSlot === 'lunch' ? '15:00' : '22:00',
            type: selectedFacility.type
          }
        });
        
        const isAvailable = availabilityRes.data.data.some(
          f => f._id === selectedFacility._id && f.isAvailable
        );
        
        if (!isAvailable) {
          alert('This facility is not available for the selected date and time. Please choose another option.');
          return;
        }
        
        // Create booking
        const bookingData = {
          type: selectedFacility.type === 'table' ? 'table' : 'hall',
          facility: selectedFacility._id,
          date,
          mealTime: timeSlot,
          timeSlot: {
            start: timeSlot === 'breakfast' ? '07:00' : timeSlot === 'lunch' ? '12:00' : '18:00',
            end: timeSlot === 'breakfast' ? '10:00' : timeSlot === 'lunch' ? '15:00' : '22:00'
          },
          guestCount,
          specialRequests,
          payment: {
            status: 'unpaid',
            method: 'cash'
          }
        };
        
        const res = await api.post('/bookings', bookingData);
        setBookingNumber(res.data.data.bookingNumber);
        setBookingConfirmed(true);
        setStep(3);
      } catch (err) {
        console.error('Booking error:', err);
        alert(err.response?.data?.message || 'Failed to create booking. Please try again.');
      }
    }
  };

  if (loading && step === 1) return <LoadingSpinner />;

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="flex justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                s < step ? 'bg-burgundy-600 text-white' : s === step ? 'bg-burgundy-100 text-burgundy-600' : 'bg-gray-200 text-gray-500'
              }`}>
                {s}
              </div>
              {s < 3 && (
                <div className={`h-1 w-16 ${
                  s < step ? 'bg-burgundy-600' : 'bg-gray-200'
                }`} />
              )}
            </div>
          ))}
        </div>
        
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-serif font-bold text-burgundy-800">
              {step === 1 && 'Select Your Space'}
              {step === 2 && 'Booking Details'}
              {step === 3 && 'Booking Confirmed!'}
            </h1>
          </div>
          
          <form onSubmit={handleSubmit} className="p-6">
            {/* Step 1: Facility Selection */}
            {step === 1 && (
              <div>
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-2">Choose Your Space</h2>
                  <p className="text-gray-600">Select a table for dining or a hall for your event</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {facilities.map(facility => (
                    <FacilityCard
                      key={facility._id}
                      facility={facility}
                      onSelect={setSelectedFacility}
                      isSelected={selectedFacility?._id === facility._id}
                    />
                  ))}
                </div>
              </div>
            )}
            
            {/* Step 2: Booking Details */}
            {step === 2 && selectedFacility && (
              <div className="space-y-6">
                <div className="bg-burgundy-50 p-4 rounded-lg">
                  <h3 className="font-bold text-lg text-burgundy-800">{selectedFacility.name}</h3>
                  <p className="text-gray-700">
                    {selectedFacility.capacity} guests • {selectedFacility.type === 'table' ? 'Dining Table' : 'Event Hall'}
                  </p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <CalendarIcon className="h-5 w-5 inline mr-2 text-burgundy-600" />
                      Date
                    </label>
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      max={new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <ClockIcon className="h-5 w-5 inline mr-2 text-burgundy-600" />
                      Meal Time
                    </label>
                    <select
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                    >
                      <option value="breakfast">Breakfast (7:00 AM - 10:00 AM)</option>
                      <option value="lunch">Lunch (12:00 PM - 3:00 PM)</option>
                      <option value="dinner">Dinner (6:00 PM - 10:00 PM)</option>
                    </select>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <UserGroupIcon className="h-5 w-5 inline mr-2 text-burgundy-600" />
                    Number of Guests
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={selectedFacility.capacity}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Math.min(Math.max(1, parseInt(e.target.value) || 1), selectedFacility.capacity))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Maximum capacity: {selectedFacility.capacity} guests
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    rows="3"
                    placeholder="e.g., Birthday celebration, window seat preferred, dietary restrictions..."
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}
            
            {/* Step 3: Confirmation */}
            {step === 3 && bookingConfirmed && (
              <div className="text-center py-8">
                <div className="inline-block bg-green-100 text-green-800 rounded-full p-3 mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h2 className="text-3xl font-serif font-bold text-burgundy-800 mb-2">
                  Booking Confirmed!
                </h2>
                <p className="text-xl text-gray-700 mb-4">
                  Your booking number: <span className="font-mono font-bold">{bookingNumber}</span>
                </p>
                <div className="bg-burgundy-50 p-6 rounded-lg mt-6 max-w-md mx-auto">
                  <p className="text-gray-700 mb-2">
                    <strong>Facility:</strong> {selectedFacility?.name}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Date:</strong> {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </p>
                  <p className="text-gray-700 mb-2">
                    <strong>Time:</strong> {timeSlot.charAt(0).toUpperCase() + timeSlot.slice(1)}
                  </p>
                  <p className="text-gray-700">
                    <strong>Guests:</strong> {guestCount}
                  </p>
                </div>
                <div className="mt-8 space-x-4">
                  <Button
                    variant="primary"
                    size="lg"
                    onClick={() => navigate('/my-bookings')}
                  >
                    View My Bookings
                  </Button>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={() => {
                      setStep(1);
                      setSelectedFacility(null);
                      setDate('');
                      setGuestCount(2);
                      setSpecialRequests('');
                      setBookingConfirmed(false);
                    }}
                  >
                    Book Another Table
                  </Button>
                </div>
              </div>
            )}
            
            {/* Navigation Buttons */}
            {step < 3 && (
              <div className="mt-8 flex justify-between">
                {step > 1 && (
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setStep(step - 1)}
                  >
                    Back
                  </Button>
                )}
                <div className={step > 1 ? 'ml-auto' : ''}>
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                  >
                    {step === 1 ? 'Continue to Details' : 'Confirm Booking'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}