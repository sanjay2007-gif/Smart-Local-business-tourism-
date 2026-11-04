import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Star, MapPin, Heart, CheckCircle2, Home, Compass, Utensils, Palette, Sparkles, Activity } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import api from '../../api/axiosClient';

// Category color and icon mapping
export const getCategoryMeta = (cat) => {
  switch (cat) {
    case 'homestay':
    case 'hotel':
      return { label: 'Homestay / Stay', color: 'bg-emerald-100 text-emerald-800 border-emerald-200', icon: Home };
    case 'tour_guide':
      return { label: 'Tour Guide', color: 'bg-amber-100 text-amber-800 border-amber-200', icon: Compass };
    case 'restaurant':
      return { label: 'Local Cuisine', color: 'bg-orange-100 text-orange-800 border-orange-200', icon: Utensils };
    case 'artisan':
      return { label: 'Artisan Workshop', color: 'bg-indigo-100 text-indigo-800 border-indigo-200', icon: Palette };
    case 'cultural_activity':
      return { label: 'Cultural Activity', color: 'bg-purple-100 text-purple-800 border-purple-200', icon: Sparkles };
    default:
      return { label: 'Local Service', color: 'bg-slate-100 text-slate-800 border-slate-200', icon: Activity };
  }
};

const BusinessCard = ({ business, isFavoriteInitial = false, onFavoriteToggle }) => {
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();
  const [isFavorited, setIsFavorited] = useState(isFavoriteInitial);
  const [favLoading, setFavLoading] = useState(false);

  const meta = getCategoryMeta(business.category);
  const IconComponent = meta.icon;

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      showToast('Please log in to save to your favorites list.', 'info');
      return;
    }

    try {
      setFavLoading(true);
      const res = await api.post(`/reviews/favorite/${business._id}`);
      setIsFavorited(res.data.isFavorited);
      showToast(res.data.message, 'success');
      if (onFavoriteToggle) onFavoriteToggle(business._id, res.data.isFavorited);
    } catch (err) {
      showToast('Could not update favorites.', 'error');
    } finally {
      setFavLoading(false);
    }
  };

  const image = business.images && business.images.length > 0
    ? business.images[0]
    : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="group bg-white rounded-2xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-200 transition-all duration-300 flex flex-col overflow-hidden">
      
      {/* Image Thumbnail Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
        <img
          src={image}
          alt={business.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />

        {/* Category Pill */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-md bg-white/90 shadow-sm text-slate-800">
          <IconComponent className="w-3.5 h-3.5 text-emerald-600" />
          <span>{meta.label}</span>
        </div>

        {/* Favorite Heart Button */}
        <button
          onClick={handleFavoriteClick}
          disabled={favLoading}
          aria-label="Save Favorite"
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-slate-600 hover:text-rose-500 hover:bg-white shadow-sm transition active:scale-90"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFavorited ? 'fill-rose-500 text-rose-500' : 'text-slate-600'
            }`}
          />
        </button>

        {/* Price Tag Overlay */}
        <div className="absolute bottom-3 left-3 bg-emerald-950/80 backdrop-blur-md text-white px-3 py-1 rounded-lg text-xs font-bold flex items-baseline gap-1">
          <span>₹{business.pricePerUnit?.toLocaleString()}</span>
          <span className="text-[10px] text-emerald-300 font-normal">
            /{business.pricingUnit ? business.pricingUnit.replace('per_', '') : 'unit'}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div>
          {/* Destination and Rating Row */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span className="flex items-center gap-1 text-slate-600 font-medium truncate max-w-[170px]">
              <MapPin className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
              {business.destination?.name || 'Local Region'}
            </span>
            <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-md text-amber-800 font-semibold text-xs border border-amber-200/50">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>{business.ratingAverage > 0 ? business.ratingAverage.toFixed(1) : 'New'}</span>
              {business.reviewCount > 0 && (
                <span className="text-slate-400 font-normal text-[11px]">({business.reviewCount})</span>
              )}
            </div>
          </div>

          {/* Title */}
          <Link to={`/businesses/${business._id}`}>
            <h3 className="font-bold text-slate-900 group-hover:text-emerald-700 transition line-clamp-1 text-base">
              {business.name}
            </h3>
          </Link>

          {/* Short description */}
          <p className="text-xs text-slate-500 line-clamp-2 mt-1 leading-relaxed">
            {business.description}
          </p>

          {/* Amenities / Tags badges */}
          <div className="flex flex-wrap gap-1.5 mt-3">
            {business.amenities?.slice(0, 2).map((amenity, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded-md font-medium"
              >
                {amenity}
              </span>
            ))}
            {business.tags?.slice(0, 1).map((tag, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md font-medium capitalize"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Verified Host
          </span>
          <Link
            to={`/businesses/${business._id}`}
            className="text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 px-4 py-2 rounded-xl transition shadow-sm hover:shadow"
          >
            Book Experience
          </Link>
        </div>
      </div>

    </div>
  );
};

export default BusinessCard;