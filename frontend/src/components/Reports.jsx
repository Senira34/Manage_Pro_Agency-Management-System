import React from 'react';

const Reports = ({ creditBills, collections, formatDate }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Admin Reports</h2>
      
      {/* Agency-wise Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...new Set(creditBills.map(b => b.agencyName))].map(agencyName => {
          const agencyBills = creditBills.filter(b => b.agencyName === agencyName);
          const agencyId = agencyBills[0]?.agencyId;
          const paidBills = agencyBills.filter(b => b.status === 'paid');
          const pendingBills = agencyBills.filter(b => b.status === 'pending');
          const totalAmount = agencyBills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
          const collectedAmount = collections
            .filter(c => c.agencyId === agencyId)
            .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
          
          return (
            <div key={agencyName} className="bg-white p-6 rounded-xl shadow-md">
              <h3 className="text-xl font-bold text-gray-800 mb-4">{agencyName}</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Bills</span>
                  <span className="font-bold text-gray-800">{agencyBills.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Paid</span>
                  <span className="font-bold text-green-600">{paidBills.length}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Pending</span>
                  <span className="font-bold text-yellow-600">{pendingBills.length}</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Total Amount</span>
                    <span className="font-bold text-gray-800">Rs. {totalAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Collected</span>
                    <span className="font-bold text-green-600">Rs. {collectedAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-gray-600">Outstanding</span>
                    <span className="font-bold text-red-600">Rs. {(totalAmount - collectedAmount).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Detailed Reports */}
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Paid Bills Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-green-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Agency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Bill Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Created By</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {creditBills.filter(b => b.status === 'paid').map(bill => (
                <tr key={bill._id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm text-gray-900">{bill.agencyName}</td>
                  <td className="px-4 py-3 text-sm text-gray-900">{bill.customerName}</td>
                  <td className="px-4 py-3 text-sm font-semibold text-green-600">Rs. {parseFloat(bill.amount).toFixed(2)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{bill.route}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(bill.billDate)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{bill.createdByUsername}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Ongoing Bills Report</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-yellow-100">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Agency</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Customer</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Amount</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Route</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Due Date</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Days Overdue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {creditBills.filter(b => b.status === 'pending').map(bill => {
                const daysOverdue = Math.floor((new Date() - new Date(bill.dueDate)) / (1000 * 60 * 60 * 24));
                return (
                  <tr key={bill._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm text-gray-900">{bill.agencyName}</td>
                    <td className="px-4 py-3 text-sm text-gray-900">{bill.customerName}</td>
                    <td className="px-4 py-3 text-sm font-semibold text-yellow-600">Rs. {parseFloat(bill.amount).toFixed(2)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{bill.route}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(bill.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        daysOverdue > 0 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {daysOverdue > 0 ? `${daysOverdue} days overdue` : 'Not overdue'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Reports;
