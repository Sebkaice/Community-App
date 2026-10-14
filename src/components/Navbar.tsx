import React from 'react';
import { useI18n } from '../utils/i18n';
import { Store, Compass, User, Globe, Plus, Gift, Home, MapPin, Calendar } from 'lucide-react';
import { Button } from './design-system/Button';

interface NavbarProps {
  currentRole: 'rider' | 'shop';
  onRoleChange: (role: 'rider' | 'shop') => void;
  activeRiderTab: 'home' | 'map' | 'profile' | 'my-rides' | 'loyalty';
  onRiderTabChange: (tab: 'home' | 'map' | 'profile' | 'my-rides' | 'loyalty') => void;
  activeShopTab: 'overview' | 'sessions' | 'crm' | 'marketing' | 'publish' | 'qr' | 'promo';
  onShopTabChange: (tab: 'overview' | 'sessions' | 'crm' | 'marketing' | 'publish' | 'qr' | 'promo') => void;
  onQuickPublishClick: () => void;
  myRegistrationsCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentRole,
  onRoleChange,
  activeRiderTab,
  onRiderTabChange,
  activeShopTab,
  onShopTabChange,
  onQuickPublishClick,
  myRegistrationsCount,
}) => {
  const { lang, setLang, t } = useI18n();

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-zinc-200 px-4 sm:px-6 py-2.5 sm:py-3 shadow-xs">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Name */}
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <span className="ca-display-md text-zinc-900 tracking-tight leading-none">
              {t.appName}
            </span>
            <span className="ca-caption text-zinc-500 mt-0.5 hidden xs:inline">
              {t.launchCity} · {t.appTagline}
            </span>
          </div>
        </div>

        {/* Center Athlete Navigation (Desktop) */}
        {currentRole === 'rider' && (
          <nav className="hidden md:flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-full border border-zinc-200">
            <button
              onClick={() => onRiderTabChange('home')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRiderTab === 'home'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Home className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{t.home}</span>
            </button>

            <button
              onClick={() => onRiderTabChange('map')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRiderTab === 'map'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{t.map}</span>
            </button>

            <button
              onClick={() => onRiderTabChange('loyalty')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRiderTab === 'loyalty'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <Gift className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{t.loyaltyAndPerks}</span>
            </button>

            <button
              onClick={() => onRiderTabChange('my-rides')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRiderTab === 'my-rides' || activeRiderTab === 'profile'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:text-zinc-900'
              }`}
            >
              <User className="w-3.5 h-3.5" strokeWidth={2} />
              <span>{t.mySessions}</span>
              {myRegistrationsCount > 0 && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    activeRiderTab === 'my-rides' || activeRiderTab === 'profile'
                      ? 'bg-white text-[#2563eb]'
                      : 'bg-zinc-200 text-zinc-800'
                  }`}
                >
                  {myRegistrationsCount}
                </span>
              )}
            </button>
          </nav>
        )}

        {/* Right Controls: Language toggle + Audience switcher */}
        <div className="flex items-center gap-3">
          {/* Bilingual English / French switcher */}
          <div className="flex items-center border border-zinc-200 rounded-full p-0.5 bg-[#f4f4f5] text-xs font-medium">
            <button
              onClick={() => setLang('en')}
              className={`px-2.5 py-1 rounded-full transition ${
                lang === 'en' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="English (source)"
            >
              EN
            </button>
            <button
              onClick={() => setLang('fr')}
              className={`px-2.5 py-1 rounded-full transition ${
                lang === 'fr' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
              title="Français"
            >
              FR
            </button>
          </div>

          {/* Quick Create Action in Merchant View */}
          {currentRole === 'shop' && (
            <button
              onClick={onQuickPublishClick}
              className="ca-button ca-button-cobalt text-xs py-1.5 px-3.5"
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              <span>{t.createEvent}</span>
            </button>
          )}

          {/* Audience Switcher (Merchant Dashboard vs Athlete View) */}
          <div className="flex items-center bg-[#f4f4f5] p-1 rounded-full border border-zinc-200">
            <button
              onClick={() => onRoleChange('rider')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                currentRole === 'rider'
                  ? 'bg-white text-zinc-900 shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t.athleteView}
            </button>
            <button
              onClick={() => onRoleChange('shop')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                currentRole === 'shop'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t.merchantDashboard}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Athlete Navigation Bar */}
      {currentRole === 'rider' && (
        <div className="md:hidden mt-2 pt-2 border-t border-zinc-100 flex items-center justify-around gap-1">
          <button
            onClick={() => onRiderTabChange('home')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5 transition ${
              activeRiderTab === 'home'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Home className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{t.home}</span>
          </button>

          <button
            onClick={() => onRiderTabChange('map')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5 transition ${
              activeRiderTab === 'map'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{t.map}</span>
          </button>

          <button
            onClick={() => onRiderTabChange('loyalty')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5 transition ${
              activeRiderTab === 'loyalty'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <Gift className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{t.loyaltyAndPerks}</span>
          </button>

          <button
            onClick={() => onRiderTabChange('my-rides')}
            className={`flex-1 py-1.5 px-2 rounded-xl text-xs font-semibold flex flex-col items-center gap-0.5 transition relative ${
              activeRiderTab === 'my-rides' || activeRiderTab === 'profile'
                ? 'bg-[#2563eb] text-white shadow-xs'
                : 'text-zinc-600 hover:bg-zinc-100'
            }`}
          >
            <User className="w-3.5 h-3.5" strokeWidth={2} />
            <span>{t.mySessions}</span>
            {myRegistrationsCount > 0 && (
              <span className="absolute top-1 right-2 w-2 h-2 rounded-full bg-[#e11d48]"></span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
