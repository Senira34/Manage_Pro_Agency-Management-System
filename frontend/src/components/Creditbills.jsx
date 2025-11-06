import React, { useMemo } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';

const Creditbills = ({ 
  billForm, 
  setBillForm, 
  handleAddBill, 
  selectedAgency,
  creditBills 
}) => {
  // Check if invoice number + route combination already exists
  const isDuplicateInvoice = useMemo(() => {
    if (!billForm.invoiceNumber || !billForm.route) return false;
    
    return creditBills.some(bill => 
      bill.invoiceNumber === billForm.invoiceNumber && 
      bill.route === billForm.route &&
      bill.agencyId === selectedAgency?.id
    );
  }, [billForm.invoiceNumber, billForm.route, creditBills, selectedAgency]);

  // Check if invoice exists in OTHER routes (informational)
  const existsInOtherRoutes = useMemo(() => {
    if (!billForm.invoiceNumber) return [];
    
    return creditBills
      .filter(bill => 
        bill.invoiceNumber === billForm.invoiceNumber && 
        bill.route !== billForm.route &&
        bill.agencyId === selectedAgency?.id
      )
      .map(bill => bill.route);
  }, [billForm.invoiceNumber, billForm.route, creditBills, selectedAgency]);

  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Credit Bill</h2>
      <form onSubmit={handleAddBill} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
            <input
              type="text"
              value={billForm.invoiceNumber}
              onChange={(e) => setBillForm({...billForm, invoiceNumber: e.target.value})}
              className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                isDuplicateInvoice ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="INV-001"
              required
            />
            {isDuplicateInvoice && (
              <div className="mt-2 flex items-start gap-2 text-red-600 text-xs">
                <AlertTriangle size={14} className="mt-0.5 shrink-0" />
                <span>
                  This invoice number already exists in <strong>{billForm.route}</strong> route. 
                  Please use a different invoice number.
                </span>
              </div>
            )}
            {!isDuplicateInvoice && existsInOtherRoutes.length > 0 && (
              <div className="mt-2 flex items-start gap-2 text-blue-600 text-xs">
                <span>ℹ️</span>
                <span>
                  This invoice exists in: <strong>{existsInOtherRoutes.join(', ')}</strong>. 
                  You can still add it to <strong>{billForm.route}</strong>.
                </span>
              </div>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              value={billForm.customerName}
              onChange={(e) => setBillForm({...billForm, customerName: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
            <input
              type="number"
              step="0.01"
              value={billForm.amount}
              onChange={(e) => setBillForm({...billForm, amount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              value={billForm.route}
              onChange={(e) => setBillForm({...billForm, route: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Route</option>
              {selectedAgency?.routes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bill Date</label>
          <input
            type="date"
            value={billForm.billDate}
            onChange={(e) => setBillForm({...billForm, billDate: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Due date will be automatically set to 30 days from bill date</p>
        </div>
        
        <button
          type="submit"
          disabled={isDuplicateInvoice}
          className={`w-full py-3 rounded-lg font-semibold transition flex items-center justify-center gap-2 ${
            isDuplicateInvoice 
              ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700'
          }`}
        >
          <Plus size={20} />
          Add Credit Bill
        </button>
      </form>
    </div>
  );
};

export default Creditbills;
