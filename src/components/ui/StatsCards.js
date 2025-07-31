import React from "react";
import {FiCheck, FiCreditCard, FiDollarSign, FiSend} from "react-icons/fi";

const StatsCards = ({ filteredPayments }) => {
  // Calculate total revenue safely
  const totalRevenue = filteredPayments.reduce((sum, p) => {
    const price = p.ticket.price ?? (p.amount / (p.ticketDetails?.length || 1));
    return sum + price;
  }, 0);

  // Data for each card
  const cards = [
    {
      label: "Total Tickets",
      value: filteredPayments.length,
      icon: <FiCreditCard />,
      color: "text-blue-600 bg-blue-100",
    },
    {
      label: "Scanned",
      value: filteredPayments.filter((p) => p.ticket.scanned).length,
      icon: <FiCheck />,
      color: "text-green-600 bg-green-100",
    },
    {
      label: "Transferred",
      value: filteredPayments.filter((p) => p.ticket.isTransferred).length,
      icon: <FiSend />,
      color: "text-purple-600 bg-purple-100",
    },
    {
      label: "Total Revenue",
      value: `GMD ${totalRevenue.toFixed(2)}`,
      icon: <FiDollarSign />,
      color: "text-yellow-600 bg-yellow-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className="bg-white flex items-center p-4 rounded-lg shadow-sm border hover:shadow-md transition"
        >
          <div className={`p-3 rounded-full mr-4 ${card.color}`}>
            <div className="text-xl">{card.icon}</div>
          </div>
          <div>
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-xl font-semibold">{card.value}</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
