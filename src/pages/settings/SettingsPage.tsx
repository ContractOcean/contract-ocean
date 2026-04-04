import { useState, useRef, useCallback } from 'react';
import {
  Building2,
  Palette,
  Users,
  Bell,
  PenTool,
  Scale,
  Puzzle,
  Shield,
  Camera,
  ChevronRight,
  Plus,
  MoreHorizontal,
  Smartphone,
  Monitor,
  LogOut,
  Eye,
  EyeOff,
  X,
  Upload,
  Type,
  Pencil,
  CheckCircle2,
  ShieldCheck,
  FileText,
  AlertCircle,
  Save,
  Trash2,
  User,
  Calendar,
  Briefcase,
} from 'lucide-react';
// Team members — empty for new users, populated from Supabase
const teamMembers: { id: string; name: string; email: string; role: string; contractsOwned: number; lastActive: string }[] = [];

// ─── Tab definitions ─────────────────────────────────────────────────────────

const tabs = [
  { id: 'company', label: 'Company Profile', icon: Building2 },
  { id: 'brand', label: 'Brand Settings', icon: Palette },
  { id: 'team', label: 'Team Members', icon: Users },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'signature', label: 'Signature Settings', icon: PenTool },
  { id: 'legal', label: 'Legal Defaults', icon: Scale },
  { id: 'integrations', label: 'Integrations', icon: Puzzle },
  { id: 'security', label: 'Security', icon: Shield },
] as const;

type TabId = (typeof tabs)[number]['id'];

// ─── Role badge colors ───────────────────────────────────────────────────────

const roleBadge: Record<string, string> = {
  Admin: 'bg-ocean-50 text-ocean-700 border border-ocean-200',
  Manager: 'bg-violet-50 text-violet-700 border border-violet-200',
  Member: 'bg-slate-50 text-slate-600 border border-slate-200',
};

// ─── Toggle switch component ─────────────────────────────────────────────────

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2 ${
        enabled ? 'bg-ocean-500' : 'bg-slate-200'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-card ring-0 transition duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

// ─── Company Profile Panel ───────────────────────────────────────────────────

function CompanyProfilePanel() {
  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Company Profile</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your organization details and public information.</p>
      </div>

      {/* Logo upload */}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-2">Company Logo</label>
        <div className="flex items-center gap-6">
          <div className="flex h-24 w-24 items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 hover:border-ocean-400 hover:bg-ocean-50 transition-colors cursor-pointer">
            <div className="text-center">
              <Camera className="mx-auto h-6 w-6 text-slate-400" />
              <span className="mt-1 block text-xs text-slate-500">Upload logo</span>
            </div>
          </div>
          <div className="text-sm text-slate-500">
            <p>Recommended: 256x256px or larger</p>
            <p>PNG, JPG, or SVG (max 2MB)</p>
          </div>
        </div>
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Name</label>
          <input
            type="text"
            defaultValue="Acme Corporation"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Industry</label>
          <select
            defaultValue="Technology"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
          >
            <option>Technology</option>
            <option>Healthcare</option>
            <option>Finance</option>
            <option>Manufacturing</option>
            <option>Retail</option>
            <option>Legal</option>
            <option>Education</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Company Size</label>
          <select
            defaultValue="50-200"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
          >
            <option>1-10</option>
            <option>11-50</option>
            <option>50-200</option>
            <option>200-500</option>
            <option>500-1000</option>
            <option>1000+</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Website</label>
          <input
            type="url"
            defaultValue="https://acmecorp.com"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Phone</label>
          <input
            type="tel"
            defaultValue="+1 (415) 555-0100"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1.5">Address</label>
          <input
            type="text"
            defaultValue="100 Market Street, Suite 400, San Francisco, CA 94105"
            className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
          />
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-6">
        <button className="rounded-lg bg-ocean-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
          Save Changes
        </button>
      </div>
    </div>
  );
}

// ─── Team Members Panel ──────────────────────────────────────────────────────

