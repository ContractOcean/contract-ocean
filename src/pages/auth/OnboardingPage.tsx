import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Waves, Building2, Briefcase, User, Globe2, ChevronRight, ChevronLeft,
  Check, FileText, Sparkles, PenTool, Send, Zap,
  ArrowRight, AlertCircle,
} from "lucide-react";
import { useAuth } from "../../lib/AuthContext";

// ─── Step data ──────────────────────────────────────────────────────────────

const businessTypes = [
  { value: "individual", label: "Individual / Freelancer", icon: User },
  { value: "startup", label: "Startup", icon: Zap },
  { value: "sme", label: "SME / Limited Company", icon: Building2 },
  { value: "agency", label: "Agency", icon: Briefcase },
  { value: "enterprise", label: "Enterprise", icon: Globe2 },
];

const useCases = [
  { value: "create", label: "Create contracts", desc: "Draft professional agreements from scratch or templates", icon: FileText },
  { value: "manage", label: "Manage agreements", desc: "Track, organize, and manage all your contracts", icon: Briefcase },
  { value: "sign", label: "Send for signature", desc: "Get documents signed electronically", icon: Send },
  { value: "ai", label: "Generate with AI", desc: "Use AI to create contracts in minutes", icon: Sparkles },
];

const companySizes = [
  { value: "1-5", label: "1\u20135" },
  { value: "6-20", label: "6\u201320" },
  { value: "21-50", label: "21\u201350" },
  { value: "50+", label: "50+" },
];

const industries = [
  "Technology", "Professional Services", "Marketing & Advertising", "Finance & Banking",
  "Healthcare", "Real Estate", "E-commerce", "Manufacturing", "Education", "Legal", "Other",
];

const startingPoints = [
  { value: "templates", label: "Use a template", desc: "Browse ready-made contract templates", icon: FileText, route: "/templates" },
  { value: "scratch", label: "Create from scratch", desc: "Start with a blank contract editor", icon: PenTool, route: "/editor" },
  { value: "ai", label: "Generate with AI", desc: "Let AI create your first contract", icon: Sparkles, route: "/ai-generator" },
];

const stepLabels = ["Business", "Use Case", "Details", "Plan", "Start"];

// ─── Sub-components ─────────────────────────────────────────────────────────

function FieldLabel({ label, required }: { label: string; required: boolean }) {
  return (
    <div className="flex items-center justify-between mb-1.5">
      <label className="text-[13px] font-medium text-slate-700">{label}</label>
      <span className={`text-[11px] font-medium ${required ? 'text-slate-400' : 'text-slate-300'}`}>
        {required ? 'Required' : 'Optional'}
      </span>
    </div>
  );
}

function FieldError({ show, message = "This field is required" }: { show: boolean; message?: string }) {
  if (!show) return null;
  return (
    <p className="flex items-center gap-1 mt-1.5 text-[11px] text-red-500">
      <AlertCircle className="w-3 h-3 shrink-0" />
      {message}
    </p>
  );
}

function ContinueHint({ show }: { show: boolean }) {
  if (!show) return null;
  return (
    <p className="text-[11px] text-amber-600 mt-2 text-right">
      Please complete required fields to continue
    </p>
  );
}

