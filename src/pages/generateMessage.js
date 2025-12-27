import React, { useState, useEffect } from 'react';
import { FaCopy, FaCheck } from 'react-icons/fa';

const MessageGeneratorPage = ({ selectedVideos }) => {
  const [theme, setTheme] = useState('');
  const [book, setBook] = useState('');
  const [chapter, setChapter] = useState('');
  const [verse, setVerse] = useState('');
  const [message, setMessage] = useState('');
  const [bibleVerse, setBibleVerse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const fetchBibleVerses = async () => {
    if (!book || !chapter || !verse) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles/en-kjv/books/${book.toLowerCase()}/chapters/${chapter}/verses/${verse}.json`);
      const data = await response.json();
      setBibleVerse(data.text);
    } catch (error) {
      console.error('Error fetching Bible verse:', error);
      setBibleVerse('Could not fetch verse. Please check your input.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (bibleVerse !== '') {
      generateMessage();
    }
  }, [bibleVerse, selectedVideos, theme, book, chapter, verse]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };

  const generateMessage = () => {
    let generatedMessage = `Good Day Everyone! Please find the theme and worship list for this Sunday. Feel free to share your thoughts and suggestions for any changes.\n\n`;

    generatedMessage += `Worship Theme: ${theme}\n\n`;
    generatedMessage += `Scripture: ${book} ${chapter}:${verse}\n"${bibleVerse}"\n\n`;
    generatedMessage += `Song List:\n`;

    selectedVideos.forEach((song, index) => {
      generatedMessage += `${index + 1}. ${song.title}\n   https://www.youtube.com/watch?v=${song.youtubeId}\n\n`;
    });


    setMessage(generatedMessage);
  };

  return (
    <div className="min-h-screen pb-24 bg-gradient-to-b from-red-50 via-white to-red-50">
      {/* Red Gradient Header Section */}
      <div className="bg-gradient-to-br from-red-500 via-red-600 to-red-700 text-white">
        <div className="max-w-md mx-auto px-4">
          <div className="text-center pt-8 pb-6 animate-fade-in">
            <h1 className="text-2xl font-bold text-white mb-2">Message Generator</h1>
            <p className="text-red-100 text-sm max-w-sm mx-auto leading-relaxed">
              Create beautiful worship announcements
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4">
      {/* Form */}
      <div className="space-y-4 mb-6 pt-6 animate-slide-up">
        {/* Theme Input */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <h3 className="section-header text-sm mb-3">Worship Theme</h3>
          <input
            type="text"
            placeholder="Enter worship theme..."
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
          />
        </div>

        {/* Bible Verse Input */}
        <div className="bg-white rounded-xl shadow-card p-4">
          <h3 className="section-header text-sm mb-3">Scripture Reference</h3>
          <div className="grid grid-cols-3 gap-2">
            <input
              type="text"
              placeholder="Book"
              onChange={(e) => setBook(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
            />
            <input
              type="text"
              placeholder="Chapter"
              onChange={(e) => setChapter(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
            />
            <input
              type="text"
              placeholder="Verse"
              onChange={(e) => setVerse(e.target.value)}
              className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
            />
          </div>
        </div>

        {/* Generate Button */}
        <button 
          onClick={fetchBibleVerses} 
          disabled={!theme || !book || !chapter || !verse || isLoading}
          className="w-full bg-gray-900 hover:bg-gray-800 text-white py-3 rounded-xl text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
        >
          {isLoading ? (
            <div className="flex items-center justify-center space-x-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              <span>Generating...</span>
            </div>
          ) : (
            <span>Generate Message</span>
          )}
        </button>
      </div>

      {/* Generated Message */}
      {message && (
        <div className="space-y-4 animate-fade-in">
          <div className="bg-white rounded-xl shadow-card p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="section-header text-sm">Generated Message</h3>
              <button
                onClick={copyToClipboard}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-all duration-200 ${
                  isCopied 
                    ? "bg-green-500 text-white" 
                    : "bg-gray-900 hover:bg-gray-800 text-white"
                }`}
              >
                {isCopied ? <FaCheck /> : <FaCopy />}
              </button>
            </div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
              <pre className="text-gray-800 text-xs leading-relaxed whitespace-pre-wrap break-words">
                {message}
              </pre>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default MessageGeneratorPage;
