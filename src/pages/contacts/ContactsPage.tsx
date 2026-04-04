import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Search,
  Plus,
  Upload,
  X,
  Phone,
  Mail,
  Building2,
  User,
  Tag,
  FileText,
  Send,
  Eye,
  ChevronRight,
  CheckCircle2,
  Clock,
  PenLine,
  Zap,
  TrendingUp,
  AlertTriangle,
  Users,
} from "lucide-react";
import { contacts, contracts, type Contact } from "../../data/mockData";

// ─── Constants ──────────────────────────────────────────────────────────────

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Client: { bg: "bg-blue-50", text: "text-blue-700" },
  Enterprise: { bg: "bg-indigo-50", text: "text-indigo-700" },
  SaaS: { bg: "bg-violet-50", text: "text-violet-700" },
  Partner: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Consulting: { bg: "bg-cyan-50", text: "text-cyan-700" },
  Employee: { bg: "bg-amber-50", text: "text-amber-700" },
  Engineering: { bg: "bg-orange-50", text: "text-orange-700" },
  Vendor: { bg: "bg-pink-50", text: "text-pink-700" },
  Materials: { bg: "bg-rose-50", text: "text-rose-700" },
  Marketing: { bg: "bg-fuchsia-50", text: "text-fuchsia-700" },
  Freelancer: { bg: "bg-teal-50", text: "text-teal-700" },
  Design: { bg: "bg-purple-50", text: "text-purple-700" },
  "Real Estate": { bg: "bg-slate-100", text: "text-slate-700" },
};

const SMART_TAG_CONFIG: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  "Frequent signer": { bg: "bg-emerald-50", text: "text-emerald-700", icon: Zap },
  "High value": { bg: "bg-ocean-50", text: "text-ocean-700", icon: TrendingUp },
  "Delayed signer": { bg: "bg-amber-50", text: "text-amber-700", icon: AlertTriangle },
};

const AVATAR_COLORS = [
  "bg-ocean-500", "bg-violet-500", "bg-emerald-500", "bg-amber-500",
  "bg-pink-500", "bg-cyan-500", "bg-indigo-500", "bg-rose-500",
];

type ContractStatusFilter = "all" | "has_signed" | "has_pending" | "has_draft";

// ─── Helpers ────────────────────────────────────────────────────────────────

function getAvatarColor(name: string) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function relativeDate(dateStr: string): string {
  const now = new Date("2026-03-22");
  const date = new Date(dateStr);
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  return `${Math.floor(diffDays / 30)} months ago`;
}

function getAllTags(contactList: Contact[]): string[] {
  const set = new Set<string>();
  contactList.forEach((c) => c.tags.forEach((t) => set.add(t)));
  return Array.from(set).sort();
}

// Derive contract stats for a contact
function getContactStats(contact: Contact) {
  const related = contracts.filter(
    (c) => c.counterparty.toLowerCase().includes(contact.name.toLowerCase().split(" ")[1] || "__none__") ||
           c.counterparty.toLowerCase().includes(contact.company.toLowerCase())
  );

  // Simulate realistic stats based on contractCount
  const signed = Math.max(1, Math.floor(contact.contractCount * 0.5));
  const pending = Math.max(0, Math.floor(contact.contractCount * 0.3));
  const draft = contact.contractCount - signed - pending;

  return { signed: Math.max(0, signed), pending: Math.max(0, pending), draft: Math.max(0, draft), related };
}

// Smart tags based on behavior
function getSmartTags(contact: Contact): string[] {
  const tags: string[] = [];
  if (contact.contractCount >= 4) tags.push("Frequent signer");
  if (contact.contractCount >= 3 && contact.tags.includes("Enterprise")) tags.push("High value");
  const daysSince = Math.floor((new Date("2026-03-22").getTime() - new Date(contact.lastActivity).getTime()) / (1000 * 60 * 60 * 24));
  if (daysSince > 20) tags.push("Delayed signer");
  return tags;
}

// Activity timeline for a contact
function getActivityTimeline(contact: Contact) {
  const base = [
    { action: "Contract signed", detail: `Signed MSA with ${contact.company}`, time: relativeDate(contact.lastActivity), icon: CheckCircle2, color: "text-emerald-500" },
  ];
  if (contact.contractCount > 1) {
    base.push({ action: "Contract sent", detail: "Sent renewal agreement for review", time: "1 week ago", icon: Send, color: "text-ocean-500" });
  }
  if (contact.contractCount > 2) {
    base.push({ action: "Contact added", detail: `Added ${contact.name} to workspace`, time: "2 months ago", icon: User, color: "text-slate-400" });
  }
  base.push({ action: "First contract", detail: `Created initial agreement with ${contact.company}`, time: "3 months ago", icon: FileText, color: "text-slate-400" });
  return base;
}

