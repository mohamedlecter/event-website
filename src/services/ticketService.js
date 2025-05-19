import axios from 'axios';

// const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';
const API_URL = process.env.REACT_APP_API_URL || "http://localhost:4000";


const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const searchTickets = async (reference, token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/admin/tickets/${reference}`);
  return response.data;
};

export const scanTicket = async (ticketId, token) => {
  setAuthHeader(token);
  const response = await axios.put(`${API_URL}/admin/tickets/${ticketId}/scan`);
  return response.data;
};