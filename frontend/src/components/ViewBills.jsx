import React from 'react';

const ViewBills = ({ 
  currentUser, 
  creditBills, 
  cheques, 
  collections,
  selectedAgency,
  selectedRoute,
  setSelectedRoute,
  getTotalCollected,
  getBillBalance,
  formatDate
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800">Credit Bills</h2>
        
        {/* Route Filter */}
        <div className="flex items-center gap-3">
          <label className="text-sm font-medium text-gray-700">Filter by Route:</label>
          <select
            value={selectedRoute}
            onChange={(e) => setSelectedRoute(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-white"
          >
            <option value="all">All Routes</option>
            {currentUser.role === 'admin' 
              ? [...new Set(creditBills.map(b => b.route))].map(route => (
                  <option key={route} value={route}>{route}</option>
                ))
              : selectedAgency?.routes.map(route => (
                  <option key={route} value={route}>{route}</option>
                ))
            }
          </select>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">ID</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Invoice #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Bill Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Collected</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Balance</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Bill Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Due Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
                {currentUser.role === 'admin' && (
                  <th className="px-6 py-4 text-left text-sm font-semibold">Agency</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(currentUser.role === 'admin' ? creditBills : creditBills.filter(b => b.agencyId === selectedAgency?.id))
                .filter(b => selectedRoute === 'all' || b.route === selectedRoute)
                .map((bill, idx) => {
                  const collected = getTotalCollected(bill._id);
                  const balance = getBillBalance(bill._id);
                  const today = new Date();
                  const dueDate = new Date(bill.dueDate);
                  const isOverdue = balance > 0 && dueDate < today;
                  
                  return (
                    <tr key={bill._id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{idx + 1}</td>
                      <td className="px-6 py-4 text-sm font-medium text-indigo-600">{bill.invoiceNumber || '-'}</td>
                      <td className="px-6 py-4 text-sm text-gray-900">{bill.customerName}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rs. {parseFloat(bill.amount).toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-green-600">Rs. {collected.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-red-600">Rs. {balance.toFixed(2)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{bill.route}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(bill.billDate)}</td>
                      <td className="px-6 py-4 text-sm text-gray-700">{formatDate(bill.dueDate)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          balance <= 0
                            ? 'bg-green-100 text-green-800' 
                            : isOverdue
                            ? 'bg-red-100 text-red-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {balance <= 0 ? 'Paid' : isOverdue ? 'Overdue' : 'Pending'}
                        </span>
                      </td>
                      {currentUser.role === 'admin' && (
                        <td className="px-6 py-4 text-sm text-gray-700">{bill.agencyName}</td>
                      )}
                    </tr>
                  );
                })}
              {(currentUser.role === 'admin' ? creditBills : creditBills.filter(b => b.agencyId === selectedAgency?.id))
                .filter(b => selectedRoute === 'all' || b.route === selectedRoute).length === 0 && (
                <tr>
                  <td colSpan={currentUser.role === 'admin' ? 11 : 10} className="px-6 py-8 text-center text-gray-500">
                    No credit bills found {selectedRoute !== 'all' && `for route: ${selectedRoute}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      <div className="flex justify-between items-center mt-8">
        <h2 className="text-2xl font-bold text-gray-800">Cheques</h2>
      </div>
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold">Cheque #</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Customer</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Bank</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Route</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Date</th>
                <th className="px-6 py-4 text-left text-sm font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {(currentUser.role === 'admin' ? cheques : cheques.filter(c => c.agencyId === selectedAgency?.id))
                .filter(c => selectedRoute === 'all' || c.route === selectedRoute)
                .map((cheque) => (
                  <tr key={cheque._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{cheque.chequeNumber}</td>
                    <td className="px-6 py-4 text-sm text-gray-900">{cheque.customerName}</td>
                    <td className="px-6 py-4 text-sm font-semibold text-gray-900">Rs. {parseFloat(cheque.amount).toFixed(2)}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cheque.bankName}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{cheque.route}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{formatDate(cheque.chequeDate)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        cheque.status === 'cleared' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {cheque.status === 'cleared' ? 'Cleared' : 'Pending'}
                      </span>
                    </td>
                  </tr>
                ))}
              {(currentUser.role === 'admin' ? cheques : cheques.filter(c => c.agencyId === selectedAgency?.id))
                .filter(c => selectedRoute === 'all' || c.route === selectedRoute).length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No cheques found {selectedRoute !== 'all' && `for route: ${selectedRoute}`}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ViewBills;
