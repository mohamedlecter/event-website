import { useState } from 'react';
import { useEvents } from '../../context/EventContext';
import LoadingSpinner from '../ui/LoadingSpinner';

const TicketCard = ({ ticket }) => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [recipientMobileNumber, setRecipientMobileNumber] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const { transferUserTicket } = useEvents();

  const handleTransfer = async (e) => {
    e.preventDefault();
    if (!recipientMobileNumber) return;
    
    setIsTransferring(true);
    try {
      await transferUserTicket(ticket._id, recipientMobileNumber);
      setShowTransferForm(false);
      setRecipientMobileNumber('');
    } finally {
      setIsTransferring(false);
    }
  };

  const eventDate = new Date(ticket.event.date);
  const isUpcoming = eventDate > new Date();

  return (
    <div className="border rounded-lg p-4 bg-white">
      <div className="flex flex-col md:flex-row md:justify-between">
        <div className="mb-4 md:mb-0">
          <h3 className="font-bold text-lg">{ticket.event.title}</h3>
          <p className="text-gray-600">
            {eventDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
          <p className="text-gray-700 mt-1">
            {ticket.event.location.city}, {ticket.event.location.country}
          </p>
        </div>
        
        <div className="flex flex-col items-start md:items-end">
          <div className="flex items-center mb-2">
            <span className={`px-2 py-1 rounded-full text-xs ${
              ticket.ticketType === 'vip' 
                ? 'bg-purple-100 text-purple-800' 
                : 'bg-blue-100 text-blue-800'
            }`}>
              {ticket.ticketType.toUpperCase()}
            </span>
            <span className="ml-2 font-bold">${ticket.price}</span>
          </div>
          
          <div className="text-sm">
            <p className="text-gray-600">
              <span className="font-medium">Recipient:</span> {ticket.recipientMobileNumber}
            </p>
            <p className="text-gray-600">
              <span className="font-medium">Reference:</span> {ticket.reference}
            </p>
          </div>
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t flex justify-between items-center">
        <div>
          {ticket.transferred && (
            <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
              Transferred
            </span>
          )}
        </div>
        
        {isUpcoming && !ticket.transferred && (
          <button
            onClick={() => setShowTransferForm(true)}
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            Transfer Ticket
          </button>
        )}
      </div>
      
      {showTransferForm && (
        <div className="mt-4 pt-4 border-t">
          <form onSubmit={handleTransfer} className="flex flex-col sm:flex-row gap-2">
            <input
              type="mobile"
              value={recipientMobileNumber}
              onChange={(e) => setRecipientMobileNumber(e.target.value)}
              placeholder="Recipient email"
              className="flex-1 p-2 border rounded-md"
              required
              typeof='Number'
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowTransferForm(false);
                  setRecipientMobileNumber('');
                }}
                className="px-3 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
                disabled={isTransferring}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                disabled={isTransferring}
              >
                {isTransferring ? <LoadingSpinner small /> : 'Transfer'}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default TicketCard;