import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventContext";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import ErrorAlert from "../components/ui/ErrorAlert";

const PaymentSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { confirmPayment } = useEvents();
  const [payment, setPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const query = new URLSearchParams(location.search);
    const reference = query.get("reference");

    if (!reference) {
      navigate("/events");
      return;
    }

    const verifyPayment = async () => {
      try {
        const paymentData = await confirmPayment(reference);
        setPayment(paymentData);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    verifyPayment();
  }, [location.search]);

  if (isLoading) return <LoadingSpinner />;

  console.log(payment);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {error ? (
          <div className="p-6">
            <ErrorAlert message={error} />
            <button
              onClick={() => navigate("/events")}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Back to Events
            </button>
          </div>
        ) : payment ? (
          <div className="p-6">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg
                  className="w-8 h-8 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold mb-2">Payment Successful!</h2>
              <p className="text-gray-600">
                Your tickets have been purchased successfully.
              </p>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-medium mb-4">Order Details</h3>

              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Event:</span>
                  <span className="font-medium">
                    {payment.payment.event.title}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium">${payment.payment.amount}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Reference:</span>
                  <span className="font-medium">
                    {payment.payment.reference}
                  </span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {new Date(payment.payment.createdAt).toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-between">
              <button
                onClick={() => navigate("/events")}
                className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
              >
                Browse More Events
              </button>
              <button
                onClick={() => navigate("/my-tickets")}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                View My Tickets
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default PaymentSuccess;
