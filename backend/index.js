const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config(); // Ensure .env variables are available
require("./config/firebase.config");

const app = express();

// ✅ CORS setup
const corsOptions = {
  origin: [
    "https://e-commerce-mern-app-rp1z.onrender.com" // Update this if frontend URL changes
  ],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With"]
};

app.use(cors(corsOptions));


// ✅ Middleware
app.use(bodyParser.json({ limit: "10mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "10mb" }));

// ✅ DB Connection
const db = require("./models");

if (!db || !db.mongoose || !db.url) {
  console.error("❌ Error: Database config is missing or invalid.");
  process.exit(1);
}

db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ Connected to the database"))
  .catch((err) => {
    console.error("❌ Cannot connect to the database:", err);
    process.exit(1);
  });

// ✅ Basic Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to EMCKart Application." });
});

app.get("/test", (req, res) => {
  res.json({ message: "Server is working correctly!" });
});

// ✅ Route loading with try-catch
console.log("🔄 Loading user routes...");
try {
  require("./routes/user.routes")(app);
  console.log("✅ User routes loaded");
} catch (error) {
  console.error("❌ Failed to load user routes:", error.message);
  console.error(error.stack);
}

console.log("🔄 Loading product routes...");
try {
  require("./routes/product.routes")(app);
  console.log("✅ Product routes loaded");
} catch (error) {
  console.error("❌ Failed to load product routes:", error.message);
  console.error(error.stack);
}

// ✅ Error handling middleware
app.use((err, req, res, next) => {
  console.error("❌ Express error middleware:", err);
  res.status(500).json({
    message: "Internal Server Error",
    error: process.env.NODE_ENV === "development" ? err.message : {}
  });
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Start server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📍 Deployed URL (Render): https://e-commerce-mern-app-r1oe.onrender.com`);
});
