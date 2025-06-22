const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  tags: [String],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User',required: false },
  comments: [{
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  timestamp: { type: Date, default: Date.now }

}],
testCases: [
    {
      input: String,
      expectedOutput: String
    }
  ]

}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
