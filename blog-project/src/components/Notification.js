import React, { useEffect } from 'react';
import './styles.css'; // Add styles for the notification

const Notification = ({ message, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(); // Automatically close the notification after 3 seconds
    }, 3000);

    return () => clearTimeout(timer); // Cleanup timer
  }, [onClose]);

  return (
    <div className="notification-overlay">
      <div className="notification-box">
        <p>{message}</p>
      </div>
    </div>
  );
};

export default Notification;