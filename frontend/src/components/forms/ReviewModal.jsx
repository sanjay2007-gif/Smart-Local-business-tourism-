import React, { useState } from 'react';
import { X, Star } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';

const ReviewModal = ({ business, isOpen, onClose, onReviewSuccess }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in to submit a review.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/reviews', {
        businessId: business._id,
        rating,
        comment
      });

      showToast('Review submitted successfully!', 'success');
      if (onReviewSuccess) onReviewSuccess(res.data.data);
      onClose();
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to submit review.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl relative border border-emerald-100">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Write a Review</h3>
            <p className="text-xs text-slate-500 mt-0.5">Share your experience at {business.name}</p>
          </div>

          {/* Star selector */}
          <div className="flex items-center gap-2 py-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => setRating(star)}
                className="p-1 focus:outline-none transition-transform hover:scale-110"
              >
                <Star
                  className={`w-7 h-7 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-slate-200'
                  }`}
                />
              </button>
            ))}
            <span className="text-xs font-semibold text-slate-600 ml-2">
              {rating} of 5 Stars
            </span>
          </div>

          {/* Comment */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Your Review & Feedback
            </label>
            <textarea
              required
              rows="4"
              placeholder="What did you love about this local host or tour? Mention specific details that helped make your trip memorable..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full text-xs p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md disabled:opacity-50"
          >
            {loading ? 'Posting Review...' : 'Submit Verified Review'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ReviewModal;