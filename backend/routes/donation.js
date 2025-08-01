const express = require("express");
const router = express.Router();
const Donation = require("../models/Donation");
const auth = require("../middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure uploads folder exists
const uploadDir = "./uploads";
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// 🟢 GET all available donations
router.get("/available", async (req, res) => {
  try {
    const availableDonations = await Donation.find({ status: "Available" });
    res.json(availableDonations);
  } catch (error) {
    console.error("❌ Full Error Stack:", error.stack);
    res.status(500).json({ message: "Internal Server Error", error: error.message });
  }
});

// 🔵 GET a single donation by ID with donor info
router.get("/:id", async (req, res) => {
  try {
    const donation = await Donation.findById(req.params.id).populate("donor", "username email");
    if (!donation) return res.status(404).json({ msg: "Donation not found" });
    res.json(donation);
  } catch (err) {
    console.error("Error fetching donation by ID:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🟠 PATCH - Accept a donation
router.patch("/:id/accept", async (req, res) => {
  try {
    const donation = await Donation.findByIdAndUpdate(
      req.params.id,
      { status: "Accepted" },
      { new: true }
    );
    res.json(donation);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server error" });
  }
});

// 🔴 POST a new donation
router.post("/", auth, upload.single("image"), async (req, res) => {
  try {
    const {
      foodType,
      description,
      location,
      detailedAddress,
      expiryDate,
      quantityAmount,
      quantityUnit,
      phone,
      whatsapp
    } = req.body;

    const newDonation = new Donation({
      foodType,
      description,
      location,
      detailedAddress,
      expiryDate,
      quantity: {
        amount: Number(quantityAmount),
        unit: quantityUnit,
      },
      image: req.file ? `/uploads/${req.file.filename}` : null,
      donor: req.userId,
      phone,
      whatsapp
    });

    const saved = await newDonation.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error saving donation:", err);
    res.status(500).json({ msg: "Server error" });
  }
});

module.exports = router;
