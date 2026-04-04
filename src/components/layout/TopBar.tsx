import { useState, useRef, useEffect } from 'react';
import {
  Search, Bell, HelpCircle, ChevronDown, Plus,
  BookOpen, FileText, HeadphonesIcon, MessageSquare,
  CheckCircle2, AlertTriangle, Send, PenLine, ExternalLink,
  X, Rocket, Star, Zap, Shield,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// ─── Notification data ──────────────────────────────────────────────────────

const notifications = [
  {
    id: 1,
    type: 'signed',
    title: 'Contract signed',
    description: 'Master Service Agreement was signed by Rachel Morrison',
    time: '2 hours ago',
    read: false,
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
    iconBg: 'bg-emerald-50',
  },
  {
    id: 2,
    type: 'reminder',
    title: 'Signature reminder sent',
    description: 'Automatic reminder sent to David Park for Employment Contract',
    time: '4 hours ago',
    read: false,
    icon: Send,
    iconColor: 'text-ocean-500',
    iconBg: 'bg-ocean-50',
  },
  {
    id: 3,
    type: 'expiring',
    title: 'Contract expiring soon',
    description: 'Freelancer Services Agreement with Lena Kovacs expires in 11 days',
    time: '1 day ago',
    read: false,
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
    iconBg: 'bg-amber-50',
  },
  {
    id: 4,
    type: 'comment',
    title: 'Comment added',
    description: 'Sarah Chen commented on Marketing Partnership Agreement',
    time: '1 day ago',
    read: true,
    icon: MessageSquare,
    iconColor: 'text-violet-500',
    iconBg: 'bg-violet-50',
  },
  {
    id: 5,
    type: 'draft',
    title: 'Draft needs attention',
    description: 'Consulting Engagement Letter has been idle for 3 days',
    time: '2 days ago',
    read: true,
    icon: PenLine,
    iconColor: 'text-slate-400',
    iconBg: 'bg-slate-50',
  },
];

// ─── Component ──────────────────────────────────────────────────────────────

export default function TopBar() {
  const [searchFocused, setSearchFocused] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [readIds, setReadIds] = useState<Set<number>>(new Set(notifications.filter((n) => n.read).map((n) => n.id)));
  const [helpModal, setHelpModal] = useState<'help-center' | 'docs' | 'feedback' | 'whats-new' | null>(null);
  const [feedbackForm, setFeedbackForm] = useState({ name: 'Sarah Chen', email: 'sarah@company.com', message: '' });
  const [feedbackSent, setFeedbackSent] = useState(false);
  const navigate = useNavigate();

  const helpRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (helpRef.current && !helpRef.current.contains(e.target as Node)) setShowHelp(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setShowNotifications(false);
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setShowHelp(false);
        setShowNotifications(false);
        setShowUserMenu(false);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const unreadCount = notifications.filter((n) => !readIds.has(n.id)).length;

  function markAllRead() {
    setReadIds(new Set(notifications.map((n) => n.id)));
  }

  function markRead(id: number) {
    setReadIds((prev) => new Set([...prev, id]));
  }

  return (
    <header className="h-[64px] bg-white border-b border-slate-200/80 flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Search */}
      <div className={`relative transition-all duration-200 ${searchFocused ? 'w-[400px]' : 'w-[320px]'}`}>
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          placeholder="Search contracts, templates, contacts..."
          className="w-full h-9 pl-9 pr-4 bg-slate-50 border border-slate-200 rounded-lg text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-400 focus:bg-white transition-all"
          onFocus={() => setSearchFocused(true)}
          onBlur={() => setSearchFocused(false)}
        />
        <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-medium text-slate-400 bg-white border border-slate-200 px-1.5 py-0.5 rounded">
          /
        </kbd>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/ai-generator')}
          className="flex items-center gap-2 h-9 px-4 bg-ocean-600 hover:bg-ocean-700 text-white text-[13px] font-medium rounded-lg transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Contract
        </button>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* ── Help ────────────────────────────────────────────────── */}
        <div className="relative" ref={helpRef}>
          <button
            onClick={() => { setShowHelp(!showHelp); setShowNotifications(false); setShowUserMenu(false); }}
            aria-label="Help"
            aria-expanded={showHelp}
            className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              showHelp ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <HelpCircle className="w-[18px] h-[18px]" strokeWidth={1.75} />
          </button>

          {showHelp && (
            <div className="absolute right-0 top-full mt-1.5 w-56 bg-white rounded-xl border border-slate-200 shadow-dropdown py-1.5 z-50" role="menu">
              <div className="px-3 py-2 border-b border-slate-100 mb-1">
                <p className="text-[12px] font-semibold text-slate-500 uppercase tracking-wider">Help & Support</p>
              </div>
              {([
                { label: 'Help Center', icon: HelpCircle, desc: 'Browse guides & FAQs', action: () => { setShowHelp(false); setHelpModal('help-center'); } },
                { label: 'Documentation', icon: BookOpen, desc: 'API docs & references', action: () => { setShowHelp(false); setHelpModal('docs'); } },
                { label: 'Contact Support', icon: HeadphonesIcon, desc: 'Get help from our team', action: () => { setShowHelp(false); window.location.href = 'mailto:webuildcraft@gmail.com?subject=' + encodeURIComponent('Contract Ocean Support Request'); } },
                { label: 'Share Feedback', icon: MessageSquare, desc: 'Tell us how to improve', action: () => { setShowHelp(false); setFeedbackSent(false); setFeedbackForm((f) => ({ ...f, message: '' })); setHelpModal('feedback'); } },
              ] as const).map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.label}
                    role="menuitem"
                    tabIndex={0}
                    onClick={item.action}
                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); item.action(); } }}
                    className="w-full text-left px-3 py-2.5 flex items-start gap-3 hover:bg-slate-50 focus:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 focus-visible:ring-inset transition-colors group cursor-pointer"
                  >
                    <div className="w-7 h-7 rounded-lg bg-slate-50 group-hover:bg-slate-100 group-focus:bg-slate-100 flex items-center justify-center shrink-0 mt-0.5 transition-colors">
                      <Icon className="w-3.5 h-3.5 text-slate-500" />
                    </div>
                    <div>
                      <p className="text-[13px] font-medium text-slate-700">{item.label}</p>
                      <p className="text-[11px] text-slate-400">{item.desc}</p>
                    </div>
                  </button>
                );
              })}
              <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-2">
                <button
                  role="menuitem"
                  tabIndex={0}
                  onClick={() => { setShowHelp(false); setHelpModal('whats-new'); }}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowHelp(false); setHelpModal('whats-new'); } }}
                  className="flex items-center gap-1.5 text-[12px] font-medium text-ocean-600 hover:text-ocean-700 focus:outline-none focus-visible:ring-2 focus-visible:ring-ocean-500 rounded transition-colors cursor-pointer"
                >
                  What&rsquo;s new
                  <ExternalLink className="w-3 h-3" />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* ── Notifications ──────────────────────────────────────── */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setShowNotifications(!showNotifications); setShowHelp(false); setShowUserMenu(false); }}
            aria-label="Notifications"
            aria-expanded={showNotifications}
            className={`relative w-9 h-9 flex items-center justify-center rounded-lg transition-colors cursor-pointer ${
              showNotifications ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:bg-slate-50 hover:text-slate-600'
            }`}
          >
            <Bell className="w-[18px] h-[18px]" strokeWidth={1.75} />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-ocean-500 rounded-full ring-2 ring-white" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 top-full mt-1.5 w-[380px] bg-white rounded-xl border border-slate-200 shadow-dropdown z-50 overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <h3 className="text-[14px] font-semibold text-slate-900">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="text-[11px] font-semibold bg-ocean-100 text-ocean-700 px-1.5 py-0.5 rounded-full">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllRead}
                    className="text-[12px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Notification list */}
              <div className="max-h-[400px] overflow-y-auto">
                {notifications.map((notif) => {
                  const Icon = notif.icon;
                  const isUnread = !readIds.has(notif.id);
                  return (
                    <button
                      key={notif.id}
                      onClick={() => { markRead(notif.id); setShowNotifications(false); navigate('/contracts'); }}
                      className={`w-full text-left flex items-start gap-3 px-4 py-3.5 transition-colors border-b border-slate-50 last:border-0 ${
                        isUnread ? 'bg-ocean-50/30 hover:bg-ocean-50/50' : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${notif.iconBg} flex items-center justify-center shrink-0 mt-0.5`}>
                        <Icon className={`w-4 h-4 ${notif.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className={`text-[13px] font-medium truncate ${isUnread ? 'text-slate-900' : 'text-slate-700'}`}>
                            {notif.title}
                          </p>
                          {isUnread && <span className="w-1.5 h-1.5 bg-ocean-500 rounded-full shrink-0" />}
                        </div>
                        <p className="text-[12px] text-slate-500 mt-0.5 line-clamp-1">{notif.description}</p>
                        <p className="text-[11px] text-slate-400 mt-1">{notif.time}</p>
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Footer */}
              <div className="border-t border-slate-100 px-4 py-2.5">
                <button
                  onClick={() => { setShowNotifications(false); navigate('/contracts'); }}
                  className="w-full text-center text-[12px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors py-1"
                >
                  View all activity
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200 mx-1" />

        {/* ── User menu ──────────────────────────────────────────── */}
        <div className="relative">
          <button
            onClick={() => { setShowUserMenu(!showUserMenu); setShowHelp(false); setShowNotifications(false); }}
            className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-ocean-400 to-ocean-600 rounded-full flex items-center justify-center">
              <span className="text-[12px] font-semibold text-white">SC</span>
            </div>
            <div className="flex flex-col items-start">
              <span className="text-[13px] font-medium text-slate-700 leading-tight">Sarah Chen</span>
              <span className="text-[11px] text-slate-400 leading-tight">Admin</span>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>

          {showUserMenu && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowUserMenu(false)} />
              <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl border border-slate-200 shadow-dropdown py-1.5 z-50">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-[13px] font-medium text-slate-700">Sarah Chen</p>
                  <p className="text-[12px] text-slate-400">sarah@company.com</p>
                </div>
                <button className="w-full text-left px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors" onClick={() => { setShowUserMenu(false); navigate('/settings'); }}>Your profile</button>
                <button className="w-full text-left px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors" onClick={() => { setShowUserMenu(false); navigate('/settings'); }}>Settings</button>
                <button className="w-full text-left px-3 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors" onClick={() => { setShowUserMenu(false); navigate('/billing'); }}>Billing</button>
                <div className="border-t border-slate-100 mt-1 pt-1">
                  <button className="w-full text-left px-3 py-2 text-[13px] text-red-600 hover:bg-red-50 transition-colors" onClick={() => { setShowUserMenu(false); navigate('/login'); }}>Sign out</button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* Help Modals                                                     */}
      {/* ═══════════════════════════════════════════════════════════════ */}

      {/* ── Help Center Modal ────────────────────────────────────────── */}
      {helpModal === 'help-center' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-ocean-50 flex items-center justify-center">
                  <HelpCircle className="w-4 h-4 text-ocean-600" />
                </div>
                <h2 className="text-[16px] font-semibold text-slate-900">Help Center</h2>
              </div>
              <button onClick={() => setHelpModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
              {[
                { q: 'How do I create a new contract?', a: 'Click "New Contract" in the top bar, or navigate to AI Generator to create one with AI assistance. You can also start from a template in the Template Library.' },
                { q: 'How do I send a contract for signature?', a: 'Open any contract in the Editor, then click "Send for Signature". You\'ll go through a 4-step flow: add recipients, place signature fields, compose a message, and review before sending.' },
                { q: 'Can I track who has signed?', a: 'Yes. Go to the Contracts page and filter by "Awaiting Signature". Each contract shows the signature status (e.g., "1 of 2 signed") and who is still pending.' },
                { q: 'How do I manage my team?', a: 'Go to Settings → Team Members. You can invite new members, assign roles (Admin, Manager, Member), and manage permissions.' },
                { q: 'Are e-signatures legally binding?', a: 'Yes. Under the ESIGN Act (US), eIDAS (EU), and equivalent legislation in 180+ countries, electronic signatures carry the same legal weight as wet-ink signatures.' },
                { q: 'How do I set up auto-reminders?', a: 'Go to Settings → Signature Settings → Signing Preferences. Enable auto-reminders and choose the frequency (e.g., every 3 days).' },
              ].map((item, idx) => (
                <details key={idx} className="group rounded-lg border border-slate-200 overflow-hidden">
                  <summary className="flex items-center justify-between px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors text-[13px] font-medium text-slate-700 list-none">
                    {item.q}
                    <ChevronDown className="w-4 h-4 text-slate-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
                  </summary>
                  <div className="px-4 pb-3 text-[13px] text-slate-500 leading-relaxed border-t border-slate-100 pt-3">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
            <div className="px-6 py-4 border-t border-slate-200 bg-slate-25 flex items-center justify-between">
              <p className="text-[12px] text-slate-400">Can&rsquo;t find what you need?</p>
              <button
                onClick={() => { setHelpModal(null); window.location.href = 'mailto:webuildcraft@gmail.com?subject=' + encodeURIComponent('Contract Ocean Support Request'); }}
                className="text-[12px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors"
              >
                Contact Support →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Documentation Modal ──────────────────────────────────────── */}
      {helpModal === 'docs' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-violet-50 flex items-center justify-center">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                </div>
                <h2 className="text-[16px] font-semibold text-slate-900">Documentation</h2>
              </div>
              <button onClick={() => setHelpModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
              {[
                { title: 'Getting Started', desc: 'Quick setup guide for new users', icon: Rocket, color: 'bg-emerald-50 text-emerald-600' },
                { title: 'Contract Management', desc: 'Create, edit, and manage contracts', icon: FileText, color: 'bg-ocean-50 text-ocean-600' },
                { title: 'Templates & AI', desc: 'Use templates and AI-powered generation', icon: Zap, color: 'bg-violet-50 text-violet-600' },
                { title: 'E-Signatures', desc: 'Send, sign, and track signatures', icon: PenLine, color: 'bg-amber-50 text-amber-600' },
                { title: 'Team & Permissions', desc: 'Manage users, roles, and access', icon: Shield, color: 'bg-pink-50 text-pink-600' },
                { title: 'API Reference', desc: 'REST API endpoints and webhooks', icon: BookOpen, color: 'bg-slate-100 text-slate-600' },
              ].map((doc) => {
                const Icon = doc.icon;
                return (
                  <button
                    key={doc.title}
                    onClick={() => setHelpModal(null)}
                    className="w-full flex items-center gap-3.5 p-3.5 rounded-lg border border-slate-200 hover:border-slate-300 hover:shadow-sm transition-all text-left group cursor-pointer"
                  >
                    <div className={`w-10 h-10 rounded-lg ${doc.color} flex items-center justify-center shrink-0`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">{doc.title}</p>
                      <p className="text-[12px] text-slate-400">{doc.desc}</p>
                    </div>
                    <ChevronDown className="w-4 h-4 text-slate-300 -rotate-90 shrink-0" />
                  </button>
                );
              })}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-25 text-center">
              <p className="text-[12px] text-slate-400">Full documentation available at docs.contractocean.com</p>
            </div>
          </div>
        </div>
      )}

      {/* ── Share Feedback Modal ──────────────────────────────────────── */}
      {helpModal === 'feedback' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                </div>
                <h2 className="text-[16px] font-semibold text-slate-900">Share Feedback</h2>
              </div>
              <button onClick={() => setHelpModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {feedbackSent ? (
              <div className="p-8 text-center">
                <div className="mx-auto mb-4 w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-emerald-600" />
                </div>
                <h3 className="text-[16px] font-semibold text-slate-900">Thank you!</h3>
                <p className="mt-2 text-[13px] text-slate-500">Your feedback has been sent to our team. We&rsquo;ll review it and get back to you if needed.</p>
                <button
                  onClick={() => setHelpModal(null)}
                  className="mt-6 px-5 py-2 text-[13px] font-medium text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="p-6 space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Name</label>
                    <input
                      type="text"
                      value={feedbackForm.name}
                      onChange={(e) => setFeedbackForm((f) => ({ ...f, name: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      value={feedbackForm.email}
                      onChange={(e) => setFeedbackForm((f) => ({ ...f, email: e.target.value }))}
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Your Feedback</label>
                    <textarea
                      value={feedbackForm.message}
                      onChange={(e) => setFeedbackForm((f) => ({ ...f, message: e.target.value }))}
                      rows={4}
                      placeholder="Tell us what you think, suggest a feature, or report a bug..."
                      className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
                    />
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-25">
                  <button onClick={() => setHelpModal(null)} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
                  <button
                    disabled={!feedbackForm.message.trim()}
                    onClick={() => {
                      // Payload ready for webuildcraft@gmail.com
                      // TODO: Wire to backend email service
                      void { to: 'webuildcraft@gmail.com', from: feedbackForm.email, name: feedbackForm.name, message: feedbackForm.message };
                      setFeedbackSent(true);
                    }}
                    className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Send Feedback
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ── What's New Modal ──────────────────────────────────────────── */}
      {helpModal === 'whats-new' && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-400 to-violet-500 flex items-center justify-center">
                  <Star className="w-4 h-4 text-white" />
                </div>
                <h2 className="text-[16px] font-semibold text-slate-900">What&rsquo;s New</h2>
              </div>
              <button onClick={() => setHelpModal(null)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-6 space-y-5 max-h-[60vh] overflow-y-auto">
              {[
                { version: 'v2.4', date: 'Mar 18, 2026', title: 'AI Contract Intelligence', desc: 'Dashboard now features AI-powered insights including renewal risk detection, signature bottleneck alerts, and proactive draft recommendations.', tag: 'New', tagColor: 'bg-emerald-50 text-emerald-700' },
                { version: 'v2.3', date: 'Mar 10, 2026', title: 'Interactive Contract Editor', desc: 'Edit contracts inline with contentEditable sections, AI rewrite tools on text selection, and one-click clause insertion.', tag: 'Improved', tagColor: 'bg-ocean-50 text-ocean-700' },
                { version: 'v2.2', date: 'Mar 3, 2026', title: 'Smart Contact Tags', desc: 'Contacts are now automatically tagged as "Frequent signer", "High value", or "Delayed signer" based on their behavior.', tag: 'New', tagColor: 'bg-emerald-50 text-emerald-700' },
                { version: 'v2.1', date: 'Feb 24, 2026', title: 'Drag & Drop Signature Fields', desc: 'Place signature, date, and name fields directly onto contract documents with full drag-and-drop support.', tag: 'Improved', tagColor: 'bg-ocean-50 text-ocean-700' },
                { version: 'v2.0', date: 'Feb 15, 2026', title: 'Template Preview & Setup', desc: 'Preview full contract templates before using them, with editable variables and contact selection in the setup flow.', tag: 'Major', tagColor: 'bg-violet-50 text-violet-700' },
              ].map((update, idx) => (
                <div key={idx} className="relative pl-6 border-l-2 border-slate-200 pb-1">
                  <div className="absolute -left-[5px] top-1 w-2 h-2 rounded-full bg-slate-300" />
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[11px] font-semibold text-slate-400">{update.version} &middot; {update.date}</span>
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${update.tagColor}`}>{update.tag}</span>
                  </div>
                  <h4 className="text-[13px] font-semibold text-slate-800">{update.title}</h4>
                  <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{update.desc}</p>
                </div>
              ))}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-25 text-center">
              <button onClick={() => setHelpModal(null)} className="text-[13px] font-medium text-ocean-600 hover:text-ocean-700 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
