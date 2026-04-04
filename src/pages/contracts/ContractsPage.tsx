import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  SlidersHorizontal,
  ChevronDown,
  LayoutList,
  LayoutGrid,
  Download,
  FileText,
  ChevronLeft,
  ChevronRight,
  X,
  Eye,
  PenLine,
  Send,
  Copy,
  Archive,
  Trash2,
  Bell,
  Clock,
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  Sparkles,
  Building2,
  DollarSign,
  User,
  Calendar,
  Tag,
  Shield,
} from 'lucide-react';
import { contracts, type Contract } from '../../data/mockData';

// ─── Types ──────────────────────────────────────────────────────────────────

type StatusKey = Contract['status'];

type QuickFilter = 'expiring_soon' | 'awaiting_signature' | 'high_value' | 'assigned_to_me';

// ─── Constants ──────────────────────────────────────────────────────────────

const tabs: { label: string; key: string; count: number }[] = [
  { label: 'All', key: 'all', count: 47 },
  { label: 'Draft', key: 'draft', count: 8 },
  { label: 'In Review', key: 'in_review', count: 3 },
  { label: 'Sent', key: 'sent', count: 4 },
  { label: 'Awaiting Signature', key: 'awaiting_signature', count: 5 },
  { label: 'Signed', key: 'signed', count: 15 },
  { label: 'Completed', key: 'completed', count: 8 },
  { label: 'Expiring Soon', key: 'expiring_soon', count: 3 },
  { label: 'Archived', key: 'archived', count: 1 },
];

const ITEMS_PER_PAGE = 12;

// ─── Helpers ────────────────────────────────────────────────────────────────

