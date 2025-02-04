const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const mongodb = require('./data/database');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Swagger API Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// CORS Headers (if not using cors() package)
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

// Import Routes
const productsRoutes = require('./routes/products');
const ordersRoutes = require('./routes/orders');

app.use('/products', productsRoutes);
app.use('/orders', ordersRoutes);

// Global Error Handler
const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

// Database Connection & Start Server
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
