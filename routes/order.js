// const express = require('express');
// const authMiddleware = require('../middleware/auth');
// const db = require('../config/db');

// const router = express.Router();

// // Place an order
// router.get('/place-order', authMiddleware, async (req, res) => {
//     const userId = req.user.id; // Get the user ID from the authentication middleware
   

//     try {
//         // Fetch the user's cart using the user ID

//         const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        
//         if (cart.length === 0) {
//             return res.status(400).json({ message: 'No cart found for this user' });
//         }

//         const cartId = cart[0].id; // Get the cart ID

//         // Fetch the cart items using the cart ID
//         const [cartItems] = await db.query('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);

//         if (cartItems.length === 0) {
//             return res.status(400).json({ message: 'Your cart is empty' });
//         }

//         // Calculate the total amount
//         const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

//         // Insert a new order into the Orders table
//         const [orderResult] = await db.query(
//             'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
//             [userId, totalAmount, 'pending']
//         );

//         const orderId = orderResult.insertId; // Get the order ID of the newly created order

//         // Insert each cart item into the order_items table
//         for (const item of cartItems) {
//             await db.query(
//                 'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
//                 [orderId, item.book_id, item.quantity, item.price]
//             );
//         }

//         // Clear the cart for the user
//           await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

//         res.status(201).json({ message: 'Order placed successfully', orderId });
//     } catch (err) {
//         console.error('Error placing order:', err);
//         res.status(500).json({ message: 'Server error while placing the order' });
//     }
// });

// // View order history
// router.get('/history', authMiddleware, async (req, res) => {
//     const userId = req.user.id; // Get user ID from authentication middleware
//     console.log("Fetching order history for user:", userId);
    
//     try {
//         // Fetch all orders for the authenticated user
//         const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
        
//         // Check if any orders are found
//         if (orders.length === 0) {
//             return res.status(404).json({ message: 'No orders found' });
//         }

//         res.json(orders); // Return the orders in response
//     } catch (err) {
//         console.error('Error fetching order history:', err);
//         res.status(500).json({ message: 'Server error while fetching order history' });
//     }
// });

// // Get order details by order ID
// router.get('/:id', authMiddleware, async (req, res) => {
//     const orderId = req.params.id; // Get order ID from request params
//     const userId = req.user.id; // Get user ID from the authentication middleware
    
//     console.log("Fetching order details for order ID:", orderId, "and user ID:", userId);
    
//     try {
//         // Fetch the order details for the specified order ID and user ID
//         const [orderDetails] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);

//         // If no order found, return 404 error
//         if (orderDetails.length === 0) {
//             return res.status(404).json({ message: 'Order not found' });
//         }

//         res.json(orderDetails[0]); // Return the specific order details
//     } catch (err) {
//         console.error('Error fetching order details:', err);
//         res.status(500).json({ message: 'Server error while fetching order details' });
//     }
// });

// module.exports = router;


// routes/orderRoutes.js
import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
 import { placeOrder,viewOrderHistory,getOrderDetails } from '../controllers/orderController.js';
const router = Router();


// Place an order
router.get('/place-order', authMiddleware,placeOrder);

// View order history
router.get('/history', authMiddleware, viewOrderHistory);

// Get order details by order ID
router.get('/:id', authMiddleware, getOrderDetails);

export default router;

