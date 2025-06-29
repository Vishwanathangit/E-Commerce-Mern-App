const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/firebase.config");

const app = express();

// Add/Update your frontend URL to avoid CORS error
var corsOptions = {
  origin: [
    "https://e-commerce-mern-app-xul5.onrender.com" // Your deployed frontend URL
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Increase payload size limit for JSON and URL-encoded requests
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// Database connection with better error handling
const db = require("./models");
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to the database!");
  })
  .catch((err) => {
    console.log("Cannot connect to the database!", err);
    process.exit();
  });

// Simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EMCKart Application." });
});

// Test route to ensure server is working
app.get("/test", (req, res) => {
  res.json({ message: "Server is working correctly!" });
});

// Load routes with detailed error handling
console.log("Loading user routes...");
try {
  require("./routes/user.routes")(app);
  console.log("✅ User routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading user routes:");
  console.error("Error message:", error.message);
  console.error("Stack trace:", error.stack);
  // Continue without user routes for now
}

console.log("Loading product routes...");
try {
  require("./routes/product.routes")(app);
  console.log("✅ Product routes loaded successfully");
} catch (error) {
  console.error("❌ Error loading product routes:");
  console.error("Error message:", error.message);
  console.error("Stack trace:", error.stack);
  // Continue without product routes for now
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Express error:", err);
  res.status(500).json({ 
    message: "Internal server error",
    error: process.env.NODE_ENV === 'development' ? err.message : {}
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📍 Server URL: https://e-commerce-mern-app-r1oe.onrender.com`);
});