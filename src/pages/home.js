import React from "react";
import { useNavigate } from "react-router-dom";
import { FaMusic, FaHeart, FaStar, FaCalendarWeek, FaSignOutAlt } from "react-icons/fa";
import { useAuth } from "../context/AuthContext";
import moment from "moment";

const Home = () => {
  const navigate = useNavigate();
  const { logout, user } = useAuth();
  
  const getCurrentDate = () => {
    return moment().format('DD MMM');
  };
  

  const songCategories = [
    {
      title: "Praise Songs",
      subtitle: "50+ songs",
      description: "Uplifting songs to glorify God's name",
      icon: <FaMusic className="text-2xl text-white" />,
      route: "/PraiseSongs",
      bgColor: "bg-primary",
      textColor: "text-white"
    },
    {
      title: "Transitional Songs", 
      subtitle: "40+ songs",
      description: "Bridge between praise and worship",
      icon: <FaStar className="text-2xl text-white" />,
      route: "/TransitionalSongs",
      bgColor: "bg-primary",
      textColor: "text-white"
    },
    {
      title: "Core Worship",
      subtitle: "60+ songs",
      description: "Intimate songs for deeper reverence",
      icon: <FaHeart className="text-2xl text-white" />,
      route: "/CoreWorship", 
      bgColor: "bg-primary",
      textColor: "text-white"
    }
  ];

  return (
    <>
      
      <div className="page-container">
        {/* Header */}
        <div className="pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div className="text-left">
              <h1 className="text-xl font-black text-black">Hello, {user?.name || 'Worship Team'}</h1>
              <p className="text-gray-600 text-xs mt-2">Today {getCurrentDate()}</p>
            </div>
            <button 
              onClick={logout}
              className="w-12 h-12 bg-accent-lightBlue hover:bg-accent-teal/20 rounded-full flex items-center justify-center transition-colors duration-200"
            >
              <FaSignOutAlt className="text-gray-600 text-lg" />
            </button>
          </div>
        </div>


      {/* Week Calendar */}
      <div className="mb-12">
        <div className="flex justify-between">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => {
            const currentDate = moment().startOf('week').add(index, 'days');
            const isToday = moment().isSame(currentDate, 'day');
            const isSunday = index === 0;
            
            return (
              <div key={day} className="text-center">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2 ${
                  isToday ? 'bg-primary text-white' : 
                  isSunday ? 'bg-accent-yellow text-gray-900' : 
                  'bg-white text-gray-500'
                }`}>
                  <span className="text-sm font-medium">{currentDate.format('DD')}</span>
                </div>
                <span className="text-xs text-gray-500">{day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Song Selection Section */}
      <div className="my-16">
        <h3 className="section-header text-left">Select songs for your list</h3>
        <div className="grid grid-cols-2 gap-3">
          {songCategories.map((category, index) => (
            <div
              key={category.title}
              className={`${category.bgColor} rounded-2xl p-6 cursor-pointer`}
              onClick={() => navigate(category.route)}
            >
              <div className="flex items-start justify-between mb-3">
                {category.icon}
                <span className="text-white text-xs font-medium">{category.subtitle}</span>
              </div>
              <h4 className="header-white-stroke font-bold text-xs mb-1">{category.title}</h4>
              <p className="text-white/80 text-xs">{category.description}</p>
            </div>
          ))}
          
          {/* This Week's Songs Card */}
          <div 
            className="bg-accent-lightBlue rounded-2xl p-4 cursor-pointer hover:bg-accent-teal/10 transition-colors duration-200"
            onClick={() => navigate("/WeeklySongs")}
          >
            <div className="flex items-start justify-between mb-3">
              <FaCalendarWeek className="text-2xl text-accent-teal" />
              <span className="text-gray-700 text-xs font-medium">This week</span>
            </div>
            <h4 className="text-black font-black text-xs mb-1">Weekly Songs</h4>
            <p className="text-gray-600 text-xs">Access chord sheets</p>
          </div>
        </div>
      </div>

      </div>
    </>
  );
};

export default Home;
