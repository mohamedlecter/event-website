import { useState } from 'react';

const EventFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    upcoming: false
  });

  const categories = [
    'music', 'sports', 'art', 'food', 'business', 'technology', 'other'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search events..."
            className="w-full p-2 border rounded-md"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </option>
            ))}
          </select>
        </div>
        
        <div className="flex items-center">
          <input
            type="checkbox"
            id="upcoming"
            name="upcoming"
            checked={filters.upcoming}
            onChange={handleChange}
            className="h-4 w-4 text-blue-600 rounded"
          />
          <label htmlFor="upcoming" className="ml-2 text-sm text-gray-700">
            Upcoming Only
          </label>
        </div>
        
        <div className="flex items-end">
          <button
            onClick={() => {
              const resetFilters = {
                category: '',
                search: '',
                upcoming: false
              };
              setFilters(resetFilters);
              onFilter(resetFilters);
            }}
            className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventFilter;