import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { MapPin, Calendar, Compass, ArrowLeft, Trees, Sparkles } from 'lucide-react';
import api from '../api/axiosClient';
import BusinessCard from '../components/cards/BusinessCard';
import TourismMap from '../components/map/TourismMap';

const DestinationDetailPage = () => {
  const { id } = useParams();
  const [destination, setDestination] = useState(null);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/destinations/${id}`);
        setDestination(res.data.data.destination);
        setBusinesses(res.data.data.businesses);
      } catch (err) {
        console.error('Failed to load destination details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <div className="w-12 h-12 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-xs text-slate-500 mt-4">Loading regional paradise...</p>
      </div>
    );
  }

  if (!destination) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold text-slate-800">Destination not found</h2>
        <Link to="/destinations" className="text-emerald-600 text-xs font-semibold hover:underline mt-2 inline-block">
          &larr; Back to all destinations
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-12 pb-20">
      
      {/* Hero Visual Banner */}
      <div className="relative h-[420px] sm:h-[480px] bg-slate-900 text-white overflow-hidden">
        <img
          src={destination.images && destination.images.length > 0 ? destination.images[0] : 'https://images.unsplash.com/photo-1593693397690-362cb9666fc2?auto=format&fit=crop&w=1400&q=80'}
          alt={destination.name}
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-950/40 to-transparent"></div>

        <div className="absolute inset-0 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col justify-between py-8">
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-medium w-max hover:bg-white/30 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Destinations
          </Link>

          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-600 text-white">
                {destination.category ? destination.category.replace('_', ' ') : 'Heritage'}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-200 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" /> {destination.state}, {destination.region}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 backdrop-blur-md text-emerald-200 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Best season: {destination.bestTimeToVisit}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              {destination.name}
            </h1>
          </div>
        </div>
      </div>

      {/* Content & Details Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Description & Key Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-xl font-bold text-slate-900">About this Destination</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              {destination.description}
            </p>

            <div className="pt-2">
              <h3 className="text-sm font-bold text-slate-900 mb-2">Regional Highlights & Trails</h3>
              <div className="flex flex-wrap gap-2">
                {destination.highlights?.map((hl, i) => (
                  <span
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                    {hl}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Itinerary Planner CTA Box */}
          <div className="bg-emerald-50 rounded-2xl p-6 border border-emerald-200/80 space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                AI / Smart Itinerary
              </span>
              <h3 className="font-bold text-slate-900 text-base">Plan a custom trip to {destination.name}</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Generate a day-by-day morning, afternoon, and evening schedule linking native hosts and local artisans.
              </p>
            </div>
            <Link
              to={`/itinerary-planner?destination=${destination._id}`}
              className="w-full py-3 text-center text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition shadow-md"
            >
              Generate Day-Wise Itinerary
            </Link>
          </div>

        </div>

        {/* Local Tourism Map */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-emerald-600" /> Local Map & Host Locations
            </h2>
            <span className="text-xs text-slate-500 font-medium">{businesses.length} experiences pinned</span>
          </div>

          <TourismMap
            businesses={businesses}
            center={destination.location}
            zoom={12}
            height="420px"
          />
        </div>

        {/* Registered Local Businesses at this Destination */}
        <div className="space-y-6">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700">Community Directory</span>
            <h2 className="text-2xl font-bold text-slate-900">
              Local Businesses in {destination.name}
            </h2>
          </div>

          {businesses.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-2xl border border-dashed border-slate-300">
              <p className="text-xs text-slate-500">No local businesses registered in this region yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {businesses.map((biz) => (
                <BusinessCard key={biz._id} business={biz} />
              ))}
            </div>
          )}
        </div>

      </div>

    </div>
  );
};

export default DestinationDetailPage;