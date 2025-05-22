import apiClient from './apiClient';

const setAuthHeader = (token) => {
  if (token) {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete apiClient.defaults.headers.common["Authorization"];
  }
};

export const searchTickets = async (reference) => {
  try {
    const response = await apiClient.get(`/admin/tickets/${reference}`);
    return response.data;
  } catch (error) {
    console.error('Error searching tickets:', error);
    throw error;
  }
};

export const scanTicket = async (ticketId) => {
  try {
    const response = await apiClient.put(`/admin/tickets/${ticketId}/scan`);
    return response.data;
  } catch (error) {
    console.error('Error scanning ticket:', error);
    throw error;
  }
};
