import React, { createContext, useContext, useState } from 'react';

export type Language = 'en' | 'fr';

export interface Translations {
  // Brand & Nav
  appName: string;
  appTagline: string;
  launchCity: string;
  findSessions: string;
  mySessions: string;
  loyaltyAndPerks: string;
  merchantDashboard: string;
  athleteView: string;
  map: string;
  home: string;
  calendarTitle: string;
  allWeek: string;
  nextRollout: string;
  loyaltyBalance: string;
  stravaSync: string;
  boutiquePulse: string;
  viewMap: string;
  hideMap: string;
  thisWeekSessionsTitle: string;

  // Merchant tabs
  overview: string;
  sessionsTable: string;
  attendeesCRM: string;
  marketingActivation: string;
  createEvent: string;
  walkInQR: string;
  announcements: string;

  // 4 Analytics Blocks (Merchant Overview)
  blockAudienceTitle: string;
  blockEquipmentTitle: string;
  blockParticipationTitle: string;
  blockRetentionTitle: string;

  // Block 1: Audience
  genderBreakdown: string;
  genderMen: string;
  genderWomen: string;
  genderUndisclosed: string;
  genderDecision: string;
  ageDistribution: string;
  ageDecision: string;
  fitnessLevels: string;
  fitnessDecision: string;
  parisDistricts: string;
  districtsDecision: string;

  // Block 2: Equipment
  bikeBrands: string;
  bikeDecision: string;
  shoeBrands: string;
  shoeDecision: string;
  gearVintage: string;
  gearVintageDecision: string;

  // Block 3: Participation
  noShowTitle: string;
  noShowDecision: string;
  occupancyHeatmapTitle: string;
  occupancyDecision: string;
  newVsReturningTitle: string;
  newVsReturningDecision: string;
  firstTimers: string;
  returningAthletes: string;

  // Block 4: Retention
  cohortRetentionTitle: string;
  cohortDecision: string;
  frequencyDistributionTitle: string;
  frequencyDecision: string;
  inactiveRidersTitle: string;
  inactiveDecision: string;
  sendReactivationPerk: string;
  daysInactive: (days: number) => string;

  // Analytics & Graphs
  attendanceComparison: string;
  previousAssistants: string;
  sessionsCreated: string;
  uniqueVisitors: string;
  weeklyView: string;
  monthlyView: string;
  attendanceRate: string;
  activeSessions: string;
  weeklyAttendees: string;
  turnoutEfficiency: string;

  // Attendees CRM Columns
  columnName: string;
  columnEmail: string;
  columnPhone: string;
  columnSessions: string;
  columnStrava: string;
  columnLevel: string;
  columnHistory: string;
  columnStatus: string;
  columnActions: string;
  stravaConnected: string;
  stravaNotLinked: string;
  lastVisit: string;

  // Strava Feature
  stravaTitle: string;
  stravaSubtitle: string;
  connectStrava: string;
  disconnectStrava: string;
  syncStravaNow: string;
  stravaSyncing: string;
  stravaVerifiedLevel: string;
  automaticVerificationRule: string;
  recentSyncedActivities: string;
  noStravaActivities: string;
  viewOnStrava: string;

  // Loyalty Module
  loyaltyTitle: string;
  loyaltySubtitle: string;
  storePoints: string;
  pointsAccumulated: (pts: number) => string;
  noLoyaltyOffered: string;
  rewardTiers: string;
  nextRewardAt: (pts: number) => string;
  redeemAtCounter: string;
  showLoyaltyPass: string;
  pointsHistory: string;
  pointsEarnedPerCheckin: (pts: number) => string;
  counterPerksUnlocked: string;

  // Marketing Activation
  marketingTitle: string;
  marketingSubtitle: string;
  createCampaign: string;
  dispatchNow: string;
  campaignDispatched: string;
  channelsSupported: string;
  channelEmail: string;
  channelSMS: string;
  channelWallet: string;
  campaignTitleLabel: string;
  campaignMessageLabel: string;
  targetAudienceLabel: string;
  audienceAll: string;
  audiencePastAttendees: string;
  audienceStrava: string;
  audienceInactive: string;
  phonePreview: string;
  walletNotificationPreview: string;
  smsPreview: string;
  emailPreview: string;
  campaignHistory: string;
  sentOn: string;
  recipients: string;
  openRate: string;
  perkIncluded: string;

