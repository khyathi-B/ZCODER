const mongoose = require('mongoose');

const solutionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  problem: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  code: String,
  language: String,
  createdAt: { type: Date, default: Date.now },
  visibility: { 
    type: String, 
    enum: ['private', 'peers', 'public'], 
    default: 'private' 
  }

});

module.exports = mongoose.model('Solution', solutionSchema);
