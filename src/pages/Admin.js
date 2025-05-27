import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminEvents from "../components/admin/AdminEvents";
import AdminPayments from "../components/admin/AdminPayments";
import AdminTicketScanner from "../components/admin/AdminTicketScanner";
import EventAnalytics from "../components/admin/EventAnalytics";
import CreateEventPage from "../components/admin/CreateEventPage";

const Admin = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <main className="p-4 md:p-6 lg:p-8">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/events" element={<AdminEvents />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/scanner" element={<AdminTicketScanner />} />
          <Route path="/events/:eventId" element={<EventAnalytics />} />
          <Route path="/events/new" element={<CreateEventPage />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  );
};

export default Admin;
