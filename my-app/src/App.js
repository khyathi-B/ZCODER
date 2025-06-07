//import logo from './logo.svg';
//import './App.css';

// In React (e.g., App.js or any component)
import React, { useState } from 'react';

// List of states, union territories, and prominent countries
const locations = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim",
  "Tamil Nadu", "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand",
  "West Bengal", "Delhi", "Jammu and Kashmir", "Ladakh", "Puducherry",
  "Chandigarh", "Andaman and Nicobar Islands", "Dadra and Nagar Haveli",
  "Daman and Diu", "Lakshadweep",
  "USA", "Malaysia", "UK", "Canada", "Australia"
];

const nationalities = [
  "Indian", "American", "British", "Canadian", "Australian", "Other"
];

const genders = [
  "Male", "Female", "LGBTQ"
];

const courses = [
  "BTech", "BSc", "BA", "BCom", "MBBS", "MTech", "MSc", "MA", "MBA", "MD", "PhD", "Class 10", "Class 11", "Class 12"
];

const ScholarshipForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    nationality: '',
    location: '',
    tenthLocation: '',
    twelfthLocation: '',
    universityOrCollege: '',
    course: '',
    currentYear: '',
    grade: '',
    annualIncome: ''
  });
  const [eligibleScholarships, setEligibleScholarships] = useState([]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });

  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  
  const filteredData = {};
  Object.keys(formData).forEach(key => {
    if (formData[key] !== '') {
      filteredData[key] = formData[key];
    }
  });

  if (filteredData.age) {
    filteredData.age = parseInt(filteredData.age, 10);
  }
  if (filteredData.annualIncome) {
    filteredData.annualIncome = parseInt(filteredData.annualIncome, 10);
  }

  try {
    const response = await fetch('http://localhost:5000/api/scholarships/filter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filteredData)
    });
    const data = await response.json();
    console.log('Eligible Scholarships:', data.scholarships);
    setEligibleScholarships(data.scholarships);
  } catch (error) {
    console.error('Error:', error);
  }
};

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f0f4f8', padding: '20px' }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        borderRadius: '8px',
        padding: '20px'
      }}>
        <h2 style={{ textAlign: 'center', fontSize: '24px', color: '#333', marginBottom: '20px' }}>Scholarship Search</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px' }}>
            {/* Name */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Enter your name"
              />
            </div>
            {/* Age */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Age</label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Enter your age"
              />
            </div>
            {/* Gender */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Gender</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Gender</option>
                {genders.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>
            {/* Nationality */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Nationality</label>
              <select
                name="nationality"
                value={formData.nationality}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Nationality</option>
                {nationalities.map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            {/* Current Location */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Current Location</label>
              <select
                name="location"
                value={formData.location}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* 10th Location */}
            <div style={{ flex: '1 1 45%' }}>
              <label>10th Location</label>
              <select
                name="tenthLocation"
                value={formData.tenthLocation}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select 10th Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* 12th Location */}
            <div style={{ flex: '1 1 45%' }}>
              <label>12th Location</label>
              <select
                name="twelfthLocation"
                value={formData.twelfthLocation}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select 12th Location</option>
                {locations.map((loc) => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
            </div>
            {/* University/College */}
            <div style={{ flex: '1 1 45%' }}>
              <label>University/College</label>
              <input
                type="text"
                name="universityOrCollege"
                value={formData.universityOrCollege}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Enter your university/college"
              />
            </div>
            {/* Course */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Course</label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            {/* Current Year */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Current Year</label>
              <select
                name="currentYear"
                value={formData.currentYear}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              >
                <option value="">Select Year</option>
                {[1, 2, 3, 4].map((y) => (
                  <option key={y} value={y}>{y} Year</option>
                ))}
              </select>
            </div>
            {/* CGPA */}
            <div style={{ flex: '1 1 45%' }}>
              <label>CGPA (up to 2 decimals)</label>
              <input
                type="number"
                name="grade"
                step="0.01"
                max="10"
                value={formData.grade}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="e.g. 7.85"
              />
            </div>
            {/* Annual Income */}
            <div style={{ flex: '1 1 45%' }}>
              <label>Annual Income</label>
              <input
                type="number"
                name="annualIncome"
                value={formData.annualIncome}
                onChange={handleChange}
                style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                placeholder="Annual Income"
              />
            </div>
          </div>
          <div style={{ textAlign: 'center', marginTop: '20px' }}>
            <button
              type="submit"
              style={{
                backgroundColor: '#007bff',
                color: '#fff',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Find Scholarships
            </button>
          </div>
        </form>
      </div>
      <div style={{ marginTop: '20px' }}>
  <h3>Eligible Scholarships:</h3>
  {eligibleScholarships.length > 0 ? (
    <ul>
      {eligibleScholarships.map((scholarship, index) => (
        <li key={index} style={{ marginBottom: '10px', listStyleType: 'none', backgroundColor: '#f9f9f9', padding: '10px', borderRadius: '4px' }}>
          <strong>{scholarship.name}</strong><br />
          Amount: {scholarship.amount || 'N/A'}<br />
          Deadline: {scholarship.deadline || 'N/A'}<br />
          <a href={scholarship.link} target="_blank" rel="noopener noreferrer">View Scholarship</a>
        </li>
      ))}
    </ul>
  ) : (
    <p>No scholarships found.</p>
  )}
</div>

    </div>
  );
};

export default ScholarshipForm;