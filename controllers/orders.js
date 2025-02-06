const { ObjectId } = require('mongodb');
const mongodb = require('../data/database');
const { validationResult } = require('express-validator');


const getAllOrders = async (req, res, next) => {
    try {
        const db = mongodb.getDatabase();
        const orders = await db.collection('orders').find().toArray();
        res.status(200).json(orders);
    } catch (err) {
        next(err);
    }
};

const getSingleOrder = async (req, res, next) => {
    try {
        const orderId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const order = await db.collection('orders').findOne({ _id: orderId });

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.status(200).json(order);
    } catch (err) {
        next(err);
    }
};

const createOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

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

        if (response.acknowledged) {
            res.status(201).json({ _id: response.insertedId, ...order });
        } else {
            res.status(500).json({ message: "Error creating order." });
        }
    } catch (err) {
        next(err);
    }
};

const updateOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const orderId = new ObjectId(req.params.id);
    const updateOrder = {
        customerName: req.body.customerName,
        quantity: req.body.quantity,
        totalPrice: req.body.totalPrice,
        orderDate: req.body.orderDate,
        shippingAddress: req.body.shippingAddress,
        province: req.body.province
    };

    try {
        const db = mongodb.getDatabase();
        const response = await db.collection('orders').updateOne({ _id: orderId }, { $set: updateOrder });

        if (response.modifiedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Order not found or no changes made." });
        }
    } catch (err) {
        next(err);
    }
};

const deleteOrder = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const orderId = new ObjectId(req.params.id);
        const db = mongodb.getDatabase();
        const response = await db.collection('orders').deleteOne({ _id: orderId });

        if (response.deletedCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).json({ message: "Order not found." });
        }
    } catch (err) {
        next(err);
    }
};

module.exports = {
    getAllOrders,
    getSingleOrder,
    createOrder,
    updateOrder,
    deleteOrder
};
