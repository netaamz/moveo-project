const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const INSTRUMENTS = [
  'drums',
  'guitar',
  'bass',
  'saxophone',
  'keyboards',
  'vocals'
];

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  instrument: {
    type: String,
    required: true,
    enum: INSTRUMENTS
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', function(next) {
  if (!this.isModified('passwordHash')) return next();
  
  // If password is being set, hash it
  this.passwordHash = bcrypt.hashSync(this.passwordHash, 10);
  next();
});

// Instance method to validate password
userSchema.methods.validatePassword = function(password) {
  return bcrypt.compareSync(password, this.passwordHash);
};

// Instance method to convert to JSON (excluding password)
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.passwordHash;
  delete user.__v;
  return user;
};

// Static method to create user
userSchema.statics.createUser = async function(userData) {
  const { username, password, instrument, isAdmin } = userData;
  
  // Validate instrument
  if (!INSTRUMENTS.includes(instrument)) {
    throw new Error('Invalid instrument');
  }

  // Check if username already exists
  const existingUser = await this.findOne({ username });
  if (existingUser) {
    throw new Error('Username already exists');
  }

  const user = new this({
    username,
    passwordHash: password, // Will be hashed by pre-save middleware
    instrument,
    isAdmin: isAdmin || false
  });

  return await user.save();
};

// Static method to get instruments
userSchema.statics.getInstruments = function() {
  return INSTRUMENTS;
};

const User = mongoose.model('User', userSchema);

module.exports = User; 