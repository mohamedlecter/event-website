import { useState, useEffect } from "react";
import { useEvents } from "../../context/EventContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ event, info, ticketType, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [recipientMobileNumbers, setRecipientMobileNumbers] = useState([""]);
  const [recipientCountryCodes, setRecipientCountryCodes] = useState(["+1"]);
  const [recipientEmails, setRecipientEmails] = useState([""]);
  const [recipientType, setRecipientType] = useState("mobile");
  const [paymentGateway, setPaymentGateway] = useState("wave");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState(null);
  const { purchaseTickets, isLoading } = useEvents();

  // Country codes
  const [countries, setCountries] = useState([]);

  // Fetch countries on mount
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await fetch(
          "https://restcountries.com/v3.1/all?fields=name,idd"
        );
        const data = await res.json();
        const valid = data
          .filter(
            (c) =>
              c.idd &&
              c.idd.root &&
              typeof c.idd.root === "string" &&
              c.idd.root.length > 0
          )
          .map((c) => ({
            name: c.name.common,
            code:
              c.idd.suffixes && c.idd.suffixes.length > 0
                ? `${c.idd.root}${c.idd.suffixes[0]}`
                : c.idd.root,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(valid);

        // Optionally set defaults for new recipients
        setRecipientCountryCodes((old) =>
          Array(quantity)
            .fill(valid.length ? valid[0].code : "+1")
            .map((code, i) => old[i] || code)
        );
      } catch (err) {
        console.error("Failed to fetch country codes", err);
      }
    };
    fetchCountries();
    // eslint-disable-next-line
  }, []);

  // When quantity changes, adjust array sizes
  const maxTickets = Math.min(
    ticketType === "vip"
      ? info.vipTicketsAvailable
      : info.standardTicketsAvailable,
    100
  );

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value) || 1;
    const validQuantity = Math.min(Math.max(1, newQuantity), maxTickets);
    setQuantity(validQuantity);

    // Adjust recipient arrays
    const newMobileNumbers = [...recipientMobileNumbers];
    const newCountryCodes = [...recipientCountryCodes];
    const newEmails = [...recipientEmails];

    while (newMobileNumbers.length < validQuantity) {
      newMobileNumbers.push("");
      newCountryCodes.push(countries.length ? countries[0].code : "+1");
      newEmails.push("");
    }
    setRecipientMobileNumbers(newMobileNumbers.slice(0, validQuantity));
    setRecipientCountryCodes(newCountryCodes.slice(0, validQuantity));
    setRecipientEmails(newEmails.slice(0, validQuantity));
  };

  const handleNumberChange = (index, value) => {
    const newMobileNumbers = [...recipientMobileNumbers];
    newMobileNumbers[index] = value;
    setRecipientMobileNumbers(newMobileNumbers);
  };

  const handleCountryCodeChange = (index, value) => {
    const newCountryCodes = [...recipientCountryCodes];
    newCountryCodes[index] = value;
    setRecipientCountryCodes(newCountryCodes);
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
      for (let i = 0; i < recipientMobileNumbers.length; i++) {
        const num = recipientMobileNumbers[i].trim();
        const code = recipientCountryCodes[i];
        if (!num.match(/^\d+$/)) {
          setError(`Please enter a valid number for recipient ${i + 1}.`);
          return false;
        }
        // You can add more format validation as needed
        if (!code) {
          setError(`Please select a country code for recipient ${i + 1}.`);
          return false;
        }
      }
    } else {
      for (let i = 0; i < recipientEmails.length; i++) {
        const email = recipientEmails[i];
        if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
          setError(`Please enter a valid email for recipient ${i + 1}.`);
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
      const recipientInfo =
        recipientType === "email"
          ? recipientEmails.map((email) => ({
              type: "email",
              value: email,
              name: email,
            }))
          : recipientMobileNumbers.map((number, i) => ({
              type: "mobile",
              // Generate full international number
              value: recipientCountryCodes[i] + number.trim(),
              name: recipientCountryCodes[i] + number.trim(),
            }));

      const paymentData = {
        ticketType,
        quantity,
        recipientType,
        recipientInfo,
        paymentGateway,
        currency: "GMD",
      };

      const response = await purchaseTickets(eventIdStr, paymentData);
      if (paymentGateway === "stripe") {
        const stripe = await stripePromise;
        if (!stripe) throw new Error("Stripe failed to load. Please try again.");
        const { error } = await stripe.redirectToCheckout({
          sessionId: response.id,
        });
        if (error) throw error;
      } else if (paymentGateway === "wave") {
        const paymentUrl = response.paymentUrl || response.wave_launch_url;
        if (!paymentUrl) throw new Error("Wave payment URL not received. Please try again.");
        localStorage.setItem("wavePaymentReference", response.reference);
        window.location.href = paymentUrl;
      }
    } catch (err) {
      setError(err.message || "Failed to initiate payment. Please try again.");
      setIsProcessing(false);
    }
  };

  const currency = paymentGateway === "wave" ? "GMD  " : "GMD";
  const ticketPrice = ticketType === "vip" ? event.vipTicket.price : event.standardTicket.price;
  const totalAmount = ticketPrice * quantity;

  if (isLoading || isProcessing) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl max-h-[95vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-900">Purchase Tickets</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors duration-200">
            &times;
          </button>
        </div>

        {error && <ErrorAlert message={error} className="mb-4" />}

        <form onSubmit={handleSubmit}>
          {/* Payment Gateway */}
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-2">Payment Gateway</label>
            <select
              value={paymentGateway}
              onChange={(e) => setPaymentGateway(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] transition-colors duration-200"
              disabled={isProcessing}
            >
              <option value="wave">Wave Mobile Money</option>
              <option value="stripe">Visa, MasterCard, Credit Card</option>
            </select>
            {paymentGateway === "wave" && (
              <div className="text-sm text-gray-600 mt-2">
                <p>• Payments processed in GMD  </p>
                <p>• Requires Wave mobile app</p>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={() => handleQuantityChange({ target: { value: quantity - 1 } })}
                disabled={quantity <= 1 || isProcessing}
                className="p-2 border rounded-lg hover:bg-[#FBA415]/10 disabled:opacity-50 transition-colors duration-200"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                min="1"
                max={maxTickets}
                className="w-20 p-3 border rounded-lg text-center focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] transition-colors duration-200"
                disabled={isProcessing}
              />
              <button
                type="button"
                onClick={() => handleQuantityChange({ target: { value: quantity + 1 } })}
                disabled={quantity >= maxTickets || isProcessing}
                className="p-2 border rounded-lg hover:bg-[#FBA415]/10 disabled:opacity-50 transition-colors duration-200"
              >
                +
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-1">{maxTickets} tickets available</p>
          </div>

          {/* Recipient Type */}
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-2">Recipient Type</label>
            <select
              value={recipientType}
              onChange={(e) => setRecipientType(e.target.value)}
              className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] transition-colors duration-200"
              disabled={isProcessing}
            >
              <option value="mobile">Mobile Number</option>
              <option value="email">Email Address</option>
            </select>
          </div>

          {/* Recipients */}
          <div className="mb-6">
            <label className="block text-gray-900 font-medium mb-2">
              {recipientType === "mobile" ? "Recipient Mobile Number(s)" : "Recipient Email(s)"}
            </label>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
              {recipientType === "mobile" ? (
                recipientMobileNumbers.map((number, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500 w-7">{index + 1}.</span>
                    <select
                      value={recipientCountryCodes[index] || (countries.length ? countries[0].code : "+1")}
                      onChange={(e) => handleCountryCodeChange(index, e.target.value)}
                      className="rounded-l-lg px-2 py-2 border border-gray-300 bg-gray-50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] sm:text-sm"
                      style={{ minWidth: 90 }}
                      required
                      disabled={isProcessing || !countries.length}
                    >
                      {countries.map((country) => (
                        <option
                          key={`${country.code}-${country.name}`} // <-- Make key unique
                          value={country.code}
                        >
                          {country.name} ({country.code})
                        </option>
                      ))}
                    </select>
                    <input
                      type="tel"
                      value={number}
                      onChange={(e) => handleNumberChange(index, e.target.value)}
                      placeholder={`Recipient ${index + 1} mobile`}
                      className="flex-1 p-3 border rounded-r-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] transition-colors duration-200"
                      required
                      disabled={isProcessing}
                    />
                  </div>
                ))
              ) : (
                recipientEmails.map((email, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <span className="text-gray-500 w-7">{index + 1}.</span>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => handleEmailChange(index, e.target.value)}
                      placeholder={`Recipient ${index + 1} email`}
                      className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415] transition-colors duration-200"
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

          {/* Order Summary */}
          <div className="mb-6">
            <h4 className="font-semibold mb-2 text-gray-900">Order Summary</h4>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-700">
                  {quantity} x {ticketType === "vip" ? "VIP" : "Standard"} Ticket
                </span>
                <span className="font-medium text-gray-900">
                  {currency} {ticketPrice}
                </span>
              </div>
              <div className="border-t pt-2 flex justify-between">
                <span className="font-bold text-gray-900">Total</span>
                <span className="font-bold text-gray-900">
                  {currency} {totalAmount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-lg hover:bg-[#FBA415]/10 transition-colors duration-200"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[#FBA415] hover:bg-[#FBA415]/90 text-gray-900 rounded-lg font-medium transition-colors duration-200"
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
