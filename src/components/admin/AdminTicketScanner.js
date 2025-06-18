import { useState, useEffect, useRef } from "react";
import { useTicket } from "../../context/TicketContext";
import { useAdmin } from "../../context/AdminContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";
import QrScanner from 'qr-scanner';

const AdminTicketScanner = () => {
  const [reference, setReference] = useState("");
  const [adminError, setAdminError] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);
  const [showScanner, setShowScanner] = useState(true);
  const [isScanning, setIsScanning] = useState(false);
  const [cameraPermission, setCameraPermission] = useState(null);
  const [scanAttempts, setScanAttempts] = useState(0);
  const videoRef = useRef(null);
  const qrScannerRef = useRef(null);

  const {
    ticket,
    isSearching,
    error,
    handleSearchTicket,
    handleScanTicket,
  } = useTicket();

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (qrScannerRef.current) {
        qrScannerRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (showScanner && videoRef.current) {
      startScanner();
    } else if (!showScanner && qrScannerRef.current) {
      stopScanner();
    }
  }, [showScanner]);

  const checkCameraPermission = async () => {
    try {
      // Try the modern permissions API first
      if (navigator.permissions && navigator.permissions.query) {
        const permission = await navigator.permissions.query({ name: 'camera' });
        setCameraPermission(permission.state);
        
        permission.onchange = () => {
          setCameraPermission(permission.state);
        };
        
        return permission.state === 'granted';
      }
    } catch (error) {
      console.warn('Permission API not supported or failed:', error);
    }
    
    // Fallback: try to access camera directly
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      stream.getTracks().forEach(track => track.stop()); // Stop the test stream
      setCameraPermission('granted');
      return true;
    } catch (error) {
      console.warn('Direct camera access failed:', error);
      setCameraPermission('denied');
      return false;
    }
  };

  const startScanner = async () => {
    try {
      setIsScanning(true);
      setAdminError(null);
      
      // Try to start scanner directly first
      qrScannerRef.current = new QrScanner(
        videoRef.current,
        (result) => {
          handleQRScan(result.data);
        },
        {
          returnDetailedScanResult: true,
          highlightScanRegion: true,
          highlightCodeOutline: true,
          maxScansPerSecond: 1, // Prevent multiple rapid scans
        }
      );
      
      await qrScannerRef.current.start();
      setScanAttempts(0);
      setCameraPermission('granted');
    } catch (error) {
      console.error('Failed to start scanner:', error);
      if (error.name === 'NotAllowedError') {
        setAdminError('Camera access denied. Please allow camera permissions in your browser settings and refresh the page.');
      } else if (error.name === 'NotFoundError') {
        setAdminError('No camera found. Please connect a camera and try again.');
      } else if (error.name === 'NotSupportedError') {
        setAdminError('Camera not supported in this browser. Please try a different browser.');
      } else {
        setAdminError('Failed to start camera. Please check camera permissions and try again.');
      }
      setCameraPermission('denied');
    } finally {
      setIsScanning(false);
    }
  };

  const stopScanner = () => {
    if (qrScannerRef.current) {
      qrScannerRef.current.stop();
      qrScannerRef.current = null;
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!reference.trim()) return;
    setAdminError(null);
    handleSearchTicket(reference);
    console.log("Searching for ticket with reference:", reference);
  };

  const handleScan = async (ticketId) => {
    try {
      await handleScanTicket(ticketId, null); // Pass null for qrData when manually scanning
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
        setScanAttempts(prev => prev + 1);
        
        // Parse the QR code data
        const qrData = JSON.parse(result);
        if (!qrData.ticketId) {
          throw new Error("Invalid QR code format");
        }
        
        await handleScanTicket(qrData.ticketId, result);
        setAdminError(null);
        setScanSuccess("Ticket scanned successfully!");
        setShowScanner(false);
        setScanAttempts(0);
      } catch (err) {
        console.error("QR Scan Error:", err);
        if (scanAttempts >= 3) {
          setAdminError("Multiple scan attempts failed. Please check the QR code or try manual entry.");
          setShowScanner(false);
        } else {
          setAdminError(err.message || "Failed to scan QR code. Please try again.");
        }
        setScanSuccess(null);
      }
    }
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
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
          disabled={isScanning}
        >
          {showScanner ? "Hide QR Scanner" : "Show QR Scanner"}
        </button>
        
        {cameraPermission === 'denied' && (
          <span className="text-red-600 text-sm flex items-center">
            ⚠️ Camera access denied
          </span>
        )}
      </div>

      {showScanner && (
        <div className="mb-6">
          <div className="relative">
            <video
              ref={videoRef}
              className="w-full max-w-md mx-auto border rounded-lg"
            />
            {isScanning && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <div className="text-center">
                  <LoadingSpinner />
                  <p className="text-white mt-2">Starting camera...</p>
                </div>
              </div>
            )}
            
            {/* Scan overlay */}
            {!isScanning && showScanner && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-48 border-2 border-blue-500 rounded-lg">
                  <div className="absolute -top-1 -left-1 w-4 h-4 border-t-2 border-l-2 border-blue-500"></div>
                  <div className="absolute -top-1 -right-1 w-4 h-4 border-t-2 border-r-2 border-blue-500"></div>
                  <div className="absolute -bottom-1 -left-1 w-4 h-4 border-b-2 border-l-2 border-blue-500"></div>
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 border-b-2 border-r-2 border-blue-500"></div>
                </div>
              </div>
            )}
          </div>
          
          <div className="text-center mt-2 text-sm text-gray-600">
            Position the QR code within the frame
          </div>
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

      {isSearching && <LoadingSpinner />}
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
                    <div className="flex items-center justify-between">
                      <div>
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
                      </div>
                      {t.status === "success" && !t.scanned && (
                        <button
                          onClick={() => handleScan(t._id)}
                          disabled={isScanning}
                          className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm flex items-center gap-1"
                        >
                          {isScanning ? (
                            <>
                              <LoadingSpinner size="sm" />
                              Scanning...
                            </>
                          ) : (
                            <>
                              ✓ Scan Manually
                            </>
                          )}
                        </button>
                      )}
                    </div>
                    {t.scanned && (
                      <p className="text-sm text-gray-500 mt-2">
                        <span className="font-medium">Scanned at:</span>{" "}
                        {new Date(t.scannedAt).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex-shrink-0">

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
