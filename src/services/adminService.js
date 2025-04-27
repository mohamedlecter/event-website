import axios from 'axios';
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

export const getDashboardStats = async (token) => {
  const response = await axios.get(`${API_URL}/admin/dashboard`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchEvents = async (token) => {
  const response = await axios.get(`${API_URL}/events`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAllPayments = async (token) => {
  const response = await axios.get(`${API_URL}/admin/payments`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const getEventAnalytics = async (eventId, token) => {
  const response = await axios.get(
    `${API_URL}/admin/events/${eventId}/analytics`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteEvent = async (eventId, token) => {
  console.log('Deleting event with ID:', eventId); // Debugging line
  console.log('Using token:', token); // Debugging line
  await axios.delete(`${API_URL}/events/${eventId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
