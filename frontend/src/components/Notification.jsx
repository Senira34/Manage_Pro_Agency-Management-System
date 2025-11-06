import React from 'react';

const Notification = ({ notification }) => {
  if (!notification) return null;
  
  let bgColor, icon, iconBg;
  switch (notification.type) {
    case 'success':
      bgColor = 'bg-green-500';
      iconBg = 'bg-green-600';
      icon = '✓';
      break;
    case 'error':
      bgColor = 'bg-red-500';
      iconBg = 'bg-red-600';
      icon = '✕';
      break;
    case 'loading':
      bgColor = 'bg-blue-500';
      iconBg = 'bg-blue-600';
      icon = '⟳';
      break;
    case 'warning':
      bgColor = 'bg-yellow-500';
      iconBg = 'bg-yellow-600';
      icon = '⚠';
      break;
    default:
      bgColor = 'bg-gray-500';
      iconBg = 'bg-gray-600';
      icon = 'ℹ';
  }
  
  return (
    <div className="fixed top-6 right-6 animate-slide-in" style={{ zIndex: 9999 }}>
      <div className={`${bgColor} text-white px-6 py-4 rounded-lg shadow-2xl max-w-md min-w-[300px] flex items-center gap-3`}>
        <div className={`${iconBg} w-8 h-8 rounded-full flex items-center justify-center shrink-0`}>
          <span className={`text-xl font-bold ${notification.type === 'loading' ? 'animate-spin' : ''}`}>
            {icon}
          </span>
        </div>
        <span className="font-medium text-sm leading-relaxed flex-1">{notification.message}</span>
      </div>
    </div>
  );
};

export default Notification;
