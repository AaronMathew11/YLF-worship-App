import React, { useState, useEffect } from 'react';
import VideoList from '../Components/videoList';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const CoreWorship = ({addVideoToList, removeVideoFromList, selectedVideos}) => {
  const [worshipSongs, setWorshipSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorshipSongs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.SONGS_BY_CATEGORY('Worship'));
        setWorshipSongs(response.data.map(song => ({
          title: song.songName,
          youtubeId: song.youtubeId
        })));
      } catch (error) {
        console.error('Error fetching worship songs:', error);
        setWorshipSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWorshipSongs();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading worship songs...</div>;
  }

  return (
    <VideoList 
      videos={worshipSongs} 
      title="Core Worship" 
      subtitle="Intimate songs for deeper reverence and intimacy with God" 
      addVideoToList={addVideoToList} 
      removeVideoFromList={removeVideoFromList}
      selectedVideos={selectedVideos}
    />
  )
};

export default CoreWorship;