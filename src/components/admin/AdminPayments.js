import { useEffect } from "react";
import { useAdmin } from "../../context/AdminContext";
import LoadingSpinner from "../ui/LoadingSpinner";
import ErrorAlert from "../ui/ErrorAlert";

const AdminPayments = () => {
  const { payments, isLoadingPayments, error, fetchPayments } = useAdmin();

  // Only fetch the payments once when the component mounts
  useEffect(() => {
    if (!payments.length) {
      fetchPayments();
    }
  }, [payments.length, fetchPayments]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Payment History</h2>
      </div>

      {isLoadingPayments && <LoadingSpinner />}
      {error && <ErrorAlert message={error} />}

      {!isLoadingPayments && !error && payments.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Event
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reference
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {payment.event?.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    ${payment.amount}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {payment.status === "success" ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
                        Success
                      </span>
                    ) : payment.status === "pending" ? (
                      <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    ) : (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
                        Failed
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(payment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900">
                    {payment.reference}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* If no payments */}
      {!isLoadingPayments && !error && payments.length === 0 && (
        <div className="text-center py-4 text-gray-500">No payments found.</div>
      )}
    </div>
  );
};

export default AdminPayments;
