import React from 'react';
import { Plus } from 'lucide-react';

const Collection = ({ 
  collectionForm, 
  setCollectionForm, 
  handleAddCollection,
  handleInvoiceNumberChange,
  handleBillSelection,
  matchingBills,
  getBillBalance
}) => {
  return (
    <div className="bg-white p-8 rounded-xl shadow-md max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Add Collection</h2>
      <form onSubmit={handleAddCollection} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Invoice Number</label>
          <input
            type="text"
            value={collectionForm.invoiceNumber}
            onChange={(e) => handleInvoiceNumberChange(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            placeholder="Enter invoice number (e.g., INV-001)"
            required
          />
          {collectionForm.invoiceNumber && matchingBills.length === 0 && (
            <p className="text-xs text-red-500 mt-1">Invoice number not found or bill already paid</p>
          )}
          {matchingBills.length === 1 && collectionForm.billId && (
            <p className="text-xs text-green-600 mt-1">✓ Bill found</p>
          )}
          {matchingBills.length > 1 && (
            <p className="text-xs text-blue-600 mt-1">⚠ Multiple bills found with this invoice number. Please select one below.</p>
          )}
        </div>

        {/* Show selection dropdown when multiple bills found */}
        {matchingBills.length > 1 && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Select Bill (Multiple Routes Found)</label>
            <select
              value={collectionForm.billId}
              onChange={(e) => handleBillSelection(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 bg-yellow-50"
              required
            >
              <option value="">Select a route...</option>
              {matchingBills.map(bill => (
                <option key={bill._id} value={bill._id}>
                  {bill.customerName} - {bill.route} - Rs. {parseFloat(bill.amount).toFixed(2)} (Balance: Rs. {getBillBalance(bill._id).toFixed(2)})
                </option>
              ))}
            </select>
          </div>
        )}

        {collectionForm.billId && (
          <>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <h3 className="text-sm font-semibold text-gray-700 mb-2">Bill Details</h3>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-gray-600">Customer:</span>
                  <span className="ml-2 font-medium text-gray-900">{collectionForm.customerName}</span>
                </div>
                <div>
                  <span className="text-gray-600">Route:</span>
                  <span className="ml-2 font-medium text-gray-900">{collectionForm.route}</span>
                </div>
                <div>
                  <span className="text-gray-600">Bill Amount:</span>
                  <span className="ml-2 font-medium text-gray-900">Rs. {parseFloat(collectionForm.billAmount).toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-gray-600">Balance:</span>
                  <span className="ml-2 font-semibold text-red-600">Rs. {getBillBalance(collectionForm.billId).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </>
        )}
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Collection Amount (Rs.)</label>
            <input
              type="number"
              step="0.01"
              value={collectionForm.amount}
              onChange={(e) => setCollectionForm({...collectionForm, amount: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={!collectionForm.billId}
              required
            />
            {collectionForm.billId && parseFloat(collectionForm.amount) > getBillBalance(collectionForm.billId) && (
              <p className="text-xs text-amber-600 mt-1">⚠ Amount exceeds bill balance</p>
            )}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
            <select
              value={collectionForm.paymentMethod}
              onChange={(e) => setCollectionForm({...collectionForm, paymentMethod: e.target.value})}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
              disabled={!collectionForm.billId}
              required
            >
              <option value="cash">Cash</option>
              <option value="cheque">Cheque</option>
              <option value="bank_transfer">Bank Transfer</option>
            </select>
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Collection Date</label>
          <input
            type="date"
            value={collectionForm.collectionDate}
            onChange={(e) => setCollectionForm({...collectionForm, collectionDate: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            disabled={!collectionForm.billId}
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            value={collectionForm.notes}
            onChange={(e) => setCollectionForm({...collectionForm, notes: e.target.value})}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
            rows="3"
            disabled={!collectionForm.billId}
            placeholder="Optional notes about this collection"
          />
        </div>
        
        <button
          type="submit"
          disabled={!collectionForm.billId}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition flex items-center justify-center gap-2 disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Collection
        </button>
      </form>
    </div>
  );
};

export default Collection;