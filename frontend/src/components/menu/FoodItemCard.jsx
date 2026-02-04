import { useState } from 'react';
import { StarIcon } from '@heroicons/react/24/solid';

export default function FoodItemCard({ item, onAddToCart }) {
  const [quantity, setQuantity] = useState(0);
  const price = item.isOnOffer ? item.offerPrice : item.price;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
      <div className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center">
              <h3 className="text-lg font-bold text-burgundy-800">{item.name}</h3>
              {item.isPopular && (
                <span className="ml-2 bg-gold-100 text-gold-800 text-xs px-2 py-0.5 rounded-full">
                  Popular
                </span>
              )}
            </div>
            <p className="text-gray-600 mt-1 text-sm">{item.description}</p>
            
            {/* Dietary info */}
            <div className="mt-2 flex flex-wrap gap-1">
              {item.type === 'veg' && (
                <span className="text-green-600 text-xs font-medium">🟢 Vegetarian</span>
              )}
              {item.type === 'non_veg' && (
                <span className="text-red-600 text-xs font-medium">🔴 Non-Vegetarian</span>
              )}
              {item.spiceLevel && (
                <span className="text-amber-600 text-xs font-medium">
                  {'🌶️'.repeat(item.spiceLevel === 'mild' ? 1 : item.spiceLevel === 'medium' ? 2 : 3)}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center">
              {item.rating && (
                <>
                  <StarIcon className="h-4 w-4 text-gold-400" />
                  <span className="ml-1 text-sm font-medium text-gray-700">{item.rating}</span>
                </>
              )}
            </div>
            <div className="mt-1">
              {item.isOnOffer ? (
                <>
                  <span className="text-lg font-bold text-burgundy-600">Rs. {price}</span>
                  <span className="ml-2 text-sm text-gray-500 line-through">Rs. {item.price}</span>
                </>
              ) : (
                <span className="text-lg font-bold text-burgundy-600">Rs. {price}</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Quantity selector */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity(q => Math.max(0, q - 1))}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
              disabled={quantity === 0}
            >
              -
            </button>
            <span className="w-8 text-center font-medium">{quantity}</span>
            <button
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100"
            >
              +
            </button>
          </div>
          
          <button
            onClick={() => onAddToCart({ ...item, quantity })}
            disabled={quantity === 0 || !item.isAvailable}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              quantity > 0 && item.isAvailable
                ? 'bg-burgundy-600 text-white hover:bg-burgundy-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            {item.isAvailable ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}