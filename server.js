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
const { isAuthenticated } = require('./middleware/authenticate'); // Correct import
const errorHandler = require('./middleware/errorHandler');
const routes = require('./routes/index');



const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Session configuration using MongoDB as store
app.use(
    session({
        secret: process.env.GITHUB_CLIENT_SECRET || "secret",
        resave: false,
        saveUninitialized: false,
        store: MongoStore.create({
            mongoUrl: process.env.MONGODB_URL, // MongoDB connection string from .env
            ttl: 14 * 24 * 60 * 60, // Session expiration time in seconds (14 days)
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

// Passport GitHub Strategy
passport.use(
    new GitHubStrategy(
        {
            clientID: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            callbackURL: process.env.CALLBACK_URL,
        },
        function (accessToken, refreshToken, profile, done) {
            return done(null, profile);
        }
    )
);

// Serialize & Deserialize User
passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Authentication Routes
app.get('/', (req, res) =>
    res.send(req.session.user ? `Logged in as ${req.session.user.displayName}` : "Logged Out")
);

app.get(
    '/github/callback',
    passport.authenticate('github', { failureRedirect: '/api-docs', session: true }),
    (req, res) => {
        req.session.user = req.user; // Store user in session
        res.redirect('/');
    }
);

// CORS Headers
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Protected Route Example
app.get('/protected', isAuthenticated, (req, res) => {
    res.json({ message: "You have access to this protected route", user: req.session.user });
});

// Routes
app.use('/', routes);

// Error Handling Middleware
app.use(errorHandler);

// Database Connection & Server Start
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
