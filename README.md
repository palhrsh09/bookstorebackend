# Bookstore Backend API
## ive included my .env file still so u can  use that according to that can setup in ur device see it
### This is the backend service for a Bookstore application, built using Node.js, Express, and MongoDB. The service provides APIs for user authentication, managing books, handling shopping carts, and processing orders.
#### Installation
##### To run this project locally:

## Clone the repository:
git clone <repository-url>

## Navigate to the project directory:
cd bookstore-backend

## Install dependencies:
npm install

## Create a .env file with the following configuration:
envCopyDB_HOST=your-mysql-host
DB_USER=your-database-user
DB_PASSWORD=your-database-password
DB_NAME=bookstore_db
JWT_SECRET=your-jwt-secret

### Start the development server:
npm start


### Database Setup
Ensure MySQL is running and you have created a database named bookstore_d (or modify the .env file accordingly).
Run the necessary migrations or scripts to create the required tables for users, books, cart, and orders.
For example, you may need to create tables like:
Users
sqlCopyCREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Books
sqlCopyCREATE TABLE books (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255),
  author VARCHAR(255),
  description TEXT,
  price DECIMAL(10, 2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
Cart
sqlCopyCREATE TABLE cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  book_id INT,
  quantity INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (book_id) REFERENCES books(id)
);
Orders
sqlCopyCREATE TABLE orders (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  total DECIMAL(10, 2),
  status VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);
## API Endpoints
Authentication
## Login

URL: POST /api/auth/login
Description: Authenticate users and generate a token for future requests.
Request Body:
jsonCopy{
  "email": "user@example.com",
  "password": "password123"
}

Response: JSON object containing user information and JWT token.

## Register

URL: POST /api/auth/register
Description: Register a new user in the system.
Request Body:
jsonCopy{
  "name": "John Doe",
  "email": "user@example.com",
  "password": "password123"
}

Response: JSON object with user details and token.

## Verify User

URL: GET /api/auth/me
Description: Fetch the currently logged-in user's details using the JWT token.
Headers: Authorization: Bearer <JWT token>
Response: User's profile information.

## Books
### Get All Books

URL: GET /api/books
Description: Retrieve a list of all books available in the store.
Response: JSON array of book objects.

### Get Book by ID

URL: GET /api/books/:id
Description: Retrieve detailed information about a specific book by its ID.
Response: JSON object containing book details.

### Create a New Book

URL: POST /api/books/create
Description: Add a new book to the store (admin only).
Request Body:
jsonCopy{
  "title": "Book Title",
  "author": "Author Name",
  "description": "A detailed description of the book",
  "price": 19.99
}

Response: JSON object with the created book details.

## Cart
### Get Cart Items

URL: GET /api/cart
Description: Retrieve the current user's cart items.
Response: JSON array of cart items.

### Add to Cart

URL: POST /api/cart/create
Description: Add an item to the user's cart.
Request Body:
jsonCopy{
  "bookId": "1234567890",
  "quantity": 1
}

Response: JSON object with the updated cart details.

### Remove Item from Cart

URL: DELETE /api/cart/:itemId
Description: Remove a specific item from the user's cart by item ID.
Response: JSON object confirming item removal.

## Order
### Place an Order

URL: GET /api/order/place-order
Description: Place an order for the items currently in the cart.
Middleware: authMiddleware (requires authentication).
Response: JSON object with order confirmation.

### View Order History

URL: GET /api/order/history
Description: View the user's order history.
Middleware: authMiddleware
Response: JSON array of order history.

### Get Order Details by ID

URL: GET /api/order/:id
Description: Retrieve detailed information about a specific order.
Middleware: authMiddleware
Response: JSON object with order details.

## Middleware
The project uses authentication middleware to secure certain endpoints. The authMiddleware ensures that only authenticated users can access sensitive routes such as placing orders, viewing order history, or fetching user-specific data.
