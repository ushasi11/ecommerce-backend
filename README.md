# E-commerce Backend API

## Project Overview
A complete, production-ready RESTful backend API for an online e-commerce store built with Node.js, Express.js, and MongoDB. It follows a strict Model-View-Controller (MVC) architecture and includes:

- User registration, login, and role-based access control (JWT authentication)
- Product catalog management with pagination, sorting, filtering, and search
- Persistent shopping cart functionality
- Order processing with inventory deduction and simulated payment transactions
- API security with Helmet, rate limiting, input validation, and centralized error handling
- Automated API testing with Jest and Supertest

## Project Structure
```text
ecommerce-backend/
├── src/
│   ├── config/         # Database connection & JWT helpers
│   ├── controllers/    # Route logic (auth, products, cart, orders)
│   ├── middleware/     # Auth guard, validation, error handler
│   ├── models/         # Mongoose schemas (User, Product, Cart, Order)
│   ├── routes/         # Express route definitions
│   ├── utils/          # Reusable helper functions
│   └── app.js          # Main Express application entry point
├── tests/              # Jest & Supertest integration tests
├── docs/               # Detailed API documentation
├── .env.example        # Environment variable template
├── .gitignore
└── package.json