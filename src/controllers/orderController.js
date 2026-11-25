const Order = require('../models/Order');
const Cart = require('../models/Cart');
const Product = require('../models/Product');

// POST /api/orders - Create new order from cart with simulated payment
const createOrder = async (req, res) => {
    try {
        const { shippingAddress, paymentMethod = 'Simulated Card' } = req.body;

        if (!shippingAddress || !shippingAddress.address || !shippingAddress.city || !shippingAddress.postalCode || !shippingAddress.country) {
            return res.status(400).json({
                success: false,
                message: 'Complete shipping address is required'
            });
        }

        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Your cart is empty'
            });
        }

        const orderItems = [];
        let totalPrice = 0;

        for (const item of cart.items) {
            const product = item.product;
            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: 'One or more products in your cart no longer exist'
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Insufficient stock for ${product.name}`
                });
            }

            orderItems.push({
                product: product._id,
                name: product.name,
                price: product.price,
                quantity: item.quantity
            });

            totalPrice += product.price * item.quantity;

            // Deduct stock
            product.stock -= item.quantity;
            await product.save();
        }

        // Simulate payment transaction
        const simulatedPayment = {
            transactionId: `TXN_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
            status: 'Paid',
            paidAt: new Date()
        };

        const order = await Order.create({
            user: req.user._id,
            items: orderItems,
            shippingAddress,
            paymentMethod,
            paymentResult: simulatedPayment,
            totalPrice,
            orderStatus: 'Processing'
        });

        // Clear user's cart after successful order
        cart.items = [];
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order placed and payment simulated successfully',
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Order creation failed',
            error: error.message
        });
    }
};

// GET /api/orders - Get logged-in user's order history
const getUserOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch orders',
            error: error.message
        });
    }
};

// GET /api/orders/:id - Get single order details
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('user', 'name email');

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        // Ensure users can only view their own orders (unless admin)
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this order'
            });
        }

        res.json({
            success: true,
            data: order
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to fetch order details',
            error: error.message
        });
    }
};

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById
};