function TeamMembersPanel() {
  const [showInvite, setShowInvite] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Team Members</h2>
          <p className="mt-1 text-sm text-slate-500">Manage your team and their roles within Contract Ocean.</p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Invite Member
        </button>
      </div>

      {/* Invite form */}
      {showInvite && (
        <div className="rounded-xl border border-ocean-200 bg-ocean-50 p-4">
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={inviteEmail}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
              />
            </div>
            <div className="w-40">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Role</label>
              <select
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value)}
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
              >
                <option>Admin</option>
                <option>Manager</option>
                <option>Member</option>
              </select>
            </div>
            <button className="rounded-lg bg-ocean-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors">
              Send Invite
            </button>
            <button
              onClick={() => setShowInvite(false)}
              className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-500 hover:text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Team table */}
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-card">
        <table className="min-w-full divide-y divide-slate-200">
          <thead>
            <tr className="bg-slate-50">
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name & Email</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Role</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Contracts Owned</th>
              <th className="px-6 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Last Active</th>
              <th className="px-6 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <tr key={member.id} className="hover:bg-slate-25 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-ocean-100 text-sm font-semibold text-ocean-700">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-slate-900">{member.name}</p>
                      <p className="text-sm text-slate-500">{member.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${roleBadge[member.role] || roleBadge.Member}`}>
                    {member.role}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-600">{member.contractsOwned}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{member.lastActive}</td>
                <td className="px-6 py-4 text-right">
                  <button className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Notifications Panel ─────────────────────────────────────────────────────

function NotificationsPanel() {
  const [prefs, setPrefs] = useState({
    email: true,
    signatureReminders: true,
    contractExpiry: true,
    weeklyDigest: false,
    teamActivity: true,
  });

  const toggle = (key: keyof typeof prefs) => setPrefs((p) => ({ ...p, [key]: !p[key] }));

  const items: { key: keyof typeof prefs; title: string; desc: string }[] = [
    { key: 'email', title: 'Email Notifications', desc: 'Receive email notifications for contract updates and actions.' },
    { key: 'signatureReminders', title: 'Signature Reminders', desc: 'Get reminders when contracts are awaiting your signature.' },
    { key: 'contractExpiry', title: 'Contract Expiry Alerts', desc: 'Be notified 30, 14, and 7 days before contracts expire.' },
    { key: 'weeklyDigest', title: 'Weekly Digest', desc: 'Receive a weekly summary of contract activity and metrics.' },
    { key: 'teamActivity', title: 'Team Activity', desc: 'Get notified when team members create, edit, or sign contracts.' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Notifications</h2>
        <p className="mt-1 text-sm text-slate-500">Choose what notifications you receive and how.</p>
      </div>

      <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-card">
        {items.map((item) => (
          <div key={item.key} className="flex items-center justify-between px-6 py-5">
            <div>
              <p className="text-sm font-medium text-slate-900">{item.title}</p>
              <p className="mt-0.5 text-sm text-slate-500">{item.desc}</p>
            </div>
            <Toggle enabled={prefs[item.key]} onChange={() => toggle(item.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Security Panel ──────────────────────────────────────────────────────────

function SecurityPanel() {
  const [twoFactor, setTwoFactor] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const sessions = [
    { id: 1, device: 'MacBook Pro — Chrome', location: 'San Francisco, CA', icon: Monitor, current: true, lastSeen: 'Active now' },
    { id: 2, device: 'iPhone 15 — Safari', location: 'San Francisco, CA', icon: Smartphone, current: false, lastSeen: '2 hours ago' },
    { id: 3, device: 'Windows PC — Firefox', location: 'New York, NY', icon: Monitor, current: false, lastSeen: '3 days ago' },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">Security</h2>
        <p className="mt-1 text-sm text-slate-500">Manage your account security and active sessions.</p>
      </div>

      {/* Two-factor authentication */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-ocean-50">
              <Shield className="h-5 w-5 text-ocean-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">Two-Factor Authentication</p>
              <p className="text-sm text-slate-500">Add an extra layer of security to your account.</p>
            </div>
          </div>
          <Toggle enabled={twoFactor} onChange={() => setTwoFactor(!twoFactor)} />
        </div>
      </div>

      {/* Active sessions */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Active Sessions</h3>
        <div className="divide-y divide-slate-200 rounded-xl border border-slate-200 bg-white shadow-card">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between px-6 py-4">
              <div className="flex items-center gap-4">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-100">
                  <s.icon className="h-4.5 w-4.5 text-slate-600" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-slate-900">{s.device}</p>
                    {s.current && (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700 border border-emerald-200">
                        Current
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-slate-500">{s.location} &middot; {s.lastSeen}</p>
                </div>
              </div>
              {!s.current && (
                <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm text-red-600 hover:bg-red-50 transition-colors">
                  <LogOut className="h-3.5 w-3.5" />
                  Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Change password */}
      <div>
        <h3 className="text-sm font-semibold text-slate-900 mb-3">Change Password</h3>
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-card space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Current Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 pr-10 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="block w-full rounded-lg border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-ocean-500 focus:ring-1 focus:ring-ocean-500 transition-colors"
            />
          </div>
          <div className="flex justify-end pt-2">
            <button className="rounded-lg bg-ocean-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
              Update Password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Signature Settings Panel ────────────────────────────────────────────────

const SIGNATURE_FONTS = [
  { name: 'Elegant', family: "'Dancing Script', cursive", weight: '400' },
  { name: 'Classic', family: "'Georgia', serif", weight: '400' },
  { name: 'Modern', family: "'Inter', sans-serif", weight: '600' },
  { name: 'Handwritten', family: "'Caveat', cursive", weight: '400' },
];

function SignatureSettingsPanel() {
  // Signature creation
  const [showModal, setShowModal] = useState(false);
  const [sigMode, setSigMode] = useState<'draw' | 'type' | 'upload'>('type');
  const [typedName, setTypedName] = useState('Sarah Chen');
  const [selectedFont, setSelectedFont] = useState(0);
  const [savedSignature, setSavedSignature] = useState<{ mode: string; display: string; font?: string } | null>({
    mode: 'type',
    display: 'Sarah Chen',
    font: SIGNATURE_FONTS[0].family,
  });

  // Drawing
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);

  // Preferences
  const [defaultRole, setDefaultRole] = useState<'Signer' | 'Approver' | 'Viewer'>('Signer');
  const [sequentialSigning, setSequentialSigning] = useState(false);
  const [autoReminders, setAutoReminders] = useState(true);
  const [reminderFreq, setReminderFreq] = useState('3');

  // Appearance
  const [includeFields, setIncludeFields] = useState({
    name: true,
    date: true,
    title: true,
    company: false,
  });

  // Security
  const [emailVerification, setEmailVerification] = useState(true);
  const [smsVerification, setSmsVerification] = useState(false);

  // Expiry
  const [defaultExpiry, setDefaultExpiry] = useState('30');
  const [allowOverride, setAllowOverride] = useState(true);

  // Legal
  const [requireConsent, setRequireConsent] = useState(true);

  // Team
  const [applyToTeam, setApplyToTeam] = useState(false);

  // Save feedback
  const [saved, setSaved] = useState(false);

  // Canvas drawing handlers
  const startDraw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    setIsDrawing(true);
    setHasDrawn(true);
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
  }, []);

  const draw = useCallback((e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineWidth = 2.5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#1e293b';
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  }, [isDrawing]);

  const endDraw = useCallback(() => setIsDrawing(false), []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasDrawn(false);
  }, []);

  function saveSignature() {
    if (sigMode === 'type') {
      setSavedSignature({ mode: 'type', display: typedName, font: SIGNATURE_FONTS[selectedFont].family });
    } else if (sigMode === 'draw') {
      setSavedSignature({ mode: 'draw', display: 'Drawn signature' });
    } else {
      setSavedSignature({ mode: 'upload', display: 'Uploaded signature' });
    }
    setShowModal(false);
  }

  function handleSaveAll() {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  // Section component
  function Section({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
    return (
      <div className="pb-7 mb-7 border-b border-slate-100 last:border-0 last:pb-0 last:mb-0">
        <h3 className="text-[15px] font-semibold text-slate-900 mb-0.5">{title}</h3>
        {description && <p className="text-[13px] text-slate-500 mb-4">{description}</p>}
        {!description && <div className="mb-4" />}
        {children}
      </div>
    );
  }

  function ToggleRow({ label, description, enabled, onChange }: { label: string; description?: string; enabled: boolean; onChange: () => void }) {
    return (
      <div className="flex items-center justify-between py-2">
        <div>
          <p className="text-[13px] font-medium text-slate-700">{label}</p>
          {description && <p className="text-[12px] text-slate-400 mt-0.5">{description}</p>}
        </div>
        <Toggle enabled={enabled} onChange={onChange} />
      </div>
    );
  }

  return (
    <div className="space-y-0">
      <div className="mb-7">
        <h2 className="text-lg font-semibold text-slate-900">Signature Settings</h2>
        <p className="mt-1 text-sm text-slate-500">Configure e-signature preferences and default signing workflows.</p>
      </div>

      {/* ── 1. My Signature ───────────────────────────────────────────── */}
      <Section title="My Signature" description="Your default signature used across all contracts.">
        {savedSignature ? (
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                <span className="text-[12px] font-medium text-emerald-600">Signature saved</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowModal(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-ocean-600 bg-white border border-ocean-200 rounded-lg hover:bg-ocean-50 transition-colors"
                >
                  <Pencil className="w-3 h-3" />
                  Edit
                </button>
                <button
                  onClick={() => setSavedSignature(null)}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-500 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                  Remove
                </button>
              </div>
            </div>
            <div className="bg-white rounded-lg border border-slate-200 p-6 flex items-center justify-center min-h-[80px]">
              {savedSignature.mode === 'type' ? (
                <span className="text-[28px] text-slate-800" style={{ fontFamily: savedSignature.font }}>
                  {savedSignature.display}
                </span>
              ) : savedSignature.mode === 'draw' ? (
                <span className="text-[14px] text-slate-500 italic">Drawn signature saved</span>
              ) : (
                <span className="text-[14px] text-slate-500 italic">Uploaded signature saved</span>
              )}
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowModal(true)}
            className="w-full rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 flex flex-col items-center gap-3 hover:border-ocean-300 hover:bg-ocean-50/30 transition-colors group"
          >
            <div className="w-12 h-12 rounded-xl bg-ocean-100 flex items-center justify-center group-hover:bg-ocean-200 transition-colors">
              <PenTool className="w-5 h-5 text-ocean-600" />
            </div>
            <div className="text-center">
              <p className="text-[14px] font-semibold text-slate-700">Create Your Signature</p>
              <p className="text-[12px] text-slate-400 mt-0.5">Draw, type, or upload your signature</p>
            </div>
          </button>
        )}
      </Section>

      {/* ── 2. Signing Preferences ────────────────────────────────────── */}
      <Section title="Signing Preferences" description="Configure default behavior for signing workflows.">
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Default Signing Role</label>
            <div className="flex gap-2">
              {(['Signer', 'Approver', 'Viewer'] as const).map((role) => (
                <button
                  key={role}
                  onClick={() => setDefaultRole(role)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                    defaultRole === role
                      ? 'border-ocean-300 bg-ocean-50 text-ocean-700 ring-1 ring-ocean-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {role}
                </button>
              ))}
            </div>
          </div>

          <ToggleRow
            label="Sequential signing order"
            description="Recipients must sign in the specified order"
            enabled={sequentialSigning}
            onChange={() => setSequentialSigning(!sequentialSigning)}
          />

          <div>
            <ToggleRow
              label="Auto-reminders"
              description="Automatically remind signers of pending contracts"
              enabled={autoReminders}
              onChange={() => setAutoReminders(!autoReminders)}
            />
            {autoReminders && (
              <div className="ml-0 mt-2 flex items-center gap-3">
                <label className="text-[12px] text-slate-500">Send every</label>
                <select
                  value={reminderFreq}
                  onChange={(e) => setReminderFreq(e.target.value)}
                  className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-700 focus:border-ocean-300 focus:ring-1 focus:ring-ocean-200 outline-none"
                >
                  <option value="1">1 day</option>
                  <option value="2">2 days</option>
                  <option value="3">3 days</option>
                  <option value="5">5 days</option>
                  <option value="7">7 days</option>
                </select>
                <span className="text-[12px] text-slate-400">until signed</span>
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* ── 3. Signature Appearance ───────────────────────────────────── */}
      <Section title="Signature Appearance" description="Choose which fields to automatically include with signatures.">
        <div className="space-y-1">
          {[
            { key: 'name' as const, label: 'Full Name', icon: User, desc: 'Display the signer\'s full name' },
            { key: 'date' as const, label: 'Date Signed', icon: Calendar, desc: 'Show the date of signature' },
            { key: 'title' as const, label: 'Job Title', icon: Briefcase, desc: 'Include the signer\'s job title' },
            { key: 'company' as const, label: 'Company Name', icon: Building2, desc: 'Show the signer\'s company' },
          ].map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.key} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-slate-500" />
                  </div>
                  <div>
                    <p className="text-[13px] font-medium text-slate-700">{field.label}</p>
                    <p className="text-[11px] text-slate-400">{field.desc}</p>
                  </div>
                </div>
                <Toggle
                  enabled={includeFields[field.key]}
                  onChange={() => setIncludeFields((prev) => ({ ...prev, [field.key]: !prev[field.key] }))}
                />
              </div>
            );
          })}
        </div>
      </Section>

      {/* ── 4. Security & Verification ────────────────────────────────── */}
      <Section title="Security & Verification" description="Control identity verification for signers.">
        <div className="space-y-1">
          <ToggleRow
            label="Email verification"
            description="Require signers to verify their email before signing"
            enabled={emailVerification}
            onChange={() => setEmailVerification(!emailVerification)}
          />
          <ToggleRow
            label="SMS verification"
            description="Send a one-time code via SMS for additional verification"
            enabled={smsVerification}
            onChange={() => setSmsVerification(!smsVerification)}
          />
          <div className="flex items-start gap-3 py-3 px-3 mt-2 bg-emerald-50 rounded-lg border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
            <div>
              <p className="text-[13px] font-medium text-emerald-800">Audit trail enabled</p>
              <p className="text-[12px] text-emerald-600">Every signature event is logged with timestamp, IP address, and device info. This cannot be disabled.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ── 5. Default Expiry Settings ────────────────────────────────── */}
      <Section title="Default Expiry Settings" description="Set how long recipients have to sign contracts.">
        <div className="space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Default expiration</label>
            <div className="flex gap-2">
              {['7', '14', '30', '60', '90'].map((days) => (
                <button
                  key={days}
                  onClick={() => setDefaultExpiry(days)}
                  className={`px-4 py-2 rounded-lg text-[13px] font-medium border transition-all ${
                    defaultExpiry === days
                      ? 'border-ocean-300 bg-ocean-50 text-ocean-700 ring-1 ring-ocean-200'
                      : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                  }`}
                >
                  {days} days
                </button>
              ))}
            </div>
          </div>
          <ToggleRow
            label="Allow override per contract"
            description="Let users set a custom expiration when sending individual contracts"
            enabled={allowOverride}
            onChange={() => setAllowOverride(!allowOverride)}
          />
        </div>
      </Section>

      {/* ── 6. Legal & Compliance ─────────────────────────────────────── */}
      <Section title="Legal & Compliance" description="E-signature legal standing and compliance settings.">
        <div className="flex items-start gap-3 py-3 px-3 mb-3 bg-ocean-50 rounded-lg border border-ocean-200">
          <FileText className="w-4 h-4 text-ocean-600 mt-0.5 shrink-0" />
          <div>
            <p className="text-[13px] font-medium text-ocean-800">E-signatures are legally binding</p>
            <p className="text-[12px] text-ocean-600">Under the ESIGN Act (US), eIDAS (EU), and equivalent legislation in 180+ countries, electronic signatures carry the same legal weight as wet-ink signatures.</p>
          </div>
        </div>
        <ToggleRow
          label="Require signer consent"
          description="Display a consent checkbox before allowing signers to sign"
          enabled={requireConsent}
          onChange={() => setRequireConsent(!requireConsent)}
        />
      </Section>

      {/* ── 7. Team Defaults ──────────────────────────────────────────── */}
      <Section title="Team Defaults" description="Apply signature settings across your organization.">
        <ToggleRow
          label="Apply to all team members"
          description="Override individual signature settings with these workspace defaults"
          enabled={applyToTeam}
          onChange={() => setApplyToTeam(!applyToTeam)}
        />
        {applyToTeam && (
          <div className="flex items-start gap-2.5 mt-2 p-3 bg-amber-50 rounded-lg border border-amber-200">
            <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 shrink-0" />
            <p className="text-[12px] text-amber-700">
              This will override individual signature settings for all team members. Members will be notified of the change.
            </p>
          </div>
        )}
      </Section>

      {/* ── Save button ───────────────────────────────────────────────── */}
      <div className="pt-4 flex items-center justify-end gap-3">
        {saved && (
          <span className="flex items-center gap-1.5 text-[13px] font-medium text-emerald-600">
            <CheckCircle2 className="w-4 h-4" />
            Settings saved
          </span>
        )}
        <button
          onClick={handleSaveAll}
          className="flex items-center gap-2 px-6 py-2.5 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      {/* ── Signature Creation Modal ──────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h3 className="text-[16px] font-semibold text-slate-900">Create Your Signature</h3>
              <button onClick={() => setShowModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Mode tabs */}
            <div className="flex border-b border-slate-200">
              {([
                { key: 'type' as const, label: 'Type', icon: Type },
                { key: 'draw' as const, label: 'Draw', icon: PenTool },
                { key: 'upload' as const, label: 'Upload', icon: Upload },
              ]).map((mode) => {
                const Icon = mode.icon;
                return (
                  <button
                    key={mode.key}
                    onClick={() => setSigMode(mode.key)}
                    className={`flex-1 flex items-center justify-center gap-2 py-3 text-[13px] font-medium border-b-2 transition-colors ${
                      sigMode === mode.key
                        ? 'text-ocean-600 border-ocean-500'
                        : 'text-slate-400 border-transparent hover:text-slate-600'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {mode.label}
                  </button>
                );
              })}
            </div>

            {/* Mode content */}
            <div className="p-6">
              {sigMode === 'type' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Your name</label>
                    <input
                      type="text"
                      value={typedName}
                      onChange={(e) => setTypedName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[14px] text-slate-900 placeholder:text-slate-400 focus:border-ocean-300 focus:ring-2 focus:ring-ocean-100 outline-none transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[13px] font-medium text-slate-700 mb-2">Choose a style</label>
                    <div className="grid grid-cols-2 gap-2">
                      {SIGNATURE_FONTS.map((font, idx) => (
                        <button
                          key={idx}
                          onClick={() => setSelectedFont(idx)}
                          className={`rounded-lg border p-4 text-center transition-all ${
                            selectedFont === idx
                              ? 'border-ocean-300 bg-ocean-50 ring-1 ring-ocean-200'
                              : 'border-slate-200 hover:border-slate-300'
                          }`}
                        >
                          <span
                            className="text-[22px] text-slate-800 block truncate"
                            style={{ fontFamily: font.family, fontWeight: font.weight }}
                          >
                            {typedName || 'Your Name'}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-1 block">{font.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  {/* Preview */}
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 text-center">
                    <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-2">Preview</p>
                    <span
                      className="text-[32px] text-slate-800"
                      style={{ fontFamily: SIGNATURE_FONTS[selectedFont].family, fontWeight: SIGNATURE_FONTS[selectedFont].weight }}
                    >
                      {typedName || 'Your Name'}
                    </span>
                  </div>
                </div>
              )}

              {sigMode === 'draw' && (
                <div className="space-y-4">
                  <p className="text-[13px] text-slate-500">Use your mouse or trackpad to draw your signature below.</p>
                  <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white overflow-hidden">
                    <canvas
                      ref={canvasRef}
                      width={440}
                      height={160}
                      onMouseDown={startDraw}
                      onMouseMove={draw}
                      onMouseUp={endDraw}
                      onMouseLeave={endDraw}
                      className="w-full cursor-crosshair"
                      style={{ height: '160px' }}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={clearCanvas}
                      className="flex items-center gap-1.5 text-[12px] font-medium text-slate-500 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                      Clear
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {hasDrawn ? 'Signature drawn' : 'Start drawing above'}
                    </span>
                  </div>
                </div>
              )}

              {sigMode === 'upload' && (
                <div className="space-y-4">
                  <p className="text-[13px] text-slate-500">Upload an image of your signature. PNG or SVG with transparent background recommended.</p>
                  <div className="rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-12 flex flex-col items-center gap-3 cursor-pointer hover:border-ocean-300 hover:bg-ocean-50/30 transition-colors">
                    <Upload className="w-8 h-8 text-slate-400" />
                    <p className="text-[13px] font-medium text-slate-600">Drop file here or click to browse</p>
                    <p className="text-[11px] text-slate-400">PNG, SVG, or JPG up to 2MB</p>
                  </div>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-slate-200 bg-slate-25">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={saveSignature}
                disabled={sigMode === 'type' && !typedName.trim()}
                className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <CheckCircle2 className="w-4 h-4" />
                Save Signature
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Placeholder Panel ───────────────────────────────────────────────────────

function PlaceholderPanel({ title, description }: { title: string; description: string }) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>
      <div className="flex h-64 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50">
        <p className="text-sm text-slate-400">Configuration options coming soon.</p>
      </div>
    </div>
  );
}

// ─── Main SettingsPage ───────────────────────────────────────────────────────

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState<TabId>('company');

  const renderPanel = () => {
    switch (activeTab) {
      case 'company':
        return <CompanyProfilePanel />;
      case 'team':
        return <TeamMembersPanel />;
      case 'notifications':
        return <NotificationsPanel />;
      case 'security':
        return <SecurityPanel />;
      case 'brand':
        return <PlaceholderPanel title="Brand Settings" description="Customize your brand colors, fonts, and document styling." />;
      case 'signature':
        return <SignatureSettingsPanel />;
      case 'legal':
        return <PlaceholderPanel title="Legal Defaults" description="Set default governing law, jurisdiction, and standard clause libraries." />;
      case 'integrations':
        return <PlaceholderPanel title="Integrations" description="Connect Contract Ocean with your favorite tools and services." />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-25">
      <div className="mx-auto max-w-6xl px-6 py-8">
        {/* Page header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-slate-900">Settings</h1>
          <p className="mt-1 text-sm text-slate-500">Manage your account, team, and workspace preferences.</p>
        </div>

        {/* Layout: sidebar + content */}
        <div className="flex gap-8">
          {/* Left tab navigation */}
          <nav className="w-52 shrink-0">
            <ul className="space-y-1">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-ocean-50 text-ocean-700'
                          : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                      }`}
                    >
                      <tab.icon className={`h-4.5 w-4.5 ${isActive ? 'text-ocean-600' : 'text-slate-400'}`} />
                      {tab.label}
                      {isActive && <ChevronRight className="ml-auto h-4 w-4 text-ocean-400" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Right content panel */}
          <main className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-8 shadow-card">
            {renderPanel()}
          </main>
        </div>
      </div>
    </div>
  );
}
