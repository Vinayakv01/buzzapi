// const jwt = require('jsonwebtoken');

// const authUser = (req, res, next) => {
//   const jwtToken = req.cookies.jwtToken;

//   if (!jwtToken) {
//     // Handle unauthenticated requests
//     return res.status(401).json({ error: 'Authentication required' });
//   }

//   try {
//     const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
//     req.userID = decodedToken.userID;

//     // Log the userID for debugging purposes
//     console.log('UserID:', req.userID);

//     next();
//   } catch (err) {
//     console.error('Error verifying JWT token:', err);
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// module.exports = authUser;




const jwt = require('jsonwebtoken');
const mysql = require('mysql2/promise'); // Assuming you're using mysql2 for database connection

// Create a pool to manage multiple connections
const pool = mysql.createPool({
  host: 'localhost', // Adjust to your DB host if needed
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  port: process.env.DB_PORT,
});

const authUser = async (req, res, next) => {
  const jwtToken = req.cookies.jwtToken;

  if (!jwtToken) {
    // Handle unauthenticated requests
    return res.status(401).json({ error: 'Authentication required' });
  }

  try {
    const decodedToken = jwt.verify(jwtToken, process.env.JWT_SECRET_KEY);
    const userID = decodedToken.userID;

    // Log the userID for debugging purposes
    console.log('UserID:', userID);

    // Fetch user details from the database
    const [rows] = await pool.query('SELECT * FROM user WHERE id = ? AND active_status = 1', [userID]);

    if (rows.length === 0) {
      // Handle user not found or inactive
      return res.status(401).json({ error: 'User not found or inactive' });
    }

    // Attach user information to the request object
    req.user = rows[0];

    next();
  } catch (err) {
    console.error('Error verifying JWT token:', err);
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authUser;
