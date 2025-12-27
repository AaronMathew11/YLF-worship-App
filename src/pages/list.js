import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaTrash, FaMusic, FaArrowRight, FaListUl, FaGripVertical } from 'react-icons/fa';
import listImage from '../images/listImage.png';

const List = ({ list, removeVideoFromList, reorderSongs }) => {
  const [cachedImage, setCachedImage] = useState(null);
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    const cacheImage = async () => {
      const cachedImage = localStorage.getItem('cachedListImage');
      if (cachedImage) {
        setCachedImage(cachedImage);
        return;
      }

      const toBase64 = (url) =>
        fetch(url)
          .then((response) => response.blob())
          .then(
            (blob) =>
              new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.onerror = reject;
                reader.readAsDataURL(blob);
              })
          );

      const base64Image = await toBase64(listImage);
      setCachedImage(base64Image);
      localStorage.setItem('cachedListImage', base64Image);
    };

    cacheImage();
  }, []);

  const handleDragStart = (e, index) => {
    e.stopPropagation();
    setDraggedItem(index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, dropIndex) => {
    e.preventDefault();
    e.stopPropagation();
    if (draggedItem === null || draggedItem === dropIndex) {
      setDraggedItem(null);
      return;
    }
    
    const newList = [...list];
    const draggedSong = newList[draggedItem];
    newList.splice(draggedItem, 1);
    newList.splice(dropIndex, 0, draggedSong);
    
    if (reorderSongs) {
      reorderSongs(newList);
    }
    setDraggedItem(null);
  };

  const handleDragEnd = (e) => {
    e.preventDefault();
    setDraggedItem(null);
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-red-50 via-white to-red-50">
      {/* Red Gradient Header Section */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-8 pb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-white mb-2">My Worship List</h1>
            <p className="text-red-100 text-sm max-w-sm mx-auto leading-relaxed">
              Curate your perfect worship experience
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">

      {/* Hero Image */}
      <div className="flex justify-center mb-6 animate-slide-up pt-6">
        {cachedImage ? (
          <div className="relative">
            <img 
              src={cachedImage} 
              className="h-32 w-auto rounded-2xl" 
              alt="List" 
            />
          </div>
        ) : (
          <div className="h-32 w-48 bg-white rounded-2xl flex items-center justify-center shadow-card">
            <p className="text-gray-500 text-xs">Loading...</p>
          </div>
        )}
      </div>

      {/* Songs List */}
      {list.length === 0 ? (
        <div className="text-center py-8 animate-fade-in">
          <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-8 max-w-sm mx-auto shadow-card border border-red-200">
            <FaMusic className="text-4xl text-red-500 mx-auto mb-4" />
            <p className="text-gray-700 text-sm font-medium mb-2">No songs selected yet</p>
            <p className="text-gray-500 text-xs">Browse song categories to build your list</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          <div className="bg-gradient-to-r from-red-100 to-red-200 rounded-xl p-4 mb-4 shadow-card border border-red-300">
            <p className="text-red-700 text-sm font-medium text-center">
              {list.length} song{list.length !== 1 ? 's' : ''} selected
            </p>
          </div>
          
          {list.map((song, index) => (
            <div
              key={song.youtubeId}
              className={`bg-white rounded-xl shadow-card animate-slide-up cursor-move ${
                draggedItem === index ? 'opacity-50' : ''
              }`}
              style={{ animationDelay: `${index * 0.05}s` }}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
              onDragEnd={handleDragEnd}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div 
                    className="text-gray-400 text-sm cursor-move p-1"
                    onMouseDown={handleMouseDown}
                  >
                    <FaGripVertical />
                  </div>
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-full flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-normal text-xs text-gray-900 leading-relaxed">
                      {song.title}
                    </h3>
                  </div>
                </div>
                
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeVideoFromList(song.youtubeId);
                  }}
                  className="w-7 h-7 rounded-full bg-red-500 hover:bg-red-600 text-white transition-all duration-200 flex items-center justify-center"
                >
                  <FaTrash className="text-xs" />
                </button>
              </div>
            </div>
          ))}
          
          {/* CTA Button */}
          <div className="mt-12 animate-slide-up">
            <Link to="/message-generator">
              <button className="btn-primary w-full py-3 text-sm font-semibold">
                <div className="flex items-center justify-center space-x-2">
                  <span>Generate Message</span>
                  <FaArrowRight className="text-xs" />
                </div>
              </button>
            </Link>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default List;
