import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { getServerUrl } from "../../config/env";

const EventCard = ({ event, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const eventDate = new Date(event.date);
  const now = new Date();
  const isUpcoming = eventDate > now;
  const serverUrl = getServerUrl();

  const formatDate = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTicketStatus = () => {
    const standardTicketsLeft = event.standardTicket.quantity - event.standardTicket.sold;
    const vipTicketsLeft = event.vipTicket.quantity - event.vipTicket.sold;
    
    if (standardTicketsLeft === 0 && vipTicketsLeft === 0) {
      return { text: "Sold Out", color: "red" };
    }
    if (standardTicketsLeft < 5 || vipTicketsLeft < 5) {
      return { text: "Almost Sold Out", color: "orange" };
    }
    return { text: "Tickets Available", color: "green" };
  };

  const ticketStatus = getTicketStatus();
  const isList = viewMode === 'list';

  return (
    <motion.div
      whileHover={{ y: -5 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={`bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 ${
        isList ? 'max-w-4xl mx-auto' : ''
      }`}
      role="article"
      aria-label={`Event: ${event.title}`}
    >
      <Link 
        to={`/events/${event._id}`} 
        className={`block ${isList ? 'flex' : ''}`}
        aria-label={`View details for ${event.title}`}
      >
        <div className={`relative overflow-hidden group ${
          isList ? 'w-48 flex-shrink-0' : 'h-48'
        }`}>
          <motion.img
            src={
              event.image
                ? `${serverUrl}/${event.image.replace(/\\/g, "/")}`
                : "/placeholder-event.jpg"
            }
            alt={`${event.title} event image`}
            className={`object-cover ${
              isList ? 'w-48 h-48' : 'w-full h-full'
            }`}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          />
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"
          />
          <div className="absolute top-3 left-3">
            <span className="px-2 py-1 bg-black/50 text-white text-xs rounded-full backdrop-blur-sm">
              {event.category}
            </span>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-medium">{event.description.substring(0, 100)}...</p>
          </div>
        </div>

        <div className={`p-4 ${isList ? 'flex-1 flex flex-col' : ''}`}>
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg truncate">{event.title}</h3>
            <motion.span
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className={`px-2 py-1 text-xs rounded-full ${
                isUpcoming
                  ? "bg-green-100 text-green-800"
                  : "bg-gray-100 text-gray-800"
              }`}
            >
              {isUpcoming ? "Upcoming" : "Past Event"}
            </motion.span>
          </div>

          <div className={`space-y-2 ${isList ? 'flex-1' : ''}`}>
            <div className="flex items-center text-gray-600 text-sm">
              <span className="mr-2 font-medium">Date:</span>
              {formatDate(eventDate)} at {formatTime(eventDate)}
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <span className="mr-2 font-medium">Location:</span>
              {event.location.city}, {event.location.country}
            </div>

            {isList && (
              <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                {event.description}
              </p>
            )}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  From ${event.standardTicket.price}
                </span>
                <span className="text-xs text-gray-500 ml-2">
                  / Standard
                </span>
              </div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className={`flex items-center px-2 py-1 rounded-full text-xs ${
                  ticketStatus.color === "red"
                    ? "bg-red-100 text-red-800"
                    : ticketStatus.color === "orange"
                    ? "bg-orange-100 text-orange-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                <div className={`w-2 h-2 rounded-full mr-2 ${
                  ticketStatus.color === "red"
                    ? "bg-red-500"
                    : ticketStatus.color === "orange"
                    ? "bg-orange-500"
                    : "bg-green-500"
                }`} />
                {ticketStatus.text}
              </motion.div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