function formatCurrency(value: number): string {
  if (value === 0) return '—';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getInitial(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

function daysUntil(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function daysSince(dateStr: string): number {
  const now = new Date();
  const target = new Date(dateStr);
  return Math.floor((now.getTime() - target.getTime()) / (1000 * 60 * 60 * 24));
}

function relativeTime(dateStr: string): string {
  const d = daysSince(dateStr);
  if (d === 0) return 'Today';
  if (d === 1) return 'Yesterday';
  if (d < 7) return `${d}d ago`;
  if (d < 30) return `${Math.floor(d / 7)}w ago`;
  return formatDate(dateStr);
}

// ─── Status helpers ─────────────────────────────────────────────────────────

function getStatusBadgeClasses(status: StatusKey): string {
  const map: Record<StatusKey, string> = {
    draft: 'bg-slate-100 text-slate-600',
    in_review: 'bg-blue-50 text-blue-700',
    sent: 'bg-violet-50 text-violet-700',
    awaiting_signature: 'bg-amber-50 text-amber-700',
    signed: 'bg-emerald-50 text-emerald-700',
    completed: 'bg-emerald-50 text-emerald-700',
    expiring_soon: 'bg-red-50 text-red-700',
    archived: 'bg-slate-100 text-slate-500',
  };
  return map[status] || 'bg-slate-100 text-slate-600';
}

function getStatusIcon(status: StatusKey) {
  const map: Record<StatusKey, React.ElementType> = {
    draft: PenLine,
    in_review: Eye,
    sent: Send,
    awaiting_signature: Clock,
    signed: CheckCircle2,
    completed: CheckCircle2,
    expiring_soon: AlertTriangle,
    archived: Archive,
  };
  return map[status] || FileText;
}

function getBusinessStatusLabel(contract: Contract): { label: string; detail?: string } {
  const days = daysUntil(contract.expiryDate);
  switch (contract.status) {
    case 'draft':
      return { label: 'Draft', detail: `Created ${relativeTime(contract.createdDate)}` };
    case 'in_review':
      return { label: 'Under Review', detail: `Updated ${relativeTime(contract.lastUpdated)}` };
    case 'sent':
      return { label: 'Sent', detail: `Waiting ${daysSince(contract.lastUpdated)}d for response` };
    case 'awaiting_signature':
      return { label: 'Awaiting Signature', detail: contract.signatureStatus };
    case 'signed':
      return { label: 'Fully Executed', detail: `Expires ${formatDate(contract.expiryDate)}` };
    case 'completed':
      return { label: 'Completed', detail: `Closed ${relativeTime(contract.lastUpdated)}` };
    case 'expiring_soon':
      return { label: 'Expiring Soon', detail: `${days}d remaining` };
    case 'archived':
      return { label: 'Archived' };
    default:
      return { label: contract.status };
  }
}

// ─── AI Insight generator ───────────────────────────────────────────────────

function getRowInsight(contract: Contract): { text: string; type: 'warning' | 'info' | 'risk' } | null {
  const daysSinceUpdate = daysSince(contract.lastUpdated);
  const daysToExpiry = daysUntil(contract.expiryDate);

  if (contract.status === 'expiring_soon' && daysToExpiry <= 14) {
    return { text: `Expires in ${daysToExpiry} days — start renewal now to avoid coverage gap`, type: 'risk' };
  }
  if (contract.status === 'awaiting_signature' && daysSinceUpdate > 3) {
    return { text: `Signature pending ${daysSinceUpdate} days — consider sending a reminder`, type: 'warning' };
  }
  if (contract.status === 'draft' && daysSinceUpdate > 5) {
    return { text: `Idle for ${daysSinceUpdate} days — finalizing could add ${contract.value > 0 ? formatCurrency(contract.value) : 'value'} to pipeline`, type: 'info' };
  }
  if (contract.status === 'sent' && daysSinceUpdate > 2) {
    return { text: `No response in ${daysSinceUpdate} days — counterparty may need a follow-up`, type: 'warning' };
  }
  return null;
}

// ─── Quick Filter Chips Config ──────────────────────────────────────────────

const quickFilterConfig: { key: QuickFilter; label: string; icon: React.ElementType; color: string }[] = [
  { key: 'expiring_soon', label: 'Expiring Soon', icon: CalendarClock, color: 'text-red-600 bg-red-50 border-red-200 hover:bg-red-100' },
  { key: 'awaiting_signature', label: 'Awaiting Signature', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100' },
  { key: 'high_value', label: 'High Value (>$50K)', icon: DollarSign, color: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:bg-emerald-100' },
  { key: 'assigned_to_me', label: 'Assigned to Me', icon: User, color: 'text-ocean-600 bg-ocean-50 border-ocean-200 hover:bg-ocean-100' },
];

// ─── Side Preview Panel ─────────────────────────────────────────────────────

function PreviewPanel({
  contract,
  onClose,
  onEdit,
}: {
  contract: Contract;
  onClose: () => void;
  onEdit: () => void;
}) {
  const days = daysUntil(contract.expiryDate);
  const status = getBusinessStatusLabel(contract);
  const StatusIcon = getStatusIcon(contract.status);
  const insight = getRowInsight(contract);

  return (
    <div className="w-[420px] border-l border-slate-200 bg-white flex flex-col h-full shrink-0 overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-slate-200">
        <h3 className="text-[15px] font-semibold text-slate-900 truncate pr-4">Contract Details</h3>
        <button
          onClick={onClose}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-5 space-y-5">
        {/* Contract name and ID */}
        <div>
          <h2 className="text-[17px] font-semibold text-slate-900 leading-snug">{contract.name}</h2>
          <p className="text-[12px] text-slate-400 mt-1">{contract.id} &middot; {contract.category}</p>
        </div>

        {/* Status badge */}
        <div className="flex items-center gap-2.5">
          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-semibold ${getStatusBadgeClasses(contract.status)}`}>
            <StatusIcon className="w-3 h-3" />
            {status.label}
          </span>
          {status.detail && (
            <span className="text-[11px] text-slate-400">{status.detail}</span>
          )}
        </div>

        {/* AI Insight */}
        {insight && (
          <div className={`rounded-lg p-3 flex items-start gap-2.5 ${
            insight.type === 'risk' ? 'bg-red-50 border border-red-100' :
            insight.type === 'warning' ? 'bg-amber-50 border border-amber-100' :
            'bg-ocean-50 border border-ocean-100'
          }`}>
            <Sparkles className={`w-3.5 h-3.5 mt-0.5 shrink-0 ${
              insight.type === 'risk' ? 'text-red-500' :
              insight.type === 'warning' ? 'text-amber-500' :
              'text-ocean-500'
            }`} />
            <p className={`text-[12px] leading-relaxed ${
              insight.type === 'risk' ? 'text-red-700' :
              insight.type === 'warning' ? 'text-amber-700' :
              'text-ocean-700'
            }`}>
              {insight.text}
            </p>
          </div>
        )}

        {/* Key details grid */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Details</h4>
          <div className="grid grid-cols-2 gap-3">
            <DetailItem icon={Building2} label="Counterparty" value={contract.counterparty} />
            <DetailItem icon={User} label="Owner" value={contract.owner} />
            <DetailItem icon={DollarSign} label="Contract Value" value={contract.value > 0 ? formatCurrency(contract.value) : 'No value'} />
            <DetailItem icon={Tag} label="Category" value={contract.category} />
            <DetailItem icon={Calendar} label="Created" value={formatDate(contract.createdDate)} />
            <DetailItem icon={Calendar} label="Last Updated" value={relativeTime(contract.lastUpdated)} />
          </div>
        </div>

        {/* Expiry section */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Expiry & Renewal</h4>
          <div className={`rounded-lg p-3 border ${days <= 30 ? 'bg-red-50/50 border-red-200' : days <= 90 ? 'bg-amber-50/50 border-amber-200' : 'bg-slate-50 border-slate-200'}`}>
            <div className="flex items-center justify-between">
              <span className="text-[13px] font-medium text-slate-700">{formatDate(contract.expiryDate)}</span>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                days <= 30 ? 'bg-red-100 text-red-700' : days <= 90 ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
              }`}>
                {days <= 0 ? 'Expired' : `${days}d remaining`}
              </span>
            </div>
            {days <= 90 && days > 0 && (
              <div className="mt-2">
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${days <= 30 ? 'bg-red-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.max(5, Math.min(100, ((90 - days) / 90) * 100))}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Signature status */}
        <div className="space-y-2.5">
          <h4 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">Signature Status</h4>
          <div className="rounded-lg p-3 bg-slate-50 border border-slate-200">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-slate-400" />
              <span className="text-[13px] text-slate-700">{contract.signatureStatus}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Footer actions */}
      <div className="p-4 border-t border-slate-200 flex items-center gap-2.5 bg-slate-25">
        <button
          onClick={onEdit}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors"
        >
          <PenLine className="w-3.5 h-3.5" />
          Open in Editor
        </button>
        <button className="flex items-center justify-center gap-2 px-4 py-2.5 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
          <Send className="w-3.5 h-3.5" />
          Send
        </button>
        <button className="flex items-center justify-center p-2.5 text-slate-400 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 hover:text-slate-600 transition-colors">
          <Download className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}

function DetailItem({ icon: Icon, label, value }: { icon: React.ElementType; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2">
      <Icon className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
      <div className="min-w-0">
        <p className="text-[11px] text-slate-400">{label}</p>
        <p className="text-[13px] text-slate-700 font-medium truncate">{value}</p>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function ContractsPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeQuickFilters, setActiveQuickFilters] = useState<Set<QuickFilter>>(new Set());
  const [previewContract, setPreviewContract] = useState<Contract | null>(null);

  // ─── Filtering ──────────────────────────────────────────────────────────

  const filteredContracts = contracts.filter((c) => {
    const matchesTab = activeTab === 'all' || c.status === activeTab;
    const matchesSearch =
      search === '' ||
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.counterparty.toLowerCase().includes(search.toLowerCase()) ||
      c.id.toLowerCase().includes(search.toLowerCase());

    let matchesQuickFilter = true;
    if (activeQuickFilters.size > 0) {
      matchesQuickFilter = false;
      if (activeQuickFilters.has('expiring_soon') && (c.status === 'expiring_soon' || daysUntil(c.expiryDate) <= 90)) matchesQuickFilter = true;
      if (activeQuickFilters.has('awaiting_signature') && c.status === 'awaiting_signature') matchesQuickFilter = true;
      if (activeQuickFilters.has('high_value') && c.value > 50000) matchesQuickFilter = true;
      if (activeQuickFilters.has('assigned_to_me') && c.owner === 'Sarah Chen') matchesQuickFilter = true;
    }

    return matchesTab && matchesSearch && matchesQuickFilter;
  });

  const totalFiltered = filteredContracts.length;
  const totalPages = Math.max(1, Math.ceil(totalFiltered / ITEMS_PER_PAGE));
  const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedContracts = filteredContracts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

  const allSelected =
    paginatedContracts.length > 0 &&
    paginatedContracts.every((c) => selectedRows.has(c.id));

  // ─── Actions ────────────────────────────────────────────────────────────

  function toggleSelectAll() {
    if (allSelected) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(paginatedContracts.map((c) => c.id)));
    }
  }

  function toggleRow(id: string) {
    setSelectedRows((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleQuickFilter(key: QuickFilter) {
    setActiveQuickFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
    setCurrentPage(1);
  }

  function clearSelection() {
    setSelectedRows(new Set());
  }

  // ─── Empty state ────────────────────────────────────────────────────────

  if (contracts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-32">
        <div className="mb-4 rounded-full bg-slate-100 p-4">
          <FileText className="h-8 w-8 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-900">No contracts yet</h3>
        <p className="mt-1 text-sm text-slate-500">
          Get started by creating your first contract.
        </p>
        <button
          onClick={() => navigate('/ai-generator')}
          className="mt-6 inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors"
        >
          <Plus className="h-4 w-4" />
          Create your first contract
        </button>
      </div>
    );
  }

  // ─── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="flex h-[calc(100vh-64px)]">
      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Page header */}
        <div className="flex items-center justify-between px-8 pt-8 pb-5 shrink-0">
          <div>
            <h1 className="text-[22px] font-semibold text-slate-900 tracking-tight">Contracts</h1>
            <p className="mt-0.5 text-[13px] text-slate-500">
              {totalFiltered} contract{totalFiltered !== 1 ? 's' : ''} &middot; {formatCurrency(filteredContracts.reduce((s, c) => s + c.value, 0))} total value
            </p>
          </div>
          <button
            onClick={() => navigate('/ai-generator')}
            className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-[13px] font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Contract
          </button>
        </div>

        {/* Status tabs */}
        <div className="border-b border-slate-200 px-8 shrink-0">
          <div className="-mb-px flex gap-1 overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key);
                  setCurrentPage(1);
                }}
                className={`whitespace-nowrap px-3.5 py-2.5 text-[13px] transition-colors border-b-2 ${
                  activeTab === tab.key
                    ? 'border-ocean-600 text-ocean-700 font-medium'
                    : 'border-transparent text-slate-500 hover:text-slate-700'
                }`}
              >
                {tab.label}{' '}
                <span className={activeTab === tab.key ? 'text-ocean-600' : 'text-slate-400'}>
                  ({tab.count})
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quick filter chips */}
        <div className="px-8 pt-4 pb-1 flex items-center gap-2 shrink-0">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide mr-1">Quick filters</span>
          {quickFilterConfig.map((filter) => {
            const Icon = filter.icon;
            const isActive = activeQuickFilters.has(filter.key);
            return (
              <button
                key={filter.key}
                onClick={() => toggleQuickFilter(filter.key)}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[12px] font-medium border transition-all ${
                  isActive
                    ? filter.color
                    : 'text-slate-500 bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <Icon className="w-3 h-3" />
                {filter.label}
                {isActive && (
                  <X className="w-3 h-3 ml-0.5 opacity-60" />
                )}
              </button>
            );
          })}
          {activeQuickFilters.size > 0 && (
            <button
              onClick={() => { setActiveQuickFilters(new Set()); setCurrentPage(1); }}
              className="text-[11px] font-medium text-slate-400 hover:text-slate-600 ml-1 transition-colors"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Toolbar row */}
        <div className="flex items-center gap-3 px-8 py-3 shrink-0">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, counterparty, or ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-3 text-[13px] text-slate-900 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100 transition-colors"
            />
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
            <SlidersHorizontal className="h-4 w-4" />
            Filter
          </button>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
            Last updated
            <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
          </button>
          <div className="flex items-center rounded-lg border border-slate-200 bg-white">
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 transition-colors ${
                viewMode === 'list' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'
              } rounded-l-lg`}
            >
              <LayoutList className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 transition-colors ${
                viewMode === 'grid' ? 'bg-slate-100 text-slate-700' : 'text-slate-400 hover:text-slate-600'
              } rounded-r-lg`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-600 hover:bg-slate-50 transition-colors">
            <Download className="h-4 w-4" />
            Export
          </button>
        </div>

        {/* Bulk action bar */}
        {selectedRows.size > 0 && (
          <div className="mx-8 mb-3 flex items-center gap-3 px-4 py-2.5 bg-ocean-50 border border-ocean-200 rounded-xl shrink-0 animate-in">
            <span className="text-[13px] font-semibold text-ocean-700">
              {selectedRows.size} selected
            </span>
            <div className="w-px h-5 bg-ocean-200" />
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-ocean-700 bg-white border border-ocean-200 rounded-lg hover:bg-ocean-100 transition-colors">
              <Bell className="w-3 h-3" />
              Send Reminder
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-ocean-700 bg-white border border-ocean-200 rounded-lg hover:bg-ocean-100 transition-colors">
              <Copy className="w-3 h-3" />
              Duplicate
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-ocean-700 bg-white border border-ocean-200 rounded-lg hover:bg-ocean-100 transition-colors">
              <Archive className="w-3 h-3" />
              Archive
            </button>
            <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors">
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
            <div className="flex-1" />
            <button
              onClick={clearSelection}
              className="text-[12px] font-medium text-ocean-500 hover:text-ocean-700 transition-colors"
            >
              Clear selection
            </button>
          </div>
        )}

        {/* Contract table */}
        <div className="flex-1 overflow-y-auto px-8 pb-4">
          <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50">
                  <th className="w-10 py-3 px-4">
                    <input
                      type="checkbox"
                      checked={allSelected}
                      onChange={toggleSelectAll}
                      className="h-3.5 w-3.5 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
                    />
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Contract
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Owner
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Expiry
                  </th>
                  <th className="py-3 px-4 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Value
                  </th>
                  <th className="w-[140px] py-3 px-4 text-right text-[11px] uppercase tracking-wider font-semibold text-slate-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {paginatedContracts.map((contract) => {
                  const days = daysUntil(contract.expiryDate);
                  const insight = getRowInsight(contract);
                  const statusInfo = getBusinessStatusLabel(contract);
                  const StatusIcon = getStatusIcon(contract.status);
                  const isSelected = selectedRows.has(contract.id);
                  const isPreviewing = previewContract?.id === contract.id;

                  return (
                    <tr
                      key={contract.id}
                      className={`border-b border-slate-100 transition-colors group ${
                        isPreviewing
                          ? 'bg-ocean-50/40'
                          : isSelected
                          ? 'bg-ocean-50/30'
                          : 'hover:bg-slate-25'
                      }`}
                    >
                      {/* Checkbox */}
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleRow(contract.id)}
                          className="h-3.5 w-3.5 rounded border-slate-300 text-ocean-600 focus:ring-ocean-500"
                        />
                      </td>

                      {/* Contract — enriched with counterparty, category, insight */}
                      <td className="py-3 px-4 max-w-[320px]">
                        <button
                          className="text-left w-full"
                          onClick={() => setPreviewContract(contract)}
                        >
                          <p className="text-[13px] font-semibold text-slate-900 leading-snug truncate hover:text-ocean-600 transition-colors">
                            {contract.name}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1">
                            <span className="text-[11px] text-slate-400">{contract.id}</span>
                            <span className="text-slate-300">&middot;</span>
                            <Building2 className="w-3 h-3 text-slate-300" />
                            <span className="text-[11px] text-slate-500 truncate">{contract.counterparty}</span>
                            <span className="text-slate-300">&middot;</span>
                            <span className="text-[11px] text-slate-400">{contract.category}</span>
                          </div>
                        </button>
                        {/* AI insight row */}
                        {insight && (
                          <div className={`mt-1.5 flex items-center gap-1.5 ${
                            insight.type === 'risk' ? 'text-red-500' :
                            insight.type === 'warning' ? 'text-amber-500' :
                            'text-ocean-500'
                          }`}>
                            <Sparkles className="w-3 h-3 shrink-0" />
                            <span className="text-[11px] leading-snug truncate">{insight.text}</span>
                          </div>
                        )}
                      </td>

                      {/* Owner */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-ocean-100 text-[10px] font-semibold text-ocean-700">
                            {getInitial(contract.owner)}
                          </div>
                          <span className="text-[12px] text-slate-600">{contract.owner}</span>
                        </div>
                      </td>

                      {/* Status — business-relevant */}
                      <td className="py-3 px-4">
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-flex items-center gap-1 w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadgeClasses(contract.status)}`}>
                            <StatusIcon className="w-3 h-3" />
                            {statusInfo.label}
                          </span>
                          {statusInfo.detail && (
                            <span className="text-[10px] text-slate-400 pl-0.5">{statusInfo.detail}</span>
                          )}
                        </div>
                      </td>

                      {/* Expiry */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-1.5">
                          {days <= 30 && days > 0 && <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />}
                          {days > 30 && days <= 90 && <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />}
                          <span className={`text-[12px] ${
                            days <= 30 ? 'font-semibold text-red-600' :
                            days <= 90 ? 'font-medium text-amber-600' :
                            'text-slate-500'
                          }`}>
                            {formatDate(contract.expiryDate)}
                          </span>
                        </div>
                        {days <= 90 && days > 0 && (
                          <p className={`text-[10px] mt-0.5 ${days <= 30 ? 'text-red-500' : 'text-amber-500'}`}>
                            {days}d remaining
                          </p>
                        )}
                      </td>

                      {/* Value */}
                      <td className="py-3 px-4 text-right">
                        <span className="text-[13px] font-semibold text-slate-900">
                          {formatCurrency(contract.value)}
                        </span>
                        {contract.value > 100000 && (
                          <p className="text-[10px] text-emerald-500 font-medium mt-0.5">High value</p>
                        )}
                      </td>

                      {/* Inline quick actions */}
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                          <button
                            onClick={(e) => { e.stopPropagation(); setPreviewContract(contract); }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 transition-colors"
                            title="Quick view"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate('/editor'); }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-ocean-600 hover:bg-ocean-50 transition-colors"
                            title="Edit"
                          >
                            <PenLine className="w-3.5 h-3.5" />
                          </button>
                          {['sent', 'awaiting_signature'].includes(contract.status) && (
                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="p-1.5 rounded-md text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors"
                              title="Send reminder"
                            >
                              <Bell className="w-3.5 h-3.5" />
                            </button>
                          )}
                          <button
                            onClick={(e) => { e.stopPropagation(); navigate('/sign-send'); }}
                            className="p-1.5 rounded-md text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
                            title="Send for signature"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="mt-4 flex items-center justify-between pb-4">
            <p className="text-[13px] text-slate-500">
              Showing {totalFiltered === 0 ? 0 : startIdx + 1}–{Math.min(startIdx + ITEMS_PER_PAGE, totalFiltered)} of {totalFiltered} contracts
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </button>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[13px] text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Side preview panel */}
      {previewContract && (
        <PreviewPanel
          contract={previewContract}
          onClose={() => setPreviewContract(null)}
          onEdit={() => navigate('/editor')}
        />
      )}
    </div>
  );
}
