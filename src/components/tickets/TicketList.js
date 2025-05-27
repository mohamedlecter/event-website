import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import TicketCard from "./TicketCard";

const TicketList = ({ tickets }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("date");

  const filteredTickets = tickets.filter((ticket) => {
    if (activeTab === "upcoming") {
      return new Date(ticket.event.date) > new Date();
    } else if (activeTab === "past") {
      return new Date(ticket.event.date) <= new Date();
    }
    return true;
  });

  const sortedTickets = [...filteredTickets].sort((a, b) => {
    switch (sortBy) {
      case "date":
        return new Date(a.event.date) - new Date(b.event.date);
      case "price":
        return b.price - a.price;
      case "type":
        return a.ticketType.localeCompare(b.ticketType);
      default:
        return 0;
    }
  });

  const getTabCount = (tab) => {
    return tickets.filter((ticket) => {
      if (tab === "upcoming") {
        return new Date(ticket.event.date) > new Date();
      } else if (tab === "past") {
        return new Date(ticket.event.date) <= new Date();
      }
      return true;
    }).length;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="flex border-b">
          <button
            className={`px-4 py-2 relative ${
              activeTab === "all"
                ? "text-[#FBA415]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All Tickets
            <span className="ml-2 text-sm text-gray-500">({getTabCount("all")})</span>
            {activeTab === "all" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FBA415]"
              />
            )}
          </button>
          <button
            className={`px-4 py-2 relative ${
              activeTab === "upcoming"
                ? "text-[#FBA415]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("upcoming")}
          >
            Upcoming
            <span className="ml-2 text-sm text-gray-500">({getTabCount("upcoming")})</span>
            {activeTab === "upcoming" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FBA415]"
              />
            )}
          </button>
          <button
            className={`px-4 py-2 relative ${
              activeTab === "past"
                ? "text-[#FBA415]"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("past")}
          >
            Past Events
            <span className="ml-2 text-sm text-gray-500">({getTabCount("past")})</span>
            {activeTab === "past" && (
              <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FBA415]"
              />
            )}
          </button>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="sortBy" className="text-sm text-gray-600">Sort by:</label>
          <select
            id="sortBy"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-sm border rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415]"
          >
            <option value="date">Date</option>
            <option value="price">Price</option>
            <option value="type">Ticket Type</option>
          </select>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {sortedTickets.length > 0 ? (
          <motion.div
            key="tickets"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-4"
          >
            {sortedTickets.map((ticket, index) => (
              <motion.div
                key={ticket._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <TicketCard ticket={ticket} />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-white rounded-lg shadow-sm"
          >
            <p className="text-gray-500 text-lg">
              {activeTab === "all"
                ? "You don't have any tickets yet."
                : `No ${activeTab} events found.`}
            </p>
            {activeTab === "all" && (
              <p className="text-gray-400 mt-2">
                Browse our events to find something you'd like to attend!
              </p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TicketList;
