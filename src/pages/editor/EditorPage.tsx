import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../lib/AuthContext';
import { usePaywall } from '../../lib/paywall';
import {
  ArrowLeft,
  Bold,
  Italic,
  Underline,
  Eye,
  Download,
  Send,
  Check,
  MessageSquare,
  Sparkles,
  Variable,
  Pencil,
  Plus,
  Trash2,
  Wand2,
  ShieldCheck,
  FileText,
  Type,
  Users,
  CircleDot,
  AlertCircle,
  CheckCircle2,
  X,
  ArrowRight,
  RotateCcw,
} from 'lucide-react';

// ─── Types ──────────────────────────────────────────────────────────────────

interface Section {
  id: string;
  title: string;
  content: string;
  isList?: boolean;
  listItems?: string[];
}

interface VariableItem {
  name: string;
  value: string;
  filled: boolean;
}

// ─── Initial Data ───────────────────────────────────────────────────────────

const initialSections: Section[] = [
  {
    id: 's-1',
    title: '1. Parties',
    content:
      'This Agreement is made between [Company Name], having its principal place of business at 123 Innovation Drive, Suite 400, San Francisco, CA 94105 (hereinafter referred to as the "Client"), and [Counterparty], having its principal place of business at 456 Enterprise Blvd, New York, NY 10001 (hereinafter referred to as the "Service Provider"). Each Party represents and warrants that it has full authority to enter into and perform its obligations under this Agreement.',
  },
  {
    id: 's-2',
    title: '2. Scope of Services',
    content:
      'The Service Provider agrees to provide professional consulting, software development, and related technology services as described in each Statement of Work ("SOW") executed under this Agreement. Each SOW shall describe the specific services to be performed, deliverables, timelines, milestones, acceptance criteria, and any applicable fees. In the event of a conflict between the terms of this Agreement and any SOW, the terms of this Agreement shall prevail unless the SOW expressly states otherwise and is signed by both Parties.',
  },
  {
    id: 's-3',
    title: '3. Deliverables',
    content:
      'All deliverables shall be provided in accordance with the specifications, timelines, and quality standards set forth in the applicable SOW. The Client shall have a review period of fifteen (15) business days following receipt of each deliverable to inspect and either accept or reject the deliverable. Rejection must be accompanied by a written explanation of the deficiencies. The Service Provider shall have ten (10) business days to cure any identified deficiencies at no additional cost to the Client.',
  },
  {
    id: 's-4',
    title: '4. Fees and Payment',
    content:
      'The Client shall pay the Service Provider fees as outlined in each applicable SOW. Unless otherwise specified, the total contract value shall not exceed [Payment Amount] for the initial term. Invoices shall be submitted monthly and are payable within thirty (30) days of receipt. Late payments shall accrue interest at a rate of 1.5% per month or the maximum rate permitted by law, whichever is less. All fees are exclusive of applicable taxes, which shall be the responsibility of the Client.',
  },
  {
    id: 's-5',
    title: '5. Confidentiality',
    content:
      'Each Party agrees to maintain the confidentiality of all proprietary and confidential information disclosed by the other Party during the term of this Agreement and for a period of five (5) years following its termination. Confidential Information shall include, without limitation, business plans, technical data, trade secrets, customer lists, financial information, and any information marked as "Confidential" or that a reasonable person would understand to be confidential.',
  },
  {
    id: 's-6',
    title: '6. Intellectual Property',
    content:
      'All intellectual property rights in the deliverables created under this Agreement shall be assigned to the Client upon full payment of all applicable fees. The Service Provider retains ownership of any pre-existing intellectual property, tools, frameworks, and methodologies, and hereby grants the Client a non-exclusive, perpetual, royalty-free license to use such pre-existing materials solely as incorporated in the deliverables.',
  },
  {
    id: 's-7',
    title: '7. Term and Termination',
    content:
      'This Agreement shall commence on [Effective Date] and shall continue for a period of [Term Length] unless terminated earlier in accordance with this section. Either Party may terminate this Agreement:',
    isList: true,
    listItems: [
      'For convenience, upon sixty (60) days\' prior written notice;',
      'Immediately upon written notice if the other Party commits a material breach and fails to cure within thirty (30) days;',
      'Immediately if the other Party becomes insolvent or files for bankruptcy.',
    ],
  },
  {
    id: 's-8',
    title: '8. Limitation of Liability',
    content:
      'To the maximum extent permitted by applicable law, neither Party shall be liable to the other for any indirect, incidental, special, consequential, or punitive damages arising out of or related to this Agreement. Each Party\'s total cumulative liability shall not exceed the total fees paid or payable during the twelve (12) month period preceding the event giving rise to the claim.',
  },
];

const initialVariables: VariableItem[] = [
  { name: 'Company Name', value: 'Acme Corporation', filled: true },
  { name: 'Counterparty', value: 'Widget Inc.', filled: true },
  { name: 'Effective Date', value: 'January 1, 2026', filled: true },
  { name: 'Payment Amount', value: '$50,000', filled: true },
  { name: 'Term Length', value: '24 months', filled: true },
  { name: 'Governing Law', value: 'State of Delaware', filled: true },
  { name: 'Notice Address', value: '', filled: false },
  { name: 'Insurance Minimum', value: '', filled: false },
];

