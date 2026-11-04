import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MapPin,
  Star,
  CheckCircle2,
  Phone,
  Mail,
  Clock,
  Heart,
  ArrowLeft,
  Calendar,
  MessageSquarePlus,
  ShieldCheck,
  Tag
} from 'lucide-react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import TourismMap from '../components/map/TourismMap';
import BookingModal from '../components/forms/BookingModal';
import ReviewModal from '../components/forms/ReviewModal';
import { getCategoryMeta } from '../components/cards/BusinessCard';

const BusinessDetailPage = () => {
  const { id } = useParams();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [business, setBusiness] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFavorited, setIsFavorited] = useState(false);

  // Modals
  const [bookingOpen, setBookingOpen] = useState(false);
  const [reviewOpen, setReviewOpen] = useState(false);

  useEffect(() => {
    const fetchBusiness = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/businesses/${id}`);
        setBusiness(res.data.data.business);
        setReviews(res.data.data.reviews);
      } catch (err) {
        console.error('Failed to load business details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusiness();
  }, [id]);

  const handleFavoriteToggle = async () => {
    if (!isAuthenticated) {
      showToast('Please log in to save favorites.', 'info');
      return;
    }
    try {
      const res = await api.post(`/reviews/favorite/${business._id}`);
      setIsFavorited(res.data.isFavorited);
      showToast(res.data.message, 'success');
    } catch (err) {
      showToast('Failed to update favorite status.', 'error');
    }
  };

  const handleReviewAdded = (newReview) => {
    setReviews([newReview, ...reviews]);
    // update count
    setBusiness((prev) => ({
      ...prev,
      reviewCount: prev.reviewCount + 1,
      ratingAverage: (prev.ratingAverage * prev.reviewCount + newReview.rating) / (prev.reviewCount + 1)
    }));
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading business experience...</p>
      </div>
    );
  }

  if (!business) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-800">Business not found</h2>
        <Link to="/businesses" className="text-emerald-600 text-xs font-semibold hover:underline">
          &larr; Back to all businesses
        </Link>
      </div>
    );
  }

  const meta = getCategoryMeta(business.category);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* Back button */}
      <div>
        <Link
          to="/businesses"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-emerald-700 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Business Directory
        </Link>
      </div>

      {/* Title & Top Metadata Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${meta.color}`}>
              {meta.label}
            </span>
            <span className="flex items-center gap-1 text-xs text-emerald-700 font-semibold bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5" /> 100% Verified Community Host
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            {business.name}
          </h1>

          <p className="text-xs sm:text-sm text-slate-500 flex items-center gap-1">
            <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            {business.address} • <Link to={`/destinations/${business.destination?._id}`} className="text-emerald-700 underline font-medium">{business.destination?.name}</Link>
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleFavoriteToggle}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-sm transition"
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
            <span>{isFavorited ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => setBookingOpen(true)}
            className="px-6 py-2.5 rounded-xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition"
          >
            Reserve Now
          </button>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 rounded-3xl overflow-hidden aspect-[16/9] max-h-[460px]">
        <div className="md:col-span-2 h-full overflow-hidden">
          <img
            src={business.images && business.images.length > 0 ? business.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80'}
            alt={business.name}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
          />
        </div>
        <div className="hidden md:flex flex-col gap-4 h-full">
          <div className="flex-1 overflow-hidden">
            <img
              src={business.images && business.images[1] ? business.images[1] : 'https://images.unsplash.com/photo-1587061949409-02df41d5e562?auto=format&fit=crop&w=800&q=80'}
              alt="Secondary Preview"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="flex-1 overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1551632811-561732d1e306?auto=format&fit=crop&w=800&q=80"
              alt="Experience Thumbnail"
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>
      </div>

      {/* Main Grid: Details + Sticky Reservation Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Left Column: Business Story, Amenities, Host info */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Host info card */}
          <div className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-slate-200/80 shadow-sm">
            <img
              src={business.owner?.avatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=120&q=80'}
              alt={business.owner?.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-emerald-400"
            />
            <div>
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Hosted by
              </span>
              <h3 className="font-bold text-base text-slate-900">{business.owner?.name || 'Local Community Cooperative'}</h3>
              <p className="text-xs text-slate-500">Native tourism ambassador & verified local service provider</p>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">About this Experience</h2>
            <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
              {business.description}
            </p>
          </div>

          {/* Amenities & Highlights */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">What is Included / Amenities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {business.amenities?.map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-200/60 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Operating hours & Contact info */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">Host Contact & Hours</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-emerald-600" /> Hours
                </span>
                <p className="font-medium text-slate-800">{business.operatingHours}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-emerald-600" /> Phone
                </span>
                <p className="font-medium text-slate-800">{business.contactPhone || '+91 Direct on Booking'}</p>
              </div>
              <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-1">
                <span className="text-slate-400 font-semibold flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-emerald-600" /> Email
                </span>
                <p className="font-medium text-slate-800 truncate">{business.contactEmail || 'host@terralocal.org'}</p>
              </div>
            </div>
          </div>

          {/* Location Map */}
          <div className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Exact Map Location
            </h2>
            <TourismMap
              businesses={[business]}
              center={business.location}
              zoom={13}
              height="350px"
            />
          </div>

          {/* Customer Reviews Section */}
          <div className="space-y-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Community Reviews</h2>
                <div className="flex items-center gap-2 mt-1">
                  <div className="flex items-center text-amber-500">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span className="ml-1 text-sm font-bold text-slate-900">
                      {business.ratingAverage > 0 ? business.ratingAverage.toFixed(1) : 'New'}
                    </span>
                  </div>
                  <span className="text-xs text-slate-400">• {business.reviewCount} verified ratings</span>
                </div>
              </div>

              <button
                onClick={() => setReviewOpen(true)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition"
              >
                <MessageSquarePlus className="w-3.5 h-3.5 text-emerald-600" /> Write a Review
              </button>
            </div>

            {reviews.length === 0 ? (
              <div className="p-6 text-center bg-slate-50 rounded-2xl border border-dashed border-slate-300">
                <p className="text-xs text-slate-500">No reviews yet. Be the first tourist to review this experience!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviews.map((rev) => (
                  <div key={rev._id} className="p-4 bg-white rounded-2xl border border-slate-200/80 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={rev.tourist?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=80'}
                          alt={rev.tourist?.name}
                          className="w-8 h-8 rounded-full object-cover border border-emerald-200"
                        />
                        <span className="text-xs font-bold text-slate-800">{rev.tourist?.name}</span>
                      </div>
                      <div className="flex items-center gap-0.5">
                        {[...Array(rev.rating)].map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                    <span className="text-[10px] text-slate-400 block">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Right Column: Sticky Booking Widget Card */}
        <div>
          <div className="sticky top-28 bg-white p-6 rounded-3xl border border-emerald-100 shadow-xl space-y-6">
            
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider">
                Fair Direct Pricing
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-extrabold text-slate-900">
                  ₹{business.pricePerUnit?.toLocaleString()}
                </span>
                <span className="text-xs text-slate-500">
                  /{business.pricingUnit ? business.pricingUnit.replace('per_', '') : 'unit'}
                </span>
              </div>
              <p className="text-[11px] text-slate-400">All local taxes included. Zero platform markup.</p>
            </div>

            <div className="space-y-3 pt-2 border-t border-slate-100 text-xs text-slate-600">
              <div className="flex items-center justify-between">
                <span>Availability:</span>
                <span className="capitalize font-semibold text-emerald-700">{business.availabilityStatus}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cancellation:</span>
                <span className="font-semibold text-slate-800">Free up to 48 hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Direct Payment:</span>
                <span className="font-semibold text-slate-800">Pay direct to local host</span>
              </div>
            </div>

            <button
              onClick={() => setBookingOpen(true)}
              className="w-full py-3.5 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 transition shadow-lg shadow-emerald-600/30"
            >
              Book This Experience
            </button>

            <div className="text-center">
              <span className="text-[11px] text-slate-400">Instant confirmation • Verified host guarantee</span>
            </div>

          </div>
        </div>

      </div>

      {/* Booking Modal */}
      <BookingModal
        business={business}
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />

      {/* Review Modal */}
      <ReviewModal
        business={business}
        isOpen={reviewOpen}
        onClose={() => setReviewOpen(false)}
        onReviewSuccess={handleReviewAdded}
      />

    </div>
  );
};

export default BusinessDetailPage;