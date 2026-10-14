import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Ride } from '../types';
import { getActivityMeta, formatSessionDate, formatDistance } from '../utils/helpers';
import { useI18n } from '../utils/i18n';
import { Layers, Navigation, Plus, Minus, MapPin, Gift } from 'lucide-react';

interface MapComponentProps {
  rides: Ride[];
  selectedRideId?: string | null;
  onSelectRide: (ride: Ride) => void;
  center?: [number, number];
  zoom?: number;
}

export const MapComponent: React.FC<MapComponentProps> = ({
  rides,
  selectedRideId,
  onSelectRide,
  center = [48.8584, 2.3600], // Paris center (Marais / Bastille / Canal area)
  zoom = 13,
}) => {
  const { lang, t } = useI18n();
  const mapRef = useRef<HTMLDivElement>(null);
  const leafletInstance = useRef<L.Map | null>(null);
  const markersGroup = useRef<L.LayerGroup | null>(null);
  const currentTileLayer = useRef<L.TileLayer | null>(null);

  const [mapStyle, setMapStyle] = useState<'google-voyager' | 'streets'>('google-voyager');

  // Initialize Map
  useEffect(() => {
    if (!mapRef.current || leafletInstance.current) return;

    const map = L.map(mapRef.current, {
      center: center as L.LatLngTuple,
      zoom,
      zoomControl: false,
    });

    // High visibility Google Maps style street tiles (Carto Voyager)
    const tileUrl =
      mapStyle === 'google-voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const tiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(map);

    currentTileLayer.current = tiles;
    leafletInstance.current = map;
    markersGroup.current = L.layerGroup().addTo(map);

    return () => {
      map.remove();
      leafletInstance.current = null;
    };
  }, []);

  // Handle tile style switch
  useEffect(() => {
    if (!leafletInstance.current) return;

    if (currentTileLayer.current) {
      leafletInstance.current.removeLayer(currentTileLayer.current);
    }

    const tileUrl =
      mapStyle === 'google-voyager'
        ? 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png'
        : 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

    const newTiles = L.tileLayer(tileUrl, {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    }).addTo(leafletInstance.current);

    currentTileLayer.current = newTiles;
  }, [mapStyle]);

  // Sync Center/Zoom
  useEffect(() => {
    if (leafletInstance.current) {
      leafletInstance.current.setView(center, zoom, { animate: true });
    }
  }, [center[0], center[1], zoom]);

  // Render Rich Markers and Popovers
  useEffect(() => {
    if (!leafletInstance.current || !markersGroup.current) return;

    markersGroup.current.clearLayers();

    rides.forEach((ride) => {
      const isSelected = ride.id === selectedRideId;
      const meta = getActivityMeta(ride.activity);
      const title = lang === 'fr' && ride.titleFr ? ride.titleFr : ride.title;
      const formattedDate = formatSessionDate(ride.date, ride.time);
      const formattedDist = ride.distanceKm > 0 ? formatDistance(ride.distanceKm) : null;

      // Custom Google-style Teardrop Pin
      const customIcon = L.divIcon({
        className: 'custom-google-pin',
        html: `
          <div class="relative group cursor-pointer" style="transform: translate(-50%, -100%);">
            <div class="flex items-center gap-1 bg-white px-2 py-1 rounded-full shadow-md border border-zinc-200 text-[11px] font-bold text-zinc-900 whitespace-nowrap mb-1">
              <span style="color: ${meta.colorHex}; font-size: 9px;">${meta.shapeChar}</span>
              <span>${ride.shopName}</span>
            </div>
            <div class="w-8 h-8 rounded-full border-2 border-white shadow-lg flex items-center justify-center font-bold text-xs text-white mx-auto transition-transform ${
              isSelected ? 'scale-125 ring-4 ring-[#2563eb] z-50' : 'hover:scale-110'
            }" style="background-color: ${meta.colorHex};">
              <span>${meta.shapeChar}</span>
            </div>
            <div class="w-2 h-2 rotate-45 border-r border-b border-white mx-auto -mt-1 shadow-sm" style="background-color: ${meta.colorHex};"></div>
          </div>
        `,
        iconSize: [40, 50],
        iconAnchor: [20, 50],
      });

      const marker = L.marker([ride.lat, ride.lng], { icon: customIcon });

      // Rich Google Maps Style Popover HTML
      const popupHtml = `
        <div style="font-family: 'Work Sans', sans-serif; width: 220px; padding: 2px;">
          ${
            ride.heroImage
              ? `<img src="${ride.heroImage}" alt="${title}" style="width: 100%; height: 90px; object-fit: cover; border-radius: 8px; margin-bottom: 8px;" />`
              : ''
          }
          <div style="font-size: 10px; color: ${meta.colorHex}; font-weight: 700; text-transform: uppercase; margin-bottom: 2px;">
            ${meta.shapeChar} ${meta.labelEn} · ${ride.shopCategory}
          </div>
          <strong style="font-family: 'Fugaz One', sans-serif; font-size: 13px; line-height: 1.25; display: block; color: #09090b; margin-bottom: 4px;">
            ${title}
          </strong>
          <div style="font-size: 11px; color: #71717a; margin-bottom: 4px;">
            ${formattedDate} ${formattedDist ? `· ${formattedDist}` : ''}
          </div>
          <div style="font-size: 11px; color: #09090b; font-weight: 500; margin-bottom: 8px;">
            📍 ${ride.meetingPoint}
          </div>
          <button id="pop-btn-${ride.id}" style="width: 100%; padding: 6px 12px; background: #2563eb; color: #ffffff; border: none; border-radius: 9999px; font-family: 'Fugaz One', sans-serif; font-size: 11px; cursor: pointer;">
            ${lang === 'en' ? 'View session details' : 'Voir la session'}
          </button>
        </div>
      `;

      marker.bindPopup(popupHtml, {
        maxWidth: 240,
        className: 'google-style-popup',
      });

      marker.on('popupopen', () => {
        const btn = document.getElementById(`pop-btn-${ride.id}`);
        if (btn) {
          btn.onclick = () => onSelectRide(ride);
        }
      });

      marker.on('click', () => {
        onSelectRide(ride);
      });

      markersGroup.current?.addLayer(marker);
    });
  }, [rides, selectedRideId, onSelectRide, lang]);

  return (
    <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-[#f4f4f5] rounded-2xl">
      <div ref={mapRef} className="w-full h-full" />

      {/* Floating Map Controls in top right */}
      <div className="absolute top-3 right-3 z-[400] flex flex-col gap-2">
        {/* Style Switcher */}
        <div className="bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-zinc-200 p-1 flex items-center text-xs">
          <button
            onClick={() => setMapStyle('google-voyager')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              mapStyle === 'google-voyager'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Google Style
          </button>
          <button
            onClick={() => setMapStyle('streets')}
            className={`px-2.5 py-1 rounded-lg font-semibold transition ${
              mapStyle === 'streets'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            Detailed OSM
          </button>
        </div>

        {/* Zoom & Recenter Controls */}
        <div className="bg-white/95 backdrop-blur-xs rounded-xl shadow-md border border-zinc-200 p-1 flex flex-col gap-1 items-center">
          <button
            onClick={() => leafletInstance.current?.zoomIn()}
            className="p-1.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
            title="Zoom in"
          >
            <Plus className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <div className="w-4 h-[1px] bg-zinc-200" />
          <button
            onClick={() => leafletInstance.current?.zoomOut()}
            className="p-1.5 text-zinc-700 hover:text-zinc-900 hover:bg-zinc-100 rounded-lg transition"
            title="Zoom out"
          >
            <Minus className="w-4 h-4" strokeWidth={2.5} />
          </button>
          <div className="w-4 h-[1px] bg-zinc-200" />
          <button
            onClick={() => leafletInstance.current?.setView([48.8584, 2.3600], 13)}
            className="p-1.5 text-zinc-700 hover:text-[#2563eb] hover:bg-zinc-100 rounded-lg transition"
            title="Center Paris"
          >
            <Navigation className="w-3.5 h-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>
    </div>
  );
};
