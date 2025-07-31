import {useEffect} from 'react';
import {useEvents} from '../context/EventContext';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorAlert from '../components/ui/ErrorAlert';
import HeroSection from '../components/layout/HeroSection';
import UpcomingEventsSection from '../components/events/UpcomingEventsSection';

const Home = () => {
  const { events, isLoading, error, getEvents } = useEvents();

  useEffect(() => {
    getEvents({ upcoming: true });
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="container">
      <HeroSection />
      <UpcomingEventsSection events={events} />
    </div>
  );
};

export default Home;