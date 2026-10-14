import React, { useState } from 'react';
import { Shop, Ride, RegisteredRider, Level, ActivityType } from '../types';
import { useI18n } from '../utils/i18n';
import { formatSessionDate, formatDistance, getStatusBadge } from '../utils/helpers';
import { StatCard } from './design-system/StatCard';
import { DataTable, Column } from './design-system/DataTable';
import { ActivityChip } from './design-system/ActivityChip';
import { Button } from './design-system/Button';
import { Field } from './design-system/Field';
import { AnalyticsChart } from './AnalyticsChart';
import { MerchantAnalyticsBlocks } from './MerchantAnalyticsBlocks';
import { MarketingActivation } from './MarketingActivation';
import { QRCodeDisplay } from './QRCodeDisplay';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Megaphone,
  PlusCircle,
  QrCode,
  Bell,
  Search,
  CheckCircle2,
  XCircle,
  Trash2,
  Download,
  Smartphone,
  ExternalLink,
} from 'lucide-react';

interface ShopDashboardProps {
  shop: Shop;
  rides: Ride[];
  activeTab: 'overview' | 'sessions' | 'crm' | 'marketing' | 'publish' | 'qr' | 'promo';
  onTabChange: (tab: 'overview' | 'sessions' | 'crm' | 'marketing' | 'publish' | 'qr' | 'promo') => void;
  onPublishRide: (newRide: Omit<Ride, 'id' | 'currentSpots' | 'registeredRiders'>) => void;
  onCheckInRider: (rideId: string, riderId: string) => void;
  onDeleteRide: (rideId: string) => void;
}

