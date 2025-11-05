import React from 'react';
import { FileText, CheckCircle, Clock, DollarSign } from 'lucide-react';

const Dashboard = ({ stats }) => {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800">Dashboard Overview</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-blue-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Bills</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.totalBills}</p>
            </div>
            <FileText className="text-blue-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Paid Bills</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.paidBills}</p>
            </div>
            <CheckCircle className="text-green-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-yellow-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Pending Bills</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingBills}</p>
            </div>
            <Clock className="text-yellow-500" size={40} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-xl shadow-md border-l-4 border-indigo-500">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 text-sm">Total Amount</p>
              <p className="text-3xl font-bold text-gray-800 mt-2">Rs. {stats.totalAmount.toFixed(2)}</p>
            </div>
            <DollarSign className="text-indigo-500" size={40} />
          </div>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-md">
        <h3 className="text-xl font-bold text-gray-800 mb-4">Collection Summary</h3>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">Total Collected</span>
            <span className="text-2xl font-bold text-green-600">Rs. {stats.collectedAmount.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
            <span className="text-gray-700 font-medium">Outstanding</span>
            <span className="text-2xl font-bold text-red-600">Rs. {(stats.totalAmount - stats.collectedAmount).toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
