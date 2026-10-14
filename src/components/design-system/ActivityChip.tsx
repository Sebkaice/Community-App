import React from 'react';
import { ActivityType, SportType } from '../../types';
import { getActivityMeta } from '../../utils/helpers';
import { useI18n } from '../../utils/i18n';

export interface ActivityChipProps {
  activity: ActivityType | SportType | string;
  size?: 'sm' | 'md';
  className?: string;
}

export const ActivityChip: React.FC<ActivityChipProps> = ({
  activity,
  size = 'md',
  className = '',
}) => {
  const meta = getActivityMeta(activity);
  const { lang } = useI18n();
  const label = lang === 'en' ? meta.labelEn : meta.labelFr;

  return (
    <span
      className={`ca-activity-chip ${meta.badgeClass} ${
        size === 'sm' ? 'text-[11px] px-2 py-0.5' : 'text-xs px-2.5 py-1'
      } ${className}`}
      title={`${label} (${meta.shapeName})`}
    >
      <span className="text-[10px] leading-none select-none" aria-hidden="true">
        {meta.shapeChar}
      </span>
      <span>{label}</span>
    </span>
  );
};
