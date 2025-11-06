// Format date to readable format (DD/MM/YYYY)
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return '-';
  
  // Format as DD/MM/YYYY
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
};

// Get today's date in YYYY-MM-DD format (for input default values)
export const getTodayDate = () => {
  return new Date().toISOString().split('T')[0];
};
