import React from 'react';
import { Ride } from '../../types';
import { ActivityChip } from './ActivityChip';
import { Button } from './Button';
import { formatSessionDate, formatDistance } from '../../utils/helpers';
import { useI18n } from '../../utils/i18n';
import { MapPin, Navigation, Clock } from 'lucide-react';

export interface EventCardProps {
  ride: Ride;
  isRegistered?: boolean;
  onSelect: (ride: Ride) => void;
  onActionClick: (ride: Ride) => void;
  variant?: 'standard' | 'featured';
}

export const EventCard: React.FC<EventCardProps> = ({
  ride,
  isRegistered = false,
  onSelect,
  onActionClick,
  variant = 'standard',
}) => {
  const { lang, t } = useI18n();
  const title = lang === 'fr' && ride.titleFr ? ride.titleFr : ride.title;
  const description = lang === 'fr' && ride.descriptionFr ? ride.descriptionFr : ride.description;

  const spotsRemaining = Math.max(0, ride.maxSpots - ride.currentSpots);
  const formattedDate = formatSessionDate(ride.date, ride.time);
  const formattedDist = ride.distanceKm > 0 ? formatDistance(ride.distanceKm) : null;

  const actionLabel = isRegistered
    ? lang === 'en'
      ? 'View your pass'
      : 'Voir votre pass'
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
    <article
      onClick={() => onSelect(ride)}
      className={`ca-event-card group cursor-pointer transition hover:border-zinc-400 ${
        variant === 'featured' ? 'border-[#2563eb]' : ''
      }`}
    >
      {/* Photography: candid outdoor in daylight */}
      {ride.heroImage && (
        <div className="relative w-full h-48 sm:h-56 bg-zinc-100 overflow-hidden">
          <img
            src={ride.heroImage}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-3 left-3 flex items-center gap-2">
            <ActivityChip activity={ride.activity} />
            <span className="ca-caption bg-white/95 px-2 py-0.5 rounded-full text-zinc-900 font-medium">
              {ride.shopName}
            </span>
          </div>

          <div className="absolute bottom-3 right-3">
            <span className="ca-caption bg-[#09090b]/80 text-white px-2 py-1 rounded-md font-medium">
              {spotsRemaining > 0 ? t.spotsLeft(spotsRemaining) : lang === 'en' ? 'Full' : 'Complet'}
            </span>
          </div>
        </div>
      )}

      {/* Card Content */}
      <div className="p-4 sm:p-5 flex flex-col gap-3 flex-1 bg-white">
        {!ride.heroImage && (
          <div className="flex items-center justify-between gap-2">
            <ActivityChip activity={ride.activity} />
            <span className="ca-caption text-zinc-500">{t.spotsLeft(spotsRemaining)}</span>
          </div>
        )}

        {/* Date and distance metadata */}
        <div className="flex items-center gap-3 text-xs text-zinc-600">
          <span className="font-semibold text-zinc-900">{formattedDate}</span>
          {formattedDist && (
            <>
              <span>·</span>
              <span className="font-medium">{formattedDist}</span>
            </>
          )}
          {ride.level && (
            <>
              <span>·</span>
              <span className="text-zinc-500">{ride.level}</span>
            </>
          )}
        </div>

        {/* Title in Fugaz One (sentence case) */}
        <h3 className="ca-display-sm text-zinc-900 group-hover:text-[#2563eb] transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Location & Brief */}
        <div className="flex items-center gap-1.5 text-xs text-zinc-600">
          <MapPin className="w-3.5 h-3.5 text-zinc-500 shrink-0" strokeWidth={2} />
          <span className="truncate">{ride.meetingPoint}</span>
        </div>

        <p className="ca-body-sm text-zinc-600 line-clamp-2 mt-0.5">{description}</p>

        {/* Full-width button */}
        <div className="mt-2 pt-2 border-t border-zinc-100" onClick={(e) => e.stopPropagation()}>
          <Button
            variant={isRegistered ? 'quiet' : 'cobalt'}
            fullWidth
            onClick={() => onActionClick(ride)}
          >
            {actionLabel}
          </Button>
        </div>
      </div>
    </article>
  );
};
