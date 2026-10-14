import React, { useState, useMemo } from 'react';
import { Ride, ActivityType, Level, Shop, StravaProfile } from '../types';
import { useI18n } from '../utils/i18n';
import { EventCard } from './design-system/EventCard';
import { MapComponent } from './MapComponent';
import { AthleteWeeklyCalendar } from './AthleteWeeklyCalendar';
import {
  Search,
  MapPin,
  List,
  Gift,
  Activity,
  CalendarCheck,
  Flame,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  Coffee,
  Bike
} from 'lucide-react';
import { ACTIVITY_META, formatDistance, formatSessionDate } from '../utils/helpers';

interface RiderDiscoverProps {
  rides: Ride[];
  onSelectRide: (ride: Ride) => void;
  onRegisterQuick: (ride: Ride) => void;
  registeredRideIds?: string[];
  shops?: Shop[];
  stravaProfile?: StravaProfile;
  userName?: string;
  userLevel?: Level;
  onNavigateToTab?: (tab: 'home' | 'map' | 'loyalty' | 'profile' | 'my-rides') => void;
  initialViewMode?: 'list' | 'map';
}

export const RiderDiscover: React.FC<RiderDiscoverProps> = ({
  rides,
  onSelectRide,
  onRegisterQuick,
  registeredRideIds = [],
  shops = [],
  stravaProfile,
  userName = 'Antoine Moreau',
  userLevel = 'Advanced',
  onNavigateToTab,
  initialViewMode = 'list',
}) => {
  const { lang, t } = useI18n();

  // Active filters & views
  const [selectedActivity, setSelectedActivity] = useState<'all' | ActivityType>('all');
  const [selectedLevel, setSelectedLevel] = useState<'all' | Level>('all');
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'map'>(initialViewMode);

  // Compute next rollout for the cobalt card
  const nextRegisteredRide = useMemo(() => {
    const reg = rides.find((r) => registeredRideIds.includes(r.id));
    return reg || rides[0];
  }, [rides, registeredRideIds]);

  const isUserRegisteredForNext = registeredRideIds.includes(nextRegisteredRide?.id || '');

  // Filter rides based on activity, level, search query, and calendar date
  const filteredRides = useMemo(() => {
    return rides.filter((ride) => {
      if (selectedActivity !== 'all' && ride.activity !== selectedActivity) return false;
      if (selectedLevel !== 'all' && ride.level !== selectedLevel) return false;
      if (selectedDate !== null && ride.date !== selectedDate) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchTitle = (ride.title + ' ' + (ride.titleFr || '')).toLowerCase().includes(q);
        const matchShop = ride.shopName.toLowerCase().includes(q);
        const matchLocation = ride.shopLocation.toLowerCase().includes(q);
        const matchMeeting = ride.meetingPoint.toLowerCase().includes(q);
        if (!matchTitle && !matchShop && !matchLocation && !matchMeeting) return false;
      }
      return true;
    });
  }, [rides, selectedActivity, selectedLevel, selectedDate, searchQuery]);

  return (
    <div className="w-full bg-white min-h-[calc(100vh-65px)]">
      {/* Athlete Header & Welcome Banner */}
      <div className="border-b border-zinc-200 bg-[#fafafa]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-7 pb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[#16a34a] animate-pulse"></span>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  {lang === 'en' ? 'Paris Athlete Community' : 'Communauté Athlète Paris'}
                </span>
                <span className="text-zinc-300">·</span>
                <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563eb]" />
                  {userLevel}
                </span>
              </div>
              <h1 className="ca-display-lg text-zinc-900 leading-tight">
                {lang === 'en' ? `Bonjour, ${userName}` : `Bonjour, ${userName}`}
              </h1>
              <p className="ca-body text-zinc-600 mt-1 max-w-xl">
                {lang === 'en'
                  ? 'Your weekly club hub for rides, quayside runs, bakery meets and boutique perks.'
                  : 'Votre carnet de bord pour les sorties en peloton, courses sur les quais et viennoiseries du club.'}
              </p>
            </div>

            {/* View Mode Toggle: List vs Map (renamed from Paris map to Map / Carte) */}
            <div className="flex items-center gap-1 bg-white p-1 rounded-full border border-zinc-300 shadow-xs self-start md:self-center">
              <button
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  viewMode === 'list'
                    ? 'bg-zinc-900 text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <List className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{lang === 'en' ? 'Feed' : 'Flux'}</span>
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                  viewMode === 'map'
                    ? 'bg-[#2563eb] text-white shadow-xs'
                    : 'text-zinc-600 hover:text-zinc-900'
                }`}
              >
                <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
                <span>{t.map}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        {/* ============================================================ */}
        {/* 4 COLORED INFORMATION BLOCKS (Cobalt, Sun, Sky, Blush)       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* 1. COBALT BLOCK: Next Upcoming Rollout */}
          <div className="bg-[#2563eb] text-white rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white px-2 py-0.5 rounded-full">
                  {t.nextRollout}
                </span>
                <Bike className="w-4 h-4 text-white/80" strokeWidth={2.2} />
              </div>
              <h4 className="font-bold text-base sm:text-lg leading-snug text-white line-clamp-2">
                {lang === 'fr' && nextRegisteredRide?.titleFr ? nextRegisteredRide.titleFr : nextRegisteredRide?.title}
              </h4>
              <p className="text-xs text-white/85 mt-1.5 flex items-center gap-1.5">
                <CalendarCheck className="w-3.5 h-3.5 shrink-0" />
                <span>
                  {nextRegisteredRide ? formatSessionDate(nextRegisteredRide.date, nextRegisteredRide.time) : 'Saturday 9:00'}
                </span>
              </p>
              <p className="text-xs text-white/80 mt-1 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span className="truncate">{nextRegisteredRide?.shopName || 'Café du Cycliste'} · {nextRegisteredRide?.distanceKm} km</span>
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-white/20 flex items-center justify-between">
              {isUserRegisteredForNext ? (
                <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Spot confirmed' : 'Place confirmée'}
                </span>
              ) : (
                <span className="text-xs text-white/80 font-medium">
                  {nextRegisteredRide ? t.spotsLeft(nextRegisteredRide.maxSpots - nextRegisteredRide.currentSpots) : ''}
                </span>
              )}
              <button
                onClick={() => {
                  if (nextRegisteredRide) {
                    onSelectRide(nextRegisteredRide);
                  }
                }}
                className="bg-white text-[#2563eb] hover:bg-zinc-100 text-xs font-bold py-1 px-3 rounded-full transition shadow-xs flex items-center gap-1"
              >
                <span>{isUserRegisteredForNext ? (lang === 'en' ? 'Pass' : 'Voir pass') : (lang === 'en' ? 'RSVP' : 'Rejoindre')}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 2. SUN BLOCK: Community Loyalty & Perks */}
          <div className="bg-[#f59e0b] text-zinc-950 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/20 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase bg-zinc-950/15 text-zinc-950 px-2 py-0.5 rounded-full">
                  {t.loyaltyBalance}
                </span>
                <Gift className="w-4 h-4 text-zinc-950" strokeWidth={2.2} />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="ca-stat text-3xl font-extrabold text-zinc-950">180</span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'en' ? 'Points total' : 'Points cumulés'}
                </span>
              </div>
              <div className="mt-2 text-xs font-medium text-zinc-900 bg-white/50 p-2 rounded-xl backdrop-blur-xs">
                <p className="font-semibold text-zinc-950 flex items-center gap-1">
                  <Coffee className="w-3.5 h-3.5 text-zinc-900" />
                  {lang === 'en' ? 'Double espresso & Cap unlocked' : 'Expresso & casquette débloqués'}
                </p>
                <p className="text-[11px] text-zinc-700 mt-0.5">
                  {lang === 'en' ? 'Valid at Café du Cycliste & Ten Belles' : 'Au Café du Cycliste & Ten Belles'}
                </p>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-950/15 flex items-center justify-between">
              <span className="text-[11px] font-semibold text-zinc-900">
                {lang === 'en' ? '+15 pts / ride' : '+15 pts / sortie'}
              </span>
              <button
                onClick={() => onNavigateToTab && onNavigateToTab('loyalty')}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold py-1 px-3 rounded-full transition shadow-xs flex items-center gap-1"
              >
                <span>{lang === 'en' ? 'Open Pass' : 'Voir pass'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 3. SKY BLOCK: Strava Activity & Verified Level */}
          <div className="bg-[#0284c7] text-white rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/10 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase bg-white/20 text-white px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Activity className="w-3 h-3" />
                  {t.stravaSync}
                </span>
                <span className="text-[10px] font-bold bg-[#fc4c02] text-white px-1.5 py-0.5 rounded-sm">
                  STRAVA
                </span>
              </div>
              <div className="flex items-baseline gap-2">
                <span className="ca-stat text-2xl font-extrabold text-white">
                  {stravaProfile?.verifiedLevel || userLevel}
                </span>
              </div>
              <p className="text-xs text-white/90 mt-1 font-semibold">
                {stravaProfile?.totalDistanceKm ? `${stravaProfile.totalDistanceKm} km` : '4,280 km'} {lang === 'en' ? 'synced' : 'synchronisés'}
              </p>
              <p className="text-[11px] text-white/80 mt-1.5 line-clamp-2">
                {lang === 'fr'
                  ? stravaProfile?.calculatedRuleFr || 'Moyenne de 29,4 km/h vérifiée en peloton.'
                  : stravaProfile?.calculatedRule || 'Verified 29.4 km/h average paceline over 75 km.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-white/20 flex items-center justify-between">
              <span className="text-[11px] text-white/80 font-medium">
                {stravaProfile?.connected ? (lang === 'en' ? 'Auto-synced' : 'Synchronisé') : (lang === 'en' ? 'Connect' : 'Connecter')}
              </span>
              <button
                onClick={() => onNavigateToTab && onNavigateToTab('profile')}
                className="bg-white text-[#0284c7] hover:bg-zinc-100 text-xs font-bold py-1 px-3 rounded-full transition shadow-xs flex items-center gap-1"
              >
                <span>{lang === 'en' ? 'Details' : 'Détails'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>

          {/* 4. BLUSH BLOCK: Paris Community Pulse & Boutique Meets */}
          <div className="bg-[#fda4af] text-zinc-950 rounded-2xl p-5 flex flex-col justify-between shadow-sm relative overflow-hidden group hover:shadow-md transition">
            <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-white/30 rounded-full blur-xl pointer-events-none"></div>
            <div>
              <div className="flex items-center justify-between gap-2 mb-3">
                <span className="text-[11px] font-bold tracking-wider uppercase bg-zinc-950/15 text-zinc-950 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <Flame className="w-3 h-3 text-[#e11d48]" />
                  {t.boutiquePulse}
                </span>
                <Sparkles className="w-4 h-4 text-zinc-900" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="ca-stat text-3xl font-extrabold text-zinc-950">{rides.length}</span>
                <span className="text-xs font-bold uppercase tracking-wider text-zinc-800">
                  {lang === 'en' ? 'Sessions this week' : 'Sorties cette semaine'}
                </span>
              </div>
              <p className="text-xs font-medium text-zinc-900 mt-2 bg-white/50 p-2 rounded-xl backdrop-blur-xs">
                {lang === 'en'
                  ? 'Chevreuse, Canal St-Martin, Longchamp & Vincennes hosted by 4 boutiques.'
                  : 'Chevreuse, Canal St-Martin, Longchamp & Vincennes par 4 boutiques partenaires.'}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-zinc-950/15 flex items-center justify-between">
              <span className="text-[11px] text-zinc-800 font-semibold">
                {lang === 'en' ? '4 Boutique hubs' : '4 Boutiques hôtes'}
              </span>
              <button
                onClick={() => setViewMode(viewMode === 'map' ? 'list' : 'map')}
                className="bg-zinc-950 text-white hover:bg-zinc-800 text-xs font-bold py-1 px-3 rounded-full transition shadow-xs flex items-center gap-1"
              >
                <span>{viewMode === 'map' ? (lang === 'en' ? 'Feed' : 'Flux') : t.map}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* ============================================================ */}
        {/* INTERACTIVE WEEKLY CALENDAR                                   */}
        {/* ============================================================ */}
        <AthleteWeeklyCalendar
          rides={rides}
          selectedDate={selectedDate}
          onSelectDate={setSelectedDate}
        />

        {/* ============================================================ */}
        {/* MAP VIEW OR SESSIONS SECTION                                 */}
        {/* ============================================================ */}
        {viewMode === 'map' && (
          <div className="mb-10 rounded-2xl overflow-hidden border border-zinc-200 shadow-md">
            <div className="p-4 bg-zinc-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="ca-display-sm text-white flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#2563eb]" />
                  <span>{lang === 'en' ? 'Paris Interactive Map' : 'Carte interactive de Paris'}</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  {lang === 'en'
                    ? 'Explore rollouts, quayside runs and boutique partner locations with street details and popovers.'
                    : 'Explorez les départs, courses sur les quais et boutiques partenaires avec repères détaillés.'}
                </p>
              </div>
              <button
                onClick={() => setViewMode('list')}
                className="px-3.5 py-1.5 rounded-full bg-white text-zinc-900 hover:bg-zinc-100 text-xs font-semibold self-start sm:self-center transition"
              >
                {lang === 'en' ? 'Close map view' : 'Fermer la carte'}
              </button>
            </div>
            <div className="h-[460px] sm:h-[520px] w-full">
              <MapComponent
                rides={filteredRides}
                selectedRideId={null}
                onSelectRide={onSelectRide}
              />
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* THIS WEEK SESSIONS SECTION                                   */}
        {/* ============================================================ */}
        <div className="mt-4">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 border-b border-zinc-200">
            <div>
              <span className="ca-caption text-zinc-500 uppercase tracking-widest block mb-1">
                {lang === 'en' ? 'Curated schedule' : 'Planning sélectionné'}
              </span>
              <h2 className="ca-display-lg text-zinc-900 leading-tight">
                {t.thisWeekSessionsTitle}
              </h2>
              <p className="ca-body text-zinc-600 mt-1">
                {lang === 'en'
                  ? `Showing ${filteredRides.length} sessions available for RSVP.`
                  : `${filteredRides.length} sessions disponibles à la réservation.`}
                {selectedDate && (
                  <span className="ml-2 font-semibold text-[#2563eb]">
                    ({lang === 'en' ? `Filtered for ${selectedDate}` : `Filtré au ${selectedDate}`})
                  </span>
                )}
              </p>
            </div>

            {/* Inline Map Button */}
            {viewMode !== 'map' && (
              <button
                onClick={() => setViewMode('map')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#f4f4f5] hover:bg-zinc-200 text-zinc-900 border border-zinc-200 transition self-start md:self-end"
              >
                <MapPin className="w-4 h-4 text-[#2563eb]" />
                <span>{lang === 'en' ? 'Open Map' : 'Ouvrir la Carte'}</span>
              </button>
            )}
          </div>

          {/* Activity Filters with shapes & colors */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <button
              onClick={() => setSelectedActivity('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition ${
                selectedActivity === 'all'
                  ? 'bg-zinc-900 text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {t.allActivities} ({rides.length})
            </button>

            {/* Ride (tomato ▲) */}
            <button
              onClick={() => setSelectedActivity('ride')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                selectedActivity === 'ride'
                  ? 'bg-[#e11d48] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span>▲</span>
              <span>{lang === 'en' ? 'Rides' : 'Sorties vélo'}</span>
            </button>

            {/* Run (cobalt ●) */}
            <button
              onClick={() => setSelectedActivity('run')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                selectedActivity === 'run'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span>●</span>
              <span>{lang === 'en' ? 'Runs' : 'Courses'}</span>
            </button>

            {/* Social (sun ◆) */}
            <button
              onClick={() => setSelectedActivity('social')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                selectedActivity === 'social'
                  ? 'bg-[#f59e0b] text-zinc-950 shadow-xs'
                  : 'bg-[#f4f4f5] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span>◆</span>
              <span>{lang === 'en' ? 'Bakery & coffee' : 'Boulangerie & café'}</span>
            </button>

            {/* Wellness (sky ■) */}
            <button
              onClick={() => setSelectedActivity('wellness')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                selectedActivity === 'wellness'
                  ? 'bg-[#0284c7] text-white shadow-xs'
                  : 'bg-[#f4f4f5] text-zinc-700 hover:bg-zinc-200'
              }`}
            >
              <span>■</span>
              <span>{lang === 'en' ? 'Recovery' : 'Récupération'}</span>
            </button>
          </div>

          {/* Search bar & Level selector */}
          <div className="mb-6 flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input
                type="text"
                placeholder={t.searchPlaceholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="ca-input pl-10 text-xs w-full"
              />
            </div>

            <select
              value={selectedLevel}
              onChange={(e) => setSelectedLevel(e.target.value as any)}
              className="ca-input text-xs w-full sm:w-auto"
            >
              <option value="all">{t.allLevels}</option>
              <option value="Beginner">{t.beginner}</option>
              <option value="Intermediate">{t.intermediate}</option>
              <option value="Advanced">{t.advanced}</option>
              <option value="Expert">{t.expert}</option>
            </select>
          </div>

          {/* Session Cards Grid or Empty State */}
          {filteredRides.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#f4f4f5] border border-zinc-200 text-center flex flex-col items-center">
              <svg
                className="w-20 h-20 text-zinc-400 mb-3"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="m4.93 4.93 4.24 4.24" />
                <path d="m14.83 9.17 4.24-4.24" />
                <path d="m14.83 14.83 4.24 4.24" />
                <path d="m9.17 14.83-4.24 4.24" />
                <circle cx="12" cy="12" r="4" />
              </svg>
              <h3 className="ca-display-sm text-zinc-900">
                {lang === 'en' ? 'No sessions found' : 'Aucune session trouvée'}
              </h3>
              <p className="ca-body-sm text-zinc-500 max-w-sm mt-1">
                {lang === 'en'
                  ? 'Try selecting another day in the calendar or clearing your search filters.'
                  : 'Essayez de sélectionner un autre jour dans le calendrier ou réinitialisez vos filtres.'}
              </p>
              {selectedDate && (
                <button
                  onClick={() => setSelectedDate(null)}
                  className="mt-4 px-4 py-2 rounded-full bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition"
                >
                  {lang === 'en' ? 'Show all week sessions' : 'Voir toute la semaine'}
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredRides.map((ride) => (
                <EventCard
                  key={ride.id}
                  ride={ride}
                  isRegistered={registeredRideIds.includes(ride.id)}
                  onSelect={onSelectRide}
                  onActionClick={onRegisterQuick}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
