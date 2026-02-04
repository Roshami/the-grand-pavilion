import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import FacilityCard from '../components/venue/FacilityCard';
import FloorPlan from '../components/venue/FloorPlan';
import { Link } from 'react-router-dom';

export default function Venue() {
  const [venueInfo, setVenueInfo] = useState(null);
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [view, setView] = useState('overview'); // 'overview', 'floorplan', 'tables', 'halls'

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [venueRes, facilitiesRes] = await Promise.all([
          api.get('/restaurant/info'),
          api.get('/facilities'),
        ]);
        console.log(venueRes.data.data);
        setVenueInfo(venueRes.data.data);
        console.log(facilitiesRes.data.data);
        setFacilities(facilitiesRes.data.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load venue information');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-burgundy-900 to-burgundy-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Elegant Venue
          </h1>
          <p className="text-xl text-cream-100 max-w-3xl mx-auto">
            Discover our beautifully designed spaces perfect for intimate
            dinners, family gatherings, and grand celebrations
          </p>
        </div>
      </section>

      {/* Venue Info */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-xl shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-bold text-burgundy-800 mb-2">
                  Contact
                </h3>
                <p className="text-gray-600">{venueInfo.contact.phone}</p>
                <p className="text-gray-600">{venueInfo.contact.email}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-burgundy-800 mb-2">
                  Address
                </h3>
                <p className="text-gray-600">{venueInfo.address.street}</p>
                <p className="text-gray-600">
                  {venueInfo.address.city}, {venueInfo.address.postalCode}
                </p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-burgundy-800 mb-2">
                  Hours
                </h3>
                <p className="text-gray-600">Monday - Sunday</p>
                <p className="text-gray-600">10:00 AM - 10:00 PM</p>
              </div>
            </div>
          </div>

          {/* View Selector */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {['overview', 'floorplan', 'tables', 'halls'].map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${
                  view === v
                    ? 'bg-burgundy-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                {v === 'floorplan'
                  ? 'Floor Plan'
                  : v.charAt(0).toUpperCase() + v.slice(1)}
              </button>
            ))}
          </div>

          {/* Content based on view */}
          {view === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h2 className="text-2xl font-serif font-bold text-burgundy-800 mb-4">
                  Our Spaces
                </h2>
                <p className="text-gray-700 mb-6">
                  The Grand Pavilion offers a variety of elegantly designed
                  spaces to suit every occasion. From intimate dining tables to
                  grand event halls, each space is thoughtfully crafted to
                  provide the perfect backdrop for your celebrations.
                </p>

                <div className="space-y-4">
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h3 className="font-bold text-burgundy-700">Dining Area</h3>
                    <p className="text-gray-600 mt-1">
                      Elegant tables for 2-8 guests with ambient lighting and
                      premium seating
                    </p>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h3 className="font-bold text-burgundy-700">Grand Hall</h3>
                    <p className="text-gray-600 mt-1">
                      Spacious hall accommodating up to 150 guests with stage,
                      dance floor, and premium sound system
                    </p>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h3 className="font-bold text-burgundy-700">Garden Area</h3>
                    <p className="text-gray-600 mt-1">
                      Beautiful outdoor space for 80 guests with fairy lights
                      and natural ambiance
                    </p>
                  </div>
                  <div className="bg-cream-50 p-4 rounded-lg">
                    <h3 className="font-bold text-burgundy-700">
                      Private Rooms
                    </h3>
                    <p className="text-gray-600 mt-1">
                      Intimate rooms for 10-12 guests perfect for family
                      gatherings and business meetings
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-gray-100 border-2 border-dashed rounded-xl h-96 flex items-center justify-center">
                <p className="text-gray-500">Venue photos coming soon</p>
              </div>
            </div>
          )}

          {view === 'floorplan' && (
            <FloorPlan
              facilities={facilities}
              onSelectFacility={setSelectedFacility}
            />
          )}

          {(view === 'tables' || view === 'halls' || view === 'overview') &&
            view !== 'floorplan' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {facilities
                  .filter((f) =>
                    view === 'tables'
                      ? f.type === 'table'
                      : view === 'halls'
                        ? f.type !== 'table'
                        : true,
                  )
                  .map((facility) => (
                    <FacilityCard
                      key={facility._id}
                      facility={facility}
                      onSelect={setSelectedFacility}
                      isSelected={selectedFacility?._id === facility._id}
                    />
                  ))}
              </div>
            )}

          {/* Booking CTA */}
          {selectedFacility && (
            <div className="mt-12 bg-linear-to-r from-burgundy-50 to-cream-50 rounded-xl p-6 text-center">
              <h3 className="text-2xl font-serif font-bold text-burgundy-800 mb-2">
                Ready to Book {selectedFacility.name}?
              </h3>
              <p className="text-gray-700 mb-4">
                {selectedFacility.capacity} guests •{' '}
                {selectedFacility.type === 'table'
                  ? 'Dining Experience'
                  : 'Event Space'}
              </p>
              <Link
                to="/booking"
                state={{ facility: selectedFacility }}
                className="inline-block bg-burgundy-600 text-white font-bold px-8 py-3 rounded-lg hover:bg-burgundy-700 transition transform hover:scale-105"
              >
                Proceed to Booking
              </Link>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
