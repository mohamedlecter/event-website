import { useState } from "react";
import { useTicket } from "../../context/TicketContext";
import LoadingSpinner from "../ui/LoadingSpinner";

const AdminTicketScanner = () => {
  const [reference, setReference] = useState("");

  const {
    ticket,
    isSearching,
    isScanning,
    error,
    handleSearchTicket,
    handleScanTicket,
  } = useTicket();

  const handleSearch = (e) => {
    e.preventDefault();
    if (!reference.trim()) return;
    handleSearchTicket(reference);
  };

  const handleScan = (ticketId) => {
    handleScanTicket(ticketId);
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

      {(isSearching || isScanning) && <LoadingSpinner />}
      {error && <div className="text-red-500 mb-4">{error}</div>}

      {ticket && Array.isArray(ticket) && ticket.length > 0 && (
        <div className="space-y-4">
          {ticket.map((t) => (
            <div key={t._id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{t.event.title}</h3>
                  <p className="text-gray-600">
                    {new Date(t.event.date).toLocaleString()}
                  </p>
                  <p className="mt-2">
                    <span className="font-medium">Reference:</span>{" "}
                    {t.reference}
                  </p>
                  <p>
                    <span className="font-medium">Type:</span> {t.ticketType}
                  </p>
                  <p>
                    <span className="font-medium">Status:</span>
                    <span
                      className={
                        t.status === "success"
                          ? "text-green-500"
                          : "text-yellow-500"
                      }
                    >
                      {" "}
                      {t.status}
                    </span>
                  </p>
                  {t.scanned && (
                    <p className="text-sm text-gray-500 mt-2">
                      Scanned at: {new Date(t.scannedAt).toLocaleString()}
                    </p>
                  )}
                </div>

                {t.status === "success" && !t.scanned && (
                  <button
                    onClick={() => handleScan(t._id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                  >
                    Scan Ticket
                  </button>
                )}

                {t.scanned && (
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
