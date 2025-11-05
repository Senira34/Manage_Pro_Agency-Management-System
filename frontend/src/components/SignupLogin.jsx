import React from 'react';
import { Users, UserPlus } from 'lucide-react';

const SignupLogin = ({ 
  showSignup, 
  setShowSignup, 
  loginForm, 
  setLoginForm, 
  signupForm, 
  setSignupForm,
  handleLogin, 
  handleSignup,
  loading,
  addRouteField,
  removeRouteField,
  updateRoute
}) => {
  
  // Signup Screen
  if (showSignup) {
    return (
      <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-2xl">
          <div className="text-center mb-8">
            <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserPlus className="text-white" size={32} />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Create Account</h1>
            <p className="text-gray-600 mt-2">Agency Management System</p>
          </div>
          
          <form onSubmit={handleSignup} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
                <input
                  type="text"
                  value={signupForm.username}
                  onChange={(e) => setSignupForm({...signupForm, username: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter username"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input
                  type="email"
                  value={signupForm.email}
                  onChange={(e) => setSignupForm({...signupForm, email: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter email"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
              <select
                value={signupForm.role}
                onChange={(e) => setSignupForm({...signupForm, role: e.target.value})}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                required
              >
                <option value="user">User (Agency)</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            {signupForm.role === 'user' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Agency Name</label>
                  <input
                    type="text"
                    value={signupForm.agencyName}
                    onChange={(e) => setSignupForm({...signupForm, agencyName: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter agency name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Routes</label>
                  {signupForm.routes.map((route, index) => (
                    <div key={index} className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={route}
                        onChange={(e) => updateRoute(index, e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder={`Route ${index + 1}`}
                        required
                      />
                      {signupForm.routes.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeRouteField(index)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={addRouteField}
                    className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                  >
                    + Add Another Route
                  </button>
                </div>
              </>
            )}
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <input
                  type="password"
                  value={signupForm.password}
                  onChange={(e) => setSignupForm({...signupForm, password: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Enter password"
                  minLength="6"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <input
                  type="password"
                  value={signupForm.confirmPassword}
                  onChange={(e) => setSignupForm({...signupForm, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Confirm password"
                  minLength="6"
                  required
                />
              </div>
            </div>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
            >
              {loading ? 'Creating Account...' : 'Sign Up'}
            </button>

            <div className="text-center mt-4">
              <button
                type="button"
                onClick={() => setShowSignup(false)}
                className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
              >
                Already have an account? Login
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Login Screen
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="bg-indigo-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-gray-800">Credit Management</h1>
          <p className="text-gray-600 mt-2">Agency Management System</p>
        </div>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              value={loginForm.email}
              onChange={(e) => setLoginForm({...loginForm, email: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter email"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input
              type="password"
              value={loginForm.password}
              onChange={(e) => setLoginForm({...loginForm, password: e.target.value})}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              placeholder="Enter password"
              required
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:bg-gray-400"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <div className="text-center mt-4">
            <button
              type="button"
              onClick={() => setShowSignup(true)}
              className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
            >
              Don't have an account? Sign Up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupLogin;
