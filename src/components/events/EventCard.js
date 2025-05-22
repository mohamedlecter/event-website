import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const now = new Date();
  const isUpcoming = eventDate > now;
  const serverUrl = "http://3.107.6.176:4000";

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

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300"
    >
      <Link to={`/events/${event._id}`}>
        <div className="relative h-48 overflow-hidden group">
          <img
            src={
              event.image
                ? `${serverUrl}/${event.image.replace(/\\/g, "/")}`
                : "/placeholder-event.jpg"
            }
            alt={event.title}
            className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <p className="text-sm font-medium">{event.category}</p>
          </div>
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-lg truncate">{event.title}</h3>
            {isUpcoming ? (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                Upcoming
              </span>
            ) : (
              <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full">
                Past Event
              </span>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDate(eventDate)} at {formatTime(eventDate)}
            </div>
            
            <div className="flex items-center text-gray-600 text-sm">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {event.location.city}, {event.location.country}
            </div>
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
              <div className="flex items-center">
                <div className="w-2 h-2 rounded-full bg-green-500 mr-2" />
                <span className="text-xs text-gray-500">
                  {event.standardTicket.quantity - event.standardTicket.sold} left
                </span>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default EventCard;
