import { useState, useEffect } from 'react';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import FoodItemCard from '../components/menu/FoodItemCard';
import { Link } from 'react-router-dom';

export default function Menu() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
  const fetchMenu = async () => {
    try {
      const res = await api.get('/restaurant/menu');
      
      // ✅ FIX: Backend returns { menu: [...] }, NOT { data: [...] }
      const menuData = res.data.menu || res.data.data || [];
      
      // Safety check: Ensure it's an array
      if (Array.isArray(menuData)) {
        setMenu(menuData);
      } else {
        setMenu([]);
        console.warn('Menu data is not an array, setting to empty array');
      }
      
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu:', err);
      setError('Failed to load menu. Please try again later.');
      setLoading(false);
      setMenu([]); // Always keep as array
    }
  };

  fetchMenu();
}, []);

  if (loading) return <LoadingSpinner />;
  if (error)
    return <div className="text-center py-12 text-red-600">{error}</div>;

  // Get all categories
  const categories = [
    'all',
    ...new Set(menu.flatMap((section) => section.category)),
  ];

  // Filter menu items
  const filteredMenu = menu.filter((section) => {
    if (activeCategory !== 'all' && section.category !== activeCategory)
      return false;

    if (searchTerm) {
      return section.items.some(
        (item) =>
          item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          item.description?.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    return true;
  });

  const handleAddToCart = (item) => {
    // In a real app, this would add to cart context/state
    alert(`${item.name} (x${item.quantity}) added to your booking!`);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <section className="bg-linear-to-r from-burgundy-900 to-burgundy-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold mb-4">
            Our Exquisite Menu
          </h1>
          <p className="text-xl text-cream-100 max-w-3xl mx-auto">
            Discover our carefully crafted dishes made with the finest
            ingredients and authentic flavors
          </p>
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Search & Filter */}
          <div className="mb-8">
            <div className="max-w-2xl mx-auto mb-6">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search menu items..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-burgundy-500 focus:border-transparent"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveCategory(category)}
                  className={`px-4 py-2 rounded-lg font-medium capitalize ${
                    activeCategory === category
                      ? 'bg-burgundy-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Items */}
          {filteredMenu.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <p>No items found matching your search</p>
            </div>
          ) : (
            filteredMenu.map((section, index) => (
              <div key={index} className="mb-12">
                <div className="flex items-center mb-6">
                  <div className="h-1 bg-burgundy-200 grow"></div>
                  <h2 className="px-6 text-3xl font-serif font-bold text-burgundy-800">
                    {section.category}
                  </h2>
                  <div className="h-1 bg-burgundy-200 grow"></div>
                </div>
                {section.description && (
                  <p className="text-gray-600 mb-4 max-w-2xl mx-auto text-center">
                    {section.description}
                  </p>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {section.items.map((item, itemIndex) => (
                    <FoodItemCard
                      key={itemIndex}
                      item={item}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </div>
              </div>
            ))
          )}

          {/* Booking CTA */}
          <div className="mt-16 bg-linear-to-r from-burgundy-50 to-cream-50 rounded-xl p-8 text-center">
            <h2 className="text-3xl font-serif font-bold text-burgundy-800 mb-4">
              Ready to Taste Our Creations?
            </h2>
            <p className="text-gray-700 mb-6 max-w-2xl mx-auto">
              Book a table now and experience our culinary excellence firsthand.
              Our chefs prepare every dish with passion and precision.
            </p>
            <Link
              to="/booking"
              className="inline-block bg-burgundy-600 text-white font-bold px-8 py-4 rounded-lg text-lg hover:bg-burgundy-700 transition transform hover:scale-105"
            >
              Book a Table Now
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
