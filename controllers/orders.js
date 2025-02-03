const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const { Database } = require('mongo');

const getAllOrders = async (req, res) => {
    //swagger.tags=['Orders']
    console.log('ordersController.getAll called');
    const db = mongodb.getDatabase();
    const result = await db.collection('orders').find();
    const orders = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(orders);
};

const getSingleOrder = async (req, res) => {
    console.log(`ordersController.getSingleOrder called with id: ${req.params.id}`);

    if (!ObjectId.isValid(req.params.id)) {
        return res.status(400).json({ message: 'Invalid order id format' });
    }
    
    const orderId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    
    try {
        const result = await db.collection('orders').findOne({ _id: orderId });
        if (result) {
            res.setHeader('Content-Type', 'application/json');
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: 'Order not found' });
        }
    } catch (err) {
        console.error('Error fetching order:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
};

const createOrder = async (req, res) => {
    // Construct the order from the request body
    const order = {
        customerName: req.body.customerName,
        quantity: req.body.quantity,
        totalPrice: req.body.totalPrice,
        orderDate: req.body.orderDate,
        shippingAddress: req.body.shippingAddress,
        province: req.body.province
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('orders').insertOne(order);

        // Check if the insertion was acknowledged by MongoDB
        if (response.acknowledged) {
            // Return the inserted document's data (including its new _id)
            res.status(201).json({ _id: response.insertedId, ...order });
        } else {
            res.status(500).json({ message: "Some error occurred while creating the order." });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};


const updateOrder = async (req, res) => {
    //swagger.tags=['Orders']
    const orderId = new ObjectId(req.params.id);
    const updateOrder = {
        customerName: req.body.customerName,
        quantity: req.body.quantity,
        totalPrice: req.body.totalPrice,
        orderDate: req.body.orderDate,
        shippingAddress: req.body.shippingAddress,
        province: req.body.province
    };
    console.log('Request body:', req.body); 

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('orders').updateOne({ _id: orderId }, { $set: updateOrder });

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Order could not updated" });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

const deleteOrder= async (req, res) => {
    //swagger.tags=['Orders']
    const orderId = new ObjectId(req.params.id);

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('orders').deleteOne({ _id: orderId });

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
    getAllOrders,
    getSingleOrder,
    createOrder,
    updateOrder,
    deleteOrder
};