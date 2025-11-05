import React, { useState, useEffect } from 'react';
import { LogOut } from 'lucide-react';
import { authAPI, billsAPI, chequesAPI, collectionsAPI } from './services/api';
import Dashboard from './components/Dashboard';
import SignupLogin from './components/SignupLogin';
import Creditbills from './components/Creditbills';
import Cheques from './components/Cheques';
import Collection from './components/Collection';
import ViewBills from './components/ViewBills';
import Reports from './components/Reports';

const AgencyCreditSystem = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [creditBills, setCreditBills] = useState([]);
  const [cheques, setCheques] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [showSignup, setShowSignup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState(null);

  // Show notification
  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  // Format date to readable format (YYYY-MM-DD or DD/MM/YYYY)
  const formatDate = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '-';
    
    // Format as DD/MM/YYYY
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year}`;
  };

  // Simple notification component (top-right toast)
  const Notification = () => {
    if (!notification) return null;
    const bgColor = notification.type === 'success' ? 'bg-green-500' : 'bg-red-500';
    const icon = notification.type === 'success' ? '✓' : '✕';
    
    return (
      <div className="fixed top-6 right-6 animate-slide-in" style={{ zIndex: 9999 }}>
        <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl max-w-md min-w-[300px] flex items-center gap-3 border-2 border-white/20`}>
          <span className="text-2xl font-bold">{icon}</span>
          <span className="font-medium text-sm leading-relaxed">{notification.message}</span>
        </div>
      </div>
    );
  };

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [signupForm, setSignupForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'user',
    agencyName: '',
    routes: ['']
  });

  // Load user from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      const parsedUser = JSON.parse(user);
      setCurrentUser(parsedUser);
      if (parsedUser.agencyId) {
        setSelectedAgency({
          id: parsedUser.agencyId,
          name: parsedUser.agencyName,
          routes: parsedUser.routes
        });
      }
      fetchData();
    }
  }, []);

  // Fetch all data
  const fetchData = async () => {
    try {
      const [billsRes, chequesRes, collectionsRes] = await Promise.all([
        billsAPI.getAll(),
        chequesAPI.getAll(),
        collectionsAPI.getAll()
      ]);
      setCreditBills(billsRes.data);
      setCheques(chequesRes.data);
      setCollections(collectionsRes.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification('Please wait, logging in...', 'success');
    
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
      showNotification('Login successful! Welcome back!', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (signupForm.password !== signupForm.confirmPassword) {
      showNotification('Passwords do not match!', 'error');
      return;
    }

    if (signupForm.role === 'user' && (!signupForm.agencyName || signupForm.routes.filter(r => r.trim()).length === 0)) {
      showNotification('Agency name and at least one route are required for users!', 'error');
      return;
    }

    setLoading(true);
    showNotification('Creating your account...', 'success');
    
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
      showNotification('Registration successful! Please login.', 'success');
      setShowSignup(false);
      setSignupForm({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'user',
        agencyName: '',
        routes: ['']
      });
    } catch (error) {
      showNotification(error.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    showNotification('Logging out...', 'success');
    
    // Simulate a brief logout process for better UX
    await new Promise(resolve => setTimeout(resolve, 800));
    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentUser(null);
    setLoginForm({ email: '', password: '' });
    setActiveView('dashboard');
    setCreditBills([]);
    setCheques([]);
    setCollections([]);
    setLoading(false);
  };

  // Add route input for signup
  const addRouteField = () => {
    setSignupForm({ ...signupForm, routes: [...signupForm.routes, ''] });
  };

  const removeRouteField = (index) => {
    const newRoutes = signupForm.routes.filter((_, i) => i !== index);
    setSignupForm({ ...signupForm, routes: newRoutes });
  };

  const updateRoute = (index, value) => {
    const newRoutes = [...signupForm.routes];
    newRoutes[index] = value;
    setSignupForm({ ...signupForm, routes: newRoutes });
  };

  // Add Credit Bill
  const [billForm, setBillForm] = useState({
    invoiceNumber: '',
    customerName: '',
    amount: '',
    route: '',
    billDate: new Date().toISOString().split('T')[0],
    dueDate: '',
    status: 'pending'
  });

  const handleAddBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification('Adding credit bill...', 'success');
    
    try {
      const billData = {
        invoiceNumber: billForm.invoiceNumber,
        customerName: billForm.customerName,
        amount: parseFloat(billForm.amount),
        route: billForm.route,
        billDate: billForm.billDate
      };

      const response = await billsAPI.create(billData);
      setCreditBills([response.data, ...creditBills]);
      
      setBillForm({
        invoiceNumber: '',
        customerName: '',
        amount: '',
        route: '',
        billDate: new Date().toISOString().split('T')[0],
        dueDate: '',
        status: 'pending'
      });
      
      showNotification('Credit bill added successfully!', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to add bill', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Cheque
  const [chequeForm, setChequeForm] = useState({
    chequeNumber: '',
    amount: '',
    bankName: '',
    customerName: '',
    route: '',
    chequeDate: new Date().toISOString().split('T')[0],
    status: 'pending'
  });

  const handleAddCheque = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification('Adding cheque...', 'success');
    
    try {
      const chequeData = {
        chequeNumber: chequeForm.chequeNumber,
        amount: parseFloat(chequeForm.amount),
        bankName: chequeForm.bankName,
        customerName: chequeForm.customerName,
        route: chequeForm.route,
        chequeDate: chequeForm.chequeDate
      };

      const response = await chequesAPI.create(chequeData);
      setCheques([response.data, ...cheques]);
      
      setChequeForm({
        chequeNumber: '',
        amount: '',
        bankName: '',
        customerName: '',
        route: '',
        chequeDate: new Date().toISOString().split('T')[0],
        status: 'pending'
      });
      
      showNotification('Cheque added successfully! ✓', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to add cheque', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Add Collection
  const [collectionForm, setCollectionForm] = useState({
    invoiceNumber: '',
    billId: '',
    customerName: '',
    billAmount: '',
    amount: '',
    paymentMethod: 'cash',
    route: '',
    collectionDate: new Date().toISOString().split('T')[0],
    notes: ''
  });
  const [matchingBills, setMatchingBills] = useState([]);

  // Handle invoice number input and find matching bills
  const handleInvoiceNumberChange = (invoiceNumber) => {
    setCollectionForm({
      ...collectionForm,
      invoiceNumber,
      billId: '',
      customerName: '',
      billAmount: '',
      route: ''
    });
    
    if (invoiceNumber.trim()) {
      const matches = creditBills.filter(
        b => b.invoiceNumber === invoiceNumber && 
        b.agencyId === selectedAgency?.id &&
        getBillBalance(b._id) > 0
      );
      
      setMatchingBills(matches);
      
      // If only one match, auto-select it
      if (matches.length === 1) {
        const bill = matches[0];
        setCollectionForm({
          ...collectionForm,
          invoiceNumber,
          billId: String(bill._id),
          customerName: bill.customerName,
          billAmount: bill.amount,
          route: bill.route
        });
      }
    } else {
      setMatchingBills([]);
    }
  };

  // Handle bill selection when multiple bills have same invoice number
  const handleBillSelection = (billId) => {
    const selectedBill = matchingBills.find(b => b._id === billId);
    if (selectedBill) {
      setCollectionForm({
        ...collectionForm,
        billId: String(selectedBill._id),
        customerName: selectedBill.customerName,
        billAmount: selectedBill.amount,
        route: selectedBill.route
      });
    }
  };

  const handleAddCollection = async (e) => {
    e.preventDefault();
    
    if (!collectionForm.billId) {
      showNotification('Invalid invoice number or bill not found!', 'error');
      return;
    }

    setLoading(true);
    showNotification('Processing collection...', 'success');
    
    try {
      const collectionData = {
        invoiceNumber: collectionForm.invoiceNumber,
        billId: collectionForm.billId,
        customerName: collectionForm.customerName,
        billAmount: parseFloat(collectionForm.billAmount),
        amount: parseFloat(collectionForm.amount),
        paymentMethod: collectionForm.paymentMethod,
        route: collectionForm.route,
        collectionDate: collectionForm.collectionDate,
        notes: collectionForm.notes
      };

      const response = await collectionsAPI.create(collectionData);
      setCollections([response.data, ...collections]);
      
      // Refresh bills to update status
      await fetchData();
      
      setCollectionForm({
        invoiceNumber: '',
        billId: '',
        customerName: '',
        billAmount: '',
        amount: '',
        paymentMethod: 'cash',
        route: '',
        collectionDate: new Date().toISOString().split('T')[0],
        notes: ''
      });
      setMatchingBills([]);
      
      showNotification('Collection added successfully! ✓', 'success');
    } catch (error) {
      showNotification(error.response?.data?.message || 'Failed to add collection', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Calculate bill balance
  const getBillBalance = (billId) => {
    const bill = creditBills.find(b => b._id === billId);
    if (!bill) return 0;
    
    const totalCollected = collections
      .filter(c => c.billId === String(billId))
      .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
    
    return parseFloat(bill.amount || 0) - totalCollected;
  };

  // Calculate total collected for a bill
  const getTotalCollected = (billId) => {
    return collections
      .filter(c => c.billId === String(billId))
      .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
  };

  // Calculate statistics
  const getStats = () => {
    const userBills = currentUser?.role === 'admin' 
      ? creditBills 
      : creditBills.filter(b => b.agencyId === currentUser?.agencyId);
    
    const totalBills = userBills.length;
    const paidBills = userBills.filter(b => b.status === 'paid').length;
    const pendingBills = userBills.filter(b => b.status === 'pending').length;
    const totalAmount = userBills.reduce((sum, b) => sum + parseFloat(b.amount || 0), 0);
    const collectedAmount = collections
      .filter(c => currentUser?.role === 'admin' || c.agencyId === currentUser?.agencyId)
      .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);

    return { totalBills, paidBills, pendingBills, totalAmount, collectedAmount };
  };

  // Render Login/Signup Screen
  if (!currentUser) {
    return (
      <SignupLogin
        showSignup={showSignup}
        setShowSignup={setShowSignup}
        loginForm={loginForm}
        setLoginForm={setLoginForm}
        signupForm={signupForm}
        setSignupForm={setSignupForm}
        handleLogin={handleLogin}
        handleSignup={handleSignup}
        loading={loading}
        addRouteField={addRouteField}
        removeRouteField={removeRouteField}
        updateRoute={updateRoute}
        notification={notification}
        Notification={Notification}
      />
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-gray-50">
      {notification && <Notification />}
      {/* Header */}
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

      {/* Navigation */}
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

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Dashboard */}
        {activeView === 'dashboard' && (
          <Dashboard stats={stats} collections={collections} currentUser={currentUser} />
        )}

        {/* Add Credit Bill */}
        {activeView === 'addBill' && currentUser.role === 'user' && (
          <Creditbills
            billForm={billForm}
            setBillForm={setBillForm}
            handleAddBill={handleAddBill}
            selectedAgency={selectedAgency}
            loading={loading}
          />
        )}

        {/* Add Cheque */}
        {activeView === 'addCheque' && currentUser.role === 'user' && (
          <Cheques
            chequeForm={chequeForm}
            setChequeForm={setChequeForm}
            handleAddCheque={handleAddCheque}
            selectedAgency={selectedAgency}
            loading={loading}
          />
        )}

        {/* Add Collection */}
        {activeView === 'addCollection' && currentUser.role === 'user' && (
          <Collection
            collectionForm={collectionForm}
            setCollectionForm={setCollectionForm}
            handleAddCollection={handleAddCollection}
            handleInvoiceNumberChange={handleInvoiceNumberChange}
            handleBillSelection={handleBillSelection}
            matchingBills={matchingBills}
            getBillBalance={getBillBalance}
            loading={loading}
          />
        )}

        {/* View Bills */}
        {activeView === 'viewBills' && (
          <ViewBills
            creditBills={creditBills}
            cheques={cheques}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            getTotalCollected={getTotalCollected}
            getBillBalance={getBillBalance}
            formatDate={formatDate}
            currentUser={currentUser}
            selectedAgency={selectedAgency}
          />
        )}

        {/* Admin Reports */}
        {activeView === 'reports' && currentUser.role === 'admin' && (
          <Reports
            creditBills={creditBills}
            collections={collections}
            formatDate={formatDate}
          />
        )}
      </div>
    </div>
  );
};

export default AgencyCreditSystem;