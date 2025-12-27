import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { FaCamera, FaFire, FaTrophy, FaCalendar, FaUsers, FaTimes, FaBook, FaChartLine, FaCheckCircle, FaExclamationTriangle } from 'react-icons/fa';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const QuietTime = () => {
  const { user, token, updateUser } = useAuth();
  const [myNotes, setMyNotes] = useState([]);
  const [menteeNotes, setMenteeNotes] = useState([]);
  const [mentees, setMentees] = useState([]);
  const [selectedMentee, setSelectedMentee] = useState(null);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [activeTab, setActiveTab] = useState('upload');
  const [selectedImage, setSelectedImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [submitFeedback, setSubmitFeedback] = useState('');
  const [fullScreenImage, setFullScreenImage] = useState(null);
  const [imageErrors, setImageErrors] = useState({});

  const fetchData = useCallback(async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      
      const [notesRes, menteesRes, statsRes] = await Promise.all([
        axios.get(API_ENDPOINTS.MY_NOTES, { headers }),
        axios.get(API_ENDPOINTS.MENTEES, { headers }),
        axios.get(API_ENDPOINTS.STATS, { headers })
      ]);
      
      setMyNotes(notesRes.data);
      setMentees(menteesRes.data);
      setStats(statsRes.data);
      
      if (user) {
        updateUser({
          ...user,
          currentStreak: statsRes.data.currentStreak,
          longestStreak: statsRes.data.longestStreak,
          totalQuietTimes: statsRes.data.totalQuietTimes
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        setFullScreenImage(null);
      }
    };

    if (fullScreenImage) {
      document.addEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyPress);
      document.body.style.overflow = 'unset';
    };
  }, [fullScreenImage]);

  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return null;
    
    // If imageUrl is a base64 data URL, use it directly (current method)
    if (imageUrl.startsWith('data:')) {
      return imageUrl;
    }
    
    // For any non-base64 images (legacy), return null to trigger error handling
    // This will show the "image unavailable" fallback UI
    return null;
  };

  const isImageAvailable = (note) => {
    // Check if image is available and not in error state
    return getImageUrl(note.imageUrl) !== null && !imageErrors[note._id];
  };

  const filterAvailableNotes = (notes) => {
    // Filter out notes with unavailable images
    return notes.filter(isImageAvailable);
  };

  const handleImageError = (noteId, imageUrl) => {
    setImageErrors(prev => ({ ...prev, [noteId]: true }));
    console.warn(`Failed to load image for note ${noteId}: ${imageUrl || 'No URL provided'}`);
  };

  const fetchMenteeNotes = async (menteeId) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(API_ENDPOINTS.MENTEE_NOTES_BY_USER(menteeId), { headers });
      setMenteeNotes(response.data);
      setSelectedMentee(mentees.find(m => m._id === menteeId));
    } catch (error) {
      console.error('Error fetching mentee notes:', error);
    }
  };

  const compressImage = (file, maxWidth = 800, quality = 0.7) => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        try {
          const ratio = Math.min(maxWidth / img.width, maxWidth / img.height);
          canvas.width = img.width * ratio;
          canvas.height = img.height * ratio;
          
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              resolve(blob);
            } else {
              reject(new Error('Failed to compress image'));
            }
          }, 'image/jpeg', quality);
        } catch (error) {
          reject(error);
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  };

  const handleImageSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      let processedFile = file;
      
      if (file.size > 2 * 1024 * 1024) {
        setSubmitFeedback('Compressing image...');
        processedFile = await compressImage(file);
        setSubmitFeedback('');
      }

      setSelectedImage(processedFile);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target.result);
      };
      reader.readAsDataURL(processedFile);
    } catch (error) {
      console.error('Error processing image:', error);
      setSubmitFeedback('❌ Error processing image. Please try a different photo.');
    }
  };

  const handleSubmit = async () => {
    if (!selectedImage) {
      setSubmitFeedback('Please select an image first');
      return;
    }

    if (!imagePreview) {
      setSubmitFeedback('Image preview not available. Please try selecting the image again.');
      return;
    }

    setUploading(true);
    setSubmitFeedback('');

    try {
      // Send base64 image data directly instead of FormData
      const payload = {
        image: imagePreview, // This is already base64 from the FileReader
        note: noteText
      };

      await axios.post(API_ENDPOINTS.UPLOAD_QUIET_TIME, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      // Array of encouraging success messages
      const successMessages = [
        '✅ Quiet time note uploaded! Your spiritual journey continues 🙏',
        '🌟 Upload successful! Another step in your faith walk',
        '✅ Note saved! God sees your faithful heart ❤️',
        '🎉 Upload complete! Your consistency is inspiring',
        '✅ Successfully uploaded! Keep seeking His presence',
        '🌅 Note captured! Another beautiful moment with God',
        '✅ Upload successful! Your devotion is growing stronger',
        '📖 Note saved! His word is living in your heart'
      ];
      
      const randomMessage = successMessages[Math.floor(Math.random() * successMessages.length)];
      setSubmitFeedback(randomMessage);
      
      setTimeout(() => {
        fetchData();
      }, 500);
      
      setSelectedImage(null);
      setImagePreview(null);
      setNoteText('');
      const uploadElement = document.getElementById('image-upload');
      if (uploadElement) {
        uploadElement.value = '';
      }
    } catch (error) {
      console.error('Upload error:', error);
      if (error.response?.status === 401) {
        setSubmitFeedback('❌ Session expired. Please log out and log back in.');
      } else {
        const errorMessage = error.response?.data?.error || 'Failed to upload note. Please try again.';
        setSubmitFeedback(`❌ ${errorMessage}`);
      }
    } finally {
      setUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="page-container min-h-screen flex items-center justify-center">
        <div className="content-card text-center">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full mx-auto animate-spin mb-4"></div>
          <p className="text-gray-500 text-sm">Loading quiet time data...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {fullScreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-95 z-50 flex items-center justify-center p-4"
          onClick={() => setFullScreenImage(null)}
        >
          <div className="relative max-w-full max-h-full">
            <button
              onClick={() => setFullScreenImage(null)}
              className="absolute top-4 right-4 w-12 h-12 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-2xl flex items-center justify-center transition-all duration-200"
            >
              <FaTimes className="text-white text-lg" />
            </button>
            <img
              src={fullScreenImage.src}
              alt={fullScreenImage.alt}
              className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            />
            {fullScreenImage.note && (
              <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-80 text-white p-4 rounded-2xl">
                <p className="text-sm font-medium">{fullScreenImage.note}</p>
                <p className="text-xs text-gray-300 mt-2">{fullScreenImage.date}</p>
              </div>
            )}
          </div>
        </div>
      )}

      
      <div className="page-container">
        <div className="pt-8 pb-6 animate-fade-in">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                <FaBook className="text-white text-lg" />
              </div>
              <div>
                <h1 className="section-header mb-0">Quiet Time Notes</h1>
                <p className="text-gray-500 text-sm">Track your daily devotions</p>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-white rounded-2xl p-4 text-center shadow-card">
              <FaFire className="text-accent-orange text-2xl mx-auto mb-2" />
              <div className="text-xl font-bold text-black">{stats.currentStreak || 0}</div>
              <div className="text-xs text-gray-500">Current Streak</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-card">
              <FaTrophy className="text-accent-yellow text-2xl mx-auto mb-2" />
              <div className="text-xl font-bold text-black">{stats.longestStreak || 0}</div>
              <div className="text-xs text-gray-500">Best Streak</div>
            </div>
            <div className="bg-white rounded-2xl p-4 text-center shadow-card">
              <FaCalendar className="text-accent-blue text-2xl mx-auto mb-2" />
              <div className="text-xl font-bold text-black">{stats.totalQuietTimes || 0}</div>
              <div className="text-xs text-gray-500">Total Days</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-1 shadow-card">
            <div className="flex space-x-1">
              <button
                onClick={() => setActiveTab('upload')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'upload' ? 'bg-gray-900 text-white shadow-card' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Upload Note
              </button>
              <button
                onClick={() => setActiveTab('my-notes')}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === 'my-notes' ? 'bg-gray-900 text-white shadow-card' : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                My Notes
              </button>
              {mentees.length > 0 && (
                <button
                  onClick={() => setActiveTab('mentee-notes')}
                  className={`flex-1 py-3 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                    activeTab === 'mentee-notes' ? 'bg-gray-900 text-white shadow-card' : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <FaUsers className="inline mr-1" />
                  Mentees
                </button>
              )}
            </div>
          </div>

          {activeTab === 'upload' && (
            <div className="content-card animate-slide-up">
              <h3 className="page-header mb-6">Upload Today's Notes</h3>
              
              {!imagePreview ? (
                <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center bg-gray-50">
                  <FaCamera className="text-4xl text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 mb-6 text-sm">Click to upload a photo of your quiet time notes</p>
                  <input
                    type="file"
                    accept="image/*,image/heic,image/heif"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="image-upload"
                  />
                  <label
                    htmlFor="image-upload"
                    className="btn-primary cursor-pointer inline-block"
                  >
                    Choose Image
                  </label>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="rounded-2xl overflow-hidden shadow-card">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="noteText" className="block text-sm font-medium text-gray-700 mb-3">
                      Add a reflection (optional)
                    </label>
                    <textarea
                      id="noteText"
                      value={noteText}
                      onChange={(e) => setNoteText(e.target.value)}
                      placeholder="Share your insights, prayers, or thoughts from today's quiet time..."
                      className="input-field w-full"
                      rows="4"
                    />
                  </div>
                  
                  <div className="flex space-x-3">
                    <button
                      onClick={handleSubmit}
                      disabled={uploading}
                      className={`btn-primary flex-1 ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {uploading ? 'Submitting...' : 'Submit Note'}
                    </button>
                    
                    <button
                      onClick={() => {
                        setSelectedImage(null);
                        setImagePreview(null);
                        setNoteText('');
                        setSubmitFeedback('');
                        const uploadElement = document.getElementById('image-upload');
                        if (uploadElement) {
                          uploadElement.value = '';
                        }
                      }}
                      className="btn-secondary px-6"
                    >
                      Cancel
                    </button>
                  </div>
                  
                  {submitFeedback && (
                    <div className={`p-4 rounded-2xl text-center text-sm font-medium ${
                      submitFeedback.includes('✅') ? 'bg-accent-green bg-opacity-10 text-accent-green' : 'bg-red-50 text-red-600'
                    }`}>
                      {submitFeedback}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {activeTab === 'my-notes' && (
            <div className="space-y-4 animate-fade-in">
              {(() => {
                const availableNotes = filterAvailableNotes(myNotes);
                return availableNotes.length === 0 ? (
                  <div className="content-card text-center">
                    <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h3 className="section-header mb-2">No notes available</h3>
                    <p className="text-gray-500 text-sm">
                      {myNotes.length === 0 
                        ? "Start your quiet time journey today!" 
                        : "Recent notes may have expired. Upload a new quiet time note!"}
                    </p>
                  </div>
                ) : (
                  availableNotes.map((note, index) => (
                  <div 
                    key={note._id} 
                    className="content-card overflow-hidden animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <img
                      src={getImageUrl(note.imageUrl)}
                      alt="Quiet time note"
                      className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-all duration-200"
                      onError={() => handleImageError(note._id, getImageUrl(note.imageUrl))}
                      onClick={() => setFullScreenImage({
                        src: getImageUrl(note.imageUrl),
                        alt: 'Quiet time note',
                        note: note.note,
                        date: new Date(note.date).toLocaleDateString()
                      })}
                    />
                    <div className="p-4">
                      <div className="text-sm text-gray-500 font-medium mb-2">
                        {new Date(note.date).toLocaleDateString('en-US', { 
                          weekday: 'long', 
                          year: 'numeric', 
                          month: 'long', 
                          day: 'numeric' 
                        })}
                      </div>
                      {note.note && <p className="text-gray-700 text-sm leading-relaxed">{note.note}</p>}
                    </div>
                  </div>
                  ))
                );
              })()}
            </div>
          )}

          {activeTab === 'mentee-notes' && (
            <div className="space-y-4 animate-fade-in">
              {!selectedMentee ? (
                <div className="content-card">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="page-header">Select a Mentee</h3>
                    <button
                      onClick={() => setActiveTab('analytics')}
                      className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-2xl flex items-center justify-center transition-colors duration-200"
                      title="View Analytics"
                    >
                      <FaChartLine className="text-gray-600" />
                    </button>
                  </div>
                  <div className="space-y-3">
                    {mentees
                      .sort((a, b) => new Date(b.lastQuietTime || 0) - new Date(a.lastQuietTime || 0))
                      .map((mentee, index) => (
                      <div
                        key={mentee._id}
                        onClick={() => fetchMenteeNotes(mentee._id)}
                        className="p-4 border-2 border-gray-100 rounded-2xl hover:border-gray-200 hover:bg-gray-50 cursor-pointer transition-all duration-200 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                              <FaUsers className="text-white text-sm" />
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">{mentee.name}</h4>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                              <FaFire className="text-accent-orange" />
                              <span className="font-medium">{mentee.currentStreak || 0} day streak</span>
                            </div>
                            <div className="text-xs text-gray-500">
                              {mentee.totalQuietTimes || 0} total notes
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="content-card">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center">
                          <FaUsers className="text-white text-sm" />
                        </div>
                        <div>
                          <h3 className="page-header">{selectedMentee.name}'s Notes</h3>
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedMentee(null);
                          setMenteeNotes([]);
                        }}
                        className="btn-secondary text-sm px-4 py-2"
                      >
                        Back to List
                      </button>
                    </div>
                  </div>
                  
                  {(() => {
                    const availableNotes = filterAvailableNotes(menteeNotes);
                    return availableNotes.length === 0 ? (
                      <div className="content-card text-center">
                        <FaBook className="text-4xl text-gray-400 mx-auto mb-4" />
                        <h3 className="section-header mb-2">No notes available</h3>
                        <p className="text-gray-500 text-sm">
                          {menteeNotes.length === 0 
                            ? `${selectedMentee.name} hasn't uploaded any notes yet.`
                            : `${selectedMentee.name}'s recent notes may have expired.`}
                        </p>
                      </div>
                    ) : (
                      availableNotes.map((note, index) => (
                      <div 
                        key={note._id} 
                        className="content-card overflow-hidden animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <div className="p-4 bg-gray-50 border-b">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-gray-900 rounded-xl flex items-center justify-center">
                                <FaBook className="text-white text-xs" />
                              </div>
                              <span className="font-medium text-gray-900">{note.userId.name}</span>
                            </div>
                            <span className="text-sm text-gray-500 font-medium">
                              {new Date(note.date).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric' 
                              })}
                            </span>
                          </div>
                        </div>
                        <img
                          src={getImageUrl(note.imageUrl)}
                          alt="Mentee quiet time note"
                          className="w-full h-48 object-cover cursor-pointer hover:opacity-95 transition-all duration-200"
                          onError={() => handleImageError(note._id, getImageUrl(note.imageUrl))}
                          onClick={() => setFullScreenImage({
                            src: getImageUrl(note.imageUrl),
                            alt: `${note.userId.name}'s quiet time note`,
                            note: note.note,
                            date: `${note.userId.name} - ${new Date(note.date).toLocaleDateString()}`
                          })}
                        />
                        {note.note && (
                          <div className="p-4">
                            <p className="text-gray-700 text-sm leading-relaxed">{note.note}</p>
                          </div>
                        )}
                      </div>
                      ))
                    );
                  })()}
                </div>
              )}
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-4 animate-fade-in">
              <div className="content-card">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center">
                    <FaChartLine className="text-white text-lg" />
                  </div>
                  <div>
                    <h3 className="page-header">Mentee Analytics</h3>
                    <p className="text-gray-500 text-sm">Monitor your mentees' progress</p>
                  </div>
                </div>

                {mentees.length === 0 ? (
                  <div className="text-center py-8">
                    <FaUsers className="text-4xl text-gray-400 mx-auto mb-4" />
                    <h4 className="section-header mb-2">No mentees yet</h4>
                    <p className="text-gray-500 text-sm">Start mentoring someone to see their progress here.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {mentees
                      .sort((a, b) => new Date(b.lastQuietTime || 0) - new Date(a.lastQuietTime || 0))
                      .map((mentee, index) => {
                      const lastActivity = mentee.lastQuietTime ? new Date(mentee.lastQuietTime) : null;
                      const daysSinceLastActivity = lastActivity ? Math.floor((new Date() - lastActivity) / (1000 * 60 * 60 * 24)) : null;
                      const streakStatus = (daysSinceLastActivity === null || daysSinceLastActivity >= 3) ? 'needs-attention' : 
                                          mentee.currentStreak >= 7 ? 'excellent' : 'good';
                      
                      return (
                        <div
                          key={mentee._id}
                          className="bg-white rounded-2xl p-6 shadow-card animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="section-header">{mentee.name}</h4>
                              <p className="text-gray-500 text-sm">{mentee.email}</p>
                            </div>
                            <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                              streakStatus === 'excellent' ? 'bg-accent-green bg-opacity-10 text-accent-green' :
                              streakStatus === 'good' ? 'bg-accent-yellow bg-opacity-10 text-accent-orange' :
                              'bg-red-50 text-red-600'
                            }`}>
                              {streakStatus === 'excellent' ? 'Excellent' : streakStatus === 'good' ? 'Good' : 'Needs Attention'}
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4 mb-4">
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <FaFire className={`text-2xl ${
                                  mentee.currentStreak >= 7 ? 'text-accent-green' : 
                                  mentee.currentStreak >= 3 ? 'text-accent-orange' : 'text-gray-400'
                                }`} />
                              </div>
                              <div className="text-xl font-bold text-black">{mentee.currentStreak || 0}</div>
                              <div className="text-xs text-gray-500">Current Streak</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <FaTrophy className="text-2xl text-accent-yellow" />
                              </div>
                              <div className="text-xl font-bold text-black">{mentee.longestStreak || 0}</div>
                              <div className="text-xs text-gray-500">Best Streak</div>
                            </div>
                            <div className="text-center">
                              <div className="flex items-center justify-center mb-2">
                                <FaCalendar className="text-2xl text-accent-blue" />
                              </div>
                              <div className="text-xl font-bold text-black">{mentee.totalQuietTimes || 0}</div>
                              <div className="text-xs text-gray-500">Total Notes</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-2">
                                {daysSinceLastActivity === null ? (
                                  <FaExclamationTriangle className="text-gray-400" />
                                ) : daysSinceLastActivity === 0 ? (
                                  <FaCheckCircle className="text-accent-green" />
                                ) : daysSinceLastActivity <= 2 ? (
                                  <FaCheckCircle className="text-accent-orange" />
                                ) : (
                                  <FaExclamationTriangle className="text-red-500" />
                                )}
                                <span className="text-sm font-medium text-gray-700">Last Activity</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {daysSinceLastActivity === null ? 'No activity yet' :
                                 daysSinceLastActivity === 0 ? 'Today' :
                                 daysSinceLastActivity === 1 ? '1 day ago' :
                                 `${daysSinceLastActivity} days ago`}
                              </span>
                            </div>

                            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                              <div className="flex items-center space-x-2">
                                <FaCalendar className="text-accent-blue" />
                                <span className="text-sm font-medium text-gray-700">Weekly Average</span>
                              </div>
                              <span className="text-sm text-gray-600">
                                {mentee.totalQuietTimes ? Math.round((mentee.totalQuietTimes / (mentee.daysSinceMentor || 1)) * 7 * 10) / 10 : 0} notes/week
                              </span>
                            </div>

                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default QuietTime;