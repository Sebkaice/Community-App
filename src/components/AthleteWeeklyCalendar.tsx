import React from 'react';
import { Ride } from '../types';
import { useI18n } from '../utils/i18n';
import { Calendar, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { getActivityMeta } from '../utils/helpers';

interface AthleteWeeklyCalendarProps {
  rides: Ride[];
  selectedDate: string | null;
  onSelectDate: (date: string | null) => void;
}

export const AthleteWeeklyCalendar: React.FC<AthleteWeeklyCalendarProps> = ({
  rides,
  selectedDate,
  onSelectDate,
}) => {
  const { lang, t } = useI18n();

  // Reference week: October 18 - October 24, 2026 (matching the mock data schedule)
  // Generating the 7 days of the active community week
  const weekDays = [
    { isoDate: '2026-10-18', dayEn: 'Sun', dayFr: 'Dim', dateNum: 18, monthEn: 'Oct', monthFr: 'Oct' },
    { isoDate: '2026-10-19', dayEn: 'Mon', dayFr: 'Lun', dateNum: 19, monthEn: 'Oct', monthFr: 'Oct' },
    { isoDate: '2026-10-20', dayEn: 'Tue', dayFr: 'Mar', dateNum: 20, monthEn: 'Oct', monthFr: 'Oct' },
    { isoDate: '2026-10-21', dayEn: 'Wed', dayFr: 'Mer', dateNum: 21, monthEn: 'Oct', monthFr: 'Oct' },
    { isoDate: '2026-10-22', dayEn: 'Thu', dayFr: 'Jeu', dateNum: 22, monthEn: 'Oct', monthFr: 'Oct' },
    { isoDate: '2026-10-23', dayEn: 'Fri', dayFr: 'Ven', dateNum: 23, monthEn: 'Oct', monthFr: 'Oct' },
    { isoDate: '2026-10-24', dayEn: 'Sat', dayFr: 'Sam', dateNum: 24, monthEn: 'Oct', monthFr: 'Oct' },
  ];

  // Helper to find sessions for a specific date
  const getRidesForDate = (dateStr: string) => {
    return rides.filter((r) => r.date === dateStr);
  };

  const totalWeekRides = rides.length;

  return (
    <div className="bg-white border border-zinc-200 rounded-2xl p-4 sm:p-5 shadow-xs mb-8">
      {/* Calendar Header with title & All Week button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-zinc-100">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#2563eb]/10 text-[#2563eb] flex items-center justify-center font-bold">
            <Calendar className="w-4 h-4" strokeWidth={2.2} />
          </div>
          <div>
            <h3 className="ca-display-sm text-zinc-900 leading-tight">
              {t.calendarTitle}
            </h3>
            <p className="ca-caption text-zinc-500">
              {lang === 'en'
                ? 'Week of 18 – 24 October 2026 · Paris'
                : 'Semaine du 18 au 24 Octobre 2026 · Paris'}
            </p>
          </div>
        </div>

        {/* Filter State Buttons */}
        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={() => onSelectDate(null)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition flex items-center gap-1.5 ${
              selectedDate === null
                ? 'bg-zinc-900 text-white shadow-xs'
                : 'bg-[#f4f4f5] text-zinc-600 hover:bg-zinc-200'
            }`}
          >
            {selectedDate === null && <Check className="w-3.5 h-3.5" />}
            <span>{t.allWeek}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                selectedDate === null ? 'bg-white/20 text-white' : 'bg-zinc-200 text-zinc-700'
              }`}
            >
              {totalWeekRides}
            </span>
          </button>
        </div>
      </div>

      {/* 7-Day Interactive Strip */}
      <div className="grid grid-cols-7 gap-1.5 sm:gap-2 overflow-x-auto pb-1">
        {weekDays.map((day) => {
          const dayRides = getRidesForDate(day.isoDate);
          const hasRides = dayRides.length > 0;
          const isSelected = selectedDate === day.isoDate;
          const dayName = lang === 'en' ? day.dayEn : day.dayFr;

          return (
            <button
              key={day.isoDate}
              onClick={() => onSelectDate(isSelected ? null : day.isoDate)}
              className={`relative flex flex-col items-center justify-between p-2 sm:p-2.5 rounded-xl border text-center transition-all cursor-pointer select-none min-h-[82px] sm:min-h-[92px] ${
                isSelected
                  ? 'bg-[#2563eb] border-[#2563eb] text-white shadow-sm ring-2 ring-[#2563eb]/30 scale-[1.02]'
                  : hasRides
                  ? 'bg-white border-zinc-200 hover:border-zinc-400 hover:bg-zinc-50/80 text-zinc-900'
                  : 'bg-[#fafafa] border-zinc-100 hover:border-zinc-200 text-zinc-400'
              }`}
              title={`${dayName} ${day.dateNum} ${day.monthEn}: ${dayRides.length} sessions`}
            >
              {/* Day Name */}
              <span
                className={`text-[11px] sm:text-xs font-semibold uppercase tracking-wider ${
                  isSelected ? 'text-white/90' : hasRides ? 'text-zinc-600' : 'text-zinc-400'
                }`}
              >
                {dayName}
              </span>

              {/* Day Number */}
              <span
                className={`ca-display-sm text-base sm:text-lg my-0.5 ${
                  isSelected ? 'text-white font-bold' : hasRides ? 'text-zinc-900 font-bold' : 'text-zinc-400'
                }`}
              >
                {day.dateNum}
              </span>

              {/* Dots / Badges for activities */}
              <div className="flex items-center justify-center gap-1 mt-0.5 min-h-[14px]">
                {dayRides.slice(0, 3).map((r, i) => {
                  const meta = getActivityMeta(r.activity);
                  const dotColor =
                    isSelected
                      ? 'bg-white'
                      : r.activity === 'ride'
                      ? 'bg-[#e11d48]'
                      : r.activity === 'run'
                      ? 'bg-[#2563eb]'
                      : r.activity === 'social'
                      ? 'bg-[#f59e0b]'
                      : 'bg-[#0284c7]';

                  return (
                    <span
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${dotColor}`}
                      title={r.title}
                    />
                  );
                })}
                {dayRides.length > 3 && (
                  <span className={`text-[9px] font-bold ${isSelected ? 'text-white' : 'text-zinc-500'}`}>
                    +{dayRides.length - 3}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Day Status Bar */}
      {selectedDate && (
        <div className="mt-3 pt-3 border-t border-zinc-100 flex items-center justify-between text-xs">
          <span className="text-zinc-600 font-medium">
            {lang === 'en'
              ? `Filtered to: ${selectedDate} (${getRidesForDate(selectedDate).length} sessions scheduled)`
              : `Filtré au : ${selectedDate} (${getRidesForDate(selectedDate).length} sessions prévues)`}
          </span>
          <button
            onClick={() => onSelectDate(null)}
            className="text-[#2563eb] hover:underline font-semibold"
          >
            {lang === 'en' ? 'Show all week' : 'Voir toute la semaine'}
          </button>
        </div>
      )}
    </div>
  );
};
