import { useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import EventFilter from '../components/events/EventFilter';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

const Events = () => {
  const { 
    filteredEvents, 
    isLoading, 
    error, 
    getEvents, 
    filterEvents 
  } = useEvents();

  useEffect(() => {
    getEvents();
  }, []);

  const handleFilter = (filters) => {
    filterEvents(filters);
  };

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Upcoming Events</h1>
      
      <EventFilter onFilter={handleFilter} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        {filteredEvents.length > 0 ? (
          filteredEvents.map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No events found matching your criteria.
          </p>
        )}
      </div>
    </div>
  );
};

export default Events;