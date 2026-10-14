# Athlete Home Redesign with Colored Metric Blocks, Interactive Calendar & Streamlined Map

Redesign the athlete discovery and home experience into an engaging, visual athlete hub featuring colorful modular blocks (Sun, Sky, Blush, Cobalt), an interactive weekly calendar day-picker, seamless placement of the week's sessions below, and simplified "Map" navigation.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were clarified in Phase 1 and guide this implementation:

- **Confirmed Color Palette**: The modular dashboard blocks utilize the established design system palette tokens:
  - **Sun (Amber/Gold)**: Weekly goal progress, active training streak, and high-energy encouragement.
  - **Sky (Azure/Cyan)**: Loyalty point tally across Paris boutique partners with quick redemption shortcut.
  - **Blush (Coral/Rose)**: Strava verified athletic pace, category level (Intermediate/Advanced), and verified segment speed.
  - **Cobalt (Electric Blue)**: Next confirmed upcoming session countdown pass with one-click venue directions and ticket QR.
- **Confirmed Layout Adaptability**: Responsive layout that presents a dynamic Bento-style multi-column grid on desktop (1440px / `max-w-7xl`) and stacks seamlessly into ergonomic touch blocks with a sticky horizontal date scroller on mobile.
- **Confirmed Navigation & Naming**: Rename all instances of "Paris map" to simply "Map" (and "Carte" in French), positioning "This week's sessions" directly below the colored blocks and calendar strip.

---

## 1. Overview & Core Concept

- **What It Does**: Transforms the athlete screen into a vibrant home dashboard that greets the athlete by name, presents their vital community metrics at a glance through colored Bento blocks, provides an interactive 7-day calendar selector to filter rides by day, and displays the week's sessions with clear visual hierarchy, quick-booking actions, and a full interactive map toggle.
- **Target Audience / Persona**: Amateur cyclists, runners, and social sport enthusiasts in Paris looking for club rides, bakery coffee spins, and track workouts hosted by local independent boutiques.
- **Key Value**: Replaces a plain session list with an athlete-centric home base that boosts engagement, surfaces personal achievements and loyalty rewards, and makes discovering daily sessions intuitive.

---

## 2. User Experience & Visual Design

### Key User Flows

1. **Athlete Home Landing**:
   - The athlete lands on the Athlete Home screen with a warm greeting ("Bonjour, Antoine") and their current verified Strava status.
   - Four color-accented blocks immediately communicate their active streak (Sun), loyalty points balance (Sky), Strava verified pace/level (Blush), and next confirmed session countdown (Cobalt).
2. **Calendar Day Selection**:
   - Above the sessions list, an interactive weekly calendar scroller presents the current week's days (e.g., Mon 13, Tue 14, Wed 15...).
   - Days with active group rides display subtle activity dots. Clicking a day highlights it and smoothly filters "This week's sessions" to events on that date, with an "All week" reset option.
3. **Session Discovery & Quick Registration**:
   - Sessions appear directly beneath the calendar in single-column or dual-column cards showing venue branding, distance, speed, spots remaining, and a full-width booking button.
4. **Map View Toggle ("Map")**:
   - Athletes can toggle between the "List" view and the redesigned "Map" view using a clean segmented control in the section header, seamlessly switching to an interactive Leaflet Google Maps styled view of Paris meeting spots.

### Visual Identity & Theme

- **Aesthetic Direction**: High-energy athletic editorial style with clean structural surfaces, high-contrast typography, and purposeful color blocking.
- **Color Distribution (60-30-10 Rule)**:
  - **60% Dominant Canvas**: Pure white surface (`#ffffff`) and crisp off-white (`#fafafa` / `#f4f4f5`).
  - **30% Structural Surfaces**: Clean 1px borders (`#e4e4e7`), neutral container cards, and charcoal typography (`#09090b`).
  - **10% High-Intent Colored Blocks**:
    - **Sun Block**: `bg-amber-500/10 text-amber-950 border border-amber-500/25` with warm amber accents.
    - **Sky Block**: `bg-sky-500/10 text-sky-950 border border-sky-500/25` with vivid cyan badges.
    - **Blush Block**: `bg-rose-500/10 text-rose-950 border border-rose-500/25` with coral/rose highlights.
    - **Cobalt Block**: `bg-blue-600 text-white shadow-md` as the dominant hero anchor card.
- **Typography & Hierarchy**:
  - Headings & Big Stat Numbers: `Fugaz One` / `ca-display-lg` and `ca-stat` for bold athletic presence.
  - Body & Metadata: `Work Sans` (`ca-body`, `ca-caption`) with tabular numbers (`tabular-nums`) for distances, dates, and times.
