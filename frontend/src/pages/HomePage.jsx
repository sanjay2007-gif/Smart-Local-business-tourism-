import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  Search,
  MapPin,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  HeartHandshake,
  Trees,
  CheckCircle2,
  Home,
  Palette,
  Utensils
} from 'lucide-react';
import api from '../api/axiosClient';
import BusinessCard from '../components/cards/BusinessCard';
import DestinationCard from '../components/cards/DestinationCard';

const HomePage = () => {
  const navigate = useNavigate();
  const [featuredDestinations, setFeaturedDestinations] = useState([]);
  const [popularBusinesses, setPopularBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search form state
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [destRes, bizRes] = await Promise.all([
          api.get('/destinations/featured'),
          api.get('/businesses/popular')
        ]);
        setFeaturedDestinations(destRes.data.data);
        setPopularBusinesses(bizRes.data.data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery) params.set('search', searchQuery);
    if (categoryFilter !== 'all') params.set('category', categoryFilter);
    navigate(`/businesses?${params.toString()}`);
  };

  const categories = [
    { id: 'homestay', name: 'Eco Homestays', icon: Home, count: 'Authentic Stays' },
    { id: 'tour_guide', name: 'Local Guides', icon: Compass, count: 'Nature & Treks' },
    { id: 'artisan', name: 'Artisan Crafts', icon: Palette, count: 'Indigenous Skills' },
    { id: 'restaurant', name: 'Cultural Dining', icon: Utensils, count: 'Regional Flavors' },
    { id: 'cultural_activity', name: 'Workshops', icon: Sparkles, count: 'Living Heritage' },
  ];

  return (
    <div className="space-y-20 pb-20">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-20 pb-28 px-4 sm:px-6 lg:px-8">
        
        {/* Decorative backdrop glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-full pointer-events-none opacity-20">
          <div className="absolute -top-20 -left-20 w-96 h-96 rounded-full bg-emerald-400 blur-3xl"></div>
          <div className="absolute top-40 -right-20 w-96 h-96 rounded-full bg-emerald-500 blur-3xl"></div>
        </div>

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-emerald-300 border border-emerald-400/30 text-xs font-semibold tracking-wide uppercase">
            <Trees className="w-3.5 h-3.5 text-emerald-400" />
            Empowering Fair Local Tourism
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
            Discover Authentic Stays & Local Adventures, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-emerald-400">
              Directly From Native Hosts.
            </span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-emerald-100/90 leading-relaxed font-light">
            Connect directly with verified homestays, indigenous artisans, tribal naturalists, and traditional dining. 100% of your travel spend stays with the community.
          </p>

          {/* Quick Search Floating Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="bg-white p-3 sm:p-4 rounded-3xl shadow-2xl max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-12 gap-3 text-slate-800 border border-emerald-100"
          >
            {/* Query input */}
            <div className="sm:col-span-6 relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5" />
              <input
                type="text"
                placeholder="Where to? (e.g. Munnar, Pottery, Wildlife Trek)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-3 py-3 text-sm rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
              />
            </div>

            {/* Category dropdown */}
            <div className="sm:col-span-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-3 px-3 text-sm rounded-2xl bg-slate-50 border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 font-medium text-slate-700"
              >
                <option value="all">All Experiences</option>
                <option value="homestay">Homestays</option>
                <option value="tour_guide">Guides & Treks</option>
                <option value="artisan">Artisan Crafts</option>
                <option value="restaurant">Dining & Cafes</option>
                <option value="cultural_activity">Cultural Tours</option>
              </select>
            </div>

            {/* Submit CTA */}
            <div className="sm:col-span-3">
              <button
                type="submit"
                className="w-full h-full py-3 px-4 rounded-2xl font-bold text-sm text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-700/30 transition flex items-center justify-center gap-1.5"
              >
                <span>Find Local</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Stats Pill Row */}
          <div className="flex flex-wrap items-center justify-center gap-8 pt-4 text-xs sm:text-sm text-emerald-200/80">
            <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Verified Community Hosts</span>
            <span className="flex items-center gap-1.5"><HeartHandshake className="w-4 h-4 text-emerald-400" /> Zero Middleman Markup</span>
            <span className="flex items-center gap-1.5"><Sparkles className="w-4 h-4 text-emerald-400" /> Smart Day-Wise Planner</span>
          </div>

        </div>
      </section>

      {/* Category Shortcuts */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Explore by Category</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curated Local Experiences
          </h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.id}
                to={`/businesses?category=${cat.id}`}
                className="group p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all duration-300 text-center flex flex-col items-center justify-center space-y-3"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-inner">
                  <Icon className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-slate-900 group-hover:text-emerald-700 transition">
                    {cat.name}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-0.5">{cat.count}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Top Destinations</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Regional Havens
            </h2>
          </div>
          <Link
            to="/destinations"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
          >
            Explore All Regions <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[3/4] bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <DestinationCard key={dest._id} destination={dest} />
            ))}
          </div>
        )}
      </section>

      {/* Popular Businesses & Homestays */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">Highest Rated</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Popular Local Experiences
            </h2>
          </div>
          <Link
            to="/businesses"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-900 hover:underline"
          >
            View All Experiences <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 animate-pulse rounded-2xl"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularBusinesses.map((biz) => (
              <BusinessCard key={biz._id} business={biz} />
            ))}
          </div>
        )}
      </section>

      {/* Interactive Map Teaser Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-8 sm:p-12 shadow-xl border border-emerald-700/40 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold">
              <MapPin className="w-3.5 h-3.5" /> Interactive Spatial Discovery
            </span>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight">
              Explore Local Tourism on OpenStreetMap
            </h3>
            <p className="text-sm text-emerald-100/90 leading-relaxed">
              Find secret nature trails, rustic cottages, and pottery studios with pin-point geographic locations. Filter by price, category, and real-time distance.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <Link
                to="/map"
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-white text-emerald-900 hover:bg-emerald-50 transition shadow-lg"
              >
                Launch Tourism Map
              </Link>
              <Link
                to="/itinerary-planner"
                className="px-6 py-3 rounded-2xl font-bold text-sm bg-emerald-700/60 hover:bg-emerald-700 text-white transition border border-emerald-500/30"
              >
                Plan Itinerary
              </Link>
            </div>
          </div>

          <div className="w-full md:w-80 aspect-video rounded-2xl overflow-hidden shadow-2xl border-2 border-white/20">
            <img
              src="https://images.unsplash.com/photo-1524661135-423995f22d0b?auto=format&fit=crop&w=600&q=80"
              alt="Map Preview"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

    </div>
  );
};

export default HomePage;