import React, { useState } from 'react';
import { Ride, Level, StravaProfile } from '../types';
import { useI18n } from '../utils/i18n';
import { formatSessionDate, formatDistance } from '../utils/helpers';
import { ActivityChip } from './design-system/ActivityChip';
import { Button } from './design-system/Button';
import { QRCodeDisplay } from './QRCodeDisplay';
import { StravaConnect } from './StravaConnect';
import { MapPin, Calendar, Check, ExternalLink, ShieldCheck, Zap } from 'lucide-react';

interface RiderProfileProps {
  myRegisteredRides: Ride[];
  userEmail: string;
  userName: string;
  userLevel: Level;
  stravaProfile: StravaProfile;
  onUpdateStrava: (updated: StravaProfile) => void;
  onVerifiedLevelChange: (level: Level) => void;
  onSelectRide: (ride: Ride) => void;
  onCancelRegistration: (rideId: string) => void;
}

export const RiderProfile: React.FC<RiderProfileProps> = ({
  myRegisteredRides,
  userEmail,
  userName,
  userLevel,
  stravaProfile,
  onUpdateStrava,
  onVerifiedLevelChange,
  onSelectRide,
  onCancelRegistration,
}) => {
  const { lang, t } = useI18n();
  const [activePassCode, setActivePassCode] = useState<string | null>(null);

  const totalKm = myRegisteredRides.reduce((acc, ride) => acc + ride.distanceKm, 0);

  return (
    <div className="min-h-[calc(100vh-65px)] bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Card Header */}
        <div className="border border-zinc-200 rounded-2xl p-6 bg-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#f4f4f5] border border-zinc-200 flex items-center justify-center font-bold text-zinc-900 text-xl">
              {userName ? userName.charAt(0) : 'A'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="ca-display-md text-zinc-900 leading-tight">
                  {userName || (lang === 'en' ? 'Antoine Moreau' : 'Antoine Moreau')}
                </h1>
                <span className="ca-caption bg-[#f4f4f5] px-2 py-0.5 rounded-md text-zinc-800 font-semibold">
                  {userLevel}
                </span>
                {stravaProfile.connected && (
                  <span className="ca-status-badge ca-status-success text-[10px]">
                    ✓ STRAVA VERIFIED
                  </span>
                )}
              </div>
              <p className="ca-caption text-zinc-500 mt-0.5">{userEmail}</p>
            </div>
          </div>

          {/* Quick Athlete Stats & Loyalty summary */}
          <div className="flex items-center gap-6 border-t sm:border-t-0 sm:border-l border-zinc-200 pt-4 sm:pt-0 sm:pl-6 w-full sm:w-auto">
            <div>
              <span className="ca-caption text-zinc-500 block">
                {lang === 'en' ? 'Booked sessions' : 'Sessions réservées'}
              </span>
              <span className="ca-stat text-2xl text-zinc-900 block mt-0.5">
                {myRegisteredRides.length}
              </span>
            </div>
            <div>
              <span className="ca-caption text-zinc-500 block">
                {lang === 'en' ? 'Distance planned' : 'Distance prévue'}
              </span>
              <span className="ca-stat text-2xl text-zinc-900 block mt-0.5">
                {formatDistance(totalKm)}
              </span>
            </div>
            <div>
              <span className="ca-caption text-zinc-500 block">
                {lang === 'en' ? 'Café du Cycliste' : 'Café du Cycliste'}
              </span>
              <span className="ca-stat text-2xl text-[#2563eb] block mt-0.5">
                85 <span className="text-xs text-zinc-500 font-normal">pts</span>
              </span>
            </div>
          </div>
        </div>

        {/* STRAVA ACTIVITY TRACKING & LEVEL VERIFICATION COMPONENT */}
        <StravaConnect
          stravaProfile={stravaProfile}
          onUpdateStrava={onUpdateStrava}
          onVerifiedLevelChange={onVerifiedLevelChange}
        />

        {/* My Sessions List: Single column, EventCard / Pass main unit */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="ca-display-md text-zinc-900">{t.mySessions}</h2>
            <span className="ca-caption text-zinc-500">
              {myRegisteredRides.length} {lang === 'en' ? 'active passes' : 'pass actifs'}
            </span>
          </div>

          {myRegisteredRides.length === 0 ? (
            <div className="p-12 rounded-2xl bg-[#f4f4f5] border border-zinc-200 text-center space-y-2">
              <h3 className="ca-display-sm text-zinc-900">
                {lang === 'en' ? 'No active sessions yet' : 'Aucune session active'}
              </h3>
              <p className="ca-body-sm text-zinc-500 max-w-sm mx-auto">
                {lang === 'en'
                  ? 'Explore the week’s rides, runs and sessions in Paris to secure your spot.'
                  : 'Découvrez les sorties, courses et sessions à Paris pour réserver votre place.'}
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {myRegisteredRides.map((ride) => {
                const title = lang === 'fr' && ride.titleFr ? ride.titleFr : ride.title;
                const formattedDate = formatSessionDate(ride.date, ride.time);
                const passCode = `PARIS-${ride.id.toUpperCase()}-7492`;
                const isPassExpanded = activePassCode === ride.id;

                return (
                  <article
                    key={ride.id}
                    className="ca-event-card border border-zinc-200 rounded-2xl p-5 sm:p-6 bg-white space-y-4"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-100 pb-3">
                      <div className="flex items-center gap-2">
                        <ActivityChip activity={ride.activity} />
                        <span className="ca-caption font-semibold text-zinc-900">{ride.shopName}</span>
                        <span className="ca-caption text-zinc-500">· {ride.shopLocation}</span>
                      </div>
                      <span className="ca-caption text-zinc-600 font-semibold">{formattedDate}</span>
                    </div>

                    <div>
                      <h3
                        onClick={() => onSelectRide(ride)}
                        className="ca-display-sm text-zinc-900 hover:text-[#2563eb] cursor-pointer transition-colors"
                      >
                        {title}
                      </h3>
                      <p className="ca-caption text-zinc-500 mt-1 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{ride.meetingPoint}</span>
                        {ride.distanceKm > 0 && <span>· {formatDistance(ride.distanceKm)}</span>}
                      </p>
                    </div>

                    {/* Digital Pass accordion */}
                    {isPassExpanded && (
                      <div className="p-4 rounded-xl bg-[#f4f4f5] border border-zinc-200 flex flex-col items-center text-center space-y-2">
                        <span className="ca-caption text-zinc-500 uppercase tracking-widest">
                          {t.walkInPass}
                        </span>
                        <span className="font-mono text-xs font-semibold text-zinc-800">{passCode}</span>
                        <div className="p-2 bg-white rounded-lg border border-zinc-200">
                          <QRCodeDisplay value={passCode} size={130} />
                        </div>
                        <p className="ca-caption text-zinc-500 max-w-xs">{t.passInfo}</p>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="pt-2 flex flex-col sm:flex-row gap-2">
                      <Button
                        variant={isPassExpanded ? 'quiet' : 'cobalt'}
                        fullWidth
                        onClick={() => setActivePassCode(isPassExpanded ? null : ride.id)}
                      >
                        {isPassExpanded
                          ? lang === 'en'
                            ? 'Hide check-in pass'
                            : 'Masquer le pass'
                          : lang === 'en'
                          ? 'Show check-in pass'
                          : 'Afficher le pass'}
                      </Button>

                      <Button
                        variant="outline"
                        onClick={() => onCancelRegistration(ride.id)}
                        className="sm:w-auto text-xs text-zinc-500 hover:text-[#dc2626]"
                      >
                        {t.leaveSession}
                      </Button>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
