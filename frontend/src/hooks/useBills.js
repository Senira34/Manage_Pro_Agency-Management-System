import { useState } from 'react';
import { billsAPI } from '../services/api';
import { getTodayDate } from '../utils/dateUtils';

export const useBills = (showNotification, creditBills, setCreditBills) => {
  const [loading, setLoading] = useState(false);
  const [billForm, setBillForm] = useState({
    invoiceNumber: '',
    customerName: '',
    amount: '',
    route: '',
    billDate: getTodayDate(),
    dueDate: '',
    status: 'pending'
  });

  const handleAddBill = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification('Adding credit bill...', 'loading');
    
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
        billDate: getTodayDate(),
        dueDate: '',
        status: 'pending'
      });
      
      showNotification(`✓ Credit bill added successfully! Invoice: ${billData.invoiceNumber}`, 'success');
    } catch (error) {
      console.error('Add bill error:', error);
      let errorMessage = 'Failed to add bill. Please try again.';
      
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

  return { loading, billForm, setBillForm, handleAddBill };
};
