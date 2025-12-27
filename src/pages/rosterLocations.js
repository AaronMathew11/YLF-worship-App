import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaHome, FaBuilding, FaUsers, FaChartBar } from "react-icons/fa";
import axios from "axios";
import { API_ENDPOINTS } from '../config/api';

const RosterLocations = () => {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLocations();
  }, []);

  const fetchLocations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(API_ENDPOINTS.LOCATION_SUMMARY, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.data.success) {
        setLocations(response.data.data);
      } else {
        setError('Failed to load locations');
      }
    } catch (err) {
      console.error('Error fetching locations:', err);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  const getLocationIcon = (type) => {
    switch (type) {
      case 'main':
        return <FaBuilding className="text-2xl text-white" />;
      case 'home':
        return <FaHome className="text-2xl text-white" />;
      default:
        return <FaBuilding className="text-2xl text-white" />;
    }
  };

  const handleLocationSelect = (locationId) => {
    navigate(`/roster/${locationId}`);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="pt-8 pb-6">
        <h1 className="text-xl font-black text-black mb-2">Worship Roster</h1>
        <p className="text-gray-600 text-sm">Select a location to view roster</p>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center animate-pulse">
            <FaChartBar className="text-2xl text-white" />
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-2xl text-sm">
          {error}
        </div>
      )}

      {/* Location Cards */}
      {!loading && !error && (
        <div className="space-y-4">
          {locations.map((location) => (
            <div
              key={location.id}
              className="bg-primary rounded-2xl p-6 cursor-pointer hover:bg-red-600 transition-colors duration-200"
              onClick={() => handleLocationSelect(location.id)}
            >
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                  {getLocationIcon(location.type)}
                </div>
                <div className="flex-1">
                  <h3 className="header-white-stroke font-bold text-lg mb-1">
                    {location.name}
                  </h3>
                  <p className="text-white/80 text-sm">{location.description}</p>
                </div>
                <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center">
                  <span className="text-white text-lg">→</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Stats */}
      {!loading && !error && locations.length > 0 && (
        <div className="mt-8 p-4 bg-accent-lightBlue rounded-2xl">
          <div className="flex items-center space-x-3">
            <FaUsers className="text-accent-teal text-xl" />
            <div>
              <h4 className="text-black font-black text-sm">Total Locations</h4>
              <p className="text-gray-600 text-xs">{locations.length} worship locations</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RosterLocations;