import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { verifyPayment } from "../services/eventService";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verify = async () => {
      try {
        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get("session_id");
        const reference = searchParams.get("reference");
        const gateway = searchParams.get("gateway");

        if (!gateway) throw new Error("Missing payment gateway parameter");

        const response = await verifyPayment({
          [gateway === "stripe" ? "session_id" : "reference"]:
            gateway === "stripe" ? sessionId : reference,
          gateway,
        });

        setPaymentDetails(response.payment);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    verify();
  }, [location.search]);

  if (isLoading) return <LoadingSpinner />;

  if (error) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p>Payment verification failed: {error}</p>
        </div>
        <button
          onClick={() => navigate("/events")}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Browse Events
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>

      {paymentDetails && (
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-2">Order Details</h2>
          <p className="mb-1">
            <strong>Event:</strong> {paymentDetails.event.title}
          </p>
          <p className="mb-1">
            <strong>Amount:</strong> ${paymentDetails.amount.toFixed(2)}
          </p>
          <p className="mb-1">
            <strong>Reference:</strong> {paymentDetails.reference}
          </p>

          <h3 className="text-lg font-semibold mt-4 mb-2">Tickets</h3>
          <ul className="space-y-2">
            {paymentDetails.tickets.map((ticket) => (
              <li key={ticket._id} className="border-b pb-2">
                <p>
                  <strong>Type:</strong> {ticket.ticketType.toUpperCase()}
                </p>
                <p>
                  <strong>Recipient:</strong> {ticket.recipientMobileNumber}
                </p>
                <p>
                  <strong>Ticket Reference:</strong> {ticket.reference}
                </p>
              </li>
            ))}
          </ul>

          <button
            onClick={() => navigate("/my-tickets")}
            className="mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            View My Tickets
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentSuccess;
