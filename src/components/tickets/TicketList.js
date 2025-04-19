import { useState } from "react";
import TicketCard from "./TicketCard";

const TicketList = ({ tickets }) => {
  console.log("tickets", tickets);

  const [activeTab, setActiveTab] = useState("all");

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "upcoming") {
      return new Date(ticket.event.date) > new Date();
    } else if (activeTab === "past") {
      return new Date(ticket.event.date) <= new Date();
    }
    return true;
  });

  return (
    <div>
      <div className="flex border-b mb-6">
        <button
          className={`px-4 py-2 ${
            activeTab === "all"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("all")}
        >
          All Tickets
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "upcoming"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("upcoming")}
        >
          Upcoming
        </button>
        <button
          className={`px-4 py-2 ${
            activeTab === "past"
              ? "border-b-2 border-blue-500 text-blue-600"
              : "text-gray-500"
          }`}
          onClick={() => setActiveTab("past")}
        >
          Past Events
        </button>
      </div>

      <div className="space-y-4">
        {filteredTickets.length > 0 ? (
          filteredTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              {activeTab === "all"
                ? "You don't have any tickets yet."
                : `No ${activeTab} events found.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TicketList;
