import { useEffect } from "react";
import { useEvents } from "../context/EventContext";
import TicketList from "../components/tickets/TicketList";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";

const MyTickets = () => {
  const { tickets, isLoading, error, getUserTickets } = useEvents();

  useEffect(() => {
    console.log("Fetching user tickets...");
    getUserTickets();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  const validTickets = tickets.filter((ticket) => ticket.event);
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Tickets</h1>

      {validTickets.length > 0 ? (
        <TicketList tickets={validTickets} />
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">
            You haven't purchased any tickets yet.
          </p>
        </div>
      )}
    </div>
  );
};

export default MyTickets;
