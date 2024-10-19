import db from '../config/db.js';



// Fetch all books
export const getAllBooks = async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM books');
        
        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No books found',
                data: []
            });
        }

        res.json({
            success: true,
            message: 'Books fetched successfully',
            data: results
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching books',
            error: err.message
        });
    }
};

// Fetch a book by ID
export const getBookById = async (req, res) => { // Added authMiddleware here
    const bookId = req.params.id;

    try {
        if (isNaN(bookId)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid book ID'
            });
        }

        const [results] = await db.query('SELECT * FROM books WHERE id = ?', [bookId]);

        if (results.length === 0) {
            return res.status(404).json({
                success: false,
                message: `Book with ID ${bookId} not found`
            });
        }

        res.json({
            success: true,
            message: `Book with ID ${bookId} fetched successfully`,
            data: results[0]
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: 'Error fetching book details',
            error: err.message
        });
    }
}


// Create book route with image upload
export const createBook = async (req, res) => {
    const { title, author, price, description } = req.body;

    // Validation: Ensure all required fields are present
    if (!title || !author || !price || !description || !req.file) {
        return res.status(400).json({
            success: false,
            message: 'Title, author, price, description, and image are required.'
        });
    }

    // Validate price
    if (isNaN(price) || parseFloat(price) <= 0) {
        return res.status(400).json({
            success: false,
            message: 'Price must be a positive number.'
        });
    }

    try {
        // Use the file information from multer (file saved by multer)
        const imagePath = `uploads/${req.file.filename}`;

        // Insert the new book into the database
        const [results] = await db.query(
            'INSERT INTO books (title, author, price, description, image) VALUES (?, ?, ?, ?, ?)',
            [title, author, parseFloat(price), description, imagePath]
        );

        // Respond with success and book details
        res.status(201).json({
            success: true,
            message: 'Book created successfully.',
            book: {
                id: results.insertId,
                title,
                author,
                price: parseFloat(price),
                description,
                image: imagePath,
                created_at: new Date()
            }
        });
    } catch (error) {
        // Handle any errors that occur during the database query
        res.status(500).json({
            success: false,
            message: 'Error creating book',
            error: error.message
        });
    }
};

