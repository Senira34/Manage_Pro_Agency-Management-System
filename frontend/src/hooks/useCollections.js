import { useState } from 'react';
import { collectionsAPI } from '../services/api';
import { getTodayDate } from '../utils/dateUtils';
import { getBillBalance } from '../utils/billCalculations';

export const useCollections = (showNotification, creditBills, collections, setCollections, selectedAgency, fetchData) => {
  const [loading, setLoading] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    invoiceNumber: '',
    billId: '',
    customerName: '',
    billAmount: '',
    amount: '',
    paymentMethod: 'cash',
    route: '',
    collectionDate: getTodayDate(),
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
        getBillBalance(b._id, creditBills, collections) > 0
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
      showNotification('Please select a valid invoice number!', 'warning');
      return;
    }

    const collectionAmount = parseFloat(collectionForm.amount);
    const billBalance = getBillBalance(collectionForm.billId, creditBills, collections);
    
    if (collectionAmount > billBalance) {
      showNotification(`Collection amount (Rs. ${collectionAmount.toFixed(2)}) exceeds bill balance (Rs. ${billBalance.toFixed(2)})!`, 'warning');
      return;
    }

    setLoading(true);
    showNotification('Processing collection...', 'loading');
    
    try {
      const collectionData = {
        invoiceNumber: collectionForm.invoiceNumber,
        billId: collectionForm.billId,
        customerName: collectionForm.customerName,
        billAmount: parseFloat(collectionForm.billAmount),
        amount: collectionAmount,
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
        collectionDate: getTodayDate(),
        notes: ''
      });
      setMatchingBills([]);
      
      showNotification(`Collection added successfully! `, 'success', 5000);
    } catch (error) {
      console.error('Add collection error:', error);
      let errorMessage = 'Failed to add collection. Please try again.';
      
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
      
      showNotification(errorMessage, 'error', 5000);
    } finally {
      setLoading(false);
    }
  };

  return { 
    loading, 
    collectionForm, 
    setCollectionForm, 
    matchingBills, 
    handleInvoiceNumberChange, 
    handleBillSelection, 
    handleAddCollection 
  };
};
