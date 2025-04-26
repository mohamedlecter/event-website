import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminEvents from "../components/admin/AdminEvents";
import AdminPayments from "../components/admin/AdminPayments";
import AdminTicketScanner from "../components/admin/AdminTicketScanner";
import EventAnalytics from "../components/admin/EventAnalytics";
import CreateEventPage from "../components/admin/CreateEventPage";

const Admin = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-6">
        <h2 className="text-xl font-bold mb-8">Admin Panel</h2>
        <nav className="space-y-4">
          <NavLink
            to="/admin"
            end
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Dashboard
          </NavLink>
          <NavLink
            to="/admin/events"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Manage Events
          </NavLink>
          <NavLink
            to="/admin/payments"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Payments
          </NavLink>
          <NavLink
            to="/admin/scanner"
            className={({ isActive }) =>
              `block px-4 py-2 rounded-md ${
                isActive
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "text-gray-700 hover:bg-gray-200"
              }`
            }
          >
            Ticket Scanner
          </NavLink>
        </nav>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6">
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
