import { useState } from 'react';
import { chequesAPI } from '../services/api';
import { getTodayDate } from '../utils/dateUtils';

export const useCheques = (showNotification, cheques, setCheques) => {
  const [loading, setLoading] = useState(false);
  const [chequeForm, setChequeForm] = useState({
    chequeNumber: '',
    amount: '',
    bankName: '',
    customerName: '',
    route: '',
    chequeDate: getTodayDate(),
    status: 'pending'
  });

  const handleAddCheque = async (e) => {
    e.preventDefault();
    setLoading(true);
    showNotification('Adding cheque...', 'loading');
    
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
        chequeDate: getTodayDate(),
        status: 'pending'
      });
      
      showNotification(`✓ Cheque added successfully! Cheque #${chequeData.chequeNumber}`, 'success');
    } catch (error) {
      console.error('Add cheque error:', error);
      let errorMessage = 'Failed to add cheque. Please try again.';
      
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

  return { loading, chequeForm, setChequeForm, handleAddCheque };
};
