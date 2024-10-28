const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();




// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
      const response = await axios.get('http://localhost:5000/books'); // Change the URL to where you serve the books
      res.status(200).json(response.data); // Respond with the data
  } catch (error) {
      res.status(500).json({ message: "Error fetching book list" });
  }
});


// User registration
public_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required." });
    }

    // Check if username already exists
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
        return res.status(409).json({ message: "Username already exists." });
    }

    // Register the user
    users.push({ username, password }); // Note: Store passwords securely in production
    return res.status(201).json({ message: "User registered successfully." });
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
    res.json(books); // Send the books object directly as JSON
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', async function (req, res) {
  const isbn = req.params.isbn;
  try {
      const response = await axios.get(`http://localhost:5000/books/${isbn}`); // Change the URL accordingly
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details by ISBN" });
  }
});
// Get book details based on author
// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  try {
      const response = await axios.get(`http://localhost:5000/author/${author}`); // Change the URL accordingly
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details by author" });
  }
});


// Get all books based on title
// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  const title = req.params.title;
  try {
      const response = await axios.get(`http://localhost:5000/title/${title}`); // Change the URL accordingly
      res.status(200).json(response.data);
  } catch (error) {
      res.status(500).json({ message: "Error fetching book details by title" });
  }
});





// Get book reviews based on ISBN
// Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = Object.values(books).find(b => b.title === isbn); // Assuming title is the ISBN for lookup
  if (book && book.reviews) {
      res.send(JSON.stringify(book.reviews, null, 4));
  } else {
      res.status(404).json({ message: "No reviews found for this ISBN" });
  }
});


module.exports.general = public_users;
