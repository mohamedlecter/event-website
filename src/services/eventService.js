import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://3.107.6.176:4000/api";
// const API_URL = process.env.REACT_APP_API_URL || "http://3.107.6.176:4000/api";

const setAuthHeader = (token) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common["Authorization"];
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

export const initiatePayment = async (eventId, paymentData, token) => {
  setAuthHeader(token);
  try {
    const response = await axios.post(
      `${API_URL}/events/${eventId}/pay`,
      paymentData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Payment initiation error:", error);
    throw error;
  }
};
export const verifyPayment = async (reference, gateway, token) => {
  setAuthHeader(token);
  const response = await axios.post(`${API_URL}/events/verify-payment`, {
    reference,
    gateway,
  });
  return response.data;
};

export const fetchUserTickets = async (token) => {
  setAuthHeader(token);
  const response = await axios.get(`${API_URL}/events/user/tickets`);
  return response.data;
};

export const transferTicket = async (
  ticketId,
  recipientMobileNumber,
  token
) => {
  setAuthHeader(token);
  const response = await axios.put(
    `${API_URL}/events/tickets/${ticketId}/transfer`,
    { recipientMobileNumber }
  );
  return response.data;
};

export const createEvent = async (eventData) => {
  const token = localStorage.getItem("token"); // Or your auth method
  const formData = new FormData();

  // Since image upload is involved, we use FormData
  for (const key in eventData) {
    formData.append(key, eventData[key]);
  }

  const response = await axios.post(
    "http://3.107.6.176:4000/api/events/",
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};
