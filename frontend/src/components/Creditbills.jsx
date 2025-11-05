import React from 'react';
import { Plus } from 'lucide-react';

const Creditbills = ({ 
  billForm, 
  setBillForm, 
  handleAddBill, 
  selectedAgency 
}) => {
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
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              placeholder="INV-001"
              required
            />
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
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Credit Bill
        </button>
      </form>
    </div>
  );
};

export default Creditbills;
