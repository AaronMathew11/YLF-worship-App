import React, { useState, useEffect } from 'react';
import VideoList from '../Components/videoList';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const TransitionalSongs = ({addVideoToList, removeVideoFromList, selectedVideos}) => {
  const [transitionSongs, setTransitionSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTransitionalSongs = async () => {
      try {
        const response = await axios.get(API_ENDPOINTS.SONGS_BY_CATEGORY('Transitional'));
        setTransitionSongs(response.data.map(song => ({
          title: song.songName,
          youtubeId: song.youtubeId
        })));
      } catch (error) {
        console.error('Error fetching transitional songs:', error);
        setTransitionSongs([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTransitionalSongs();
  }, []);

  if (loading) {
    return <div className="p-4 text-center">Loading transitional songs...</div>;
  }

  return (
    <VideoList 
      videos={transitionSongs} 
      title="Transitional Songs" 
      subtitle="Songs that bridge the energy of praise and the depth of worship" 
      addVideoToList={addVideoToList} 
      removeVideoFromList={removeVideoFromList}
      selectedVideos={selectedVideos}
    />
  )
};

export default TransitionalSongs;