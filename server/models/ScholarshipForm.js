const mongoose = require('mongoose');

const scholarshipFormSchema = new mongoose.Schema({
  name: String,
  age: Number,
  gender: String,
  nationality: String,
  location: String,
  tenthLocation: String,
  twelfthLocation: String,
  universityOrCollege: String,
  course: String,
  currentYear: String,
  grade: Number,
  annualIncome: Number,
  // For scraping
  amount: String,
  deadline: String,
  description: String,
  applicationLink: String,
  source: String,
  incomeLimit: Number,
  specialCategory: String
});

module.exports = mongoose.model('ScholarshipForm', scholarshipFormSchema);