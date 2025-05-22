import apiClient from './apiClient';
export const getDashboardStats = async () => {
  try {
    const response = await apiClient.get('/admin/dashboard');
    return response.data;
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    throw error;
  }
};

export const fetchEvents = async () => {
  try {
    const response = await apiClient.get('/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchAllPayments = async () => {
  try {
    const response = await apiClient.get('/admin/payments');
    return response.data;
  } catch (error) {
    console.error('Error fetching payments:', error);
    throw error;
  }
};

export const getEventAnalytics = async (eventId) => {
  try {
    const response = await apiClient.get(`/admin/events/${eventId}/analytics`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching analytics for event ${eventId}:`, error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    await apiClient.delete(`/events/${eventId}`);
  } catch (error) {
    console.error(`Error deleting event ${eventId}:`, error);
    throw error;
  }
};

export const getAdminEvents = async () => {
  try {
    const response = await apiClient.get('/admin/events');
    return response.data;
  } catch (error) {
    console.error('Error fetching admin events:', error);
    throw error;
  }
};
