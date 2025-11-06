import React from 'react';

const Navigation = ({ activeView, setActiveView, currentUser }) => {
  return (
    <div className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex gap-1 overflow-x-auto py-2">
          <button
            onClick={() => setActiveView('dashboard')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeView === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            Dashboard
          </button>
          {currentUser.role === 'user' && (
            <>
              <button
                onClick={() => setActiveView('addBill')}
                className={`px-6 py-2 rounded-lg font-medium transition ${activeView === 'addBill' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Add Credit Bill
              </button>
              <button
                onClick={() => setActiveView('addCheque')}
                className={`px-6 py-2 rounded-lg font-medium transition ${activeView === 'addCheque' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Add Cheque
              </button>
              <button
                onClick={() => setActiveView('addCollection')}
                className={`px-6 py-2 rounded-lg font-medium transition ${activeView === 'addCollection' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
              >
                Add Collection
              </button>
            </>
          )}
          <button
            onClick={() => setActiveView('viewBills')}
            className={`px-6 py-2 rounded-lg font-medium transition ${activeView === 'viewBills' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            View Bills
          </button>
          {currentUser.role === 'admin' && (
            <button
              onClick={() => setActiveView('reports')}
              className={`px-6 py-2 rounded-lg font-medium transition ${activeView === 'reports' ? 'bg-indigo-600 text-white' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Reports
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Navigation;
