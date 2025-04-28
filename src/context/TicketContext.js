import { createContext, useContext, useState } from "react";
import { searchTickets, scanTicket } from "../services/ticketService";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticket, setTicket] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const handleSearchTicket = async (reference) => {
    setIsSearching(true);
    setError(null);
    try {
      const result = await searchTickets(reference, token);
      setTicket(result);
      console.log("Search result:", result); // Debugging line
      console.log(ticket);
      
    } catch (err) {
      setTicket(null);
      setError(err.message || "Failed to search ticket.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanTicket = async (ticketId) => {
    setIsScanning(true);
    setError(null);
    try {
      const result = await scanTicket(ticketId, token);
      setTicket(result); // Update the current ticket with new scanned status
      console.log("Scanned ticket:", result); // Debugging line
    } catch (err) {
      setError(err.message || "Failed to scan ticket.");
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <TicketContext.Provider
      value={{
        ticket,
        isSearching,
        isScanning,
        error,
        handleSearchTicket,
        handleScanTicket,
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);
