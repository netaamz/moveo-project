// Load environment variables
require('dotenv').config();

const mongoose = require('mongoose');
const Song = require('./models/Song');
const User = require('./models/User');
const connectDB = require('./config/database');

// Sample users data
const sampleUsers = [
  {
    username: 'admin',
    password: 'admin123',
    instrument: 'keyboards',
    isAdmin: true
  },
  {
    username: 'drummer_mike',
    password: 'beats123',
    instrument: 'drums',
    isAdmin: false
  },
  {
    username: 'sarah_vocals',
    password: 'sing123',
    instrument: 'vocals',
    isAdmin: false
  },
  {
    username: 'guitar_hero',
    password: 'rock123',
    instrument: 'guitar',
    isAdmin: false
  },
  {
    username: 'bass_master',
    password: 'low123',
    instrument: 'bass',
    isAdmin: false
  },
  {
    username: 'sax_player',
    password: 'jazz123',
    instrument: 'saxophone',
    isAdmin: false
  },
  {
    username: 'piano_jane',
    password: 'keys123',
    instrument: 'keyboards',
    isAdmin: false
  },
  {
    username: 'band_manager',
    password: 'manage123',
    instrument: 'guitar',
    isAdmin: true
  }
];

// Sample songs data with new JSON structure
const sampleSongs = [
  {
    title: 'Hey Jude',
    artist: 'The Beatles',
    content: [
      [
          {
              "lyrics": "Hey"
          },
          {
              "lyrics": "Jude",
              "chords": "F"
          },
          {
              "lyrics": "don't"
          },
          {
              "lyrics": "make"
          },
          {
              "lyrics": "it"
          },
          {
              "lyrics": "bad",
              "chords": "C"
          }
      ],
      [
          {
              "lyrics": "Take"
          },
          {
              "lyrics": "a"
          },
          {
              "lyrics": "sad",
              "chords": "C7"
          },
          {
              "lyrics": "song",
              "chords": "C4/7"
          },
          {
              "lyrics": "and"
          },
          {
              "lyrics": "make"
          },
          {
              "lyrics": "it"
          },
          {
              "lyrics": "better",
              "chords": "F"
          }
      ],
      [
          {
              "lyrics": "Remember",
              "chords": "Bb"
          },
          {
              "lyrics": "to"
          },
          {
              "lyrics": "let"
          },
          {
              "lyrics": "her"
          },
          {
              "lyrics": "into"
          },
          {
              "lyrics": "your"
          },
          {
              "lyrics": "heart",
              "chords": "F"
          }
      ],
      [
          {
              "lyrics": "Then"
          },
          {
              "lyrics": "you"
          },
          {
              "lyrics": "can"
          },
          {
              "lyrics": "start",
              "chords": "C"
          },
          {
              "lyrics": "to"
          },
          {
              "lyrics": "make",
              "chords": "C7"
          },
          {
              "lyrics": "it"
          },
          {
              "lyrics": "better",
              "chords": "F"
          }
      ]
  ]
  },
  {
    title: 'ואיך שלא',
    artist: 'דוגמה עברית',
    content: [
      [
          {
              "lyrics": "ואיך"
          },
          {
              "lyrics": "שלא",
              "chords": "Em"
          },
          {
              "lyrics": "אפנה"
          },
          {
              "lyrics": "לראות",
              "chords": "Em/D"
          }
      ],
      [
          {
              "lyrics": "תמיד"
          },
          {
              "lyrics": "איתה",
              "chords": "Cmaj7"
          },
          {
              "lyrics": "ארצה"
          },
          {
              "lyrics": "להיות",
              "chords": "G"
          }
      ],
      [
          {
              "lyrics": "שומרת"
          },
          {
              "lyrics": "לי",
              "chords": "Em"
          },
          {
              "lyrics": "היא"
          },
          {
              "lyrics": "אמונים",
              "chords": "Em/D"
          }
      ],
      [
          {
              "lyrics": "לא"
          },
          {
              "lyrics": "מתרוצצת",
              "chords": "Cmaj7"
          },
          {
              "lyrics": "בגנים",
              "chords": "G"
          }
      ],
      [
          {
              "lyrics": "ובלילות",
              "chords": "E"
          },
          {
              "lyrics": "ובלילות",
              "chords": "Em/D"
          }
      ],
      [
          {
              "lyrics": "עולות"
          },
          {
              "lyrics": "עולות",
              "chords": "Cmaj7"
          },
          {
              "lyrics": "בי"
          },
          {
              "lyrics": "מנגינות",
              "chords": "G"
          }
      ],
      [
          {
              "lyrics": "וזרם"
          },
          {
              "lyrics": "דק",
              "chords": "E"
          },
          {
              "lyrics": "קולח",
              "chords": "Em/D"
          }
      ],
      [
          {
              "lyrics": "ותפילותי",
              "chords": "Cmaj7"
          },
          {
              "lyrics": "לרוח"
          },
          {
              "lyrics": "נענות",
              "chords": "G"
          }
      ]
  ]
  }
];

