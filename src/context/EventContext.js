import { createContext, useContext, useState, useCallback } from "react";
import {
    fetchEventDetails,
    fetchEvents,
    fetchUserTickets,
    initiatePayment,
    transferTicket,
    verifyPayment,
} from "../services/eventService";

const EventContext = createContext();

export const EventProvider = ({ children }) => {
    const [events, setEvents] = useState([]);
    const [filteredEvents, setFilteredEvents] = useState([]);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [tickets, setTickets] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    const getEvents = useCallback(async (filters = {}) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchEvents(filters);
            setFilteredEvents(data);
            setEvents(data);
            return data;
        } catch (err) {
            setError(err.message || "Failed to fetch events. Please try again later.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const getEventDetails = useCallback(async (id) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchEventDetails(id);
            // Correctly set selectedEvent to the event object from the response
            setSelectedEvent(data.event);
            return data.event;
        } catch (err) {
            setError(err.message || "Failed to fetch event details. Please try again later.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const filterEvents = useCallback((filters) => {
        let results = [...events];

        if (filters.category) {
            results = results.filter((event) => event.category === filters.category);
        }

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

        if (filters.upcoming) {
            const now = new Date();
            results = results.filter((event) => new Date(event.date) > now);
        }

        if (filters.priceRange && filters.priceRange !== 'all') {
            results = results.filter((event) => {
                const minPrice = event.ticketTypes?.length > 0
                    ? Math.min(...event.ticketTypes.map(ticket => ticket.price))
                    : 0;

                switch (filters.priceRange) {
                    case 'free':
                        return minPrice === 0;
                    case 'under50':
                        return minPrice > 0 && minPrice < 50;
                    case 'under100':
                        return minPrice >= 50 && minPrice < 100;
                    case 'over100':
                        return minPrice >= 100;
                    default:
                        return true;
                }
            });
        }

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
    }, [events]);

    const purchaseTickets = useCallback(async (eventId, paymentData) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await initiatePayment(eventId, paymentData);
            return response;
        } catch (err) {
            setError(err.message || "Failed to process payment. Please try again later.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const confirmPayment = useCallback(async (sessionId, gateway) => {
        setIsLoading(true);
        setError(null);
        try {
            const reference = gateway === 'wave' ? localStorage.getItem('wavePaymentReference') : sessionId;
            if (!reference) {
                throw new Error("Payment reference not found");
            }

            const payment = await verifyPayment(reference, gateway);

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
    }, []);

    const getUserTickets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await fetchUserTickets();
            setTickets(data);
            return data;
        } catch (err) {
            setError(err.message || "Failed to fetch tickets. Please try again later.");
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    const transferUserTicket = useCallback(async (ticketId, recipientMobileNumber) => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await transferTicket(ticketId, recipientMobileNumber);
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
    }, [tickets]);

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
