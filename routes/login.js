// const express = require('express');
// const db = require('../services/db');
// const jwt = require('jsonwebtoken');

// const router = express.Router();

// // Login route
// router.post('/', (req, res) => {
//   const { username, password } = req.body;

//   // Query the database to validate the username and password
//   const query = 'SELECT * FROM users WHERE Username = ? AND Password = ?';
//   db.query(query, [username, password], (err, result) => {
//     if (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }

//     // Check if the user exists
//     if (result.length === 0) {
//       console.log('Invalid username or password:', username);
//       res.status(401).json({ error: 'Invalid username or password' });
//       return;
//     }

//     // Generate and sign the JWT token
//     const user = result[0]; // Assuming the result contains the user data
//     const token = generateJwtToken(user.UserID, user.Username,'user');

    

//     console.log('Login successful:', username);

//     // Set the JWT token as an HTTP-only cookie in the response
//     res.cookie('jwtToken', token, {
//       httpOnly: true,
//       maxAge: 3600000, // 1 hour in milliseconds
//     });

//     // Return a success message to the client (optional)
//     res.json({ message: 'Login successful', userID: user.UserID, userType: 'user' });
//   });
// });

// // Function to generate a JWT token
// function generateJwtToken(userID, username, userType) {
//   const secretKey = process.env.JWT_SECRET_KEY;
//   const token = jwt.sign({ userID, username, userType, isAdmin: false }, secretKey, { expiresIn: '1h' });
//   return token;
// }

// module.exports = router;



// const express = require('express');
// const db = require('../services/db');
// const jwt = require('jsonwebtoken');
// const authUser = require('../routes/authUser'); // Import authUser middleware

// const router = express.Router();

// // Login route
// router.post('/', (req, res) => {
//   const { username, password } = req.body;

//   // Query the database to validate the username and password
//   const query = 'SELECT * FROM user WHERE username = ? AND password = ?';
//   db.query(query, [username, password], async (err, result) => {
//     if (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }

//     // Check if the user exists and credentials are correct
//     if (result.length === 0) {
//       console.log('Invalid username or password:', username);
//       res.status(401).json({ error: 'Invalid username or password' });
//       return;
//     }

//     // Assuming the result contains the user data
//     const user = result[0];

//     try {
//       // Generate and sign the JWT token
//       const token = generateJwtToken(user.id, user.username, 'user');

//       console.log('Login successful:', username);

//       // Set the JWT token as an HTTP-only cookie in the response
//       res.cookie('jwtToken', token, {
//         httpOnly: true,
//         maxAge: 3600000, // 1 hour in milliseconds
//       });

//       // Return a success message to the client
//       res.json({ message: 'Login successful', userID: user.id, userType: 'user' });
//     } catch (err) {
//       console.error('Error generating JWT token:', err);
//       res.status(500).json({ error: 'Failed to generate JWT token' });
//     }
//   });
// });

// // Function to generate a JWT token
// function generateJwtToken(userID, username, userType) {
//   const secretKey = process.env.JWT_SECRET_KEY;
//   const token = jwt.sign({ userID, username, userType, isAdmin: false }, secretKey, { expiresIn: '1h' });
//   return token;
// }

// module.exports = router;






// const express = require('express');
// const db = require('../services/db');
// const jwt = require('jsonwebtoken');
// const authUser = require('../routes/authUser'); // Import authUser middleware

// const router = express.Router();

// // Login route
// router.post('/', (req, res) => {
//   const { usernameOrEmail, password } = req.body;

//   // Query the database to validate the username/email and password
//   const query = 'SELECT * FROM user WHERE (username = ? OR email_address = ?) AND password = ?';
//   db.query(query, [usernameOrEmail, usernameOrEmail, password], async (err, result) => {
//     if (err) {
//       console.error('Error executing SQL query: ', err);
//       res.status(500).json({ error: 'Internal server error' });
//       return;
//     }

//     // Check if the user exists and credentials are correct
//     if (result.length === 0) {
//       console.log('Invalid username/email or password:', usernameOrEmail);
//       res.status(401).json({ error: 'Invalid username/email or password' });
//       return;
//     }

//     // Assuming the result contains the user data
//     const user = result[0];

//     try {
//       // Generate and sign the JWT token
//       const token = generateJwtToken(user.id, user.username, 'user');

//       console.log('Login successful:', usernameOrEmail);

//       // Set the JWT token as an HTTP-only cookie in the response
//       res.cookie('jwtToken', token, {
//         httpOnly: true,
//         maxAge: 3600000, // 1 hour in milliseconds
//       });

//       // Return a success message to the client
//       res.json({ message: 'Login successful', userID: user.id, userType: 'user' });
//     } catch (err) {
//       console.error('Error generating JWT token:', err);
//       res.status(500).json({ error: 'Failed to generate JWT token' });
//     }
//   });
// });

// // Function to generate a JWT token
// function generateJwtToken(userID, username, userType) {
//   const secretKey = process.env.JWT_SECRET_KEY;
//   const token = jwt.sign({ userID, username, userType, isAdmin: false }, secretKey, { expiresIn: '1h' });
//   return token;
// }

// module.exports = router;







const express = require('express');
const db = require('../services/db');
const jwt = require('jsonwebtoken');
const authUser = require('../routes/authUser'); // Import authUser middleware

const router = express.Router();

// Login route
router.post('/', (req, res) => {
  const { usernameOrEmail, password } = req.body;

  // Query the database to validate the username/email and password
  const query = `
    SELECT u.*, r.name as role_name
    FROM user u
    LEFT JOIN role r ON u.role_id = r.id
    WHERE (u.username = ? OR u.email_address = ?) AND u.password = ?
  `;

  db.query(query, [usernameOrEmail, usernameOrEmail, password], async (err, result) => {
    if (err) {
      console.error('Error executing SQL query: ', err);
      res.status(500).json({ error: 'Internal server error' });
      return;
    }

    // Check if the user exists and credentials are correct
    if (result.length === 0) {
      console.log('Invalid username/email or password:', usernameOrEmail);
      res.status(401).json({ error: 'Invalid username/email or password' });
      return;
    }

    // Assuming the result contains the user data
    const user = result[0];

    try {
      // Generate and sign the JWT token
      const token = generateJwtToken(user.id, user.username, user.role_name);

      console.log('Login successful:', usernameOrEmail);

      // Set the JWT token as an HTTP-only cookie in the response
      res.cookie('jwtToken', token, {
        httpOnly: true,
        maxAge: 3600000, // 1 hour in milliseconds
        sameSite: 'none', // Adjust as per your CORS settings
        secure: true, // Requires HTTPS in production
      });
      

      // Return a success message to the client
      res.json({ message: 'Login successful', userID: user.id, userType: user.role_name });
    } catch (err) {
      console.error('Error generating JWT token:', err);
      res.status(500).json({ error: 'Failed to generate JWT token' });
    }
  });
});

// Function to generate a JWT token
function generateJwtToken(userID, username, userType) {
  const secretKey = process.env.JWT_SECRET_KEY;
  const token = jwt.sign({ userID, username, userType, isAdmin: false }, secretKey, { expiresIn: '1h' });
  return token;
}

module.exports = router;
