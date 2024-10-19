// controllers/orderController.js
import db from '../config/db.js';

// Place an order
export const placeOrder = async (req, res) => {
    const userId = req.user.id; // Get the user ID from the authentication middleware
    
    try {
        const [cart] = await db.query('SELECT id FROM cart WHERE user_id = ?', [userId]);
        
        if (cart.length === 0) {
            return res.status(400).json({ message: 'No cart found for this user' });
        }

        const cartId = cart[0].id;

        const [cartItems] = await db.query('SELECT * FROM cart_items WHERE cart_id = ?', [cartId]);

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Your cart is empty' });
        }

        const totalAmount = cartItems.reduce((sum, item) => sum + (item.quantity * item.price), 0);

        const [orderResult] = await db.query(
            'INSERT INTO orders (user_id, total_amount, status) VALUES (?, ?, ?)',
            [userId, totalAmount, 'pending']
        );

        const orderId = orderResult.insertId;

        for (const item of cartItems) {
            await db.query(
                'INSERT INTO order_items (order_id, book_id, quantity, price) VALUES (?, ?, ?, ?)',
                [orderId, item.book_id, item.quantity, item.price]
            );
        }

        await db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartId]);

        res.status(201).json({ message: 'Order placed successfully', orderId });
    } catch (err) {
        console.error('Error placing order:', err);
        res.status(500).json({ message: 'Server error while placing the order' });
    }
};

// View order history
export const viewOrderHistory = async (req, res) => {
    const userId = req.user.id; // Get user ID from authentication middleware
      console.log("yeh wala")
    try {
        const [orders] = await db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);

        if (orders.length === 0) {
            return res.status(404).json({ message: 'No orders found' });
        }

        res.json(orders);
    } catch (err) {
        console.error('Error fetching order history:', err);
        res.status(500).json({ message: 'Server error while fetching order history' });
    }
};

// Get order details by order ID
export const getOrderDetails = async (req, res) => {
    const orderId = req.params.id;
    const userId = req.user.id;

    console.log("woh wala")
    
    try {
        const [orderDetails] = await db.query('SELECT * FROM orders WHERE id = ? AND user_id = ?', [orderId, userId]);

        if (orderDetails.length === 0) {
            return res.status(404).json({ message: 'Order not found' });
        }

        res.json(orderDetails[0]);
    } catch (err) {
        console.error('Error fetching order details:', err);
        res.status(500).json({ message: 'Server error while fetching order details' });
    }
};
