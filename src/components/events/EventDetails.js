import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEvents } from "../../context/EventContext";
import PaymentForm from "./PaymentForm";
import LoadingSpinner from "../ui/LoadingSpinner";

const EventDetails = () => {
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [ticketType, setTicketType] = useState("standard");
  const { isAuthenticated } = useAuth();
  const { selectedEvent, getEventDetails, isLoading } = useEvents();
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      getEventDetails(id);
    }
  }, [id]);

  const event = selectedEvent;
  // const serverUrl = "http://54.252.242.131:4000";
  const serverUrl = "http://54.252.242.131:4000";

  if (isLoading || !event) return <LoadingSpinner />;

  const handlePurchaseClick = (type) => {
    if (!isAuthenticated) {
      navigate("/login", { state: { from: `/events/${event._id}` } });
      return;
    }
    setTicketType(type);
    setShowPaymentForm(true);
  };
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="md:flex">
        <div className="md:w-1/2">
          <img
            src={
              event.image
                ? `${serverUrl}/${event.image.replace(/\\/g, "/")}`
                : "/placeholder-event.jpg"
            }
            alt={event.title}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="p-6 md:w-1/2">
          <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
          <p className="text-gray-600 mb-4">
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
          <p className="text-gray-700 mb-4">
            {event.location.city}, {event.location.country}
          </p>
          <p className="mb-6">{event.description}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Ticket Options</h3>

            <div className="space-y-4">
              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">Standard Ticket</h4>
                  <span className="font-bold">
                    ${event.standardTicket.price}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {event.standardTicket.quantity - event.standardTicket.sold}{" "}
                  remaining
                </p>
                <button
                  onClick={() => handlePurchaseClick("standard")}
                  disabled={
                    event.standardTicket.sold >= event.standardTicket.quantity
                  }
                  className={`w-full py-2 rounded-md ${
                    event.standardTicket.sold >= event.standardTicket.quantity
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {event.standardTicket.sold >= event.standardTicket.quantity
                    ? "Sold Out"
                    : "Purchase"}
                </button>
              </div>

              <div className="border rounded-lg p-4">
                <div className="flex justify-between items-center mb-2">
                  <h4 className="font-medium">VIP Ticket</h4>
                  <span className="font-bold">${event.vipTicket.price}</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  {event.vipTicket.quantity - event.vipTicket.sold} remaining
                </p>
                <button
                  onClick={() => handlePurchaseClick("vip")}
                  disabled={event.vipTicket.sold >= event.vipTicket.quantity}
                  className={`w-full py-2 rounded-md ${
                    event.vipTicket.sold >= event.vipTicket.quantity
                      ? "bg-gray-300 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {event.vipTicket.sold >= event.vipTicket.quantity
                    ? "Sold Out"
                    : "Purchase"}
                </button>
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
