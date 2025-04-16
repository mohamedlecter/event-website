import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:4000/api';

const setAuthHeader = (token) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        delete axios.defaults.headers.common['Authorization'];
    }
    }

export const initiatePayment = async (paymentData, eventId, token) => {
    setAuthHeader(token);
    const response = await axios.post(`${API_URL}/${eventId}/pay`, paymentData);
    return response.data;
}

export const verifyPayment = async (reference, token) => {
    setAuthHeader(token);
    const response = await axios.post(`${API_URL}/payments/verify`, { reference });
    return response.data;
}
