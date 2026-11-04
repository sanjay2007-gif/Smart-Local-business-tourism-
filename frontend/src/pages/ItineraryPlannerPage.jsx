import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, Compass, Clock, MapPin, Sparkles, Bookmark, CheckCircle2 } from 'lucide-react';
import api from '../api/axiosClient';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const ItineraryPlannerPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  const [destinations, setDestinations] = useState([]);
  const [selectedDestId, setSelectedDestId] = useState(searchParams.get('destination') || '');
  const [daysCount, setDaysCount] = useState(3);
  const [title, setTitle] = useState('');
  const [generatedItinerary, setGeneratedItinerary] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        const res = await api.get('/destinations');
        setDestinations(res.data.data);
        if (!selectedDestId && res.data.data.length > 0) {
          setSelectedDestId(res.data.data[0]._id);
        }
      } catch (err) {
        console.error('Failed to load destinations:', err);
      }
    };
    fetchDestinations();
  }, [selectedDestId]);

  const handleGenerate = async (e) => {
    e.preventDefault();
    if (!selectedDestId) {
      showToast('Please select a destination.', 'error');
      return;
    }

    try {
      setGenerating(true);
      const res = await api.post('/itineraries/generate', {
        destinationId: selectedDestId,
        daysCount,
        title
      });
      setGeneratedItinerary(res.data.data);
      showToast('Itinerary generated successfully!', 'success');
    } catch (err) {
      showToast('Failed to generate itinerary.', 'error');
    } finally {
      setGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      showToast('Please log in as a tourist to save itineraries.', 'info');
      navigate('/login');
      return;
    }

    try {
      setSaving(true);
      await api.post('/itineraries', {
        destinationId: generatedItinerary.destination._id,
        title: generatedItinerary.title,
        daysCount: generatedItinerary.daysCount,
        days: generatedItinerary.days
      });
      showToast('Itinerary saved to your tourist dashboard!', 'success');
      navigate('/dashboard/tourist');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to save itinerary.', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="space-y-2">
        <span className="text-xs font-bold tracking-wider uppercase text-emerald-700">
          Smart Travel Engine
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Day-Wise Local Itinerary Planner
        </h1>
        <p className="text-sm text-slate-500 max-w-2xl">
          Instantly craft a balanced, authentic journey schedule combining native homestays, licensed trail guides, artisan craft workshops, and local feasts.
        </p>
      </div>

      {/* Generator Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-sm max-w-3xl">
        <form onSubmit={handleGenerate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Destination Selector */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Target Destination
              </label>
              <select
                required
                value={selectedDestId}
                onChange={(e) => setSelectedDestId(e.target.value)}
                className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                {destinations.map((d) => (
                  <option key={d._id} value={d._id}>
                    {d.name} ({d.state})
                  </option>
                ))}
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
                Duration (Days)
              </label>
              <select
                value={daysCount}
                onChange={(e) => setDaysCount(Number(e.target.value))}
                className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value={1}>1 Day Quick Excursion</option>
                <option value={2}>2 Days Weekend Retreat</option>
                <option value={3}>3 Days Classic Immersion</option>
                <option value={4}>4 Days Deep Exploration</option>
                <option value={5}>5 Days Full Experience</option>
                <option value={7}>7 Days Comprehensive Journey</option>
              </select>
            </div>

          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1.5">
              Custom Itinerary Title (Optional)
            </label>
            <input
              type="text"
              placeholder="e.g., Munnar Spice & Cloud Ridge Adventure"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full py-2.5 px-3 text-xs rounded-xl bg-slate-50 border border-slate-200 font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={generating}
            className="w-full sm:w-auto px-8 py-3 rounded-2xl font-bold text-xs text-white bg-emerald-600 hover:bg-emerald-700 shadow-md shadow-emerald-600/20 transition flex items-center justify-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            {generating ? 'Crafting Itinerary...' : 'Generate Smart Itinerary'}
          </button>
        </form>
      </div>

      {/* Generated Itinerary Display */}
      {generatedItinerary && (
        <div className="space-y-8 animate-fade-in pt-4">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white rounded-3xl shadow-lg">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-300">
                Generated Plan
              </span>
              <h2 className="text-2xl font-bold mt-0.5">{generatedItinerary.title}</h2>
              <p className="text-xs text-emerald-100/80 mt-1">
                {generatedItinerary.destination.name} • {generatedItinerary.daysCount} Days Schedule
              </p>
            </div>

            <button
              onClick={handleSave}
              disabled={saving}
              className="px-6 py-3 rounded-2xl font-bold text-xs bg-white text-emerald-950 hover:bg-emerald-50 transition shadow-md flex items-center gap-2"
            >
              <Bookmark className="w-4 h-4 text-emerald-700" />
              {saving ? 'Saving...' : 'Save to My Dashboard'}
            </button>
          </div>

          {/* Day Cards */}
          <div className="space-y-6">
            {generatedItinerary.days.map((day) => (
              <div
                key={day.dayNumber}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
                  <span className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-sm flex items-center justify-center">
                    {day.dayNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">
                      Day {day.dayNumber}: {day.theme}
                    </h3>
                  </div>
                </div>

                {/* Activities Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {day.activities.map((act, i) => (
                    <div
                      key={i}
                      className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-2 flex flex-col justify-between"
                    >
                      <div className="space-y-1.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-100/70 text-emerald-800 inline-block">
                          {act.timeSlot}
                        </span>
                        <h4 className="font-bold text-xs text-slate-900 leading-snug">
                          {act.title}
                        </h4>
                        <p className="text-[11px] text-slate-500 leading-relaxed">
                          {act.notes}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                        <span className="text-slate-400">Est. Cost:</span>
                        <span className="font-bold text-emerald-700">₹{act.estimatedCost?.toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            ))}
          </div>

        </div>
      )}

    </div>
  );
};

export default ItineraryPlannerPage;