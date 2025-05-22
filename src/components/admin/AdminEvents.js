import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useAdmin } from "../../context/AdminContext";
import { getServerUrl } from "../../config/env";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";

const AdminEvents = () => {
  const {
    adminEvents: events,
    fetchAdminEvents,
    removeEvent,
    isLoadingEvents,
    error,
  } = useAdmin();
  const serverUrl = getServerUrl();

  useEffect(() => {
    fetchAdminEvents();
  }, []);

  const handleDelete = async (eventId) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    await removeEvent(eventId);
  };

  console.log("Events error:", error);

  if (isLoadingEvents) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;

  return (
    <div className="p-4">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Events</h2>
        <Link
          to="/admin/events/new"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 whitespace-nowrap"
        >
          Create New Event
        </Link>
      </div>

      {/* Desktop & Tablet Table */}
      <div className="hidden sm:block bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Event
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tickets Sold
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {events.map((event) => (
              <tr key={event._id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      <img
                        className="h-10 w-10 rounded-full object-cover"
                        src={
                          event.image
                            ? `${serverUrl}/${event.image.replace(/\\/g, "/")}`
                            : "/placeholder-event.jpg"
                        }
                        alt={event.title}
                      />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.location.city}, {event.location.country}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {new Date(event.date).toLocaleDateString()}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">Standard:</span>{" "}
                    {event.standardTicket.sold}/{event.standardTicket.quantity}
                  </div>
                  <div className="text-sm text-gray-900">
                    <span className="font-medium">VIP:</span>{" "}
                    {event.vipTicket.sold}/{event.vipTicket.quantity}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {event.soldOut ? (
                    <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                      Sold Out
                    </span>
                  ) : (
                    <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                      Available
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-4">
                  <Link
                    to={`/admin/events/${event._id}`}
                    className="text-blue-600 hover:text-blue-900"
                  >
                    View
                  </Link>
                  <Link
                    to={`/admin/events/${event._id}`}
                    className="text-indigo-600 hover:text-indigo-900"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event._id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="sm:hidden space-y-4">
        {events.map((event) => (
          <div
            key={event._id}
            className="bg-white rounded-lg shadow p-4 flex flex-col"
          >
            <div className="flex items-center space-x-4">
              <img
                className="h-12 w-12 rounded-full object-cover flex-shrink-0"
                src={
                  event.image
                    ? `${serverUrl}/${event.image.replace(/\\/g, "/")}`
                    : "/placeholder-event.jpg"
                }
                alt={event.title}
              />
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {event.title}
                </h3>
                <p className="text-sm text-gray-500">
                  {event.location.city}, {event.location.country}
                </p>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-4 text-sm text-gray-700">
              <div>
                <span className="font-medium">Date: </span>
                {new Date(event.date).toLocaleDateString()}
              </div>
              <div>
                <span className="font-medium">Status: </span>
                {event.soldOut ? (
                  <span className="px-2 py-1 rounded-full bg-red-100 text-red-800">
                    Sold Out
                  </span>
                ) : (
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-800">
                    Available
                  </span>
                )}
              </div>
              <div>
                <span className="font-medium">Tickets: </span>
                {event.standardTicket.sold}/{event.standardTicket.quantity}
              </div>
              <div>
                <span className="font-medium">VIP Tickets: </span>
                {event.vipTicket.sold}/{event.vipTicket.quantity}
              </div>
            </div>

            <div className="mt-4 flex space-x-4 justify-end text-sm font-medium">
              <Link
                to={`/admin/events/${event._id}`}
                className="text-blue-600 hover:text-blue-900"
              >
                View
              </Link>
              <Link
                to={`/admin/events/${event._id}/edit`}
                className="text-indigo-600 hover:text-indigo-900"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(event._id)}
                className="text-red-600 hover:text-red-900"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminEvents;