const comments = [
  {
    author: 'Sarah Chen',
    initials: 'SC',
    color: 'bg-rose-100 text-rose-700',
    text: 'Review the indemnification section',
    time: '2 hours ago',
    section: 'Limitation of Liability',
  },
  {
    author: 'James Okafor',
    initials: 'JO',
    color: 'bg-amber-100 text-amber-700',
    text: 'Payment terms look good',
    time: '1 day ago',
    section: 'Fees and Payment',
  },
];

const aiSuggestions = [
  {
    text: 'Add a data protection clause to comply with GDPR requirements',
    action: 'Add clause',
    priority: 'high' as const,
    icon: ShieldCheck,
  },
  {
    text: 'Strengthen the liability cap \u2014 current language may not hold in all jurisdictions',
    action: 'Improve',
    priority: 'medium' as const,
    icon: AlertCircle,
  },
  {
    text: 'Add dispute resolution clause with arbitration as the default mechanism',
    action: 'Add clause',
    priority: 'low' as const,
    icon: FileText,
  },
  {
    text: 'Your confidentiality period (5 years) is standard \u2014 consider extending to 7 years for IP-heavy work',
    action: 'Review',
    priority: 'info' as const,
    icon: Sparkles,
  },
];

const readinessChecklist = [
  { label: 'All parties defined', key: 'parties', done: true },
  { label: 'Payment terms set', key: 'payment', done: true },
  { label: 'Confidentiality clause included', key: 'nda', done: true },
  { label: 'IP assignment clarified', key: 'ip', done: true },
  { label: 'Termination terms specified', key: 'termination', done: true },
  { label: 'All variables filled', key: 'variables', done: false },
  { label: 'Signature blocks ready', key: 'signatures', done: false },
];

const collaborators = [
  { name: 'Sarah Chen', initials: 'SC', color: 'bg-ocean-100 text-ocean-700 ring-ocean-200' },
  { name: 'James Okafor', initials: 'JO', color: 'bg-amber-100 text-amber-700 ring-amber-200' },
];

// ─── Helpers ────────────────────────────────────────────────────────────────

let nextSectionId = 100;
function genSectionId() {
  return `s-new-${nextSectionId++}`;
}

// ─── Sub-components ─────────────────────────────────────────────────────────

function HighlightedVar({
  children,
  active,
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className={`rounded px-1 py-0.5 font-medium cursor-pointer transition-all ${
        active
          ? 'bg-ocean-200 text-ocean-800 ring-2 ring-ocean-300'
          : 'bg-ocean-100 text-ocean-600 hover:bg-ocean-150 hover:ring-1 hover:ring-ocean-200'
      }`}
    >
      {children}
    </span>
  );
}

function MissingVar({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <span
      onClick={(e) => {
        e.stopPropagation();
        onClick?.();
      }}
      className="bg-red-100 text-red-600 rounded px-1 py-0.5 font-medium ring-1 ring-red-200 cursor-pointer hover:bg-red-150"
    >
      {children} <AlertCircle className="w-3 h-3 inline -mt-0.5" />
    </span>
  );
}

