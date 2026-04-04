import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  ShieldCheck, Briefcase, Users, Handshake, UserCheck, Building2, PenTool, Settings2,
  Check, Sparkles, ChevronRight, ChevronLeft, Download, Send, Edit3, Lightbulb,
  ToggleLeft, ToggleRight, BookOpen, Globe, DollarSign, Calendar, MapPin, Mail, User,
  Hash, Building, AlertCircle, X, Search, Info, Zap, CheckCircle2, Plus,
} from "lucide-react";
import { contacts } from "../../data/mockData";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface ContractTypeOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  recommendedClauses: string[];
}

interface ClauseOption {
  id: string;
  label: string;
  description: string;
  defaultOn: boolean;
  group: "recommended" | "legal" | "advanced";
  whyItMatters: string;
}

/* ------------------------------------------------------------------ */
/*  Static data                                                        */
/* ------------------------------------------------------------------ */

const STEPS = [
  "Contract Type", "Your Details", "Counterparty", "Agreement Terms", "Clauses", "Generate", "Review",
];

const CONTRACT_TYPES: ContractTypeOption[] = [
  { id: "service", name: "Service Agreement", description: "For outsourcing services between businesses", icon: <Briefcase className="w-5 h-5" />, recommendedClauses: ["confidentiality", "ipAssignment", "liability", "terminationNotice"] },
  { id: "sales", name: "Sales Agreement", description: "For buying or selling goods and products", icon: <DollarSign className="w-5 h-5" />, recommendedClauses: ["liability", "disputeResolution", "terminationNotice"] },
  { id: "nda", name: "NDA", description: "Protect confidential information shared between parties", icon: <ShieldCheck className="w-5 h-5" />, recommendedClauses: ["confidentiality", "ipAssignment", "disputeResolution"] },
  { id: "employment", name: "Employment Contract", description: "Define terms between employer and employee", icon: <UserCheck className="w-5 h-5" />, recommendedClauses: ["confidentiality", "nonCompete", "ipAssignment", "terminationNotice"] },
  { id: "freelancer", name: "Freelancer Agreement", description: "For independent contractor engagements", icon: <PenTool className="w-5 h-5" />, recommendedClauses: ["ipAssignment", "liability", "confidentiality", "terminationNotice"] },
  { id: "consulting", name: "Consulting Agreement", description: "For professional advisory services", icon: <Users className="w-5 h-5" />, recommendedClauses: ["confidentiality", "liability", "ipAssignment"] },
  { id: "vendor", name: "Vendor Agreement", description: "Establish terms with product or service suppliers", icon: <Building2 className="w-5 h-5" />, recommendedClauses: ["liability", "forceMajeure", "disputeResolution", "terminationNotice"] },
  { id: "partnership", name: "Partnership Agreement", description: "Define shared business ownership terms", icon: <Handshake className="w-5 h-5" />, recommendedClauses: ["confidentiality", "ipAssignment", "disputeResolution", "nonCompete"] },
  { id: "custom", name: "Custom", description: "Build a fully custom contract from scratch", icon: <Settings2 className="w-5 h-5" />, recommendedClauses: [] },
];

const CLAUSE_OPTIONS: ClauseOption[] = [
  { id: "confidentiality", label: "Confidentiality clause", description: "Prevents parties from disclosing sensitive information shared during the agreement.", defaultOn: true, group: "recommended", whyItMatters: "Protects trade secrets and proprietary data from being shared without consent." },
  { id: "ipAssignment", label: "Intellectual property assignment", description: "Transfers ownership of work product and intellectual property to the hiring party.", defaultOn: true, group: "recommended", whyItMatters: "Ensures your company owns all deliverables and creative output from the engagement." },
  { id: "liability", label: "Limitation of liability", description: "Caps the maximum financial exposure for damages arising from the agreement.", defaultOn: true, group: "recommended", whyItMatters: "Prevents uncapped financial exposure if something goes wrong during the contract." },
  { id: "nonCompete", label: "Non-compete clause", description: "Restricts parties from engaging in competing activities during and after the contract period.", defaultOn: false, group: "legal", whyItMatters: "Prevents the other party from working with your competitors or starting a competing business." },
  { id: "disputeResolution", label: "Dispute resolution", description: "Specifies how disagreements will be resolved between the parties.", defaultOn: false, group: "legal", whyItMatters: "Avoids costly litigation by pre-agreeing on how to handle disputes (e.g. arbitration)." },
  { id: "forceMajeure", label: "Force majeure", description: "Excuses non-performance when extraordinary events prevent fulfillment of obligations.", defaultOn: false, group: "legal", whyItMatters: "Protects both parties if unforeseeable events (pandemic, natural disaster) prevent performance." },
  { id: "autoRenewal", label: "Auto-renewal terms", description: "Automatically extends the agreement unless either party provides timely notice.", defaultOn: false, group: "advanced", whyItMatters: "Ensures contract continuity without manual renewal, reducing gaps in service coverage." },
  { id: "terminationNotice", label: "Termination notice period", description: "Defines how far in advance a party must notify the other before ending the contract.", defaultOn: false, group: "advanced", whyItMatters: "Gives both parties adequate time to prepare for contract ending and transition." },
];

const CLAUSE_GROUPS = [
  { key: "recommended", label: "Recommended", color: "text-emerald-600" },
  { key: "legal", label: "Legal Protection", color: "text-amber-600" },
  { key: "advanced", label: "Advanced", color: "text-slate-500" },
];

const PAYMENT_FREQUENCIES = ["Monthly", "Quarterly", "Annually", "One-time", "Milestone-based"];
const PAYMENT_TERMS = ["Net 15", "Net 30", "Net 45", "Net 60"];
const JURISDICTIONS = [
  "United States \u2014 New York", "United States \u2014 California", "United States \u2014 Delaware",
  "United Kingdom \u2014 England & Wales", "European Union \u2014 GDPR Compliant",
  "Singapore", "Australia \u2014 New South Wales", "Canada \u2014 Ontario",
];
const DISPUTE_METHODS = ["Arbitration", "Mediation", "Court"];
const TERMINATION_PERIODS = ["30 days", "60 days", "90 days"];

const GENERATION_PHASES = [
  { label: "Analyzing your inputs...", icon: Search },
  { label: "Structuring agreement sections...", icon: BookOpen },
  { label: "Applying legal clauses...", icon: ShieldCheck },
  { label: "Formatting document...", icon: Edit3 },
  { label: "Finalizing contract...", icon: CheckCircle2 },
];

