import React, { useState } from 'react';
import { Ride, SportType, Level } from '../types';
import { MapComponent } from './MapComponent';
import { Bike, Footprints, MapPin, Calendar, Clock, Navigation, Mountain, Users, PlusCircle, CheckCircle2 } from 'lucide-react';

interface PublishRideFormProps {
  onPublishRide: (newRide: Omit<Ride, 'id' | 'currentSpots' | 'registeredRiders'>) => void;
  onCancel: () => void;
  shopName: string;
  shopLocation: string;
}

export const PublishRideForm: React.FC<PublishRideFormProps> = ({
  onPublishRide,
  onCancel,
  shopName,
  shopLocation,
}) => {
  const [title, setTitle] = useState('');
  const [sport, setSport] = useState<SportType>('cycling');
  const [date, setDate] = useState('2026-08-08');
  const [time, setTime] = useState('08:00 AM');
  const [distanceKm, setDistanceKm] = useState(60);
  const [elevationGain, setElevationGain] = useState(450);
  const [level, setLevel] = useState<Level>('Intermediate');
  const [maxSpots, setMaxSpots] = useState(15);
  const [pace, setPace] = useState('25-28 km/h avg');
  const [meetingPoint, setMeetingPoint] = useState(`${shopName}, ${shopLocation}`);
  const [description, setDescription] = useState('');

  // Map pin placement location (default around Paris center)
  const [pinLocation, setPinLocation] = useState<[number, number]>([48.8566, 2.3522]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !meetingPoint.trim()) return;

    onPublishRide({
      shopId: 'shop-1',
      shopName,
      shopLocation,
      title,
      sport,
      date,
      time,
      distanceKm: Number(distanceKm),
      level,
      maxSpots: Number(maxSpots),
      lat: pinLocation[0],
      lng: pinLocation[1],
      meetingPoint,
      description: description.trim() || `Join ${shopName} for our upcoming ${sport} session!`,
      pace,
      elevationGain: Number(elevationGain),
    });
  };

  // Quick Preset Templates
  const applyPreset = (preset: 'saturday' | 'gravel' | 'run') => {
    if (preset === 'saturday') {
      setTitle('Saturday Morning Endurance Loop');
      setSport('cycling');
      setDistanceKm(75);
      setElevationGain(550);
      setLevel('Advanced');
      setPace('27-30 km/h avg');
      setDescription('Fast paceline ride into the countryside with coffee regroup at half-way mark.');
    } else if (preset === 'gravel') {
      setTitle('Social Gravel & Coffee');
      setSport('cycling');
      setDistanceKm(50);
      setElevationGain(350);
      setLevel('Intermediate');
      setPace('20-22 km/h off-road');
      setDescription('Scenic trail ride suitable for gravel bikes. No one left behind.');
    } else {
      setTitle('Sunset City Run Club');
      setSport('running');
      setDistanceKm(10);
      setElevationGain(60);
      setLevel('Beginner');
      setPace('5:30 min/km');
      setDescription('Fun city run ending with craft beers at the shop.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-zinc-900 border border-zinc-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div>
          <span className="text-[11px] font-extrabold uppercase tracking-wider text-orange-400 block">
            {shopName} Dashboard
          </span>
          <h1 className="text-2xl font-extrabold text-white">Publish a Group Ride / Run</h1>
        </div>

        {/* Preset Chips */}
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-xs text-zinc-500 font-semibold mr-1">Templates:</span>
          <button
            type="button"
            onClick={() => applyPreset('saturday')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
          >
            Saturday Paceline
          </button>
          <button
            type="button"
            onClick={() => applyPreset('gravel')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
          >
            Social Gravel
          </button>
          <button
            type="button"
            onClick={() => applyPreset('run')}
            className="px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-xs font-semibold"
          >
            Run Club
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sport Type Selector */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-2">Sport Type</label>
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setSport('cycling')}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border font-bold text-sm transition ${
                sport === 'cycling'
                  ? 'bg-blue-600 text-white border-blue-400 shadow-lg shadow-blue-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-zinc-700'
              }`}
            >
              <Bike className="w-5 h-5" />
              <span>Group Cycling (Blue Pin)</span>
            </button>

            <button
              type="button"
              onClick={() => setSport('running')}
              className={`flex items-center justify-center gap-2 p-3.5 rounded-2xl border font-bold text-sm transition ${
                sport === 'running'
                  ? 'bg-orange-500 text-zinc-950 border-orange-400 shadow-lg shadow-orange-500/20'
                  : 'bg-zinc-800 text-zinc-400 border-zinc-700/60 hover:bg-zinc-700'
              }`}
            >
              <Footprints className="w-5 h-5" />
              <span>Group Run (Orange Pin)</span>
            </button>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">Ride Title *</label>
          <input
            type="text"
            required
            placeholder="e.g. Saturday Morning Chevreuse Paceline"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white text-sm border border-zinc-700/80 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Date, Time, Level */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Start Time</label>
            <input
              type="text"
              placeholder="08:00 AM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as Level)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            >
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
              <option value="Expert">Expert</option>
            </select>
          </div>
        </div>

        {/* Distance, Elevation, Max Spots */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Distance (km)</label>
            <input
              type="number"
              value={distanceKm}
              onChange={(e) => setDistanceKm(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Elevation Gain (m)</label>
            <input
              type="number"
              value={elevationGain}
              onChange={(e) => setElevationGain(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Max Participants</label>
            <input
              type="number"
              value={maxSpots}
              onChange={(e) => setMaxSpots(Number(e.target.value))}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>
        </div>

        {/* Pace & Meeting point */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Target Pace</label>
            <input
              type="text"
              placeholder="e.g. 28-30 km/h avg"
              value={pace}
              onChange={(e) => setPace(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-300 mb-1.5">Meeting Point Address</label>
            <input
              type="text"
              placeholder="Café address or landmark"
              value={meetingPoint}
              onChange={(e) => setMeetingPoint(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80"
            />
          </div>
        </div>

        {/* Interactive Pin Drop Map Picker */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">
            Meeting Point Map Location (Click map to drop pin)
          </label>
          <div className="h-64 rounded-2xl overflow-hidden border border-zinc-700/80">
            <MapComponent
              rides={[]}
              interactivePinPlacement={true}
              pinLocation={pinLocation}
              onPinPlaced={(lat, lng) => setPinLocation([lat, lng])}
              center={pinLocation}
              zoom={13}
              onSelectRide={() => {}}
            />
          </div>
          <span className="text-[11px] text-zinc-400 mt-1 block">
            Selected Coords: {pinLocation[0].toFixed(4)}, {pinLocation[1].toFixed(4)}
          </span>
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-zinc-300 mb-1.5">Ride Description</label>
          <textarea
            rows={3}
            placeholder="Describe route highlights, coffee stops, gear recommendations..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-4 py-3 rounded-xl bg-zinc-800 text-white text-xs border border-zinc-700/80 focus:outline-none focus:border-orange-500 transition"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
          <button
            type="button"
            onClick={onCancel}
            className="px-5 py-2.5 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-zinc-950 font-extrabold text-xs tracking-wider uppercase transition shadow-lg shadow-orange-500/20"
          >
            Publish Ride to Map
          </button>
        </div>
      </form>
    </div>
  );
};
