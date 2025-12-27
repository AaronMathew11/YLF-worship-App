import React, { useState, useEffect } from "react";
import { FaMusic, FaExternalLinkAlt } from "react-icons/fa";
import songImage from "../images/songsImage.png";
import { API_ENDPOINTS } from '../config/api';

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [cachedImage, setCachedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const openLink = (link) => {
    window.open(link, "_blank");
  };

  useEffect(() => {
    const fetchSongs = async () => {
      const cacheExpiryTime = 3600 * 1000;
      const cachedData = localStorage.getItem("songs");
      const cachedTimestamp = localStorage.getItem("songsTimestamp");

      const isCacheValid =
        cachedData && cachedTimestamp && Date.now() - cachedTimestamp < cacheExpiryTime;

      if (isCacheValid) {
        setSongs(JSON.parse(cachedData));
        setLoading(false);
      } else {
        try {
          const response = await fetch(API_ENDPOINTS.SONGS, {
            method: "GET",
            headers: new Headers({
              "ngrok-skip-browser-warning": "69420",
            }),
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const data = await response.json();
          setSongs(data.data);

          localStorage.setItem("songs", JSON.stringify(data.data));
          localStorage.setItem("songsTimestamp", Date.now());
        } catch (error) {
          console.error("Error fetching songs:", error.message);
        } finally {
          setLoading(false);
        }
      }
    };

    const cacheImage = async () => {
      const cachedImage = localStorage.getItem("cachedSongsImage");
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

      const base64Image = await toBase64(songImage);
      setCachedImage(base64Image);
      localStorage.setItem("cachedSongsImage", base64Image);
    };

    fetchSongs();
    cacheImage();
  }, []);

  return (
    <>
      
      <div className="page-container">
        {/* Header */}
        <div className="text-center pt-8 pb-6 animate-fade-in">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <h1 className="section-header">This Week's Songs</h1>
          </div>
          <p className="text-gray-500 text-sm max-w-sm mx-auto">
            Access chord sheets for upcoming Sunday worship
          </p>
        </div>

      {/* Hero Image */}
      <div className="flex justify-center mb-8 animate-slide-up">
        {cachedImage ? (
          <div className="relative">
            <img 
              src={cachedImage} 
              className="h-40 w-auto rounded-2xl shadow-soft" 
              alt="Songs" 
            />
          </div>
        ) : (
          <div className="h-40 w-64 bg-white rounded-2xl flex items-center justify-center shadow-card">
            <p className="text-gray-500 text-sm">Loading...</p>
          </div>
        )}
      </div>

      {/* Songs List */}
      {loading ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-card">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full mx-auto animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Loading songs...</p>
          </div>
        </div>
      ) : songs.length === 0 ? (
        <div className="text-center py-12 animate-fade-in">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-auto shadow-card">
            <FaMusic className="text-4xl text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-sm">No songs available</p>
          </div>
        </div>
      ) : (
        <div className="space-y-2 mb-6">
          <div className="bg-white rounded-xl p-3 mb-4 shadow-card">
            <p className="text-gray-500 text-xs text-center">
              {songs.length} song{songs.length !== 1 ? 's' : ''} for this week
            </p>
          </div>
          
          {songs.map((song, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-card animate-slide-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  <div className="flex-shrink-0 w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">{index + 1}</span>
                  </div>
                  <div className="flex-1 min-w-0 text-left">
                    <h3 className="font-normal text-xs text-gray-900 leading-relaxed">
                      {song.songName}
                    </h3>
                  </div>
                </div>
                
                <button
                  onClick={() => openLink(song.link)}
                  className="w-7 h-7 rounded-full bg-gray-900 hover:bg-gray-800 text-white transition-all duration-200 flex items-center justify-center"
                >
                  <FaExternalLinkAlt className="text-xs" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      </div>
    </>
  );
};

export default Songs;
