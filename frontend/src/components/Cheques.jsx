import React from 'react';
import { Plus } from 'lucide-react';

const Cheques = ({ 
  chequeForm, 
  setChequeForm, 
  handleAddCheque, 
  selectedAgency 
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Cheque</h2>
      <form onSubmit={handleAddCheque} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cheque Number</label>
            <input
              type="text"
              value={chequeForm.chequeNumber}
              onChange={(e) => setChequeForm({...chequeForm, chequeNumber: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Amount (Rs.)</label>
            <input
              type="number"
              step="0.01"
              value={chequeForm.amount}
              onChange={(e) => setChequeForm({...chequeForm, amount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Bank Name</label>
          <input
            type="text"
            value={chequeForm.bankName}
            onChange={(e) => setChequeForm({...chequeForm, bankName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
          <input
            type="text"
            value={chequeForm.customerName}
            onChange={(e) => setChequeForm({...chequeForm, customerName: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Route</label>
            <select
              value={chequeForm.route}
              onChange={(e) => setChequeForm({...chequeForm, route: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            >
              <option value="">Select Route</option>
              {selectedAgency?.routes.map(route => (
                <option key={route} value={route}>{route}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Cheque Date</label>
            <input
              type="date"
              value={chequeForm.chequeDate}
              onChange={(e) => setChequeForm({...chequeForm, chequeDate: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2"
        >
          <Plus size={20} />
          Add Cheque
        </button>
      </form>
    </div>
  );
};

export default Cheques;
