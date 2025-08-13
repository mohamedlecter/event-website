import {useEffect, useState} from "react";
import {motion} from "framer-motion";
import {useEvents} from "../context/EventContext";
import TicketList from "../components/tickets/TicketList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";

const MyTickets = () => {
  const { tickets, isLoading, error, getUserTickets } = useEvents();
  const [stats, setStats] = useState({
    total: 0,
    upcoming: 0,
    past: 0,
  });

  useEffect(() => {
    getUserTickets();
  }, []);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#C6D6D8C2] flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#C6D6D8C2] flex items-center justify-center px-4">
        <ErrorAlert message={error} />
      </div>
    );
  }

  const validTickets = tickets.filter((ticket) => ticket.event);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-[#C6D6D8C2]"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {validTickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-8 md:mb-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">Total Tickets</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">Upcoming Events</h3>
              <p className="text-2xl md:text-3xl font-bold text-[#FBA415]">{stats.upcoming}</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-6 md:p-8 shadow-sm hover:shadow-md transition-shadow"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-2">Past Events</h3>
              <p className="text-2xl md:text-3xl font-bold text-gray-600">{stats.past}</p>
            </motion.div>
          </div>
        )}

        {validTickets.length > 0 ? (
          <TicketList tickets={validTickets} />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 md:p-12 text-center"
          >
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900 mb-3">
              No Tickets Yet
            </h2>
            <p className="text-gray-600 mb-6 md:mb-8 text-base md:text-lg">
              You haven't purchased any tickets yet. Browse our events to find something you'd like to attend!
            </p>
            <a
              href="/events"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-gray-900 bg-[#FBA415] hover:bg-[#FBA415]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FBA415] transition-colors duration-200"
            >
              Browse Events
            </a>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export default MyTickets;
