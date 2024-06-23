require('dotenv').config(); // This loads the .env file into process.env

const express = require('express');
const cookieParser = require('cookie-parser');
const db = require('./services/db'); // Adjust path as necessary
const authUser = require('./routes/authUser'); // Adjust path as necessary
const loginRoute = require('./routes/login'); // Adjust path as necessary
const checkAuthRoute = require('./routes/auth'); // Adjust path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/login', loginRoute);
app.use('/check-auth', authUser, checkAuthRoute); // Protected route using authUser middleware

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
