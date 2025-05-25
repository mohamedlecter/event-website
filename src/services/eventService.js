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
    
    // Add basic event data
    formData.append('title', eventData.title);
    formData.append('description', eventData.description);
    formData.append('country', eventData.country);
    formData.append('city', eventData.city);
    formData.append('standardPrice', eventData.standardPrice);
    formData.append('standardQuantity', eventData.standardQuantity);
    formData.append('vipPrice', eventData.vipPrice);
    formData.append('vipQuantity', eventData.vipQuantity);
    formData.append('date', eventData.date);
    formData.append('category', eventData.category.toLowerCase());

    // Add image if it exists
    if (eventData.image instanceof File) {
      formData.append('image', eventData.image);
    }

    const response = await apiClient.post('/events', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Failed to create event. Please try again.');
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
