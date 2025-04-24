import { createContext, useContext, useState } from "react";
import {
  getDashboardStats,
  fetchEvents,
  fetchAllPayments,
  getEventAnalytics,
  deleteEvent,
} from "../services/adminService";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const [stats, setStats] = useState(null);
  const [adminEvents, setAdminEvents] = useState([]);
  const [payments, setPayments] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDashboardStats = async () => {
    setIsLoading(true);
    try {
      const data = await getDashboardStats(token);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAdminEvents = async () => {
    setIsLoading(true);
    try {
      const data = await fetchEvents(token);
      setAdminEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoading(true);
    try {
      const data = await fetchAllPayments(token);
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchEventAnalytics = async (eventId) => {
    setIsLoading(true);
    try {
      const data = await getEventAnalytics(eventId, token);
      setAnalytics(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const removeEvent = async (eventId) => {
    setIsLoading(true);
    try {
      await deleteEvent(eventId, token);
      setAdminEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        adminEvents,
        payments,
        analytics,
        isLoading,
        error,
        fetchDashboardStats,
        fetchAdminEvents,
        fetchPayments,
        fetchEventAnalytics,
        removeEvent,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
