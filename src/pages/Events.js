import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EventFilter from '../components/events/EventFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import { getApiUrl } from '../config/env';

const Events = () => {
  const { 
    filteredEvents, 
    isLoading, 
    error, 
    getEvents, 
    filterEvents 
  } = useEvents();

  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('grid');
  const [isFilterVisible, setIsFilterVisible] = useState(true);
  const [isInitialLoad, setIsInitialLoad] = useState(true);


  useEffect(() => {
    const loadEvents = async () => {
      try {
        await getEvents();
      } finally {
        setIsInitialLoad(false);
      }
    };
    loadEvents();
  }, []);

  const handleFilter = (filters) => {
    filterEvents(filters);
  };

  const handleSort = (e) => {
    setSortBy(e.target.value);
  };

  const sortEvents = (events) => {
    const sortedEvents = [...events];
    switch (sortBy) {
      case 'date':
        return sortedEvents.sort((a, b) => new Date(a.date) - new Date(b.date));
      case 'price-asc':
        return sortedEvents.sort((a, b) => a.standardTicket.price - b.standardTicket.price);
      case 'price-desc':
        return sortedEvents.sort((a, b) => b.standardTicket.price - a.standardTicket.price);
      case 'name':
        return sortedEvents.sort((a, b) => a.title.localeCompare(b.title));
      default:
        return sortedEvents;
    }
  };

  const sortedEvents = sortEvents(filteredEvents);

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <ErrorAlert message={error} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Discover Events</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find and book tickets for the best events in your area. From concerts to conferences,
            we've got you covered.
          </p>
        </motion.div>

        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsFilterVisible(!isFilterVisible)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-expanded={isFilterVisible}
              aria-controls="filter-section"
            >
              {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
            </button>

            <select
              value={sortBy}
              onChange={handleSort}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white rounded-lg shadow-sm border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              aria-label="Sort events by"
            >
              <option value="date">Sort by Date</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>

          <div className="flex items-center gap-2" role="radiogroup" aria-label="View mode">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-lg ${
                viewMode === 'grid'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              role="radio"
              aria-checked={viewMode === 'grid'}
              aria-label="Grid view"
            >
              Grid View
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-lg ${
                viewMode === 'list'
                  ? 'bg-blue-100 text-blue-600'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              role="radio"
              aria-checked={viewMode === 'list'}
              aria-label="List view"
            >
              List View
            </button>
          </div>
        </div>
        
        <AnimatePresence>
          {isFilterVisible && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-8"
              id="filter-section"
            >
              <EventFilter onFilter={handleFilter} />
            </motion.div>
          )}
        </AnimatePresence>
        
        {isLoading && isInitialLoad ? (
          <div className="flex justify-center items-center min-h-[400px]">
            <LoadingSpinner />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8"
          >
            {sortedEvents.length > 0 ? (
              <div 
                className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8' : 'space-y-6'}
                role="list"
                aria-label="Event list"
              >
                <AnimatePresence>
                  {sortedEvents.map((event, index) => (
                    <motion.div
                      key={event._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={viewMode === 'list' ? 'w-full' : ''}
                      role="listitem"
                    >
                      <EventCard event={event} viewMode={viewMode} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-16"
              >
                <div className="max-w-md mx-auto">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No events found
                  </h3>
                  <p className="text-gray-500">
                    We couldn't find any events matching your criteria. Try adjusting your filters
                    or check back later for new events.
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Events;