const mongoose = require("mongoose");

const donationSchema = new mongoose.Schema({
  foodType: {
    type: String,
    required: [true, "Food type is required"],
    trim: true
  },
  detailedAddress: {
    type: String,
    trim: true
  },
  quantity: {
    amount: {
      type: Number,
      required: [true, "Quantity amount is required"],
      min: [1, "Quantity must be at least 1"]
    },
    unit: {
      type: String,
      required: [true, "Quantity unit is required"],
      enum: ["kg", "g", "liters", "ml", "pieces", "grams", "servings"]
    }
  },
  expiryDate: {
    type: Date,
    required: [true, "Expiry date is required"]
  },
  location: {
    type: String,
    required: [true, "Location is required"],
    trim: true
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    trim: true
  },
  whatsapp: {
    type: String,
    required: [true, "WhatsApp number is required"],
    trim: true
  },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        // ✅ Accept both local paths and URLs
        return typeof v === 'string' && /\.(jpg|jpeg|png|webp)$/.test(v);
      },
      message: props => `${props.value} is not a valid image path`
    }
  },
  status: {
    type: String,
    enum: ["Available", "Claimed", "Expired"],
    default: "Available"
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  acceptedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// 🧠 Virtual field to check if donation is expired
donationSchema.virtual('isExpired').get(function () {
  return this.expiryDate < new Date();
});

// 🗑️ TTL index to auto-delete expired donations
donationSchema.index({ expiryDate: 1 }, { expireAfterSeconds: 0 });

// 🔍 Indexes for performance
donationSchema.index({ status: 1 });
donationSchema.index({ location: 1 });

module.exports = mongoose.model("Donation", donationSchema);
