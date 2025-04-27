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

  // Separate loading states for each data type
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isLoadingEvents, setIsLoadingEvents] = useState(false);
  const [isLoadingPayments, setIsLoadingPayments] = useState(false);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  const fetchDashboardStats = async () => {
    setIsLoadingStats(true);
    try {
      const data = await getDashboardStats(token);
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingStats(false);
    }
  };

  const fetchAdminEvents = async () => {
    setIsLoadingEvents(true);
    try {
      const data = await fetchEvents(token);
      setAdminEvents(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  const fetchPayments = async () => {
    setIsLoadingPayments(true);
    try {
      const data = await fetchAllPayments(token);
      setPayments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingPayments(false);
    }
  };

  const fetchEventAnalytics = async (eventId) => {
    setIsLoadingAnalytics(true);
    try {
      const data = await getEventAnalytics(eventId, token);
      setAnalytics(data);
      return data;
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  const removeEvent = async (eventId) => {
    setIsLoadingEvents(true);
    try {
      await deleteEvent(eventId, token);
      setAdminEvents((prev) => prev.filter((event) => event._id !== eventId));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoadingEvents(false);
    }
  };

  return (
    <AdminContext.Provider
      value={{
        stats,
        adminEvents,
        payments,
        analytics,
        error,
        isLoadingStats,
        isLoadingEvents,
        isLoadingPayments,
        isLoadingAnalytics,
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