// Function to clear existing data
async function clearDatabase() {
  try {
    await User.deleteMany({});
    await Song.deleteMany({});
    console.log('🗑️  Cleared existing data from database');
  } catch (error) {
    console.error('❌ Error clearing database:', error.message);
    throw error;
  }
}

// Function to create sample users
async function createSampleUsers() {
  try {
    console.log('👥 Creating sample users...');
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      try {
        const user = await User.createUser(userData);
        createdUsers.push(user);
        console.log(`✅ Created user: ${userData.username} (${userData.instrument}${userData.isAdmin ? ' - ADMIN' : ''})`);
      } catch (error) {
        if (error.message.includes('already exists')) {
          console.log(`⚠️  User ${userData.username} already exists, skipping...`);
          const existingUser = await User.findOne({ username: userData.username });
          createdUsers.push(existingUser);
        } else {
          throw error;
        }
      }
    }
    
    return createdUsers;
  } catch (error) {
    console.error('❌ Error creating users:', error.message);
    throw error;
  }
}

// Function to create sample songs
async function createSampleSongs(adminUser) {
  try {
    console.log('🎵 Creating sample songs...');
    const createdSongs = [];
    
    for (const songData of sampleSongs) {
      const song = new Song({
        title: songData.title,
        artist: songData.artist,
        content: songData.content,
        createdBy: adminUser._id,
      });
      
      await song.save();
      createdSongs.push(song);
      console.log(`✅ Created song: "${songData.title}" by ${songData.artist}`);
    }
    
    return createdSongs;
  } catch (error) {
    console.error('❌ Error creating songs:', error.message);
    throw error;
  }
}

// Function to display summary
function displaySummary(users, songs) {
  console.log('\n🎉 Database initialization complete!');
  console.log('═'.repeat(50));
  
  console.log('\n👥 Users created:');
  users.forEach(user => {
    console.log(`  • ${user.username} (${user.instrument})${user.isAdmin ? ' 👑 ADMIN' : ''}`);
  });
  
  console.log('\n🎵 Songs created:');
  songs.forEach(song => {
    console.log(`  • "${song.title}" by ${song.artist}`);
  });
  
  console.log('\n🔐 Login credentials:');
  console.log('  Admin accounts:');
  console.log('    • Username: admin, Password: admin123 (keyboards)');
  console.log('    • Username: band_manager, Password: manage123 (guitar)');
  console.log('\n  Regular users:');
  console.log('    • Username: drummer_mike, Password: beats123 (drums)');
  console.log('    • Username: sarah_vocals, Password: sing123 (vocals)');
  console.log('    • Username: guitar_hero, Password: rock123 (guitar)');
  console.log('    • Username: bass_master, Password: low123 (bass)');
  console.log('    • Username: sax_player, Password: jazz123 (saxophone)');
  console.log('    • Username: piano_jane, Password: keys123 (keyboards)');
  
  console.log('\n🚀 Ready to start JaMoveo!');
  console.log('   Frontend: http://localhost:3001');
  console.log('   Backend:  http://localhost:3000');
}

// Main initialization function
async function initializeDatabase(clearFirst = false) {
  try {
    // Connect to MongoDB
    await connectDB();
    console.log('📦 Connected to MongoDB');
    
    // Clear database if requested
    if (clearFirst) {
      await clearDatabase();
    }
    
    // Check if data already exists
    const existingUsers = await User.find();
    const existingSongs = await Song.find();
    
    if (existingUsers.length > 0 && existingSongs.length > 0 && !clearFirst) {
      console.log('⚠️  Database already contains data. Use --clear flag to reset.');
      console.log(`   Users: ${existingUsers.length}, Songs: ${existingSongs.length}`);
      await mongoose.disconnect();
      return;
    }
    
    // Create sample data
    const users = await createSampleUsers();
    const adminUser = users.find(user => user.username === 'admin');
    const songs = await createSampleSongs(adminUser);
    
    // Display summary
    displaySummary(users, songs);
    
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// Command line interface
if (require.main === module) {
  const clearFirst = process.argv.includes('--clear') || process.argv.includes('-c');
  
  if (clearFirst) {
    console.log('🚨 Warning: This will clear all existing data!');
  }
  
  initializeDatabase(clearFirst);
}

module.exports = {
  initializeDatabase,
  createSampleUsers,
  createSampleSongs,
  clearDatabase,
  sampleUsers,
  sampleSongs
}; 