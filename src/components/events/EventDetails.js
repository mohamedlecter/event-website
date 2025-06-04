import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";
import { getServerUrl } from "../../config/env";
import PaymentForm from "./PaymentForm";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";

const EventDetails = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [ticketType, setTicketType] = useState("standard");
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
  }, [id]);

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

  const handlePurchaseClick = (type) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${event._id}` } });
      return;
    }
    setTicketType(type);
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
    const remaining = ticket.quantity - ticket.sold;
    if (remaining === 0) return { text: "Sold Out", color: "red" };
    if (remaining < 5) return { text: "Almost Sold Out", color: "orange" };
    return { text: "Available", color: "green" };
  };

  const standardStatus = getTicketStatus(event.standardTicket);
  const vipStatus = getTicketStatus(event.vipTicket);

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
                  <div className="border rounded-lg p-3 hover:border-[#FBA415] transition-colors duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold text-base text-gray-900">Standard Ticket</h3>
                        <p className="text-xs text-gray-600">
                          Regular admission to the event
                        </p>
                      </div>
                      <span className="text-m font-bold text-gray-900">
                        GMD  {event.standardTicket.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-600">
                        {event.standardTicket.quantity - event.standardTicket.sold} remaining
                      </p>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        standardStatus.color === "red"
                          ? "bg-red-100 text-red-800"
                          : standardStatus.color === "orange"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {standardStatus.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchaseClick("standard")}
                      disabled={event.standardTicket.sold >= event.standardTicket.quantity}
                      className={`w-full py-2 rounded-md font-medium transition-colors duration-200 ${
                        event.standardTicket.sold >= event.standardTicket.quantity
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#FBA415] hover:bg-[#FBA415]/90 text-gray-900"
                      }`}
                    >
                      {event.standardTicket.sold >= event.standardTicket.quantity
                        ? "Sold Out"
                        : "Purchase Standard Ticket"}
                    </button>
                  </div>

                  <div className="border rounded-lg p-3 hover:border-[#FBA415] transition-colors duration-200">
                    <div className="flex justify-between items-center mb-2">
                      <div>
                        <h3 className="font-semibold text-base text-gray-900">VIP Ticket</h3>
                        <p className="text-xs text-gray-600">
                          Premium experience with exclusive benefits
                        </p>
                      </div>
                      <span className="text-m font-bold text-gray-900">
                        GMD  {event.vipTicket.price}
                      </span>
                    </div>
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-xs text-gray-600">
                        {event.vipTicket.quantity - event.vipTicket.sold} remaining
                      </p>
                      <span className={`px-2 py-0.5 text-xs rounded-full ${
                        vipStatus.color === "red"
                          ? "bg-red-100 text-red-800"
                          : vipStatus.color === "orange"
                          ? "bg-orange-100 text-orange-800"
                          : "bg-green-100 text-green-800"
                      }`}>
                        {vipStatus.text}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePurchaseClick("vip")}
                      disabled={event.vipTicket.sold >= event.vipTicket.quantity}
                      className={`w-full py-2 rounded-md font-medium transition-colors duration-200 ${
                        event.vipTicket.sold >= event.vipTicket.quantity
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-[#FBA415] hover:bg-[#FBA415]/90 text-gray-900"
                      }`}
                    >
                      {event.vipTicket.sold >= event.vipTicket.quantity
                        ? "Sold Out"
                        : "Purchase VIP Ticket"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPaymentForm && (
        <PaymentForm
          event={event}
          ticketType={ticketType}
          onClose={() => setShowPaymentForm(false)}
        />
      )}
    </div>
  );
};

export default EventDetails;
