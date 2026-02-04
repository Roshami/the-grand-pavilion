import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/layout/LoadingSpinner';
import { PlusIcon, PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function AdminMenu() {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [foods, setFoods] = useState([]);
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMenuData();
  }, []);

  const fetchMenuData = async () => {
    try {
      const [categoriesRes, foodsRes] = await Promise.all([
        api.get('/food/categories'),
        api.get('/food')
      ]);
      setCategories(categoriesRes.data.data || []);
      setFoods(foodsRes.data.data || []);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching menu data:', err);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu item?')) return;
    
    try {
      await api.delete(`/food/${id}`);
      alert('Menu item deleted successfully');
      fetchMenuData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete menu item');
    }
  };

  if (loading) return <LoadingSpinner />;

  // Filter foods by category
  const filteredFoods = activeCategory === 'all' 
    ? foods 
    : foods.filter(food => food.category?._id === activeCategory);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-serif font-bold text-burgundy-800">Manage Menu</h1>
        <div className="flex space-x-3">
          <button 
            onClick={() => navigate('/admin/menu/categories')}
            className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
          >
            Manage Categories
          </button>
          <button 
            onClick={() => navigate('/admin/menu/new')}
            className="flex items-center bg-burgundy-600 text-white px-4 py-2 rounded-lg hover:bg-burgundy-700 transition"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add Menu Item
          </button>
        </div>
      </div>

      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setActiveCategory('all')}
          className={`px-4 py-2 rounded-lg font-medium ${
            activeCategory === 'all'
              ? 'bg-burgundy-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          All Items
        </button>
        {categories.map(category => (
          <button
            key={category._id}
            onClick={() => setActiveCategory(category._id)}
            className={`px-4 py-2 rounded-lg font-medium ${
              activeCategory === category._id
                ? 'bg-burgundy-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredFoods.map((food) => {
          const price = food.pricing?.isOnOffer 
            ? food.pricing.offerPrice 
            : food.pricing?.price || 0;
          
          return (
            <div key={food._id} className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200">
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center">
                      <h3 className="text-lg font-bold text-burgundy-800">{food.name}</h3>
                      {food.isPopular && (
                        <span className="ml-2 bg-gold-100 text-gold-800 text-xs px-2 py-0.5 rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 mt-1 text-sm">{food.description}</p>
                    
                    <div className="mt-3 flex flex-wrap gap-1">
                      {food.type === 'veg' && (
                        <span className="text-green-600 text-xs font-medium">🟢 Vegetarian</span>
                      )}
                      {food.type === 'non_veg' && (
                        <span className="text-red-600 text-xs font-medium">🔴 Non-Veg</span>
                      )}
                      {food.spiceLevel && (
                        <span className="text-amber-600 text-xs font-medium">
                          {'🌶️'.repeat(
                            food.spiceLevel === 'mild' ? 1 : 
                            food.spiceLevel === 'medium' ? 2 : 3
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    {food.pricing?.isOnOffer ? (
                      <>
                        <span className="text-lg font-bold text-burgundy-600">Rs. {price}</span>
                        <span className="block text-sm text-gray-500 line-through mt-1">
                          Rs. {food.pricing.price}
                        </span>
                      </>
                    ) : (
                      <span className="text-lg font-bold text-burgundy-600">Rs. {price}</span>
                    )}
                  </div>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/admin/menu/edit/${food._id}`)}
                      className="flex items-center text-burgundy-600 hover:text-burgundy-800"
                    >
                      <PencilIcon className="h-4 w-4 mr-1" />
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(food._id)}
                      className="flex items-center text-red-600 hover:text-red-800"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" />
                      Delete
                    </button>
                  </div>
                  <button
                    onClick={() => window.open(`/menu#${food._id}`, '_blank')}
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <EyeIcon className="h-4 w-4 mr-1" />
                    Preview
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredFoods.length === 0 && (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <div className="text-4xl mb-4">🍽️</div>
          <h3 className="text-xl font-bold text-gray-800 mb-2">No Menu Items Found</h3>
          <p className="text-gray-600 mb-6">
            {activeCategory === 'all' 
              ? 'Add your first menu item to get started' 
              : 'No items in this category yet'}
          </p>
          <button 
            onClick={() => navigate('/admin/menu/new')}
            className="bg-burgundy-600 text-white px-6 py-3 rounded-lg hover:bg-burgundy-700 transition font-medium"
          >
            Add Menu Item
          </button>
        </div>
      )}
    </div>
  );
}