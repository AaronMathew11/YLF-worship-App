import React, { useState, useEffect } from "react";
import moment from "moment";
import { useParams, useNavigate } from "react-router-dom";
import { FaUsers, FaCalendarAlt, FaSearch, FaCopy, FaCheck, FaArrowLeft, FaHome, FaBuilding } from "react-icons/fa";
import { API_ENDPOINTS } from '../config/api';

const Roster = ({ list, removeVideoFromList }) => {
  const { location } = useParams();
  const navigate = useNavigate();
  const [roster, setRoster] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [copiedDays, setCopiedDays] = useState({});

  const getLocationDetails = (locationId) => {
    const locations = {
      studio: { name: "Studio", icon: <FaBuilding className="text-lg" />, description: "Main worship studio" },
      home1: { name: "Home 1", icon: <FaHome className="text-lg" />, description: "Worship at home location 1" },
      home2: { name: "Home 2", icon: <FaHome className="text-lg" />, description: "Worship at home location 2" },
      home3: { name: "Home 3", icon: <FaHome className="text-lg" />, description: "Worship at home location 3" }
    };
    return locations[locationId] || { name: "Unknown Location", icon: <FaUsers className="text-lg" />, description: "" };
  };

  const filteredDays = roster
    .filter((day) => {
      const formattedDate = moment(day.Date, "Do MMMM YYYY");
      return (
        formattedDate.isSameOrAfter(moment().subtract(30, 'days')) &&
        (
          day.Date.toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Lead/ Lyrics/ Posting"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Guitar"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Bass"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Keyboard"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Drums"].toLowerCase().includes(searchQuery.toLowerCase()) ||
          day["Supporting Vocals"].toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    })
    .sort((a, b) => {
      const dateA = moment(a.Date, "Do MMMM YYYY");
      const dateB = moment(b.Date, "Do MMMM YYYY");
      
      // Prioritize Sundays first, then sort by date
      const isSundayA = dateA.day() === 0;
      const isSundayB = dateB.day() === 0;
      
      if (isSundayA && !isSundayB) return -1;
      if (!isSundayA && isSundayB) return 1;
      
      return dateA - dateB;
    });

  const fetchRoster = async () => {
    try {
      setLoading(true);
      
      const response = await fetch(`${API_ENDPOINTS.ROSTER_BY_LOCATION(location || "studio")}?limit=1000`, {
        method: "GET",
        headers: new Headers({
          "ngrok-skip-browser-warning": "69420",
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setRoster(data.data || data);
    } catch (error) {
      console.error("Error fetching roster:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoster();
  }, [location, fetchRoster]);


  const copyRosterToClipboard = (day) => {
    let rosterText = `Worship Team Roster - ${day.Date}\n\n`;
    
    const roles = [
      { label: "Lead", value: day["Lead/ Lyrics/ Posting"] },
      { label: "Guitar", value: day["Guitar"] },
      { label: "Bass", value: day["Bass"] },
      { label: "Keys", value: day["Keyboard"] },
      { label: "Drums", value: day["Drums"] },
      { label: "Vocals", value: day["Supporting Vocals"] }
    ];
    
    roles.forEach(role => {
      rosterText += `${role.label}: ${role.value || "TBD"}\n`;
    });
    
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(rosterText).then(() => {
        setCopiedDays({ ...copiedDays, [day._id]: true });
        setTimeout(() => {
          setCopiedDays(prev => ({ ...prev, [day._id]: false }));
        }, 2000);
      });
    }
  };

  const locationInfo = getLocationDetails(location);

  return (
    <div className="min-h-screen pb-24 bg-white">
      {/* Header Section */}
      <div className="bg-primary text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="pt-6 pb-4 animate-fade-in">
            {/* Back Button and Location Header */}
            <div className="flex items-center space-x-3 mb-4">
              <button
                onClick={() => navigate('/roster-locations')}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors duration-200"
              >
                <FaArrowLeft className="text-white text-sm" />
              </button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  {locationInfo.icon}
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white">{locationInfo.name} Roster</h1>
                  <p className="text-white/80 text-xs">{locationInfo.description}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="pb-6 animate-slide-up">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-400 text-sm" />
              </div>
              <input
                type="text"
                placeholder="Search roster..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6">
        {loading ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-card">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full mx-auto animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading roster...</p>
          </div>
        </div>
      ) : filteredDays.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-card">
            <FaCalendarAlt className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">Roster not available</p>
            <p className="text-gray-400 text-xs mt-2">Debug: Raw data count: {roster.length}, Filtered count: {filteredDays.length}</p>          </div>
        </div>
      ) : (
        <div className="space-y-3 pb-8">
          {filteredDays.map((day, index) => (
            <div
              key={day._id}
              className="bg-white rounded-xl shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              {/* Date Header with Copy Button */}
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="section-header text-sm">{day.Date}</h3>
                <button
                  onClick={() => copyRosterToClipboard(day)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                    copiedDays[day._id]
                      ? "bg-green-500 text-white"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                  }`}
                >
                  {copiedDays[day._id] ? <FaCheck /> : <FaCopy />}
                </button>
              </div>

              {/* Team Members - Better spaced layout */}
              <div className="px-4 py-6">
                <div className="space-y-4">
                  {[
                    { label: "Lead", value: day["Lead/ Lyrics/ Posting"], key: "lead", color: "bg-gray-900 text-white" },
                    { label: "Guitar", value: day["Guitar"], key: "guitar", color: "bg-gray-100 text-gray-700" },
                    { label: "Bass", value: day["Bass"], key: "bass", color: "bg-gray-100 text-gray-700" },
                    { label: "Keys", value: day["Keyboard"], key: "keyboard", color: "bg-gray-100 text-gray-700" },
                    { label: "Drums", value: day["Drums"], key: "drums", color: "bg-gray-100 text-gray-700" },
                    { label: "Vocals", value: day["Supporting Vocals"], key: "supporting vocals", color: "bg-gray-100 text-gray-700" }
                  ].map((role, roleIndex) => (
                    <div key={role.key} className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-sm font-semibold text-gray-600">
                        {role.value ? role.value.charAt(0).toUpperCase() : "?"}
                      </div>
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-sm font-medium text-gray-900 truncate mb-1 mx-4">
                          {role.value || "TBD"}
                        </p>

                      </div>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${role.color}`}>
                          {role.label}
                        </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          
        </div>
      )}
      </div>
    </div>
  );
};

export default Roster;
