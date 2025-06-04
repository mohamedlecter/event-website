import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const EventFilter = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    category: '',
    search: '',
    upcoming: false,
    priceRange: 'all',
    dateRange: 'all'
  });

  const [activeFilters, setActiveFilters] = useState([]);
  const searchInputRef = useRef(null);

  const categories = [
    { value: 'music', label: 'Music' },
    { value: 'sports', label: 'Sports' },
    { value: 'art', label: 'Art' },
    { value: 'food', label: 'Food'},
    { value: 'business', label: 'Business' },
    { value: 'technology', label: 'Technology' },
    { value: 'other', label: 'Other' }
  ];

  const priceRanges = [
    { value: 'all', label: 'All Prices' },
    { value: 'free', label: 'Free' },
    { value: 'under50', label: 'Under GMD 50' },
    { value: 'under100', label: 'Under GMD 100' },
    { value: 'over100', label: 'Over GMD 100' }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Dates' },
    { value: 'today', label: 'Today' },
    { value: 'tomorrow', label: 'Tomorrow' },
    { value: 'thisWeek', label: 'This Week' },
    { value: 'thisMonth', label: 'This Month' }
  ];

  useEffect(() => {
    const activeFiltersList = [];
    if (filters.category) {
      const category = categories.find(c => c.value === filters.category);
      activeFiltersList.push({ type: 'category', label: category.label, value: filters.category });
    }
    if (filters.priceRange !== 'all') {
      const priceRange = priceRanges.find(p => p.value === filters.priceRange);
      activeFiltersList.push({ type: 'price', label: priceRange.label, value: filters.priceRange });
    }
    if (filters.dateRange !== 'all') {
      const dateRange = dateRanges.find(d => d.value === filters.dateRange);
      activeFiltersList.push({ type: 'date', label: dateRange.label, value: filters.dateRange });
    }
    if (filters.upcoming) {
      activeFiltersList.push({ type: 'upcoming', label: 'Upcoming Only', value: true });
    }
    setActiveFilters(activeFiltersList);
  }, [filters]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newFilters = {
      ...filters,
      [name]: type === 'checkbox' ? checked : value
    };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      category: '',
      search: '',
      upcoming: false,
      priceRange: 'all',
      dateRange: 'all'
    };
    setFilters(resetFilters);
    onFilter(resetFilters);
    searchInputRef.current?.focus();
  };

  const removeFilter = (filterToRemove) => {
    const newFilters = { ...filters };
    switch (filterToRemove.type) {
      case 'category':
        newFilters.category = '';
        break;
      case 'price':
        newFilters.priceRange = 'all';
        break;
      case 'date':
        newFilters.dateRange = 'all';
        break;
      case 'upcoming':
        newFilters.upcoming = false;
        break;
    }
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleKeyPress = (e, filter) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      removeFilter(filter);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white p-6 rounded-lg shadow-sm"
      role="region"
      aria-label="Event filters"
    >
      <div className="space-y-6">
        <div className="relative">
          <input
            ref={searchInputRef}
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Search by title, description, or location..."
            className="w-full p-3 pl-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
            aria-label="Search events"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              aria-label="Select event category"
            >
              <option value="">All Categories</option>
              {categories.map(category => (
                <option key={category.value} value={category.value}>
                  {category.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              id="priceRange"
              name="priceRange"
              value={filters.priceRange}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              aria-label="Select price range"
            >
              {priceRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="dateRange" className="block text-sm font-medium text-gray-700 mb-1">
              Date Range
            </label>
            <select
              id="dateRange"
              name="dateRange"
              value={filters.dateRange}
              onChange={handleChange}
              className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none bg-white"
              aria-label="Select date range"
            >
              {dateRanges.map(range => (
                <option key={range.value} value={range.value}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              name="upcoming"
              checked={filters.upcoming}
              onChange={handleChange}
              className="h-4 w-4 text-blue-600 rounded focus:ring-blue-500"
              aria-label="Show upcoming events only"
            />
            <span className="text-sm text-gray-700">Upcoming Only</span>
          </label>

          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors duration-200"
            aria-label="Reset all filters"
          >
            Reset All Filters
          </button>
        </div>

        <AnimatePresence>
          {activeFilters.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 pt-2"
              role="list"
              aria-label="Active filters"
            >
              {activeFilters.map((filter, index) => (
                <motion.div
                  key={`${filter.type}-${filter.value}`}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                  role="listitem"
                >
                  <span>{filter.label}</span>
                  <button
                    onClick={() => removeFilter(filter)}
                    onKeyPress={(e) => handleKeyPress(e, filter)}
                    className="hover:text-blue-900 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-1"
                    aria-label={`Remove ${filter.label} filter`}
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default EventFilter;