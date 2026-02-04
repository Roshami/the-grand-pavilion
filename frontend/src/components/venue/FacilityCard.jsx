import { useState } from 'react';
import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/solid';

export default function FacilityCard({ facility, onSelect, isSelected }) {
  const [isHovered, setIsHovered] = useState(false);
  
  const getCapacityBadge = () => {
    if (facility.capacity <= 4) return 'Intimate';
    if (facility.capacity <= 8) return 'Small Group';
    if (facility.capacity <= 20) return 'Medium';
    return 'Large';
  };

  const getTypeColor = () => {
    switch (facility.type) {
      case 'table': return 'bg-blue-100 text-blue-800';
      case 'hall': return 'bg-purple-100 text-purple-800';
      case 'room': return 'bg-green-100 text-green-800';
      case 'outdoor': return 'bg-amber-100 text-amber-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`bg-white rounded-xl shadow-md overflow-hidden border-2 transition-all duration-300 ${
        isSelected 
          ? 'border-burgundy-500 ring-2 ring-burgundy-300' 
          : facility.isAvailable 
            ? 'border-gray-200 hover:border-burgundy-300' 
            : 'border-gray-300 opacity-60 cursor-not-allowed'
      }`}
      onClick={() => facility.isAvailable && onSelect(facility)}
    >
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-xl font-bold text-burgundy-800">{facility.name}</h3>
              {facility.isAvailable ? (
                <CheckCircleIcon className="h-5 w-5 text-green-500" />
              ) : (
                <XCircleIcon className="h-5 w-5 text-red-500" />
              )}
            </div>
            <p className="text-gray-600 mt-1">{facility.description || 'Elegant dining space'}</p>
          </div>
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeColor()}`}>
            {facility.type === 'table' ? 'Table' : 'Hall'}
          </span>
        </div>
        
        <div className="mt-4 grid grid-cols-2 gap-3">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Capacity</p>
            <p className="font-bold text-lg">{facility.capacity} guests</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm text-gray-500">Size</p>
            <p className="font-bold text-lg">
              {facility.dimensions?.area ? `${facility.dimensions.area} sq ft` : 'Standard'}
            </p>
          </div>
        </div>
        
        {facility.features && facility.features.length > 0 && (
          <div className="mt-4">
            <p className="text-sm text-gray-500 mb-2">Features</p>
            <div className="flex flex-wrap gap-2">
              {facility.features.map((feature, index) => (
                <span 
                  key={index} 
                  className="px-2 py-1 bg-cream-100 text-burgundy-700 text-xs rounded-full"
                >
                  {feature}
                </span>
              ))}
            </div>
          </div>
        )}
        
        {facility.isAvailable && (
          <div className={`mt-4 pt-4 border-t transition-all duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-0'
          }`}>
            <button 
              className="w-full bg-burgundy-600 text-white py-2 rounded-lg font-medium hover:bg-burgundy-700 transition"
              onClick={(e) => {
                e.stopPropagation();
                onSelect(facility);
              }}
            >
              Select This {facility.type === 'table' ? 'Table' : 'Hall'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}