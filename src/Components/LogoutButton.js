import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaSignOutAlt } from 'react-icons/fa';

const LogoutButton = ({ className = '', showText = true, variant = 'header' }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (variant === 'fab') {
    return (
      <button
        onClick={handleLogout}
        className={`fixed top-4 right-4 z-40 w-12 h-12 bg-primary hover:bg-red-600 text-white rounded-2xl flex items-center justify-center transition-all duration-200 shadow-card hover:shadow-card-hover ${className}`}
        title="Logout"
      >
        <FaSignOutAlt className="text-lg" />
      </button>
    );
  }

  if (variant === 'menu') {
    return (
      <button
        onClick={handleLogout}
        className={`flex items-center space-x-3 w-full px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-2xl transition-colors ${className}`}
      >
        <FaSignOutAlt className="text-lg" />
        {showText && <span className="font-medium">Logout</span>}
      </button>
    );
  }

  return (
    <button
      onClick={handleLogout}
      className={`flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-2xl transition-colors font-medium ${className}`}
    >
      <FaSignOutAlt className="text-sm" />
      {showText && <span>Logout</span>}
    </button>
  );
};

export default LogoutButton;