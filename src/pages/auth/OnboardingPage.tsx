import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Waves, Building2, Briefcase, User, Globe2, ChevronRight, ChevronLeft,
  Check, FileText, Sparkles, PenTool, Send, Zap,
  ArrowRight,
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
  { value: "1-5", label: "1–5" },
  { value: "6-20", label: "6–20" },
  { value: "21-50", label: "21–50" },
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

// ─── Main Component ─────────────────────────────────────────────────────────

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { updateProfile, profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // Form state
  const [companyName, setCompanyName] = useState(profile?.company_name || "");
  const [businessType, setBusinessType] = useState("");
  const [selectedUseCases, setSelectedUseCases] = useState<string[]>([]);
  const [country, setCountry] = useState("");
  const [companySize, setCompanySize] = useState("");
  const [industry, setIndustry] = useState("");
  const [planSelected, setPlanSelected] = useState("essentials");
  const [startingPoint, setStartingPoint] = useState("");

  const totalSteps = 5;

  function toggleUseCase(value: string) {
    setSelectedUseCases((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
  }

  function canContinue(): boolean {
    switch (currentStep) {
      case 0: return !!companyName && !!businessType;
      case 1: return selectedUseCases.length > 0;
      case 2: return true; // optional step
      case 3: return true; // plan selection
      case 4: return !!startingPoint;
      default: return false;
    }
  }

  function handleNext() {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) {
      setCurrentStep((s) => s - 1);
    }
  }

  async function handleComplete() {
    setIsLoading(true);
    await updateProfile({
      company_name: companyName,
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

    // Route based on starting point selection
    const sp = startingPoints.find((s) => s.value === startingPoint);
    navigate(sp?.route || "/");
  }

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
        <div className="w-24" /> {/* spacer */}
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-[560px]">

          {/* ── Step 0: Business Info ─────────────────────────────── */}
          {currentStep === 0 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">Tell us about your business</h1>
              <p className="text-[14px] text-slate-500 mb-8">This helps us personalize your experience.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Company name</label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Your company or business name"
                    className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2.5">Business type</label>
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
                </div>
              </div>
            </div>
          )}

          {/* ── Step 1: Use Case ──────────────────────────────────── */}
          {currentStep === 1 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">What do you want to do?</h1>
              <p className="text-[14px] text-slate-500 mb-8">Select all that apply. This helps us prioritize features for you.</p>

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
            </div>
          )}

          {/* ── Step 2: Company Details ───────────────────────────── */}
          {currentStep === 2 && (
            <div>
              <h1 className="text-[24px] font-bold text-slate-900 mb-1">A few more details</h1>
              <p className="text-[14px] text-slate-500 mb-8">Optional — helps us recommend the right tools.</p>

              <div className="space-y-5">
                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Country</label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, United Kingdom"
                    className="w-full h-11 px-3.5 text-[14px] text-slate-900 bg-white border border-slate-200 rounded-lg placeholder:text-slate-400 focus:border-ocean-400 focus:ring-2 focus:ring-ocean-100 outline-none transition-all"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-medium text-slate-700 mb-2.5">Company size</label>
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
                  <label className="block text-[13px] font-medium text-slate-700 mb-1.5">Industry <span className="text-slate-400">(optional)</span></label>
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
              <p className="text-[14px] text-slate-500 mb-8">Start free, upgrade anytime. No credit card required.</p>

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
              <p className="text-[14px] text-slate-500 mb-8">Pick one — you can always explore everything later.</p>

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
              <button
                onClick={handleNext}
                disabled={!canContinue()}
                className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-white bg-ocean-600 hover:bg-ocean-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Continue <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleComplete}
                disabled={isLoading || !startingPoint}
                className="flex items-center gap-2 px-6 py-2.5 text-[14px] font-semibold text-white bg-ocean-600 hover:bg-ocean-700 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="w-5 h-5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                ) : (
                  <>Get Started <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            )}
          </div>

          {/* Skip for step 2 (optional) */}
          {currentStep === 2 && (
            <div className="text-center mt-4">
              <button onClick={handleNext} className="text-[12px] text-slate-400 hover:text-slate-600 transition-colors">
                Skip for now
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
