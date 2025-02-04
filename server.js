const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json'); 

const app = express(); 

app.use(bodyParser.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); 

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Z-key');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
});

app.use('/', routes);

const port = process.env.PORT || 3000;
console.log('Using port:', port);

mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize database', err);
    } else {
        console.log('Database initialized');
        // Bind to 0.0.0.0 to listen on all network interfaces
        app.listen(port, '0.0.0.0', () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});
