const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./data/database');
const routes = require('./routes');

const app = express();

app.use(bodyParser.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origional','' );
    res.setHeader(
        'Acess-Control-Allow-Headers',
        'Origional, X-Requested-With, Content-Type, Accept, Z-key'
    );
    res.setHeader('Acess-Control-Allow-Method', 'GET, POST, PUT, DELETE,OPTIONS' );
    next();
});

app.use('/', routes);


const port = process.env.PORT || 3000;

mongodb.initDb((err) => {
    if (err) {
        console.error('Failed to initialize database', err);
    } else {
        console.log('Database initialized');
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});