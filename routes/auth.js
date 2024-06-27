// const express = require('express');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// // Endpoint to check authentication status
// router.get('/check-auth', (req, res) => {
//   const jwtToken = req.cookies.jwtToken;
//   const adminJwtToken = req.cookies.adminJwtToken; // Add this line for admin token
//   console.log('JWT Token:', jwtToken);
//   console.log('Admin JWT Token:', adminJwtToken); // Add this line for admin token

//   if (!jwtToken && !adminJwtToken) {
//     console.log('JWT token not found');
//     res.status(401).json({ authenticated: false });
//     return;
//   }

//   if (jwtToken) {
//     jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
//       if (err) {
//         console.error('Error verifying JWT token:', err);
//         res.status(401).json({ authenticated: false });
//       } else {
//         console.log('User authenticated:', decoded);
//         req.user = decoded;
//         res.json({ authenticated: true, userType: 'user' });
//       }
//     });
//   } else if (adminJwtToken) {
//     jwt.verify(adminJwtToken, process.env.JWT_SECRET_KEY_ADMIN, (err, decoded) => {
//       if (err) {
//         console.error('Error verifying admin JWT token:', err);
//         res.status(401).json({ authenticated: false });
//       } else {
//         console.log('Admin authenticated:', decoded);
//         req.admin = decoded;
//         res.json({ authenticated: true, userType: 'admin' });
//       }
//     });  
//   }
// });

// module.exports = router;


const express = require('express');
const jwt = require('jsonwebtoken');
const mysql = require('mysql');
const router = express.Router();

// Create a MySQL database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('Connected to the database');
  }
});

// Endpoint to check authentication status
router.get('/check-auth', (req, res) => {
  const jwtToken = req.cookies.jwtToken;
  const adminJwtToken = req.cookies.adminJwtToken;

  console.log('JWT Token:', jwtToken);
  console.log('Admin JWT Token:', adminJwtToken);

  if (!jwtToken && !adminJwtToken) {
    console.log('JWT token not found');
    res.status(401).json({ authenticated: false });
    return;
  }

  const verifyToken = (token, secretKey, userType) => {
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        console.error('Error verifying JWT token:', err);
        res.status(401).json({ authenticated: false });
      } else {
        console.log(`${userType} authenticated:`, decoded);

        const userId = decoded.id;
        const query = `SELECT u.*, r.name as role_name FROM user u 
                       LEFT JOIN role r ON u.role_id = r.id 
                       WHERE u.id = ?`;

        db.query(query, [userId], (error, results) => {
          if (error) {
            console.error('Error fetching user from database:', error);
            res.status(500).json({ error: 'Database error' });
          } else if (results.length === 0) {
            res.status(401).json({ authenticated: false });
          } else {
            const user = results[0];
            req[userType] = user;
            res.json({ authenticated: true, userType, user });
          }
        });
      }
    });
  };

  if (jwtToken) {
    verifyToken(jwtToken, process.env.JWT_SECRET_KEY, 'user');
  } else if (adminJwtToken) {
    verifyToken(adminJwtToken, process.env.JWT_SECRET_KEY_ADMIN, 'admin');
  }
});

module.exports = router;
