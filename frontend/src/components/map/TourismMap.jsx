import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Link } from 'react-router-dom';
import { Star, MapPin } from 'lucide-react';

// Fix Leaflet default icon issues in bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom pin HTML generator
const createCustomPin = (category) => {
  let color = '#059669'; // default emerald
  if (category === 'tour_guide') color = '#d97706';
  if (category === 'restaurant') color = '#ea580c';
  if (category === 'artisan') color = '#4f46e5';
  if (category === 'cultural_activity') color = '#7c3aed';

  return L.divIcon({
    className: 'custom-map-marker',
    html: `
      <div style="
        background-color: ${color};
        width: 32px;
        height: 32px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid white;
        box-shadow: 0 4px 10px rgba(0,0,0,0.3);
      ">
        <div style="
          width: 10px;
          height: 10px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

// Component to recenter map when businesses change
const MapUpdater = ({ businesses, center }) => {
  const map = useMap();

  useEffect(() => {
    if (center && center.lat && center.lng) {
      map.setView([center.lat, center.lng], 12);
    } else if (businesses && businesses.length > 0) {
      const bounds = L.latLngBounds(
        businesses.map((b) => [b.location.lat, b.location.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [businesses, center, map]);

  return null;
};

const TourismMap = ({ businesses = [], center = null, zoom = 6, height = '500px' }) => {
  const defaultCenter = center || { lat: 14.5479, lng: 75.7873 };

  return (
    <div style={{ height }} className="w-full rounded-2xl overflow-hidden shadow-md border border-slate-200">
      <MapContainer
        center={[defaultCenter.lat, defaultCenter.lng]}
        zoom={zoom}
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapUpdater businesses={businesses} center={center} />

        {businesses.map((biz) => {
          if (!biz.location || !biz.location.lat || !biz.location.lng) return null;
          return (
            <Marker
              key={biz._id}
              position={[biz.location.lat, biz.location.lng]}
              icon={createCustomPin(biz.category)}
            >
              <Popup className="slt-map-popup">
                <div className="w-56 p-1 space-y-2">
                  <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                    <img
                      src={biz.images && biz.images.length > 0 ? biz.images[0] : 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80'}
                      alt={biz.name}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 text-[10px] bg-black/70 text-white px-2 py-0.5 rounded font-bold">
                      ₹{biz.pricePerUnit?.toLocaleString()} /{biz.pricingUnit?.replace('per_', '')}
                    </span>
                  </div>

                  <div>
                    <h4 className="font-bold text-slate-900 text-sm leading-tight">{biz.name}</h4>
                    <p className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3 h-3 text-emerald-600 flex-shrink-0" />
                      {biz.address || biz.destination?.name}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-100">
                    <div className="flex items-center gap-1 text-xs font-bold text-amber-700">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{biz.ratingAverage > 0 ? biz.ratingAverage.toFixed(1) : 'New'}</span>
                    </div>
                    <Link
                      to={`/businesses/${biz._id}`}
                      className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 underline"
                    >
                      View Details &rarr;
                    </Link>
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default TourismMap;