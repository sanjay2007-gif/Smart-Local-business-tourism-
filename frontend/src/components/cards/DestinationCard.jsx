import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Compass, ArrowRight } from 'lucide-react';

const DestinationCard = ({ destination }) => {
  const image = destination.images && destination.images.length > 0
    ? destination.images[0]
    : 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1200&q=80';

  return (
    <Link
      to={`/destinations/${destination._id}`}
      className="group relative rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 aspect-[4/5] sm:aspect-[3/4] flex flex-col justify-end p-6 border border-slate-200/40"
    >
      {/* Background Image with Zoom */}
      <img
        src={image}
        alt={destination.name}
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        loading="lazy"
      />

      {/* Dark gradient for legibility */}
      <div className="absolute inset-0 bg-gradient-to-t from-emerald-950/90 via-emerald-950/40 to-transparent opacity-85 group-hover:opacity-90 transition-opacity" />

      {/* Content */}
      <div className="relative z-10 space-y-2 text-white">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase bg-white/20 backdrop-blur-md text-emerald-200">
            {destination.category ? destination.category.replace('_', ' ') : 'Heritage'}
          </span>
          <span className="text-xs text-slate-300 font-medium flex items-center gap-1">
            <MapPin className="w-3 h-3 text-emerald-400" />
            {destination.state}
          </span>
        </div>

        <h3 className="text-xl font-bold tracking-tight text-white group-hover:text-emerald-300 transition leading-snug">
          {destination.name}
        </h3>

        <p className="text-xs text-slate-300/90 line-clamp-2 leading-relaxed">
          {destination.shortDescription || destination.description}
        </p>

        {/* Highlights Pills */}
        <div className="flex flex-wrap gap-1 pt-1">
          {destination.highlights?.slice(0, 2).map((hl, i) => (
            <span key={i} className="text-[10px] bg-black/30 backdrop-blur-sm text-slate-200 px-2 py-0.5 rounded">
              • {hl}
            </span>
          ))}
        </div>

        <div className="pt-2 flex items-center justify-between text-xs font-semibold text-emerald-300 group-hover:text-white transition">
          <span>Discover Local Experiences</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
};

export default DestinationCard;