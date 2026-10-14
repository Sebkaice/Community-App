import React from 'react';
import { Ride, Shop } from '../types';
import { useI18n } from '../utils/i18n';
import { formatSessionDate, formatDistance } from '../utils/helpers';
import { ActivityChip } from './design-system/ActivityChip';
import { Button } from './design-system/Button';
import { ArrowLeft, MapPin, Navigation, Clock, Users, ShieldCheck, Share2 } from 'lucide-react';

interface RideDetailProps {
  ride: Ride;
  shop?: Shop;
  isAlreadyRegistered: boolean;
  onBack: () => void;
  onOpenRegisterModal: () => void;
  onViewTicket: () => void;
}

export const RideDetail: React.FC<RideDetailProps> = ({
  ride,
  shop,
  isAlreadyRegistered,
  onBack,
  onOpenRegisterModal,
  onViewTicket,
}) => {
  const { lang, t } = useI18n();
  const title = lang === 'fr' && ride.titleFr ? ride.titleFr : ride.title;
  const description = lang === 'fr' && ride.descriptionFr ? ride.descriptionFr : ride.description;

  const spotsRemaining = Math.max(0, ride.maxSpots - ride.currentSpots);
  const isFull = spotsRemaining === 0;
  const formattedDate = formatSessionDate(ride.date, ride.time);

  const actionButtonText = isAlreadyRegistered
    ? lang === 'en'
      ? 'View your check-in pass'
      : 'Voir votre pass d’arrivée'
    : isFull
    ? lang === 'en'
      ? 'Roster full'
      : 'Complet'
    : ride.activity === 'run'
    ? lang === 'en'
      ? 'Join run'
      : 'Rejoindre la course'
    : ride.activity === 'ride'
    ? lang === 'en'
      ? 'Join ride'
      : 'Rejoindre la sortie'
    : lang === 'en'
    ? 'Join session'
    : 'Rejoindre la session';

  return (
    <div className="min-h-[calc(100vh-65px)] bg-white pb-20">
      {/* Top Navigation Bar */}
      <div className="border-b border-zinc-200 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-700 hover:text-zinc-900 transition"
          >
            <ArrowLeft className="w-4 h-4" strokeWidth={2} />
            <span>{t.backToSessions}</span>
          </button>

          <ActivityChip activity={ride.activity} />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-6 space-y-6">
        {/* Hero Photo (candid outdoor daylight) */}
        {ride.heroImage && (
          <div className="w-full h-64 sm:h-80 rounded-2xl overflow-hidden border border-zinc-200">
            <img
              src={ride.heroImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Venue metadata */}
        <div className="flex items-center justify-between gap-4 pt-1">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#f4f4f5] border border-zinc-200 flex items-center justify-center font-bold text-zinc-900 text-sm">
              {ride.shopName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-sm text-zinc-900">{ride.shopName}</span>
                <span className="text-[11px] text-zinc-500">· {ride.shopCategory}</span>
              </div>
              <p className="text-xs text-zinc-500">{ride.shopLocation}</p>
            </div>
          </div>

          <span className="ca-caption text-zinc-600 font-medium">
            {spotsRemaining > 0 ? t.spotsLeft(spotsRemaining) : lang === 'en' ? 'Full' : 'Complet'}
          </span>
        </div>

        {/* Title */}
        <h1 className="ca-display-lg text-zinc-900 leading-tight">
          {title}
        </h1>

        {/* Metrics Row: flat border-subtle cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <span className="ca-caption text-zinc-500 block">{t.dateAndTime}</span>
            <span className="text-sm font-semibold text-zinc-900 block mt-1">{formattedDate}</span>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <span className="ca-caption text-zinc-500 block">{t.distance}</span>
            <span className="text-sm font-semibold text-zinc-900 block mt-1">
              {ride.distanceKm > 0 ? formatDistance(ride.distanceKm) : '—'}
            </span>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <span className="ca-caption text-zinc-500 block">{t.paceLabel}</span>
            <span className="text-sm font-semibold text-zinc-900 block mt-1">{ride.pace}</span>
          </div>

          <div className="p-4 rounded-xl border border-zinc-200 bg-white">
            <span className="ca-caption text-zinc-500 block">{lang === 'en' ? 'Level' : 'Niveau'}</span>
            <span className="text-sm font-semibold text-zinc-900 block mt-1">{ride.level}</span>
          </div>
        </div>

        {/* Action Button: One full-width Button */}
        <div className="pt-2">
          <Button
            variant={isAlreadyRegistered ? 'quiet' : isFull ? 'outline' : 'cobalt'}
            fullWidth
            disabled={isFull && !isAlreadyRegistered}
            onClick={isAlreadyRegistered ? onViewTicket : onOpenRegisterModal}
            className="text-base py-3"
          >
            {actionButtonText}
          </Button>
        </div>

        {/* Meeting Point & Brief */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-zinc-200">
          <div className="md:col-span-2 space-y-4">
            <h2 className="ca-display-sm text-zinc-900">{lang === 'en' ? 'Briefing' : 'Détails'}</h2>
            <p className="ca-body text-zinc-700 whitespace-pre-line leading-relaxed">
              {description}
            </p>

            {/* Meeting location card */}
            <div className="p-4 rounded-xl bg-[#f4f4f5] border border-zinc-200 space-y-1">
              <span className="ca-label text-zinc-500 text-[11px] block">{t.meetingLocation}</span>
              <p className="ca-body font-semibold text-zinc-900">{ride.meetingPoint}</p>
              <p className="ca-caption text-zinc-500">
                {lang === 'en'
                  ? 'Arrive 10 minutes before rollout. Coffee service open at counter.'
                  : 'Rendez-vous 10 minutes avant le départ. Service café ouvert au comptoir.'}
              </p>
            </div>
          </div>

          {/* Confirmed Roster List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="ca-display-sm text-zinc-900">{t.confirmedRoster}</h2>
              <span className="ca-caption text-zinc-500">
                {ride.registeredRiders.length} / {ride.maxSpots}
              </span>
            </div>

            <div className="border border-zinc-200 rounded-xl divide-y divide-zinc-100 bg-white overflow-hidden">
              {ride.registeredRiders.map((rider) => (
                <div key={rider.id} className="p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-semibold text-zinc-900 block">{rider.name}</span>
                    <span className="text-zinc-500 text-[11px]">{rider.level}</span>
                  </div>
                  {rider.checkedIn && (
                    <span className="ca-status-badge ca-status-success">✓ {t.checkedIn}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
