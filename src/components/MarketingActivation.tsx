import React, { useState } from 'react';
import { Shop, MarketingCampaign, MarketingChannel } from '../types';
import { useI18n } from '../utils/i18n';
import { INITIAL_CAMPAIGNS } from '../data/mockData';
import { Button } from './design-system/Button';
import { Field } from './design-system/Field';
import { Mail, MessageSquare, Smartphone, Send, CheckCircle2, Bell, Tag, Users, Calendar, ArrowRight } from 'lucide-react';

interface MarketingActivationProps {
  shop: Shop;
}

export const MarketingActivation: React.FC<MarketingActivationProps> = ({ shop }) => {
  const { lang, t } = useI18n();

  const [campaigns, setCampaigns] = useState<MarketingCampaign[]>(INITIAL_CAMPAIGNS);
  const [title, setTitle] = useState('Saturday Rollout & Fresh Brioche at the Counter');
  const [message, setMessage] = useState(
    `Join our morning session this Saturday! All verified check-ins receive double loyalty points and warm bakery goods at ${shop.name}. Rollout at 9:00 sharp.`
  );
  const [channels, setChannels] = useState<MarketingChannel[]>(['email', 'wallet']);
  const [targetAudience, setTargetAudience] = useState<'all' | 'attended' | 'strava'>('all');
  const [perkOffer, setPerkOffer] = useState('Double Loyalty Points + Counter Treat');
  const [activePreviewTab, setActivePreviewTab] = useState<MarketingChannel>('wallet');
  const [isSentToast, setIsSentToast] = useState(false);

  const toggleChannel = (channel: MarketingChannel) => {
    if (channels.includes(channel)) {
      if (channels.length > 1) {
        setChannels(channels.filter((c) => c !== channel));
      }
    } else {
      setChannels([...channels, channel]);
      setActivePreviewTab(channel);
    }
  };

  const handleDispatch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) return;

    const newCampaign: MarketingCampaign = {
      id: `camp-${Date.now()}`,
      shopId: shop.id,
      title,
      message,
      channels,
      targetAudience,
      sentAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      recipientCount: targetAudience === 'all' ? 142 : targetAudience === 'attended' ? 68 : 84,
      openRate: '91%',
      clickRate: '38%',
      perkOffer: perkOffer.trim() || undefined,
    };

    setCampaigns([newCampaign, ...campaigns]);
    setIsSentToast(true);
    setTimeout(() => setIsSentToast(false), 4500);
  };

  return (
    <div className="space-y-8 max-w-5xl">
      {/* Header */}
      <div>
        <h1 className="ca-display-md text-zinc-900">{t.marketingTitle}</h1>
        <p className="ca-body-sm text-zinc-500 mt-0.5">{t.marketingSubtitle}</p>
      </div>

      {isSentToast && (
        <div className="p-4 bg-[#ecfdf5] border border-[#16a34a]/30 rounded-xl flex items-center justify-between text-sm font-semibold text-[#16a34a]">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[#16a34a]" />
            <span>{t.campaignDispatched}</span>
          </div>
          <span className="ca-caption text-[#16a34a]">
            {channels.map((c) => c.toUpperCase()).join(' · ')}
          </span>
        </div>
      )}

      {/* Main 2-Column Grid: Composer + Live Smartphone Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Campaign Composer */}
        <form onSubmit={handleDispatch} className="lg:col-span-7 bg-white p-6 rounded-2xl border border-zinc-200 space-y-5">
          <h2 className="ca-display-sm text-zinc-900">{t.createCampaign}</h2>

          {/* Delivery Channels Selector */}
          <div className="space-y-2">
            <label className="ca-label text-zinc-800">{t.channelsSupported}</label>
            <div className="grid grid-cols-3 gap-2">
              {/* Email */}
              <button
                type="button"
                onClick={() => toggleChannel('email')}
                className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                  channels.includes('email')
                    ? 'border-[#2563eb] bg-[#2563eb]/5 text-zinc-900 font-semibold'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <Mail className={`w-4 h-4 ${channels.includes('email') ? 'text-[#2563eb]' : 'text-zinc-400'}`} />
                <span className="text-xs leading-tight">{t.channelEmail}</span>
              </button>

              {/* SMS */}
              <button
                type="button"
                onClick={() => toggleChannel('sms')}
                className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                  channels.includes('sms')
                    ? 'border-[#2563eb] bg-[#2563eb]/5 text-zinc-900 font-semibold'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <MessageSquare className={`w-4 h-4 ${channels.includes('sms') ? 'text-[#2563eb]' : 'text-zinc-400'}`} />
                <span className="text-xs leading-tight">{t.channelSMS}</span>
              </button>

              {/* Wallet Notification */}
              <button
                type="button"
                onClick={() => toggleChannel('wallet')}
                className={`p-3 rounded-xl border text-left transition flex flex-col gap-1.5 ${
                  channels.includes('wallet')
                    ? 'border-[#2563eb] bg-[#2563eb]/5 text-zinc-900 font-semibold'
                    : 'border-zinc-200 text-zinc-500 hover:border-zinc-300'
                }`}
              >
                <Smartphone className={`w-4 h-4 ${channels.includes('wallet') ? 'text-[#2563eb]' : 'text-zinc-400'}`} />
                <span className="text-xs leading-tight">{t.channelWallet}</span>
              </button>
            </div>
          </div>

          {/* Target Audience */}
          <Field label={t.targetAudienceLabel}>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value as any)}
              className="ca-input text-xs"
            >
              <option value="all">{t.audienceAll} (142 athletes)</option>
              <option value="attended">{t.audiencePastAttendees} (68 athletes)</option>
              <option value="strava">{t.audienceStrava} (84 athletes)</option>
            </select>
          </Field>

          {/* Headline */}
          <Field label={t.campaignTitleLabel}>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="ca-input"
            />
          </Field>

          {/* Message Body */}
          <Field label={t.campaignMessageLabel}>
            <textarea
              rows={4}
              required
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="ca-input text-xs"
            />
          </Field>

          {/* Perk Offer Attached */}
          <Field label={t.perkIncluded} hint={lang === 'en' ? 'Optional incentive to boost counter attendance' : 'Optionnel pour encourager les visites'}>
            <div className="relative">
              <Tag className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
              <input
                type="text"
                placeholder="e.g. Free espresso or 15% discount code"
                value={perkOffer}
                onChange={(e) => setPerkOffer(e.target.value)}
                className="ca-input pl-9 text-xs"
              />
            </div>
          </Field>

          <div className="pt-2">
            <Button variant="cobalt" type="submit" fullWidth className="py-2.5">
              <Send className="w-4 h-4" strokeWidth={2} />
              <span>{t.dispatchNow}</span>
            </Button>
          </div>
        </form>

        {/* Right Column: Live Smartphone Preview */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-3 px-2">
            <span className="ca-label text-zinc-700">{t.phonePreview}</span>
            <div className="flex items-center gap-1 bg-[#f4f4f5] p-0.5 rounded-full text-xs">
              <button
                type="button"
                onClick={() => setActivePreviewTab('wallet')}
                className={`px-2.5 py-1 rounded-full font-medium transition ${
                  activePreviewTab === 'wallet' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500'
                }`}
              >
                Wallet
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('sms')}
                className={`px-2.5 py-1 rounded-full font-medium transition ${
                  activePreviewTab === 'sms' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500'
                }`}
              >
                SMS
              </button>
              <button
                type="button"
                onClick={() => setActivePreviewTab('email')}
                className={`px-2.5 py-1 rounded-full font-medium transition ${
                  activePreviewTab === 'email' ? 'bg-white text-zinc-900 shadow-xs font-semibold' : 'text-zinc-500'
                }`}
              >
                Email
              </button>
            </div>
          </div>

          {/* Smartphone Frame */}
          <div className="w-full max-w-[320px] bg-zinc-900 p-3 rounded-[36px] shadow-2xl border-4 border-zinc-800">
            {/* Phone Screen */}
            <div className="w-full h-[480px] bg-zinc-950 rounded-[26px] overflow-hidden flex flex-col relative text-white">
              {/* iOS Status Bar */}
              <div className="px-5 pt-3 pb-2 flex items-center justify-between text-[11px] font-semibold text-zinc-300">
                <span>9:41</span>
                <div className="w-16 h-3 bg-zinc-800 rounded-full" />
                <span>5G · 100%</span>
              </div>

              {/* Screen Content based on Active Preview Tab */}
              <div className="flex-1 p-3 overflow-y-auto">
                {activePreviewTab === 'wallet' && (
                  /* Lockscreen Wallet Card Push Notification */
                  <div className="space-y-4 pt-8">
                    <div className="text-center space-y-1">
                      <span className="text-3xl font-light tracking-tight text-white/90">9:41</span>
                      <p className="text-[11px] text-zinc-400">Saturday, October 18</p>
                    </div>

                    {/* Apple/Google Wallet Lockscreen Banner */}
                    <div className="bg-zinc-800/90 backdrop-blur-md rounded-2xl p-3 border border-zinc-700/60 shadow-lg space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <div className="w-4 h-4 rounded bg-[#2563eb] text-white flex items-center justify-center text-[9px] font-bold">
                            C
                          </div>
                          <span className="font-semibold text-zinc-200">Apple Wallet · {shop.name}</span>
                        </div>
                        <span className="text-zinc-400 text-[10px]">now</span>
                      </div>

                      <div className="space-y-1">
                        <p className="text-xs font-bold text-white">{title}</p>
                        <p className="text-[11px] text-zinc-300 line-clamp-3 leading-snug">{message}</p>
                      </div>

                      {perkOffer && (
                        <div className="pt-1.5 border-t border-zinc-700 flex items-center gap-1 text-[10px] text-[#f59e0b] font-semibold">
                          <Tag className="w-3 h-3" />
                          <span>{perkOffer}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {activePreviewTab === 'sms' && (
                  /* SMS Messages Screen */
                  <div className="space-y-3 pt-2">
                    <div className="text-center border-b border-zinc-800 pb-2">
                      <div className="w-8 h-8 rounded-full bg-zinc-700 mx-auto flex items-center justify-center font-bold text-xs text-zinc-200">
                        {shop.name.charAt(0)}
                      </div>
                      <span className="text-xs font-semibold text-zinc-300 block mt-1">{shop.name}</span>
                      <span className="text-[10px] text-zinc-500">SMS Verification</span>
                    </div>

                    <div className="space-y-2 pt-2">
                      <div className="bg-zinc-800 text-zinc-200 p-3 rounded-2xl rounded-tl-sm text-xs space-y-1 max-w-[90%]">
                        <p className="font-semibold text-white">{title}</p>
                        <p className="text-[11px] leading-relaxed text-zinc-300">{message}</p>
                        {perkOffer && (
                          <div className="mt-1.5 p-1.5 bg-zinc-700/60 rounded text-[10px] text-[#fbbf24] font-medium">
                            Perk: {perkOffer}
                          </div>
                        )}
                        <span className="text-[9px] text-zinc-400 block text-right pt-0.5">9:41 AM</span>
                      </div>
                    </div>
                  </div>
                )}

                {activePreviewTab === 'email' && (
                  /* Email Newsletter Screen */
                  <div className="bg-white text-zinc-900 rounded-xl p-3 space-y-2 text-xs">
                    <div className="border-b border-zinc-200 pb-1.5 text-[10px] text-zinc-500">
                      <span>From: {shop.name} &lt;info@{shop.name.toLowerCase().replace(/\s+/g, '')}.cc&gt;</span>
                    </div>

                    <h4 className="font-bold text-zinc-900 text-sm leading-snug">{title}</h4>
                    <p className="text-zinc-600 text-[11px] leading-relaxed whitespace-pre-line">{message}</p>

                    {perkOffer && (
                      <div className="p-2 rounded-lg bg-[#f4f4f5] border border-zinc-200 text-[10px] font-semibold text-zinc-800">
                        🎁 Attached Perk: {perkOffer}
                      </div>
                    )}

                    <div className="pt-2">
                      <button type="button" className="w-full py-1.5 bg-[#2563eb] text-white text-[11px] font-bold rounded-lg">
                        View Community Session
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* iOS Home Indicator Bar */}
              <div className="pb-2 pt-1 flex justify-center">
                <div className="w-32 h-1 bg-zinc-700 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Campaign History Log */}
      <div className="space-y-3 pt-4 border-t border-zinc-200">
        <h3 className="ca-display-sm text-zinc-900">{t.campaignHistory}</h3>
        <div className="border border-zinc-200 rounded-2xl overflow-hidden bg-white">
          <table className="ca-data-table">
            <thead>
              <tr>
                <th>{t.campaignTitleLabel}</th>
                <th>{t.channelsSupported}</th>
                <th>{t.targetAudienceLabel}</th>
                <th>{t.recipients}</th>
                <th>{t.openRate}</th>
                <th>{t.sentOn}</th>
              </tr>
            </thead>
            <tbody>
              {campaigns.map((camp) => (
                <tr key={camp.id}>
                  <td>
                    <span className="font-semibold text-zinc-900 block">{camp.title}</span>
                    {camp.perkOffer && (
                      <span className="text-[11px] text-[#d97706] font-medium">
                        {camp.perkOffer}
                      </span>
                    )}
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      {camp.channels.map((ch) => (
                        <span
                          key={ch}
                          className="ca-caption bg-[#f4f4f5] px-1.5 py-0.5 rounded text-zinc-600 font-bold uppercase text-[9px]"
                        >
                          {ch}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="text-xs text-zinc-600 capitalize">{camp.targetAudience}</td>
                  <td className="text-xs font-semibold text-zinc-900">{camp.recipientCount}</td>
                  <td>
                    <span className="ca-status-badge ca-status-success">{camp.openRate}</span>
                  </td>
                  <td className="text-xs text-zinc-500">{camp.sentAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
