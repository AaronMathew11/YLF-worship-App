// API Configuration
// This file centralizes all API endpoint configurations

const API_CONFIG = {
  // Development URL (local backend)
  DEV_BASE_URL: 'http://localhost:3001/api',
  
  // Production URL (Firebase Functions)
  PROD_BASE_URL: 'https://api-uzrygaqa3a-uc.a.run.app/api',
  
  // Current environment - change this to switch between dev and prod
  // Set to 'development' for local development, 'production' for deployed backend
  ENVIRONMENT: 'production'
};

// Get the appropriate base URL based on environment
export const getApiBaseUrl = () => {
  return API_CONFIG.ENVIRONMENT === 'production' 
    ? API_CONFIG.PROD_BASE_URL 
    : API_CONFIG.DEV_BASE_URL;
};

// Convenience function to build full API URLs
export const getApiUrl = (endpoint) => {
  const baseUrl = getApiBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint.slice(1) : endpoint;
  return `${baseUrl}/${cleanEndpoint}`;
};

// Export the base URL for direct use
export const API_BASE_URL = getApiBaseUrl();

// Common API endpoints
export const API_ENDPOINTS = {
  // Authentication
  LOGIN: getApiUrl('login'),
  REGISTER: getApiUrl('register'),
  
  // Member Analytics
  MEMBER_ANALYTICS: getApiUrl('member-analytics'),
  
  // Roster & Locations
  ROSTER: getApiUrl('getRoster'),
  ROSTER_BY_LOCATION: (location) => getApiUrl(`getRoster/${location}`),
  LOCATION_SUMMARY: getApiUrl('getLocationSummary'),
  SEND_ROSTER_EMAIL: getApiUrl('sendRosterEmail'),
  
  // Songs
  SONGS: getApiUrl('getSongs'),
  SONGS_BY_CATEGORY: (category) => getApiUrl(`getSongsByCategory/${category}`),
  ALL_MASTER_SONGS: getApiUrl('getAllMasterSongs'),
  UPLOAD_SONGS_MASTER_LIST: getApiUrl('uploadSongsMasterList'),
  
  // Quiet Time
  UPLOAD_QUIET_TIME: getApiUrl('uploadQuietTimeNote'),
  MY_NOTES: getApiUrl('getMyNotes'),
  MENTEE_NOTES: getApiUrl('getMenteeNotes'),
  MENTEES: getApiUrl('getMentees'),
  MENTEE_NOTES_BY_USER: (menteeId) => getApiUrl(`getMenteeNotes/${menteeId}`),
  STATS: getApiUrl('getStats'),
  WEEKLY_ANALYTICS: getApiUrl('getWeeklyAnalytics')
};

const apiConfig = {
  API_BASE_URL,
  API_ENDPOINTS,
  getApiUrl,
  getApiBaseUrl
};

export default apiConfig;