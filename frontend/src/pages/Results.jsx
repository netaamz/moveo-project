import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/SocketContext';
import { useAuth } from '../contexts/AuthContext';
import { Card, CardHeader, CardContent, CardTitle } from '../components/card';
import axios from 'axios';

export default function Results() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { socket } = useSocket();
  const { user } = useAuth();
  const query = location.state?.query || '';

  useEffect(() => {
    const fetchResults = async () => {
      if (!query) {
        navigate('/main');
        return;
      }

      try {
        setLoading(true);
        setError('');
        const response = await axios.get(`/api/songs/search?query=${encodeURIComponent(query)}`);
        setResults(response.data || []);
      } catch (error) {
        console.error('Failed to fetch results:', error);
        setError('Failed to search songs. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [query, navigate]);

  const handleSongSelect = async (song) => {
    try {
      // Create a rehearsal first (simplified - using a default rehearsal ID)
      const rehearsalId = 'default-rehearsal-' + Date.now();
      
      // Emit the song selection event
      if (socket) {
        socket.emit('song-selected', {
          rehearsalId,
          songId: song._id || song.id,
          songTitle: song.title,
          songArtist: song.artist
        });
      }
      
      // Navigate to live page with song data
      navigate('/live', { state: { song, rehearsalId } });
    } catch (error) {
      console.error('Failed to select song:', error);
      setError('Failed to select song. Please try again.');
    }
  };

  if (!user?.isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <Card className="w-[400px]">
          <CardContent className="text-center p-8">
            <h2 className="text-xl font-bold text-red-600 mb-2">Access Denied</h2>
            <p className="text-gray-600 mb-4">Only admins can search for songs.</p>
            <button
              onClick={() => navigate('/main')}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              Go Back
            </button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-indigo-600 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white">🎵 Search Results</h1>
            <p className="text-purple-100 mt-2">
              Search query: "{query}"
            </p>
          </div>
          <button
            onClick={() => navigate('/main')}
            className="px-6 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-800 transition-colors"
          >
            ← Back to Search
          </button>
        </div>

        {error && (
          <Card className="mb-6 border-red-200 bg-red-50">
            <CardContent className="p-4">
              <p className="text-red-700">{error}</p>
            </CardContent>
          </Card>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gray-200 rounded"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.map((song) => (
              <Card
                key={song._id || song.id}
                className="cursor-pointer hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 bg-white"
                onClick={() => handleSongSelect(song)}
              >
                <CardHeader>
                  <CardTitle className="text-xl text-gray-800 truncate">
                    {song.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-2xl font-bold">
                      🎵
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-700 mb-1">{song.artist}</p>
                      <p className="text-sm text-blue-600 font-medium">
                        Click to select this song
                      </p>
                    </div>
                  </div>
                  {song.chords && (
                    <div className="mt-3 p-2 bg-gray-50 rounded text-xs text-gray-600">
                      <strong>Chords:</strong> {song.chords.slice(0, 50)}...
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center p-12">
            <CardContent>
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-700 mb-2">No songs found</h3>
              <p className="text-gray-600 mb-6">
                Try searching with different keywords or check the spelling.
              </p>
              <button
                onClick={() => navigate('/main')}
                className="px-6 py-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
              >
                Try Another Search
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 