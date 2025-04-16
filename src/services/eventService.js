import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export const fetchEvents = async (filters = {}) => {
  const response = await axios.get(`${API_URL}/events`, { params: filters });
  return response.data;
};

export const fetchEventDetails = async (id) => {
  const response = await axios.get(`${API_URL}/events/${id}`);
  return response.data;
};

export const initiatePayment = async (eventId, ticketData, token) => {
  setAuthHeader(token);
  const response = await axios.post(`${API_URL}/events/${eventId}/pay`, ticketData);
  return response.data;
};

export const verifyPayment = async (reference, token) => {
  setAuthHeader(token);
  const response = await axios.post(`${API_URL}/events/verify-payment`, { reference });
  return response.data;
};

export const fetchUserTickets = async (token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/events/user/tickets`);
  return response.data;
};

export const transferTicket = async (ticketId, recipientEmail, token) => {
  setAuthHeader(token);
  const response = await axios.put(`${API_URL}/events/tickets/${ticketId}/transfer`, { recipientEmail });
  return response.data;
};