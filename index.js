// require('dotenv').config(); // This loads the .env file into process.env

// const express = require('express');
// const cookieParser = require('cookie-parser');
// const db = require('./services/db'); // Adjust path as necessary
// const authUser = require('./routes/authUser'); // Adjust path as necessary
// const loginRoute = require('./routes/login'); // Adjust path as necessary
// const checkAuthRoute = require('./routes/auth'); // Adjust path as necessary

// const app = express();
// const PORT = process.env.PORT || 3000;

// // Middleware
// app.use(express.json());
// app.use(cookieParser());

// // Routes
// app.use('/login', loginRoute);
// app.use('/check-auth', authUser, checkAuthRoute); // Protected route using authUser middleware

// // Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: 'Internal server error' });
// });

// // Start the server
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });





require('dotenv').config(); // This loads the .env file into process.env

const express = require('express');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const path = require('path');
const db = require('./services/db'); // Adjust path as necessary
const authUser = require('./routes/authUser'); // Adjust path as necessary
const loginRoute = require('./routes/login'); // Adjust path as necessary
const checkAuthRoute = require('./routes/auth'); // Adjust path as necessary
const logoutRoute = require('./routes/logout'); // Adjust path as necessary

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// CORS setup
app.use(cors({
  origin: ['http://192.168.1.14:5173', 'http://localhost:5173', 'http://100.107.70.7:5173', 'http://192.168.1.37:5173'],
  credentials: true,
}));

// Static files serving if needed
// Uncomment and adjust the path if you have static files to serve
// app.use('/uploads', cors(), express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/login', loginRoute);
app.use('/check-auth', authUser, checkAuthRoute); // Protected route using authUser middleware
app.use('/logout', logoutRoute); // Add logout route

// Default route
app.get("/", (req, res) => {
  res.json({ message: "API is running" });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// 404 handler for undefined routes
app.use((req, res, next) => {
  res.status(404).json({ error: 'Not Found' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
