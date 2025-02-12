
const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
const mongoose = require('mongoose'); // Ensure mongoose is imported
const bodyParser = require('body-parser');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongodb = require('./data/database');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const GitHubStrategy = require('passport-github2').Strategy;
const errorHandler = require('./middleware/errorHandler');
const { isAuthenticated } = require('./middleware/authenticate');
const routes = require('./routes/index');

const app = express();
const PORT = process.env.PORT || 3000;

// --- MIDDLEWARE SETUP --- //

// Parse JSON request bodies
app.use(bodyParser.json());

// Log environment variables to verify they are loaded correctly
console.log('MONGODB_URL:', process.env.MONGODB_URL);
console.log('DB_NAME:', process.env.DB_NAME);
console.log('GITHUB_CLIENT_SECRET:', process.env.GITHUB_CLIENT_SECRET);
console.log('GITHUB_CLIENT_ID:', process.env.GITHUB_CLIENT_ID);
console.log('CALLBACK_URL:', process.env.CALLBACK_URL);

// MongoDB connection
mongoose.connect(process.env.MONGODB_URL)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Configure CORS to allow credentials (cookies) to be sent.
// Replace 'http://localhost:3000' with your actual Swagger UI origin if needed.
app.use(cors({
  origin: 'https://cse341project2-8qb2.onrender.com', // adjust if your client is hosted elsewhere
  credentials: true,
}));

// Session configuration using MongoDB as the store
app.use(session({
  secret: process.env.GITHUB_CLIENT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  proxy: true, // Important for deployments behind a proxy (like Render)
  cookie: { 
    secure: process.env.NODE_ENV === 'production', // Secure cookies only in production
    httpOnly: true, // Prevents client-side JavaScript access to cookies
    sameSite: 'lax' // Adjust if needed for cross-origin issues
  },
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL, // Ensure this is defined in your .env file
    ttl: 14 * 24 * 60 * 60, // 14 days in seconds
  }),
}));


// Initialize Passport and use session support.
app.use(passport.initialize());
app.use(passport.session());

// --- PASSPORT CONFIGURATION --- //

// Configure the GitHub strategy.
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL.trim()
  },
  (_accessToken, _refreshToken, profile, done) => {
    console.log("GitHub Strategy Callback - Profile:", profile);
    // In a real app, you might save the user to your DB here.
    return done(null, profile);
  }
)); 

// Serialize the entire user object into the session.
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize the user object from the session.
passport.deserializeUser((user, done) => {
  done(null, user);
});

// --- ROUTES & API DOCUMENTATION --- //

// Serve Swagger API docs at /api-docs.
// Use the routes
app.use('/', routes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Simple home route to show login status.
app.get('/', (req, res) =>
  res.send(req.isAuthenticated() ? `Logged in as ${req.user.displayName}` : "Logged Out")
);

// GitHub callback route: after authentication, Passport populates req.user.
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    console.log("User after GitHub callback:", req.user);
    res.redirect('/');
  }
);

// --- DEBUG MIDDLEWARE --- //
// This middleware logs the session and user for every request (remove in production)
app.use((req, res, next) => {
  console.log("Request session:", req.session);
  console.log("Request user:", req.user);
  next();
});

// Protected route example.
app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});

// Mount additional routes.
app.use('/', routes);

// Error handling middleware (should be last).
app.use(errorHandler);

// --- DATABASE CONNECTION & SERVER START --- //
mongodb.initDb((err) => {
  if (err) {
    console.error('❌ Failed to connect to the database:', err);
  } else {
    console.log('✅ Database connected');
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  }
});
