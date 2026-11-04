const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
  {
    business: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Business',
      required: [true, 'Business reference is required']
    },
    tourist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Tourist reference is required']
    },
    rating: {
      type: Number,
      required: [true, 'Please provide a rating between 1 and 5'],
      min: [1, 'Minimum rating is 1'],
      max: [5, 'Maximum rating is 5']
    },
    comment: {
      type: String,
      required: [true, 'Review comment cannot be empty'],
      maxlength: [1000, 'Comment cannot exceed 1000 characters']
    }
  },
  {
    timestamps: true
  }
);

// Prevent user from submitting multiple reviews for the same business
reviewSchema.index({ business: 1, tourist: 1 }, { unique: true });

// Static method to compute average rating for a business
reviewSchema.statics.calcAverageRatings = async function (businessId) {
  const stats = await this.aggregate([
    { $match: { business: businessId } },
    {
      $group: {
        _id: '$business',
        nRating: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);

  if (stats.length > 0) {
    await mongoose.model('Business').findByIdAndUpdate(businessId, {
      ratingAverage: Math.round(stats[0].avgRating * 10) / 10,
      reviewCount: stats[0].nRating
    });
  } else {
    await mongoose.model('Business').findByIdAndUpdate(businessId, {
      ratingAverage: 0,
      reviewCount: 0
    });
  }
};

reviewSchema.post('save', function () {
  this.constructor.calcAverageRatings(this.business);
});

reviewSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await doc.constructor.calcAverageRatings(doc.business);
  }
});

module.exports = mongoose.model('Review', reviewSchema);
