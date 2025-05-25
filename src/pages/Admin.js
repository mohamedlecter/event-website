import { useState } from "react";
import { Routes, Route, Navigate, NavLink } from "react-router-dom";
import AdminDashboard from "../components/admin/AdminDashboard";
import AdminEvents from "../components/admin/AdminEvents";
import AdminPayments from "../components/admin/AdminPayments";
import AdminTicketScanner from "../components/admin/AdminTicketScanner";
import EventAnalytics from "../components/admin/EventAnalytics";
import CreateEventPage from "../components/admin/CreateEventPage";

const Admin = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Mobile sidebar toggle button */}
      <button
        className="md:hidden fixed top-4 left-4 z-20 p-2 rounded-md bg-white shadow-md"
        onClick={() => setSidebarOpen(!sidebarOpen)}
        aria-label="Toggle sidebar"
      >
        {/* Hamburger icon */}
        <svg
          className="w-6 h-6 text-gray-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {sidebarOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            />
          )}
        </svg>
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-50 bg-white shadow-md p-6 transform
          transition-transform duration-300 ease-in-out
          md:static md:translate-x-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
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
            onClick={() => setSidebarOpen(false)}
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
            onClick={() => setSidebarOpen(false)}
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
            onClick={() => setSidebarOpen(false)}
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
            onClick={() => setSidebarOpen(false)}
          >
            Ticket Scanner
          </NavLink>
        </nav>
      </aside>

      {/* Overlay when sidebar open on mobile */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black opacity-30 z-5 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="flex-1 p-4">
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
