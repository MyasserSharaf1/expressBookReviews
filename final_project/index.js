const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

// Set up session middleware with a secret for customer routes
app.use(session({
    secret: "fingerprint_customer",
    resave: false,  // Change to false to avoid resaving unchanged session
    saveUninitialized: false, // Change to false to prevent storing uninitialized sessions
    cookie: { secure: false } // Set secure to true in production with HTTPS
}));

// Authentication middleware for customer routes
app.use("/customer/auth/*", function auth(req, res, next) {
    // Check if the session has an access token
    const token = req.session.accessToken;

    if (!token) {
        return res.status(401).json({ message: "Access denied. No token provided." });
    }

    // Verify the token
    jwt.verify(token, "your_jwt_secret_key", (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: "Invalid token." });
        }
        req.user = decoded; // Store decoded user info for further use
        next(); // Proceed to the next middleware/route handler
    });
});

// Route handling for customer and general routes
app.use("/customer", customer_routes);
app.use("/", genl_routes);

const PORT = process.env.PORT || 5000; // Use environment variable for port
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
