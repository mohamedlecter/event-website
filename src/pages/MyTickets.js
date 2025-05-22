import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useEvents } from "../context/EventContext";
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

  useEffect(() => {
    if (tickets.length > 0) {
      const now = new Date();
      const stats = tickets.reduce((acc, ticket) => {
        const eventDate = new Date(ticket.event.date);
        acc.total++;
        if (eventDate > now) {
          acc.upcoming++;
        } else {
          acc.past++;
        }
        return acc;
      }, { total: 0, upcoming: 0, past: 0});
      setStats(stats);
    }
  }, [tickets]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <ErrorAlert message={error} />
      </div>
    );
  }

  const validTickets = tickets.filter((ticket) => ticket.event);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-50"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Tickets</h1>
          <p className="text-gray-600">
            Manage and view all your event tickets in one place
          </p>
        </div>

        {validTickets.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">Total Tickets</h3>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">Upcoming Events</h3>
              <p className="text-2xl font-bold text-blue-600">{stats.upcoming}</p>
            </motion.div>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-sm"
            >
              <h3 className="text-sm font-medium text-gray-500 mb-1">Past Events</h3>
              <p className="text-2xl font-bold text-gray-600">{stats.past}</p>
            </motion.div>

          </div>
        )}

        {validTickets.length > 0 ? (
          <TicketList tickets={validTickets} />
        ) : (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-white rounded-lg shadow-sm p-8 text-center"
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No Tickets Yet
            </h2>
            <p className="text-gray-600 mb-6">
              You haven't purchased any tickets yet. Browse our events to find something you'd like to attend!
            </p>
            <a
              href="/events"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
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
