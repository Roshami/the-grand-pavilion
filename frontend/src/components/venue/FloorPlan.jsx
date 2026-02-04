import { useState, useEffect } from 'react';

export default function FloorPlan({ facilities = [], onSelectFacility }) {
  const [selectedFacility, setSelectedFacility] = useState(null);
  const [view, setView] = useState('tables'); // 'tables', 'halls', 'all'

  // Filter facilities based on view
  const filteredFacilities = facilities.filter(facility => {
    if (view === 'tables') return facility.type === 'table';
    if (view === 'halls') return facility.type !== 'table';
    return true;
  });

  // Facility click handler
  const handleFacilityClick = (facility) => {
    if (facility.isAvailable) {
      setSelectedFacility(facility);
      onSelectFacility(facility);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-serif font-bold text-burgundy-800">Venue Layout</h2>
        <div className="flex space-x-2">
          {['tables', 'halls', 'all'].map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`px-4 py-2 rounded-lg font-medium ${
                view === v 
                  ? 'bg-burgundy-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
      </div>
      
      <div className="relative bg-cream-50 border-4 border-burgundy-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
        {/* Floor plan background */}
        <div className="absolute inset-0 grid grid-cols-10 grid-rows-8 gap-2 p-4">
          {filteredFacilities.map((facility) => {
            const position = facility.position || { x: 0, y: 0, width: 50, height: 50 };
            
            return (
              <div
                key={facility._id}
                className={`absolute rounded-lg flex items-center justify-center cursor-pointer transition-all ${
                  facility.isAvailable
                    ? selectedFacility?._id === facility._id
                      ? 'bg-burgundy-600 text-white shadow-lg scale-110'
                      : 'bg-burgundy-100 text-burgundy-800 hover:bg-burgundy-200'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed opacity-70'
                }`}
                style={{
                  left: `${position.x}%`,
                  top: `${position.y}%`,
                  width: `${position.width}%`,
                  height: `${position.height}%`,
                }}
                onClick={() => handleFacilityClick(facility)}
                title={`${facility.name} - ${facility.capacity} guests`}
              >
                <div className="text-center px-2">
                  <p className="font-bold text-sm">{facility.name}</p>
                  <p className="text-xs mt-1">{facility.capacity} guests</p>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Legend */}
        <div className="absolute bottom-4 right-4 bg-white rounded-lg shadow-md p-3 flex flex-wrap gap-3">
          <div className="flex items-center">
            <div className="w-4 h-4 bg-burgundy-100 rounded mr-2"></div>
            <span className="text-xs text-gray-700">Available</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-burgundy-600 rounded mr-2"></div>
            <span className="text-xs text-gray-700">Selected</span>
          </div>
          <div className="flex items-center">
            <div className="w-4 h-4 bg-gray-300 rounded mr-2"></div>
            <span className="text-xs text-gray-700">Booked</span>
          </div>
        </div>
      </div>
      
      {selectedFacility && (
        <div className="mt-6 p-4 bg-burgundy-50 rounded-lg">
          <h3 className="font-bold text-lg text-burgundy-800">{selectedFacility.name}</h3>
          <p className="text-gray-700 mt-1">
            Capacity: {selectedFacility.capacity} guests • Type: {selectedFacility.type === 'table' ? 'Dining Table' : 'Event Hall'}
          </p>
          {selectedFacility.features && selectedFacility.features.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-2">
              {selectedFacility.features.map((feature, index) => (
                <span key={index} className="text-xs bg-cream-200 text-burgundy-700 px-2 py-1 rounded">
                  {feature}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}