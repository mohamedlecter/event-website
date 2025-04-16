import { Routes, Route, Navigate } from 'react-router-dom';
import AdminDashboard from '../components/admin/AdminDashboard';
import AdminEvents from '../components/admin/AdminEvents';
import AdminPayments from '../components/admin/AdminPayments';
import AdminTicketScanner from '../components/admin/AdminTicketScanner';
import EventAnalytics from '../components/admin/EventAnalytics';

const Admin = () => {
  return (
    <div className="flex">
      {/* Sidebar would go here */}
      <div className="flex-1 p-6">
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/events" element={<AdminEvents />} />
          <Route path="/payments" element={<AdminPayments />} />
          <Route path="/scanner" element={<AdminTicketScanner />} />
          <Route path="/events/:eventId" element={<EventAnalytics />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </div>
    </div>
  );
};

export default Admin;