import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, Store, Star, X } from 'lucide-react';
import api from '../api/axiosClient';
import BusinessCard from '../components/cards/BusinessCard';

const BusinessListPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [businesses, setBusinesses] = useState([]);
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [destination, setDestination] = useState(searchParams.get('destination') || 'all');
  const [minRating, setMinRating] = useState(searchParams.get('minRating') || '');
  const [maxPrice, setMaxPrice] = useState(searchParams.get('maxPrice') || '');
  const [sort, setSort] = useState(searchParams.get('sort') || 'rating');

  // Fetch destinations for filter dropdown
  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        setDestinations(res.data.data);
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };
    fetchDestinations();
  }, []);

  // Fetch businesses whenever filters change
  useEffect(() => {
    const fetchBusinesses = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (search) params.set('search', search);
        if (category && category !== 'all') params.set('category', category);
        if (destination && destination !== 'all') params.set('destination', destination);
        if (minRating) params.set('minRating', minRating);
        if (maxPrice) params.set('maxPrice', maxPrice);
        if (sort) params.set('sort', sort);

        setSearchParams(params);

        const res = await api.get(`/businesses?${params.toString()}`);
        setBusinesses(res.data.data);
      } catch (err) {
        console.error('Failed to load businesses:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchBusinesses();
  }, [search, category, destination, minRating, maxPrice, sort]);

  const resetFilters = () => {
    setSearch('');
    setCategory('all');
    setDestination('all');
    setMinRating('');
    setMaxPrice('');
    setSort('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
          Local Tourism Directory
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore Verified Community Businesses
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Support local homestays, licensed trail guides, regional artisan studios, and family-owned restaurants.
        </p>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
        
        {/* Top Search & Reset Row */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
          
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
            <input
              type="text"
              placeholder="Search by host, keyword, amenities (e.g. WiFi, campfire, thali)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="newest">Recently Added</option>
            </select>
          </div>

          <div className="sm:col-span-3 flex items-center justify-end">
            <button
              onClick={resetFilters}
              className="text-xs font-semibold text-slate-500 hover:text-emerald-700 flex items-center gap-1 transition"
            >
              <X className="w-3.5 h-3.5" /> Reset Filters
            </button>
          </div>

        </div>

        {/* Secondary Filter Dropdowns */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-slate-100">
          
          {/* Category */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium"
            >
              <option value="all">All Categories</option>
              <option value="homestay">Homestays & Stays</option>
              <option value="tour_guide">Tour Guides & Treks</option>
              <option value="artisan">Artisan Workshops</option>
              <option value="restaurant">Dining & Cafes</option>
              <option value="cultural_activity">Cultural Activities</option>
            </select>
          </div>

          {/* Destination */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Destination
            </label>
            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium"
            >
              <option value="all">All Regions</option>
              {destinations.map((d) => (
                <option key={d._id} value={d._id}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Min Rating */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Minimum Rating
            </label>
            <select
              value={minRating}
              onChange={(e) => setMinRating(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium"
            >
              <option value="">Any Rating</option>
              <option value="4.5">★ 4.5 & above</option>
              <option value="4.0">★ 4.0 & above</option>
              <option value="3.5">★ 3.5 & above</option>
            </select>
          </div>

          {/* Max Price */}
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Max Budget
            </label>
            <select
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              className="w-full py-2 px-2.5 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium"
            >
              <option value="">Any Budget</option>
              <option value="1000">Under ₹1,000</option>
              <option value="2500">Under ₹2,500</option>
              <option value="4000">Under ₹4,000</option>
            </select>
          </div>

        </div>

      </div>

      {/* Results Count & Grid */}
      <div className="flex items-center justify-between text-xs font-semibold text-slate-500">
        <span>Showing {businesses.length} experiences</span>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
          ))}
        </div>
      ) : businesses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 space-y-3">
          <Store className="w-12 h-12 text-slate-300 mx-auto" />
          <h3 className="text-base font-bold text-slate-700">No local businesses match your filters</h3>
          <p className="text-xs text-slate-400">Try broadening your search or resetting filters</p>
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {businesses.map((biz) => (
            <BusinessCard key={biz._id} business={biz} />
          ))}
        </div>
      )}

    </div>
  );
};

export default BusinessListPage;