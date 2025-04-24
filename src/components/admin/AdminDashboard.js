import { useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";

const AdminDashboard = () => {
  const { stats, isLoading, error, fetchDashboardStats } = useAdmin();

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!stats) return null;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard Overview</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Events"
          value={stats.totalEvents}
          icon="🎪"
          color="bg-blue-100 text-blue-800"
        />
        <StatCard
          title="Total Tickets Sold"
          value={stats.totalTicketsSold}
          icon="🎟️"
          color="bg-green-100 text-green-800"
        />
        <StatCard
          title="Standard Tickets Sold"
          value={stats.standardTicketsSold}
          icon="🔹"
          color="bg-indigo-100 text-indigo-800"
        />
        <StatCard
          title="VIP Tickets Sold"
          value={stats.vipTicketsSold}
          icon="✨"
          color="bg-purple-100 text-purple-800"
        />
        <StatCard
          title="Total Revenue"
          value={`$${stats.totalRevenue.toLocaleString()}`}
          icon="💰"
          color="bg-yellow-100 text-yellow-800"
        />
        <StatCard
          title="Scanned Tickets"
          value={stats.totalScannedTickets}
          icon="✅"
          color="bg-teal-100 text-teal-800"
        />
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-sm border">
    <div className="flex items-center">
      <span className={`text-2xl mr-4 p-3 rounded-full ${color}`}>{icon}</span>
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-2xl font-bold">{value}</p>
      </div>
    </div>
  </div>
);

export default AdminDashboard;