  // General Buttons & Actions
  joinRun: string;
  joinRide: string;
  joinSession: string;
  leaveSession: string;
  saveChanges: string;
  checkIn: string;
  checkedIn: string;
  exportCSV: string;
  scanCode: string;
  sendUpdate: string;
  backToSessions: string;
  filterBy: string;
  allActivities: string;
  allLevels: string;
  spotsLeft: (spots: number) => string;
  redemptionsThisWeek: (count: number) => string;
  totalAttendees: string;
  confirmedRoster: string;
  walkInPass: string;

  // Activity labels
  run: string;
  ride: string;
  social: string;
  wellness: string;

  // Levels
  beginner: string;
  intermediate: string;
  advanced: string;
  expert: string;

  // Form labels
  eventTitle: string;
  activityType: string;
  dateAndTime: string;
  distance: string;
  meetingLocation: string;
  capacity: string;
  descriptionLabel: string;
  paceLabel: string;
  elevationLabel: string;
  publishEventSubmit: string;
  successCreated: string;

  // Registration modal
  registerForSession: string;
  yourName: string;
  yourEmail: string;
  yourPhone: string;
  yourPaceLevel: string;
  confirmSpot: string;
  registrationSuccess: string;
  passInfo: string;

  // Search
  searchPlaceholder: string;
}

