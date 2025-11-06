import React from 'react';
import { LogOut } from 'lucide-react';

const Header = ({ currentUser, selectedAgency, handleLogout }) => {
  return (
    <div className="bg-indigo-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Agency Management System</h1>
            <p className="text-indigo-200 text-sm mt-1">
              {currentUser.role === 'admin' ? 'Admin Dashboard' : `${selectedAgency?.name} Agency`}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="font-semibold">{currentUser.username}</p>
              <p className="text-indigo-200 text-sm">{currentUser.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-indigo-700 hover:bg-indigo-800 p-2 rounded-lg transition"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
