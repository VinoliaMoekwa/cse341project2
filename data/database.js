const dotenv = require('dotenv');
dotenv.config();

const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;
let database;

const initDb = (callback) => {
    if (database) {
        console.log('Db is already initialized');
        return callback(null, database);
    }
    MongoClient.connect(process.env.MONGODB_URL)
        .then(client => {
            console.log('Connected to MongoDB');
            database = client.db(process.env.project2);
            callback(null, database);
        })
        .catch(err => {
            console.error('Failed to connect to MongoDB', err);
            callback(err);
        });
};

const getDatabase = () => {
    if (!database) {
        throw Error('Db is not initialized');
    }
    return database;
};

module.exports = {
    initDb,
    getDatabase
};
