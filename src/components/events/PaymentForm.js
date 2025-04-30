import { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorAlert from '../ui/ErrorAlert';
import { loadStripe } from '@stripe/stripe-js';

// Load Stripe outside the component
const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const PaymentForm = ({ event, ticketType, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [recipientMobileNumbers, setRecipientMobileNumbers] = useState(['']);
  const [isProcessing, setIsProcessing] = useState(false);
  const { purchaseTickets, isLoading, error } = useEvents();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    
    if (newQuantity > recipientMobileNumbers.length) {
      const newMobileNumbers = [...recipientMobileNumbers];
      while (newMobileNumbers.length < newQuantity) {
        newMobileNumbers.push('');
      }
      setRecipientMobileNumbers(newMobileNumbers);
    } else if (newQuantity < recipientMobileNumbers.length) {
      setRecipientMobileNumbers(recipientMobileNumbers.slice(0, newQuantity));
    }
  };

  const handleNumberChange = (index, value) => {
    const newMobileNumbers = [...recipientMobileNumbers];
    newMobileNumbers[index] = value;
    setRecipientMobileNumbers(newMobileNumbers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    try {
      console.log('Initiating payment...');
      console.log('Event ID:', event._id);
      console.log('Ticket Type:', ticketType);
      // 1. Initiate payment on your server
      const paymentData = await purchaseTickets(event._id.toString(), {
        ticketType,
        quantity,
        recipientMobileNumbers,
      });
      
      // 2. Redirect to Stripe Checkout
      const stripe = await stripePromise;
      const { error } = await stripe.redirectToCheckout({
        sessionId: paymentData.id // The session ID from your server
      });
      
      if (error) {
        throw error;
      }
    } catch (err) {
      console.error('Payment initiation failed:', err);
      setIsProcessing(false);
    }
  };

  if (isLoading || isProcessing) return <LoadingSpinner />;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-bold">Purchase Tickets</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        
        {error && <ErrorAlert message={error} className="mb-4" />}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Quantity</label>
            <select
              value={quantity}
              onChange={handleQuantityChange}
              className="w-full p-2 border rounded-md"
            >
              {[...Array(10).keys()].map(num => (
                <option key={num + 1} value={num + 1}>
                  {num + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Recipient Mobile Number(s)</label>
            {recipientMobileNumbers.map((number, index) => (
              <input
                key={index}
                type="tel"
                value={number}
                onChange={(e) => handleNumberChange(index, e.target.value)}
                placeholder={`Recipient ${index + 1} mobile number`}
                className="w-full p-2 border rounded-md mb-2"
                required
              />
            ))}
          </div>
          
          <div className="mb-4">
            <h4 className="font-semibold">Order Summary</h4>
            <div className="mt-2">
              <p>
                {quantity} x {ticketType === 'vip' ? 'VIP' : 'Standard'} Ticket: 
                <span className="font-bold ml-2">
                  ${ticketType === 'vip' ? event.vipTicket.price : event.standardTicket.price}
                </span>
              </p>
              <p className="mt-2 font-bold">
                Total: ${(ticketType === 'vip' ? event.vipTicket.price : event.standardTicket.price) * quantity}
              </p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              disabled={isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Proceed to Payment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PaymentForm;