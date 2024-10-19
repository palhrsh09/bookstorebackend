// const express = require('express');
// const auth = require('../middleware/auth');
// const db = require('../config/db');
// const authMiddleware = require('../middleware/auth');

// const router = express.Router();

// // Get cart details
// router.get('/', authMiddleware, async (req, res) => {
//     try {
//         // Fetch the cart for the logged-in user
//         const [cart] = await db.query('SELECT * FROM Cart WHERE user_id = ?', [req.user.id]);
        
//         // If no cart found, return "Cart is empty"
//         if (cart.length === 0) {
//             return res.json({ success: true, message: 'Cart is empty', data: [] });
//         }

//         const cartId = cart[0].id; // Get the cart ID

//         // Fetch cart items and include `ci.id` (the id from Cart_Items table)
//         const [cartItems] = await db.query(
//             `SELECT ci.id AS cart_item_id, ci.quantity, ci.price, b.id AS book_id, b.title, b.author 
//              FROM Cart_Items ci
//              JOIN Books b ON ci.book_id = b.id
//              WHERE ci.cart_id = ?`,
//             [cartId]
//         );

//         // Respond with cart items, including the Cart_Items id
//         res.json({ success: true, data: { cartId, items: cartItems } });
//     } catch (error) {
//         console.error('Error fetching cart details:', error);
//         res.status(500).json({ success: false, message: 'Error fetching cart details' });
//     }
// });


// // Add book to cart
// router.post('/create', authMiddleware, async (req, res) => {
//     const { book, quantity } = req.body;
//     const { id, title, author, price } = book;

//     try {
//         const [cart] = await db.query('SELECT * FROM Cart WHERE user_id = ?', [req.user.id]);

//         let cartId;
//         if (cart.length === 0) {
//             const [cartResult] = await db.query('INSERT INTO Cart (user_id) VALUES (?)', [req.user.id]);
//             cartId = cartResult.insertId;
//         } else {
//             cartId = cart[0].id;
//         }

//         await db.query('INSERT INTO Cart_Items (cart_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
//             [cartId, id, quantity, price]);

//         // Create a response object
//         const responseData = {
//             success: true,
//             message: 'Book added to cart',
//             data: {
//                 cartId
//             }
//         };

//         // Send the JSON response
//         res.status(201).json(responseData);
//     } catch (error) {
//         console.error('Error adding book to cart:', error);
//         res.status(500).json({
//             success: false,
//             message: 'Error adding book to cart',
//         });
//     }
// });



  

// // Remove book from cart
// router.delete('/:itemId', authMiddleware, async (req, res) => {
//     console.log(req.params.itemId, req.user.id,"req")
//     try {
//         const [result] = await db.query(
//           'DELETE FROM cart_items WHERE id = ? AND cart_id = ?',
//           [req.params.itemId, req.user.id]
//         );
    
//         if (result.affectedRows === 0) {
//           return res.status(404).json({ message: 'Item not found in cart' });
//         }
    
//         res.json({ message: 'Item removed from cart' });
//       } catch (error) {
//         console.error('Error deleting item from cart:', error);
//         res.status(500).json({ message: 'Server error' });
//       }
//   });

// module.exports = router;






// routes/cartRoutes.js
import { Router } from 'express';
import authMiddleware from '../middleware/auth.js';
import { addToCart, getCart, removeFromCart } from '../controllers/cartController.js';


const router = Router();
// Get cart details
router.get('/', authMiddleware, getCart);

// Add book to cart
router.post('/create', authMiddleware, addToCart);

// Remove book from cart
router.delete('/:itemId', authMiddleware, removeFromCart);

export default router;