// ─── Contact Detail Drawer ──────────────────────────────────────────────────

function ContactDrawer({
  contact,
  onClose,
  onCreateContract,
}: {
  contact: Contact;
  onClose: () => void;
  onCreateContract: () => void;
}) {
  const stats = getContactStats(contact);
  const smartTags = getSmartTags(contact);
  const timeline = getActivityTimeline(contact);

  return (
    <div className="w-[400px] border-l border-slate-200 bg-white flex flex-col h-full shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <h3 className="text-[15px] font-semibold text-slate-900">Contact Details</h3>
        <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        {/* Profile header */}
        <div className="p-5 pb-4">
          <div className="flex items-start gap-3.5">
            <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full text-[16px] font-bold text-white ${getAvatarColor(contact.name)}`}>
              {contact.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-[17px] font-semibold text-slate-900">{contact.name}</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">{contact.role}</p>
              <p className="text-[12px] text-slate-400">{contact.company}</p>
            </div>
            <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${contact.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
              {contact.status}
            </span>
          </div>

          {/* Contact info */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2.5 text-[13px]">
              <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <a href={`mailto:${contact.email}`} className="text-ocean-600 hover:underline truncate">{contact.email}</a>
            </div>
            <div className="flex items-center gap-2.5 text-[13px]">
              <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-600">{contact.phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px]">
              <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="text-slate-600">{contact.company}</span>
            </div>
          </div>

          {/* Tags */}
          <div className="mt-4 flex flex-wrap gap-1.5">
            {contact.tags.map((tag) => {
              const color = TAG_COLORS[tag] ?? { bg: "bg-slate-100", text: "text-slate-600" };
              return (
                <span key={tag} className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${color.bg} ${color.text}`}>
                  {tag}
                </span>
              );
            })}
            {smartTags.map((tag) => {
              const config = SMART_TAG_CONFIG[tag];
              const Icon = config.icon;
              return (
                <span key={tag} className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${config.bg} ${config.text}`}>
                  <Icon className="w-3 h-3" />
                  {tag}
                </span>
              );
            })}
          </div>
        </div>

        {/* Contract summary */}
        <div className="px-5 py-4 border-t border-slate-100">
          <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Contract Summary</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-lg bg-emerald-50 border border-emerald-100 p-3 text-center">
              <p className="text-[18px] font-bold text-emerald-700">{stats.signed}</p>
              <p className="text-[11px] font-medium text-emerald-600 mt-0.5">Signed</p>
            </div>
            <div className="rounded-lg bg-amber-50 border border-amber-100 p-3 text-center">
              <p className="text-[18px] font-bold text-amber-700">{stats.pending}</p>
              <p className="text-[11px] font-medium text-amber-600 mt-0.5">Pending</p>
            </div>
            <div className="rounded-lg bg-slate-50 border border-slate-200 p-3 text-center">
              <p className="text-[18px] font-bold text-slate-600">{stats.draft}</p>
              <p className="text-[11px] font-medium text-slate-500 mt-0.5">Draft</p>
            </div>
          </div>
        </div>

        {/* Recent contracts */}
        <div className="px-5 py-4 border-t border-slate-100">
          <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Recent Contracts</h4>
          <div className="space-y-2">
            {contracts.slice(0, 3).map((c) => (
              <div key={c.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-medium text-slate-700 truncate">{c.name}</p>
                  <p className="text-[11px] text-slate-400">{c.id}</p>
                </div>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                  c.status === "signed" ? "bg-emerald-50 text-emerald-700" :
                  c.status === "awaiting_signature" ? "bg-amber-50 text-amber-700" :
                  "bg-slate-100 text-slate-500"
                }`}>
                  {c.status === "signed" ? "Signed" : c.status === "awaiting_signature" ? "Pending" : "Draft"}
                </span>
                <ChevronRight className="w-3.5 h-3.5 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            ))}
          </div>
        </div>

        {/* Activity timeline */}
        <div className="px-5 py-4 border-t border-slate-100">
          <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Activity</h4>
          <div className="space-y-0">
            {timeline.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div key={idx} className="flex gap-3 pb-4 relative">
                  {idx < timeline.length - 1 && (
                    <div className="absolute left-[13px] top-7 bottom-0 w-px bg-slate-200" />
                  )}
                  <div className={`w-7 h-7 rounded-full bg-white border border-slate-200 flex items-center justify-center shrink-0 z-10 ${item.color}`}>
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-[12px] font-medium text-slate-700">{item.action}</p>
                    <p className="text-[11px] text-slate-400 mt-0.5">{item.detail}</p>
                    <p className="text-[10px] text-slate-300 mt-0.5">{item.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-2.5 bg-slate-25">
        <button
          onClick={onCreateContract}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          Create Contract
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ContactsPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">("all");
  const [tagFilter, setTagFilter] = useState("all");
  const [contractStatusFilter, setContractStatusFilter] = useState<ContractStatusFilter>("all");
  const [showModal, setShowModal] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [form, setForm] = useState({ name: "", email: "", company: "", role: "", phone: "", tags: "" });

  const allTags = getAllTags(contacts);

  const filtered = contacts.filter((c) => {
    const q = search.toLowerCase();
    const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.company.toLowerCase().includes(q);
    const matchesStatus = statusFilter === "all" || c.status === statusFilter;
    const matchesTag = tagFilter === "all" || c.tags.includes(tagFilter);

    let matchesContractStatus = true;
    if (contractStatusFilter !== "all") {
      const stats = getContactStats(c);
      if (contractStatusFilter === "has_signed") matchesContractStatus = stats.signed > 0;
      if (contractStatusFilter === "has_pending") matchesContractStatus = stats.pending > 0;
      if (contractStatusFilter === "has_draft") matchesContractStatus = stats.draft > 0;
    }

    return matchesSearch && matchesStatus && matchesTag && matchesContractStatus;
  });

  function handleCreateFromContact(contact: Contact) {
    navigate(`/ai-generator?name=${encodeURIComponent(contact.name)}&email=${encodeURIComponent(contact.email)}&company=${encodeURIComponent(contact.company)}`);
  }

  // Empty state
  if (contacts.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 rounded-full bg-ocean-50 p-5 w-fit">
            <Users className="h-10 w-10 text-ocean-500" />
          </div>
          <h2 className="text-[20px] font-bold text-slate-900">No contacts yet</h2>
          <p className="mt-2 text-[14px] text-slate-500 leading-relaxed">
            Add your first contact to start sending contracts. You can import contacts from a CSV or add them manually.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-600 shadow-sm hover:bg-slate-50 transition-colors">
              <Upload className="h-4 w-4" />
              Import CSV
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:bg-ocean-700 transition-colors">
              <Plus className="h-4 w-4" />
              Add First Contact
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[calc(100vh-64px)]" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <div className="flex-1 overflow-y-auto px-6 py-8 lg:px-10">

          {/* Header */}
          <div className="mb-6 flex items-start justify-between">
            <div>
              <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Contacts</h1>
              <p className="mt-1 text-[14px] text-slate-500">
                {contacts.length} contacts &middot; {contacts.filter((c) => c.status === "active").length} active
              </p>
            </div>
            <div className="flex gap-2">
              <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-medium text-slate-600 shadow-sm transition-colors hover:border-slate-300 hover:bg-slate-50">
                <Upload className="h-4 w-4" />
                Import
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700"
              >
                <Plus className="h-4 w-4" />
                Add Contact
              </button>
            </div>
          </div>

          {/* Search + Filters */}
          <div className="mb-4 flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search contacts by name, email, or company..."
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
              />
            </div>

            <div className="flex rounded-lg border border-slate-200 bg-white p-0.5">
              {(["all", "active", "inactive"] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setStatusFilter(s)}
                  className={`rounded-md px-3.5 py-1.5 text-[13px] font-medium capitalize transition-colors ${
                    statusFilter === s ? "bg-ocean-50 text-ocean-700" : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {s === "all" ? "All" : s}
                </button>
              ))}
            </div>

            <select
              value={tagFilter}
              onChange={(e) => setTagFilter(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-600 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
            >
              <option value="all">All Tags</option>
              {allTags.map((tag) => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>

            <select
              value={contractStatusFilter}
              onChange={(e) => setContractStatusFilter(e.target.value as ContractStatusFilter)}
              className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-600 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
            >
              <option value="all">All Statuses</option>
              <option value="has_signed">Has Signed</option>
              <option value="has_pending">Has Pending</option>
              <option value="has_draft">Has Draft</option>
            </select>
          </div>

          {/* Contacts Table */}
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px]">
                <thead>
                  <tr className="border-b border-slate-100 bg-slate-50">
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contact</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Company</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Tags</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Contracts</th>
                    <th className="px-5 py-3 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-500">Last Activity</th>
                    <th className="px-5 py-3 text-right text-[11px] font-semibold uppercase tracking-wider text-slate-500 w-[140px]">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((contact) => {
                    const stats = getContactStats(contact);
                    const smartTags = getSmartTags(contact);
                    const isSelected = selectedContact?.id === contact.id;

                    return (
                      <tr
                        key={contact.id}
                        onClick={() => setSelectedContact(contact)}
                        className={`border-b border-slate-50 transition-colors cursor-pointer group ${
                          isSelected ? "bg-ocean-50/40" : "hover:bg-slate-50/60"
                        }`}
                      >
                        {/* Name + Email + Role */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[13px] font-bold text-white ${getAvatarColor(contact.name)}`}>
                              {contact.name.charAt(0)}
                            </div>
                            <div>
                              <p className="text-[13px] font-semibold text-slate-900">{contact.name}</p>
                              <p className="text-[11px] text-slate-400">{contact.email}</p>
                              <p className="text-[10px] text-slate-300 mt-0.5">{contact.role}</p>
                            </div>
                          </div>
                        </td>

                        {/* Company */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <Building2 className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                            <span className="text-[13px] text-slate-600">{contact.company}</span>
                          </div>
                        </td>

                        {/* Tags (regular + smart) */}
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1">
                            {contact.tags.map((tag) => {
                              const color = TAG_COLORS[tag] ?? { bg: "bg-slate-100", text: "text-slate-600" };
                              return (
                                <span key={tag} className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${color.bg} ${color.text}`}>
                                  {tag}
                                </span>
                              );
                            })}
                            {smartTags.map((tag) => {
                              const config = SMART_TAG_CONFIG[tag];
                              const Icon = config.icon;
                              return (
                                <span key={tag} className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-[10px] font-semibold ${config.bg} ${config.text}`}>
                                  <Icon className="w-2.5 h-2.5" />
                                  {tag}
                                </span>
                              );
                            })}
                          </div>
                        </td>

                        {/* Contract status breakdown */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-2">
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              {stats.signed}
                            </span>
                            {stats.pending > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700">
                                <Clock className="w-2.5 h-2.5" />
                                {stats.pending}
                              </span>
                            )}
                            {stats.draft > 0 && (
                              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                                <PenLine className="w-2.5 h-2.5" />
                                {stats.draft}
                              </span>
                            )}
                          </div>
                        </td>

                        {/* Last Activity */}
                        <td className="px-5 py-3.5 text-[13px] text-slate-500">
                          {relativeDate(contact.lastActivity)}
                        </td>

                        {/* Row hover actions */}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                            <button
                              onClick={(e) => { e.stopPropagation(); handleCreateFromContact(contact); }}
                              className="p-1.5 rounded-md text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 transition-colors"
                              title="Create contract"
                            >
                              <Plus className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedContact(contact); }}
                              className="p-1.5 rounded-md text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 transition-colors"
                              title="View contracts"
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Send reminder"
                            >
                              <Send className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}

                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-16 text-center">
                        <User className="mx-auto mb-2 h-8 w-8 text-slate-300" />
                        <p className="text-[14px] font-medium text-slate-500">No contacts found</p>
                        <p className="mt-1 text-[13px] text-slate-400">Try adjusting your search or filters.</p>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="mt-4 text-[13px] text-slate-400 pb-4">
            Showing {filtered.length} of {contacts.length} contacts
          </p>
        </div>
      </div>

      {/* Contact Detail Drawer */}
      {selectedContact && (
        <ContactDrawer
          contact={selectedContact}
          onClose={() => setSelectedContact(null)}
          onCreateContract={() => handleCreateFromContact(selectedContact)}
        />
      )}

      {/* Add Contact Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-[17px] font-bold text-slate-900">Add New Contact</h2>
              <button onClick={() => setShowModal(false)} className="rounded-lg p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700"><User className="h-3.5 w-3.5 text-slate-400" />Full Name</label>
                <input value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} placeholder="e.g. Jane Smith" className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700"><Mail className="h-3.5 w-3.5 text-slate-400" />Email Address</label>
                <input value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} placeholder="jane@company.com" className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700"><Building2 className="h-3.5 w-3.5 text-slate-400" />Company</label>
                  <input value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} placeholder="Acme Inc." className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100" />
                </div>
                <div>
                  <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700">Role</label>
                  <input value={form.role} onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))} placeholder="Director of Sales" className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700"><Phone className="h-3.5 w-3.5 text-slate-400" />Phone</label>
                <input value={form.phone} onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100" />
              </div>
              <div>
                <label className="mb-1.5 flex items-center gap-1.5 text-[13px] font-medium text-slate-700"><Tag className="h-3.5 w-3.5 text-slate-400" />Tags</label>
                <input value={form.tags} onChange={(e) => setForm((f) => ({ ...f, tags: e.target.value }))} placeholder="Client, Enterprise (comma separated)" className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button onClick={() => setShowModal(false)} className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium text-slate-600 transition-colors hover:bg-slate-50">Cancel</button>
              <button onClick={() => setShowModal(false)} className="rounded-lg bg-ocean-600 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700">Save Contact</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
