// const jwt = require('jsonwebtoken');
// const db = require('../config/db');

// const authMiddleware = async (req, res, next) => {
//     const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

//     // console.log(token, "Extracted Token"); 

//     if (!token) {
//         req.user = null;
//         return next();
//     }

//     try {
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         const [results] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

//         if (results.length === 0) {
//             req.user = null;
//         } else {
//             req.user = results[0];
//         }
//         next();
//     } catch (error) {
//         if (error.name === 'TokenExpiredError') {
//             // Clear the expired token
//             res.clearCookie('token');
            
//             // Inform the client that they need to log in again
//             return res.status(401).json({
//                 success: false,
//                 message: 'Token has expired. Please log in again.',
//                 tokenExpired: true
//             });
//         } else {
//             // For other errors, set req.user to null and proceed
//             req.user = null;
//             next();
//         }
//     }
// };

// module.exports = authMiddleware;


import jwt from 'jsonwebtoken';
import db from '../config/db.js';

const authMiddleware = async (req, res, next) => {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        req.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const [results] = await db.query('SELECT * FROM users WHERE id = ?', [decoded.id]);

        if (results.length === 0) {
            req.user = null;
        } else {
            req.user = results[0];
        }
        next();
    } catch (error) {
        console.log("User not authenticated");

        if (error.name === 'TokenExpiredError') {
            // Clear the expired token
            res.clearCookie('token');
            
            // Inform the client that they need to log in again
            return res.status(401).json({
                success: false,
                message: 'Token has expired. Please log in again.',
                tokenExpired: true
            });
        } else {
            // For other errors, set req.user to null and proceed
            req.user = null;
            next();
        }
    }
};

export default authMiddleware;