export const ShopDashboard: React.FC<ShopDashboardProps> = ({
  shop,
  rides,
  activeTab,
  onTabChange,
  onPublishRide,
  onCheckInRider,
  onDeleteRide,
}) => {
  const { lang, t } = useI18n();

  // Filter rides belonging to this shop
  const shopRides = rides.filter((r) => r.shopName === shop.name || r.shopId === shop.id);

  // CRM Attendees aggregation
  interface CrmRow extends RegisteredRider {
    sessionTitle: string;
    sessionId: string;
    sessionDate: string;
    sessionActivity: ActivityType;
  }

  const allCrmRows: CrmRow[] = [];
  shopRides.forEach((r) => {
    r.registeredRiders.forEach((rider) => {
      allCrmRows.push({
        ...rider,
        sessionTitle: lang === 'fr' && r.titleFr ? r.titleFr : r.title,
        sessionId: r.id,
        sessionDate: r.date,
        sessionActivity: r.activity,
      });
    });
  });

  // State for CRM search and filters
  const [crmSearch, setCrmSearch] = useState('');
  const [crmStatusFilter, setCrmStatusFilter] = useState<'all' | 'checked' | 'pending'>('all');

  // State for Walk-in pass validation
  const [passInput, setPassInput] = useState('');
  const [scanMessage, setScanMessage] = useState<{ text: string; success: boolean } | null>(null);

  // State for Create event form
  const [formTitle, setFormTitle] = useState('');
  const [formActivity, setFormActivity] = useState<ActivityType>('ride');
  const [formDate, setFormDate] = useState('2026-10-24');
  const [formTime, setFormTime] = useState('9:00');
  const [formDist, setFormDist] = useState('65');
  const [formSpots, setFormSpots] = useState('16');
  const [formMeeting, setFormMeeting] = useState(shop.address);
  const [formDesc, setFormDesc] = useState('');
  const [formPace, setFormPace] = useState('27-30 km/h');
  const [formElevation, setFormElevation] = useState('450');
  const [formLevel, setFormLevel] = useState<Level>('Intermediate');
  const [publishSuccess, setPublishSuccess] = useState(false);

  // Filtered CRM Attendees
  const filteredCrmRows = allCrmRows.filter((row) => {
    if (crmStatusFilter === 'checked' && !row.checkedIn) return false;
    if (crmStatusFilter === 'pending' && row.checkedIn) return false;
    if (crmSearch.trim()) {
      const q = crmSearch.toLowerCase();
      return (
        row.name.toLowerCase().includes(q) ||
        row.email.toLowerCase().includes(q) ||
        (row.phone && row.phone.toLowerCase().includes(q)) ||
        row.sessionTitle.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const totalAttendeesCount = allCrmRows.length;
  const totalCheckedInCount = allCrmRows.filter((r) => r.checkedIn).length;
  const attendanceRate = totalAttendeesCount > 0 ? Math.round((totalCheckedInCount / totalAttendeesCount) * 100) : 0;

  // Handle Quick Scan Validation
  const handleValidatePass = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passInput.trim()) return;

    const term = passInput.trim().toLowerCase();
    let found = false;

    shopRides.forEach((r) => {
      r.registeredRiders.forEach((rider) => {
        if (
          rider.id.toLowerCase() === term ||
          rider.name.toLowerCase().includes(term) ||
          rider.email.toLowerCase().includes(term) ||
          (rider.phone && rider.phone.includes(term))
        ) {
          found = true;
          if (!rider.checkedIn) {
            onCheckInRider(r.id, rider.id);
          }
          setScanMessage({
            text: `${rider.name} checked in for ${r.title}`,
            success: true,
          });
        }
      });
    });

    if (!found) {
      setScanMessage({
        text: `No registration found for "${passInput}"`,
        success: false,
      });
    }

    setPassInput('');
    setTimeout(() => setScanMessage(null), 5000);
  };

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    onPublishRide({
      shopId: shop.id,
      shopName: shop.name,
      shopCategory: shop.category,
      shopLocation: shop.location,
      title: formTitle,
      titleFr: formTitle,
      activity: formActivity,
      sport: formActivity === 'run' ? 'running' : 'cycling',
      date: formDate,
      time: formTime,
      distanceKm: parseInt(formDist, 10) || 0,
      level: formLevel,
      maxSpots: parseInt(formSpots, 10) || 12,
      lat: shop.lat,
      lng: shop.lng,
      meetingPoint: formMeeting || shop.address,
      description: formDesc || `Community ${formActivity} session organized by ${shop.name}.`,
      descriptionFr: formDesc || `Session communautaire organisée par ${shop.name}.`,
      pace: formPace,
      elevationGain: parseInt(formElevation, 10) || 0,
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      onTabChange('sessions');
    }, 1200);
  };

  // Sessions Table Columns
  const sessionColumns: Column<Ride>[] = [
    {
      key: 'activity',
      header: t.activityType,
      render: (r) => <ActivityChip activity={r.activity} size="sm" />,
    },
    {
      key: 'title',
      header: t.eventTitle,
      render: (r) => (
        <div>
          <span className="font-semibold text-zinc-900 block">
            {lang === 'fr' && r.titleFr ? r.titleFr : r.title}
          </span>
          <span className="text-xs text-zinc-500">{r.meetingPoint}</span>
        </div>
      ),
    },
    {
      key: 'date',
      header: t.dateAndTime,
      render: (r) => (
        <span className="font-medium text-zinc-800">{formatSessionDate(r.date, r.time)}</span>
      ),
    },
    {
      key: 'distanceKm',
      header: t.distance,
      render: (r) => (
        <span className="text-zinc-600">{r.distanceKm > 0 ? formatDistance(r.distanceKm) : '—'}</span>
      ),
    },
    {
      key: 'roster',
      header: t.capacity,
      render: (r) => {
        const remaining = Math.max(0, r.maxSpots - r.currentSpots);
        return (
          <div>
            <span className="font-semibold text-zinc-900">
              {r.currentSpots} / {r.maxSpots}
            </span>
            <span className="text-xs text-zinc-500 block">
              {remaining > 0 ? t.spotsLeft(remaining) : lang === 'en' ? 'Full' : 'Complet'}
            </span>
          </div>
        );
      },
    },
    {
      key: 'actions',
      header: '',
      className: 'text-right',
      render: (r) => (
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onTabChange('crm')}
            className="text-xs font-semibold text-[#2563eb] hover:underline"
          >
            {t.confirmedRoster}
          </button>
          <button
            onClick={() => onDeleteRide(r.id)}
            className="text-zinc-400 hover:text-[#dc2626] transition p-1"
            title="Delete session"
          >
            <Trash2 className="w-4 h-4" strokeWidth={1.8} />
          </button>
        </div>
      ),
    },
  ];

  /**
   * ATTENDEES CRM COLUMNS (Strictly matching user requirement):
   * 1. Name
   * 2. Email
   * 3. Number (Phone Number)
   * 4. Sessions
   * 5. Strava
   * 6. Level
   * 7. History
   * 8. Status
   * 9. Actions
   */
  const crmColumns: Column<CrmRow>[] = [
    {
      key: 'name',
      header: t.columnName,
      render: (r) => (
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#f4f4f5] border border-zinc-200 flex items-center justify-center font-bold text-xs text-zinc-800 shrink-0">
            {r.name.charAt(0)}
          </div>
          <span className="font-semibold text-zinc-900">{r.name}</span>
        </div>
      ),
    },
    {
      key: 'email',
      header: t.columnEmail,
      render: (r) => (
        <a href={`mailto:${r.email}`} className="text-xs text-zinc-600 hover:text-[#2563eb] hover:underline font-mono">
          {r.email}
        </a>
      ),
    },
    {
      key: 'phone',
      header: t.columnPhone,
      render: (r) => (
        <span className="text-xs font-mono font-medium text-zinc-800">
          {r.phone || '+33 6 12 34 56 78'}
        </span>
      ),
    },
    {
      key: 'sessionTitle',
      header: t.columnSessions,
      render: (r) => (
        <div className="flex items-center gap-2 max-w-[200px]">
          <ActivityChip activity={r.sessionActivity} size="sm" />
          <span className="text-xs font-medium text-zinc-800 truncate" title={r.sessionTitle}>
            {r.sessionTitle}
          </span>
        </div>
      ),
    },
    {
      key: 'strava',
      header: t.columnStrava,
      render: (r) =>
        r.stravaConnected ? (
          <span className="ca-caption bg-[#ff5722]/10 text-[#d84315] border border-[#ff5722]/20 px-2 py-0.5 rounded font-bold">
            STRAVA
          </span>
        ) : (
          <span className="ca-caption text-zinc-400 font-mono">—</span>
        ),
    },
    {
      key: 'level',
      header: t.columnLevel,
      render: (r) => <span className="text-xs text-zinc-600">{r.level}</span>,
    },
    {
      key: 'ridesAttended',
      header: t.columnHistory,
      render: (r) => (
        <div>
          <span className="text-xs font-semibold text-zinc-900 block">
            {r.ridesAttended} {lang === 'en' ? 'sessions' : 'sessions'}
          </span>
          <span className="ca-caption text-zinc-400">
            {t.lastVisit}: {r.lastVisit || '2026-10-11'}
          </span>
        </div>
      ),
    },
    {
      key: 'status',
      header: t.columnStatus,
      render: (r) => {
        const badge = getStatusBadge(r.checkedIn);
        return (
          <span className={badge.className}>
            {r.checkedIn ? '✓' : '○'} {lang === 'en' ? badge.labelEn : badge.labelFr}
          </span>
        );
      },
    },
    {
      key: 'action',
      header: t.columnActions,
      className: 'text-right',
      render: (r) => (
        <button
          onClick={() => onCheckInRider(r.sessionId, r.id)}
          className={`ca-button text-xs py-1 px-3 ${
            r.checkedIn ? 'ca-button-outline text-zinc-600' : 'ca-button-cobalt'
          }`}
        >
          {r.checkedIn ? t.checkedIn : t.checkIn}
        </button>
      ),
    },
  ];

  return (
    <div className="min-h-[calc(100vh-65px)] flex flex-col md:flex-row bg-white">
      {/* Fixed Left Navigation: 240px wide, content gutters space-5 */}
      <aside className="w-full md:w-[240px] shrink-0 border-r border-zinc-200 bg-white p-5 flex flex-col justify-between">
        <div className="space-y-6">
          {/* Host identity card */}
          <div className="p-3 bg-[#f4f4f5] rounded-xl border border-zinc-200">
            <span className="ca-caption text-zinc-500 uppercase tracking-wider block">
              {shop.category} · {shop.location}
            </span>
            <span className="ca-display-sm text-zinc-900 block mt-0.5 leading-snug">
              {shop.name}
            </span>
            <span className="ca-caption text-zinc-500 mt-1 block">
              {t.redemptionsThisWeek(shop.weeklyRedemptions)}
            </span>
          </div>

          {/* Left Navigation Items */}
          <nav className="space-y-1">
            <button
              onClick={() => onTabChange('overview')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'overview'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-[#f4f4f5] hover:text-zinc-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" strokeWidth={2} />
              <span>{t.overview}</span>
            </button>

            <button
              onClick={() => onTabChange('sessions')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'sessions'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-[#f4f4f5] hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-4 h-4" strokeWidth={2} />
                <span>{t.sessionsTable}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'sessions' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
                }`}
              >
                {shopRides.length}
              </span>
            </button>

            <button
              onClick={() => onTabChange('crm')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'crm'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-[#f4f4f5] hover:text-zinc-900'
              }`}
            >
              <div className="flex items-center gap-3">
                <Users className="w-4 h-4" strokeWidth={2} />
                <span>{t.attendeesCRM}</span>
              </div>
              <span
                className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                  activeTab === 'crm' ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-800'
                }`}
              >
                {totalAttendeesCount}
              </span>
            </button>

            {/* MARKETING ACTIVATION MODULE TAB */}
            <button
              onClick={() => onTabChange('marketing')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'marketing'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-[#f4f4f5] hover:text-zinc-900'
              }`}
            >
              <Megaphone className="w-4 h-4" strokeWidth={2} />
              <span>{t.marketingActivation}</span>
            </button>

            <button
              onClick={() => onTabChange('publish')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'publish'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-[#f4f4f5] hover:text-zinc-900'
              }`}
            >
              <PlusCircle className="w-4 h-4" strokeWidth={2} />
              <span>{t.createEvent}</span>
            </button>

            <button
              onClick={() => onTabChange('qr')}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition ${
                activeTab === 'qr'
                  ? 'bg-[#2563eb] text-white shadow-xs'
                  : 'text-zinc-600 hover:bg-[#f4f4f5] hover:text-zinc-900'
              }`}
            >
              <QrCode className="w-4 h-4" strokeWidth={2} />
              <span>{t.walkInQR}</span>
            </button>
          </nav>
        </div>

        {/* Counter Check-in Widget in Sidebar */}
        <div className="pt-4 border-t border-zinc-200">
          <form onSubmit={handleValidatePass} className="space-y-2">
            <span className="ca-label text-[11px] text-zinc-500 block">
              {lang === 'en' ? 'Quick check-in' : 'Validation rapide'}
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder={lang === 'en' ? 'Name, email, phone or code' : 'Nom, email, tel ou code'}
                value={passInput}
                onChange={(e) => setPassInput(e.target.value)}
                className="w-full text-xs px-2.5 py-1.5 rounded-lg border border-zinc-300 focus:outline-none focus:border-[#2563eb]"
              />
            </div>
            <Button variant="quiet" fullWidth className="text-xs py-1.5">
              {t.checkIn}
            </Button>
          </form>

          {scanMessage && (
            <div
              className={`mt-2 p-2 rounded-lg text-[11px] font-medium leading-tight ${
                scanMessage.success
                  ? 'bg-[#ecfdf5] text-[#16a34a] border border-[#16a34a]/20'
                  : 'bg-[#fef2f2] text-[#dc2626] border border-[#dc2626]/20'
              }`}
            >
              {scanMessage.text}
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area: space-5 gutters (24px), pure white background */}
      <main className="flex-1 p-5 sm:p-6 lg:p-8 space-y-6 bg-white overflow-y-auto">
        {/* OVERVIEW TAB: Leads with Unique Visitors KPI row, then Comparative Graph, then Sessions DataTable */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div>
              <h1 className="ca-display-md text-zinc-900">{t.overview}</h1>
              <p className="ca-body-sm text-zinc-500 mt-0.5">
                {shop.name} · {shop.address}
              </p>
            </div>

            {/* Row of StatCards: Leading with UNIQUE VISITORS, Weekly check-ins, Attendance rate, Active sessions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                label={t.uniqueVisitors}
                value={shop.uniqueVisitorsThisMonth}
                subtext={lang === 'en' ? 'Distinct athletes this month' : 'Athlètes distincts ce mois-ci'}
                accent="cobalt"
              />
              <StatCard
                label={t.weeklyAttendees}
                value={t.redemptionsThisWeek(shop.weeklyRedemptions)}
                subtext={lang === 'en' ? 'Counter passes scanned' : 'Pass vérifiés au comptoir'}
                accent="none"
              />
              <StatCard
                label={t.attendanceRate}
                value={`${attendanceRate}%`}
                subtext={`${totalCheckedInCount} of ${totalAttendeesCount} checked in`}
                accent="sun"
              />
              <StatCard
                label={t.activeSessions}
                value={shopRides.length}
                subtext={lang === 'en' ? 'Hosted this week' : 'Organisées cette semaine'}
                accent="none"
              />
            </div>

            {/* Turnout vs Sessions Created Comparative Graph */}
            <AnalyticsChart />

            {/* Segmented 4-Block Merchant Intelligence (Audience, Equipment, Participation, Retention) */}
            <MerchantAnalyticsBlocks
              onTriggerReactivation={(riderName, riderEmail) => {
                onTabChange('marketing');
              }}
            />

            {/* Sessions DataTable */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="ca-display-sm text-zinc-900">{t.sessionsTable}</h2>
                  <p className="ca-caption text-zinc-500">
                    {lang === 'en' ? 'Current schedule and roster capacity' : 'Planning et jauges de participation'}
                  </p>
                </div>
                <Button
                  variant="cobalt"
                  onClick={() => onTabChange('publish')}
                  className="text-xs py-1.5 px-3.5"
                >
                  <PlusCircle className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{t.createEvent}</span>
                </Button>
              </div>

              <DataTable
                columns={sessionColumns}
                data={shopRides}
                keyExtractor={(r) => r.id}
                emptyState={
                  <div>
                    <p className="ca-body font-semibold text-zinc-900">
                      {lang === 'en' ? 'No sessions scheduled' : 'Aucune session programmée'}
                    </p>
                    <p className="ca-body-sm text-zinc-500 mt-1">
                      {lang === 'en'
                        ? 'Create a ride, run or recovery meet to open spots.'
                        : 'Créez une sortie, course ou séance pour ouvrir les inscriptions.'}
                    </p>
                  </div>
                }
              />
            </div>
          </div>
        )}

        {/* SESSIONS TAB */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="ca-display-md text-zinc-900">{t.sessionsTable}</h1>
                <p className="ca-body-sm text-zinc-500 mt-0.5">
                  {lang === 'en' ? 'Active and upcoming community sessions' : 'Sessions actives et à venir'}
                </p>
              </div>
              <Button
                variant="cobalt"
                onClick={() => onTabChange('publish')}
                className="text-xs py-2 px-4"
              >
                <PlusCircle className="w-4 h-4" strokeWidth={2} />
                <span>{t.createEvent}</span>
              </Button>
            </div>

            {/* Stat Row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard
                label={t.activeSessions}
                value={shopRides.length}
                accent="cobalt"
              />
              <StatCard
                label={lang === 'en' ? 'Total spots offered' : 'Places offertes'}
                value={shopRides.reduce((acc, r) => acc + r.maxSpots, 0)}
                accent="none"
              />
              <StatCard
                label={lang === 'en' ? 'Spots booked' : 'Places réservées'}
                value={shopRides.reduce((acc, r) => acc + r.currentSpots, 0)}
                accent="sun"
              />
            </div>

            <DataTable
              columns={sessionColumns}
              data={shopRides}
              keyExtractor={(r) => r.id}
            />
          </div>
        )}

        {/* ATTENDEES CRM TAB: Columns: 1. Name, 2. Email, 3. Number, Sessions, Strava, Level, History, Status, Actions */}
        {activeTab === 'crm' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="ca-display-md text-zinc-900">{t.attendeesCRM}</h1>
                <p className="ca-body-sm text-zinc-500 mt-0.5">
                  {lang === 'en'
                    ? 'Athlete roster with contact info, history and check-in statuses'
                    : 'Liste des participants avec coordonnées, historique et présences'}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    const csvContent =
                      'data:text/csv;charset=utf-8,Name,Email,Phone,Session,Level,CheckedIn\n' +
                      allCrmRows
                        .map((r) => `"${r.name}","${r.email}","${r.phone}","${r.sessionTitle}","${r.level}",${r.checkedIn}`)
                        .join('\n');
                    const encodedUri = encodeURI(csvContent);
                    const link = document.createElement('a');
                    link.setAttribute('href', encodedUri);
                    link.setAttribute('download', `attendees-${shop.name.toLowerCase().replace(/\s+/g, '-')}.csv`);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                  }}
                  className="text-xs py-1.5 px-3"
                >
                  <Download className="w-3.5 h-3.5" strokeWidth={2} />
                  <span>{t.exportCSV}</span>
                </Button>
              </div>
            </div>

            {/* Stat Cards row */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
              <StatCard
                label={t.uniqueVisitors}
                value={shop.uniqueVisitorsThisMonth}
                accent="cobalt"
              />
              <StatCard
                label={lang === 'en' ? 'Total registered' : 'Total inscrits'}
                value={totalAttendeesCount}
                accent="none"
              />
              <StatCard
                label={lang === 'en' ? 'Checked in' : 'Présents validés'}
                value={totalCheckedInCount}
                accent="sun"
              />
              <StatCard
                label={t.attendanceRate}
                value={`${attendanceRate}%`}
                accent="none"
              />
            </div>

            {/* Filters bar */}
            <div className="flex flex-col sm:flex-row items-center gap-3 p-3 bg-[#f4f4f5] rounded-xl border border-zinc-200">
              <div className="relative flex-1 w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input
                  type="text"
                  placeholder={lang === 'en' ? 'Search athlete by name, email, or phone...' : 'Rechercher par nom, e-mail ou téléphone...'}
                  value={crmSearch}
                  onChange={(e) => setCrmSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-zinc-300 rounded-lg focus:outline-none focus:border-[#2563eb]"
                />
              </div>

              <div className="flex items-center gap-1 w-full sm:w-auto">
                <button
                  onClick={() => setCrmStatusFilter('all')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                    crmStatusFilter === 'all' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {lang === 'en' ? 'All' : 'Tous'} ({allCrmRows.length})
                </button>
                <button
                  onClick={() => setCrmStatusFilter('checked')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                    crmStatusFilter === 'checked' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {lang === 'en' ? 'Checked in' : 'Validés'} ({totalCheckedInCount})
                </button>
                <button
                  onClick={() => setCrmStatusFilter('pending')}
                  className={`px-3 py-1.5 text-xs rounded-lg font-medium transition ${
                    crmStatusFilter === 'pending' ? 'bg-white text-zinc-900 shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
                  }`}
                >
                  {lang === 'en' ? 'Pending' : 'En attente'} ({totalAttendeesCount - totalCheckedInCount})
                </button>
              </div>
            </div>

            {/* Dense Data Grid */}
            <DataTable
              columns={crmColumns}
              data={filteredCrmRows}
              keyExtractor={(r) => `${r.sessionId}-${r.id}`}
              emptyState={
                <p className="ca-body-sm text-zinc-500">
                  {lang === 'en' ? 'No attendees match the criteria' : 'Aucun participant ne correspond aux critères'}
                </p>
              }
            />
          </div>
        )}

        {/* MARKETING ACTIVATION TAB */}
        {activeTab === 'marketing' && <MarketingActivation shop={shop} />}

        {/* PUBLISH EVENT TAB */}
        {activeTab === 'publish' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="ca-display-md text-zinc-900">{t.createEvent}</h1>
              <p className="ca-body-sm text-zinc-500 mt-0.5">
                {lang === 'en'
                  ? 'Publish a ride, run or recovery meet for amateur athletes in Paris'
                  : 'Publiez une sortie, course ou séance de récupération à Paris'}
              </p>
            </div>

            {publishSuccess && (
              <div className="p-4 bg-[#ecfdf5] border border-[#16a34a]/30 rounded-xl text-sm font-semibold text-[#16a34a]">
                ✓ {t.successCreated}
              </div>
            )}

            <form onSubmit={handleCreateSubmit} className="space-y-4 p-6 bg-white border border-zinc-200 rounded-2xl">
              <Field label={t.eventTitle} hint={lang === 'en' ? 'Name the action simply' : 'Nommez simplement l’action'}>
                <input
                  type="text"
                  required
                  placeholder={lang === 'en' ? 'e.g. Saturday Chevreuse loop' : 'ex. Boucle du samedi en Chevreuse'}
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  className="ca-input"
                />
              </Field>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label={t.activityType}>
                  <select
                    value={formActivity}
                    onChange={(e) => setFormActivity(e.target.value as ActivityType)}
                    className="ca-input"
                  >
                    <option value="ride">{lang === 'en' ? 'Ride (cycling)' : 'Sortie vélo'}</option>
                    <option value="run">{lang === 'en' ? 'Run' : 'Course à pied'}</option>
                    <option value="social">{lang === 'en' ? 'Social bakery / coffee run' : 'Café / boulangerie social'}</option>
                    <option value="wellness">{lang === 'en' ? 'Recovery / mobility' : 'Récupération / étirements'}</option>
                  </select>
                </Field>

                <Field label={lang === 'en' ? 'Fitness level' : 'Niveau de condition'}>
                  <select
                    value={formLevel}
                    onChange={(e) => setFormLevel(e.target.value as Level)}
                    className="ca-input"
                  >
                    <option value="Beginner">{t.beginner}</option>
                    <option value="Intermediate">{t.intermediate}</option>
                    <option value="Advanced">{t.advanced}</option>
                    <option value="Expert">{t.expert}</option>
                  </select>
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label={lang === 'en' ? 'Date' : 'Date'}>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="ca-input"
                  />
                </Field>

                <Field label={lang === 'en' ? 'Start time' : 'Heure de départ'}>
                  <input
                    type="text"
                    required
                    placeholder="9:00"
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="ca-input"
                  />
                </Field>

                <Field label={t.capacity}>
                  <input
                    type="number"
                    min="2"
                    max="100"
                    required
                    value={formSpots}
                    onChange={(e) => setFormSpots(e.target.value)}
                    className="ca-input"
                  />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label={t.distance}>
                  <input
                    type="number"
                    min="0"
                    value={formDist}
                    onChange={(e) => setFormDist(e.target.value)}
                    className="ca-input"
                  />
                </Field>

                <Field label={t.paceLabel}>
                  <input
                    type="text"
                    placeholder="28-30 km/h"
                    value={formPace}
                    onChange={(e) => setFormPace(e.target.value)}
                    className="ca-input"
                  />
                </Field>

                <Field label={t.elevationLabel}>
                  <input
                    type="number"
                    min="0"
                    value={formElevation}
                    onChange={(e) => setFormElevation(e.target.value)}
                    className="ca-input"
                  />
                </Field>
              </div>

              <Field label={t.meetingLocation}>
                <input
                  type="text"
                  required
                  value={formMeeting}
                  onChange={(e) => setFormMeeting(e.target.value)}
                  className="ca-input"
                />
              </Field>

              <Field label={t.descriptionLabel}>
                <textarea
                  rows={3}
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  placeholder={lang === 'en' ? 'Route notes, regroup points, coffee details...' : 'Itinéraire, regroupements, ravitaillement...'}
                  className="ca-input"
                />
              </Field>

              <div className="pt-2">
                <Button variant="cobalt" type="submit" fullWidth>
                  {t.publishEventSubmit}
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* WALK-IN QR FLYER TAB */}
        {activeTab === 'qr' && (
          <div className="max-w-2xl space-y-6">
            <div>
              <h1 className="ca-display-md text-zinc-900">{t.walkInQR}</h1>
              <p className="ca-body-sm text-zinc-500 mt-0.5">
                {lang === 'en'
                  ? 'Display at the counter so walk-in athletes can scan and register on the spot'
                  : 'Affichez au comptoir pour permettre aux sportifs de s’inscrire sur place'}
              </p>
            </div>

            <div className="p-8 bg-white border border-zinc-200 rounded-2xl flex flex-col items-center text-center space-y-4">
              <span className="ca-caption text-zinc-500 uppercase tracking-widest">{shop.name}</span>
              <h2 className="ca-display-sm text-zinc-900">
                {lang === 'en' ? 'Scan to join today’s session' : 'Scannez pour rejoindre la séance'}
              </h2>
              <p className="ca-body-sm text-zinc-600 max-w-md">
                {lang === 'en'
                  ? 'Instant check-in for members and walk-ins. Validates your presence and unlocks counter perks.'
                  : 'Inscription instantanée. Valide votre présence et vos avantages au comptoir.'}
              </p>

              <div className="p-4 bg-[#f4f4f5] border border-zinc-200 rounded-xl my-2">
                <QRCodeDisplay value={`https://community.paris/checkin/${shop.id}`} size={200} />
              </div>

              <span className="ca-caption text-zinc-400">
                {shop.address} · {shop.location}
              </span>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="outline"
                  onClick={() => window.print()}
                  className="text-xs py-2 px-4"
                >
                  {lang === 'en' ? 'Print table tent' : 'Imprimer le chevalet'}
                </Button>
                <Button
                  variant="cobalt"
                  onClick={() => {
                    navigator.clipboard.writeText(`https://community.paris/checkin/${shop.id}`);
                    alert(lang === 'en' ? 'Check-in link copied' : 'Lien copié');
                  }}
                  className="text-xs py-2 px-4"
                >
                  {lang === 'en' ? 'Copy digital link' : 'Copier le lien'}
                </Button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
