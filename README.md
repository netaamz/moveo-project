# JaMoveo - Band Rehearsal Web Application

A real-time web application for band rehearsals, allowing musicians to join virtual sessions and view synchronized lyrics and chords. Built with React frontend and Node.js backend.

## 🎵 Features

- **User Authentication** with instrument-specific roles
- **Real-time Session Management** powered by Socket.io
- **Instrument-specific Views**:
  - Vocalists see lyrics only
  - Other instruments see both lyrics and chords
- **Admin Controls** for song and session management
- **Auto-scroll** functionality for hands-free reading
- **Bilingual Support** (Hebrew & English)

## 🛠️ Setup & Installation

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- MongoDB

### Backend Setup
1. Set up environment:
```bash
# Create .env file in backend directory
MONGODB_URI=mongodb://localhost:27017/jamoveo
SESSION_SECRET=your-secret-key-here
PORT=3000
```

2. Install and start:
```bash
cd backend
npm install
npm run init-db     # Initialize with sample data
npm start           # Or 'npm run dev' for development
```

### Frontend Setup
1. Install and start:
```bash
cd frontend
npm install
npm run dev         # Starts on http://localhost:5173
```

## 👥 User Accounts

### Sample Users
- **Admin Users**:
  - `admin` (Password: admin123)
  - `band_manager` (Password: manage123)
- **Regular Users**:
  - `drummer_mike` (Password: beats123)
  - `sarah_vocals` (Password: sing123)
  - More available in sample data

## 🎸 How to Use

### For Players
1. Login with your credentials
2. Wait in the main lobby for song selection
3. View content based on your instrument
4. Use auto-scroll for hands-free reading

### For Admins
1. Login with admin credentials
2. Search and select songs
3. Manage active sessions
4. Control song progression

## 🔧 Technical Stack

- **Frontend**: React 18, Vite, Tailwind CSS
- **Backend**: Node.js, Express, MongoDB
- **Real-time**: Socket.io
- **API**: RESTful endpoints with Axios

## 📱 Production Deployment

### Frontend
```bash
cd frontend
npm run build
# Deploy 'dist' folder to web server
```

### Backend
```bash
cd backend
npm run build
# Configure environment variables
# Start with process manager (e.g., PM2)
```

## 📚 API Documentation

### Main Endpoints
- Auth: `/api/auth/login`, `/api/auth/register`
- Songs: `/api/songs`, `/api/songs/search`
- Users: `/api/users`

For detailed API documentation, check the backend directory.


## 📁 Project Structure

```
jamoveo/
├── frontend/        # React application
├── backend/         # Node.js server
└── README.md        
```

For detailed documentation, see individual README files in frontend/ and backend/ directories. 