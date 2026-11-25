// Sanitize string inputs by trimming whitespace and stripping basic HTML tags
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.trim().replace(/[<>]/g, '');
};

const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Name, email, and password are required'
        });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: 'Please provide a valid email address'
        });
    }

    if (password.length < 6) {
        return res.status(400).json({
            success: false,
            message: 'Password must be at least 6 characters long'
        });
    }

    req.body.name = sanitizeString(name);
    req.body.email = sanitizeString(email).toLowerCase();
    next();
};

const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'Email and password are required'
        });
    }

    req.body.email = sanitizeString(email).toLowerCase();
    next();
};

const validateProduct = (req, res, next) => {
    const { name, description, price, category, stock } = req.body;

    if (!name || !description || price === undefined || !category) {
        return res.status(400).json({
            success: false,
            message: 'Name, description, price, and category are required'
        });
    }

    if (typeof price !== 'number' || price < 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a non-negative number'
        });
    }

    if (stock !== undefined && (typeof stock !== 'number' || stock < 0)) {
        return res.status(400).json({
            success: false,
            message: 'Stock must be a non-negative number'
        });
    }

    req.body.name = sanitizeString(name);
    req.body.description = sanitizeString(description);
    req.body.category = sanitizeString(category);
    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateProduct
};