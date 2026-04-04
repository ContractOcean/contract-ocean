import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Clock,
  Users,
  Star,
  Sparkles,
  Search,
  Plus,
  Eye,
  ArrowRight,
  Lightbulb,
  X,
  Briefcase,
  UserPlus,
  Handshake,
  ShieldCheck,
  PenTool,
  Building2,
  CheckCircle2,
  ChevronRight,
  History,
  Target,
} from "lucide-react";
import { useTemplates, type Template } from "../../hooks/useTemplates";
import { useContacts } from "../../hooks/useContacts";

// ─── Constants ──────────────────────────────────────────────────────────────

const categories = [
  "All", "Service", "Sales", "Employment", "NDA", "Freelancer",
  "Consulting", "Vendor", "Partnership", "Marketing", "Operations",
];

const categoryColors: Record<string, { bg: string; text: string }> = {
  Service: { bg: "bg-blue-50", text: "text-blue-700" },
  Sales: { bg: "bg-emerald-50", text: "text-emerald-700" },
  Employment: { bg: "bg-violet-50", text: "text-violet-700" },
  NDA: { bg: "bg-amber-50", text: "text-amber-700" },
  Freelancer: { bg: "bg-pink-50", text: "text-pink-700" },
  Consulting: { bg: "bg-cyan-50", text: "text-cyan-700" },
  Vendor: { bg: "bg-orange-50", text: "text-orange-700" },
  Partnership: { bg: "bg-indigo-50", text: "text-indigo-700" },
  Marketing: { bg: "bg-rose-50", text: "text-rose-700" },
  Operations: { bg: "bg-slate-100", text: "text-slate-700" },
};

const useCaseActions = [
  { label: "Hire an employee", icon: UserPlus, categories: ["Employment"], color: "bg-violet-50 text-violet-700 border-violet-200 hover:bg-violet-100" },
  { label: "Work with a freelancer", icon: PenTool, categories: ["Freelancer", "Consulting"], color: "bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100" },
  { label: "Close a client deal", icon: Briefcase, categories: ["Sales", "Service"], color: "bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100" },
  { label: "Protect confidential info", icon: ShieldCheck, categories: ["NDA"], color: "bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100" },
  { label: "Partner with a business", icon: Handshake, categories: ["Partnership", "Marketing"], color: "bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100" },
];

// Recently used (simulated)
// Recently used will be populated from user activity — empty for new users
const recentlyUsedIds: string[] = [];
// Recommended for you (simulated)
// Recommended templates use the `recommended` boolean flag from DB

// Best-for labels per template
const bestForLabels: Record<string, string> = {
  "TPL-001": "Ongoing vendor relationships",
  "TPL-002": "Pre-deal confidentiality",
  "TPL-003": "SaaS product licensing",
  "TPL-004": "Full-time hiring",
  "TPL-005": "Project-based freelancers",
  "TPL-006": "Advisory engagements",
  "TPL-007": "Supply chain procurement",
  "TPL-008": "Revenue-sharing ventures",
  "TPL-009": "Agency-led campaigns",
  "TPL-010": "Asset or equipment leasing",
  "TPL-011": "Sales rep compensation",
  "TPL-012": "Defining project deliverables",
};

// Simulated company usage
function getCompanyCount(usageCount: number): number {
  return Math.floor(usageCount * 0.4);
}

// ─── Preview Modal ──────────────────────────────────────────────────────────