export const DICTIONARY: Record<Language, Translations> = {
  en: {
    appName: 'Community App',
    appTagline: 'Weekly rides, runs and sessions in Paris',
    launchCity: 'Paris',
    findSessions: 'Find sessions',
    mySessions: 'My sessions',
    loyaltyAndPerks: 'Loyalty & perks',
    merchantDashboard: 'Merchant dashboard',
    athleteView: 'Athlete view',
    map: 'Map',
    home: 'Home',
    calendarTitle: 'Weekly schedule',
    allWeek: 'All week',
    nextRollout: 'Next rollout',
    loyaltyBalance: 'Loyalty perks',
    stravaSync: 'Strava activity',
    boutiquePulse: 'Paris community',
    viewMap: 'Map',
    hideMap: 'Hide map',
    thisWeekSessionsTitle: 'This week’s sessions',

    overview: 'Overview',
    sessionsTable: 'Sessions',
    attendeesCRM: 'Attendees',
    marketingActivation: 'Marketing activation',
    createEvent: 'Create event',
    walkInQR: 'Walk-in QR',
    announcements: 'Announcements',

    blockAudienceTitle: 'Audience Profile',
    blockEquipmentTitle: 'Equipment & Brands',
    blockParticipationTitle: 'Attendance & No-shows',
    blockRetentionTitle: 'Retention & Cohorts',

    genderBreakdown: 'Audience gender distribution',
    genderMen: 'Men',
    genderWomen: 'Women',
    genderUndisclosed: 'Undisclosed',
    genderDecision: 'Action for host: Adapt ride pace formats, communication tone and boutique apparel sizing.',
    ageDistribution: 'Age distribution brackets',
    ageDecision: 'Action for host: Optimize rollout times (early mornings vs. evenings) to fit member work schedules.',
    fitnessLevels: 'Declared fitness level distribution',
    fitnessDecision: 'Action for host: Right-size pace groups and recruit appropriate ride leaders.',
    parisDistricts: 'Neighborhood & postal code density',
    districtsDecision: 'Action for host: Identify neighborhood origins to target hyper-local boutique marketing.',

    bikeBrands: 'Top bike brands & types (Road / Gravel / MTB)',
    bikeDecision: 'Action for host: Tune workshop spare parts, stocking bidons/tubes, and brand co-sponsorships.',
    shoeBrands: 'Running shoe brands ranking',
    shoeDecision: 'Action for host: Partner with brands for shoe demo shakeout test runs.',
    gearVintage: 'Gear vintage & purchase age',
    gearVintageDecision: 'Action for host: Anticipate customer replacement windows and upgrade trade-in promotions.',

    noShowTitle: 'Registered vs. confirmed check-ins (no-show rate)',
    noShowDecision: 'Action for host: Adjust capacity buffer and refine cancellation lead times.',
    occupancyHeatmapTitle: 'Session occupancy heatmap by day & time',
    occupancyDecision: 'Action for host: Program high-demand slots and avoid scheduling dead periods.',
    newVsReturningTitle: 'First-timers vs. returning athletes',
    newVsReturningDecision: 'Action for host: Gauge whether weekly sessions consistently attract fresh customers.',
    firstTimers: 'First-time athletes',
    returningAthletes: 'Returning members',

    cohortRetentionTitle: 'Cohort retention (% returning at 30 & 60 days)',
    cohortDecision: 'Action for host: Detect where drop-off occurs after first-time trial check-ins.',
    frequencyDistributionTitle: 'Average visit frequency distribution',
    frequencyDecision: 'Action for host: Identify core ambassadors and reward frequent ambassadors.',
    inactiveRidersTitle: 'Inactive athletes (> 30 days)',
    inactiveDecision: 'Action for host: Re-engage dormant athletes with targeted counter perks before they churn.',
    sendReactivationPerk: 'Send VIP perk',
    daysInactive: (d: number) => `Inactive for ${d} days`,

    attendanceComparison: 'Turnout vs sessions created',
    previousAssistants: 'Attendees checked-in',
    sessionsCreated: 'Sessions hosted',
    uniqueVisitors: 'Unique visitors',
    weeklyView: 'Weekly',
    monthlyView: 'Monthly',
    attendanceRate: 'Attendance rate',
    activeSessions: 'Active sessions',
    weeklyAttendees: 'Weekly check-ins',
    turnoutEfficiency: 'Average turnout per session',

    columnName: 'Name',
    columnEmail: 'Email',
    columnPhone: 'Number',
    columnSessions: 'Sessions',
    columnStrava: 'Strava',
    columnLevel: 'Level',
    columnHistory: 'History',
    columnStatus: 'Status',
    columnActions: 'Actions',
    stravaConnected: 'Connected',
    stravaNotLinked: 'Not linked',
    lastVisit: 'Last visit',

    stravaTitle: 'Strava activity tracking & verification',
    stravaSubtitle: 'Connect Strava to automatically sync your group rides and verify your pace tier.',
    connectStrava: 'Connect with Strava',
    disconnectStrava: 'Disconnect Strava',
    syncStravaNow: 'Sync activities',
    stravaSyncing: 'Syncing with Strava...',
    stravaVerifiedLevel: 'Strava Verified Level',
    automaticVerificationRule: 'Calculated from 12 recent rides with average speed > 29 km/h over 60+ km.',
    recentSyncedActivities: 'Recent synced Strava sessions',
    noStravaActivities: 'No Strava activities found yet. Connect account to sync.',
    viewOnStrava: 'View on Strava',

    loyaltyTitle: 'Boutique loyalty points',
    loyaltySubtitle: 'Earn points at participating cafés, bakeries and stores every time you show up.',
    storePoints: 'Points balance',
    pointsAccumulated: (pts: number) => `${pts} points`,
    noLoyaltyOffered: 'Store does not offer loyalty points',
    rewardTiers: 'Available perks & tiers',
    nextRewardAt: (pts: number) => `${pts} pts for next reward`,
    redeemAtCounter: 'Redeem at counter',
    showLoyaltyPass: 'Show loyalty stamp pass',
    pointsHistory: 'Points earned history',
    pointsEarnedPerCheckin: (pts: number) => `+${pts} pts per confirmed check-in`,
    counterPerksUnlocked: 'Perk ready to redeem',

    marketingTitle: 'Marketing activations',
    marketingSubtitle: 'Send targeted promotions, event invites and announcements via Email, SMS and Mobile Wallet.',
    createCampaign: 'Compose activation',
    dispatchNow: 'Send activation',
    campaignDispatched: 'Campaign dispatched to athletes',
    channelsSupported: 'Delivery channels',
    channelEmail: 'Email blast',
    channelSMS: 'SMS text message',
    channelWallet: 'Phone Wallet card notification',
    campaignTitleLabel: 'Headline / subject',
    campaignMessageLabel: 'Message content',
    targetAudienceLabel: 'Target audience',
    audienceAll: 'All boutique members',
    audiencePastAttendees: 'Athletes who checked in (past 30 days)',
    audienceStrava: 'Strava connected members',
    audienceInactive: 'Dormant members (> 30 days inactive)',
    phonePreview: 'Mobile device preview',
    walletNotificationPreview: 'Lockscreen Wallet card alert',
    smsPreview: 'SMS notification',
    emailPreview: 'Email newsletter layout',
    campaignHistory: 'Sent activations history',
    sentOn: 'Sent on',
    recipients: 'Recipients',
    openRate: 'Open rate',
    perkIncluded: 'Special perk attached',

    joinRun: 'Join run',
    joinRide: 'Join ride',
    joinSession: 'Join session',
    leaveSession: 'Leave session',
    saveChanges: 'Save changes',
    checkIn: 'Check in',
    checkedIn: 'Checked in',
    exportCSV: 'Export list',
    scanCode: 'Verify pass',
    sendUpdate: 'Send notice',
    backToSessions: 'Back to sessions',
    filterBy: 'Filter sessions',
    allActivities: 'All activities',
    allLevels: 'All levels',
    spotsLeft: (n: number) => `${n} spots left`,
    redemptionsThisWeek: (n: number) => `${n} redemptions this week`,
    totalAttendees: 'Total attendees',
    confirmedRoster: 'Confirmed roster',
    walkInPass: 'Check-in pass',

    run: 'Run',
    ride: 'Ride',
    social: 'Social',
    wellness: 'Wellness',

    beginner: 'Beginner',
    intermediate: 'Intermediate',
    advanced: 'Advanced',
    expert: 'Expert',

    eventTitle: 'Event title',
    activityType: 'Activity',
    dateAndTime: 'Date and time',
    distance: 'Distance (km)',
    meetingLocation: 'Meeting location',
    capacity: 'Roster cap',
    descriptionLabel: 'Brief briefing',
    paceLabel: 'Target pace',
    elevationLabel: 'Elevation gain (m)',
    publishEventSubmit: 'Create event',
    successCreated: 'Event published',

    registerForSession: 'Join session',
    yourName: 'Your name',
    yourEmail: 'Your email',
    yourPhone: 'Your phone number',
    yourPaceLevel: 'Your fitness level',
    confirmSpot: 'Confirm spot',
    registrationSuccess: 'You are on the list',
    passInfo: 'Show this pass when you arrive at the counter.',

    searchPlaceholder: 'Search sessions by venue, street or keyword',
  },
  fr: {
    appName: 'Community App',
    appTagline: 'Les sorties, courses et sessions de la semaine à Paris',
    launchCity: 'Paris',
    findSessions: 'Trouver des sessions',
    mySessions: 'Mes sessions',
    loyaltyAndPerks: 'Fidélité & avantages',
    merchantDashboard: 'Tableau de bord',
    athleteView: 'Vue athlète',
    map: 'Carte',
    home: 'Accueil',
    calendarTitle: 'Planning de la semaine',
    allWeek: 'Toute la semaine',
    nextRollout: 'Prochaine sortie',
    loyaltyBalance: 'Avantages fidélité',
    stravaSync: 'Activité Strava',
    boutiquePulse: 'Communauté Paris',
    viewMap: 'Carte',
    hideMap: 'Masquer la carte',
    thisWeekSessionsTitle: 'Les sessions de la semaine',

    overview: 'Aperçu',
    sessionsTable: 'Sessions',
    attendeesCRM: 'Participants',
    marketingActivation: 'Activations marketing',
    createEvent: 'Créer un événement',
    walkInQR: 'QR d’accueil',
    announcements: 'Annonces',

    blockAudienceTitle: 'Profil de l’audience',
    blockEquipmentTitle: 'Équipement & Marques',
    blockParticipationTitle: 'Participations & Présence',
    blockRetentionTitle: 'Rétention & Cohortes',

    genderBreakdown: 'Répartition par genre',
    genderMen: 'Hommes',
    genderWomen: 'Femmes',
    genderUndisclosed: 'Non déclaré',
    genderDecision: 'Décision commerçant : Adapter le rythme des sorties, le ton et les tailles textiles.',
    ageDistribution: 'Pyramide des âges',
    ageDecision: 'Décision commerçant : Choisir les bons créneaux horaires (matin tôt vs soirée).',
    fitnessLevels: 'Répartition des niveaux déclarés',
    fitnessDecision: 'Décision commerçant : Dimensionner les groupes de niveau et encadrants.',
    parisDistricts: 'Densité par arrondissement / code postal',
    districtsDecision: 'Décision commerçant : Savoir d’où viennent les sportifs et cibler la communication locale.',

    bikeBrands: 'Marques et types de vélos (Route / Gravel / VTT)',
    bikeDecision: 'Décision commerçant : Gérer l’atelier, les consommables (chambres, bidons) et partenariats.',
    shoeBrands: 'Marques de chaussures de course',
    shoeDecision: 'Décision commerçant : Organiser des sessions de test de chaussures avec les marques.',
    gearVintage: 'Ancienneté du matériel',
    gearVintageDecision: 'Décision commerçant : Détecter la fenêtre de renouvellement pour des offres de reprise.',

    noShowTitle: 'Inscrits vs. présents réels (taux de no-show)',
    noShowDecision: 'Décision commerçant : Ajuster la surréservation et les règles d’annulation.',
    occupancyHeatmapTitle: 'Taux de présence par jour et heure',
    occupancyDecision: 'Décision commerçant : Programmer les créneaux les plus porteurs et éviter les heures creuses.',
    newVsReturningTitle: 'Nouveaux vs. participants réguliers',
    newVsReturningDecision: 'Décision commerçant : Mesurer si les sorties attirent continuellement de nouveaux clients.',
    firstTimers: 'Nouveaux participants',
    returningAthletes: 'Habitués',

    cohortRetentionTitle: 'Rétention de cohortes (% revenant à 30 et 60 jours)',
    cohortDecision: 'Décision commerçant : Identifier quand se produit l’attrition après la première venue.',
    frequencyDistributionTitle: 'Fréquence moyenne de participation',
    frequencyDecision: 'Décision commerçant : Identifier le noyau dur et valoriser les membres fidèles.',
    inactiveRidersTitle: 'Athlètes inactifs (> 30 jours)',
    inactiveDecision: 'Décision commerçant : Relancer les membres dormants avec une offre comptoir avant leur départ.',
    sendReactivationPerk: 'Envoyer un pass privilège',
    daysInactive: (d: number) => `Inactif depuis ${d} jours`,

    attendanceComparison: 'Présences vs sessions créées',
    previousAssistants: 'Participants présents',
    sessionsCreated: 'Sessions organisées',
    uniqueVisitors: 'Visiteurs uniques',
    weeklyView: 'Hebdomadaire',
    monthlyView: 'Mensuel',
    attendanceRate: 'Taux de présence',
    activeSessions: 'Sessions actives',
    weeklyAttendees: 'Arrivées de la semaine',
    turnoutEfficiency: 'Présence moyenne par session',

    columnName: 'Nom',
    columnEmail: 'E-mail',
    columnPhone: 'Numéro',
    columnSessions: 'Sessions',
    columnStrava: 'Strava',
    columnLevel: 'Niveau',
    columnHistory: 'Historique',
    columnStatus: 'Statut',
    columnActions: 'Actions',
    stravaConnected: 'Connecté',
    stravaNotLinked: 'Non lié',
    lastVisit: 'Dernière venue',

    stravaTitle: 'Suivi Strava & certification de niveau',
    stravaSubtitle: 'Connectez Strava pour synchroniser automatiquement vos sorties et certifier votre allure.',
    connectStrava: 'Se connecter avec Strava',
    disconnectStrava: 'Déconnecter Strava',
    syncStravaNow: 'Synchroniser',
    stravaSyncing: 'Synchronisation en cours...',
    stravaVerifiedLevel: 'Niveau certifié Strava',
    automaticVerificationRule: 'Calculé à partir de 12 sorties récentes avec moyenne > 29 km/h sur plus de 60 km.',
    recentSyncedActivities: 'Dernières activités synchronisées',
    noStravaActivities: 'Aucune activité Strava. Connectez votre compte.',
    viewOnStrava: 'Voir sur Strava',

    loyaltyTitle: 'Fidélité des boutiques',
    loyaltySubtitle: 'Cumulez des points dans les cafés, boulangeries et boutiques partenaires à chaque présence.',
    storePoints: 'Solde de points',
    pointsAccumulated: (pts: number) => `${pts} points`,
    noLoyaltyOffered: 'L’établissement ne propose pas de programme de fidélité',
    rewardTiers: 'Récompenses et paliers',
    nextRewardAt: (pts: number) => `${pts} pts avant la prochaine récompense`,
    redeemAtCounter: 'Utiliser au comptoir',
    showLoyaltyPass: 'Afficher la carte de tampons',
    pointsHistory: 'Historique des points',
    pointsEarnedPerCheckin: (pts: number) => `+${pts} pts par présence validée`,
    counterPerksUnlocked: 'Avantage débloqué',

    marketingTitle: 'Activations marketing',
    marketingSubtitle: 'Diffusez des promotions ciblées et invitations par e-mail, SMS et notifications Wallet sur téléphone.',
    createCampaign: 'Créer une activation',
    dispatchNow: 'Diffuser l’activation',
    campaignDispatched: 'Campagne diffusée aux athlètes',
    channelsSupported: 'Canaux de diffusion',
    channelEmail: 'Envoi e-mail',
    channelSMS: 'Message SMS',
    channelWallet: 'Notification Wallet sur téléphone',
    campaignTitleLabel: 'Titre / objet',
    campaignMessageLabel: 'Message de l’activation',
    targetAudienceLabel: 'Audience ciblée',
    audienceAll: 'Tous les membres',
    audiencePastAttendees: 'Participants venus ces 30 derniers jours',
    audienceStrava: 'Membres connectés à Strava',
    audienceInactive: 'Membres inactifs (> 30 jours)',
    phonePreview: 'Aperçu sur téléphone',
    walletNotificationPreview: 'Alerte pass Wallet sur écran verrouillé',
    smsPreview: 'Aperçu SMS',
    emailPreview: 'Mise en page e-mail',
    campaignHistory: 'Historique des activations',
    sentOn: 'Envoyé le',
    recipients: 'Destinataires',
    openRate: 'Taux d’ouverture',
    perkIncluded: 'Avantage spécial inclus',

    joinRun: 'Rejoindre la course',
    joinRide: 'Rejoindre la sortie',
    joinSession: 'Rejoindre',
    leaveSession: 'Se désinscrire',
    saveChanges: 'Enregistrer',
    checkIn: 'Valider l’arrivée',
    checkedIn: 'Validé',
    exportCSV: 'Exporter la liste',
    scanCode: 'Vérifier le pass',
    sendUpdate: 'Envoyer l’avis',
    backToSessions: 'Retour aux sessions',
    filterBy: 'Filtrer les sessions',
    allActivities: 'Toutes les activités',
    allLevels: 'Tous les niveaux',
    spotsLeft: (n: number) => `${n} places restantes`,
    redemptionsThisWeek: (n: number) => `${n} validations cette semaine`,
    totalAttendees: 'Total participants',
    confirmedRoster: 'Liste confirmée',
    walkInPass: 'Pass d’arrivée',

    run: 'Course',
    ride: 'Sortie vélo',
    social: 'Café social',
    wellness: 'Récupération',

    beginner: 'Débutant',
    intermediate: 'Intermédiaire',
    advanced: 'Avancé',
    expert: 'Expert',

    eventTitle: 'Titre de l’événement',
    activityType: 'Activité',
    dateAndTime: 'Date et heure',
    distance: 'Distance (km)',
    meetingLocation: 'Lieu de rendez-vous',
    capacity: 'Jauge maximale',
    descriptionLabel: 'Description',
    paceLabel: 'Allure visée',
    elevationLabel: 'Dénivelé positif (m)',
    publishEventSubmit: 'Créer un événement',
    successCreated: 'Événement publié',

    registerForSession: 'Rejoindre la session',
    yourName: 'Votre nom',
    yourEmail: 'Votre e-mail',
    yourPhone: 'Votre numéro de téléphone',
    yourPaceLevel: 'Votre niveau',
    confirmSpot: 'Confirmer la place',
    registrationSuccess: 'Vous êtes inscrit',
    passInfo: 'Présentez ce pass au comptoir à votre arrivée.',

    searchPlaceholder: 'Rechercher par lieu, rue ou mot-clé',
  },
};

interface I18nContextValue {
  lang: Language;
  setLang: (lang: Language) => void;
  t: Translations;
  dual: (enStr: string, frStr: string) => string;
}

export const I18nContext = createContext<I18nContextValue>({
  lang: 'en',
  setLang: () => {},
  t: DICTIONARY.en,
  dual: (enStr) => enStr,
});

export const useI18n = () => useContext(I18nContext);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>('en');

  const dual = (enStr: string, frStr: string) => {
    return lang === 'en' ? enStr : frStr;
  };

  return React.createElement(
    I18nContext.Provider,
    { value: { lang, setLang, t: DICTIONARY[lang], dual } },
    children
  );
};
