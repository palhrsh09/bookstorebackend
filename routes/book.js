import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import { createBook, getBookById, getAllBooks } from '../controllers/bookController.js';
import authMiddleware from '../middleware/auth.js';

const router = Router();

// Routes for books

// Fetch all books
router.get('/', authMiddleware, getAllBooks);

// Fetch a book by ID
router.get('/:id', authMiddleware, getBookById);

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Specify the directory to save uploaded files
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to filename
    }
});

const upload = multer({ storage: storage });

// Create book with image upload
router.post('/create', authMiddleware, upload.single('image'), createBook);

export default router;