// ─── Main Component ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [attempted, setAttempted] = useState(false); // tracks if user tried to continue

  // Form state
  const [companyName, setCompanyName] = useState(profile?.company_name || "");
  const [businessType, setBusinessType] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [planSelected, setPlanSelected] = useState("essentials");
  const [startingPoint, setStartingPoint] = useState("");

  // Touched state for inline validation (per-field on blur)
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const totalSteps = 5;

  function markTouched(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function toggleUseCase(value: string) {
    setSelectedUseCases((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function canContinue(): boolean {
    switch (currentStep) {
      case 0: return !!companyName.trim() && !!businessType;
      case 1: return selectedUseCases.length > 0;
      case 2: return true; // all optional
      case 3: return true; // plan always selected
      case 4: return !!startingPoint;
      default: return false;
    }
  }

  function handleNext() {
    if (!canContinue()) {
      setAttempted(true);
      return;
    }
    setAttempted(false);
    setTouched({});
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    setAttempted(false);
    setTouched({});
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  async function handleComplete() {
    if (!startingPoint) {
      setAttempted(true);
      return;
    }
    setIsLoading(true);
    await updateProfile({
      company_name: companyName.trim(),
      business_type: businessType,
      use_case: selectedUseCases,
      country: country || null,
      company_size: companySize || null,
      industry: industry || null,
      plan_selected: planSelected,
      starting_point: startingPoint,
      onboarding_completed: true,
    });
    setIsLoading(false);

    const sp = startingPoints.find((s) => s.value === startingPoint);
    navigate(sp?.route || "/");
  }

  // Validation helpers
  const showCompanyError = (touched.companyName || attempted) && !companyName.trim();
  const showTypeError = attempted && !businessType;
  const showUseCaseError = attempted && selectedUseCases.length === 0;
  const showStartError = attempted && !startingPoint;

  // ── Render ──────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex flex-col" style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}>
      {/* Top bar */}
      <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-8 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-ocean-600 flex items-center justify-center">
            <Waves className="w-4 h-4 text-white" />
          </div>
          <span className="text-[16px] font-bold text-slate-900 tracking-tight">Contract Ocean</span>
        </div>
        <div className="flex items-center gap-2">
          {stepLabels.map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-semibold transition-all ${
                i === currentStep ? 'bg-ocean-600 text-white shadow-sm' :
                i < currentStep ? 'bg-emerald-500 text-white' :
                'bg-slate-100 text-slate-400'
              }`}>
                {i < currentStep ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[12px] font-medium hidden sm:inline ${
                i === currentStep ? 'text-slate-700' : 'text-slate-400'
              }`}>{label}</span>
              {i < stepLabels.length - 1 && <div className="w-6 h-px bg-slate-200 mx-0.5" />}
            </div>
          ))}
        </div>
        <p className="text-[11px] text-slate-300 hidden md:block">Takes less than 60 seconds</p>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[560px]">

          {/* ── Step 0: Business Info ─────────────────────────────── */}
          {currentStep === 0 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">Tell us about your business</h1>
              <p className="text-[14px] text-slate-500 mb-8">
                Required \u2014 helps us tailor your workspace.
              </p>

              <div className="space-y-5">
                <div>
                  <FieldLabel label="Company name" required />
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    onBlur={() => markTouched('companyName')}
                    placeholder="Your company or business name"
                    className={`w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all ${
                      showCompanyError ? 'border-red-300 ring-1 ring-red-100' : 'border-slate-200'
                    }`}
                  />
                  <FieldError show={showCompanyError} />
                </div>

                <div>
                  <FieldLabel label="Business type" required />
                  <div className="grid grid-cols-1 gap-2">
                    {businessTypes.map((bt) => {
                      const Icon = bt.icon;
                      const selected = businessType === bt.value;
                      return (
                        <button
                          key={bt.value}
                          onClick={() => setBusinessType(bt.value)}
                          className={`flex items-center gap-3.5 px-4 py-3.5 rounded-xl border text-left transition-all ${
                            selected
                              ? 'border-ocean-400 bg-ocean-50/50 ring-1 ring-ocean-200'
                              : showTypeError
                              ? 'border-red-200 bg-white hover:border-red-300'
                              : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-25'
                          }`}
                        >
                          <div className={`w-9 h-9 rounded-lg flex items-center justify-center shrink-0 ${
                            selected ? 'bg-ocean-100' : 'bg-slate-50'
                          }`}>
                            <Icon className={`w-4 h-4 ${selected ? 'text-ocean-600' : 'text-slate-400'}`} />
                          </div>
                          <span className={`text-[14px] font-medium ${selected ? 'text-ocean-700' : 'text-slate-700'}`}>{bt.label}</span>
                          {selected && <Check className="w-4 h-4 text-ocean-600 ml-auto" />}
                        </button>
                      );
                    })}
                  </div>
                  <FieldError show={showTypeError} message="Please select a business type" />
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Use Case ──────────────────────────────────── */}
          {currentStep === 1 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">What do you want to do?</h1>
              <p className="text-[14px] text-slate-500 mb-8">
                Select at least one \u2014 we'll personalize your experience. <span className="text-slate-400">You can choose more than one.</span>
              </p>

              <div className="grid grid-cols-2 gap-3">
                {useCases.map((uc) => {
                  const Icon = uc.icon;
                  const selected = selectedUseCases.includes(uc.value);
                  return (
                    <button
                      key={uc.value}
                      onClick={() => toggleUseCase(uc.value)}
                      className={`flex flex-col items-start gap-2.5 p-5 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-ocean-400 bg-ocean-50/50 ring-1 ring-ocean-200'
                          : showUseCaseError
                          ? 'border-red-200 bg-white hover:border-red-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                          selected ? 'bg-ocean-100' : 'bg-slate-50'
                        }`}>
                          <Icon className={`w-5 h-5 ${selected ? 'text-ocean-600' : 'text-slate-400'}`} />
                        </div>
                        {selected && <Check className="w-4 h-4 text-ocean-600" />}
                      </div>
                      <div>
                        <p className={`text-[14px] font-semibold ${selected ? 'text-ocean-700' : 'text-slate-700'}`}>{uc.label}</p>
                        <p className="text-[12px] text-slate-400 mt-0.5 leading-relaxed">{uc.desc}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
              <FieldError show={showUseCaseError} message="Please select at least one option" />
              {selectedUseCases.length > 0 && (
                <p className="text-[11px] text-emerald-600 mt-2 flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  {selectedUseCases.length} selected
                </p>
              )}
            </div>
          )}

          {/* ── Step 2: Company Details ───────────────────────────── */}
          {currentStep === 2 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">A few more details</h1>
              <p className="text-[14px] text-slate-500 mb-8">
                Optional \u2014 helps us recommend the right tools. <span className="text-slate-400">You can change this later.</span>
              </p>

              <div className="space-y-5">
                <div>
                  <FieldLabel label="Country" required={false} />
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, United Kingdom"
                    className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <FieldLabel label="Company size" required={false} />
                  <div className="flex gap-2.5">
                    {companySizes.map((cs) => (
                      <button
                        key={cs.value}
                        onClick={() => setCompanySize(cs.value)}
                        className={`flex-1 h-11 rounded-lg border text-[14px] font-medium transition-all ${
                          companySize === cs.value
                            ? 'border-ocean-400 bg-ocean-50 text-ocean-700 ring-1 ring-ocean-200'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {cs.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <FieldLabel label="Industry" required={false} />
                  <select
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all appearance-none"
                  >
                    <option value="">Select industry...</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 3: Plan Selection ────────────────────────────── */}
          {currentStep === 3 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">Choose your plan</h1>
              <p className="text-[14px] text-slate-500 mb-8">You can change this anytime. No credit card required.</p>

              <div className="grid grid-cols-2 gap-4">
                {/* Essentials */}
                <button
                  onClick={() => setPlanSelected("essentials")}
                  className={`flex flex-col p-6 rounded-2xl border text-left transition-all ${
                    planSelected === "essentials"
                      ? 'border-ocean-400 ring-1 ring-ocean-200 bg-white'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <h3 className="text-[16px] font-semibold text-slate-900">Essentials</h3>
                  <div className="flex items-baseline gap-0.5 mt-2 mb-4">
                    <span className="text-[28px] font-bold text-slate-900">$14</span>
                    <span className="text-[13px] text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-2.5 mb-4 flex-1">
                    {["Unlimited contracts", "All templates", "E-signatures", "AI generation", "Basic analytics"].map((f) => (
                      <li key={f} className="flex items-center gap-2 text-[13px] text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" />{f}
                      </li>
                    ))}
                  </ul>
                  {planSelected === "essentials" && (
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ocean-600">
                      <Check className="w-4 h-4" /> Selected
                    </div>
                  )}
                </button>

                {/* Growth */}
                <button
                  onClick={() => setPlanSelected("growth")}
                  className={`relative flex flex-col p-6 rounded-2xl border text-left transition-all ${
                    planSelected === "growth"
                      ? 'border-ocean-400 ring-1 ring-ocean-200 bg-gradient-to-b from-white to-ocean-50/30'
                      : 'border-slate-200 bg-gradient-to-b from-white to-ocean-50/20 hover:border-slate-300'
                  }`}
                >
                  <div className="absolute -top-2.5 right-4">
                    <span className="text-[10px] font-semibold bg-gradient-to-r from-ocean-500 to-violet-500 text-white px-2.5 py-0.5 rounded-full">Recommended</span>
                  </div>
                  <h3 className="text-[16px] font-semibold text-slate-900">Growth</h3>
                  <div className="flex items-baseline gap-0.5 mt-2 mb-4">
                    <span className="text-[28px] font-bold text-slate-900">$49</span>
                    <span className="text-[13px] text-slate-400">/mo</span>
                  </div>
                  <ul className="space-y-2.5 mb-4 flex-1">
                    {["Everything in Essentials", "Smart Insights", "Bottleneck detection", "Advanced analytics", "Smart recommendations"].map((f, i) => (
                      <li key={f} className="flex items-center gap-2 text-[13px] text-slate-600">
                        {i === 0 ? <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Sparkles className="w-3.5 h-3.5 text-violet-500 shrink-0" />}
                        {f}
                      </li>
                    ))}
                  </ul>
                  {planSelected === "growth" && (
                    <div className="flex items-center gap-1.5 text-[12px] font-semibold text-ocean-600">
                      <Check className="w-4 h-4" /> Selected
                    </div>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* ── Step 4: Starting Point ────────────────────────────── */}
          {currentStep === 4 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">How would you like to start?</h1>
              <p className="text-[14px] text-slate-500 mb-8">Pick one to get started \u2014 you can explore everything later.</p>

              <div className="space-y-3">
                {startingPoints.map((sp) => {
                  const Icon = sp.icon;
                  const selected = startingPoint === sp.value;
                  return (
                    <button
                      key={sp.value}
                      onClick={() => setStartingPoint(sp.value)}
                      className={`w-full flex items-center gap-4 p-5 rounded-xl border text-left transition-all ${
                        selected
                          ? 'border-ocean-400 bg-ocean-50/50 ring-1 ring-ocean-200'
                          : showStartError
                          ? 'border-red-200 bg-white hover:border-red-300'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                    >
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
                        selected ? 'bg-ocean-100' : 'bg-slate-50'
                      }`}>
                        <Icon className={`w-5 h-5 ${selected ? 'text-ocean-600' : 'text-slate-400'}`} />
                      </div>
                      <div className="flex-1">
                        <p className={`text-[15px] font-semibold ${selected ? 'text-ocean-700' : 'text-slate-700'}`}>{sp.label}</p>
                        <p className="text-[13px] text-slate-400 mt-0.5">{sp.desc}</p>
                      </div>
                      {selected && <Check className="w-5 h-5 text-ocean-600 shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <FieldError show={showStartError} message="Please choose how you'd like to start" />
            </div>
          )}

          {/* ── Navigation ────────────────────────────────────────── */}
          <div className="flex items-center justify-between mt-10">
            {currentStep > 0 ? (
              <button onClick={handleBack} className="flex items-center gap-1.5 text-[13px] font-medium text-slate-500 hover:text-slate-700 transition-colors">
                <ChevronLeft className="w-4 h-4" /> Back
              </button>
            ) : (
              <div />
            )}

            {currentStep < totalSteps - 1 ? (
              <div className="flex flex-col items-end">
                <button
                  onClick={handleNext}
                  disabled={attempted && !canContinue()}
                  className={`flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold rounded-lg transition-colors ${
                    canContinue()
                      ? 'text-white bg-ocean-600 hover:bg-ocean-700'
                      : 'text-white bg-ocean-600/50 cursor-not-allowed'
                  }`}
                >
                  Continue <ChevronRight className="w-4 h-4" />
                </button>
                <ContinueHint show={attempted && !canContinue()} />
              </div>
            ) : (
              <div className="flex flex-col items-end">
                <button
                  onClick={handleComplete}
                  disabled={isLoading}
                  className={`flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold rounded-lg transition-colors ${
                    startingPoint
                      ? 'text-white bg-ocean-600 hover:bg-ocean-700'
                      : 'text-white bg-ocean-600/50 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  ) : (
                    <>Get Started <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <ContinueHint show={attempted && !startingPoint} />
              </div>
            )}
          </div>

          {/* Skip for optional steps */}
          {currentStep === 2 && (
            <div className="text-center mt-4">
              <button onClick={handleNext} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors underline underline-offset-2">
                Skip for now
              </button>
              <p className="text-[10px] text-slate-300 mt-1">Skipping won't affect your setup</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
