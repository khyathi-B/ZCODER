// import React, { useEffect, useState } from 'react';

// const ScholarshipList = () => {
//   const [scholarships, setScholarships] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:5000/scholarships')
//       .then(response => response.json())
//       .then(data => setScholarships(data))
//       .catch(error => console.error(error));
//   }, []);

//   return (
//     <div>
//       <h1>Scholarship List</h1>
//       <ul>
//         {scholarships.map((scholarship, index) => (
//           <li key={index}>
//             <h2>{scholarship.name}</h2>
//             <p>Amount: {scholarship.amount}</p>
//             <p>Deadline: {scholarship.deadline}</p>
//             <p>Description: {scholarship.description}</p>
//             <a href={scholarship.applicationLink} target="_blank" rel="noopener noreferrer">
//               Apply Here
//             </a>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default ScholarshipList;