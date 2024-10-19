// controllers/cartController.js
import db from '../config/db.js';
// Get cart details
export const getCart = async (req, res) => {
    try {
        const [cart] = await db.query('SELECT * FROM Cart WHERE user_id = ?', [req.user.id]);

        if (cart.length === 0) {
            return res.json({ success: true, message: 'Cart is empty', data: [] });
        }

        const cartId = cart[0].id;

        const [cartItems] = await db.query(
            `SELECT ci.id AS cart_item_id, ci.quantity, ci.price, b.id AS book_id, b.title, b.author 
             FROM Cart_Items ci
             JOIN Books b ON ci.book_id = b.id
             WHERE ci.cart_id = ?`,
            [cartId]
        );

        res.json({ success: true, data: { cartId, items: cartItems } });
    } catch (error) {
        console.error('Error fetching cart details:', error);
        res.status(500).json({ success: false, message: 'Error fetching cart details' });
    }
};

// Add book to cart
export const addToCart = async (req, res) => {
    const { book, quantity } = req.body;
    const { id, price } = book;

    try {
        const [cart] = await db.query('SELECT * FROM Cart WHERE user_id = ?', [req.user.id]);

        let cartId;
        if (cart.length === 0) {
            const [cartResult] = await db.query('INSERT INTO Cart (user_id) VALUES (?)', [req.user.id]);
            cartId = cartResult.insertId;
        } else {
            cartId = cart[0].id;
        }

        await db.query('INSERT INTO Cart_Items (cart_id, book_id, quantity, price) VALUES (?, ?, ?, ?)', 
            [cartId, id, quantity, price]);

        res.status(201).json({
            success: true,
            message: 'Book added to cart',
            data: { cartId }
        });
    } catch (error) {
        console.error('Error adding book to cart:', error);
        res.status(500).json({ success: false, message: 'Error adding book to cart' });
    }
};

// Remove book from cart
export const removeFromCart = async (req, res) => {
    try {
        const [result] = await db.query('DELETE FROM cart_items WHERE id = ? AND cart_id = ?', 
            [req.params.itemId, req.user.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Item not found in cart' });
        }

        res.json({ message: 'Item removed from cart' });
    } catch (error) {
        console.error('Error deleting item from cart:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
