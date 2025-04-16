import { useState } from 'react';
import { searchTickets, scanTicket } from '../../services/ticketService';
import LoadingSpinner from '../ui/LoadingSpinner';

const AdminTicketScanner = () => {
  const [reference, setReference] = useState('');
  const [tickets, setTickets] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!reference.trim()) return;
    
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    
    try {
      const data = await searchTickets(reference);
      setTickets(data);
    } catch (err) {
      setError(err.message);
      setTickets([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScan = async (ticketId) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const updatedTicket = await scanTicket(ticketId);
      setTickets(tickets.map(ticket => 
        ticket._id === ticketId ? updatedTicket : ticket
      ));
      setSuccess('Ticket scanned successfully!');
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Ticket Scanner</h2>
      
      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex">
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter ticket reference"
            className="flex-1 p-2 border rounded-l-md"
          />
          <button 
            type="submit" 
            className="bg-blue-600 text-white px-4 py-2 rounded-r-md hover:bg-blue-700"
          >
            Search
          </button>
        </div>
      </form>
      
      {isLoading && <LoadingSpinner />}
      {error && <div className="text-red-500 mb-4">{error}</div>}
      {success && <div className="text-green-500 mb-4">{success}</div>}
      
      {tickets.length > 0 && (
        <div className="space-y-4">
          {tickets.map(ticket => (
            <div key={ticket._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{ticket.event.title}</h3>
                  <p className="text-gray-600">
                    {new Date(ticket.event.date).toLocaleString()}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Reference:</span> {ticket.reference}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {ticket.ticketType}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={ticket.status === 'success' ? 'text-green-500' : 'text-yellow-500'}>
                      {' '}{ticket.status}
                    </span>
                  </p>
                  {ticket.scanned && (
                    <p className="text-sm text-gray-500 mt-2">
                      Scanned at: {new Date(ticket.scannedAt).toLocaleString()}
                    </p>
                  )}
                </div>
                
                {ticket.status === 'success' && !ticket.scanned && (
                  <button
                    onClick={() => handleScan(ticket._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Scan Ticket
                  </button>
                )}
                
                {ticket.scanned && (
                  <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                    Scanned
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTicketScanner;