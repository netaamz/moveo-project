import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useSocket } from '../contexts/SocketContext';
import axios from 'axios';

export default function Live() {
  const [song, setSong] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAutoScrolling, setIsAutoScrolling] = useState(false);
  const [scrollSpeed, setScrollSpeed] = useState(1);
  const [isQuitting, setIsQuitting] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentSong, socket, endSession } = useSocket();
  const contentRef = useRef(null);
  const scrollIntervalRef = useRef(null);

  // Get song data from location state or current song from socket
  const songData = location.state?.song || currentSong;
  const rehearsalId = location.state?.rehearsalId;

  useEffect(() => {
    const fetchSongDetails = async () => {
      if (!songData) {
        navigate('/main');
        return;
      }

      try {
        setLoading(true);
        setError('');
        
        // If we have full song data, use it directly
        if (songData.content) {
          setSong(songData);
        } else {
          // Fetch complete song details from API
          const response = await axios.get(`/api/songs/${songData._id || songData.id}`);
          setSong(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch song details:', error);
        setError('Failed to load song details.');
      } finally {
        setLoading(false);
      }
    };

    fetchSongDetails();
  }, [songData, navigate]);

  // Auto-scroll functionality
  useEffect(() => {
    if (isAutoScrolling && contentRef.current) {
      scrollIntervalRef.current = setInterval(() => {
        if (contentRef.current) {
          contentRef.current.scrollTop += scrollSpeed;
        }
      }, 50);
    } else {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    }

    return () => {
      if (scrollIntervalRef.current) {
        clearInterval(scrollIntervalRef.current);
      }
    };
  }, [isAutoScrolling, scrollSpeed]);

  const toggleAutoScroll = () => {
    setIsAutoScrolling(!isAutoScrolling);
  };

  const handleQuit = async () => {
    if (user?.isAdmin) {
      setIsQuitting(true);
      try {
        endSession(rehearsalId);
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error) {
        console.error('Error ending session:', error);
      }
    }
    navigate('/main');
  };

  // Auto-detect Hebrew text for RTL display
  const detectHebrew = (text) => {
    if (!text) return false;
    // Hebrew Unicode range: U+0590 to U+05FF
    const hebrewRegex = /[\u0590-\u05FF]/;
    return hebrewRegex.test(text);
  };

  const getTextContent = () => {
    if (song?.content && Array.isArray(song.content)) {
      // Extract text from unified format
      return song.content
        .map(line => line.map(word => word.lyrics).join(' '))
        .join(' ');
    }
    return '';
  };

  const isRTL = detectHebrew(getTextContent());
  const isVocalist = user?.instrument?.toLowerCase() === 'vocals';

  // Render unified content format (new backend format with content array)
  const renderUnifiedContent = (content) => {
    if (!content || !Array.isArray(content)) return null;

    return (
      <div className={`text-3xl leading-loose font-mono ${isRTL ? 'text-right' : 'text-left'}`} dir={isRTL ? 'rtl' : 'ltr'}>
        {content.map((line, lineIndex) => (
          <div key={lineIndex} className="mb-6">
            {/* Let dir="rtl" handle the word order, flexbox just handles wrapping and alignment */}
            <div className="flex flex-wrap justify-start gap-x-4 gap-y-2">
              {line.map((word, wordIndex) => (
                <div key={wordIndex} className="inline-flex flex-col items-center min-w-0">
                  {/* Chord above (only for non-vocalists) */}
                  {!isVocalist && (
                    <div className="text-green-400 text-center min-h-[1.5em] whitespace-nowrap">
                      {word.chords || '\u00A0'}
                    </div>
                  )}
                 
                  {/* Lyric below */}
                  <div className="text-white text-center whitespace-nowrap">
                    {word.lyrics}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    );
  };



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-2xl">Loading song...</p>
        </div>
      </div>
    );
  }

  if (error || !song) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-600 to-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-3xl font-bold mb-4">Error</h2>
          <p className="text-xl mb-8">{error || 'Song not found'}</p>
          <button
            onClick={() => navigate('/main')}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xl"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-600 to-black text-white relative" dir={isRTL ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="bg-gray-900 p-6 border-b border-gray-700">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <div className={isRTL ? 'text-right' : 'text-left'}>
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              {song.title}
            </h1>
            <p className="text-2xl text-gray-300">
              by {song.artist}
            </p>
            <p className="text-sm text-gray-400 mt-1">
              {isRTL ? '🇮🇱 Hebrew' : '🇺🇸 English'}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className={`text-gray-300 ${isRTL ? 'text-left' : 'text-right'}`}>
              <p className="text-lg">
                {user?.instrument || 'Unknown'} • {user?.username}
              </p>
              <p className="text-sm">
                {isVocalist ? '🎤 Lyrics Only' : '🎸 Lyrics & Chords'}
              </p>
            </div>
            {user?.isAdmin && (
              <button
                onClick={handleQuit}
                className={`px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xl font-bold ${isQuitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                disabled={isQuitting}
              >
                {isQuitting ? 'Quitting...' : 'Quit Session'}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Song Content */}
      <div
        ref={contentRef}
        className="max-w-6xl mx-auto p-8 pb-32 overflow-y-auto"
        style={{ maxHeight: 'calc(100vh - 200px)' }}
      >
        {renderUnifiedContent(song.content)}
      </div>

      {/* Auto-Scroll Controls - Floating Button */}
      <div className="fixed bottom-8 right-8 flex flex-col items-center gap-4">
        <button
          onClick={toggleAutoScroll}
          className={`p-4 rounded-full text-white font-bold text-lg shadow-2xl transition-all ${
            isAutoScrolling 
              ? 'bg-red-600 hover:bg-red-700 animate-pulse' 
              : 'bg-green-600 hover:bg-green-700'
          }`}
        >
          {isAutoScrolling ? '⏸️ Stop Scroll' : '▶️ Auto Scroll'}
        </button>
        
        {isAutoScrolling && (
          <div className="bg-gray-800 p-4 rounded-lg text-center">
            <p className="text-white text-sm mb-2">Scroll Speed</p>
            <div className="flex gap-2">
              <button
                onClick={() => setScrollSpeed(Math.max(0.5, scrollSpeed - 0.5))}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                -
              </button>
              <span className="px-3 py-1 bg-gray-900 text-white rounded min-w-12 text-center">
                {scrollSpeed}x
              </span>
              <button
                onClick={() => setScrollSpeed(Math.min(5, scrollSpeed + 0.5))}
                className="px-3 py-1 bg-gray-600 hover:bg-gray-700 text-white rounded"
              >
                +
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Connection Status */}
      <div className="fixed bottom-8 left-8">
        <div className="bg-gray-800 px-4 py-2 rounded-lg text-white text-sm">
          <span className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            Live Session Active
          </span>
        </div>
      </div>
    </div>
  );
} 