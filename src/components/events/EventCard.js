import { Link } from "react-router-dom";

const EventCard = ({ event }) => {
  const eventDate = new Date(event.date);
  const now = new Date();
  const isUpcoming = eventDate > now;

  console.log(event);

  const serverUrl = "http://localhost:4000";

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <Link to={`/events/${event._id}`}>
        <div className="h-48 overflow-hidden">
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

          <p className="text-gray-600 text-sm mb-3">
            {eventDate.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
            {" • "}
            {event.location.city}, {event.location.country}
          </p>

          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">
              From ${event.standardTicket.price}
            </span>
            <span className="text-xs text-gray-500">
              {event.standardTicket.quantity - event.standardTicket.sold} left
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export default EventCard;