/* ------------------------------------------------------------------ */
/*  Shared classes                                                     */
/* ------------------------------------------------------------------ */

const inputCls =
  "w-full h-10 px-3 border border-slate-200 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 transition";
const inputErrorCls =
  "w-full h-10 px-3 border border-red-300 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition";
const textareaCls =
  "w-full px-3 py-2.5 border border-slate-200 rounded-lg text-[13.5px] text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-ocean-500/20 focus:border-ocean-500 transition resize-none";
const labelCls = "block text-[13px] font-medium text-slate-700 mb-1.5";

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AIGeneratorPage() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [showValidation, setShowValidation] = useState(false);

  // Step 1
  const [selectedType, setSelectedType] = useState("");

  // Step 2
  const [companyName, setCompanyName] = useState("Acme Corporation");
  const [regNumber, setRegNumber] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [signatoryName, setSignatoryName] = useState("Sarah Chen");
  const [signatoryTitle, setSignatoryTitle] = useState("CEO");
  const [signatoryEmail, setSignatoryEmail] = useState("sarah@company.com");

  // Step 3
  const [counterpartyName, setCounterpartyName] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [counterpartyEmail, setCounterpartyEmail] = useState("");
  const [counterpartyAddress, setCounterpartyAddress] = useState("");
  const [counterpartyRegNumber, setCounterpartyRegNumber] = useState("");
  const [showContactModal, setShowContactModal] = useState(false);
  const [contactSearch, setContactSearch] = useState("");

  // Step 4
  const [serviceDescription, setServiceDescription] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentFrequency, setPaymentFrequency] = useState("Monthly");
  const [paymentTerms, setPaymentTerms] = useState("Net 30");
  const [deliverables, setDeliverables] = useState("");
  const [jurisdiction, setJurisdiction] = useState(JURISDICTIONS[0]);
  const [aiGeneratingDesc, setAiGeneratingDesc] = useState(false);
  const [aiGeneratingDel, setAiGeneratingDel] = useState(false);

  // Step 5
  const [clauses, setClauses] = useState<Record<string, boolean>>(
    Object.fromEntries(CLAUSE_OPTIONS.map((c) => [c.id, c.defaultOn]))
  );
  const [disputeMethod, setDisputeMethod] = useState("Arbitration");
  const [terminationPeriod, setTerminationPeriod] = useState("30 days");
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  // Step 6
  const [generationProgress, setGenerationProgress] = useState(0);
  const [genPhase, setGenPhase] = useState(0);

  // Step 7 — Review
  const [editingField, setEditingField] = useState<string | null>(null);
  const [editingValue, setEditingValue] = useState("");
  const [appliedSuggestions, setAppliedSuggestions] = useState<Set<string>>(new Set());
  const [extraClauses, setExtraClauses] = useState<string[]>([]);
  const [sectionProcessing, setSectionProcessing] = useState<string | null>(null);
  const [toneScope, setToneScope] = useState<"contract" | "section">("contract");
  const [toneApplied, setToneApplied] = useState<string | null>(null);
  const [selectedReviewSection, setSelectedReviewSection] = useState<string | null>(null);

  // Smart defaults: when contract type changes, auto-select recommended clauses
  useEffect(() => {
    if (!selectedType) return;
    const ct = CONTRACT_TYPES.find((t) => t.id === selectedType);
    if (!ct) return;
    const newClauses = { ...clauses };
    CLAUSE_OPTIONS.forEach((c) => {
      newClauses[c.id] = ct.recommendedClauses.includes(c.id);
    });
    setClauses(newClauses);
  }, [selectedType]);

  // Generation animation with phases
  useEffect(() => {
    if (currentStep !== 5) return;
    setGenerationProgress(0);
    setGenPhase(0);
    const phaseInterval = setInterval(() => {
      setGenPhase((p) => Math.min(p + 1, GENERATION_PHASES.length - 1));
    }, 600);
    const progInterval = setInterval(() => {
      setGenerationProgress((p) => (p >= 100 ? 100 : p + 4));
    }, 100);
    const timeout = setTimeout(() => setCurrentStep(6), 3200);
    return () => { clearInterval(phaseInterval); clearInterval(progInterval); clearTimeout(timeout); };
  }, [currentStep]);

  const toggleClause = (id: string) => setClauses((prev) => ({ ...prev, [id]: !prev[id] }));

  const selectedTypeName = CONTRACT_TYPES.find((t) => t.id === selectedType)?.name ?? "Service Agreement";
  const selectedTypeObj = CONTRACT_TYPES.find((t) => t.id === selectedType);

  // ─── Validation ─────────────────────────────────────────────────────

  function isStepValid(step: number): boolean {
    switch (step) {
      case 0: return !!selectedType;
      case 1: return !!companyName.trim() && !!signatoryName.trim();
      case 2: return !!counterpartyName.trim();
      case 3: return !!startDate;
      case 4: return true;
      default: return true;
    }
  }

  function handleContinue() {
    if (!isStepValid(currentStep)) {
      setShowValidation(true);
      return;
    }
    setShowValidation(false);
    setCurrentStep((s) => Math.min(6, s + 1));
  }

  function handleStepClick(idx: number) {
    if (idx < currentStep) {
      setCurrentStep(idx);
      setShowValidation(false);
    }
  }

  // ─── AI Assist Simulations ──────────────────────────────────────────

  function aiGenerateDescription() {
    setAiGeneratingDesc(true);
    setTimeout(() => {
      const typeName = selectedTypeName;
      const descriptions: Record<string, string> = {
        "Service Agreement": "Professional software development and technology consulting services including system architecture design, custom application development, QA testing, and ongoing technical support for the Client's digital infrastructure.",
        "NDA": "Mutual exchange of confidential business information including but not limited to trade secrets, business strategies, financial data, customer information, and proprietary technology specifications.",
        "Employment Contract": "Full-time employment as a Senior Software Engineer responsible for designing, developing, and maintaining enterprise software applications, mentoring junior developers, and participating in architecture reviews.",
        "Freelancer Agreement": "Independent contractor engagement for UX/UI design services including user research, wireframing, high-fidelity mockups, interactive prototyping, and design system documentation.",
        "Consulting Agreement": "Strategic business consulting services including market analysis, operational efficiency assessment, technology roadmap development, and executive advisory.",
      };
      setServiceDescription(descriptions[typeName] || "Professional services as mutually agreed upon by both parties, including scope of work, timelines, and quality standards defined in the attached Statement of Work.");
      setAiGeneratingDesc(false);
    }, 1500);
  }

  function aiGenerateDeliverables() {
    setAiGeneratingDel(true);
    setTimeout(() => {
      const deliverableMap: Record<string, string> = {
        "Service Agreement": "\u2022 Requirements documentation and project plan\n\u2022 Architecture design and technical specifications\n\u2022 Developed software application with source code\n\u2022 Testing reports and QA documentation\n\u2022 Deployment and user training materials",
        "Freelancer Agreement": "\u2022 User research findings and persona documents\n\u2022 Wireframes for all key user flows\n\u2022 High-fidelity UI mockups (desktop + mobile)\n\u2022 Interactive prototype in Figma\n\u2022 Design system component library",
        "Consulting Agreement": "\u2022 Market analysis report\n\u2022 Competitive landscape assessment\n\u2022 Strategic recommendations document\n\u2022 Implementation roadmap with timeline\n\u2022 Executive presentation deck",
      };
      setDeliverables(deliverableMap[selectedTypeName] || "\u2022 Project kickoff documentation\n\u2022 Progress reports (bi-weekly)\n\u2022 Final deliverable as specified\n\u2022 Knowledge transfer documentation\n\u2022 Post-completion support (30 days)");
      setAiGeneratingDel(false);
    }, 1500);
  }

  // ─── Contact Selection ──────────────────────────────────────────────

  const filteredContacts = contacts.filter((c) =>
    contactSearch === "" ||
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.company.toLowerCase().includes(contactSearch.toLowerCase()) ||
    c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  function selectContact(contact: typeof contacts[0]) {
    setCounterpartyName(contact.company === "Individual" || contact.company === "Freelancer" ? contact.name : contact.company);
    setContactPerson(contact.name);
    setCounterpartyEmail(contact.email);
    setShowContactModal(false);
    setContactSearch("");
  }

  /* ---------------------------------------------------------------- */
  /*  Stepper                                                          */
  /* ---------------------------------------------------------------- */

  const renderStepper = () => (
    <div className="flex items-center justify-between mb-10">
      {STEPS.map((label, i) => {
        const isCompleted = i < currentStep;
        const isActive = i === currentStep;
        const isClickable = i < currentStep;
        return (
          <div key={label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <button
                onClick={() => isClickable && handleStepClick(i)}
                disabled={!isClickable}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                  isCompleted
                    ? "bg-emerald-500 text-white cursor-pointer hover:bg-emerald-600"
                    : isActive
                    ? "bg-ocean-600 text-white"
                    : "bg-slate-200 text-slate-500"
                } ${isClickable ? "cursor-pointer" : ""}`}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
              </button>
              <span className={`mt-1.5 text-[11px] font-medium whitespace-nowrap ${
                isActive ? "text-ocean-600" : isCompleted ? "text-emerald-600" : "text-slate-400"
              }`}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 mt-[-14px] rounded ${i < currentStep ? "bg-emerald-400" : "bg-slate-200"}`} />
            )}
          </div>
        );
      })}
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 1 \u2014 Contract Type                                          */
  /* ---------------------------------------------------------------- */

  const renderStep1 = () => (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Select Contract Type</h2>
      <p className="text-[13.5px] text-slate-500 mb-6">Choose the type of contract you want to generate.</p>
      {showValidation && !selectedType && (
        <div className="mb-4 flex items-center gap-2 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Please select a contract type to continue.
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {CONTRACT_TYPES.map((ct) => {
          const selected = selectedType === ct.id;
          return (
            <button
              key={ct.id}
              onClick={() => setSelectedType(ct.id)}
              className={`text-left p-4 rounded-xl border-2 transition-all ${
                selected
                  ? "bg-ocean-50 border-ocean-500 ring-2 ring-ocean-200"
                  : "bg-white border-slate-200 hover:border-slate-300 hover:shadow-card"
              }`}
            >
              <div className={`mb-2.5 ${selected ? "text-ocean-600" : "text-slate-500"}`}>{ct.icon}</div>
              <p className="text-[13.5px] font-semibold text-slate-900">{ct.name}</p>
              <p className="text-[12px] text-slate-500 mt-0.5 leading-snug">{ct.description}</p>
            </button>
          );
        })}
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 2 \u2014 Your Details                                           */
  /* ---------------------------------------------------------------- */

  const renderStep2 = () => (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Your Details</h2>
      <p className="text-[13.5px] text-slate-500 mb-6">Provide your company and signatory information.</p>
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <div>
          <label className={labelCls}>Company Legal Name <span className="text-red-400">*</span></label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${showValidation && !companyName.trim() ? inputErrorCls : inputCls} pl-9`} value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Your company name" />
          </div>
          {showValidation && !companyName.trim() && <p className="text-[11px] text-red-500 mt-1">Company name is required</p>}
        </div>
        <div>
          <label className={labelCls}>Company Registration Number</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} value={regNumber} onChange={(e) => setRegNumber(e.target.value)} placeholder="e.g. 12345678" />
          </div>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Company Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} value={companyAddress} onChange={(e) => setCompanyAddress(e.target.value)} placeholder="Full business address" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Authorized Signatory Name <span className="text-red-400">*</span></label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${showValidation && !signatoryName.trim() ? inputErrorCls : inputCls} pl-9`} value={signatoryName} onChange={(e) => setSignatoryName(e.target.value)} placeholder="Full name" />
          </div>
          {showValidation && !signatoryName.trim() && <p className="text-[11px] text-red-500 mt-1">Signatory name is required</p>}
        </div>
        <div>
          <label className={labelCls}>Signatory Title</label>
          <div className="relative">
            <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} value={signatoryTitle} onChange={(e) => setSignatoryTitle(e.target.value)} placeholder="e.g. CEO" />
          </div>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} type="email" value={signatoryEmail} onChange={(e) => setSignatoryEmail(e.target.value)} placeholder="you@company.com" />
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 3 \u2014 Counterparty                                           */
  /* ---------------------------------------------------------------- */

  const renderStep3 = () => (
    <div>
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-slate-900">Counterparty Details</h2>
        <button
          onClick={() => setShowContactModal(true)}
          className="text-[13px] font-medium text-ocean-600 hover:text-ocean-700 flex items-center gap-1.5 transition-colors"
        >
          <BookOpen className="w-3.5 h-3.5" />
          Select from contacts
        </button>
      </div>
      <p className="text-[13.5px] text-slate-500 mb-6">Enter information about the other party involved.</p>
      {showValidation && !counterpartyName.trim() && (
        <div className="mb-4 flex items-center gap-2 text-[13px] text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          Counterparty name is required to continue.
        </div>
      )}
      <div className="grid grid-cols-2 gap-x-4 gap-y-5">
        <div>
          <label className={labelCls}>Counterparty Name <span className="text-red-400">*</span></label>
          <div className="relative">
            <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${showValidation && !counterpartyName.trim() ? inputErrorCls : inputCls} pl-9`} value={counterpartyName} onChange={(e) => setCounterpartyName(e.target.value)} placeholder="Company or individual name" />
          </div>
          <p className="text-[11px] text-slate-400 mt-1">The legal entity entering the agreement</p>
        </div>
        <div>
          <label className={labelCls}>Contact Person</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} placeholder="Primary contact name" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} type="email" value={counterpartyEmail} onChange={(e) => setCounterpartyEmail(e.target.value)} placeholder="contact@company.com" />
          </div>
        </div>
        <div>
          <label className={labelCls}>Registration Number</label>
          <div className="relative">
            <Hash className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} value={counterpartyRegNumber} onChange={(e) => setCounterpartyRegNumber(e.target.value)} placeholder="e.g. 87654321" />
          </div>
        </div>
        <div className="col-span-2">
          <label className={labelCls}>Address</label>
          <div className="relative">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input className={`${inputCls} pl-9`} value={counterpartyAddress} onChange={(e) => setCounterpartyAddress(e.target.value)} placeholder="Full business address" />
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 4 \u2014 Agreement Terms                                        */
  /* ---------------------------------------------------------------- */

  const renderStep4 = () => (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Agreement Terms</h2>
      <p className="text-[13.5px] text-slate-500 mb-6">Define the scope, payment, and timeline of the agreement.</p>
      <div className="space-y-5">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelCls} mb-0`}>Service / Product Description</label>
            <button
              onClick={aiGenerateDescription}
              disabled={aiGeneratingDesc}
              className="flex items-center gap-1.5 text-[12px] font-medium text-violet-600 hover:text-violet-700 disabled:text-violet-400 transition-colors"
            >
              {aiGeneratingDesc ? (
                <><div className="w-3 h-3 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-3 h-3" /> Generate with AI</>
              )}
            </button>
          </div>
          <textarea className={textareaCls} rows={3} value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="Describe the services or products covered by this agreement..." />
          <p className="text-[11px] text-slate-400 mt-1">This helps define what exactly is being agreed upon</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className={labelCls}>Start Date <span className="text-red-400">*</span></label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${showValidation && !startDate ? inputErrorCls : inputCls} pl-9`} type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
            </div>
            {showValidation && !startDate && <p className="text-[11px] text-red-500 mt-1">Start date is required</p>}
          </div>
          <div>
            <label className={labelCls}>End Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputCls} pl-9`} type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className={labelCls}>Payment Amount</label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input className={`${inputCls} pl-9`} value={paymentAmount} onChange={(e) => setPaymentAmount(e.target.value)} placeholder="0.00" />
            </div>
          </div>
          <div>
            <label className={labelCls}>Payment Frequency</label>
            <select className={inputCls} value={paymentFrequency} onChange={(e) => setPaymentFrequency(e.target.value)}>
              {PAYMENT_FREQUENCIES.map((f) => <option key={f}>{f}</option>)}
            </select>
          </div>
          <div>
            <label className={labelCls}>Payment Terms</label>
            <select className={inputCls} value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
              {PAYMENT_TERMS.map((t) => <option key={t}>{t}</option>)}
            </select>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className={`${labelCls} mb-0`}>Deliverables</label>
            <button
              onClick={aiGenerateDeliverables}
              disabled={aiGeneratingDel}
              className="flex items-center gap-1.5 text-[12px] font-medium text-violet-600 hover:text-violet-700 disabled:text-violet-400 transition-colors"
            >
              {aiGeneratingDel ? (
                <><div className="w-3 h-3 rounded-full border-2 border-violet-400 border-t-transparent animate-spin" /> Generating...</>
              ) : (
                <><Sparkles className="w-3 h-3" /> Suggest deliverables</>
              )}
            </button>
          </div>
          <textarea className={textareaCls} rows={3} value={deliverables} onChange={(e) => setDeliverables(e.target.value)} placeholder="List key deliverables or milestones..." />
        </div>

        <div>
          <label className={labelCls}>Governing Law / Jurisdiction</label>
          <div className="relative">
            <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <select className={`${inputCls} pl-9`} value={jurisdiction} onChange={(e) => setJurisdiction(e.target.value)}>
              {JURISDICTIONS.map((j) => <option key={j}>{j}</option>)}
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 5 \u2014 Clauses (grouped + tooltips + recommended)             */
  /* ---------------------------------------------------------------- */

  const renderStep5 = () => (
    <div>
      <h2 className="text-lg font-semibold text-slate-900 mb-1">Optional Clauses</h2>
      <p className="text-[13.5px] text-slate-500 mb-2">Toggle the clauses you want included in your contract.</p>
      {selectedTypeObj && selectedTypeObj.recommendedClauses.length > 0 && (
        <div className="mb-5 flex items-center gap-2 text-[12px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">
          <Zap className="w-3.5 h-3.5 shrink-0" />
          Clauses have been pre-selected based on your <span className="font-semibold">{selectedTypeName}</span> contract type.
        </div>
      )}
      <div className="space-y-6">
        {CLAUSE_GROUPS.map((group) => {
          const groupClauses = CLAUSE_OPTIONS.filter((c) => c.group === group.key);
          if (groupClauses.length === 0) return null;
          return (
            <div key={group.key}>
              <h3 className={`text-[12px] font-semibold uppercase tracking-wider mb-3 ${group.color}`}>
                {group.label}
              </h3>
              <div className="space-y-2.5">
                {groupClauses.map((clause) => {
                  const isOn = clauses[clause.id];
                  const isRecommended = selectedTypeObj?.recommendedClauses.includes(clause.id);
                  return (
                    <div
                      key={clause.id}
                      className={`flex items-start gap-4 p-4 rounded-xl border transition-all ${
                        isOn ? "bg-ocean-50/50 border-ocean-200" : "bg-white border-slate-200"
                      }`}
                    >
                      <button onClick={() => toggleClause(clause.id)} className="mt-0.5 flex-shrink-0">
                        {isOn ? <ToggleRight className="w-8 h-5 text-ocean-600" /> : <ToggleLeft className="w-8 h-5 text-slate-300" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-[13.5px] font-medium text-slate-900">{clause.label}</p>
                          {isRecommended && (
                            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-full">
                              Recommended
                            </span>
                          )}
                          <button
                            onClick={() => setShowTooltip(showTooltip === clause.id ? null : clause.id)}
                            className="p-0.5 text-slate-300 hover:text-slate-500 transition-colors"
                            title="Why this matters"
                          >
                            <Info className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <p className="text-[12px] text-slate-500 mt-0.5 leading-relaxed">{clause.description}</p>
                        {showTooltip === clause.id && (
                          <div className="mt-2 p-2.5 bg-slate-800 text-white text-[11.5px] rounded-lg leading-relaxed">
                            <strong>Why this matters:</strong> {clause.whyItMatters}
                          </div>
                        )}
                        {clause.id === "disputeResolution" && isOn && (
                          <div className="mt-3 flex gap-2">
                            {DISPUTE_METHODS.map((m) => (
                              <button key={m} onClick={() => setDisputeMethod(m)} className={`px-3 py-1.5 rounded-lg text-[12px] font-medium transition ${disputeMethod === m ? "bg-ocean-600 text-white" : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300"}`}>
                                {m}
                              </button>
                            ))}
                          </div>
                        )}
                        {clause.id === "terminationNotice" && isOn && (
                          <div className="mt-3">
                            <select className={`${inputCls} max-w-[200px]`} value={terminationPeriod} onChange={(e) => setTerminationPeriod(e.target.value)}>
                              {TERMINATION_PERIODS.map((p) => <option key={p}>{p}</option>)}
                            </select>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 6 \u2014 Generate (phased animation)                            */
  /* ---------------------------------------------------------------- */

  const renderStep6 = () => (
    <div className="flex flex-col items-center justify-center py-16">
      <div className="relative mb-6">
        <Sparkles className="w-12 h-12 text-ocean-500 animate-pulse" />
      </div>
      <h2 className="text-xl font-semibold text-slate-900 mb-2">Generating your contract...</h2>
      <p className="text-[13.5px] text-slate-500 mb-8 text-center max-w-md">AI is drafting your {selectedTypeName} with custom terms...</p>
      <div className="w-96 space-y-3 mb-8">
        {GENERATION_PHASES.map((phase, i) => {
          const Icon = phase.icon;
          const isActive = i === genPhase;
          const isDone = i < genPhase;
          return (
            <div key={i} className={`flex items-center gap-3 px-4 py-2.5 rounded-lg transition-all ${isActive ? "bg-ocean-50 border border-ocean-200" : isDone ? "bg-emerald-50/50" : "opacity-40"}`}>
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
              ) : isActive ? (
                <div className="w-4 h-4 rounded-full border-2 border-ocean-500 border-t-transparent animate-spin shrink-0" />
              ) : (
                <Icon className="w-4 h-4 text-slate-400 shrink-0" />
              )}
              <span className={`text-[13px] ${isActive ? "font-medium text-ocean-700" : isDone ? "text-emerald-600" : "text-slate-400"}`}>
                {phase.label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="w-80 h-2 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-gradient-to-r from-ocean-500 to-ocean-400 rounded-full transition-all duration-150 ease-linear" style={{ width: `${Math.min(generationProgress, 100)}%` }} />
      </div>
    </div>
  );

  /* ---------------------------------------------------------------- */
  /*  Step 7 \u2014 Review                                                 */
  /* ---------------------------------------------------------------- */

  const renderStep7 = () => {
    let sectionNum = 0;
    const nextSection = () => ++sectionNum;

    // Included clauses
    const includedClauses = CLAUSE_OPTIONS.filter((c) => clauses[c.id]).map((c) => c.label);
    const excludedRecommended = selectedTypeObj
      ? CLAUSE_OPTIONS.filter((c) => selectedTypeObj.recommendedClauses.includes(c.id) && !clauses[c.id])
      : [];

    // Validation checks
    const checks = [
      { label: "Parties defined", ok: !!companyName && !!counterpartyName },
      { label: "Payment terms set", ok: !!paymentAmount },
      { label: "Start date defined", ok: !!startDate },
      { label: "Service description provided", ok: !!serviceDescription },
      { label: "Signatures prepared", ok: !!signatoryName && !!contactPerson },
      { label: "Counterparty email provided", ok: !!counterpartyEmail },
    ];
    const passedChecks = checks.filter((c) => c.ok).length;
    const allPassed = passedChecks === checks.length;

    // AI suggestions
    const suggestions = [
      { id: "indemnification", title: "Add indemnification clause", desc: "Protects against third-party claims and allocated liability for losses.", bg: "bg-amber-50 border-amber-200", text: "text-amber-800", sub: "text-amber-600" },
      { id: "dataProtection", title: "Add data protection terms", desc: "Required for GDPR compliance when handling personal data.", bg: "bg-blue-50 border-blue-200", text: "text-blue-800", sub: "text-blue-600" },
      { id: "insurance", title: "Require professional insurance", desc: "Ensures the counterparty maintains adequate coverage.", bg: "bg-violet-50 border-violet-200", text: "text-violet-800", sub: "text-violet-600" },
    ];
    const activeSuggestions = suggestions.filter((s) => !appliedSuggestions.has(s.id));

    // Inline editable variable (called as function, not component)
    const evar = (field: string, value: string, setter: (v: string) => void, type = "text", placeholder = "______") => {
      const isEditing = editingField === field;
      if (isEditing) {
        return (
          <span key={field} className="inline-flex items-center gap-1">
            <input
              autoFocus
              type={type}
              value={editingValue}
              onChange={(e) => setEditingValue(e.target.value)}
              onBlur={() => { setter(editingValue); setEditingField(null); }}
              onKeyDown={(e) => { if (e.key === "Enter") { setter(editingValue); setEditingField(null); } if (e.key === "Escape") setEditingField(null); }}
              className="inline-block w-auto min-w-[80px] max-w-[200px] px-2 py-0.5 text-[13px] font-medium text-ocean-700 bg-white border border-ocean-300 rounded ring-2 ring-ocean-100 outline-none"
              style={{ width: `${Math.max(80, (editingValue || "").length * 8 + 24)}px` }}
            />
          </span>
        );
      }
      const display = value || placeholder;
      const isEmpty = !value;
      return (
        <button
          key={field}
          onClick={() => { setEditingField(field); setEditingValue(value); }}
          className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-medium transition-all cursor-pointer text-[13px] ${
            isEmpty
              ? "bg-red-100 text-red-500 ring-1 ring-red-200 hover:bg-red-150"
              : "bg-ocean-100 text-ocean-700 hover:bg-ocean-150 hover:ring-1 hover:ring-ocean-200"
          }`}
          title="Click to edit"
        >
          {display}
          {isEmpty && <AlertCircle className="w-3 h-3 inline" />}
        </button>
      );
    };

    // Section wrapper (called as function returning JSX, not as <Component />)
    const rsection = (id: string, title: string, content: React.ReactNode) => {
      const isProcessing = sectionProcessing === id;
      const isSelected = selectedReviewSection === id;
      return (
        <div
          key={id}
          id={`review-${id}`}
          className={`relative group rounded-lg transition-all ${isSelected ? "ring-2 ring-ocean-200 bg-ocean-50/20 p-4 -mx-4" : ""}`}
          onClick={() => setSelectedReviewSection(isSelected ? null : id)}
        >
          {isProcessing && (
            <div className="absolute inset-0 bg-violet-50/80 backdrop-blur-[1px] rounded-lg flex items-center justify-center z-10">
              <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg shadow border border-violet-200">
                <div className="w-4 h-4 rounded-full border-2 border-violet-500 border-t-transparent animate-spin" />
                <span className="text-[12px] font-medium text-slate-700">Rewriting...</span>
              </div>
            </div>
          )}
          <div className="flex items-center justify-between mb-1.5">
            <h4 className="text-[13px] font-semibold text-slate-700">{title}</h4>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {["Regenerate", "Simplify", "More formal"].map((action) => (
                <button
                  key={action}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSectionProcessing(id);
                    setTimeout(() => setSectionProcessing(null), 1500);
                  }}
                  className="text-[10px] font-medium text-slate-400 hover:text-violet-600 hover:bg-violet-50 px-2 py-1 rounded transition-colors"
                >
                  {action}
                </button>
              ))}
            </div>
          </div>
          {content}
        </div>
      );
    };

    return (
      <div className="flex gap-6">
        {/* ── Left: Contract Preview ──────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <h2 className="text-lg font-semibold text-slate-900 mb-4">Contract Preview</h2>
          <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-card space-y-6">
            <div className="text-center border-b border-slate-100 pb-6">
              <h3 className="text-base font-bold text-slate-900 uppercase tracking-wide">{selectedTypeName}</h3>
              <p className="text-[12px] text-slate-400 mt-1">Generated on {new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}</p>
            </div>

            {rsection("parties", `${nextSection()}. Parties`,
              <p className="text-[13px] text-slate-600 leading-relaxed">
                This {selectedTypeName} (the {'\u201c'}Agreement{'\u201d'}) is entered into by and between{" "}
                {evar("companyName", companyName, setCompanyName)}{" "}
                (the {'\u201c'}Company{'\u201d'}), represented by{" "}
                {evar("signatoryName", signatoryName, setSignatoryName)},{" "}
                {evar("signatoryTitle", signatoryTitle, setSignatoryTitle)}, and{" "}
                {evar("counterpartyName", counterpartyName, setCounterpartyName)}{" "}
                (the {'\u201c'}Counterparty{'\u201d'}).
              </p>
            )}

            {rsection("scope", `${nextSection()}. Scope of Services`,
              <p className="text-[13px] text-slate-600 leading-relaxed">{serviceDescription || <span className="text-red-400 italic">No description provided — click to go back and add one.</span>}</p>
            )}

            {rsection("term", `${nextSection()}. Term`,
              <p className="text-[13px] text-slate-600 leading-relaxed">
                This Agreement shall commence on{" "}
                {evar("startDate", startDate, setStartDate, "date")}{" "}
                and shall remain in effect until{" "}
                {evar("endDate", endDate, setEndDate, "date", "No end date")},{" "}
                unless earlier terminated in accordance with the terms herein.
              </p>
            )}

            {rsection("compensation", `${nextSection()}. Compensation`,
              <p className="text-[13px] text-slate-600 leading-relaxed">
                The Counterparty shall pay the Company ${" "}
                {evar("paymentAmount", paymentAmount, setPaymentAmount, "text", "Amount not set")}{" "}
                on a <span className="font-medium">{paymentFrequency.toLowerCase()}</span> basis, subject to{" "}
                <span className="font-medium">{paymentTerms}</span> payment terms.
              </p>
            )}

            {clauses.confidentiality && rsection("confidentiality", `${nextSection()}. Confidentiality`,
              <p className="text-[13px] text-slate-600 leading-relaxed">Both parties agree to maintain the confidentiality of all proprietary and sensitive information exchanged during the course of this Agreement and for a period of two (2) years following its termination.</p>
            )}
            {clauses.ipAssignment && rsection("ip", `${nextSection()}. Intellectual Property`,
              <p className="text-[13px] text-slate-600 leading-relaxed">All work product, inventions, and intellectual property created during the performance of this Agreement shall be the exclusive property of the Company.</p>
            )}
            {clauses.liability && rsection("liability", `${nextSection()}. Limitation of Liability`,
              <p className="text-[13px] text-slate-600 leading-relaxed">Neither party shall be liable for indirect, incidental, or consequential damages. Total liability shall not exceed the fees paid under this Agreement in the twelve months preceding the claim.</p>
            )}
            {clauses.nonCompete && rsection("noncompete", `${nextSection()}. Non-Compete`,
              <p className="text-[13px] text-slate-600 leading-relaxed">During the term of this Agreement and for a period of twelve (12) months following termination, the Counterparty shall not engage in competing activities within the same market or geographic area.</p>
            )}
            {clauses.disputeResolution && rsection("dispute", `${nextSection()}. Dispute Resolution`,
              <p className="text-[13px] text-slate-600 leading-relaxed">Any disputes arising from this Agreement shall be resolved through {disputeMethod.toLowerCase()} in accordance with the rules of the relevant governing body under the laws of {jurisdiction}.</p>
            )}
            {clauses.forceMajeure && rsection("forcemajeure", `${nextSection()}. Force Majeure`,
              <p className="text-[13px] text-slate-600 leading-relaxed">Neither party shall be liable for failure or delay in performance due to circumstances beyond its reasonable control, including but not limited to natural disasters, pandemics, war, or government action.</p>
            )}
            {clauses.terminationNotice && rsection("termination", `${nextSection()}. Termination`,
              <p className="text-[13px] text-slate-600 leading-relaxed">Either party may terminate this Agreement by providing {terminationPeriod} written notice to the other party. Upon termination, all obligations shall cease except those that by their nature survive.</p>
            )}

            {/* Extra clauses added via AI suggestions */}
            {extraClauses.map((clauseName) =>
              rsection(clauseName, `${nextSection()}. ${clauseName}`,
                <>
                  <p className="text-[13px] text-slate-600 leading-relaxed">
                    {clauseName === "Indemnification"
                      ? "Each party shall indemnify, defend, and hold harmless the other party from and against any claims, damages, losses, or expenses arising out of a breach of this Agreement or negligent acts."
                      : clauseName === "Data Protection"
                      ? "Both parties shall comply with all applicable data protection legislation including GDPR. Personal data shall be processed only as necessary for the performance of this Agreement."
                      : "The Service Provider shall maintain professional liability insurance with coverage of no less than $1,000,000 per occurrence throughout the term of this Agreement."}
                  </p>
                  <span className="inline-flex items-center gap-1 mt-2 text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                    <Sparkles className="w-3 h-3" /> Added by AI
                  </span>
                </>
              )
            )}

            {rsection("governing", "Governing Law",
              <p className="text-[13px] text-slate-600 leading-relaxed">This Agreement shall be governed by and construed in accordance with the laws of <span className="font-medium">{jurisdiction}</span>.</p>
            )}

            {/* Deliverables if provided */}
            {deliverables && rsection("deliverables", `${nextSection()}. Deliverables`,
              <div className="text-[13px] text-slate-600 leading-relaxed whitespace-pre-line">{deliverables}</div>
            )}

            {/* Signatures */}
            <div className="border-t border-slate-100 pt-6 grid grid-cols-2 gap-8">
              <div>
                <p className="text-[12px] text-slate-400 mb-4">FOR THE COMPANY</p>
                <div className="border-b border-slate-300 mb-1 pb-6" />
                <p className="text-[13px] font-medium text-slate-700">{signatoryName || "______"}</p>
                <p className="text-[12px] text-slate-500">{signatoryTitle || "______"}, {companyName || "______"}</p>
              </div>
              <div>
                <p className="text-[12px] text-slate-400 mb-4">FOR THE COUNTERPARTY</p>
                <div className="border-b border-slate-300 mb-1 pb-6" />
                <p className="text-[13px] font-medium text-slate-700">{contactPerson || "______"}</p>
                <p className="text-[12px] text-slate-500">{counterpartyName || "______"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Sidebar ──────────────────────────────────────── */}
        <div className="w-80 flex-shrink-0 space-y-4">
          {/* Contract Summary Panel */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
            <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Contract Summary</h3>
            <div className="space-y-2.5 text-[12.5px]">
              <div className="flex justify-between"><span className="text-slate-400">Type</span><span className="font-medium text-slate-700">{selectedTypeName}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Parties</span><span className="font-medium text-slate-700 text-right truncate ml-4">{companyName || "—"} ↔ {counterpartyName || "—"}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Term</span><span className="font-medium text-slate-700">{startDate || "—"}{endDate ? ` – ${endDate}` : ""}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Payment</span><span className="font-medium text-slate-700">{paymentAmount ? `$${paymentAmount}` : "—"} / {paymentFrequency} / {paymentTerms}</span></div>
              <div className="flex justify-between"><span className="text-slate-400">Jurisdiction</span><span className="font-medium text-slate-700 text-right truncate ml-4">{jurisdiction.split(" \u2014 ")[0]}</span></div>
            </div>

            {/* Included Clauses */}
            <div className="mt-4 pt-3 border-t border-slate-100">
              <h4 className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">Included Clauses ({includedClauses.length + extraClauses.length})</h4>
              <div className="flex flex-wrap gap-1.5">
                {includedClauses.map((c) => (
                  <span key={c} className="text-[10.5px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">{c}</span>
                ))}
                {extraClauses.map((c) => (
                  <span key={c} className="text-[10.5px] font-medium text-violet-700 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full flex items-center gap-1"><Sparkles className="w-2.5 h-2.5" />{c}</span>
                ))}
              </div>
              {excludedRecommended.length > 0 && (
                <div className="mt-2">
                  <p className="text-[10px] text-slate-400 mb-1">Not included:</p>
                  <div className="flex flex-wrap gap-1">
                    {excludedRecommended.map((c) => (
                      <span key={c.id} className="text-[10px] text-slate-400 bg-slate-50 border border-slate-200 px-1.5 py-0.5 rounded-full line-through">{c.label}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Validation / Confidence Indicators */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-[12px] font-semibold text-slate-400 uppercase tracking-wider">Readiness Check</h3>
              <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${allPassed ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
                {passedChecks}/{checks.length}
              </span>
            </div>
            <div className="space-y-1.5">
              {checks.map((check) => (
                <div key={check.label} className="flex items-center gap-2">
                  {check.ok ? (
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  ) : (
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                  )}
                  <span className={`text-[12px] ${check.ok ? "text-slate-400" : "text-amber-700 font-medium"}`}>{check.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Actionable AI Suggestions */}
          {activeSuggestions.length > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h3 className="text-[13px] font-semibold text-slate-900">AI Suggestions</h3>
              </div>
              <div className="space-y-2.5">
                {activeSuggestions.map((s) => (
                  <div key={s.id} className={`p-3 ${s.bg} border rounded-lg`}>
                    <p className={`text-[12.5px] ${s.text} font-medium`}>{s.title}</p>
                    <p className={`text-[11px] ${s.sub} mt-0.5 leading-relaxed`}>{s.desc}</p>
                    <div className="flex items-center gap-2 mt-2.5">
                      <button
                        onClick={() => {
                          const clauseName = s.id === "indemnification" ? "Indemnification" : s.id === "dataProtection" ? "Data Protection" : "Professional Insurance";
                          setExtraClauses((prev) => [...prev, clauseName]);
                          setAppliedSuggestions((prev) => new Set([...prev, s.id]));
                        }}
                        className="text-[11px] font-semibold text-ocean-600 hover:text-ocean-700 flex items-center gap-1 transition-colors"
                      >
                        <Plus className="w-3 h-3" /> Add Clause
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          {appliedSuggestions.size > 0 && activeSuggestions.length === 0 && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-center gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <p className="text-[12px] text-emerald-700 font-medium">All AI suggestions applied.</p>
            </div>
          )}

          {/* Clause Tone with Scope */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-card">
            <h3 className="text-[13px] font-semibold text-slate-900 mb-2">Adjust Clause Tone</h3>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[11px] text-slate-400">Apply to:</span>
              <button onClick={() => setToneScope("contract")} className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition ${toneScope === "contract" ? "bg-ocean-100 text-ocean-700 border border-ocean-200" : "text-slate-400 hover:text-slate-600"}`}>Entire contract</button>
              <button onClick={() => setToneScope("section")} className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition ${toneScope === "section" ? "bg-ocean-100 text-ocean-700 border border-ocean-200" : "text-slate-400 hover:text-slate-600"}`}>Selected section</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {["More Formal", "More Concise", "More Protective", "More Friendly", "More Balanced"].map((tone) => (
                <button
                  key={tone}
                  onClick={() => {
                    setToneApplied(tone);
                    if (toneScope === "section" && selectedReviewSection) {
                      setSectionProcessing(selectedReviewSection);
                      setTimeout(() => setSectionProcessing(null), 1500);
                    }
                    setTimeout(() => setToneApplied(null), 2000);
                  }}
                  className="px-3 py-1.5 text-[12px] font-medium rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition"
                >
                  {tone}
                </button>
              ))}
            </div>
            {toneApplied && (
              <div className="mt-2 flex items-center gap-1.5 text-[11px] text-emerald-600">
                <CheckCircle2 className="w-3 h-3" />
                <span>Applied "{toneApplied}" to {toneScope === "contract" ? "entire contract" : "selected section"}</span>
              </div>
            )}
          </div>

          {/* CTAs */}
          <div className="space-y-2.5">
            <p className="text-[12px] text-slate-400 text-center mb-1">
              {allPassed ? "Your contract is ready. Edit it further or send for signature." : "Review the warnings above before sending."}
            </p>
            <button onClick={() => navigate("/sign-send")} className="w-full flex items-center justify-center gap-2 h-10 rounded-lg bg-ocean-600 text-[13.5px] font-medium text-white hover:bg-ocean-700 transition shadow-sm">
              <Send className="w-4 h-4" />
              Send for Signature
            </button>
            <button onClick={() => navigate("/editor")} className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 transition">
              <Edit3 className="w-4 h-4" />
              Edit Contract
            </button>
            <button onClick={() => navigate("/pdf-export")} className="w-full flex items-center justify-center gap-2 h-10 rounded-lg border border-slate-200 text-[13.5px] font-medium text-slate-700 hover:bg-slate-50 transition">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>
    );
  };

  /* ---------------------------------------------------------------- */
  /*  Step router                                                      */
  /* ---------------------------------------------------------------- */

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0: return renderStep1();
      case 1: return renderStep2();
      case 2: return renderStep3();
      case 3: return renderStep4();
      case 4: return renderStep5();
      case 5: return renderStep6();
      case 6: return renderStep7();
      default: return null;
    }
  };

  /* ---------------------------------------------------------------- */
  /*  Render                                                           */
  /* ---------------------------------------------------------------- */

  return (
    <div className="max-w-4xl mx-auto py-8 px-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-ocean-500 to-ocean-700 flex items-center justify-center">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-900">AI Contract Generator</h1>
          <p className="text-[13px] text-slate-500">Create professional contracts in minutes with AI assistance</p>
        </div>
      </div>

      {renderStepper()}
      <div className="mb-8">{renderCurrentStep()}</div>

      {/* Navigation */}
      {currentStep !== 5 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-100">
          <button
            onClick={() => { setCurrentStep((s) => Math.max(0, s - 1)); setShowValidation(false); }}
            disabled={currentStep === 0}
            className={`flex items-center gap-2 h-10 px-5 rounded-lg border text-[13.5px] font-medium transition ${
              currentStep === 0 ? "border-slate-100 text-slate-300 cursor-not-allowed" : "border-slate-200 text-slate-700 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="w-4 h-4" />
            Back
          </button>
          {currentStep < 6 && (
            <button
              onClick={handleContinue}
              className={`flex items-center gap-2 h-10 px-6 rounded-lg text-[13.5px] font-medium transition ${
                isStepValid(currentStep)
                  ? "bg-ocean-600 text-white hover:bg-ocean-700"
                  : "bg-ocean-400 text-white/80 cursor-default"
              }`}
            >
              {currentStep === 4 ? "Generate Contract" : "Continue"}
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}

      {/* ── Select from Contacts Modal ─────────────────────────────── */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200">
              <h2 className="text-[16px] font-semibold text-slate-900">Select from Contacts</h2>
              <button onClick={() => setShowContactModal(false)} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="px-6 pt-4 pb-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search contacts by name, company, or email..."
                  value={contactSearch}
                  onChange={(e) => setContactSearch(e.target.value)}
                  className={`${inputCls} pl-9`}
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-[360px] overflow-y-auto px-4 py-2">
              {filteredContacts.length === 0 ? (
                <p className="text-center text-[13px] text-slate-400 py-8">No contacts found.</p>
              ) : (
                filteredContacts.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => selectContact(c)}
                    className="w-full text-left flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-slate-50 transition-colors group"
                  >
                    <div className="w-9 h-9 rounded-full bg-ocean-100 flex items-center justify-center text-[12px] font-semibold text-ocean-700 shrink-0">
                      {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-medium text-slate-700 group-hover:text-slate-900">{c.name}</p>
                      <p className="text-[12px] text-slate-400 truncate">{c.company} &middot; {c.email}</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {c.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="text-[10px] font-medium text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded-full">{tag}</span>
                      ))}
                    </div>
                  </button>
                ))
              )}
            </div>
            <div className="px-6 py-3 border-t border-slate-200 bg-slate-25 text-center">
              <p className="text-[12px] text-slate-400">
                {filteredContacts.length} contact{filteredContacts.length !== 1 ? "s" : ""} available
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
