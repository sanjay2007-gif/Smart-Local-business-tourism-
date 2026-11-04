const mongoose = require('mongoose');

const businessSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    name: {
      type: String,
      required: [true, 'Business name is required'],
      trim: true
    },
    category: {
      type: String,
      enum: [
        'homestay',
        'hotel',
        'tour_guide',
        'artisan',
        'restaurant',
        'cultural_activity',
        'local_service'
      ],
      required: [true, 'Category is required']
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: [true, 'Destination reference is required']
    },
    address: {
      type: String,
      required: [true, 'Address is required']
    },
    location: {
      lat: {
        type: Number,
        required: true
      },
      lng: {
        type: Number,
        required: true
      }
    },
    pricePerUnit: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative']
    },
    pricingUnit: {
      type: String,
      enum: ['per_night', 'per_person', 'per_tour', 'per_item', 'per_hour'],
      default: 'per_person'
    },
    images: {
      type: [String],
      default: []
    },
    amenities: {
      type: [String],
      default: []
    },
    tags: {
      type: [String],
      default: []
    },
    contactPhone: {
      type: String,
      trim: true
    },
    contactEmail: {
      type: String,
      trim: true,
      lowercase: true
    },
    ratingAverage: {
      type: Number,
      default: 0,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot exceed 5']
    },
    reviewCount: {
      type: Number,
      default: 0
    },
    isVerified: {
      type: Boolean,
      default: true
    },
    operatingHours: {
      type: String,
      default: '08:00 AM - 08:00 PM'
    },
    availabilityStatus: {
      type: String,
      enum: ['available', 'booked_out', 'seasonal'],
      default: 'available'
    }
  },
  {
    timestamps: true
  }
);

// Virtual index for fast location / category searching
businessSchema.index({ category: 1, destination: 1, pricePerUnit: 1 });
businessSchema.index({ 'location.lat': 1, 'location.lng': 1 });

module.exports = mongoose.model('Business', businessSchema);
