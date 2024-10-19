import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';


// Register Controller
export const registerUser = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const createdAt = new Date();

    await db.query('INSERT INTO users (username, email, password, created_at) VALUES (?, ?, ?, ?)', 
      [username, email, hashedPassword, createdAt]);

    const token = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 60 * 60 * 1000,
      sameSite: 'Strict'
    });

    res.status(201).json({ success: true, message: 'User registered successfully' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ success: false, message: 'Registration failed' });
  }
};

// Login Controller
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const [results] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (results.length === 0) {
      return res.status(400).json({ success: false, message: 'User not found' });
    }

    const user = results[0];
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ success: false, message: 'Invalid credentials' });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3 * 60 * 60 * 1000,
      sameSite: 'Strict'
    });

    res.json({ success: true, message: 'Login successful', user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Get Me (User info) Controller
export const getMe = (req, res) => {
  if (!req.user) {
    return res.status(200).json({
      success: false,
      message: 'User not authenticated',
      user: null,
    });
  }

  res.json({
    success: true,
    message: 'User authenticated',
    user: req.user,
  });
};
