import { ActivityType, Level, SportType } from '../types';

/**
 * Format date strictly as: "Sat 18 Oct · 9:00"
 */
export function formatSessionDate(dateStr: string, timeStr?: string): string {
  try {
    const d = new Date(dateStr);
    const dayName = d.toLocaleDateString('en-GB', { weekday: 'short' });
    const dayNum = d.getDate();
    const month = d.toLocaleDateString('en-GB', { month: 'short' });

    let formattedTime = '9:00';
    if (timeStr) {
      // normalize time format like "08:00 AM" or "08:30" to "8:00" or "8:30"
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)?/i);
      if (match) {
        let hours = parseInt(match[1], 10);
        const mins = match[2];
        const meridiem = match[3]?.toUpperCase();
        if (meridiem === 'PM' && hours < 12) hours += 12;
        if (meridiem === 'AM' && hours === 12) hours = 0;
        formattedTime = `${hours}:${mins}`;
      } else {
        formattedTime = timeStr;
      }
    }
    return `${dayName} ${dayNum} ${month} · ${formattedTime}`;
  } catch {
    return `${dateStr} · ${timeStr || '9:00'}`;
  }
}

/**
 * Format distance strictly as: "5 km" or "80 km"
 */
export function formatDistance(distanceKm: number): string {
  return `${distanceKm} km`;
}

/**
 * Activity marker shapes and tokens:
 * activity-run (cobalt), circle ●
 * activity-ride (tomato), triangle ▲
 * activity-social (sun), diamond ◆
 * activity-wellness (sky), square ■
 */
export interface ActivityMeta {
  type: ActivityType;
  labelEn: string;
  labelFr: string;
  shapeChar: string; // ●, ▲, ◆, ■
  shapeName: string;
  badgeClass: string;
  colorHex: string;
  fillClass: string;
}

export const ACTIVITY_META: Record<ActivityType, ActivityMeta> = {
  run: {
    type: 'run',
    labelEn: 'Run',
    labelFr: 'Course',
    shapeChar: '●',
    shapeName: 'circle',
    badgeClass: 'ca-activity-chip-run',
    colorHex: '#2563eb',
    fillClass: 'bg-[#2563eb] text-white',
  },
  ride: {
    type: 'ride',
    labelEn: 'Ride',
    labelFr: 'Sortie',
    shapeChar: '▲',
    shapeName: 'triangle',
    badgeClass: 'ca-activity-chip-ride',
    colorHex: '#e11d48',
    fillClass: 'bg-[#e11d48] text-white',
  },
  social: {
    type: 'social',
    labelEn: 'Social',
    labelFr: 'Café',
    shapeChar: '◆',
    shapeName: 'diamond',
    badgeClass: 'ca-activity-chip-social',
    colorHex: '#f59e0b',
    fillClass: 'bg-[#f59e0b] text-[#09090b]',
  },
  wellness: {
    type: 'wellness',
    labelEn: 'Wellness',
    labelFr: 'Récup',
    shapeChar: '■',
    shapeName: 'square',
    badgeClass: 'ca-activity-chip-wellness',
    colorHex: '#0284c7',
    fillClass: 'bg-[#0284c7] text-white',
  },
};

export function getActivityMeta(activity: ActivityType | SportType | string): ActivityMeta {
  if (activity === 'cycling' || activity === 'ride') return ACTIVITY_META.ride;
  if (activity === 'running' || activity === 'run') return ACTIVITY_META.run;
  if (activity === 'social') return ACTIVITY_META.social;
  if (activity === 'wellness') return ACTIVITY_META.wellness;
  return ACTIVITY_META.run;
}

/**
 * Table status badge styles (radius-sm = 4px)
 */
export function getStatusBadge(checkedIn: boolean): { labelEn: string; labelFr: string; className: string } {
  if (checkedIn) {
    return {
      labelEn: 'Checked in',
      labelFr: 'Présent',
      className: 'ca-status-badge ca-status-success',
    };
  }
  return {
    labelEn: 'Registered',
    labelFr: 'Inscrit',
    className: 'ca-status-badge ca-status-neutral',
  };
}
