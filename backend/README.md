# JaMoveo - Band Rehearsal Web Application

JaMoveo is a real-time web application designed for Moveo's band rehearsals. It allows band members to join virtual rehearsal sessions, view song lyrics and chords based on their instruments, and participate in synchronized song performances.

## Features

- User registration and authentication with instrument selection
- Admin-controlled rehearsal sessions
- Real-time song selection and display
- Instrument-specific content display (lyrics for vocalists, chords for instrumentalists)
- Support for both English and Hebrew songs
- Real-time notifications for session events

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Clone the repository:
```bash
git clone [repository-url]
cd jamoveo
```

2. Install dependencies:
```bash
npm install
```

3. Create environment file:
```bash
# Create .env file with your MongoDB connection string
MONGODB_URI=mongodb://localhost:27017/jamoveo
SESSION_SECRET=your-secret-key-here
PORT=3000
```

4. Initialize database with sample data:
```bash
# Initialize with sample users and songs
npm run init-db

# Or clear existing data and reinitialize
npm run init-db-clear
```

5. Start the server:
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

The server will start on port 3000 by default.

## Database Initialization

The application includes comprehensive sample data for testing and demonstration:

### Sample Users Created
- **admin** (keyboards, admin) - Password: `admin123`
- **band_manager** (guitar, admin) - Password: `manage123`
- **drummer_mike** (drums) - Password: `beats123`
- **sarah_vocals** (vocals) - Password: `sing123`
- **guitar_hero** (guitar) - Password: `rock123`
- **bass_master** (bass) - Password: `low123`
- **sax_player** (saxophone) - Password: `jazz123`
- **piano_jane** (keyboards) - Password: `keys123`

### Sample Songs Included
- **"Midnight Blues"** by Demo Band (blues style)
- **"Sunday Morning"** by Coffee House (folk style)
- **"Rock and Roll Heart"** by Electric Dreams (rock style)
- **"Practice Makes Perfect"** by Study Hall (educational)
- **"Jazz Cafe"** by Smooth Operators (jazz style)

### Database Commands
```bash
# Initialize database with sample data (safe - won't overwrite existing data)
npm run init-db

# Clear database and reinitialize (destructive)
npm run init-db-clear

# Alternative: use the original populate script (adds Hey Jude and Hebrew song)
npm run populate
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user
- `GET /api/auth/instruments` - Get available instruments



### Songs
- `POST /api/songs` - Create new song (admin only)
- `GET /api/songs` - Get all songs
- `GET /api/songs/search` - Search songs
- `GET /api/songs/:id` - Get specific song
- `PUT /api/songs/:id` - Update song (admin only)
- `DELETE /api/songs/:id` - Delete song (admin only)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get specific user
- `PUT /api/users/:id` - Update user (self or admin only)
- `DELETE /api/users/:id` - Delete user (admin only)

## WebSocket Events

### Client Events
- `join-main` - Join the main lobby waiting for song selection
- `song-selected` - Admin selects a song for the session
- `rehearsal-ended` - Admin ends the current session

### Server Events
- `song-selected` - Song has been selected by admin
- `rehearsal-ended` - Rehearsal session has ended

## Data Models

### User
- `id` - Unique identifier
- `username` - User's username
- `instrument` - User's instrument
- `isAdmin` - Admin status
- `createdAt` - Account creation date



### Song
- `id` - Unique identifier
- `title` - Song title
- `artist` - Artist name
- `content` - Array of song lines, each containing an array of word objects with lyrics and chords
- `createdBy` - Admin who added the song
- `createdAt` - Creation date

## Contributing

Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 