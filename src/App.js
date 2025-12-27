// App.js
import './App.css';
import {
    Route,
    Routes,
    Navigate
} from 'react-router-dom';
import Home from './pages/home';
import List from './pages/list';
import BottomNav from './Components/bottomNav';
import PraiseSongs from './pages/praiseSongs';
import CoreWorship from './pages/coreWorship';
import GenerateMessage from './pages/generateMessage'
import TransitionalSongs from './pages/transitionalSongs';
import Login from './pages/login';
import QuietTime from './pages/quietTime';
import { useState, useEffect } from 'react';
import Roster from './pages/roster';
import RosterLocations from './pages/rosterLocations';
import Songs from './pages/songs';
import MemberAnalytics from './pages/memberAnalytics';
import { AuthProvider, useAuth } from './context/AuthContext';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();
    return isAuthenticated ? children : <Navigate to="/login" />;
};

const AppContent = () => {
    const { isAuthenticated } = useAuth();
    const [selectedVideos, setSelectedVideos] = useState([]);

    useEffect(() => {
        const savedSelectedVideos = localStorage.getItem('selectedVideos');
        if (savedSelectedVideos) {
            const parsed = JSON.parse(savedSelectedVideos);
            const uniqueVideos = parsed.filter((video, index, self) => 
                index === self.findIndex(v => v.youtubeId === video.youtubeId)
            );
            setSelectedVideos(uniqueVideos);
            if (uniqueVideos.length !== parsed.length) {
                localStorage.setItem('selectedVideos', JSON.stringify(uniqueVideos));
            }
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('selectedVideos', JSON.stringify(selectedVideos));
    }, [selectedVideos]);

    const addVideoToList = (video) => {
        setSelectedVideos((prevVideos) => {
            const isAlreadySelected = prevVideos.some(v => v.youtubeId === video.youtubeId);
            
            if (isAlreadySelected) {
                return prevVideos.filter(v => v.youtubeId !== video.youtubeId);
            } else {
                const newList = [...prevVideos, video];
                return newList;
            }
        });
    };
    
    const removeVideoFromList = (videoId) => {
        setSelectedVideos((prevVideos) =>
            prevVideos.filter((video) => video.youtubeId !== videoId)
        );
    };

    const reorderSongs = (newList) => {
        setSelectedVideos(newList);
    };

    return (
        <div className="App">
            {isAuthenticated && <BottomNav />}
            <Routes>
                <Route path="/login" element={<Login />} />
                
                <Route path="/" element={
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                } />
                
                <Route path="/PraiseSongs" element={
                    <ProtectedRoute>
                        <PraiseSongs addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} selectedVideos={selectedVideos}/>
                    </ProtectedRoute>
                } />
                
                <Route path="/list" element={
                    <ProtectedRoute>
                        <List list={selectedVideos} removeVideoFromList={removeVideoFromList} reorderSongs={reorderSongs}/>
                    </ProtectedRoute>
                } />
                
                
                <Route path="/CoreWorship" element={
                    <ProtectedRoute>
                        <CoreWorship addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} selectedVideos={selectedVideos}/>
                    </ProtectedRoute>
                } />
                
                <Route path="/TransitionalSongs" element={
                    <ProtectedRoute>
                        <TransitionalSongs addVideoToList={addVideoToList} removeVideoFromList={removeVideoFromList} selectedVideos={selectedVideos}/>
                    </ProtectedRoute>
                } />
                
                <Route path="/message-generator" element={
                    <ProtectedRoute>
                        <GenerateMessage selectedVideos={selectedVideos} />
                    </ProtectedRoute>
                } />
                
                <Route path="/roster-locations" element={
                    <ProtectedRoute>
                        <RosterLocations />
                    </ProtectedRoute>
                } />
                
                <Route path="/roster/:location" element={
                    <ProtectedRoute>
                        <Roster />
                    </ProtectedRoute>
                } />
                
                <Route path="/Roster" element={
                    <ProtectedRoute>
                        <RosterLocations />
                    </ProtectedRoute>
                } />
                
                <Route path="/WeeklySongs" element={
                    <ProtectedRoute>
                        <Songs />
                    </ProtectedRoute>
                } />
                
                <Route path="/quiet-time" element={
                    <ProtectedRoute>
                        <QuietTime />
                    </ProtectedRoute>
                } />
                
                <Route path="/analytics" element={
                    <ProtectedRoute>
                        <MemberAnalytics />
                    </ProtectedRoute>
                } />
            </Routes>
        </div>
    );
};

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
