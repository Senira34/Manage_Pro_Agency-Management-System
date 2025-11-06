// Calculate bill balance (amount - total collected)
export const getBillBalance = (billId, creditBills, collections) => {
  const bill = creditBills.find(b => b._id === billId);
  if (!bill) return 0;
  
  const totalCollected = collections
    .filter(c => c.billId === String(billId))
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
  
  return parseFloat(bill.amount || 0) - totalCollected;
};

// Calculate total collected for a bill
export const getTotalCollected = (billId, collections) => {
  return collections
    .filter(c => c.billId === String(billId))
    .reduce((sum, c) => sum + parseFloat(c.amount || 0), 0);
};

// Calculate statistics for dashboard
export const getStats = (creditBills, collections, currentUser) => {
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
