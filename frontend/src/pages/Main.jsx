import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';

export default function Main() {
  const { user, logout } = useAuth();
  const { currentSong, socket, isConnected } = useSocket();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  // Redirect to live page when a song is selected
  useEffect(() => {
    if (currentSong) {
      navigate('/live');
    }
  }, [currentSong, navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      navigate('/results', { state: { query: searchQuery.trim() } });
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Admin view
  if (user?.isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-white">🎵 JaMoveo Admin</h1>
              <p className="text-purple-100 mt-2">
                Manage rehearsals and control the session
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-purple-100 text-sm">Connected: {user.username}</p>
                <p className="text-purple-200 text-xs">
                  {isConnected ? '🟢 Online' : '🔴 Offline'}
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
          
          <Card className="shadow-2xl">
            <CardHeader>
              <CardTitle className="text-2xl text-center text-gray-800">
                Search any song...
              </CardTitle>
              <p className="text-center text-gray-600 mt-2">
                Find songs in English or Hebrew to start the session
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSearch} className="space-y-4">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter song name, artist, or keywords..."
                  className="w-full p-4 text-lg border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="w-full bg-purple-600 text-white py-4 text-lg rounded-md hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  🔍 Search Songs
                </button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Player view
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">🎵 JaMoveo Player</h1>
            <p className="text-blue-100 mt-2">
              Ready to rock with your {user?.instrument || 'instrument'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-blue-100 text-sm">Playing: {user?.instrument || 'Unknown'}</p>
              <p className="text-blue-200 text-xs">
                {isConnected ? '🟢 Connected' : '🔴 Connecting...'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
        
        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl text-center text-gray-800">
              {currentSong ? `🎶 ${currentSong.title}` : '⏳ Waiting for next song...'}
            </CardTitle>
            {currentSong && (
              <p className="text-center text-gray-600 text-lg mt-2">
                by {currentSong.artist}
              </p>
            )}
          </CardHeader>
          <CardContent className="text-center">
            {currentSong ? (
              <div className="space-y-4">
                <p className="text-green-600 text-lg font-medium">
                  🎤 Song selected! Navigating to live view...
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
                </div>
                <p className="text-gray-600">
                  The admin will select a song shortly...
                </p>
                <div className="flex justify-center items-center gap-2 text-sm text-gray-500">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  {isConnected ? 'Connected to session' : 'Connecting to session...'}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 