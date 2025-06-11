import { createContext, useContext, useState, useEffect } from "react";
import {
  fetchEvents,
  fetchEventDetails,
  initiatePayment,
  verifyPayment,
  fetchUserTickets,
  transferTicket,
} from "../services/eventService";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getEvents = async (filters = {}) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEvents(filters);
      setEvents(data);
      setFilteredEvents(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch events. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getEventDetails = async (id) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchEventDetails(id);
      setSelectedEvent(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch event details. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = (filters) => {
    let results = [...events];

    // Category filter
    if (filters.category) {
      results = results.filter((event) => event.category === filters.category);
    }

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.location.city.toLowerCase().includes(searchTerm) ||
          event.location.country.toLowerCase().includes(searchTerm)
      );
    }

    // Upcoming filter
    if (filters.upcoming) {
      const now = new Date();
      results = results.filter((event) => new Date(event.date) > now);
    }

    // Price range filter
    if (filters.priceRange && filters.priceRange !== 'all') {
      results = results.filter((event) => {
        const price = event.standardTicket.price;
        switch (filters.priceRange) {
          case 'free':
            return price === 0;
          case 'under50':
            return price < 50;
          case 'under100':
            return price < 100;
          case 'over100':
            return price >= 100;
          default:
            return true;
        }
      });
    }

    // Date range filter
    if (filters.dateRange && filters.dateRange !== 'all') {
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      const nextWeek = new Date(today);
      nextWeek.setDate(nextWeek.getDate() + 7);
      const nextMonth = new Date(today);
      nextMonth.setMonth(nextMonth.getMonth() + 1);

      results = results.filter((event) => {
        const eventDate = new Date(event.date);
        switch (filters.dateRange) {
          case 'today':
            return eventDate >= today && eventDate < tomorrow;
          case 'tomorrow':
            return eventDate >= tomorrow && eventDate < new Date(tomorrow.getTime() + 24 * 60 * 60 * 1000);
          case 'thisWeek':
            return eventDate >= today && eventDate < nextWeek;
          case 'thisMonth':
            return eventDate >= today && eventDate < nextMonth;
          default:
            return true;
        }
      });
    }

    setFilteredEvents(results);
  };

  const purchaseTickets = async (eventId, paymentData) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const response = await initiatePayment(eventId, paymentData, token);
      return response;
    } catch (err) {
      setError(err.message || "Failed to process payment. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const confirmPayment = async (sessionId, gateway) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      // For Wave payments, use the stored reference
      const reference = gateway === 'wave' ? localStorage.getItem('wavePaymentReference') : sessionId;
      if (!reference) {
        throw new Error("Payment reference not found");
      }
      
      const payment = await verifyPayment(reference, gateway);
      
      // Clear the stored reference after successful verification
      if (gateway === 'wave') {
        localStorage.removeItem('wavePaymentReference');
      }
      
      return payment;
    } catch (err) {
      setError(err.message || "Failed to confirm payment. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTickets = async () => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const data = await fetchUserTickets(token);
      setTickets(data);
      return data;
    } catch (err) {
      setError(err.message || "Failed to fetch tickets. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const transferUserTicket = async (ticketId, recipientMobileNumber) => {
    setIsLoading(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const data = await transferTicket(ticketId, recipientMobileNumber, token);
      setTickets(
        tickets.map((ticket) => (ticket._id === ticketId ? data : ticket))
      );
      return data;
    } catch (err) {
      setError(err.message || "Failed to transfer ticket. Please try again later.");
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        selectedEvent,
        tickets,
        isLoading,
        error,
        getEvents,
        getEventDetails,
        filterEvents,
        purchaseTickets,
        confirmPayment,
        getUserTickets,
        transferUserTicket,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEvents = () => useContext(EventContext);
