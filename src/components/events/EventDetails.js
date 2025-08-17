import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";
import { getServerUrl } from "../../config/env";
import PaymentForm from "./PaymentForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";

const EventDetails = () => {
    const [showPaymentForm, setShowPaymentForm] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);
    const [isImageLoading, setIsImageLoading] = useState(true);
    const { isAuthenticated } = useAuth();
    const { selectedEvent, getEventDetails, isLoading, error } = useEvents();
    const { id } = useParams();
    const navigate = useNavigate();
    const serverUrl = getServerUrl();

    useEffect(() => {
        if (id) {
            getEventDetails(id);
        }
    }, [id, getEventDetails]);

    const event = selectedEvent;

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

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h2>
                    <p className="text-gray-600">The event you're looking for doesn't exist or has been removed.</p>
                </div>
            </div>
        );
    }

    const handlePurchaseClick = (ticket) => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/events/${event._id}` } });
            return;
        }
        setSelectedTicket(ticket);
        setShowPaymentForm(true);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getTicketStatus = (ticket) => {
        if (!ticket) return { text: "Loading...", color: "gray" };

        const available = ticket.quantity - ticket.sold;

        if (available <= 0) {
            return { text: "Sold Out", color: "red" };
        }

        if (available < 5) {
            return { text: "Almost Sold Out", color: "orange" };
        }

        return { text: "Available", color: "green" };
    };

    return (
        <div className="min-h-screen" style={{ background: '#C6D6D8C2' }}>
            <div className="container mx-auto px-4 md:px-8 lg:px-12 py-8">
                <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
                    <div className="md:flex">
                        <div className="md:w-2/5 relative">
                            <div className="relative h-48 md:h-full">
                                {isImageLoading && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse" />
                                )}
                                <img
                                    src={
                                        event.image
                                            ? `${serverUrl}/${event.image.replace(/\\/g, "/")}`
                                            : "/placeholder-event.jpg"
                                    }
                                    alt={event.title}
                                    className="w-full h-full object-cover"
                                    onLoad={() => setIsImageLoading(false)}
                                />
                                <div className="absolute top-3 left-3">
                                    <span className="px-2.5 py-0.5 bg-[#FBA415] text-gray-900 text-xs font-medium rounded-full">
                                        {event.category}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="p-5 md:p-6 md:w-3/5">
                            <h1 className="text-xl md:text-2xl font-bold mb-3 text-gray-900">{event.title}</h1>

                            <div className="space-y-3 mb-5">
                                <div className="flex items-start gap-2.5">
                                    <div className="flex-shrink-0 w-5 h-5 text-[#FBA415]">📅</div>
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">Date & Time</p>
                                        <p className="text-sm text-gray-600">{formatDate(event.date)}</p>
                                    </div>
                                </div>

                                <div className="flex items-start gap-2.5">
                                    <div className="flex-shrink-0 w-5 h-5 text-[#FBA415]">📍</div>
                                    <div>
                                        <p className="text-sm text-gray-900 font-medium">Location</p>
                                        <p className="text-sm text-gray-600">
                                            {event.location.city}, {event.location.country}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-5">
                                <h2 className="text-base font-semibold mb-2 text-gray-900">About This Event</h2>
                                <p className="text-sm text-gray-700 leading-relaxed">{event.description}</p>
                            </div>

                            <div className="mb-5">
                                <h2 className="text-base font-semibold mb-3 text-gray-900">Ticket Options</h2>
                                <div className="space-y-3">
                                    {event.ticketTypes.map(ticket => {
                                        const ticketStatus = getTicketStatus(ticket);
                                        const ticketsAvailable = ticket.quantity - ticket.sold;

                                        return (
                                            <div
                                                key={ticket._id}
                                                className="border rounded-lg p-3 hover:border-[#FBA415] transition-colors duration-200"
                                            >
                                                <div className="flex justify-between items-center mb-2">
                                                    <div>
                                                        <h3 className="font-semibold text-base text-gray-900">{ticket.name}</h3>
                                                        <p className="text-xs text-gray-600">
                                                            {ticket.description}
                                                        </p>
                                                    </div>
                                                    <span className="text-m font-bold text-gray-900">
                                                        {ticket.currency} {ticket.price}
                                                    </span>
                                                </div>
                                                <div className="flex items-center justify-between mb-3">
                                                    <p className="text-xs text-gray-600">
                                                        {ticketsAvailable} remaining
                                                    </p>
                                                    <span className={`px-2 py-0.5 text-xs rounded-full ${
                                                        ticketStatus.color === "red"
                                                            ? "bg-red-100 text-red-800"
                                                            : ticketStatus.color === "orange"
                                                            ? "bg-orange-100 text-orange-800"
                                                            : "bg-green-100 text-green-800"
                                                    }`}>
                                                        {ticketStatus.text}
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() => handlePurchaseClick(ticket)}
                                                    disabled={ticketsAvailable <= 0}
                                                    className={`w-full py-2 rounded-md font-medium transition-colors duration-200 ${
                                                        ticketsAvailable <= 0
                                                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                            : "bg-[#FBA415] hover:bg-[#FBA415]/90 text-gray-900"
                                                    }`}
                                                >
                                                    {ticketsAvailable <= 0 ? "Sold Out" : `Purchase ${ticket.name}`}
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showPaymentForm && (
                <PaymentForm
                    event={event}
                    ticket={selectedTicket}
                    onClose={() => setShowPaymentForm(false)}
                />
            )}
        </div>
    );
};

export default EventDetails;
