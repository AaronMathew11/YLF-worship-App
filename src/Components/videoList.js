import { useState } from "react";
import React from "react";
import { FaPlay, FaCheck, FaPlus, FaSearch } from "react-icons/fa";

function VideoList({ videos, title, addVideoToList, subtitle, selectedVideos = [] }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [visibleIframes, setVisibleIframes] = useState({});
    const videosPerPage = 8;

    const filteredVideos = videos.filter((video) =>
        video.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastVideo = currentPage * videosPerPage;
    const indexOfFirstVideo = indexOfLastVideo - videosPerPage;
    const currentVideos = filteredVideos.slice(indexOfFirstVideo, indexOfLastVideo);
    const totalPages = Math.ceil(filteredVideos.length / videosPerPage);

    const handleButtonClick = (video) => {
        addVideoToList(video);
    };

    const toggleIframe = (youtubeId) => {
        setVisibleIframes((prevState) => ({
            ...prevState,
            [youtubeId]: !prevState[youtubeId],
        }));
    };

    return (
        <div className="min-h-screen pb-24 bg-gradient-to-b from-red-50 via-white to-red-50">
            {/* Red Primary Header Section */}
            <div className="bg-primary text-white">
                <div className="max-w-md mx-auto px-4">
                    <div className="text-center pt-8 pb-6 animate-fade-in">
                        <h1 className="text-2xl font-bold text-white mb-2">{title}</h1>
                        <p className="text-red-100 text-sm max-w-sm mx-auto leading-relaxed">{subtitle}</p>
                    </div>

                    {/* Search Bar */}
                    <div className="pb-6 animate-slide-up">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <FaSearch className="text-gray-400 text-sm" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search songs..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 pl-10 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/10"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-md mx-auto px-4">
            {/* Video Grid */}
            <div className="space-y-2 mb-6 pt-6">
                {currentVideos.map((video, index) => (
                    <div 
                        key={video.youtubeId} 
                        className="animate-slide-up"
                        style={{ animationDelay: `${index * 0.05}s` }}
                    >
                        <div
                            className={`group relative transition-all duration-200 cursor-pointer bg-white rounded-xl shadow-sm hover:shadow-md ${
                                selectedVideos.some(v => v.youtubeId === video.youtubeId)
                                    ? "border-2 border-green-500" 
                                    : "border border-gray-200"
                            }`}
                            onClick={() => toggleIframe(video.youtubeId)}
                        >
                            {/* Video iframe */}
                            {visibleIframes[video.youtubeId] && (
                                <div className="pt-4 pb-3 px-4 animate-scale-in">
                                    <iframe
                                        width="100%"
                                        height="180"
                                        src={`https://www.youtube.com/embed/${video.youtubeId}`}
                                        title={video.title}
                                        frameBorder="0"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                        loading="lazy"
                                        className="rounded-lg"
                                    ></iframe>
                                </div>
                            )}
                            
                            {/* Content */}
                            <div className="flex items-center justify-between px-4 py-3">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200 ${
                                        selectedVideos.some(v => v.youtubeId === video.youtubeId)
                                            ? "bg-green-500" 
                                            : "bg-gray-100"
                                    }`}>
                                        <FaPlay className={`text-xs ${
                                            selectedVideos.some(v => v.youtubeId === video.youtubeId)
                                                ? "text-white" 
                                                : "text-gray-500"
                                        }`} />
                                    </div>
                                    <div className="flex-1 min-w-0 text-left">
                                        <h3 className="font-normal text-xs text-gray-900 leading-relaxed">
                                            {video.title}
                                        </h3>
                                    </div>
                                </div>
                                
                                <button
                                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-all duration-200 ${
                                        selectedVideos.some(v => v.youtubeId === video.youtubeId)
                                            ? "bg-green-500 text-white"
                                            : "bg-gray-900 hover:bg-gray-800 text-white"
                                    }`}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleButtonClick(video);
                                    }}
                                >
                                    {selectedVideos.some(v => v.youtubeId === video.youtubeId) ? (
                                        <FaCheck className="text-xs" />
                                    ) : (
                                        <FaPlus className="text-xs" />
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                    <button
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="h-8 px-4 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                    >
                        Prev
                    </button>
                    
                    <div className="flex items-center space-x-1">
                        <button
                            onClick={() => setCurrentPage(currentPage)}
                            className="w-8 h-8 rounded-lg font-medium text-xs bg-gray-900 text-white flex items-center justify-center"
                        >
                            {currentPage}
                        </button>
                        <span className="text-xs text-gray-400 px-1">of {totalPages}</span>
                    </div>
                    
                    <button
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="h-8 px-4 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200 flex items-center"
                    >
                        Next
                    </button>
                </div>
            )}
            </div>
        </div>
    );
}

export default VideoList;
