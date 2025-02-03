const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getAllProducts = async (req, res) => {
    //swagger.tags=['Products']
    console.log('productsController.getAll called');
    const db = mongodb.getDatabase();
    const result = await db.collection('products').find();
    const products = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(products);
};

const getSingleProduct = async (req, res) => {
    //swagger.tags=['Products']
    console.log(`productsController.getSingle called with id: ${req.params.id}`);
    const productId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const result = await db.collection('products').findOne({ _id: productId });
    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'product not found' });
    }
};

const createProduct = async (req, res) => {
    // Construct the order from the request body
    const product = {
        name: req.body.name,
        category: req.body.catergory,
        price: req.body.price,
        stock: req.body.stock,
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').insertOne(product);

        // Check if the insertion was acknowledged by MongoDB
        if (response.acknowledged) {
            // Return the inserted document's data (including its new _id)
            res.status(201).json({ _id: response.insertedId, ...product });
        } else {
            res.status(500).json({ message: "Some error occurred while creating the order." });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};


const updateProduct = async (req, res) => {
    //swagger.tags=['Products']
    const productId = new ObjectId(req.params.id);
    const updateProduct = {
        name: req.body.name,
        category: req.body.category,
        price: req.body.price,
        stock: req.body.stock,
    
    };
    console.log('Request body:', req.body); 

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').updateOne({ _id: productId }, { $set: updateProduct });

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Product  could not updated" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

const deleteProduct= async (req, res) => {
    //swagger.tags=['Products']
    const productId = new ObjectId(req.params.id);

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('products').deleteOne({ _id:productId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Order not found" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

module.exports = {
    getAllProducts,
    getSingleProduct,
    createProduct,
    updateProduct,
    deleteProduct
};