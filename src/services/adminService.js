import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const getDashboardStats = async (token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/admin/dashboard`);
  return response.data;
};

export const fetchEvents = async (token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/events`);
  return response.data;
};

export const fetchAllPayments = async (token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/admin/payments`);
  return response.data;
};

export const getEventAnalytics = async (eventId, token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/admin/events/${eventId}/analytics`);
  return response.data;
};

export const deleteEvent = async (eventId, token) => {
  setAuthHeader(token);
  await axios.delete(`${API_URL}/events/${eventId}`);
};