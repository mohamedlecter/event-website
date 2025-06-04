import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useAdmin } from '../../context/AdminContext';
import LoadingSpinner from '../ui/LoadingSpinner';
import ErrorAlert from '../ui/ErrorAlert';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const EventAnalytics = () => {
  const { eventId } = useParams();
  const {
    fetchEventAnalytics,
    analytics,
    isLoadingAnalytics,
    error,
  } = useAdmin();


  useEffect(() => {
    fetchEventAnalytics(eventId);
    // intentionally not adding fetchEventAnalytics to deps
  }, [eventId]);
  console.log('EventAnalytics', analytics);


  if (isLoadingAnalytics) return <LoadingSpinner />;
  if (error) return <ErrorAlert message={error} />;
  if (!analytics) return null;

  const chartData = [
    {
      name: 'Standard',
      sold: analytics.event.standardTicket.sold,
      remaining: analytics.event.standardTicket.quantity - analytics.event.standardTicket.sold,
    },
    {
      name: 'VIP',
      sold: analytics.event.vipTicket.sold,
      remaining: analytics.event.vipTicket.quantity - analytics.event.vipTicket.sold,
    }
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold">{analytics.event.title}</h2>
          <p className="text-gray-600">
            {new Date(analytics.event.date).toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-medium text-gray-500 mb-2">Total Tickets Sold</h3>
          <p className="text-3xl font-bold">
            {analytics.standardTicketsRemaining + analytics.vipTicketsRemaining === 0 ? (
              <span className="text-red-600">Sold Out!</span>
            ) : (
              analytics.event.standardTicket.sold + analytics.event.vipTicket.sold
            )}
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-medium text-gray-500 mb-2">Standard Tickets</h3>
          <p className="text-3xl font-bold">
            {analytics.event.standardTicket.sold} / {analytics.event.standardTicket.quantity}
          </p>
          <p className="text-sm mt-1">
            {analytics.standardTicketsRemaining} remaining
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-medium text-gray-500 mb-2">VIP Tickets</h3>
          <p className="text-3xl font-bold">
            {analytics.event.vipTicket.sold} / {analytics.event.vipTicket.quantity}
          </p>
          <p className="text-sm mt-1">
            {analytics.vipTicketsRemaining} remaining
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-sm border mb-8">
        <h3 className="font-medium text-gray-500 mb-4">Ticket Sales</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sold" fill="#8884d8" name="Sold" />
              <Bar dataKey="remaining" fill="#82ca9d" name="Remaining" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="font-medium text-gray-500 mb-4">Recent Payments</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  User
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
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
              {analytics.payments.map(payment => (
                <tr key={payment._id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {payment.user?.name}
                    </div>
                    <div className="text-sm text-gray-500">
                      {payment.user?.email}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      GMD {payment.amount}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900 font-mono">
                      {payment.reference}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventAnalytics;