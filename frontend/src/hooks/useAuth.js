import { useState } from 'react';
import { authAPI } from '../services/api';

export const useAuth = (showNotification, setCurrentUser, setSelectedAgency, fetchData) => {
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e, loginForm) => {
    e.preventDefault();
    setLoading(true);
    showNotification('Please wait, logging in...', 'loading');
    
    try {
      const response = await authAPI.login(loginForm);
      const userData = response.data;
      
      localStorage.setItem('token', userData.token);
      localStorage.setItem('user', JSON.stringify(userData));
      
      setCurrentUser(userData);
      if (userData.agencyId) {
        setSelectedAgency({
          id: userData.agencyId,
          name: userData.agencyName,
          routes: userData.routes
        });
      }
      
      await fetchData();
      showNotification('Login successful!', 'success');
    } catch (error) {
      console.error('Login error:', error);
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showNotification(errorMessage, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e, signupForm, setShowSignup, resetSignupForm) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    if (signupForm.role === 'user' && (!signupForm.agencyName || signupForm.routes.filter(r => r.trim()).length === 0)) {
      showNotification('Agency name and at least one route are required!', 'warning');
      return;
    }

    setLoading(true);
    showNotification('Creating your account...', 'loading');
    
    try {
      const payload = {
        username: signupForm.username,
        email: signupForm.email,
        password: signupForm.password,
        role: signupForm.role,
      };

      if (signupForm.role === 'user') {
        payload.agencyName = signupForm.agencyName;
        payload.routes = signupForm.routes.filter(r => r.trim());
      }

      const response = await authAPI.register(payload);
      showNotification('Registration successful! Please login to continue.', 'success', 5000);
      setShowSignup(false);
      resetSignupForm();
    } catch (error) {
      console.error('Signup error:', error);
      let errorMessage = 'Registration failed. Please try again.';
      
      if (error.response) {
        errorMessage = error.response.data?.message || error.response.data?.error || errorMessage;
        
        if (error.response.data?.errors && Array.isArray(error.response.data.errors)) {
          errorMessage = error.response.data.errors.map(err => err.msg).join(', ');
        }
      } else if (error.request) {
        errorMessage = 'Cannot connect to server. Please check your connection.';
      } else {
        errorMessage = error.message || errorMessage;
      }
      
      showNotification(errorMessage, 'error', 6000);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async (setLoginForm, setActiveView, setCreditBills, setCheques, setCollections) => {
    setLoading(true);
    showNotification('Logging out...', 'loading');
    
    await new Promise(resolve => setTimeout(resolve, 600));
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
    setActiveView('dashboard');
    setCreditBills([]);
    setCheques([]);
    setCollections([]);
    setLoading(false);
    showNotification('Logged out successfully!', 'success');
  };

  return { loading, handleLogin, handleSignup, handleLogout };
};
