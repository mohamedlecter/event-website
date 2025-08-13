import { createContext, useContext, useState, useCallback } from "react";
import {
    deleteEvent,
    fetchAllPayments,
    getAdminEvents,
    getDashboardStats,
    getEventAnalytics,
} from "../services/adminService";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
    const [stats, setStats] = useState(null);
    const [adminEvents, setAdminEvents] = useState([]);
    const [payments, setPayments] = useState([]);
    const [analytics, setAnalytics] = useState(null);

    const [isLoadingStats, setIsLoadingStats] = useState(false);
    const [isLoadingEvents, setIsLoadingEvents] = useState(false);
    const [isLoadingPayments, setIsLoadingPayments] = useState(false);
    const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(false);

    const [error, setError] = useState(null);

    const token = localStorage.getItem("token");

    // Wrap the function in useCallback to memoize it
    const fetchDashboardStats = useCallback(async () => {
        setIsLoadingStats(true);
        try {
            const data = await getDashboardStats();
            setStats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingStats(false);
        }
    }, []); // Empty dependency array means the function is created only once

    const fetchAdminEvents = useCallback(async () => {
        setIsLoadingEvents(true);
        try {
            const data = await getAdminEvents(token);
            setAdminEvents(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [token]);

    const fetchPayments = useCallback(async () => {
        setIsLoadingPayments(true);
        try {
            const data = await fetchAllPayments(token);
            setPayments(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingPayments(false);
        }
    }, [token]);

    const fetchEventAnalytics = useCallback(async (eventId) => {
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
    }, [token]);

    const removeEvent = useCallback(async (eventId) => {
        setIsLoadingEvents(true);
        try {
            await deleteEvent(eventId, token);
            setAdminEvents((prev) => prev.filter((event) => event._id !== eventId));
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoadingEvents(false);
        }
    }, [token]);

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
