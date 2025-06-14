import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEvents } from '../../context/EventContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import { QRCodeSVG } from 'qrcode.react';
import { getTransferHistory, cancelTransfer } from '../../services/eventService';
import ErrorAlert from '../ui/ErrorAlert';

const TicketCard = ({ ticket }) => {
  const [showTransferForm, setShowTransferForm] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showTransferHistory, setShowTransferHistory] = useState(false);
  const [transferType, setTransferType] = useState('mobile');
  const [recipientValue, setRecipientValue] = useState('');
  const [recipientName, setRecipientName] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [isCancelling, setIsCancelling] = useState(false);
  const [transferHistory, setTransferHistory] = useState([]);
  const [transferError, setTransferError] = useState(null);
  const { transferUserTicket } = useEvents();

  useEffect(() => {
    if (showTransferHistory && ticket.transferHistory?.length > 0) {
      loadTransferHistory();
    }
  }, [showTransferHistory]);

  const loadTransferHistory = async () => {
    try {
      const history = await getTransferHistory(ticket._id);
      setTransferHistory(history);
    } catch (error) {
      console.error('Failed to load transfer history:', error);
    }
  };

  const validateTicketForTransfer = () => {
    if (!ticket.isPaid) {
      setTransferError('Only paid tickets can be transferred. Please complete the payment first.');
      return false;
    }
    if (ticket.transferred) {
      setTransferError('This ticket has already been transferred.');
      return false;
    }
    if (new Date(ticket.event.date) <= new Date()) {
      setTransferError('Cannot transfer tickets for past events.');
      return false;
    }
    return true;
  };

  const handleTransfer = async (e) => {
    e.preventDefault();
    setTransferError(null);

    if (!validateTicketForTransfer()) {
      return;
    }

    if (!recipientValue) {
      setTransferError('Please enter recipient details.');
      return;
    }

    // Validate mobile number format
    if (transferType === 'mobile' && !/^[0-9]{10}$/.test(recipientValue)) {
      setTransferError('Please enter a valid 10-digit mobile number.');
      return;
    }

    // Validate email format
    if (transferType === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientValue)) {
      setTransferError('Please enter a valid email address.');
      return;
    }
    
    setIsTransferring(true);
    try {
      await transferUserTicket(ticket._id, {
        recipientType: transferType,
        recipientValue,
        recipientName
      });
      setShowTransferForm(false);
      setRecipientValue('');
      setRecipientName('');
      if (showTransferHistory) {
        loadTransferHistory();
      }
    } catch (error) {
      setTransferError(error.response?.data?.message || error.message || 'Failed to transfer ticket. Please try again.');
    } finally {
      setIsTransferring(false);
    }
  };

  const handleCancelTransfer = async () => {
    if (!window.confirm('Are you sure you want to cancel this transfer?')) return;
    
    setIsCancelling(true);
    try {
      await cancelTransfer(ticket._id);
      if (showTransferHistory) {
        loadTransferHistory();
      }
    } finally {
      setIsCancelling(false);
    }
  };

  const eventDate = new Date(ticket.event.date);
  const isUpcoming = eventDate > new Date();
  const isPast = eventDate < new Date();
  const isToday = new Date().toDateString() === eventDate.toDateString();

  const getEventStatus = () => {
    if (isPast) return { text: 'Past Event', color: 'gray' };
    if (isToday) return { text: 'Today', color: 'green' };
    return { text: 'Upcoming', color: 'blue' };
  };

  const eventStatus = getEventStatus();

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTicketTypeColor = (type) => {
    switch (type) {
      case 'vip':
        return 'bg-[#FBA415]/10 text-[#FBA415] border-[#FBA415]/20';
      case 'standard':
        return 'bg-[#FBA415]/10 text-[#FBA415] border-[#FBA415]/20';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border rounded-lg p-6 bg-white shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-bold text-xl mb-1">{ticket.event.title}</h3>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getTicketTypeColor(ticket.ticketType)}`}>
                {ticket.ticketType.toUpperCase()}
              </span>
            </div>
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              eventStatus.color === 'gray' 
                ? 'bg-gray-100 text-gray-800'
                : eventStatus.color === 'green'
                ? 'bg-green-100 text-green-800'
                : 'bg-[#FBA415]/10 text-[#FBA415]'
            }`}>
              {eventStatus.text}
            </span>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-600">
              <span className="w-24 font-medium">Date & Time:</span>
              {formatDate(eventDate)}
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-24 font-medium">Location:</span>
              {ticket.event.location.city}, {ticket.event.location.country}
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-24 font-medium">Price:</span>
              <span className="font-bold text-gray-900">GMD {ticket.price}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-24 font-medium">Reference:</span>
              <span className="font-mono text-sm">{ticket.reference}</span>
            </div>
            <div className="flex items-center text-gray-600">
              <span className="w-24 font-medium">Recipient:</span>
              {ticket.recipientMobileNumber}
            </div>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4">
          <button
            onClick={() => setShowQRCode(!showQRCode)}
            className="px-4 py-2 text-sm font-medium text-[#FBA415] hover:text-[#FBA415]/80 transition-colors"
            aria-label={showQRCode ? "Hide QR Code" : "Show QR Code"}
          >
            {showQRCode ? "Hide QR" : "Show QR"}
          </button>

          <AnimatePresence>
            {showQRCode && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="p-4 bg-white rounded-lg shadow-sm border border-gray-100"
              >
                {ticket.qrCode ? (
                  <img 
                    src={ticket.qrCode.data} 
                    alt="Ticket QR Code" 
                    className="w-32 h-32"
                  />
                ) : (
                  <div className="text-center text-gray-500">
                    <p>QR Code not available</p>
                    <p className="text-sm">Please refresh the page</p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      
      <div className="mt-6 pt-4 border-t flex justify-between items-center">
        <div className="flex items-center gap-2">
          {ticket.transferred && (
            <span className="text-xs bg-[#FBA415]/10 text-[#FBA415] px-3 py-1 rounded-full font-medium">
              Transferred
            </span>
          )}
          {isToday && (
            <span className="text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium">
              Event Today
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          {isUpcoming && !ticket.transferred && (
            <button
              onClick={() => setShowTransferForm(true)}
              className="px-4 py-2 text-sm text-[#FBA415] hover:text-[#FBA415]/80 font-medium transition-colors"
            >
              Transfer Ticket
            </button>
          )}
          <button
            onClick={() => setShowTransferHistory(!showTransferHistory)}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            {showTransferHistory ? 'Hide History' : 'Show History'}
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Print Ticket
          </button>
        </div>
      </div>
      
      <AnimatePresence>
        {showTransferHistory && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t"
          >
            <h3 className="text-lg font-semibold mb-3">Transfer History</h3>
            {transferHistory.length > 0 ? (
              <div className="space-y-3">
                {transferHistory.map((transfer, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm text-gray-600">
                          Transferred to: {transfer.to.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-500">
                          {transfer.to.type}: {transfer.to.value}
                        </p>
                        <p className="text-xs text-gray-400">
                          {new Date(transfer.transferredAt).toLocaleString()}
                        </p>
                      </div>
                      {transfer.status === 'pending' && (
                        <button
                          onClick={handleCancelTransfer}
                          disabled={isCancelling}
                          className="text-sm text-red-600 hover:text-red-800 transition-colors"
                        >
                          {isCancelling ? <LoadingSpinner small /> : 'Cancel'}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-4">No transfer history available</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showTransferForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t"
          >
            {transferError && (
              <ErrorAlert 
                message={transferError} 
                onClose={() => setTransferError(null)}
                className="mb-4"
              />
            )}
            <form onSubmit={handleTransfer} className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Transfer Type
                  </label>
                  <select
                    value={transferType}
                    onChange={(e) => setTransferType(e.target.value)}
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415]"
                  >
                    <option value="mobile">Mobile Number</option>
                    <option value="email">Email Address</option>
                  </select>
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Recipient Name (Optional)
                  </label>
                  <input
                    type="text"
                    value={recipientName}
                    onChange={(e) => setRecipientName(e.target.value)}
                    placeholder="Enter recipient's name"
                    className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {transferType === 'mobile' ? 'Mobile Number' : 'Email Address'}
                </label>
                <input
                  type={transferType === 'mobile' ? 'tel' : 'email'}
                  value={recipientValue}
                  onChange={(e) => setRecipientValue(e.target.value)}
                  placeholder={`Enter recipient's ${transferType === 'mobile' ? 'mobile number' : 'email'}`}
                  className="w-full p-2 border rounded-lg focus:ring-2 focus:ring-[#FBA415] focus:border-[#FBA415]"
                  required
                  pattern={transferType === 'mobile' ? '[0-9]{10}' : undefined}
                  title={transferType === 'mobile' ? 'Please enter a valid 10-digit mobile number' : undefined}
                />
              </div>

              <div className="flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowTransferForm(false);
                    setRecipientValue('');
                    setRecipientName('');
                  }}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  disabled={isTransferring}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#FBA415] text-gray-900 rounded-lg hover:bg-[#FBA415]/90 transition-colors disabled:opacity-50"
                  disabled={isTransferring}
                >
                  {isTransferring ? <LoadingSpinner small /> : 'Transfer Ticket'}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default TicketCard;