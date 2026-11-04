const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Destination name is required'],
      trim: true,
      unique: true
    },
    state: {
      type: String,
      required: [true, 'State / Province is required'],
      trim: true
    },
    region: {
      type: String,
      default: 'South Asia'
    },
    description: {
      type: String,
      required: [true, 'Description is required']
    },
    shortDescription: {
      type: String,
      maxlength: 160
    },
    category: {
      type: String,
      enum: ['hill_station', 'heritage', 'beach', 'wildlife', 'cultural', 'rural'],
      required: true
    },
    images: {
      type: [String],
      default: []
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
    bestTimeToVisit: {
      type: String,
      default: 'October to March'
    },
    highlights: {
      type: [String],
      default: []
    },
    featured: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Destination', destinationSchema);
