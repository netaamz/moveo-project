import { createContext, useContext, useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useAuth } from './AuthContext';
import { useNavigate } from 'react-router-dom';

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const [socket, setSocket] = useState(null);
  const [currentSong, setCurrentSong] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Connect to the backend socket
      const newSocket = io('https://moveo-project-production.up.railway.app', {
        query: { userId: user.username },
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
        transports: ['websocket', 'polling']
      });

      // Connection event handlers
      newSocket.on('connect', () => {
        console.log('Socket connected');
        setIsConnected(true);
        // Join the main lobby for all users
        newSocket.emit('join-main', { userId: user.username });
      });

      newSocket.on('disconnect', () => {
        console.log('Socket disconnected');
        setIsConnected(false);
      });

      newSocket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
        setIsConnected(false);
      });

      // Application event handlers - matching backend events
      newSocket.on('song-selected', (data) => {
        console.log('Song selected:', data);
        setCurrentSong({
          id: data.songId,
          title: data.songTitle,
          artist: data.songArtist,
          rehearsalId: data.rehearsalId
        });
      });

      newSocket.on('rehearsal-ended', () => {
        console.log('Rehearsal ended - redirecting to main');
        setCurrentSong(null);
        
        // Auto-navigate all users back to main page
        // Use timeout to avoid navigation conflicts
        setTimeout(() => {
          navigate('/main');
        }, 100);
      });

      setSocket(newSocket);

      return () => {
        newSocket.off('connect');
        newSocket.off('disconnect');
        newSocket.off('connect_error');
        newSocket.off('song-selected');
        newSocket.off('rehearsal-ended');
        newSocket.close();
      };
    }
  }, [user, navigate]);

  // Function to select a song (admin only)
  const selectSong = (rehearsalId, songId, songTitle, songArtist) => {
    if (socket && user?.isAdmin) {
      socket.emit('song-selected', {
        rehearsalId,
        songId,
        songTitle,
        songArtist
      });
    }
  };



  // Function to end session (admin only)
  const endSession = (rehearsalId) => {
    if (socket && user?.isAdmin) {
      // Emit to backend to notify all users
      socket.emit('rehearsal-ended', { rehearsalId });
      
      // Also clear local state immediately for responsive UI
      setCurrentSong(null);
      
      console.log('Session ended by admin');
    }
  };

  const value = {
    socket,
    currentSong,
    setCurrentSong,
    isConnected,
    selectSong,
    endSession
  };

  return (
    <SocketContext.Provider value={value}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  return useContext(SocketContext);
} 