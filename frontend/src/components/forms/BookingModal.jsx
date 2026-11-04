import React, { useState } from 'react';
import { X, Calendar, Users, Phone, FileText, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';

const BookingModal = ({ business, isOpen, onClose, onBookingSuccess }) => {
  const { user, isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0];

  const [startDate, setStartDate] = useState(tomorrow);
  const [endDate, setEndDate] = useState(dayAfter);
  const [guestsCount, setGuestsCount] = useState(1);
  const [contactPhone, setContactPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [loading, setLoading] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  if (!isOpen) return null;

  // Calculate estimated total
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)));

  let estimatedTotal = 0;
  if (business.pricingUnit === 'per_night') {
    estimatedTotal = business.pricePerUnit * diffDays;
  } else if (business.pricingUnit === 'per_person') {
    estimatedTotal = business.pricePerUnit * guestsCount;
  } else {
    estimatedTotal = business.pricePerUnit;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      showToast('Please log in as a tourist to make a booking.', 'error');
      return;
    }

    try {
      setLoading(true);
      const res = await api.post('/bookings', {
        businessId: business._id,
        startDate,
        endDate,
        guestsCount,
        contactPhone,
        specialRequests
      });

      setConfirmedBooking(res.data.data);
      showToast(res.data.message, 'success');
      if (onBookingSuccess) onBookingSuccess(res.data.data);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to complete booking request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative border border-emerald-100 max-h-[90vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedBooking ? (
          /* Confirmation State */
          <div className="text-center py-6 space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h3 className="text-2xl font-bold text-slate-900">Booking Confirmed!</h3>
            <p className="text-sm text-slate-600">
              Your reservation request has been submitted to the local host.
            </p>

            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 text-left space-y-2 text-xs">
              <div className="flex justify-between font-semibold text-emerald-950">
                <span>Booking ID:</span>
                <span className="font-mono text-emerald-700 bg-white px-2 py-0.5 rounded border border-emerald-200">
                  {confirmedBooking.bookingId}
                </span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Experience:</span>
                <span className="font-medium text-slate-900">{business.name}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total Amount:</span>
                <span className="font-bold text-emerald-800 text-sm">₹{confirmedBooking.totalAmount?.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Status:</span>
                <span className="capitalize font-semibold text-amber-600">{confirmedBooking.status}</span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-full py-3 rounded-xl font-semibold text-white bg-emerald-600 hover:bg-emerald-700 transition"
            >
              Done & Return
            </button>
          </div>
        ) : (
          /* Booking Form */
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">
                Direct Local Booking
              </span>
              <h2 className="text-xl font-bold text-slate-900 mt-0.5">{business.name}</h2>
              <p className="text-xs text-slate-500 mt-1">
                Rate: ₹{business.pricePerUnit?.toLocaleString()} /{business.pricingUnit?.replace('per_', '')}
              </p>
            </div>

            {/* Dates row */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Start Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  End Date
                </label>
                <div className="relative">
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Guests and Phone */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Guests Count
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    required
                    value={guestsCount}
                    onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  className="w-full text-xs px-3 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>

            {/* Special Requests */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Special Requests or Dietary Needs
              </label>
              <textarea
                rows="2"
                placeholder="e.g., Vegetarian meals, early check-in, guided language preference..."
                value={specialRequests}
                onChange={(e) => setSpecialRequests(e.target.value)}
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            {/* Price Breakdown Summary */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Duration / Unit:</span>
                <span>{diffDays} {diffDays === 1 ? 'day' : 'days'}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Guests:</span>
                <span>{guestsCount}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                <span>Total Estimated Cost:</span>
                <span className="text-emerald-700 text-base">₹{estimatedTotal.toLocaleString()}</span>
              </div>
            </div>

            {/* Submit CTA */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-md shadow-emerald-600/20 disabled:opacity-50"
            >
              {loading ? 'Processing Reservation...' : `Confirm & Reserve for ₹${estimatedTotal.toLocaleString()}`}
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default BookingModal;