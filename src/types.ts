export type ActivityType = 'run' | 'ride' | 'social' | 'wellness';
export type SportType = 'cycling' | 'running' | 'social' | 'wellness';

export type Level = 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';

export interface LoyaltyTier {
  id: string;
  name: string;
  nameFr: string;
  pointsRequired: number;
  description: string;
  descriptionFr: string;
}

export interface LoyaltyConfig {
  enabled: boolean;
  pointsPerCheckin: number;
  currencyName: string;
  currencyNameFr: string;
  tiers: LoyaltyTier[];
}

export interface Shop {
  id: string;
  name: string;
  category: 'café' | 'bakery' | 'clothing' | 'club';
  location: string;
  address: string;
  lat: number;
  lng: number;
  logoUrl?: string;
  verified: boolean;
  memberCount: number;
  rating: number;
  activeRidesCount: number;
  weeklyRedemptions: number;
  uniqueVisitorsThisMonth: number;
  loyaltyConfig?: LoyaltyConfig;
}

export interface StravaActivity {
  id: string;
  title: string;
  sport: 'ride' | 'run';
  distanceKm: number;
  elevationMeters: number;
  movingTimeMinutes: number;
  avgSpeedKmh?: number;
  avgPaceMinKm?: string;
  date: string;
  stravaUrl?: string;
}

export interface StravaProfile {
  connected: boolean;
  athleteId?: string;
  username?: string;
  avatarUrl?: string;
  verifiedLevel: Level;
  calculatedRule: string;
  calculatedRuleFr: string;
  totalDistanceKm: number;
  totalActivitiesCount: number;
  lastSyncDate?: string;
  recentActivities: StravaActivity[];
}

export interface RegisteredRider {
  id: string;
  name: string;
  email: string;
  phone: string; // Name, Email, Number
  level: Level;
  ridesAttended: number;
  registeredAt: string;
  lastVisit?: string;
  checkedIn: boolean;
  avatarUrl?: string;
  stravaConnected?: boolean;
  stravaProfile?: StravaProfile;
}

export interface Ride {
  id: string;
  shopId: string;
  shopName: string;
  shopCategory: 'café' | 'bakery' | 'clothing' | 'club';
  shopLocation: string;
  title: string;
  titleFr: string;
  activity: ActivityType;
  sport: SportType;
  date: string;
  time: string;
  distanceKm: number;
  level: Level;
  maxSpots: number;
  currentSpots: number;
  lat: number;
  lng: number;
  meetingPoint: string;
  description: string;
  descriptionFr: string;
  pace: string;
  elevationGain: number; // in meters
  registeredRiders: RegisteredRider[];
  heroImage?: string;
}

export type MarketingChannel = 'email' | 'sms' | 'wallet';

export interface MarketingCampaign {
  id: string;
  shopId: string;
  title: string;
  message: string;
  channels: MarketingChannel[];
  targetAudience: 'all' | 'attended' | 'strava' | 'inactive';
  sentAt: string;
  recipientCount: number;
  openRate?: string;
  clickRate?: string;
  perkOffer?: string;
}

export interface PeriodAnalytics {
  periodLabel: string;
  assistants: number;
  sessionsCreated: number;
  uniqueVisitors: number;
}

// 4 Analytical Blocks Types
export interface AudienceGenderData {
  menPct: number;
  womenPct: number;
  undisclosedPct: number;
}

export interface AudienceAgeBracket {
  range: string;
  count: number;
  percentage: number;
}

export interface AudienceLevelItem {
  level: Level;
  count: number;
  percentage: number;
  colorHex: string;
}

export interface PostalDistrictItem {
  district: string;
  postalCode: string;
  name: string;
  count: number;
  percentage: number;
}

export interface BrandItem {
  name: string;
  sharePct: number;
  count: number;
  subType?: string;
}

export interface GearAgeItem {
  ageLabel: string;
  count: number;
  sharePct: number;
}

export interface NoShowSessionItem {
  sessionTitle: string;
  registered: number;
  attended: number;
  noShowPct: number;
}

export interface HeatmapSlot {
  day: string; // Mon, Tue, etc.
  slot: 'morning' | 'noon' | 'evening';
  slotLabel: string;
  turnoutIntensity: number; // 0 to 100
  avgAttendees: number;
}

export interface CohortRetentionItem {
  cohortName: string;
  initialSize: number;
  day30ReturnPct: number;
  day60ReturnPct: number;
}

export interface FrequencyBucket {
  bucketLabel: string;
  riderCount: number;
  percentage: number;
}

export interface InactiveRider {
  id: string;
  name: string;
  email: string;
  phone: string;
  daysInactive: number;
  lastSession: string;
  lifetimeSessions: number;
}
