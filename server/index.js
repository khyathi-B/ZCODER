const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect("mongodb://127.0.0.1:27017/scholarshipDB", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Scholarship Schema
const scholarshipSchema = new mongoose.Schema({
    link: String,
    name: String,
    amount: String,
    deadline: String,
    source: String,
    age: Number,           
    gender: String,       
    income: Number,        
    nationality: String,
    location: String,
    tenthlocation: String,
    twelthlocation: String,
    grade: Number,
    currentYear: String,
    course: String,
    universityOrCollege: String
});


const Scholarship = mongoose.model('Scholarship', scholarshipSchema, 'scholarshipsavail');



// POST Route to handle form submissions & find matching scholarships
app.post('/api/scholarships/filter', async (req, res) => {
  try {
    const userDetails = req.body;
    const filter = {};

    const andConditions = [];

    // Age
    if (userDetails.age !== undefined && userDetails.age !== "") {
      
      andConditions.push({
        $or: [
          { age: { $exists: false } },
          { age: { $lte: userDetails.age } }
        ]
      });
    } else {
      
      andConditions.push({
        age: { $exists: false }
      });
    }

    // Gender
    if (userDetails.gender !== undefined && userDetails.gender !== "") {
      andConditions.push({
        $or: [
          { gender: { $exists: false } },
          { gender: { $in: ['any', userDetails.gender] } }
        ]
      });
    } else {
      andConditions.push({
        gender: { $exists: false }
      });
    }

    // Income
    if (userDetails.income !== undefined && userDetails.income !== "") {
      andConditions.push({
        $or: [
          { income: { $exists: false } },
          { income: { $gte: userDetails.income } }
        ]
      });
    } else {
      andConditions.push({
        income: { $exists: false }
      });
    }

    // Location
    if (userDetails.location !== undefined && userDetails.location !== "") {
      andConditions.push({
        $or: [
          { location: { $exists: false } },
          { location: { $in: [userDetails.location, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        location: { $exists: false }
      });
    }

    // Tenth Location
    if (userDetails.tenthlocation !== undefined && userDetails.tenthlocation !== "") {
      andConditions.push({
        $or: [
          { tenthlocation: { $exists: false } },
          { tenthlocation: { $in: [userDetails.tenthlocation, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        tenthlocation: { $exists: false }
      });
    }

    // Twelfth Location
    if (userDetails.twelfthlocation !== undefined && userDetails.twelfthlocation !== "") {
      andConditions.push({
        $or: [
          { twelthlocation: { $exists: false } },
          { twelthlocation: { $in: [userDetails.twelfthlocation, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        twelthlocation: { $exists: false }
      });
    }

    // Grade
    if (userDetails.grade !== undefined && userDetails.grade !== "") {
      andConditions.push({
        $or: [
          { grade: { $exists: false } },
          { grade: { $lte: userDetails.grade } }
        ]
      });
    } else {
      andConditions.push({
        grade: { $exists: false }
      });
    }

    // Current Year
    if (userDetails.currentYear !== undefined && userDetails.currentYear !== "") {
      andConditions.push({
        $or: [
          { currentYear: { $exists: false } },
          { currentYear: { $in: [userDetails.currentYear, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        currentYear: { $exists: false }
      });
    }

    // Nationality
    if (userDetails.nationality !== undefined && userDetails.nationality !== "") {
      andConditions.push({
        $or: [
          { nationality: { $exists: false } },
          { nationality: { $in: [userDetails.nationality, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        nationality: { $exists: false }
      });
    }

    // Course
    if (userDetails.course !== undefined && userDetails.course !== "") {
      andConditions.push({
        $or: [
          { course: { $exists: false } },
          { course: { $in: [userDetails.course, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        course: { $exists: false }
      });
    }
    if (userDetails.universityOrCollege !== undefined && userDetails.universityOrCollege !== "") {
      andConditions.push({
        $or: [
          { course: { $exists: false } },
          { course: { $in: [userDetails.universityOrCollege, 'any'] } }
        ]
      });
    } else {
      andConditions.push({
        course: { $exists: false }
      });
    }

    // Combine all AND conditions
    filter.$and = andConditions;

    const matchingScholarships = await Scholarship.find(filter);

    res.status(200).json({ scholarships: matchingScholarships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
});



// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});