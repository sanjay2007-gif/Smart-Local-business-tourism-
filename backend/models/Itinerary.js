const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  timeSlot: {
    type: String,
    enum: ['Morning', 'Afternoon', 'Evening', 'Night'],
    default: 'Morning'
  },
  title: {
    type: String,
    required: true
  },
  businessId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Business',
    default: null
  },
  notes: {
    type: String,
    default: ''
  },
  estimatedCost: {
    type: Number,
    default: 0
  }
});

const dayPlanSchema = new mongoose.Schema({
  dayNumber: {
    type: Number,
    required: true
  },
  theme: {
    type: String,
    default: 'Local Exploration'
  },
  activities: [activitySchema]
});

const itinerarySchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    destination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Destination',
      required: true
    },
    title: {
      type: String,
      required: [true, 'Please give your itinerary a title'],
      trim: true
    },
    daysCount: {
      type: Number,
      required: true,
      min: 1,
      max: 14,
      default: 3
    },
    startDate: {
      type: Date,
      default: Date.now
    },
    days: [dayPlanSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