- **Mobile Ergonomics**:
  - Touch targets $\ge 44\text{px}$ across all calendar buttons and filter chips.
  - Horizontal calendar day strip with momentum scrolling on mobile devices.

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Modular Bento Colored Blocks vs. Monochromatic Cards**
  - *Chosen Approach*: Distinct colored cards utilizing Sun, Sky, Blush, and Cobalt tokens with high contrast text and dark/light pairings.
  - *Why*: Delivers the requested visual richness and at-a-glance legibility without visual chaos, differentiating distinct functional areas (upcoming ride vs. loyalty vs. Strava pace).
  - *Alternative Considered*: Plain gray cards with small colored tags was rejected as too sterile and not matching the requested colored blocks visual style.
- **Decision 2: Interactive Date Picker vs. Static List**
  - *Chosen Approach*: 7-day interactive horizontal date strip with session indicator indicators that dynamically filters sessions by day.
  - *Why*: Allows athletes to answer "What can I join tomorrow or on Saturday morning?" in a single tap without tedious multi-dropdown filtering.
- **Decision 3: "Map" Naming Harmonization**
  - *Chosen Approach*: Rename all "Paris map" tabs, buttons, and references to "Map" (and "Carte" in French), unifying the navbar and in-page view toggle.

---

## 4. Technical Architecture & Data Strategy

### Component Hierarchy & Interaction Flow

```
┌────────────────────────────────────────────────────────────────────────┐
│                               App.tsx                                  │
│   (Role: Rider | Shop, State: rides, shops, userProfile, stravaProfile)│
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                  ┌─────────────────┴─────────────────┐
                  ▼                                   ▼
        ┌──────────────────┐               ┌──────────────────┐
        │    Navbar.tsx    │               │  ShopDashboard   │
        │  (Tabs: Map,     │               │  (Merchant CRM,  │
        │   Loyalty, etc.) │               │   Overview, etc.)│
        └─────────┬────────┘               └──────────────────┘
                  │
                  ▼
        ┌──────────────────────────────────────────────────────┐
        │                  RiderDiscover.tsx                   │
        │ ┌──────────────────────────────────────────────────┐ │
        │ │ 1. Athlete Hero Header & Quick Profile Greet     │ │
        │ ├──────────────────────────────────────────────────┤ │
        │ │ 2. Colored Bento Blocks Grid                     │ │
        │ │    - Cobalt: Next Upcoming Meet Countdown Card   │ │
        │ │    - Sun: Weekly Streak & Km Progress Card       │ │
        │ │    - Sky: Paris Loyalty Points Balance & Perks   │ │
        │ │    - Blush: Strava Verified Pace & Level Badge   │ │
        │ ├──────────────────────────────────────────────────┤ │
        │ │ 3. Interactive Weekly Calendar Strip             │ │
        │ │    [All] [Mon 13] [Tue 14] [Wed 15] [Thu 16] ... │ │
        │ ├──────────────────────────────────────────────────┤ │
        │ │ 4. This Week's Sessions Header & View Switcher   │ │
        │ │    - Activity chips (Run / Ride / Social)        │ │
        │ │    - View Switch: [List] | [Map]                 │ │
        │ ├──────────────────────────────────────────────────┤ │
        │ │ 5. Content Area                                  │ │
        │ │    - If List: Filtered EventCard list            │ │
        │ │    - If Map: Full MapComponent with venues       │ │
        │ └──────────────────────────────────────────────────┘ │
        └──────────────────────────────────────────────────────┘
```

### State Management & Props Flow

- `selectedDate`: String (`'all'` or ISO date `YYYY-MM-DD`) managed in `RiderDiscover.tsx`, updated by clicking calendar days.
- `selectedActivity` & `selectedLevel`: Filters combining with `selectedDate` to compute `filteredRides`.
- `stravaProfile` & `userProfile`: Passed to `RiderDiscover.tsx` to populate the Blush (verified pace/level) and Cobalt (next registered meet) blocks.
- `viewMode`: Toggled between `'list'` and `'map'`.
- `i18n.ts`: Updated translations for `mapTab`, `thisWeeksSessions`, `calendarAllWeek`, `nextMeet`, `trainingStreak`, `loyaltyPointsBalance`, and `stravaVerifiedPace`.

---

## 5. Verification & Testing Steps

1. **Compilation Check**: Run `compile_applet` to ensure zero TypeScript errors or missing imports.
2. **Visual Block Verification**: Verify all 4 colored blocks (Cobalt, Sun, Sky, Blush) render with proper padding, readable contrast, and interactive click-throughs (e.g. clicking Loyalty jumps to loyalty tab).
3. **Calendar Interactivity**: Click various calendar days to verify sessions are filtered correctly; click "All Week" to restore the complete list.
4. **Map Renaming & Toggle**: Confirm "Map" replaces "Paris map" in the view switcher and navigation, and clicking "Map" displays the interactive Leaflet map with venue markers.
5. **Bilingual Toggle**: Toggle between EN and FR in the navbar to confirm all new strings and labels localize cleanly.
