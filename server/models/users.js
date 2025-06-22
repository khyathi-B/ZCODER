const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  bookmarks: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Problem' }],

connections: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],  
peerRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], 
  solutions: [{
  problemId: { type: mongoose.Schema.Types.ObjectId, ref: 'Problem' },
  code: String,
  language: String,
  timestamp: { type: Date, default: Date.now }
}],

});
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);

