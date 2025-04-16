import { useEffect } from 'react';
import { useEvents } from '../context/EventContext';
import EventCard from '../components/events/EventCard';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';

const Home = () => {
  const { events, isLoading, error, getEvents } = useEvents();

  useEffect(() => {
    getEvents({ upcoming: true });
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">Discover Amazing Events</h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Find and book tickets for the best events in your city. Concerts, sports, arts and more!
        </p>
      </div>
      
      <h2 className="text-2xl font-bold mb-6">Featured Events</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.length > 0 ? (
          events.slice(0, 3).map(event => (
            <EventCard key={event._id} event={event} />
          ))
        ) : (
          <p className="col-span-3 text-center text-gray-500">
            No upcoming events found.
          </p>
        )}
      </div>
      
      <div className="mt-12 text-center">
        <a 
          href="/events" 
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-md hover:bg-blue-700"
        >
          Browse All Events
        </a>
      </div>
    </div>
  );
};

export default Home;