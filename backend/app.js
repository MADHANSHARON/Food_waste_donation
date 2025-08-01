require('dotenv').config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("./models/User");

const app = express();
app.use('/uploads', express.static('uploads'));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log("MongoDB connected"))
.catch((err) => console.error("MongoDB connection error:", err));

// Middleware
app.use(cors({
   origin: ["http://localhost:5173", "https://food-donation-app.netlify.app"],
  credentials: true
}));
app.use(express.json());

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/donations", require("./routes/donation"));

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
