import React, { useState } from 'react';
import { useI18n } from '../utils/i18n';
import {
  AUDIENCE_GENDER,
  AUDIENCE_AGE_BRACKETS,
  AUDIENCE_LEVELS,
  AUDIENCE_POSTAL_DISTRICTS,
  BIKE_BRANDS,
  SHOE_BRANDS,
  GEAR_VINTAGE,
  NO_SHOW_DATA,
  OCCUPANCY_HEATMAP,
  NEW_VS_RETURNING,
  COHORT_RETENTION,
  FREQUENCY_BUCKETS,
  INACTIVE_RIDERS,
} from '../data/mockData';
import { Users, Wrench, CalendarDays, UserCheck, ArrowRight, Sparkles, Send, MapPin, Tag } from 'lucide-react';
import { Button } from './design-system/Button';

interface MerchantAnalyticsBlocksProps {
  onTriggerReactivation?: (riderName: string, riderEmail: string) => void;
}

export const MerchantAnalyticsBlocks: React.FC<MerchantAnalyticsBlocksProps> = ({
  onTriggerReactivation,
}) => {
  const { lang, t } = useI18n();

  const [activeBlock, setActiveBlock] = useState<'audience' | 'equipment' | 'participation' | 'retention'>('audience');
  const [reengagedRiderId, setReengagedRiderId] = useState<string | null>(null);

  const handleReactivate = (rider: typeof INACTIVE_RIDERS[0]) => {
    setReengagedRiderId(rider.id);
    if (onTriggerReactivation) {
      onTriggerReactivation(rider.name, rider.email);
    }
    setTimeout(() => setReengagedRiderId(null), 4000);
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 space-y-6">
      {/* Segmented Sub-Tab Switcher for the 4 Blocks */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-100 pb-4">
        <div>
          <h2 className="ca-display-sm text-zinc-900">
            {lang === 'en' ? 'Merchant Intelligence & KPIs' : 'Indicateurs & Décisions Stratégiques'}
          </h2>
          <p className="ca-caption text-zinc-500 mt-0.5">
            {lang === 'en'
              ? 'Actionable segmentation to adapt store stock, session schedules, and retention.'
              : 'Données exploitables pour ajuster le surtassortiment, les créneaux et la fidélisation.'}
          </p>
        </div>

        {/* Tab Switcher Pills */}
        <div className="flex items-center gap-1 bg-[#f4f4f5] p-1 rounded-full border border-zinc-200 overflow-x-auto">
          <button
            onClick={() => setActiveBlock('audience')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeBlock === 'audience' ? 'bg-[#2563eb] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.blockAudienceTitle}</span>
          </button>

          <button
            onClick={() => setActiveBlock('equipment')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeBlock === 'equipment' ? 'bg-[#2563eb] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>{t.blockEquipmentTitle}</span>
          </button>

          <button
            onClick={() => setActiveBlock('participation')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeBlock === 'participation' ? 'bg-[#2563eb] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <CalendarDays className="w-3.5 h-3.5" />
            <span>{t.blockParticipationTitle}</span>
          </button>

          <button
            onClick={() => setActiveBlock('retention')}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition flex items-center gap-1.5 ${
              activeBlock === 'retention' ? 'bg-[#2563eb] text-white shadow-xs' : 'text-zinc-600 hover:text-zinc-900'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            <span>{t.blockRetentionTitle}</span>
          </button>
        </div>
      </div>

      {/* ======================================================== */}
      {/* BLOQUE 1: PERFIL DE LA AUDIENCIA (ONBOARDING)            */}
      {/* ======================================================== */}
      {activeBlock === 'audience' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1.1: 100% Stacked Bar for Gender */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.genderBreakdown}</span>
                <span className="ca-caption text-zinc-400">100% Stacked Bar</span>
              </div>

              {/* 100% Stacked Bar Graphic */}
              <div className="w-full h-8 rounded-lg overflow-hidden flex shadow-xs border border-zinc-200">
                <div
                  className="bg-[#2563eb] h-full flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ width: `${AUDIENCE_GENDER.menPct}%` }}
                  title={`Men: ${AUDIENCE_GENDER.menPct}%`}
                >
                  {AUDIENCE_GENDER.menPct}%
                </div>
                <div
                  className="bg-[#e11d48] h-full flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ width: `${AUDIENCE_GENDER.womenPct}%` }}
                  title={`Women: ${AUDIENCE_GENDER.womenPct}%`}
                >
                  {AUDIENCE_GENDER.womenPct}%
                </div>
                <div
                  className="bg-zinc-400 h-full flex items-center justify-center text-white text-[11px] font-bold"
                  style={{ width: `${AUDIENCE_GENDER.undisclosedPct}%` }}
                  title={`Undisclosed: ${AUDIENCE_GENDER.undisclosedPct}%`}
                >
                  {AUDIENCE_GENDER.undisclosedPct}%
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-between text-xs pt-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  <span className="text-zinc-700">{t.genderMen} ({AUDIENCE_GENDER.menPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                  <span className="text-zinc-700">{t.genderWomen} ({AUDIENCE_GENDER.womenPct}%)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-zinc-400" />
                  <span className="text-zinc-500">{t.genderUndisclosed} ({AUDIENCE_GENDER.undisclosedPct}%)</span>
                </div>
              </div>

              {/* Actionable Decision Takeaway */}
              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.genderDecision}
              </div>
            </div>

            {/* 1.2: Age Brackets Histogram */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.ageDistribution}</span>
                <span className="ca-caption text-zinc-400">Histogram</span>
              </div>

              {/* Histogram bars */}
              <div className="flex items-end justify-between gap-3 h-24 pt-2">
                {AUDIENCE_AGE_BRACKETS.map((b) => (
                  <div key={b.range} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] font-bold text-zinc-900">{b.percentage}%</span>
                    <div
                      className="w-full bg-[#2563eb] rounded-t-md transition-all hover:bg-[#1d4ed8]"
                      style={{ height: `${b.percentage * 1.8}px` }}
                      title={`${b.count} athletes (${b.percentage}%)`}
                    />
                    <span className="text-[10px] text-zinc-500 font-medium">{b.range}</span>
                  </div>
                ))}
              </div>

              {/* Actionable Decision Takeaway */}
              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.ageDecision}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 1.3: Declared Level / Pace Donut Chart */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.fitnessLevels}</span>
                <span className="ca-caption text-zinc-400">Pace Donut</span>
              </div>

              <div className="flex items-center gap-6">
                {/* SVG Donut */}
                <div className="relative w-28 h-28 shrink-0">
                  <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
                    <circle cx="18" cy="18" r="14" fill="none" stroke="#f4f4f5" strokeWidth="6" />
                    {/* Intermediate 41% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#2563eb"
                      strokeWidth="6"
                      strokeDasharray="41 100"
                      strokeDashoffset="0"
                    />
                    {/* Advanced 33% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#e11d48"
                      strokeWidth="6"
                      strokeDasharray="33 100"
                      strokeDashoffset="-41"
                    />
                    {/* Beginner 14% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#10b981"
                      strokeWidth="6"
                      strokeDasharray="14 100"
                      strokeDashoffset="-74"
                    />
                    {/* Expert 12% */}
                    <circle
                      cx="18"
                      cy="18"
                      r="14"
                      fill="none"
                      stroke="#09090b"
                      strokeWidth="6"
                      strokeDasharray="12 100"
                      strokeDashoffset="-88"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
                    <span className="ca-stat text-base leading-none">168</span>
                    <span className="ca-caption text-[9px] text-zinc-400">members</span>
                  </div>
                </div>

                {/* Legend list */}
                <div className="flex-1 space-y-1.5 text-xs">
                  {AUDIENCE_LEVELS.map((lvl) => (
                    <div key={lvl.level} className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: lvl.colorHex }} />
                        <span className="text-zinc-700">{lvl.level}</span>
                      </div>
                      <span className="font-semibold text-zinc-900">{lvl.percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actionable Decision Takeaway */}
              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.fitnessDecision}
              </div>
            </div>

            {/* 1.4: Neighborhood / Arrondissement Heat Density */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.parisDistricts}</span>
                <span className="ca-caption text-zinc-400">Postal Density</span>
              </div>

              <div className="space-y-2">
                {AUDIENCE_POSTAL_DISTRICTS.map((d) => (
                  <div key={d.postalCode} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-zinc-800">
                        {d.postalCode} · {d.name}
                      </span>
                      <span className="font-mono text-zinc-600 text-[11px]">
                        {d.count} ({d.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#f4f4f5] h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full"
                        style={{ width: `${d.percentage * 2.2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              {/* Actionable Decision Takeaway */}
              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.districtsDecision}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BLOQUE 2: EQUIPAMIENTO                                   */}
      {/* ======================================================== */}
      {activeBlock === 'equipment' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 2.1: Top Bike Brands (Horizontal rankings) */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.bikeBrands}</span>
                <span className="ca-caption text-zinc-400">Top N</span>
              </div>

              <div className="space-y-2.5">
                {BIKE_BRANDS.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-zinc-900">{b.name}</span>
                        <span className="text-zinc-500 text-[11px] ml-1.5">({b.subType})</span>
                      </div>
                      <span className="font-mono font-bold text-[#2563eb]">{b.sharePct}%</span>
                    </div>
                    <div className="w-full bg-[#f4f4f5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full transition-all"
                        style={{ width: `${b.sharePct * 2.8}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.bikeDecision}
              </div>
            </div>

            {/* 2.2: Top Running Shoe Brands */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.shoeBrands}</span>
                <span className="ca-caption text-zinc-400">Top N</span>
              </div>

              <div className="space-y-2.5">
                {SHOE_BRANDS.map((b) => (
                  <div key={b.name} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div>
                        <span className="font-semibold text-zinc-900">{b.name}</span>
                        <span className="text-zinc-500 text-[11px] ml-1.5">({b.subType})</span>
                      </div>
                      <span className="font-mono font-bold text-[#e11d48]">{b.sharePct}%</span>
                    </div>
                    <div className="w-full bg-[#f4f4f5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#e11d48] h-full rounded-full transition-all"
                        style={{ width: `${b.sharePct * 2.6}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.shoeDecision}
              </div>
            </div>
          </div>

          {/* 2.3: Gear Vintage Histogram */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="ca-label text-zinc-800">{t.gearVintage}</span>
                <p className="ca-caption text-zinc-500">{lang === 'en' ? 'Reported age of primary bike or running shoes' : 'Ancienneté déclarée du matériel principal'}</p>
              </div>
              <span className="ca-caption text-zinc-400">Replacement Window</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              {GEAR_VINTAGE.map((v) => (
                <div key={v.ageLabel} className="p-3 rounded-lg bg-[#f4f4f5] border border-zinc-200 text-center">
                  <span className="ca-caption text-zinc-500 block">{v.ageLabel}</span>
                  <span className="ca-stat text-xl text-zinc-900 block my-0.5">{v.sharePct}%</span>
                  <span className="ca-caption text-zinc-400">{v.count} athletes</span>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
              💡 {t.gearVintageDecision}
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BLOQUE 3: PARTICIPACIÓN                                  */}
      {/* ======================================================== */}
      {activeBlock === 'participation' && (
        <div className="space-y-6">
          {/* 3.1: Registered vs. Attended (No-Show Rate) */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
            <div className="flex items-center justify-between">
              <span className="ca-label text-zinc-800">{t.noShowTitle}</span>
              <span className="ca-caption text-zinc-500">Avg No-Show Rate: <strong className="text-zinc-900">12.3%</strong></span>
            </div>

            <div className="space-y-3">
              {NO_SHOW_DATA.map((item) => (
                <div key={item.sessionTitle} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-zinc-800">{item.sessionTitle}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-zinc-600 font-mono text-[11px]">
                        {item.attended} / {item.registered} attended
                      </span>
                      <span
                        className={`ca-status-badge ${
                          item.noShowPct > 15 ? 'ca-status-warning' : 'ca-status-success'
                        }`}
                      >
                        {item.noShowPct}% no-show
                      </span>
                    </div>
                  </div>
                  <div className="w-full bg-[#f4f4f5] h-3 rounded-full overflow-hidden flex">
                    <div
                      className="bg-[#2563eb] h-full"
                      style={{ width: `${(item.attended / item.registered) * 100}%` }}
                      title={`Attended: ${item.attended}`}
                    />
                    <div
                      className="bg-[#f59e0b] h-full"
                      style={{ width: `${item.noShowPct}%` }}
                      title={`No-show: ${item.registered - item.attended}`}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
              💡 {t.noShowDecision}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* 3.2: Occupancy Heatmap by Day & Time (7 x 3 grid) */}
            <div className="lg:col-span-8 p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.occupancyHeatmapTitle}</span>
                <span className="ca-caption text-zinc-400">Day × Slot</span>
              </div>

              {/* Heatmap Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-center text-xs border-collapse">
                  <thead>
                    <tr>
                      <th className="p-1.5 text-left text-zinc-400 font-normal">Day</th>
                      <th className="p-1.5 text-zinc-600 font-semibold">Morning (7h-9h)</th>
                      <th className="p-1.5 text-zinc-600 font-semibold">Noon (12h-14h)</th>
                      <th className="p-1.5 text-zinc-600 font-semibold">Evening (18h-20h)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                      const morning = OCCUPANCY_HEATMAP.find((h) => h.day === day && h.slot === 'morning');
                      const noon = OCCUPANCY_HEATMAP.find((h) => h.day === day && h.slot === 'noon');
                      const evening = OCCUPANCY_HEATMAP.find((h) => h.day === day && h.slot === 'evening');

                      const getBg = (intensity = 0) => {
                        if (intensity >= 85) return 'bg-[#2563eb] text-white font-bold';
                        if (intensity >= 65) return 'bg-[#3b82f6]/70 text-white font-medium';
                        if (intensity >= 40) return 'bg-[#93c5fd]/50 text-zinc-900';
                        return 'bg-[#f4f4f5] text-zinc-500';
                      };

                      return (
                        <tr key={day} className="border-t border-zinc-100">
                          <td className="p-1.5 text-left font-semibold text-zinc-900">{day}</td>
                          <td className="p-1.5">
                            <span className={`px-2 py-1 rounded-md text-[11px] inline-block w-full ${getBg(morning?.turnoutIntensity)}`}>
                              {morning?.avgAttendees} riders
                            </span>
                          </td>
                          <td className="p-1.5">
                            <span className={`px-2 py-1 rounded-md text-[11px] inline-block w-full ${getBg(noon?.turnoutIntensity)}`}>
                              {noon?.avgAttendees} riders
                            </span>
                          </td>
                          <td className="p-1.5">
                            <span className={`px-2 py-1 rounded-md text-[11px] inline-block w-full ${getBg(evening?.turnoutIntensity)}`}>
                              {evening?.avgAttendees} riders
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.occupancyDecision}
              </div>
            </div>

            {/* 3.3: First-Timers vs Returning */}
            <div className="lg:col-span-4 p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.newVsReturningTitle}</span>
                <span className="ca-caption text-zinc-400">Weekly</span>
              </div>

              <div className="space-y-3 pt-2">
                {NEW_VS_RETURNING.map((w) => {
                  const total = w.newCount + w.returningCount;
                  const newPct = Math.round((w.newCount / total) * 100);
                  const retPct = 100 - newPct;

                  return (
                    <div key={w.period} className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-zinc-800">{w.period}</span>
                        <span className="ca-caption text-zinc-500">
                          {w.newCount} new ({newPct}%) · {w.returningCount} regular
                        </span>
                      </div>
                      <div className="w-full bg-[#f4f4f5] h-3 rounded-full overflow-hidden flex">
                        <div
                          className="bg-[#e11d48] h-full"
                          style={{ width: `${newPct}%` }}
                          title={`New: ${w.newCount}`}
                        />
                        <div
                          className="bg-[#2563eb] h-full"
                          style={{ width: `${retPct}%` }}
                          title={`Returning: ${w.returningCount}`}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-4 text-xs pt-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#e11d48]" />
                  <span className="text-zinc-600">{t.firstTimers}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#2563eb]" />
                  <span className="text-zinc-600">{t.returningAthletes}</span>
                </div>
              </div>

              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.newVsReturningDecision}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* BLOQUE 4: RETENCIÓN                                      */}
      {/* ======================================================== */}
      {activeBlock === 'retention' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* 4.1: Cohort Retention Rates (30 & 60 days) */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.cohortRetentionTitle}</span>
                <span className="ca-caption text-zinc-400">Cohorts</span>
              </div>

              <div className="space-y-3">
                {COHORT_RETENTION.map((c) => (
                  <div key={c.cohortName} className="p-3 rounded-lg bg-[#f4f4f5] border border-zinc-200 space-y-2">
                    <div className="flex items-center justify-between text-xs font-semibold text-zinc-900">
                      <span>{c.cohortName}</span>
                      <span className="text-zinc-500 font-normal">Base: {c.initialSize} athletes</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-white p-2 rounded border border-zinc-200 text-center">
                        <span className="ca-caption text-zinc-400 block">Day 30 Return</span>
                        <span className="ca-stat text-lg text-[#2563eb] block mt-0.5">{c.day30ReturnPct}%</span>
                      </div>
                      <div className="bg-white p-2 rounded border border-zinc-200 text-center">
                        <span className="ca-caption text-zinc-400 block">Day 60 Return</span>
                        <span className="ca-stat text-lg text-[#16a34a] block mt-0.5">{c.day60ReturnPct}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.cohortDecision}
              </div>
            </div>

            {/* 4.2: Frequency Distribution Histogram */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
              <div className="flex items-center justify-between">
                <span className="ca-label text-zinc-800">{t.frequencyDistributionTitle}</span>
                <span className="ca-caption text-zinc-400">Core Community</span>
              </div>

              <div className="space-y-2.5 pt-1">
                {FREQUENCY_BUCKETS.map((f) => (
                  <div key={f.bucketLabel} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-zinc-800">{f.bucketLabel}</span>
                      <span className="font-mono font-bold text-zinc-900">
                        {f.riderCount} ({f.percentage}%)
                      </span>
                    </div>
                    <div className="w-full bg-[#f4f4f5] h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#2563eb] h-full rounded-full"
                        style={{ width: `${f.percentage * 2.2}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
                💡 {t.frequencyDecision}
              </div>
            </div>
          </div>

          {/* 4.3: Actionable List of Inactive Athletes (> 30 days) */}
          <div className="p-4 rounded-xl border border-zinc-200 bg-white space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="ca-label text-zinc-800">{t.inactiveRidersTitle}</span>
                <p className="ca-caption text-zinc-500">
                  {lang === 'en'
                    ? 'Athletes previously active who have not checked in for over 30 days'
                    : 'Membres assidus n’ayant pas participé depuis plus de 30 jours'}
                </p>
              </div>
              <span className="ca-status-badge ca-status-warning">
                {INACTIVE_RIDERS.length} {lang === 'en' ? 'dormant athletes' : 'athlètes à relancer'}
              </span>
            </div>

            {/* Inactive Table */}
            <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white">
              <table className="ca-data-table">
                <thead>
                  <tr>
                    <th>{t.columnName}</th>
                    <th>{t.columnPhone}</th>
                    <th>{lang === 'en' ? 'Last Attended' : 'Dernière sortie'}</th>
                    <th>{lang === 'en' ? 'Days Inactive' : 'Jours d’inactivité'}</th>
                    <th>{lang === 'en' ? 'Lifetime History' : 'Historique'}</th>
                    <th className="text-right">{t.columnActions}</th>
                  </tr>
                </thead>
                <tbody>
                  {INACTIVE_RIDERS.map((r) => {
                    const isReengaged = reengagedRiderId === r.id;

                    return (
                      <tr key={r.id}>
                        <td>
                          <span className="font-semibold text-zinc-900 block">{r.name}</span>
                          <span className="text-xs text-zinc-500">{r.email}</span>
                        </td>
                        <td className="text-xs font-mono text-zinc-800">{r.phone}</td>
                        <td className="text-xs text-zinc-600">{r.lastSession}</td>
                        <td>
                          <span className="ca-status-badge ca-status-warning">
                            {t.daysInactive(r.daysInactive)}
                          </span>
                        </td>
                        <td className="text-xs text-zinc-700 font-semibold">
                          {r.lifetimeSessions} {lang === 'en' ? 'sessions' : 'sorties'}
                        </td>
                        <td className="text-right">
                          <button
                            onClick={() => handleReactivate(r)}
                            disabled={isReengaged}
                            className={`ca-button text-xs py-1 px-3 ${
                              isReengaged
                                ? 'ca-button-quiet text-[#16a34a] font-bold'
                                : 'ca-button-cobalt'
                            }`}
                          >
                            {isReengaged ? '✓ Perk Dispatched' : t.sendReactivationPerk}
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="p-2.5 bg-[#f4f4f5] rounded-lg border border-zinc-200 text-[11px] text-zinc-700 font-medium">
              💡 {t.inactiveDecision}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
