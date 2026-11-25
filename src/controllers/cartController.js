const Cart = require('../models/Cart');
const Product = require('../models/Product');

// GET /api/cart - Get user's cart
const getCart = async (req, res) => {
    try {
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.product', 'name price category stock');

        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const totalPrice = cart.items.reduce((acc, item) => {
            if (item.product) {
                return acc + item.product.price * item.quantity;
            }
            return acc;
        }, 0);

        res.json({
            success: true,
            data: {
                _id: cart._id,
                items: cart.items,
                totalPrice
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error',
            error: error.message
        });
    }
};

// POST /api/cart - Add item to cart
const addToCart = async (req, res) => {
    try {
        const { productId, quantity = 1 } = req.body;

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: 'Not enough stock available'
            });
        }

        let cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        const existingItemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += Number(quantity);
        } else {
            cart.items.push({ product: productId, quantity: Number(quantity) });
        }

        await cart.save();
        await cart.populate('items.product', 'name price category stock');

        res.status(200).json({
            success: true,
            data: cart
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: 'Failed to add item to cart',
            error: error.message
        });
    }
};

// DELETE /api/cart/:itemId - Remove item from cart
const removeFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: 'Cart not found'
            });
        }

        cart.items = cart.items.filter(
            (item) => item._id.toString() !== req.params.itemId && item.product.toString() !== req.params.itemId
        );

        await cart.save();
        await cart.populate('items.product', 'name price category stock');

        res.json({
            success: true,
            message: 'Item removed from cart',
            data: cart
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Failed to remove item',
            error: error.message
        });
    }
};

module.exports = {
    getCart,
    addToCart,
    removeFromCart
};