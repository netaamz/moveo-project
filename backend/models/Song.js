const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  artist: {
    type: String,
    trim: true
  },
  content: {
    type: [[{
      lyrics: { type: String, required: true },
      chords: { type: String, required: false }
    }]],
    required: true,
    validate: {
      validator: function(content) {
        return Array.isArray(content) && content.length > 0;
      },
      message: 'Content must be a non-empty array of lines'
    }
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }
}, {
  timestamps: true
});

// Create text indexes for better search
songSchema.index({ title: 'text', artist: 'text' });

// Instance method to get content 
songSchema.methods.getContent = function() {
  return {
    title: this.title,
    artist: this.artist,
    content: this.content,
  };
};

// Static method to search songs
songSchema.statics.search = async function(query) {
  // Normalize the query to handle both Hebrew and English
  const normalizedQuery = query.normalize('NFKC');
  
  try {
    // First try text search
    const textSearchResults = await this.find(
      { $text: { $search: normalizedQuery } },
      { score: { $meta: "textScore" } }
    ).sort({ score: { $meta: "textScore" } });

    if (textSearchResults.length > 0) {
      return textSearchResults;
    }
  } catch (error) {
    console.error('Search error:', error);
    // Fallback to basic regex search if text search fails
    const searchRegex = new RegExp(normalizedQuery, 'i');
    return await this.find({
      $or: [
        { title: searchRegex },
        { artist: searchRegex }
      ]
    });
  }
};

// Instance method to convert to JSON
songSchema.methods.toJSON = function() {
  const song = this.toObject();
  delete song.__v;
  return song;
};

const Song = mongoose.model('Song', songSchema);

module.exports = Song; 