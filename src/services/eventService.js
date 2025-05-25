import apiClient from './apiClient';

export const fetchEvents = async (filters = {}) => {
  try {
    const response = await apiClient.get('/events', { params: filters });
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventDetails = async (id) => {
  try {
    const response = await apiClient.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event details for ID ${id}:`, error);
    throw error;
  }
};

export const initiatePayment = async (eventId, paymentData) => {
  try {
    // Ensure eventId is a string
    const eventIdStr = eventId.toString();
    
    // The payment data is already formatted correctly in the PaymentForm component
    const response = await apiClient.post(`/events/${eventIdStr}/pay`, paymentData);
    return response.data;
  } catch (error) {
    console.error('Payment initiation error:', error);
    throw error;
  }
}; 

export const verifyPayment = async (reference, gateway) => {
  try {
    const response = await apiClient.post('/events/verify-payment', {
      reference,
      gateway,
    });
    return response.data;
  } catch (error) {
    console.error('Payment verification error:', error);
    throw error;
  }
};

export const fetchUserTickets = async () => {
  try {
    const response = await apiClient.get('/events/user/tickets');
    return response.data;
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    throw error;
  }
};

export const transferTicket = async (ticketId, transferData) => {
  try {
    const response = await apiClient.put(
      `/events/tickets/${ticketId}/transfer`,
      transferData
    );
    return response.data;
  } catch (error) {
    console.error('Ticket transfer error:', error);
    throw error;
  }
};

export const createEvent = async (eventData) => {
  try {
    const formData = new FormData();
    for (const key in eventData) {
      formData.append(key, eventData[key]);
    }

    const response = await apiClient.post('/events/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const sendTransferNotification = async (transferData) => {
  try {
    const response = await apiClient.post('/events/tickets/notify-transfer', transferData);
    return response.data;
  } catch (error) {
    console.error('Error sending transfer notification:', error);
    throw error;
  }
};

export const getTransferHistory = async (ticketId) => {
  try {
    const response = await apiClient.get(`/events/tickets/${ticketId}/transfer-history`);
    return response.data;
  } catch (error) {
    console.error('Error fetching transfer history:', error);
    throw error;
  }
};

export const cancelTransfer = async (ticketId) => {
  try {
    const response = await apiClient.post(`/events/tickets/${ticketId}/cancel-transfer`);
    return response.data;
  } catch (error) {
    console.error('Error canceling transfer:', error);
    throw error;
  }
};
