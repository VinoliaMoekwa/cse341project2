const { ObjectId } = require('mongodb');
const { body, param } = require('express-validator');


const validateOrder = [
    body('customerName').notEmpty().withMessage('Customer name is required'),
    body('quantity').isInt({ gt: 0 }).withMessage('Quantity must be a positive integer'),
    body('totalPrice').isFloat({ gt: 0 }).withMessage('Total price must be a positive number'),
    body('orderDate').isISO8601().withMessage('Order date must be a valid date'),
];

const validateProduct = [
   body('name').notEmpty().withMessage('Product name is required'),
    body('category').notEmpty().withMessage('Category is required'),
    body('price').isFloat({ gt: 0 }).withMessage('Price must be a positive number'),
    body('stock').isInt({ min: 0 }).withMessage('Stock must be a non-negative integer'),
];

const validateId = param('id').custom((value) => {
    if (!ObjectId.isValid(value)) {
        throw new Error('Invalid ID format');
    }
    return true;
});

module.exports = { validateOrder, validateProduct, validateId };
