import React, { useState } from 'react';
import { Ride, Level } from '../types';
import { useI18n } from '../utils/i18n';
import { formatSessionDate, formatDistance } from '../utils/helpers';
import { QRCodeDisplay } from './QRCodeDisplay';
import { Button } from './design-system/Button';
import { Field } from './design-system/Field';
import { X, Check } from 'lucide-react';

interface RegistrationModalProps {
  ride: Ride;
  isOpen: boolean;
  onClose: () => void;
  onConfirmRegistration: (name: string, email: string, phone: string, level: Level) => void;
}

export const RegistrationModal: React.FC<RegistrationModalProps> = ({
  ride,
  isOpen,
  onClose,
  onConfirmRegistration,
}) => {
  const { lang, t } = useI18n();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+33 6 ');
  const [level, setLevel] = useState<Level>(ride.level);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [ticketId, setTicketId] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    onConfirmRegistration(name, email, phone, level);
    const passCode = `PARIS-${ride.id.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
    setTicketId(passCode);
    setIsConfirmed(true);
  };

  const title = lang === 'fr' && ride.titleFr ? ride.titleFr : ride.title;
  const formattedDate = formatSessionDate(ride.date, ride.time);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs">
      <div className="relative w-full max-w-md bg-white border border-zinc-200 rounded-2xl p-6 ca-shadow-float space-y-5">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-zinc-900 rounded-full hover:bg-zinc-100 transition"
          aria-label="Close"
        >
          <X className="w-5 h-5" strokeWidth={2} />
        </button>

        {!isConfirmed ? (
          /* Step 1: Registration Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <span className="ca-caption text-zinc-500 uppercase tracking-widest block mb-0.5">
                {ride.shopName} · {ride.shopLocation}
              </span>
              <h2 className="ca-display-md text-zinc-900 leading-tight">
                {t.registerForSession}
              </h2>
              <p className="ca-caption text-zinc-500 mt-1">
                {title} · {formattedDate}
              </p>
            </div>

            <Field label={t.yourName}>
              <input
                type="text"
                required
                placeholder="e.g. Jean Dupont"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="ca-input"
              />
            </Field>

            <Field label={t.yourEmail}>
              <input
                type="email"
                required
                placeholder="e.g. jean@paris.fr"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="ca-input"
              />
            </Field>

            <Field label={t.yourPhone} hint={lang === 'en' ? 'For check-in verification and SMS announcements' : 'Pour la vérification et alertes SMS'}>
              <input
                type="tel"
                required
                placeholder="+33 6 12 34 56 78"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="ca-input font-mono"
              />
            </Field>

            <Field label={t.yourPaceLevel}>
              <select
                value={level}
                onChange={(e) => setLevel(e.target.value as Level)}
                className="ca-input"
              >
                <option value="Beginner">{t.beginner}</option>
                <option value="Intermediate">{t.intermediate}</option>
                <option value="Advanced">{t.advanced}</option>
                <option value="Expert">{t.expert}</option>
              </select>
            </Field>

            <div className="pt-2">
              <Button variant="cobalt" type="submit" fullWidth>
                {t.confirmSpot}
              </Button>
            </div>
          </form>
        ) : (
          /* Step 2: Confirmation & Pass */
          <div className="space-y-4 text-center">
            <div className="w-12 h-12 mx-auto rounded-full bg-[#ecfdf5] text-[#16a34a] flex items-center justify-center">
              <Check className="w-6 h-6" strokeWidth={2.5} />
            </div>

            <div>
              <h2 className="ca-display-md text-zinc-900">
                {t.registrationSuccess}
              </h2>
              <p className="ca-body-sm text-zinc-600 mt-1">
                {t.passInfo}
              </p>
            </div>

            {/* Check-in Pass Card */}
            <div className="p-4 rounded-xl border border-zinc-200 bg-[#f4f4f5] flex flex-col items-center">
              <span className="ca-caption text-zinc-500 uppercase tracking-widest">{t.walkInPass}</span>
              <span className="font-mono text-sm font-semibold text-zinc-900 my-1">{ticketId}</span>

              <div className="p-3 bg-white rounded-lg border border-zinc-200 my-2">
                <QRCodeDisplay value={ticketId} size={150} />
              </div>

              <span className="ca-caption font-semibold text-zinc-900">{name}</span>
              <span className="ca-caption text-zinc-500">{phone}</span>
              <span className="ca-caption text-zinc-500">{title}</span>
              <span className="ca-caption text-zinc-500">{formattedDate}</span>
            </div>

            <Button variant="quiet" fullWidth onClick={onClose}>
              {lang === 'en' ? 'Done' : 'Fermer'}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
