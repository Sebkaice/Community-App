import React, { useState } from 'react';
import { Shop, Ride, LoyaltyTier } from '../types';
import { useI18n } from '../utils/i18n';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Button } from './design-system/Button';
import { Gift, Award, CheckCircle2, ChevronRight, X, Sparkles, MapPin, QrCode } from 'lucide-react';

interface AthleteLoyaltyProps {
  shops: Shop[];
  athleteName: string;
  athleteEmail: string;
  rides: Ride[];
}

export const AthleteLoyalty: React.FC<AthleteLoyaltyProps> = ({
  shops,
  athleteName,
  athleteEmail,
  rides,
}) => {
  const { lang, t } = useI18n();

  // Simulated athlete points balances per store
  const [athletePoints, setAthletePoints] = useState<Record<string, number>>({
    'shop-1': 85, // Café du Cycliste (Tier 1 unlocked, Tier 2 close)
    'shop-2': 40, // Ten Belles Bakery (Tier 1 unlocked)
    'shop-3': 20, // Distance Athletics
    'shop-4': 0,  // Le Peloton Café (no loyalty offered)
  });

  const [activeRedeemTier, setActiveRedeemTier] = useState<{
    shop: Shop;
    tier: LoyaltyTier;
  } | null>(null);

  const [redeemSuccessCode, setRedeemSuccessCode] = useState<string | null>(null);

  const handleOpenRedeem = (shop: Shop, tier: LoyaltyTier) => {
    setActiveRedeemTier({ shop, tier });
    const code = `PERK-${shop.id.toUpperCase()}-${tier.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setRedeemSuccessCode(code);
  };

  return (
    <div className="min-h-[calc(100vh-65px)] bg-white py-8 px-4 sm:px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Module Header */}
        <div>
          <span className="ca-caption text-zinc-500 uppercase tracking-widest block mb-1">
            {lang === 'en' ? 'Community Rewards & Perks' : 'Avantages & Récompenses'}
          </span>
          <h1 className="ca-display-lg text-zinc-900 leading-tight">{t.loyaltyTitle}</h1>
          <p className="ca-body text-zinc-600 mt-1 max-w-2xl">{t.loyaltySubtitle}</p>
        </div>

        {/* List of Boutiques & Stores */}
        <div className="space-y-6">
          {shops.map((shop) => {
            const loyalty = shop.loyaltyConfig;
            const hasLoyalty = loyalty && loyalty.enabled;
            const currentPoints = athletePoints[shop.id] || 0;

            return (
              <div
                key={shop.id}
                className="rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6 space-y-5"
              >
                {/* Store Header Strip */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-100 pb-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={shop.logoUrl}
                      alt={shop.name}
                      className="w-12 h-12 rounded-xl object-cover border border-zinc-200"
                    />
                    <div>
                      <div className="flex items-center gap-2">
                        <h2 className="ca-display-sm text-zinc-900">{shop.name}</h2>
                        <span className="ca-caption bg-[#f4f4f5] px-2 py-0.5 rounded text-zinc-600 font-medium capitalize">
                          {shop.category}
                        </span>
                      </div>
                      <p className="ca-caption text-zinc-500 flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3.5 h-3.5 text-zinc-400" />
                        <span>{shop.address}</span>
                      </p>
                    </div>
                  </div>

                  {/* Points Badge / Status */}
                  <div>
                    {hasLoyalty ? (
                      <div className="flex items-center gap-3 bg-[#f4f4f5] px-4 py-2 rounded-xl border border-zinc-200">
                        <div>
                          <span className="ca-caption text-zinc-500 block">
                            {lang === 'fr' ? loyalty.currencyNameFr : loyalty.currencyName}
                          </span>
                          <span className="ca-stat text-2xl text-[#2563eb] block leading-none">
                            {currentPoints} <span className="text-xs font-normal text-zinc-600">pts</span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <span className="ca-caption bg-zinc-100 text-zinc-500 px-3 py-1.5 rounded-lg border border-zinc-200 inline-block">
                        {t.noLoyaltyOffered}
                      </span>
                    )}
                  </div>
                </div>

                {/* Loyalty Tiers or No Loyalty notice */}
                {hasLoyalty ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="ca-label text-zinc-800 text-xs">{t.rewardTiers}</span>
                      <span className="ca-caption text-zinc-500">
                        {t.pointsEarnedPerCheckin(loyalty.pointsPerCheckin)}
                      </span>
                    </div>

                    {/* Tier Cards Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {loyalty.tiers.map((tier) => {
                        const tierName = lang === 'fr' ? tier.nameFr : tier.name;
                        const tierDesc = lang === 'fr' ? tier.descriptionFr : tier.description;
                        const isUnlocked = currentPoints >= tier.pointsRequired;
                        const progressPct = Math.min(100, Math.round((currentPoints / tier.pointsRequired) * 100));

                        return (
                          <div
                            key={tier.id}
                            className={`p-4 rounded-xl border flex flex-col justify-between transition ${
                              isUnlocked
                                ? 'bg-white border-[#2563eb]/40 shadow-xs'
                                : 'bg-[#f4f4f5]/60 border-zinc-200'
                            }`}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between">
                                <span className="ca-caption font-bold text-zinc-900">
                                  {tier.pointsRequired} pts
                                </span>
                                {isUnlocked ? (
                                  <span className="ca-status-badge ca-status-success">
                                    ✓ {t.counterPerksUnlocked}
                                  </span>
                                ) : (
                                  <span className="ca-caption text-zinc-400">
                                    {t.nextRewardAt(tier.pointsRequired - currentPoints)}
                                  </span>
                                )}
                              </div>

                              <h3 className="ca-body font-semibold text-zinc-900 leading-snug">
                                {tierName}
                              </h3>
                              <p className="ca-caption text-zinc-500">{tierDesc}</p>
                            </div>

                            {/* Progress bar or Redeem Button */}
                            <div className="pt-3 mt-3 border-t border-zinc-100">
                              {isUnlocked ? (
                                <Button
                                  variant="cobalt"
                                  fullWidth
                                  onClick={() => handleOpenRedeem(shop, tier)}
                                  className="text-xs py-1.5"
                                >
                                  {t.redeemAtCounter}
                                </Button>
                              ) : (
                                <div>
                                  <div className="w-full bg-zinc-200 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-[#2563eb] h-full rounded-full transition-all"
                                      style={{ width: `${progressPct}%` }}
                                    />
                                  </div>
                                  <span className="ca-caption text-zinc-400 mt-1 block text-right">
                                    {currentPoints} / {tier.pointsRequired} pts
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : (
                  <p className="ca-caption text-zinc-500 italic">
                    {lang === 'en'
                      ? 'This venue focuses exclusively on drop-in sessions without points accumulation.'
                      : 'Cet établissement organise des séances sans cumul de points fidélité.'}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Counter Redemption Modal */}
        {activeRedeemTier && redeemSuccessCode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
            <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 ca-shadow-float space-y-4 text-center">
              <button
                onClick={() => setActiveRedeemTier(null)}
                className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition"
              >
                <X className="w-5 h-5" strokeWidth={2} />
              </button>

              <div className="w-12 h-12 mx-auto rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center">
                <Gift className="w-6 h-6" strokeWidth={2} />
              </div>

              <div>
                <span className="ca-caption text-zinc-500 uppercase tracking-widest block">
                  {activeRedeemTier.shop.name}
                </span>
                <h3 className="ca-display-sm text-zinc-900 mt-0.5">
                  {lang === 'fr' ? activeRedeemTier.tier.nameFr : activeRedeemTier.tier.name}
                </h3>
                <p className="ca-caption text-zinc-500 mt-1">
                  {lang === 'en'
                    ? 'Present this QR voucher at the register counter to claim your perk.'
                    : 'Présentez ce bon QR au comptoir pour bénéficier de votre avantage.'}
                </p>
              </div>

              {/* QR Voucher Pass */}
              <div className="p-4 rounded-xl border border-zinc-200 bg-[#f4f4f5] flex flex-col items-center">
                <span className="font-mono text-xs font-bold text-zinc-800">{redeemSuccessCode}</span>
                <div className="p-2.5 bg-white rounded-lg border border-zinc-200 my-2">
                  <QRCodeDisplay value={redeemSuccessCode} size={150} />
                </div>
                <span className="ca-caption font-semibold text-zinc-900">{athleteName}</span>
                <span className="ca-caption text-zinc-500">{activeRedeemTier.shop.address}</span>
              </div>

              <Button
                variant="quiet"
                fullWidth
                onClick={() => setActiveRedeemTier(null)}
              >
                {lang === 'en' ? 'Done' : 'Fermer'}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
