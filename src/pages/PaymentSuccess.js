import {useEffect, useState} from "react";
import {useLocation, useNavigate} from "react-router-dom";
import {useEvents} from "../context/EventContext";
import {useAuth} from "../context/AuthContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentDetails, setPaymentDetails] = useState(null);
  const [error, setError] = useState(null);
  const [isVerifying, setIsVerifying] = useState(true);
  const { confirmPayment, isLoading } = useEvents();
  const {checkAuth } = useAuth();

  useEffect(() => {
    const verify = async () => {
      try {
        // First check if user is authenticated
        const isAuth = await checkAuth();
        
        if (!isAuth) {
          // If not authenticated, redirect to login with return URL
          const returnUrl = encodeURIComponent(location.pathname + location.search);
          navigate(`/login?returnUrl=${returnUrl}`, { 
            state: { from: { pathname: location.pathname + location.search } }
          });
          return;
        }

        const searchParams = new URLSearchParams(location.search);
        const sessionId = searchParams.get("session_id");
        const reference = searchParams.get("reference");

        if (!sessionId && !reference) {
          throw new Error("No payment reference found");
        }

        // Add retry logic for payment verification
        let retryCount = 0;
        const maxRetries = 3;
        
        while (retryCount < maxRetries) {
          try {
            const response = await confirmPayment(
              sessionId || reference,
              sessionId ? "stripe" : "wave"
            );
            setPaymentDetails(response.payment);

            break;
          } catch (err) {
            retryCount++;
            if (retryCount === maxRetries) {
              throw err;
            }
            // Wait for 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }
      } catch (err) {
        console.error("Payment verification error:", err);
        if (err.response?.status === 401) {
          // If unauthorized, redirect to login
          const returnUrl = encodeURIComponent(location.pathname + location.search);
          navigate(`/login?returnUrl=${returnUrl}`, { 
            state: { from: { pathname: location.pathname + location.search } }
          });
        } else {
          setError(err.message || "Failed to verify payment. Please try again.");
        }
      } finally {
        setIsVerifying(false);
      }
    };

    if (isVerifying) {
      verify();
    }
  }, [location.search, confirmPayment, isVerifying, checkAuth, navigate]);

  if (isLoading || isVerifying) return <LoadingSpinner />;

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
            <strong>Amount:</strong> GMD {paymentDetails.amount.toFixed(2)}
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
                  <strong>Recipient:</strong> {ticket.recipientInfo?.value || 'N/A'}
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