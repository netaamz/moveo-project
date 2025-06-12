# JaMoveo Frontend

A modern React-based web application for band rehearsals, allowing musicians to join virtual sessions and view synchronized lyrics and chords.

## 🚀 Features

- **User Authentication**: Register and login with instrument selection
- **Admin Controls**: Search songs and manage rehearsal sessions
- **Real-time Sync**: Socket.io powered real-time song selection
- **Instrument-specific Display**: 
  - Vocalists see only lyrics
  - Other instruments see both lyrics and chords
- **Auto-scroll**: Slow automatic scrolling for hands-free reading
- **High Contrast Design**: Large fonts and high contrast for smoky rooms
- **Hebrew & English Support**: Search and display songs in both languages

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Backend server running on port 3000

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

## 👥 User Types & Registration

### Regular User (Player)
1. Go to `http://localhost:5173/signup`
2. Fill in username, password, and select your instrument
3. Click "Sign Up"

### Admin User (Session Manager)
1. Go to `http://localhost:5173/admin-signup`
2. Fill in username, password, and select your primary instrument
3. Click "Create Admin Account"

### Sample Users (if backend is initialized)
- **Regular Users**: `drummer_mike`, `sarah_vocals`, `guitar_hero`, `bass_master`, etc.
- **Admin Users**: `admin`, `band_manager`
- **Password**: Check backend README for passwords

## 🎵 How to Use

### For Players:
1. Login with your credentials
2. Wait on the main page for admin to select a song
3. Once a song is selected, you'll automatically go to the live view
4. Use the auto-scroll button for hands-free reading

### For Admins:
1. Login with admin credentials
2. Search for songs using the search box
3. Select a song from the results
4. All connected players will see the live view
5. Use the "Quit Session" button to end the session

## 🎸 Instrument-Specific Views

- **Vocals**: Shows only lyrics in large, easy-to-read format
- **All Other Instruments**: Shows both chords and lyrics sections
- **Auto-scroll**: Available for all instruments with adjustable speed

## 🔧 Technical Details

- Built with React 18 + Vite
- Styled with Tailwind CSS
- Real-time communication with Socket.io
- API integration with Axios
- Responsive design for mobile and desktop

## 🎤 Sample Songs

The backend includes sample songs like:
- "Midnight Blues" by Demo Band
- "Sunday Morning" by Coffee House  
- "Rock and Roll Heart" by Electric Dreams
- And more...

## 📱 Mobile Support

The app is fully responsive and works great on mobile devices for when you're playing your instrument and need to reference the lyrics/chords.

## 🚀 Deployment

For production deployment:

1. Build the application:
```bash
npm run build
```

2. Deploy the `dist` folder to your web server

3. Make sure your backend CORS settings include your production domain

## 🔗 Backend Integration

This frontend is designed to work with the JaMoveo backend API. Make sure the backend is running on port 3000 with proper CORS configuration.

## 🎯 Future Enhancements

- PDF chord sheet export
- Metronome integration
- Recording session playback
- Custom setlist creation
- Multi-language support expansion
