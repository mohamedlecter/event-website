import { createContext, useContext, useState } from "react";
import { searchTickets, scanTicket } from "../services/ticketService";

const TicketContext = createContext();

export const TicketProvider = ({ children }) => {
  const [ticket, setTicket] = useState(null);
  const [isSearching, setIsSearching] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);

  const handleSearchTicket = async (reference) => {
    setIsSearching(true);
    setError(null);
    try {
      const data = await searchTickets(reference);
      setTicket(data);
    } catch (err) {
      setError(err.message || "Failed to search ticket");
      setTicket(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleScanTicket = async (ticketId, qrData) => {
    setIsScanning(true);
    setError(null);
    try {
      const data = await scanTicket(ticketId, qrData);
      if (ticket) {
        setTicket(ticket.map(t => 
          t._id === data.ticket.id ? { ...t, scanned: true, scannedAt: data.ticket.scannedAt } : t
        ));
      }
      return data;
    } catch (err) {
      setError(err.message || "Failed to scan ticket");
      throw err;
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
