import { useState, useEffect } from "react";
import { useTicket } from "../../context/TicketContext";
import { useAdmin } from "../../context/AdminContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";
import QrScanner from 'react-qr-scanner';

const AdminTicketScanner = () => {
  const [reference, setReference] = useState("");
  const [adminError, setAdminError] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [showScanner, setShowScanner] = useState(false);

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
    setAdminError(null);
    handleSearchTicket(reference);
    console.log("Searching for ticket with reference:", reference);
  };

  const handleScan = async (ticketId) => {
    try {
      await handleScanTicket(ticketId);
      setAdminError(null);
      setScanSuccess("Ticket scanned successfully!");
    } catch (err) {
      setAdminError(err.message);
      setScanSuccess(null);
    }
  };

  const handleQRScan = async (result) => {
    if (result) {
      try {
        // Parse the QR code data
        const qrData = JSON.parse(result.text);
        if (!qrData.ticketId) {
          throw new Error("Invalid QR code format");
        }
        
        await handleScanTicket(qrData.ticketId, result.text);
        setAdminError(null);
        setScanSuccess("Ticket scanned successfully!");
        setShowScanner(false);
      } catch (err) {
        console.error("QR Scan Error:", err);
        setAdminError(err.message || "Failed to scan QR code. Please try again.");
        setScanSuccess(null);
      }
    }
  };

  const handleQRScanError = (err) => {
    console.error("QR Scan Error:", err);
    setAdminError("Failed to scan QR code. Please try again.");
  };

  if(ticket){
    console.log("Ticket data:", ticket);
  }
  
  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-6">Ticket Scanner</h2>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowScanner(!showScanner)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {showScanner ? "Hide QR Scanner" : "Show QR Scanner"}
        </button>
      </div>

      {showScanner && (
        <div className="mb-6">
          <QrScanner
            delay={300}
            onError={handleQRScanError}
            onScan={handleQRScan}
            style={{ width: '100%', maxWidth: '400px' }}
          />
        </div>
      )}

      <form onSubmit={handleSearch} className="mb-6">
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            value={reference}
            onChange={(e) => setReference(e.target.value)}
            placeholder="Enter ticket reference"
            className="flex-1 p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            type="submit"
            disabled={isSearching}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center min-w-[120px]"
          >
            {isSearching ? (
              <>
                <LoadingSpinner size="sm" className="mr-2" />
                Searching...
              </>
            ) : (
              "Search"
            )}
          </button>
        </div>
      </form>

      {(isSearching || isScanning) && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}
      {adminError && <ErrorAlert message={adminError} />}
      {scanSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {scanSuccess}
        </div>
      )}

      {ticket && (
        <div className="space-y-4">
          {ticket.map((t) => (
            <div
              key={t._id}
              className={`border rounded-lg p-4 ${
                t.scanned ? "bg-green-50" : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg">{t.eventDetails.title}</h3>
                  <p className="text-gray-600">
                    {new Date(t.eventDetails.date).toLocaleString()}
                  </p>
                  <div className="mt-2 space-y-1">
                    <p>
                      <span className="font-medium">Reference:</span>{" "}
                      <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                        {t.reference}
                      </span>
                    </p>
                    <p>
                      <span className="font-medium">Type:</span>{" "}
                      <span className="capitalize">{t.ticketType}</span>
                    </p>
                    <p>
                      <span className="font-medium">Status:</span>{" "}
                      <span
                        className={
                          t.status === "success"
                            ? "text-green-500 font-medium"
                            : "text-yellow-500 font-medium"
                        }
                      >
                        {t.status}
                      </span>
                    </p>
                    {t.scanned && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Scanned at:</span>{" "}
                        {new Date(t.scannedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">
                  {t.status === "success" && !t.scanned && (
                    <button
                      onClick={() => handleScan(t._id)}
                      disabled={isScanning}
                      className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                    >
                      {isScanning ? (
                        <>
                          <LoadingSpinner size="sm" />
                          Scanning...
                        </>
                      ) : (
                        "Scan Ticket"
                      )}
                    </button>
                  )}

                  {t.scanned && (
                    <span className="inline-flex items-center bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ Scanned
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminTicketScanner;
