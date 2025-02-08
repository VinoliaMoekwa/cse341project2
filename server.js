// server.js
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

// Parse JSON bodies
app.use(bodyParser.json());

// Configure CORS so that credentials (cookies) are allowed.
// Adjust the "origin" option if you know your client’s URL.
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Session configuration using MongoDB as store
app.use(
  session({
    secret: process.env.GITHUB_CLIENT_SECRET || 'secret',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: process.env.NODE_ENV === 'production' }, // In dev, secure: false
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URL, // Ensure this is defined in your .env file
      ttl: 14 * 24 * 60 * 60, // 14 days in seconds
    }),
  })
);

// Initialize Passport and let it use session support.
app.use(passport.initialize());
app.use(passport.session());

// --- Passport Configuration --- //

// GitHub Strategy configuration
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.CALLBACK_URL,
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("GitHub Strategy called. Profile:", profile);
      // You could perform DB operations here.
      return done(null, profile);
    }
  )
);

// Serialize & Deserialize: storing the entire user object (for simplicity)
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

// --- Routes & API Documentation --- //

// Swagger docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// A simple home route that shows login status.
app.get('/', (req, res) => {
  res.send(req.isAuthenticated() ? `Logged in as ${req.user.displayName}` : "Logged Out");
});

// GitHub callback route: after authentication, Passport will populate req.user.
app.get(
  '/github/callback',
  passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
  (req, res) => {
    console.log("User after GitHub callback:", req.user);
    res.redirect('/');
  }
);

// --- Debug Middleware --- //
// Log session and user data for every request to help with debugging.
app.use((req, res, next) => {
  console.log("Request Session:", req.session);
  console.log("Request User:", req.user);
  next();
});

// Protected route: only accessible if authenticated.
app.get('/protected', isAuthenticated, (req, res) => {
  res.json({ message: "You have access to this protected route", user: req.user });
});

// Mount additional routes from routes/index.js
app.use('/', routes);

// Error handling middleware (should be last).
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