function SelectionToolbar({
  position,
  onAction,
}: {
  position: { x: number; y: number };
  onAction: (action: string) => void;
}) {
  const tools = [
    { label: 'Rewrite', icon: RotateCcw },
    { label: 'Simplify', icon: Type },
    { label: 'More Protective', icon: ShieldCheck },
    { label: 'Add Clause', icon: Plus },
  ];

  return (
    <div
      className="fixed z-50 flex items-center gap-0.5 px-1.5 py-1 bg-slate-900 rounded-lg shadow-xl border border-slate-700"
      style={{ left: Math.max(8, position.x), top: Math.max(8, position.y - 48) }}
    >
      <div className="flex items-center gap-0.5 pr-1.5 mr-1 border-r border-slate-700">
        <Sparkles className="w-3 h-3 text-violet-400" />
        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wide">AI</span>
      </div>
      {tools.map((tool) => {
        const Icon = tool.icon;
        return (
          <button
            key={tool.label}
            onClick={() => onAction(tool.label)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-200 rounded-md hover:bg-slate-700 hover:text-white transition-colors whitespace-nowrap"
          >
            <Icon className="w-3 h-3" />
            {tool.label}
          </button>
        );
      })}
    </div>
  );
}

function SectionToolbar({ onAction }: { onAction: (action: string) => void }) {
  return (
    <div className="absolute -right-2 top-0 translate-x-full flex flex-col gap-1 opacity-0 group-hover/section:opacity-100 transition-all duration-200 pl-3 z-10">
      <button
        onClick={() => onAction('edit')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 bg-white rounded-md border border-slate-200 shadow-sm hover:border-ocean-300 hover:text-ocean-600 hover:bg-ocean-50 transition-all whitespace-nowrap"
      >
        <Pencil className="w-3 h-3" />
        Edit
      </button>
      <button
        onClick={() => onAction('ai')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 bg-white rounded-md border border-slate-200 shadow-sm hover:border-violet-300 hover:text-violet-600 hover:bg-violet-50 transition-all whitespace-nowrap"
      >
        <Wand2 className="w-3 h-3" />
        Improve with AI
      </button>
      <button
        onClick={() => onAction('add')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 bg-white rounded-md border border-slate-200 shadow-sm hover:border-emerald-300 hover:text-emerald-600 hover:bg-emerald-50 transition-all whitespace-nowrap"
      >
        <Plus className="w-3 h-3" />
        Add clause
      </button>
      <button
        onClick={() => onAction('delete')}
        className="flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-medium text-slate-500 bg-white rounded-md border border-slate-200 shadow-sm hover:border-red-300 hover:text-red-600 hover:bg-red-50 transition-all whitespace-nowrap"
      >
        <Trash2 className="w-3 h-3" />
        Remove
      </button>
    </div>
  );
}

function AddClauseDivider({ onAdd }: { onAdd: () => void }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="relative py-3 flex items-center justify-center group/divider cursor-pointer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onAdd}
    >
      <div className={`w-full border-t transition-colors ${hovered ? 'border-ocean-300' : 'border-transparent'}`} />
      <button
        className={`absolute flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium transition-all ${
          hovered
            ? 'bg-ocean-50 text-ocean-600 border border-ocean-200 shadow-sm scale-100 opacity-100'
            : 'bg-transparent text-transparent border border-transparent scale-95 opacity-0'
        }`}
      >
        <Plus className="w-3 h-3" />
        Add clause here
      </button>
    </div>
  );
}

function AiOverlay({ message, onDone }: { message: string; onDone: () => void }) {
  useEffect(() => {
    const timer = setTimeout(onDone, 2000);
    return () => clearTimeout(timer);
  }, [onDone]);

  return (
    <div className="absolute inset-0 bg-violet-50/80 backdrop-blur-[2px] rounded-lg flex items-center justify-center z-20">
      <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-lg border border-violet-200">
        <div className="w-6 h-6 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
        <div>
          <p className="text-[13px] font-semibold text-slate-800">{message}</p>
          <p className="text-[11px] text-slate-400">AI is processing...</p>
        </div>
      </div>
    </div>
  );
}

// ─── Render variable-aware content ──────────────────────────────────────────

function renderContent(
  text: string,
  highlightedVar: string | null,
  setHighlightedVar: (name: string | null) => void,
  missingVarNames: string[],
  onMissingClick: () => void
) {
  const regex = /\[([^\]]+)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index));
    }
    const varName = match[1];
    const isMissing = missingVarNames.includes(varName);
    if (isMissing) {
      parts.push(
        <MissingVar key={match.index} onClick={onMissingClick}>
          {varName}
        </MissingVar>
      );
    } else {
      parts.push(
        <HighlightedVar
          key={match.index}
          active={highlightedVar === varName}
          onClick={() => setHighlightedVar(highlightedVar === varName ? null : varName)}
        >
          {varName}
        </HighlightedVar>
      );
    }
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }
  return parts;
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function EditorPage() {
  const navigate = useNavigate();
  const { profile } = useAuth();
  const { checkSendLimit } = usePaywall();
  const [showGuide, setShowGuide] = useState(true);
  const [activeSection, setActiveSection] = useState(0);
  const [activeTab, setActiveTab] = useState<'ai' | 'variables' | 'comments'>('ai');
  const [highlightedVar, setHighlightedVar] = useState<string | null>(null);
  const [editingVar, setEditingVar] = useState<number | null>(null);

  // Auto-fill variables from user profile
  const autoFilledVars: VariableItem[] = initialVariables.map((v) => {
    if (v.name === 'Company Name' && profile?.company_name) return { ...v, value: profile.company_name, filled: true };
    if (v.name === 'Effective Date') return { ...v, value: new Date().toISOString().split('T')[0], filled: true };
    return v;
  });
  const [varValues, setVarValues] = useState<VariableItem[]>(autoFilledVars);
  const [showSelection, setShowSelection] = useState<{ x: number; y: number } | null>(null);
  const [docSections, setDocSections] = useState<Section[]>(initialSections);
  const [editingSectionId, setEditingSectionId] = useState<string | null>(null);
  const [aiProcessing, setAiProcessing] = useState<{ sectionId: string; message: string } | null>(null);
  const [aiChatInput, setAiChatInput] = useState('');
  const [aiChatMessages, setAiChatMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const missingVarNames = varValues.filter((v) => !v.filled).map((v) => v.name);
  const filledVars = varValues.filter((v) => v.filled).length;
  const totalVars = varValues.length;
  const missingVars = varValues.filter((v) => !v.filled);
  const checklistDone = readinessChecklist.filter((c) => c.done).length;
  const checklistTotal = readinessChecklist.length;
  const isReady = checklistDone === checklistTotal;

  const outlineNames = docSections.map((s) => s.title.replace(/^\d+\.\s*/, ''));

  // ─── Selection detection ────────────────────────────────────────────────

  const handleMouseUp = useCallback(() => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim().length > 3 && canvasRef.current?.contains(selection.anchorNode)) {
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();
      setShowSelection({ x: rect.left + rect.width / 2 - 150, y: rect.top });
    } else {
      setShowSelection(null);
    }
  }, []);

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => document.removeEventListener('mouseup', handleMouseUp);
  }, [handleMouseUp]);

  // ─── Section actions ────────────────────────────────────────────────────

  function handleSectionAction(sectionId: string, action: string) {
    const idx = docSections.findIndex((s) => s.id === sectionId);
    if (idx === -1) return;

    switch (action) {
      case 'edit': {
        setEditingSectionId(sectionId);
        setTimeout(() => {
          const el = sectionRefs.current[sectionId];
          if (el) {
            const contentEl = el.querySelector('[contenteditable]') as HTMLElement;
            if (contentEl) contentEl.focus();
          }
        }, 50);
        break;
      }
      case 'ai': {
        setAiProcessing({ sectionId, message: `Improving "${docSections[idx].title}"` });
        break;
      }
      case 'add': {
        insertClauseAfter(idx);
        break;
      }
      case 'delete': {
        if (docSections.length > 1) {
          const updated = docSections.filter((s) => s.id !== sectionId);
          const renumbered = updated.map((s, i) => ({
            ...s,
            title: `${i + 1}. ${s.title.replace(/^\d+\.\s*/, '')}`,
          }));
          setDocSections(renumbered);
        }
        break;
      }
    }
  }

  function insertClauseAfter(idx: number) {
    const newId = genSectionId();
    const newSection: Section = {
      id: newId,
      title: `${idx + 2}. New Clause`,
      content: 'Enter the terms of this clause here. Click to edit.',
    };
    const updated = [...docSections];
    updated.splice(idx + 1, 0, newSection);
    const renumbered = updated.map((s, i) => ({
      ...s,
      title: `${i + 1}. ${s.title.replace(/^\d+\.\s*/, '')}`,
    }));
    setDocSections(renumbered);
    setEditingSectionId(newId);
    setTimeout(() => {
      sectionRefs.current[newId]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  }

  function handleContentChange(sectionId: string, newContent: string) {
    setDocSections((prev) =>
      prev.map((s) => (s.id === sectionId ? { ...s, content: newContent } : s))
    );
  }

  function handleTitleChange(sectionId: string, newTitle: string) {
    setDocSections((prev) =>
      prev.map((s, i) => (s.id === sectionId ? { ...s, title: `${i + 1}. ${newTitle}` } : s))
    );
  }

  function handleSelectionAction(action: string) {
    setShowSelection(null);
    window.getSelection()?.removeAllRanges();
    if (action === 'Add Clause') {
      insertClauseAfter(docSections.length - 1);
    } else {
      setAiProcessing({ sectionId: '__selection__', message: `${action} selected text` });
    }
  }

  function handleAiProcessingDone() {
    setAiProcessing(null);
  }

  // ─── Variable actions ───────────────────────────────────────────────────

  function updateVarValue(idx: number, newValue: string) {
    setVarValues((prev) =>
      prev.map((v, i) =>
        i === idx ? { ...v, value: newValue, filled: newValue.trim().length > 0 } : v
      )
    );
  }

  // ─── AI chat ────────────────────────────────────────────────────────────

  function handleAiChat() {
    if (!aiChatInput.trim()) return;
    const userMsg = aiChatInput.trim();
    setAiChatMessages((prev) => [...prev, { role: 'user', text: userMsg }]);
    setAiChatInput('');
    setTimeout(() => {
      let response = 'I\'ve analyzed your contract. ';
      if (userMsg.toLowerCase().includes('enforceable')) {
        response += 'The limitation of liability clause may face challenges in certain jurisdictions. I\'d recommend adding a severability clause to strengthen enforceability.';
      } else if (userMsg.toLowerCase().includes('payment')) {
        response += 'Your payment terms specify Net 30 with 1.5% monthly late fees. This is standard for B2B service agreements. The total value cap is set at $50,000.';
      } else if (userMsg.toLowerCase().includes('risk')) {
        response += 'Key risks: (1) No dispute resolution mechanism specified, (2) Confidentiality period of 5 years may be short for IP-heavy work, (3) No force majeure clause.';
      } else {
        response += 'This MSA covers 8 key sections. I\'d recommend adding data protection and dispute resolution clauses for more comprehensive coverage.';
      }
      setAiChatMessages((prev) => [...prev, { role: 'ai', text: response }]);
    }, 1200);
  }

  // ─── Config ─────────────────────────────────────────────────────────────

  const rightTabs = [
    { key: 'ai' as const, label: 'AI', icon: Sparkles },
    { key: 'variables' as const, label: 'Variables', icon: Variable },
    { key: 'comments' as const, label: 'Comments', icon: MessageSquare },
  ];

  const priorityColors: Record<string, string> = {
    high: 'border-l-red-400 bg-red-50/40',
    medium: 'border-l-amber-400 bg-amber-50/40',
    low: 'border-l-ocean-400 bg-ocean-50/40',
    info: 'border-l-violet-400 bg-violet-50/40',
  };

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="flex flex-col h-[calc(100vh-64px)]"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* ── Top Toolbar ────────────────────────────────────────────────── */}
      <div className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors">
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-px h-6 bg-slate-200" />
          <input
            type="text"
            defaultValue="Master Service Agreement"
            className="text-[14px] font-semibold text-slate-800 bg-transparent border-none outline-none hover:bg-slate-50 focus:bg-slate-50 rounded px-2 py-1 transition-colors w-64"
          />
          <span className="text-[11px] font-medium bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">Draft</span>
          {isReady ? (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <CheckCircle2 className="w-3 h-3" />
              Ready to send
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-0.5 rounded-full">
              <AlertCircle className="w-3 h-3" />
              {checklistTotal - checklistDone} items remaining
            </span>
          )}
          {missingVars.length > 0 && (
            <button onClick={() => setActiveTab('variables')} className="flex items-center gap-1.5 text-[11px] font-medium text-red-500 hover:text-red-600 transition-colors">
              <CircleDot className="w-3 h-3" />
              {missingVars.length} missing field{missingVars.length > 1 ? 's' : ''}
            </button>
          )}
        </div>

        <div className="flex items-center gap-1">
          {[Bold, Italic, Underline].map((Icon, i) => (
            <button
              key={i}
              onClick={() => document.execCommand(['bold', 'italic', 'underline'][i], false)}
              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
            >
              <Icon className="w-4 h-4" />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          {/* Confidence signals */}
          <div className="flex items-center gap-3 mr-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              Auto-saved
            </span>
            <span className="hidden lg:flex items-center gap-1 text-[11px] text-slate-300">
              <ShieldCheck className="w-3 h-3" />
              Secure
            </span>
          </div>

          {/* Collaborators */}
          <div className="flex -space-x-1.5 mr-2">
            {collaborators.map((c) => (
              <div key={c.name} className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center text-[10px] font-bold ring-2 ring-white`} title={c.name}>
                {c.initials}
              </div>
            ))}
            <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center ring-2 ring-white">
              <Users className="w-3 h-3" />
            </div>
          </div>

          {/* Secondary actions */}
          <button onClick={() => navigate('/pdf-export')} className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Eye className="w-3.5 h-3.5" />
            Preview
          </button>
          <button className="flex items-center gap-1.5 px-3 py-1.5 text-[12px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>

          {/* Primary CTA — prominent */}
          <button onClick={() => { if (checkSendLimit()) navigate('/sign-send'); }} className="flex items-center gap-2 px-4 py-2 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm">
            <Send className="w-4 h-4" />
            Send Contract
          </button>
        </div>
      </div>

      {/* ── Three-panel layout ─────────────────────────────────────────── */}
      <div className="flex flex-1 overflow-hidden">
        {/* ── Left Sidebar ────────────────────────────────────────────── */}
        <div className="w-56 bg-white border-r border-slate-200 overflow-y-auto flex-shrink-0 flex flex-col">
          <div className="px-4 pt-4 pb-2">
            <h3 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Document Outline</h3>
          </div>
          <nav className="px-2 pb-4">
            {outlineNames.map((name, i) => {
              const isActive = activeSection === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    setActiveSection(i);
                    if (docSections[i]) {
                      sectionRefs.current[docSections[i].id]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className={`w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-lg text-[13px] transition-all mb-0.5 ${
                    isActive
                      ? 'bg-ocean-50 text-ocean-700 font-medium border-l-2 border-ocean-500'
                      : 'text-slate-600 hover:bg-slate-50 border-l-2 border-transparent'
                  }`}
                >
                  <span className={`w-5 h-5 rounded flex items-center justify-center text-[11px] font-semibold flex-shrink-0 ${isActive ? 'bg-ocean-100 text-ocean-600' : 'bg-slate-100 text-slate-400'}`}>
                    {i + 1}
                  </span>
                  <span className="truncate">{name}</span>
                </button>
              );
            })}
          </nav>
          <div className="flex-1" />

          {/* Readiness checklist */}
          <div className="border-t border-slate-200 p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Readiness</h3>
              <span className="text-[11px] font-semibold text-slate-400">{checklistDone}/{checklistTotal}</span>
            </div>
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-3">
              <div className={`h-full rounded-full transition-all duration-500 ${isReady ? 'bg-emerald-500' : 'bg-ocean-500'}`} style={{ width: `${(checklistDone / checklistTotal) * 100}%` }} />
            </div>
            <div className="space-y-1.5">
              {readinessChecklist.map((item) => (
                <div key={item.key} className="flex items-center gap-2">
                  {item.done ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <CircleDot className="w-3.5 h-3.5 text-slate-300 shrink-0" />}
                  <span className={`text-[11.5px] ${item.done ? 'text-slate-400 line-through' : 'text-slate-600 font-medium'}`}>{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Editor Canvas ────────────────────────────────────────── */}
        <div className="flex-1 bg-slate-50 overflow-y-auto" ref={canvasRef}>
          {/* First-time guided helper */}
          {showGuide && (
            <div className="max-w-3xl mx-auto mt-6 mb-0 px-5 py-4 bg-gradient-to-r from-ocean-50 to-violet-50 border border-ocean-200 rounded-xl flex items-center gap-5">
              <div className="flex items-center gap-6 flex-1">
                {[
                  { step: '1', label: 'Review contract', desc: 'Check the pre-filled sections below' },
                  { step: '2', label: 'Add details', desc: 'Fill in counterparty and terms' },
                  { step: '3', label: 'Send contract', desc: 'Click "Send Contract" when ready' },
                ].map((s, i) => (
                  <div key={s.step} className="flex items-center gap-2.5">
                    <div className="w-6 h-6 rounded-full bg-ocean-600 text-white flex items-center justify-center text-[11px] font-bold shrink-0">{s.step}</div>
                    <div>
                      <p className="text-[12px] font-semibold text-slate-700">{s.label}</p>
                      <p className="text-[10px] text-slate-400">{s.desc}</p>
                    </div>
                    {i < 2 && <div className="w-6 h-px bg-ocean-200 ml-2" />}
                  </div>
                ))}
              </div>
              <button onClick={() => setShowGuide(false)} className="text-[11px] font-medium text-slate-400 hover:text-slate-600 transition-colors shrink-0">
                Dismiss
              </button>
            </div>
          )}

          <div className="max-w-3xl mx-auto bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08),0_4px_12px_rgba(0,0,0,0.04)] rounded-lg my-6 px-16 py-12 relative">
            {/* Title */}
            <h1
              contentEditable
              suppressContentEditableWarning
              className="text-center text-[18px] font-bold text-slate-900 tracking-wide mb-1 outline-none focus:bg-slate-50 focus:rounded px-2 py-1 transition-colors"
            >
              MASTER SERVICE AGREEMENT
            </h1>
            <div className="w-16 h-0.5 bg-slate-200 mx-auto mb-8 rounded-full" />

            {/* Preamble */}
            <div
              contentEditable
              suppressContentEditableWarning
              className="text-[13.5px] leading-relaxed text-slate-700 mb-6 outline-none focus:bg-slate-25 focus:rounded px-1 -mx-1 transition-colors"
            >
              This Master Service Agreement (the{' '}
              <span className="font-semibold">{'\u201c'}Agreement{'\u201d'}</span>) is entered into as of{' '}
              {renderContent('[Effective Date]', highlightedVar, setHighlightedVar, missingVarNames, () => setActiveTab('variables'))}{' '}
              by and between{' '}
              {renderContent('[Company Name]', highlightedVar, setHighlightedVar, missingVarNames, () => setActiveTab('variables'))}
              , a corporation organized and existing under the laws of{' '}
              {renderContent('[Governing Law]', highlightedVar, setHighlightedVar, missingVarNames, () => setActiveTab('variables'))}{' '}
              (the <span className="font-semibold">{'\u201c'}Company{'\u201d'}</span>), and{' '}
              {renderContent('[Counterparty]', highlightedVar, setHighlightedVar, missingVarNames, () => setActiveTab('variables'))}{' '}
              (the <span className="font-semibold">{'\u201c'}Service Provider{'\u201d'}</span>), collectively
              referred to as the <span className="font-semibold">{'\u201c'}Parties{'\u201d'}</span>.
            </div>

            {/* ── Sections ──────────────────────────────────────────────── */}
            {docSections.map((section, idx) => {
              const isEditing = editingSectionId === section.id;
              const isProcessing = aiProcessing?.sectionId === section.id;

              return (
                <div key={section.id}>
                  <div
                    ref={(el) => { sectionRefs.current[section.id] = el; }}
                    className={`relative group/section rounded-lg transition-all ${isEditing ? 'ring-2 ring-ocean-200 bg-ocean-50/30 p-4 -mx-4' : ''}`}
                  >
                    <SectionToolbar onAction={(action) => handleSectionAction(section.id, action)} />

                    {isProcessing && <AiOverlay message={aiProcessing.message} onDone={handleAiProcessingDone} />}

                    {/* Section title */}
                    <h2
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const raw = e.currentTarget.textContent || '';
                        const nameOnly = raw.replace(/^\d+\.\s*/, '');
                        handleTitleChange(section.id, nameOnly);
                      }}
                      className="font-semibold text-[15px] text-slate-900 mb-3 outline-none focus:bg-slate-50 focus:rounded px-1 -mx-1 transition-colors"
                    >
                      {section.title}
                    </h2>

                    {/* Section content */}
                    <div
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => handleContentChange(section.id, e.currentTarget.innerText)}
                      className={`text-[13.5px] leading-relaxed text-slate-700 mb-2 outline-none focus:bg-slate-25 focus:rounded px-1 -mx-1 transition-colors ${section.id === 's-8' ? 'uppercase' : ''}`}
                      style={section.id === 's-8' ? { fontSize: '12.5px' } : undefined}
                    >
                      {renderContent(section.content, highlightedVar, setHighlightedVar, missingVarNames, () => setActiveTab('variables'))}
                    </div>

                    {section.isList && section.listItems && (
                      <ul className="text-[13.5px] leading-relaxed text-slate-700 mb-2 list-disc pl-8 space-y-1">
                        {section.listItems.map((item, li) => (
                          <li key={li} contentEditable suppressContentEditableWarning className="outline-none focus:bg-slate-25 focus:rounded px-1 transition-colors">
                            {item}
                          </li>
                        ))}
                      </ul>
                    )}

                    {isEditing && (
                      <div className="flex items-center justify-end gap-2 mt-3 pt-3 border-t border-ocean-200">
                        <button onClick={() => setEditingSectionId(null)} className="text-[11px] font-medium text-slate-500 hover:text-slate-700 px-3 py-1.5 rounded-md transition-colors">
                          Done editing
                        </button>
                      </div>
                    )}
                  </div>

                  {idx < docSections.length - 1 && <AddClauseDivider onAdd={() => insertClauseAfter(idx)} />}
                </div>
              );
            })}

            <AddClauseDivider onAdd={() => insertClauseAfter(docSections.length - 1)} />

            {/* Missing variable notice */}
            {missingVars.length > 0 && (
              <div className="mt-8 p-4 rounded-lg bg-amber-50/60 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                <div>
                  <p className="text-[12px] font-semibold text-amber-700">{missingVars.length} variable{missingVars.length > 1 ? 's' : ''} not yet defined</p>
                  <p className="text-[11px] text-amber-600 mt-0.5">{missingVars.map((v) => v.name).join(', ')} — fill these before sending for signature.</p>
                  <button onClick={() => setActiveTab('variables')} className="text-[11px] font-semibold text-amber-700 hover:text-amber-800 flex items-center gap-1 mt-2 transition-colors">
                    Go to Variables <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ── Right Sidebar ─────────────────────────────────────────────── */}
        <div className="w-80 bg-white border-l border-slate-200 flex flex-col flex-shrink-0 overflow-hidden">
          <div className="flex border-b border-slate-200 flex-shrink-0">
            {rightTabs.map((tab) => {
              const isActive = activeTab === tab.key;
              const badge = tab.key === 'variables' && missingVars.length > 0 ? missingVars.length : tab.key === 'comments' ? comments.length : null;
              return (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key)}
                  className={`flex-1 flex items-center justify-center gap-1.5 py-3 text-[11.5px] font-medium transition-colors border-b-2 ${isActive ? 'text-ocean-600 border-ocean-500' : 'text-slate-400 border-transparent hover:text-slate-600'}`}
                >
                  <tab.icon className="w-3.5 h-3.5" />
                  {tab.label}
                  {badge !== null && (
                    <span className={`text-[10px] font-bold rounded-full px-1.5 py-0 ${tab.key === 'variables' && !isActive ? 'bg-red-100 text-red-600' : isActive ? 'bg-ocean-100 text-ocean-600' : 'bg-slate-100 text-slate-500'}`}>
                      {badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          <div className="flex-1 overflow-y-auto">
            {/* ── AI Tab ────────────────────────────────────────────── */}
            {activeTab === 'ai' && (
              <div className="flex flex-col h-full">
                <div className="p-4 pb-3 bg-gradient-to-br from-slate-900 to-slate-800 text-white">
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-ocean-400 to-violet-500 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h3 className="text-[13px] font-semibold">Contract AI Assistant</h3>
                      <p className="text-[10.5px] text-slate-400">Analyzing your agreement in real-time</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <div className="flex-1 h-1 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full w-[72%] bg-gradient-to-r from-ocean-400 to-emerald-400 rounded-full" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-400">72% coverage</span>
                  </div>
                </div>

                <div className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Suggestions ({aiSuggestions.length})</h4>
                    <div className="space-y-2">
                      {aiSuggestions.map((s, i) => {
                        const Icon = s.icon;
                        return (
                          <div key={i} className={`p-3 rounded-lg border-l-[3px] border border-slate-100 hover:shadow-sm transition-all cursor-pointer ${priorityColors[s.priority]}`}>
                            <div className="flex items-start gap-2.5">
                              <Icon className="w-3.5 h-3.5 text-slate-500 mt-0.5 flex-shrink-0" />
                              <div className="flex-1 min-w-0">
                                <p className="text-[12px] text-slate-700 leading-snug">{s.text}</p>
                                <button
                                  onClick={() => {
                                    if (s.action === 'Add clause') insertClauseAfter(docSections.length - 1);
                                    else setAiProcessing({ sectionId: '__suggestion__', message: `Applying: ${s.text.slice(0, 40)}...` });
                                  }}
                                  className="mt-2 text-[11px] font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-1 transition-colors"
                                >
                                  {s.action} <ArrowRight className="w-3 h-3" />
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Quick Rewrite</h4>
                    <p className="text-[11px] text-slate-400 mb-2">Select text in the document, then choose a tone:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['More Formal', 'More Concise', 'More Protective', 'More Friendly', 'More Balanced'].map((tone) => (
                        <button
                          key={tone}
                          onClick={() => setAiProcessing({ sectionId: '__rewrite__', message: `Rewriting in "${tone}" tone` })}
                          className="text-[11px] font-medium text-slate-600 bg-slate-50 hover:bg-ocean-50 hover:text-ocean-600 px-2.5 py-1.5 rounded-lg transition-colors border border-slate-200 hover:border-ocean-200"
                        >
                          {tone}
                        </button>
                      ))}
                    </div>
                  </div>

                  {aiChatMessages.length > 0 && (
                    <div>
                      <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2.5">Conversation</h4>
                      <div className="space-y-3">
                        {aiChatMessages.map((msg, i) => (
                          <div key={i} className={`p-3 rounded-lg text-[12px] leading-snug ${msg.role === 'user' ? 'bg-ocean-50 text-ocean-800 ml-4' : 'bg-slate-50 text-slate-700 mr-4 border border-slate-200'}`}>
                            <div className="flex items-center gap-1.5 mb-1">
                              {msg.role === 'ai' && <Sparkles className="w-3 h-3 text-violet-500" />}
                              <span className="text-[10px] font-semibold text-slate-400">{msg.role === 'user' ? 'You' : 'AI Assistant'}</span>
                            </div>
                            {msg.text}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-3 border-t border-slate-200 flex-shrink-0 bg-slate-25">
                  <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 px-3 py-2.5 shadow-sm focus-within:border-ocean-300 focus-within:ring-2 focus-within:ring-ocean-50 transition-all">
                    <Sparkles className="w-4 h-4 text-violet-400 flex-shrink-0" />
                    <input
                      type="text"
                      placeholder="Ask AI about this contract..."
                      value={aiChatInput}
                      onChange={(e) => setAiChatInput(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleAiChat()}
                      className="flex-1 bg-transparent text-[12.5px] text-slate-700 placeholder-slate-400 outline-none"
                    />
                    <button onClick={handleAiChat} className="p-1 rounded-md bg-ocean-600 hover:bg-ocean-700 transition-colors">
                      <ArrowRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                  <p className="text-[10px] text-slate-400 mt-1.5 px-1">
                    Try: {'\u201c'}Is this enforceable in California?{'\u201d'} or {'\u201c'}Summarize payment terms{'\u201d'}
                  </p>
                </div>
              </div>
            )}

            {/* ── Variables Tab ────────────────────────────────────────── */}
            {activeTab === 'variables' && (
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Contract Variables</h4>
                  <span className="text-[11px] font-semibold text-slate-400">{filledVars}/{totalVars} filled</span>
                </div>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-4">
                  <div className={`h-full rounded-full transition-all ${filledVars === totalVars ? 'bg-emerald-500' : 'bg-ocean-500'}`} style={{ width: `${(filledVars / totalVars) * 100}%` }} />
                </div>
                {missingVars.length > 0 && (
                  <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 flex items-start gap-2.5">
                    <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 shrink-0" />
                    <div>
                      <p className="text-[11.5px] font-semibold text-red-700">{missingVars.length} required variable{missingVars.length > 1 ? 's' : ''} missing</p>
                      <p className="text-[10.5px] text-red-600 mt-0.5">Fill all variables before sending for signature.</p>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  {varValues.map((v, i) => {
                    const isHighlighted = highlightedVar === v.name;
                    const isEditingThis = editingVar === i;
                    return (
                      <div
                        key={i}
                        className={`flex items-center justify-between p-2.5 rounded-lg group transition-all cursor-pointer ${isHighlighted ? 'bg-ocean-50 ring-1 ring-ocean-200' : !v.filled ? 'bg-red-50/50 hover:bg-red-50' : 'hover:bg-slate-50'}`}
                        onClick={() => { if (!isEditingThis) setHighlightedVar(isHighlighted ? null : v.name); }}
                      >
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            {!v.filled && <CircleDot className="w-3 h-3 text-red-400 shrink-0" />}
                            <span className={`text-[11px] font-medium ${!v.filled ? 'text-red-500' : 'text-slate-400'}`}>{v.name}</span>
                            {isHighlighted && <span className="text-[9px] font-semibold text-ocean-500 bg-ocean-100 px-1.5 py-0 rounded-full">highlighted</span>}
                          </div>
                          {isEditingThis ? (
                            <input
                              autoFocus
                              defaultValue={v.value}
                              onBlur={(e) => { updateVarValue(i, e.target.value); setEditingVar(null); }}
                              onKeyDown={(e) => { if (e.key === 'Enter') { updateVarValue(i, (e.target as HTMLInputElement).value); setEditingVar(null); } }}
                              className="mt-0.5 text-[13px] font-medium text-slate-700 bg-white border border-ocean-300 rounded px-2 py-0.5 outline-none ring-2 ring-ocean-100 w-full"
                              onClick={(e) => e.stopPropagation()}
                            />
                          ) : (
                            <div className="text-[13px] font-medium truncate mt-0.5">
                              {v.filled ? <span className="text-slate-700">{v.value}</span> : <span className="text-red-400 italic">Not set — click to fill</span>}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setEditingVar(isEditingThis ? null : i); }}
                          className={`p-1.5 rounded-md transition-all shrink-0 ${isEditingThis ? 'text-ocean-600 bg-ocean-50' : 'text-slate-300 group-hover:text-slate-500 hover:bg-slate-100 opacity-0 group-hover:opacity-100'}`}
                        >
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ── Comments Tab ────────────────────────────────────────── */}
            {activeTab === 'comments' && (
              <div className="flex flex-col h-full">
                <div className="flex-1 p-4 space-y-4">
                  <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Comments ({comments.length})</h4>
                  {comments.map((c, i) => (
                    <div key={i} className="flex gap-2.5 group">
                      <div className={`w-7 h-7 rounded-full ${c.color} flex items-center justify-center text-[10px] font-bold flex-shrink-0`}>{c.initials}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-[12.5px] font-semibold text-slate-800">{c.author}</span>
                          <span className="text-[11px] text-slate-400">{c.time}</span>
                        </div>
                        <p className="text-[11px] text-slate-400 mt-0.5">on {c.section}</p>
                        <p className="text-[12.5px] text-slate-600 mt-1 leading-snug">{c.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-slate-200 flex-shrink-0">
                  <div className="flex items-center gap-2 bg-slate-50 rounded-lg border border-slate-200 px-3 py-2.5">
                    <input type="text" placeholder="Add a comment..." className="flex-1 bg-transparent text-[12.5px] text-slate-700 placeholder-slate-400 outline-none" />
                    <button className="p-1 rounded-md bg-ocean-600 hover:bg-ocean-700 transition-colors">
                      <Plus className="w-3.5 h-3.5 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Floating selection toolbar */}
      {showSelection && <SelectionToolbar position={showSelection} onAction={handleSelectionAction} />}

      {/* Global AI processing toast */}
      {aiProcessing && !docSections.find((s) => s.id === aiProcessing.sectionId) && (
        <div className="fixed bottom-6 right-96 z-50 flex items-center gap-3 bg-white px-5 py-3 rounded-xl shadow-xl border border-violet-200">
          <div className="w-5 h-5 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
          <div>
            <p className="text-[12px] font-semibold text-slate-800">{aiProcessing.message}</p>
            <p className="text-[10px] text-slate-400">AI is processing...</p>
          </div>
          <button onClick={handleAiProcessingDone} className="p-1 rounded-md hover:bg-slate-100 text-slate-400">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
