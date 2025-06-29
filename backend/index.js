const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("./config/firebase.config");

const app = express();

// Add/Update your frontend URL to avoid CORS error
var corsOptions = {
  origin: [
    "http://localhost:5173", 
    "http://192.168.1.18:5173", 
    "http://192.168.1.4:5173",
    "https://e-commerce-mern-app-xul5.onrender.com" // Added your deployed frontend URL
  ],
  credentials: true, // Allow credentials (cookies, authorization headers, etc.)
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Explicitly allow methods
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'] // Allow common headers
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly (optional but recommended)
app.options('*', cors(corsOptions));

// Increase payload size limit for JSON and URL-encoded requests
app.use(bodyParser.json({ limit: "10mb" })); // Increased to 10MB
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" })); // Increased to 10MB

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

// Load routes with error handling
try {
  require("./routes/user.routes")(app);
  console.log("User routes loaded successfully");
} catch (error) {
  console.error("Error loading user routes:", error.message);
}

try {
  require("./routes/product.routes")(app);
  console.log("Product routes loaded successfully");
} catch (error) {
  console.error("Error loading product routes:", error.message);
}

// Set port, listen for requests
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});