import { useState } from "react";
import { useEvents } from "../../context/EventContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ event, ticketType, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [recipientMobileNumbers, setRecipientMobileNumbers] = useState([""]);
  const [recipientEmails, setRecipientEmails] = useState([""]);
  const [recipientType, setRecipientType] = useState("mobile");
  const [paymentGateway, setPaymentGateway] = useState("stripe");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { purchaseTickets, isLoading } = useEvents();

  const maxTickets = Math.min(
    ticketType === "vip" 
      ? event.vipTicket.quantity - event.vipTicket.sold
      : event.standardTicket.quantity - event.standardTicket.sold,
    100 // Set a reasonable maximum limit
  );

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    const validQuantity = Math.min(Math.max(1, newQuantity), maxTickets);
    setQuantity(validQuantity);

    if (validQuantity > recipientMobileNumbers.length) {
      const newMobileNumbers = [...recipientMobileNumbers];
      const newEmails = [...recipientEmails];
      while (newMobileNumbers.length < validQuantity) {
        newMobileNumbers.push("");
        newEmails.push("");
      }
      setRecipientMobileNumbers(newMobileNumbers);
      setRecipientEmails(newEmails);
    } else if (validQuantity < recipientMobileNumbers.length) {
      setRecipientMobileNumbers(recipientMobileNumbers.slice(0, validQuantity));
      setRecipientEmails(recipientEmails.slice(0, validQuantity));
    }
  };

  const handleNumberChange = (index, value) => {
    const newMobileNumbers = [...recipientMobileNumbers];
    newMobileNumbers[index] = value;
    setRecipientMobileNumbers(newMobileNumbers);
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...recipientEmails];
    newEmails[index] = value;
    setRecipientEmails(newEmails);
  };

  const validateForm = () => {
    if (!event?._id) {
      setError("Invalid event data. Please try again.");
      return false;
    }

    if (!ticketType) {
      setError("Please select a ticket type.");
      return false;
    }

    if (quantity < 1) {
      setError("Please select at least one ticket.");
      return false;
    }

    if (recipientType === "mobile") {
      // Validate mobile numbers
      for (let i = 0; i < recipientMobileNumbers.length; i++) {
        const number = recipientMobileNumbers[i];
        if (!number || !/^[0-9]{7}$/.test(number)) {
          setError(`Please enter a valid 7-digit mobile number for recipient ${i + 1}.`);
          return false;
        }
      }
    } else {
      // Validate emails
      for (let i = 0; i < recipientEmails.length; i++) {
        const email = recipientEmails[i];
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError(`Please enter a valid email address for recipient ${i + 1}.`);
          return false;
        }
      }
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsProcessing(true);
    try {
      const eventIdStr = event._id.toString();
      const recipientInfo = recipientType === "email" 
        ? recipientEmails.map(email => ({
            type: "email",
            value: email,
            name: email
          }))
        : recipientMobileNumbers.map(number => ({
            type: "mobile",
            value: number,
            name: number
          }));

      const paymentData = {
        ticketType,
        quantity,
        recipientType,
        recipientInfo,
        paymentGateway,
        metadata: {
          eventId: eventIdStr,
          eventTitle: event.title,
          ticketType: ticketType,
          quantity: quantity.toString()
        }
      };

      const response = await purchaseTickets(eventIdStr, paymentData);

      if (paymentGateway === "stripe") {
        const stripe = await stripePromise;
        if (!stripe) {
          throw new Error("Stripe failed to load. Please try again.");
        }

        const { error } = await stripe.redirectToCheckout({
          sessionId: response.id,
        });
        
        if (error) {
          throw error;
        }
      } else if (paymentGateway === "wave") {
        if (!response.wave_launch_url) {
          throw new Error("Wave payment URL not received.");
        }
        window.location.href = response.wave_launch_url;
      }
    } catch (err) {
      console.error("Payment initiation failed:", err);
      setError(err.message || "Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  }; 

  const currency = paymentGateway === "wave" ? "GMD " : "USD";
  const ticketPrice = ticketType === "vip" ? event.vipTicket.price : event.standardTicket.price;
  const totalAmount = ticketPrice * quantity;

  if (isLoading || isProcessing) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Purchase Tickets</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        {error && <ErrorAlert message={error} className="mb-4" />}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Payment Gateway</label>
            <select
              value={paymentGateway}
              onChange={(e) => setPaymentGateway(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              disabled={isProcessing}
            >
              <option value="stripe">Stripe (Credit Card)</option>
              <option value="wave">Wave Mobile Money</option>
            </select>
            {paymentGateway === "wave" && (
              <div className="text-sm text-gray-600 mt-2">
                <p>• Payments processed in GMD </p>
                <p>• Requires Wave mobile app</p>
              </div>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleQuantityChange({ target: { value: quantity - 1 } })}
                disabled={quantity <= 1 || isProcessing}
                className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={maxTickets}
                className="w-20 p-2 border rounded-md text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                disabled={isProcessing}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange({ target: { value: quantity + 1 } })}
                disabled={quantity >= maxTickets || isProcessing}
                className="p-2 border rounded-md hover:bg-gray-50 disabled:opacity-50"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">
              {maxTickets} tickets available
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Recipient Type</label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className="w-full p-2 border rounded-md mb-4"
              disabled={isProcessing}
            >
              <option value="mobile">Mobile Number</option>
              <option value="email">Email Address</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 mb-2">
              {recipientType === "mobile" ? "Recipient Mobile Number(s)" : "Recipient Email(s)"}
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {recipientType === "mobile" ? (
                recipientMobileNumbers.map((number, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500 w-8">{index + 1}.</span>
                    <input
                      type="tel"
                      value={number}
                      onChange={(e) => handleNumberChange(index, e.target.value)}
                      placeholder={`Recipient ${index + 1} mobile number`}
                      className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      pattern="[0-9]{7}"
                      title="Please enter a valid 7-digit mobile number"
                      disabled={isProcessing}
                    />
                  </div>
                ))
              ) : (
                recipientEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500 w-8">{index + 1}.</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder={`Recipient ${index + 1} email address`}
                      className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      required
                      pattern="[^\s@]+@[^\s@]+\.[^\s@]+"
                      title="Please enter a valid email address"
                      disabled={isProcessing}
                    />
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Order Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>{quantity} x {ticketType === "vip" ? "VIP" : "Standard"} Ticket</span>
                <span className="font-medium">{currency} {ticketPrice}</span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold">Total</span>
                <span className="font-bold">{currency} {totalAmount}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? "Processing..." : "Proceed to Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;
