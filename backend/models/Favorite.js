const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: true
    }
  },
  {
    timestamps: true
  }
);

favoriteSchema.index({ tourist: 1, business: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
