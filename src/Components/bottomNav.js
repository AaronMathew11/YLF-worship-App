import React from 'react';
import { FaHome, FaList, FaRegEdit, FaChartBar } from 'react-icons/fa';
import { NavLink } from 'react-router-dom';

const BottomNav = () => {
  const isAdmin = true; // Temporarily set to true for dev

  return (
    <nav className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-primary rounded-full px-10 py-4 shadow-lg">
        <div className={`flex items-center ${isAdmin ? 'space-x-10' : 'space-x-16'}`}>
          <NavLink 
            to="/" 
            className={({ isActive }) =>
              `flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? "w-10 h-10 bg-white rounded-full" 
                  : "w-8 h-8"
              }`
            }
          >
            {({ isActive }) => (
              <FaHome className={`text-lg transition-colors duration-200 ${
                isActive ? "text-gray-900" : "text-white"
              }`} />
            )}
          </NavLink>
          
          <NavLink 
            to="/list" 
            className={({ isActive }) =>
              `flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? "w-10 h-10 bg-white rounded-full" 
                  : "w-8 h-8"
              }`
            }
          >
            {({ isActive }) => (
              <FaList className={`text-lg transition-colors duration-200 ${
                isActive ? "text-gray-900" : "text-white"
              }`} />
            )}
          </NavLink>
          
          {/* Temporarily hidden
          <NavLink 
            to="/quiet-time" 
            className={({ isActive }) =>
              `flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? "w-10 h-10 bg-white rounded-full" 
                  : "w-8 h-8"
              }`
            }
          >
            {({ isActive }) => (
              <FaBook className={`text-lg transition-colors duration-200 ${
                isActive ? "text-gray-900" : "text-white"
              }`} />
            )}
          </NavLink>
          */}
          
          <NavLink 
            to="/roster" 
            className={({ isActive }) =>
              `flex items-center justify-center transition-all duration-200 ${
                isActive 
                  ? "w-10 h-10 bg-white rounded-full" 
                  : "w-8 h-8"
              }`
            }
          >
            {({ isActive }) => (
              <FaRegEdit className={`text-lg transition-colors duration-200 ${
                isActive ? "text-gray-900" : "text-white"
              }`} />
            )}
          </NavLink>
          
          {isAdmin && (
            <NavLink 
              to="/analytics" 
              className={({ isActive }) =>
                `flex items-center justify-center transition-all duration-200 ${
                  isActive 
                    ? "w-10 h-10 bg-white rounded-full" 
                    : "w-8 h-8"
                }`
              }
            >
              {({ isActive }) => (
                <FaChartBar className={`text-lg transition-colors duration-200 ${
                  isActive ? "text-gray-900" : "text-white"
                }`} />
              )}
            </NavLink>
          )}
        </div>
      </div>
    </nav>
  );
};

export default BottomNav;