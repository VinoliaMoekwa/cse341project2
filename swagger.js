const swaggerAutogen = require('swagger-autogen')();

const doc = {
    info: {
        title: 'Orders Api',
        description: 'Orders Api'   
    },
    info: {
        title: 'Products Api',
        description: 'Products Api'   
    },

    host: 'localhost:3000',
    schemes: ['https, http']
};

const outputFile = './swagger.json';
const endpointsFiles = ['./routes/index.js']

swaggerAutogen(outputFile, endpointsFiles,doc);