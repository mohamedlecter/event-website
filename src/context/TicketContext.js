import { createContext, useContext, useState } from "react";
import { searchTickets, scanTicket } from "../services/ticketService";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticket, setTicket] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchTicket = async (reference) => {
    if (!reference) {
      setError("Please enter a ticket reference number.");
      return;
    }

    setIsSearching(true);
    setError(null);
    try {
      const result = await searchTickets(reference);
      setTicket(result);
    } catch (err) {
      setTicket(null);
      setError(err.response?.data?.message || err.message || "Failed to search ticket. Please try again.");
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanTicket = async (ticketId) => {
    if (!ticketId) {
      setError("Invalid ticket ID.");
      return;
    }

    setIsScanning(true);
    setError(null);
    try {
      const result = await scanTicket(ticketId);
      setTicket(result);
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Failed to scan ticket. Please try again.");
    } finally {
      setIsScanning(false);
    }
  };

  const clearError = () => {
    setError(null);
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
        clearError
      }}
    >
      {children}
    </TicketContext.Provider>
  );
};

export const useTicket = () => useContext(TicketContext);
