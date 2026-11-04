import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Heart, Shield, Award, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-emerald-950 text-slate-300 pt-16 pb-10 border-t border-emerald-900/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-emerald-900/50">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <Compass className="w-6 h-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Terra<span className="text-emerald-400">Local</span>
              </span>
            </Link>
            <p className="text-sm text-slate-300/80 leading-relaxed max-w-sm">
              Empowering local homestay hosts, indigenous artisans, certified eco-guides, and authentic cultural kitchens to bring sustainable travel to life.
            </p>
            <div className="flex items-center gap-4 pt-2 text-xs text-emerald-400">
              <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" /> 100% Verified Hosts</span>
              <span className="flex items-center gap-1.5"><Award className="w-4 h-4" /> Fair Local Pricing</span>
            </div>
          </div>

          {/* Col 2: Destinations */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 text-emerald-300">
              Top Regions
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/destinations" className="hover:text-emerald-400 transition">Munnar Tea Highlands</Link></li>
              <li><Link to="/destinations" className="hover:text-emerald-400 transition">Jaipur Royal Heritage</Link></li>
              <li><Link to="/destinations" className="hover:text-emerald-400 transition">Gokarna Coastal Coast</Link></li>
              <li><Link to="/destinations" className="hover:text-emerald-400 transition">Bandipur Wildlife Reserve</Link></li>
            </ul>
          </div>

          {/* Col 3: Portal Features */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 text-emerald-300">
              Explore Smart Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/businesses" className="hover:text-emerald-400 transition">Local Homestays & Tours</Link></li>
              <li><Link to="/map" className="hover:text-emerald-400 transition">Interactive Tourism Map</Link></li>
              <li><Link to="/itinerary-planner" className="hover:text-emerald-400 transition">Day-Wise Itinerary Planner</Link></li>
              <li><Link to="/recommendations" className="hover:text-emerald-400 transition">Personalized Suggestions</Link></li>
            </ul>
          </div>

          {/* Col 4: For Businesses */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wide uppercase mb-4 text-emerald-300">
              For Local Businesses
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/register?role=business_owner" className="hover:text-emerald-400 transition">Register as Business Owner</Link></li>
              <li><Link to="/login" className="hover:text-emerald-400 transition">Owner Portal Login</Link></li>
              <li><Link to="/businesses" className="hover:text-emerald-400 transition">Booking Management</Link></li>
              <li><span className="text-xs text-slate-400">Zero Commission Community Model</span></li>
            </ul>
          </div>

        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p>© 2026 Smart Local Tourism Business Portal. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for sustainable local communities
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;