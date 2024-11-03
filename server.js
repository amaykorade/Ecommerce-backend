import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

import { connectUsingMongoose } from './src/config/mongooseConfig.js';

// import routers
import productRouter from './src/features/products/products.routes.js';
import userRouter from './src/features/user/user.routes.js';
import cartRouter from './src/features/cart/cart.routes.js';
import orderRouter from './src/features/order/order.routes.js';
import paymentRouter from './src/features/Payment/payment.routes.js';
import jwtAuth from './src/middlewares/jwt.middleware.js';

const server = express();

server.use(express.json());

// Derive __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from the 'public/images' directory
server.use('/images', express.static(path.join(__dirname, 'uploads')));

dotenv.config();

// CORS policy configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:3001',
    'https://ecommerce-backend-1z4o.onrender.com/api'
];
server.use((req, res, next) => {
    const origin = req.headers.origin;
    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Origin', origin);
    }
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    // res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    // return ok for preflight request.
    if (req.method == 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
})


// routes
server.use('/api/products', productRouter);
server.use('/api/user', userRouter);
server.use('/api/cart', jwtAuth, cartRouter);
server.use('/api/order', orderRouter);
server.use('/api/payment', paymentRouter);

server.listen(3000, () => {
    console.log("Server is running at 3000");
    connectUsingMongoose();
})