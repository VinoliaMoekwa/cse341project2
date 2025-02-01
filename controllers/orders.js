const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');

const getAll = async (req, res) => {
    //swagger.tags=['Orders']
    console.log('ordersController.getAll called');
    const db = mongodb.getDatabase();
    const result = await db.collection('orders').find();
    const orders = await result.toArray();
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(orders);
};

const getSingle = async (req, res) => {
    //swagger.tags=['Orders']
    console.log(`ordersController.getSingle called with id: ${req.params.id}`);
    const orderId = new ObjectId(req.params.id);
    const db = mongodb.getDatabase();
    const result = await db.collection('orders').findOne({ _id: orderId });
    if (result) {
        res.setHeader('Content-Type', 'application/json');
        res.status(200).json(result);
    } else {
        res.status(404).json({ message: 'Order not found' });
    }
};

const createOrder = async (req, res) => {
    //swagger.tags=['Orders']
    const order = {
        customer_name: req.body.customerName,
        quantity: req.body.quantity,
        total_price: req.body.totalPrice,
        order_date: req.body.orderDate,
        shipping_address: req.body.shippingAddress,
        province: req.body.province
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('orders').insertOne(order);

        if (response.insertedCount > 0) {
            res.status(201).json(response.ops[0]);
        } else {
            res.status(500).json({ message: "Some error occurred while creating the contact." });
        }
    } catch (err) {
        res.status(500).json({ message: "An error occurred", error: err.message });
    }
};

const updateOrder = async (req, res) => {
    //swagger.tags=['Orders']
    const orderId = new ObjectId(req.params.id);
    const updateOrder = {
        customer_name: req.body.customerName,
        quantity: req.body.quantity,
        total_price: req.body.totalPrice,
        order_date: req.body.orderDate,
        shipping_address: req.body.shippingAddress,
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
    getAll,
    getSingle,
    createOrder,
    updateOrder,
    deleteOrder
};