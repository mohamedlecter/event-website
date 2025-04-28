import { useEffect, useState } from "react";
import { useAdmin } from "../../context/AdminContext";
import { useTicket } from "../../context/TicketContext";
import ErrorAlert from "../ui/ErrorAlert";

const AdminPayments = () => {
  const { payments, error, fetchPayments } = useAdmin();
  const { handleScanTicket } = useTicket();

  const [showModal, setShowModal] = useState(false);
  const [ticketIdToScan, setTicketIdToScan] = useState(null);
  const [scanSuccess, setScanSuccess] = useState(null);

  useEffect(() => {
    if (!payments.length) {
      fetchPayments();
    }
  }, [payments.length, fetchPayments]);

  const handleScan = (ticketId) => {
    setTicketIdToScan(ticketId);
    setShowModal(true);
  };

  const confirmScan = async () => {
    if (ticketIdToScan) {
      try {
        await handleScanTicket(ticketIdToScan);
        setScanSuccess("Ticket scanned successfully!");
      } catch (err) {
        console.error("Scan failed:", err);
        setScanSuccess("Failed to scan ticket.");
      } finally {
        setShowModal(false);
      }
    }
  };

  const cancelScan = () => {
    setShowModal(false);
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
      </div>

      {scanSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {scanSuccess}
        </div>
      )}

      {error && (
        <div className="bg-red-100 p-4 rounded-md">
          <ErrorAlert message={error.message} />
        </div>
      )}

      {!error && payments.length === 0 && (
        <div className="text-center py-4 text-gray-500">No payments found.</div>
      )}

      {!error && payments.length > 0 && (
        <>
          {/* Desktop Table */}
          <div className="hidden md:block bg-white rounded-lg shadow-sm overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {["User", "Event", "Amount", "Status", "Date", "Reference", "Scanned", "Action"].map((header) => (
                    <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {payments.map((payment) => (
                  <tr key={payment._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{payment.userDetails?.name}</div>
                      <div className="text-sm text-gray-500">{payment.userDetails?.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{payment.eventDetails?.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">${payment.amount}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {payment.status === "success" ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Success</span>
                      ) : payment.status === "pending" ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">Pending</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Failed</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">{payment.reference}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {payment.ticketDetails.some((ticket) => ticket.scanned) ? (
                        <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">Scanned</span>
                      ) : (
                        <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Not Scanned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      {!payment.ticketDetails.some((ticket) => ticket.scanned) &&
                        payment.ticketDetails.map((ticket) => (
                          <button
                            key={ticket._id}
                            onClick={() => handleScan(ticket._id)}
                            className="bg-green-600 text-white px-3 py-1 rounded-md hover:bg-green-700 mb-1"
                          >
                            Scan Ticket
                          </button>
                        ))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="md:hidden space-y-4">
            {payments.map((payment) => (
              <div key={payment._id} className="bg-white rounded-lg shadow p-4 space-y-2">
                {[
                  { label: "User", value: `${payment.userDetails?.name} - ${payment.userDetails?.email}` },
                  { label: "Event", value: payment.eventDetails?.title },
                  { label: "Amount", value: `$${payment.amount}` },
                  { label: "Status", value: payment.status },
                  { label: "Date", value: new Date(payment.createdAt).toLocaleDateString() },
                  { label: "Reference", value: payment.reference },
                  { label: "Scanned", value: payment.ticketDetails.some((t) => t.scanned) ? "Scanned" : "Not Scanned" }
                ].map(({ label, value }) => (
                  <div key={label}>
                    <div className="text-sm font-semibold text-gray-900">{label}:</div>
                    <div className="text-sm text-gray-700">{value}</div>
                  </div>
                ))}
                <div className="flex flex-wrap gap-2">
                  {!payment.ticketDetails.some((ticket) => ticket.scanned) &&
                    payment.ticketDetails.map((ticket) => (
                      <button
                        key={ticket._id}
                        onClick={() => handleScan(ticket._id)}
                        className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                      >
                        Scan Ticket
                      </button>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Confirm Scan Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50 px-4">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Ticket Scan</h3>
            <p className="mb-4">Are you sure you want to scan this ticket?</p>
            <div className="flex justify-between">
              <button
                onClick={confirmScan}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
              >
                Yes, Scan
              </button>
              <button
                onClick={cancelScan}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPayments;
