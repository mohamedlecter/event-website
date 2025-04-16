import { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorAlert from '../ui/ErrorAlert';

const PaymentForm = ({ event, ticketType, onClose }) => {
  const [quantity, setQuantity] = useState(1);
  const [recipientEmails, setRecipientEmails] = useState(['']);
  const [paymentInitiated, setPaymentInitiated] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');
  const { purchaseTickets, isLoading, error } = useEvents();

  const handleQuantityChange = (e) => {
    const newQuantity = parseInt(e.target.value);
    setQuantity(newQuantity);
    
    // Adjust recipient emails array
    if (newQuantity > recipientEmails.length) {
      const newEmails = [...recipientEmails];
      while (newEmails.length < newQuantity) {
        newEmails.push('');
      }
      setRecipientEmails(newEmails);
    } else if (newQuantity < recipientEmails.length) {
      setRecipientEmails(recipientEmails.slice(0, newQuantity));
    }
  };

  const handleEmailChange = (index, value) => {
    const newEmails = [...recipientEmails];
    newEmails[index] = value;
    setRecipientEmails(newEmails);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const paymentData = await purchaseTickets(event._id, {
        ticketType,
        quantity,
        recipientEmails,
      });
      
      setPaymentInitiated(true);
      setPaymentUrl(paymentData.authorizationUrl);
      
      // Redirect to payment URL
      window.location.href = paymentData.authorizationUrl;
    } catch (err) {
      console.error('Payment initiation failed:', err);
    }
  };

  if (isLoading) return <LoadingSpinner />;

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
        
        {paymentInitiated ? (
          <div className="text-center">
            <p className="mb-4">Redirecting to payment gateway...</p>
            <a 
              href={paymentUrl} 
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              Proceed to Payment
            </a>
          </div>
        ) : (
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
              <label className="block text-gray-700 mb-2">Recipient Email(s)</label>
              {recipientEmails.map((email, index) => (
                <input
                  key={index}
                  type="email"
                  value={email}
                  onChange={(e) => handleEmailChange(index, e.target.value)}
                  placeholder={`Recipient ${index + 1} email`}
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
              >
                Proceed to Payment
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PaymentForm;