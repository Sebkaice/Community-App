import React, { useState } from 'react';
import { StravaProfile, Level } from '../types';
import { useI18n } from '../utils/i18n';
import { Button } from './design-system/Button';
import { formatDistance } from '../utils/helpers';
import { INITIAL_STRAVA_PROFILE } from '../data/mockData';
import { CheckCircle2, RefreshCw, ExternalLink, Zap, ShieldCheck, Flame, Bike, Footprints } from 'lucide-react';

interface StravaConnectProps {
  stravaProfile: StravaProfile;
  onUpdateStrava: (updated: StravaProfile) => void;
  onVerifiedLevelChange?: (level: Level) => void;
}

export const StravaConnect: React.FC<StravaConnectProps> = ({
  stravaProfile,
  onUpdateStrava,
  onVerifiedLevelChange,
}) => {
  const { lang, t } = useI18n();
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncSuccessToast, setSyncSuccessToast] = useState(false);

  const handleConnect = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      const connectedProfile: StravaProfile = {
        ...INITIAL_STRAVA_PROFILE,
        connected: true,
        lastSyncDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      };
      onUpdateStrava(connectedProfile);
      if (onVerifiedLevelChange) {
        onVerifiedLevelChange(connectedProfile.verifiedLevel);
      }
      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 4000);
    }, 1200);
  };

  const handleDisconnect = () => {
    const disconnectedProfile: StravaProfile = {
      connected: false,
      verifiedLevel: 'Intermediate',
      calculatedRule: 'Default self-declared level',
      calculatedRuleFr: 'Niveau auto-déclaré par défaut',
      totalDistanceKm: 0,
      totalActivitiesCount: 0,
      recentActivities: [],
    };
    onUpdateStrava(disconnectedProfile);
  };

  const handleManualSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      onUpdateStrava({
        ...stravaProfile,
        lastSyncDate: new Date().toISOString().replace('T', ' ').substring(0, 16),
      });
      setSyncSuccessToast(true);
      setTimeout(() => setSyncSuccessToast(false), 4000);
    }, 1000);
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-5">
        <div className="flex items-center gap-3.5">
          {/* Strava Orange Icon */}
          <div className="w-12 h-12 rounded-xl bg-[#fc4c02] text-white flex items-center justify-center font-black text-xl shadow-md shadow-[#fc4c02]/20">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="ca-display-sm text-zinc-900">{t.stravaTitle}</h2>
              {stravaProfile.connected && (
                <span className="ca-status-badge ca-status-success">
                  ✓ {t.stravaConnected}
                </span>
              )}
            </div>
            <p className="ca-caption text-zinc-500 mt-0.5">{t.stravaSubtitle}</p>
          </div>
        </div>

        {/* Action button */}
        <div>
          {stravaProfile.connected ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                onClick={handleManualSync}
                disabled={isSyncing}
                className="text-xs py-1.5 px-3"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-[#fc4c02]' : ''}`} />
                <span>{isSyncing ? t.stravaSyncing : t.syncStravaNow}</span>
              </Button>
              <button
                onClick={handleDisconnect}
                className="text-xs text-zinc-400 hover:text-[#dc2626] font-medium p-1 transition"
                title="Disconnect account"
              >
                {t.disconnectStrava}
              </button>
            </div>
          ) : (
            <button
              onClick={handleConnect}
              disabled={isSyncing}
              className="px-4 py-2 bg-[#fc4c02] hover:bg-[#e04000] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#fc4c02]/20 flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{isSyncing ? t.stravaSyncing : t.connectStrava}</span>
            </button>
          )}
        </div>
      </div>

      {syncSuccessToast && (
        <div className="p-3 bg-[#ecfdf5] border border-[#16a34a]/30 rounded-xl flex items-center gap-2 text-xs font-semibold text-[#16a34a]">
          <CheckCircle2 className="w-4 h-4" />
          <span>
            {lang === 'en'
              ? 'Strava activities synced. Athletic level automatically verified!'
              : 'Activités synchronisées. Niveau athlétique certifié automatiquement !'}
          </span>
        </div>
      )}

      {/* Verified Level Card & Rule Engine */}
      {stravaProfile.connected ? (
        <div className="space-y-5">
          <div className="p-4 bg-[#f4f4f5] rounded-xl border border-zinc-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <span className="ca-caption text-zinc-500 uppercase tracking-widest block">
                {t.stravaVerifiedLevel}
              </span>
              <div className="flex items-center gap-2">
                <span className="ca-stat text-2xl text-zinc-900">{stravaProfile.verifiedLevel}</span>
                <span className="ca-status-badge ca-status-success font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Certified for Fast Pacelines' : 'Certifié pour les pelotons rapides'}
                </span>
              </div>
              <p className="ca-caption text-zinc-600 mt-1 max-w-xl">
                {lang === 'fr' ? stravaProfile.calculatedRuleFr : stravaProfile.calculatedRule}
              </p>
            </div>

            {/* Quick Mileage Counter */}
            <div className="bg-white p-3 rounded-lg border border-zinc-200 shrink-0 text-right">
              <span className="ca-caption text-zinc-400 block">{lang === 'en' ? 'Strava Total' : 'Total Strava'}</span>
              <span className="font-mono text-sm font-bold text-zinc-900 block mt-0.5">
                {formatDistance(stravaProfile.totalDistanceKm)}
              </span>
              <span className="ca-caption text-zinc-500">
                {stravaProfile.totalActivitiesCount} {lang === 'en' ? 'sessions' : 'sorties'}
              </span>
            </div>
          </div>

          {/* Recent Synced Activities Feed */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="ca-display-sm text-zinc-900 text-sm">{t.recentSyncedActivities}</h3>
              {stravaProfile.lastSyncDate && (
                <span className="ca-caption text-zinc-400 font-mono text-[11px]">
                  {lang === 'en' ? 'Last sync' : 'Dernière synchro'} : {stravaProfile.lastSyncDate}
                </span>
              )}
            </div>

            <div className="divide-y divide-zinc-100 border border-zinc-200 rounded-xl overflow-hidden bg-white">
              {stravaProfile.recentActivities.map((act) => (
                <div key={act.id} className="p-3.5 flex items-center justify-between text-xs hover:bg-[#f4f4f5] transition">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg bg-zinc-100 border border-zinc-200 flex items-center justify-center text-zinc-600 shrink-0">
                      {act.sport === 'ride' ? <Bike className="w-4 h-4 text-[#e11d48]" /> : <Footprints className="w-4 h-4 text-[#2563eb]" />}
                    </div>
                    <div>
                      <span className="font-semibold text-zinc-900 block">{act.title}</span>
                      <div className="flex items-center gap-2 ca-caption text-zinc-500 mt-0.5">
                        <span>{formatDistance(act.distanceKm)}</span>
                        <span>·</span>
                        <span>{act.elevationMeters}m D+</span>
                        {act.avgSpeedKmh && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-zinc-700">{act.avgSpeedKmh} km/h avg</span>
                          </>
                        )}
                        {act.avgPaceMinKm && (
                          <>
                            <span>·</span>
                            <span className="font-semibold text-zinc-700">{act.avgPaceMinKm}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <a
                    href={act.stravaUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="ca-caption font-bold text-[#fc4c02] hover:underline flex items-center gap-1 shrink-0"
                  >
                    <span>Strava</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="p-6 bg-[#f4f4f5] rounded-xl border border-zinc-200 text-center space-y-2">
          <p className="ca-body font-semibold text-zinc-900">
            {lang === 'en' ? 'Unlock automatic pace & level verification' : 'Débloquez la vérification automatique de niveau'}
          </p>
          <p className="ca-body-sm text-zinc-500 max-w-md mx-auto">
            {lang === 'en'
              ? 'Connecting Strava imports your recent pace and distance history, certifying your level for fast weekend pacelines and tempo sessions.'
              : 'Connectez Strava pour importer vos allures récentes et certifier automatiquement votre niveau pour les sorties de groupe.'}
          </p>
          <div className="pt-2">
            <button
              onClick={handleConnect}
              className="px-4 py-2 bg-[#fc4c02] hover:bg-[#e04000] text-white text-xs font-bold rounded-full transition shadow-md shadow-[#fc4c02]/20 inline-flex items-center gap-2"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{t.connectStrava}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
