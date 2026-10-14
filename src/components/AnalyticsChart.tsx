import React, { useState } from 'react';
import { PeriodAnalytics } from '../types';
import { useI18n } from '../utils/i18n';
import { WEEKLY_ANALYTICS, MONTHLY_ANALYTICS } from '../data/mockData';

export const AnalyticsChart: React.FC = () => {
  const { lang, t } = useI18n();
  const [periodMode, setPeriodMode] = useState<'weekly' | 'monthly'>('weekly');
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);

  const data: PeriodAnalytics[] = periodMode === 'weekly' ? WEEKLY_ANALYTICS : MONTHLY_ANALYTICS;

  const maxAssistants = Math.max(...data.map((d) => d.assistants), 1);
  const maxSessions = Math.max(...data.map((d) => d.sessionsCreated), 1);

  // SVG dimensions
  const chartHeight = 220;
  const paddingBottom = 32;
  const paddingTop = 20;
  const effectiveHeight = chartHeight - paddingBottom - paddingTop;

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 p-5 sm:p-6 space-y-4">
      {/* Chart Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="ca-display-sm text-zinc-900">{t.attendanceComparison}</h3>
            <span className="ca-caption bg-[#f4f4f5] px-2 py-0.5 rounded text-zinc-600 font-semibold">
              {lang === 'en' ? 'Turnout vs Capacity' : 'Présence vs Capacité'}
            </span>
          </div>
          <p className="ca-caption text-zinc-500 mt-0.5">
            {lang === 'en'
              ? 'Compare verified attendee check-ins against sessions hosted per period'
              : 'Comparez les présences validées aux sessions organisées par période'}
          </p>
        </div>

        {/* Period Switcher & Legend */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#2563eb]" />
              <span className="ca-caption text-zinc-700 font-medium">{t.previousAssistants}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
              <span className="ca-caption text-zinc-700 font-medium">{t.sessionsCreated}</span>
            </div>
          </div>

          <div className="flex items-center bg-[#f4f4f5] p-0.5 rounded-full border border-zinc-200 text-xs">
            <button
              onClick={() => setPeriodMode('weekly')}
              className={`px-3 py-1 rounded-full font-medium transition ${
                periodMode === 'weekly' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t.weeklyView}
            </button>
            <button
              onClick={() => setPeriodMode('monthly')}
              className={`px-3 py-1 rounded-full font-medium transition ${
                periodMode === 'monthly' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500 hover:text-zinc-900'
              }`}
            >
              {t.monthlyView}
            </button>
          </div>
        </div>
      </div>

      {/* SVG Chart Visualization */}
      <div className="relative w-full overflow-x-auto">
        <div className="min-w-[500px]">
          <svg className="w-full" height={chartHeight} viewBox={`0 0 600 ${chartHeight}`} preserveAspectRatio="none">
            {/* Horizontal Gridlines */}
            {[0, 0.25, 0.5, 0.75, 1].map((ratio, idx) => {
              const y = paddingTop + effectiveHeight * (1 - ratio);
              return (
                <g key={idx}>
                  <line
                    x1="40"
                    y1={y}
                    x2="590"
                    y2={y}
                    stroke="#f4f4f5"
                    strokeWidth="1.5"
                    strokeDasharray={idx === 0 ? 'none' : '3,3'}
                  />
                  <text
                    x="35"
                    y={y + 3}
                    textAnchor="end"
                    className="text-[10px] fill-zinc-400 font-mono"
                  >
                    {Math.round(ratio * maxAssistants)}
                  </text>
                </g>
              );
            })}

            {/* Bars for Assistants & Sessions */}
            {data.map((item, idx) => {
              const colWidth = 550 / data.length;
              const xCenter = 40 + colWidth * idx + colWidth / 2;
              const isHovered = hoveredIdx === idx;

              // Heights
              const assistantHeight = (item.assistants / maxAssistants) * effectiveHeight;
              const assistantY = paddingTop + effectiveHeight - assistantHeight;

              const sessionHeight = (item.sessionsCreated / maxSessions) * effectiveHeight * 0.75;
              const sessionY = paddingTop + effectiveHeight - sessionHeight;

              const barW = Math.min(colWidth * 0.28, 22);

              return (
                <g
                  key={item.periodLabel}
                  className="cursor-pointer transition-opacity"
                  onMouseEnter={() => setHoveredIdx(idx)}
                  onMouseLeave={() => setHoveredIdx(null)}
                >
                  {/* Hover background column */}
                  {isHovered && (
                    <rect
                      x={xCenter - colWidth / 2 + 4}
                      y={paddingTop}
                      width={colWidth - 8}
                      height={effectiveHeight}
                      fill="#f4f4f5"
                      rx="8"
                      opacity="0.6"
                    />
                  )}

                  {/* Assistants Bar (Cobalt #2563eb) */}
                  <rect
                    x={xCenter - barW - 2}
                    y={assistantY}
                    width={barW}
                    height={assistantHeight}
                    fill="#2563eb"
                    rx="4"
                    className="transition-all duration-200"
                    opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                  />

                  {/* Sessions Bar (Sun #f59e0b) */}
                  <rect
                    x={xCenter + 2}
                    y={sessionY}
                    width={barW}
                    height={sessionHeight}
                    fill="#f59e0b"
                    rx="4"
                    className="transition-all duration-200"
                    opacity={hoveredIdx !== null && !isHovered ? 0.4 : 1}
                  />

                  {/* Period Label at bottom */}
                  <text
                    x={xCenter}
                    y={chartHeight - 10}
                    textAnchor="middle"
                    className={`text-[11px] font-medium transition-colors ${
                      isHovered ? 'fill-zinc-900 font-bold' : 'fill-zinc-500'
                    }`}
                  >
                    {item.periodLabel.replace(' (Current)', '').replace(' (MTD)', '')}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Dynamic Hover Tooltip / Detail Strip */}
      <div className="pt-2 border-t border-zinc-100 flex flex-wrap items-center justify-between gap-3 text-xs">
        {hoveredIdx !== null ? (
          <>
            <div className="flex items-center gap-2">
              <span className="font-bold text-zinc-900">{data[hoveredIdx].periodLabel}:</span>
              <span className="text-[#2563eb] font-semibold">
                {data[hoveredIdx].assistants} {lang === 'en' ? 'attendees' : 'présents'}
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-[#d97706] font-semibold">
                {data[hoveredIdx].sessionsCreated} {lang === 'en' ? 'sessions' : 'sessions'}
              </span>
              <span className="text-zinc-400">·</span>
              <span className="text-zinc-600">
                {data[hoveredIdx].uniqueVisitors} {lang === 'en' ? 'unique visitors' : 'visiteurs uniques'}
              </span>
            </div>
            <span className="ca-caption text-zinc-500">
              {t.turnoutEfficiency}:{' '}
              <strong className="text-zinc-800">
                {Math.round(data[hoveredIdx].assistants / data[hoveredIdx].sessionsCreated)}
              </strong>{' '}
              {lang === 'en' ? 'athletes/session' : 'athlètes/session'}
            </span>
          </>
        ) : (
          <div className="w-full flex items-center justify-between text-zinc-500">
            <span>
              {lang === 'en'
                ? 'Hover any column to inspect previous assistants vs sessions hosted'
                : 'Survolez une période pour inspecter la présence vs sessions organisées'}
            </span>
            <span>
              {lang === 'en' ? 'Current check-in conversion: ' : 'Taux de présence actuel : '}
              <strong className="text-zinc-900">88%</strong>
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
