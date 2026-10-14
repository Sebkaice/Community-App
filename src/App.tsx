import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { RiderDiscover } from './components/RiderDiscover';
import { RideDetail } from './components/RideDetail';
import { RegistrationModal } from './components/RegistrationModal';
import { RiderProfile } from './components/RiderProfile';
import { AthleteLoyalty } from './components/AthleteLoyalty';
import { ShopDashboard } from './components/ShopDashboard';
import { INITIAL_RIDES, INITIAL_SHOPS, INITIAL_STRAVA_PROFILE } from './data/mockData';
import { Ride, Level, Shop, StravaProfile } from './types';
import { I18nProvider } from './utils/i18n';

export default function App() {
  // Global State
  const [rides, setRides] = useState<Ride[]>(INITIAL_RIDES);
  const [shops] = useState<Shop[]>(INITIAL_SHOPS);
  const [currentRole, setCurrentRole] = useState<'rider' | 'shop'>('rider');

  // Navigation state
  const [activeRiderTab, setActiveRiderTab] = useState<'home' | 'map' | 'profile' | 'my-rides' | 'loyalty'>('home');
  const [activeShopTab, setActiveShopTab] = useState<'overview' | 'sessions' | 'crm' | 'marketing' | 'publish' | 'qr' | 'promo'>('overview');
  const [selectedRide, setSelectedRide] = useState<Ride | null>(null);

  // User Registration & Strava State
  const [registeredRideIds, setRegisteredRideIds] = useState<string[]>(['session-1']);
  const [stravaProfile, setStravaProfile] = useState<StravaProfile>(INITIAL_STRAVA_PROFILE);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; phone: string; level: Level }>({
    name: 'Antoine Moreau',
    email: 'antoine@peloton.fr',
    phone: '+33 6 12 34 56 78',
    level: INITIAL_STRAVA_PROFILE.verifiedLevel,
  });

  // Modal State
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [targetRegisterRide, setTargetRegisterRide] = useState<Ride | null>(null);

  // Handlers
  const handleSelectRide = (ride: Ride) => {
    setSelectedRide(ride);
  };

  const handleOpenRegister = (ride: Ride) => {
    setTargetRegisterRide(ride);
    setIsRegisterModalOpen(true);
  };

  const handleConfirmRegistration = (name: string, email: string, phone: string, level: Level) => {
    if (!targetRegisterRide) return;

    setUserProfile({ name, email, phone, level });

    setRides((prevRides) =>
      prevRides.map((r) => {
        if (r.id === targetRegisterRide.id) {
          const exists = r.registeredRiders.some((item) => item.email.toLowerCase() === email.toLowerCase());
          if (exists) return r;

          const newRider = {
            id: `r-new-${Date.now()}`,
            name,
            email,
            phone,
            level,
            ridesAttended: 1,
            registeredAt: new Date().toISOString().split('T')[0],
            lastVisit: new Date().toISOString().split('T')[0],
            checkedIn: false,
            stravaConnected: true,
          };

          return {
            ...r,
            currentSpots: Math.min(r.maxSpots, r.currentSpots + 1),
            registeredRiders: [newRider, ...r.registeredRiders],
          };
        }
        return r;
      })
    );

    if (!registeredRideIds.includes(targetRegisterRide.id)) {
      setRegisteredRideIds((prev) => [...prev, targetRegisterRide.id]);
    }

    if (selectedRide && selectedRide.id === targetRegisterRide.id) {
      setSelectedRide((prev) => (prev ? { ...prev, currentSpots: prev.currentSpots + 1 } : null));
    }
  };

  const handleCancelRegistration = (rideId: string) => {
    setRegisteredRideIds((prev) => prev.filter((id) => id !== rideId));
    setRides((prevRides) =>
      prevRides.map((r) => {
        if (r.id === rideId) {
          return {
            ...r,
            currentSpots: Math.max(0, r.currentSpots - 1),
            registeredRiders: r.registeredRiders.filter((item) => item.email !== userProfile.email),
          };
        }
        return r;
      })
    );
  };

  const handlePublishRide = (newRideData: Omit<Ride, 'id' | 'currentSpots' | 'registeredRiders'>) => {
    const newRide: Ride = {
      ...newRideData,
      id: `session-${Date.now()}`,
      currentSpots: 1,
      registeredRiders: [
        {
          id: `r-host`,
          name: `${newRideData.shopName} Lead`,
          email: `lead@${newRideData.shopName.toLowerCase().replace(/\s+/g, '')}.cc`,
          phone: '+33 6 99 88 77 66',
          level: newRideData.level,
          ridesAttended: 24,
          registeredAt: new Date().toISOString().split('T')[0],
          lastVisit: new Date().toISOString().split('T')[0],
          checkedIn: true,
          stravaConnected: true,
        },
      ],
    };

    setRides((prev) => [newRide, ...prev]);
  };

  const handleCheckInRider = (rideId: string, riderId: string) => {
    setRides((prev) =>
      prev.map((r) => {
        if (r.id === rideId) {
          return {
            ...r,
            registeredRiders: r.registeredRiders.map((rider) =>
              rider.id === riderId ? { ...rider, checkedIn: !rider.checkedIn } : rider
            ),
          };
        }
        return r;
      })
    );
  };

  const handleDeleteRide = (rideId: string) => {
    setRides((prev) => prev.filter((r) => r.id !== rideId));
    if (selectedRide?.id === rideId) {
      setSelectedRide(null);
    }
  };

  const myRegisteredRidesList = rides.filter((r) => registeredRideIds.includes(r.id));
  const activeShop = shops[0]; // Café du Cycliste for demo

  return (
    <I18nProvider>
      <div className="min-h-screen bg-white text-[#09090b] flex flex-col font-sans selection:bg-[#2563eb]/20 selection:text-[#1d4ed8]">
        {/* Navigation Header */}
        <Navbar
          currentRole={currentRole}
          onRoleChange={(role) => {
            setCurrentRole(role);
            setSelectedRide(null);
          }}
          activeRiderTab={activeRiderTab}
          onRiderTabChange={(tab) => {
            setActiveRiderTab(tab);
            setSelectedRide(null);
          }}
          activeShopTab={activeShopTab}
          onShopTabChange={(tab) => {
            setActiveShopTab(tab);
            setSelectedRide(null);
          }}
          onQuickPublishClick={() => {
            setCurrentRole('shop');
            setActiveShopTab('publish');
            setSelectedRide(null);
          }}
          myRegistrationsCount={registeredRideIds.length}
        />

        {/* Main Content Router */}
        <main className="flex-1 w-full bg-white">
          {selectedRide ? (
            <RideDetail
              ride={selectedRide}
              shop={shops.find((s) => s.name === selectedRide.shopName || s.id === selectedRide.shopId)}
              isAlreadyRegistered={registeredRideIds.includes(selectedRide.id)}
              onBack={() => setSelectedRide(null)}
              onOpenRegisterModal={() => handleOpenRegister(selectedRide)}
              onViewTicket={() => {
                setCurrentRole('rider');
                setActiveRiderTab('profile');
                setSelectedRide(null);
              }}
            />
          ) : currentRole === 'rider' ? (
            activeRiderTab === 'home' || activeRiderTab === 'map' ? (
              <RiderDiscover
                rides={rides}
                onSelectRide={handleSelectRide}
                onRegisterQuick={handleOpenRegister}
                registeredRideIds={registeredRideIds}
                shops={shops}
                stravaProfile={stravaProfile}
                userName={userProfile.name}
                userLevel={userProfile.level}
                onNavigateToTab={(tab) => {
                  setActiveRiderTab(tab);
                  setSelectedRide(null);
                }}
                initialViewMode={activeRiderTab === 'map' ? 'map' : 'list'}
              />
            ) : activeRiderTab === 'loyalty' ? (
              <AthleteLoyalty
                shops={shops}
                athleteName={userProfile.name}
                athleteEmail={userProfile.email}
                rides={rides}
              />
            ) : activeRiderTab === 'profile' || activeRiderTab === 'my-rides' ? (
              <RiderProfile
                myRegisteredRides={myRegisteredRidesList}
                userEmail={userProfile.email}
                userName={userProfile.name}
                userLevel={userProfile.level}
                stravaProfile={stravaProfile}
                onUpdateStrava={(updated) => {
                  setStravaProfile(updated);
                  if (updated.connected) {
                    setUserProfile((prev) => ({ ...prev, level: updated.verifiedLevel }));
                  }
                }}
                onVerifiedLevelChange={(lvl) => setUserProfile((prev) => ({ ...prev, level: lvl }))}
                onSelectRide={handleSelectRide}
                onCancelRegistration={handleCancelRegistration}
              />
            ) : null
          ) : (
            <ShopDashboard
              shop={activeShop}
              rides={rides}
              activeTab={activeShopTab}
              onTabChange={setActiveShopTab}
              onPublishRide={handlePublishRide}
              onCheckInRider={handleCheckInRider}
              onDeleteRide={handleDeleteRide}
            />
          )}
        </main>

        {/* Registration Modal */}
        {targetRegisterRide && (
          <RegistrationModal
            ride={targetRegisterRide}
            isOpen={isRegisterModalOpen}
            onClose={() => setIsRegisterModalOpen(false)}
            onConfirmRegistration={handleConfirmRegistration}
          />
        )}
      </div>
    </I18nProvider>
  );
}
