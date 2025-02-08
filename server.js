const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
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

// --- Middleware Setup --- //

// Parse JSON request bodies
app.use(bodyParser.json());

// Configure CORS to allow credentials (cookies) to be sent
app.use(cors({
  origin: true, // You can restrict this to your frontend domain if needed
  credentials: true,
}));

// Session configuration using MongoDB as the store
app.use(session({
  secret: process.env.GITHUB_CLIENT_SECRET || 'secret',
  resave: false,
  saveUninitialized: false,
  cookie: { secure: process.env.NODE_ENV === 'production' }, // secure cookies in production
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URL, // MongoDB connection string from .env
    ttl: 14 * 24 * 60 * 60, // 14 days in seconds
  }),
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());
app.use(passport.session());

// --- Passport Configuration --- //

// GitHub Strategy configuration
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL,
  },
  (accessToken, refreshToken, profile, done) => {
    // Here, you might update or save user info to your DB.
    return done(null, profile);
  }
));

// Serialize & Deserialize User for session persistence.
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// --- Routes & Swagger --- //

// Swagger API docs at /api-docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// A simple home route that shows login status
app.get('/', (req, res) =>
  res.send(req.isAuthenticated() ? `Logged in as ${req.user.displayName}` : "Logged Out")
);

// GitHub callback route: after successful authentication, redirect to home.
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    // Passport automatically attaches the user to req.user.
    res.redirect('/');
  }
);

// Protected route example: only accessible when authenticated.
app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});

// Mount additional routes.
app.use('/', routes);

// Error handling middleware (should be the last middleware).
app.use(errorHandler);

// --- Database Connection & Server Start --- //

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
