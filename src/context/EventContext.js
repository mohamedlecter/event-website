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
    try {
      const data = await fetchEvents(filters);
      setEvents(data);
      setFilteredEvents(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getEventDetails = async (id) => {
    setIsLoading(true);
    try {
      const data = await fetchEventDetails(id);
      setSelectedEvent(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = (filters) => {
    let results = [...events];

    if (filters.category) {
      results = results.filter((event) => event.category === filters.category);
    }

    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      results = results.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm)
      );
    }

    if (filters.upcoming) {
      const now = new Date();
      results = results.filter((event) => new Date(event.date) > now);
    }

    setFilteredEvents(results);
  };

  const purchaseTickets = async (eventId, paymentData) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const response = await initiatePayment(eventId, paymentData, token);
      return response;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // EventContext.js (updated confirmPayment)
  const confirmPayment = async (paymentData) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const payment = await verifyPayment(paymentData, token);
      return payment;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserTickets = async () => {
    setIsLoading(true);
    const token = localStorage.getItem("token"); // Or however you store the token
    try {
      const data = await fetchUserTickets(token);
      setTickets(data);
      console.log("tickets", data);

      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const transferUserTicket = async (ticketId, recipientMobileNumber) => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const data = await transferTicket(ticketId, recipientMobileNumber, token);
      setTickets(
        tickets.map((ticket) => (ticket._id === ticketId ? data : ticket))
      );
      return data;
    } catch (err) {
      setError(err.message);
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
