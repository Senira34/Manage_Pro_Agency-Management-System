import React, { useState, useEffect } from 'react';
import { billsAPI, chequesAPI, collectionsAPI } from './services/api';
import { formatDate } from './utils/dateUtils';
import { getBillBalance, getTotalCollected, getStats } from './utils/billCalculations';
import { useAuth } from './hooks/useAuth';
import { useBills } from './hooks/useBills';
import { useCheques } from './hooks/useCheques';
import { useCollections } from './hooks/useCollections';
import Notification from './components/Notification';
import Header from './components/Header';
import Navigation from './components/Navigation';
import Dashboard from './components/Dashboard';
import SignupLogin from './components/SignupLogin';
import Creditbills from './components/Creditbills';
import Cheques from './components/Cheques';
import Collection from './components/Collection';
import ViewBills from './components/ViewBills';
import Reports from './components/Reports';

const AgencyCreditSystem = () => {
  // State management
  const [currentUser, setCurrentUser] = useState(null);
  const [creditBills, setCreditBills] = useState([]);
  const [cheques, setCheques] = useState([]);
  const [collections, setCollections] = useState([]);
  const [activeView, setActiveView] = useState('dashboard');
  const [selectedAgency, setSelectedAgency] = useState(null);
  const [selectedRoute, setSelectedRoute] = useState('all');
  const [showSignup, setShowSignup] = useState(false);
  const [notification, setNotification] = useState(null);
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

  // Show notification with auto-dismiss
  const showNotification = (message, type = 'success', duration = 4000) => {
    setNotification(null);
    setTimeout(() => {
      setNotification({ message, type });
      if (type !== 'loading') {
        setTimeout(() => setNotification(null), duration);
      }
    }, 10);
  };

  // Fetch all data from API
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
      if (currentUser) {
        let errorMessage = 'Failed to load data.';
        if (error.response) {
          errorMessage = error.response.data?.message || errorMessage;
        } else if (error.request) {
          errorMessage = 'Cannot connect to server. Please check your connection.';
        }
        showNotification(errorMessage, 'error', 5000);
      }
    }
  };

  // Custom hooks for business logic
  const { loading: authLoading, handleLogin: authLogin, handleSignup: authSignup, handleLogout: authLogout } = useAuth(
    showNotification, 
    setCurrentUser, 
    setSelectedAgency, 
    fetchData
  );

  const { loading: billLoading, billForm, setBillForm, handleAddBill } = useBills(
    showNotification,
    creditBills,
    setCreditBills
  );

  const { loading: chequeLoading, chequeForm, setChequeForm, handleAddCheque } = useCheques(
    showNotification,
    cheques,
    setCheques
  );

  const {
    loading: collectionLoading,
    collectionForm,
    setCollectionForm,
    matchingBills,
    handleInvoiceNumberChange,
    handleBillSelection,
    handleAddCollection
  } = useCollections(
    showNotification,
    creditBills,
    collections,
    setCollections,
    selectedAgency,
    fetchData
  );

  // Load user from localStorage on mount
  useEffect(() => {
    // Clear localStorage on app start (remove these lines in production if you want persistent login)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
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

  // Signup form helpers
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

  const resetSignupForm = () => {
    setSignupForm({
      username: '',
      email: '',
      password: '',
      confirmPassword: '',
      role: 'user',
      agencyName: '',
      routes: ['']
    });
  };

  // Wrapper functions for handlers
  const handleLogin = (e) => authLogin(e, loginForm);
  const handleSignup = (e) => authSignup(e, signupForm, setShowSignup, resetSignupForm);
  const handleLogout = () => authLogout(setLoginForm, setActiveView, setCreditBills, setCheques, setCollections);

  // Render Login/Signup Screen
  if (!currentUser) {
    return (
      <>
        <Notification notification={notification} />
        <SignupLogin
          showSignup={showSignup}
          setShowSignup={setShowSignup}
          loginForm={loginForm}
          setLoginForm={setLoginForm}
          signupForm={signupForm}
          setSignupForm={setSignupForm}
          handleLogin={handleLogin}
          handleSignup={handleSignup}
          loading={authLoading}
          addRouteField={addRouteField}
          removeRouteField={removeRouteField}
          updateRoute={updateRoute}
        />
      </>
    );
  }

  // Calculate statistics
  const stats = getStats(creditBills, collections, currentUser);

  // Determine loading state
  const isLoading = authLoading || billLoading || chequeLoading || collectionLoading;

  return (
    <div className="min-h-screen bg-gray-50">
      <Notification notification={notification} />
      
      <Header 
        currentUser={currentUser} 
        selectedAgency={selectedAgency} 
        handleLogout={handleLogout} 
      />
      
      <Navigation 
        activeView={activeView} 
        setActiveView={setActiveView} 
        currentUser={currentUser} 
      />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {activeView === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            collections={collections} 
            currentUser={currentUser} 
          />
        )}

        {activeView === 'addBill' && currentUser.role === 'user' && (
          <Creditbills
            billForm={billForm}
            setBillForm={setBillForm}
            handleAddBill={handleAddBill}
            selectedAgency={selectedAgency}
            creditBills={creditBills}
            loading={isLoading}
          />
        )}

        {activeView === 'addCheque' && currentUser.role === 'user' && (
          <Cheques
            chequeForm={chequeForm}
            setChequeForm={setChequeForm}
            handleAddCheque={handleAddCheque}
            selectedAgency={selectedAgency}
            loading={isLoading}
          />
        )}

        {activeView === 'addCollection' && currentUser.role === 'user' && (
          <Collection
            collectionForm={collectionForm}
            setCollectionForm={setCollectionForm}
            handleAddCollection={handleAddCollection}
            handleInvoiceNumberChange={handleInvoiceNumberChange}
            handleBillSelection={handleBillSelection}
            matchingBills={matchingBills}
            getBillBalance={(billId) => getBillBalance(billId, creditBills, collections)}
            loading={isLoading}
          />
        )}

        {activeView === 'viewBills' && (
          <ViewBills
            creditBills={creditBills}
            cheques={cheques}
            selectedRoute={selectedRoute}
            setSelectedRoute={setSelectedRoute}
            getTotalCollected={(billId) => getTotalCollected(billId, collections)}
            getBillBalance={(billId) => getBillBalance(billId, creditBills, collections)}
            formatDate={formatDate}
            currentUser={currentUser}
            selectedAgency={selectedAgency}
          />
        )}

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