function PreviewModal({ template, onClose, onUse }: { template: Template; onClose: () => void; onUse: () => void }) {
  const color = categoryColors[template.category] ?? { bg: "bg-slate-100", text: "text-slate-700" };

  const previewSections = [
    { title: "1. Parties", content: "This Agreement is made between [Company Name], having its principal place of business at [Address] (\"Client\"), and [Counterparty Name], having its principal place of business at [Counterparty Address] (\"Service Provider\")." },
    { title: "2. Scope of Services", content: "The Service Provider agrees to provide [Description of Services] as described in each Statement of Work (\"SOW\") executed under this Agreement. Each SOW shall describe the specific services, deliverables, timelines, and applicable fees." },
    { title: "3. Fees and Payment", content: "The Client shall pay the Service Provider fees as outlined in each applicable SOW. Unless otherwise specified, the total value shall not exceed [Payment Amount]. Invoices are payable within [Payment Terms] days of receipt." },
    { title: "4. Confidentiality", content: "Each Party agrees to maintain the confidentiality of all proprietary information disclosed during the term of this Agreement and for [Confidentiality Period] years following its termination." },
    { title: "5. Term and Termination", content: "This Agreement shall commence on [Effective Date] and continue for [Term Length] unless terminated earlier. Either Party may terminate with [Notice Period] days written notice." },
    { title: "6. Governing Law", content: "This Agreement shall be governed by and construed in accordance with the laws of [Governing Jurisdiction], without regard to its conflict of laws provisions." },
  ];

  const editableVars = [
    { name: "Company Name", placeholder: "Your company name" },
    { name: "Counterparty Name", placeholder: "Other party's name" },
    { name: "Payment Amount", placeholder: "e.g. $50,000" },
    { name: "Effective Date", placeholder: "e.g. January 1, 2026" },
    { name: "Term Length", placeholder: "e.g. 24 months" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-4xl max-h-[90vh] bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <div className="flex items-center gap-3">
            <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${color.bg} ${color.text}`}>{template.category}</span>
            <h2 className="text-[16px] font-semibold text-slate-900">{template.name}</h2>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-[12px] text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              {template.estimatedTime} to complete
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 overflow-hidden">
          {/* Contract preview */}
          <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-8 max-w-2xl mx-auto" style={{ fontFamily: "'Georgia', serif" }}>
              <h1 className="text-center text-[16px] font-bold text-slate-900 tracking-wide uppercase mb-1">
                {template.name.toUpperCase()}
              </h1>
              <div className="w-12 h-0.5 bg-slate-300 mx-auto mb-6 rounded-full" />

              {previewSections.map((section, idx) => (
                <div key={idx} className="mb-5">
                  <h3 className="text-[13px] font-bold text-slate-800 mb-2">{section.title}</h3>
                  <p className="text-[12px] leading-[1.8] text-slate-600">
                    {section.content.split(/(\[[^\]]+\])/).map((part, i) =>
                      part.startsWith("[") ? (
                        <span key={i} className="bg-ocean-100 text-ocean-700 rounded px-1 py-0.5 font-medium text-[11px]">
                          {part}
                        </span>
                      ) : (
                        <span key={i}>{part}</span>
                      )
                    )}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right sidebar — variables & info */}
          <div className="w-72 shrink-0 border-l border-slate-200 bg-white overflow-y-auto p-5 flex flex-col gap-5">
            <div>
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Editable Variables</h4>
              <div className="space-y-2.5">
                {editableVars.map((v) => (
                  <div key={v.name}>
                    <label className="block text-[11px] font-medium text-slate-500 mb-1">{v.name}</label>
                    <input
                      placeholder={v.placeholder}
                      className="w-full rounded-lg border border-slate-200 px-3 py-1.5 text-[12px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-1 focus:ring-ocean-100"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Key Sections</h4>
              <div className="space-y-1.5">
                {previewSections.map((s, i) => (
                  <div key={i} className="flex items-center gap-2 text-[12px] text-slate-600">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    {s.title.replace(/^\d+\.\s*/, "")}
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4">
              <p className="text-[12px] text-slate-500 leading-relaxed">{template.description}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-25 shrink-0">
          <div className="flex items-center gap-3 text-[12px] text-slate-400">
            <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{template.usageCount.toLocaleString()} uses</span>
            <span>&middot;</span>
            <span>{getCompanyCount(template.usageCount).toLocaleString()} companies</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Close</button>
            <button onClick={onUse} className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm">
              <FileText className="w-3.5 h-3.5" />
              Use This Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Use Template Modal ─────────────────────────────────────────────────────

function UseTemplateModal({ template, onClose, contacts }: { template: Template; onClose: () => void; contacts: { id: string; name: string; company: string }[] }) {
  const navigate = useNavigate();
  const [selectedContact, setSelectedContact] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [contractTitle, setContractTitle] = useState(template.name);

  function handleProceed() {
    navigate("/editor");
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
          <div>
            <h2 className="text-[16px] font-semibold text-slate-900">Set Up Contract</h2>
            <p className="text-[12px] text-slate-400 mt-0.5">Using: {template.name}</p>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Contract Title</label>
            <input
              value={contractTitle}
              onChange={(e) => setContractTitle(e.target.value)}
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
            />
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Select Contact</label>
            <select
              value={selectedContact}
              onChange={(e) => {
                setSelectedContact(e.target.value);
                const c = contacts.find((ct) => ct.id === e.target.value);
                if (c && !companyName) setCompanyName(c.company);
              }}
              className="w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-[13px] text-slate-700 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
            >
              <option value="">Choose a contact (optional)</option>
              {contacts.map((c) => (
                <option key={c.id} value={c.id}>{c.name} — {c.company}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Company Name</label>
            <input
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Enter company name"
              className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 px-6 py-4 border-t border-slate-200 bg-slate-25">
          <button onClick={onClose} className="px-4 py-2 text-[13px] font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">Cancel</button>
          <button onClick={handleProceed} className="flex items-center gap-2 px-5 py-2 text-[13px] font-semibold text-white bg-ocean-600 rounded-lg hover:bg-ocean-700 transition-colors shadow-sm">
            Open in Editor
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function TemplatesPage() {
  const navigate = useNavigate();
  const { templates, loading } = useTemplates();
  const { contacts } = useContacts();
  const [activeCategory, setActiveCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [activeUseCase, setActiveUseCase] = useState<number | null>(null);
  const [previewTemplate, setPreviewTemplate] = useState<Template | null>(null);
  const [useTemplate, setUseTemplate] = useState<Template | null>(null);

  // Filter logic
  const useCaseCategories = activeUseCase !== null ? useCaseActions[activeUseCase].categories : [];

  const filteredTemplates = templates.filter((t) => {
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    const matchesUseCase = useCaseCategories.length === 0 || useCaseCategories.includes(t.category);
    const q = search.toLowerCase();
    const matchesSearch = q === "" || t.name.toLowerCase().includes(q) || t.category.toLowerCase().includes(q) || t.useCase.toLowerCase().includes(q);
    return matchesCategory && matchesSearch && matchesUseCase;
  });

  const recentlyUsed = templates.filter((t) => recentlyUsedIds.includes(t.id));
  const recommendedForYou = templates.filter((t) => t.recommended);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-7 h-7 rounded-full border-[3px] border-ocean-500 border-t-transparent animate-spin" />
          <p className="text-[13px] text-slate-400">Loading templates...</p>
        </div>
      </div>
    );
  }

  // Empty state
  if (templates.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
        <div className="text-center max-w-md">
          <div className="mx-auto mb-4 rounded-full bg-ocean-50 p-5 w-fit">
            <FileText className="h-10 w-10 text-ocean-500" />
          </div>
          <h2 className="text-[20px] font-bold text-slate-900">No templates yet</h2>
          <p className="mt-2 text-[14px] text-slate-500 leading-relaxed">
            Start with a professionally crafted template or create a custom contract with AI.
          </p>
          <div className="mt-6 flex items-center justify-center gap-3">
            <button onClick={() => navigate("/ai-generator")} className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-ocean-500 to-violet-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm hover:opacity-90 transition-opacity">
              <Sparkles className="h-4 w-4" />
              Generate with AI
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Page Header */}
      <div className="mb-6 flex items-start justify-between">
        <div>
          <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Template Library</h1>
          <p className="mt-1 text-[14px] text-slate-500">
            {templates.length} professional templates &middot; Choose one to get started in minutes
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700">
          <Plus className="h-4 w-4" />
          Create Custom Template
        </button>
      </div>

      {/* ── Use Case Section ─────────────────────────────────────────── */}
      <div className="mb-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-[13px] font-semibold text-slate-700 mb-3">What do you want to do today?</p>
        <div className="flex flex-wrap gap-2">
          {useCaseActions.map((action, idx) => {
            const Icon = action.icon;
            const isActive = activeUseCase === idx;
            return (
              <button
                key={idx}
                onClick={() => {
                  setActiveUseCase(isActive ? null : idx);
                  setActiveCategory("All");
                }}
                className={`inline-flex items-center gap-2 rounded-lg border px-3.5 py-2 text-[13px] font-medium transition-all ${
                  isActive ? action.color + " ring-1" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Icon className="w-4 h-4" />
                {action.label}
                {isActive && <X className="w-3 h-3 ml-0.5 opacity-60" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Personalization: Recently Used ────────────────────────────── */}
      {activeUseCase === null && search === "" && activeCategory === "All" && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-slate-400" />
            <h2 className="text-[14px] font-semibold text-slate-700">Recently Used</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recentlyUsed.map((t) => {
              const color = categoryColors[t.category] ?? { bg: "bg-slate-100", text: "text-slate-700" };
              return (
                <button
                  key={t.id}
                  onClick={() => setUseTemplate(t)}
                  className="shrink-0 flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all w-72"
                >
                  <div className={`w-9 h-9 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                    <FileText className={`w-4 h-4 ${color.text}`} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 truncate">{t.name}</p>
                    <p className="text-[11px] text-slate-400">Used 2 days ago</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 shrink-0 ml-auto" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Personalization: Recommended ──────────────────────────────── */}
      {activeUseCase === null && search === "" && activeCategory === "All" && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-ocean-500" />
            <h2 className="text-[14px] font-semibold text-slate-700">Recommended for You</h2>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {recommendedForYou.map((t) => {
              const color = categoryColors[t.category] ?? { bg: "bg-slate-100", text: "text-slate-700" };
              return (
                <button
                  key={t.id}
                  onClick={() => setUseTemplate(t)}
                  className="shrink-0 flex items-center gap-3 rounded-xl border border-ocean-100 bg-ocean-50/30 px-4 py-3 hover:shadow-md hover:-translate-y-0.5 transition-all w-72"
                >
                  <div className={`w-9 h-9 rounded-lg ${color.bg} flex items-center justify-center shrink-0`}>
                    <FileText className={`w-4 h-4 ${color.text}`} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[13px] font-semibold text-slate-900 truncate">{t.name}</p>
                    <p className="text-[11px] text-ocean-500">Based on your activity</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-ocean-300 shrink-0 ml-auto" />
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setActiveUseCase(null); }}
              className={`shrink-0 rounded-full border px-4 py-1.5 text-[13px] font-medium transition-colors ${
                isActive ? "border-ocean-200 bg-ocean-50 text-ocean-700" : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Search Bar */}
      <div className="relative mb-8">
        <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search templates by name, category, or use case..."
          className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
        />
      </div>

      {/* Template Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
        {filteredTemplates.map((template) => {
          const color = categoryColors[template.category] ?? { bg: "bg-slate-100", text: "text-slate-700" };
          const bestFor = bestForLabels[template.id];
          const companyCount = getCompanyCount(template.usageCount);

          return (
            <div
              key={template.id}
              className="group relative flex flex-col rounded-xl border border-slate-200 bg-white p-5 shadow-card transition-all hover:-translate-y-0.5 hover:shadow-card-hover"
            >
              {template.popular && (
                <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-400 px-2.5 py-0.5 text-[11px] font-semibold text-white shadow-sm">
                  <Star className="h-3 w-3" />
                  Popular
                </span>
              )}

              <span className={`mb-3 inline-flex w-fit rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${color.bg} ${color.text}`}>
                {template.category}
              </span>

              <h3 className="text-[15px] font-semibold text-slate-900">{template.name}</h3>

              {template.recommended && (
                <span className="mt-1.5 inline-flex w-fit items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-medium text-emerald-700">
                  <Sparkles className="h-3 w-3" />
                  Recommended
                </span>
              )}

              <p className="mt-2 line-clamp-2 text-[13px] leading-relaxed text-slate-500">{template.description}</p>

              {/* Best for label */}
              {bestFor && (
                <div className="mt-2 flex items-start gap-1.5">
                  <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-400" />
                  <p className="text-[12px] italic leading-snug text-slate-400">Best for: {bestFor}</p>
                </div>
              )}

              {/* Metadata */}
              <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-3">
                <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                  <Clock className="h-3.5 w-3.5 text-slate-400" />
                  {template.estimatedTime}
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-500">
                  <Users className="h-3.5 w-3.5 text-slate-400" />
                  {template.usageCount.toLocaleString()} uses
                </span>
                <span className="inline-flex items-center gap-1.5 text-[12px] text-slate-400">
                  <Building2 className="h-3 w-3" />
                  {companyCount.toLocaleString()} companies
                </span>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 flex gap-2">
                <button
                  onClick={() => setPreviewTemplate(template)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50"
                >
                  <Eye className="h-3.5 w-3.5" />
                  Preview
                </button>
                <button
                  onClick={() => setUseTemplate(template)}
                  className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-ocean-600 px-3 py-2 text-[13px] font-medium text-white transition-colors hover:bg-ocean-700"
                >
                  <FileText className="h-3.5 w-3.5" />
                  Use Template
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty filter state */}
      {filteredTemplates.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <FileText className="mb-3 h-10 w-10 text-slate-300" />
          <p className="text-[14px] font-medium text-slate-500">No templates found</p>
          <p className="mt-1 text-[13px] text-slate-400">Try adjusting your search or category filter.</p>
          <button
            onClick={() => navigate("/ai-generator")}
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-ocean-500 to-violet-500 px-4 py-2 text-[13px] font-semibold text-white shadow-sm hover:opacity-90 transition-opacity"
          >
            <Sparkles className="h-3.5 w-3.5" />
            Generate with AI instead
          </button>
        </div>
      )}

      {/* Improved AI CTA Footer */}
      <div className="mt-12 rounded-xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 px-8 py-6 shadow-card">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-[16px] font-semibold text-white">Don&rsquo;t see what you need?</h3>
            <p className="mt-1 text-[13px] text-slate-400">
              Create a custom contract in seconds with AI. Describe what you need and we&rsquo;ll draft it for you.
            </p>
          </div>
          <button
            onClick={() => navigate("/ai-generator")}
            className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-ocean-400 to-violet-500 px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 shrink-0"
          >
            <Sparkles className="h-4 w-4" />
            Generate with AI
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Modals */}
      {previewTemplate && (
        <PreviewModal
          template={previewTemplate}
          onClose={() => setPreviewTemplate(null)}
          onUse={() => { setPreviewTemplate(null); setUseTemplate(previewTemplate); }}
        />
      )}
      {useTemplate && (
        <UseTemplateModal
          template={useTemplate}
          onClose={() => setUseTemplate(null)}
          contacts={contacts}
        />
      )}
    </div>
  );
}
