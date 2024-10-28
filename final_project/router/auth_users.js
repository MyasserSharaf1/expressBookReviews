const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = []; // Store user objects

const isValid = (username) => {
    // Check if the username is valid (not empty and unique)
    return username && !users.some(user => user.username === username);
}

const authenticatedUser = (username, password) => {
    // Check if username and password match the records
    return users.some(user => user.username === username && user.password === password);
};

// Only registered users can login
// User login
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body; // Extract username and password from request body

    // Check if the username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Find user in the users array
    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        // User found, generate a JWT token
        const token = jwt.sign({ username: user.username }, "your_jwt_secret_key", { expiresIn: "1h" });

        // Store the token in the session
        req.session.accessToken = token;

        return res.status(200).json({ message: "Login successful!", token });
    } else {
        return res.status(401).json({ message: "Invalid username or password." });
    }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body; // Assuming the review text is sent in the body

    if (!review) {
        return res.status(400).json({ message: "Review text is required." });
    }

    const book = Object.values(books).find(b => b.isbn === isbn);

    if (book) {
        // Add the review to the book's reviews
        book.reviews = book.reviews || [];
        book.reviews.push(review);
        return res.json({ message: "Review added successfully." });
    } else {
        return res.status(404).json({ message: "Book not found." });
    }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
