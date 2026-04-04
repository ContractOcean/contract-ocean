import { useState, useRef, useCallback } from "react";
import {
  Users,
  Layers,
  Mail,
  Send,
  Plus,
  Trash2,
  GripVertical,
  ChevronRight,
  ChevronLeft,
  Check,
  PenTool,
  Type,
  Calendar,
  User,
  Briefcase,
  Building2,
  CheckCircle2,
  Clock,
  ArrowRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  ToggleLeft,
  ToggleRight,
  Move,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Recipient {
  id: string;
  name: string;
  email: string;
  role: "Signer" | "Reviewer" | "CC";
}

const STEPS = [
  { label: "Recipients", icon: Users },
  { label: "Fields", icon: Layers },
  { label: "Message", icon: Mail },
  { label: "Review & Send", icon: Send },
];

const FIELD_TYPES = [
  { label: "Signature", icon: PenTool, color: "bg-ocean-100 text-ocean-700" },
  { label: "Initials", icon: Type, color: "bg-violet-100 text-violet-700" },
  { label: "Date Signed", icon: Calendar, color: "bg-emerald-100 text-emerald-700" },
  { label: "Name", icon: User, color: "bg-amber-100 text-amber-700" },
  { label: "Title", icon: Briefcase, color: "bg-pink-100 text-pink-700" },
  { label: "Company", icon: Building2, color: "bg-cyan-100 text-cyan-700" },
];

const RECIPIENT_COLORS = [
  "bg-ocean-500",
  "bg-violet-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-pink-500",
];

interface PlacedField {
  id: string;
  type: string;
  recipientIdx: number;
  top: number;
  left: number;
  required: boolean;
}

let _pfId = 0;
function pfId() { return `pf-${++_pfId}`; }

const INITIAL_PLACED_FIELDS: PlacedField[] = [
  { id: pfId(), type: "Name", recipientIdx: 0, top: 78, left: 5, required: true },
  { id: pfId(), type: "Signature", recipientIdx: 0, top: 83, left: 5, required: true },
  { id: pfId(), type: "Date Signed", recipientIdx: 0, top: 88, left: 5, required: true },
  { id: pfId(), type: "Name", recipientIdx: 1, top: 78, left: 52, required: true },
  { id: pfId(), type: "Signature", recipientIdx: 1, top: 83, left: 52, required: true },
  { id: pfId(), type: "Date Signed", recipientIdx: 1, top: 88, left: 52, required: true },
];

export default function SignSendPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [signingOrder, setSigningOrder] = useState(false);
  const [sent, setSent] = useState(false);
  const [recipients, setRecipients] = useState<Recipient[]>([
    { id: "r1", name: "Rachel Morrison", email: "rachel@meridiantech.com", role: "Signer" },
    { id: "r2", name: "Sarah Chen", email: "sarah@company.com", role: "Signer" },
  ]);
  const [subject, setSubject] = useState("Please sign: Master Service Agreement");
  const [message, setMessage] = useState(
    `Hi,\n\nYou have been invited to review and sign the Master Service Agreement. Please review the document carefully and complete the required signature fields at your earliest convenience.\n\nIf you have any questions regarding the terms, feel free to reach out before signing.\n\nThank you for your prompt attention to this matter.\n\nBest regards,\nSarah Chen\nContract Ocean`
  );
  const [includeSummary, setIncludeSummary] = useState(true);

  // Fields step state
  const [placedFields, setPlacedFields] = useState<PlacedField[]>(INITIAL_PLACED_FIELDS);
  const [activeRecipientIdx, setActiveRecipientIdx] = useState(0);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [draggingFieldType, setDraggingFieldType] = useState<string | null>(null);
  const [selectedFieldId, setSelectedFieldId] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);
  const [repositioning, setRepositioning] = useState<string | null>(null);
  const dropRef = useRef<HTMLDivElement>(null);
  const repoStartRef = useRef<{ startX: number; startY: number; origTop: number; origLeft: number } | null>(null);

  // Drag from palette
  const handleDragStart = useCallback((fieldType: string) => {
    setDraggingFieldType(fieldType);
    setSelectedFieldId(null);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "copy";
    setIsDraggingOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDraggingOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDraggingOver(false);
      const fieldType = e.dataTransfer.getData("text/plain") || draggingFieldType;
      if (!fieldType || !dropRef.current) return;

      const rect = dropRef.current.getBoundingClientRect();
      const top = ((e.clientY - rect.top) / rect.height) * 100;
      const left = ((e.clientX - rect.left) / rect.width) * 100;

      setPlacedFields((prev) => [
        ...prev,
        {
          id: pfId(),
          type: fieldType,
          recipientIdx: activeRecipientIdx,
          top: Math.max(2, Math.min(92, top)),
          left: Math.max(2, Math.min(80, left)),
          required: true,
        },
      ]);
      setDraggingFieldType(null);
    },
    [activeRecipientIdx, draggingFieldType]
  );

  const removePlacedField = useCallback((id: string) => {
    setPlacedFields((prev) => prev.filter((f) => f.id !== id));
    if (selectedFieldId === id) setSelectedFieldId(null);
  }, [selectedFieldId]);

  const toggleFieldRequired = useCallback((id: string) => {
    setPlacedFields((prev) => prev.map((f) => f.id === id ? { ...f, required: !f.required } : f));
  }, []);

  const reassignField = useCallback((id: string, newIdx: number) => {
    setPlacedFields((prev) => prev.map((f) => f.id === id ? { ...f, recipientIdx: newIdx } : f));
  }, []);

  // Reposition via mouse drag on placed field
  const startReposition = useCallback((e: React.MouseEvent, fieldId: string) => {
    e.preventDefault();
    e.stopPropagation();
    const field = placedFields.find((f) => f.id === fieldId);
    if (!field) return;
    setRepositioning(fieldId);
    repoStartRef.current = { startX: e.clientX, startY: e.clientY, origTop: field.top, origLeft: field.left };

    const onMove = (me: MouseEvent) => {
      if (!repoStartRef.current || !dropRef.current) return;
      const rect = dropRef.current.getBoundingClientRect();
      const dTop = ((me.clientY - repoStartRef.current.startY) / rect.height) * 100;
      const dLeft = ((me.clientX - repoStartRef.current.startX) / rect.width) * 100;
      setPlacedFields((prev) => prev.map((f) =>
        f.id === fieldId
          ? { ...f, top: Math.max(1, Math.min(94, repoStartRef.current!.origTop + dTop)), left: Math.max(1, Math.min(85, repoStartRef.current!.origLeft + dLeft)) }
          : f
      ));
    };
    const onUp = () => {
      setRepositioning(null);
      repoStartRef.current = null;
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseup", onUp);
    };
    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseup", onUp);
  }, [placedFields]);

  // Auto-place AI
  const autoPlaceFields = useCallback(() => {
    const autoFields: PlacedField[] = [];
    recipients.forEach((_r, idx) => {
      const baseLeft = idx === 0 ? 5 : 52;
      autoFields.push(
        { id: pfId(), type: "Name", recipientIdx: idx, top: 76, left: baseLeft, required: true },
        { id: pfId(), type: "Signature", recipientIdx: idx, top: 81, left: baseLeft, required: true },
        { id: pfId(), type: "Date Signed", recipientIdx: idx, top: 86, left: baseLeft, required: true },
        { id: pfId(), type: "Title", recipientIdx: idx, top: 91, left: baseLeft, required: false },
      );
    });
    setPlacedFields(autoFields);
    setSelectedFieldId(null);
  }, [recipients]);

  const addRecipient = () => {
    setRecipients((prev) => [
      ...prev,
      { id: `r${Date.now()}`, name: "", email: "", role: "Signer" },
    ]);
  };

  const removeRecipient = (id: string) => {
    setRecipients((prev) => prev.filter((r) => r.id !== id));
  };

  const updateRecipient = (id: string, field: keyof Recipient, value: string) => {
    setRecipients((prev) =>
      prev.map((r) => (r.id === id ? { ...r, [field]: value } : r))
    );
  };

  const canContinue = () => {
    if (step === 0) return recipients.length > 0 && recipients.every((r) => r.name && r.email);
    if (step === 1) return true;
    if (step === 2) return subject.trim().length > 0;
    return true;
  };

  /* ------------------------------------------------------------------ */
  /* Step renderers                                                      */
  /* ------------------------------------------------------------------ */

  const renderRecipients = () => (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-[17px] font-semibold text-slate-900">Add Recipients</h2>
      <p className="mt-1 text-[13px] text-slate-500">
        Specify who needs to sign, review, or receive a copy of this contract.
      </p>

      <div className="mt-6 space-y-4">
        {recipients.map((r, idx) => (
          <div
            key={r.id}
            className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            {signingOrder && (
              <div className="flex flex-col items-center gap-1 pt-2">
                <GripVertical className="h-4 w-4 cursor-grab text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400">{idx + 1}</span>
              </div>
            )}

            <div className="flex-1 grid grid-cols-1 gap-3 sm:grid-cols-3">
              <input
                value={r.name}
                onChange={(e) => updateRecipient(r.id, "name", e.target.value)}
                placeholder="Full name"
                className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
              />
              <input
                value={r.email}
                onChange={(e) => updateRecipient(r.id, "email", e.target.value)}
                placeholder="Email address"
                className="rounded-lg border border-slate-200 px-3 py-2 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
              />
              <select
                value={r.role}
                onChange={(e) => updateRecipient(r.id, "role", e.target.value)}
                className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
              >
                <option>Signer</option>
                <option>Reviewer</option>
                <option>CC</option>
              </select>
            </div>

            <button
              onClick={() => removeRecipient(r.id)}
              className="mt-1 rounded-lg p-1.5 text-slate-400 transition-colors hover:bg-red-50 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>

      <button
        onClick={addRecipient}
        className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-dashed border-slate-300 px-4 py-2 text-[13px] font-medium text-slate-600 transition-colors hover:border-ocean-300 hover:bg-ocean-50 hover:text-ocean-700"
      >
        <Plus className="h-4 w-4" />
        Add Recipient
      </button>

      {/* Signing order toggle */}
      <div className="mt-8 flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">
        <div>
          <p className="text-[14px] font-medium text-slate-800">Set signing order</p>
          <p className="mt-0.5 text-[12px] text-slate-500">
            Recipients will sign in the order shown above
          </p>
        </div>
        <button
          onClick={() => setSigningOrder(!signingOrder)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            signingOrder ? "bg-ocean-500" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              signingOrder ? "translate-x-5" : "translate-x-0.5"
            }`}
          />
        </button>
      </div>
    </div>
  );

  const fieldColorsByRecipient = [
    { border: "border-ocean-400", bg: "bg-ocean-50", text: "text-ocean-700", sel: "ring-ocean-500" },
    { border: "border-violet-400", bg: "bg-violet-50", text: "text-violet-700", sel: "ring-violet-500" },
    { border: "border-emerald-400", bg: "bg-emerald-50", text: "text-emerald-700", sel: "ring-emerald-500" },
    { border: "border-amber-400", bg: "bg-amber-50", text: "text-amber-700", sel: "ring-amber-500" },
    { border: "border-pink-400", bg: "bg-pink-50", text: "text-pink-700", sel: "ring-pink-500" },
  ];

  const selectedField = placedFields.find((f) => f.id === selectedFieldId);

  const renderFields = () => (
    <div className="flex gap-6">
      {/* Document preview (drop zone) */}
      <div className="flex-1 rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
        {/* Zoom controls */}
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-slate-100">
          <span className="text-[11px] font-medium text-slate-400">{zoom}%</span>
          <div className="flex items-center gap-1">
            <button onClick={() => setZoom((z) => Math.max(60, z - 10))} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Zoom out">
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <div className="w-16 h-1 bg-slate-200 rounded-full relative mx-1">
              <div className="absolute top-0 left-0 h-full bg-ocean-400 rounded-full" style={{ width: `${((zoom - 60) / 80) * 100}%` }} />
            </div>
            <button onClick={() => setZoom((z) => Math.min(140, z + 10))} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors" title="Zoom in">
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button onClick={() => setZoom(100)} className="p-1 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors ml-1" title="Fit to screen">
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>
          <button
            onClick={autoPlaceFields}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[11px] font-semibold bg-gradient-to-r from-violet-500 to-ocean-500 text-white hover:from-violet-600 hover:to-ocean-600 transition-all shadow-sm"
          >
            <Sparkles className="w-3 h-3" />
            Auto-place fields
          </button>
        </div>

        <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 320px)" }}>
          <div
            ref={dropRef}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={(e) => { if (e.target === e.currentTarget || (e.target as HTMLElement).closest('[data-contract-content]')) setSelectedFieldId(null); }}
            className={`relative w-full rounded-lg bg-white p-8 transition-all origin-top-left ${isDraggingOver ? "ring-2 ring-ocean-400 ring-offset-2 bg-ocean-50/30" : ""}`}
            style={{ aspectRatio: "8.5/11", transform: `scale(${zoom / 100})`, transformOrigin: "top center" }}
          >
            {/* Drop zone hint */}
            {isDraggingOver && (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-lg pointer-events-none bg-ocean-50/40">
                <div className="rounded-xl bg-ocean-600/90 px-6 py-3 text-[14px] font-semibold text-white shadow-lg backdrop-blur-sm">
                  Drop field here
                </div>
              </div>
            )}

            {/* Snap guides — signature areas */}
            {isDraggingOver && (
              <>
                <div className="absolute left-[4%] right-[54%] top-[74%] bottom-[4%] border-2 border-dashed border-ocean-200 rounded-lg pointer-events-none z-[5] flex items-center justify-center">
                  <span className="text-[9px] font-medium text-ocean-300 bg-white/80 px-2 py-0.5 rounded">Client signature area</span>
                </div>
                <div className="absolute left-[51%] right-[4%] top-[74%] bottom-[4%] border-2 border-dashed border-violet-200 rounded-lg pointer-events-none z-[5] flex items-center justify-center">
                  <span className="text-[9px] font-medium text-violet-300 bg-white/80 px-2 py-0.5 rounded">Provider signature area</span>
                </div>
              </>
            )}

            {/* Contract content */}
            <div className="select-none pointer-events-none" data-contract-content style={{ fontFamily: "'Times New Roman', Georgia, serif" }}>
              <h2 className="text-center text-[11px] font-bold text-slate-800 tracking-wider uppercase mb-0.5">MASTER SERVICE AGREEMENT</h2>
              <p className="text-center text-[7px] text-slate-400 mb-3">Agreement No. CON-001</p>
              <div className="w-full border-t border-slate-300 mb-3" />
              <p className="text-[7px] leading-[1.6] text-slate-600 mb-2">
                This Master Service Agreement (the &ldquo;Agreement&rdquo;) is entered into as of January 1, 2026, by and between <span className="font-semibold text-slate-800">Acme Corporation</span>, a corporation organized under the laws of the State of Delaware (&ldquo;Client&rdquo;), and <span className="font-semibold text-slate-800">Meridian Technologies Ltd</span> (&ldquo;Service Provider&rdquo;).
              </p>
              <h3 className="text-[8px] font-bold text-slate-800 mb-1 mt-3">1. Scope of Services</h3>
              <p className="text-[7px] leading-[1.6] text-slate-600 mb-2">The Service Provider agrees to provide professional consulting, software development, and related technology services as described in each Statement of Work (&ldquo;SOW&rdquo;) executed under this Agreement.</p>
              <h3 className="text-[8px] font-bold text-slate-800 mb-1 mt-3">2. Fees and Payment</h3>
              <p className="text-[7px] leading-[1.6] text-slate-600 mb-2">The Client shall pay the Service Provider fees as outlined in each applicable SOW. The total contract value shall not exceed $128,000 for the initial term. Invoices are payable within thirty (30) days.</p>
              <h3 className="text-[8px] font-bold text-slate-800 mb-1 mt-3">3. Confidentiality</h3>
              <p className="text-[7px] leading-[1.6] text-slate-600 mb-2">Each Party agrees to maintain the confidentiality of all proprietary information for five (5) years following termination.</p>
              <h3 className="text-[8px] font-bold text-slate-800 mb-1 mt-3">4. Term and Termination</h3>
              <p className="text-[7px] leading-[1.6] text-slate-600 mb-3">This Agreement shall continue for 24 months. Either Party may terminate with sixty (60) days written notice.</p>
              <div className="w-full border-t border-slate-300 mb-3 mt-2" />
              <h3 className="text-[8px] font-bold text-slate-800 mb-2">IN WITNESS WHEREOF</h3>
              <p className="text-[7px] leading-[1.6] text-slate-600 mb-4">The Parties have executed this Agreement as of the date first written above.</p>
              <div className="flex justify-between mt-2">
                <div className="w-[42%]">
                  <p className="text-[7px] font-bold text-slate-700 mb-1">CLIENT</p>
                  <p className="text-[6.5px] text-slate-500">Acme Corporation</p>
                  <div className="mt-6 border-t border-slate-400 pt-0.5"><p className="text-[6px] text-slate-400">Signature &amp; Date</p></div>
                </div>
                <div className="w-[42%]">
                  <p className="text-[7px] font-bold text-slate-700 mb-1">SERVICE PROVIDER</p>
                  <p className="text-[6.5px] text-slate-500">Meridian Technologies Ltd</p>
                  <div className="mt-6 border-t border-slate-400 pt-0.5"><p className="text-[6px] text-slate-400">Signature &amp; Date</p></div>
                </div>
              </div>
            </div>

            {/* Placed fields */}
            {placedFields.map((f) => {
              const rColor = RECIPIENT_COLORS[f.recipientIdx % RECIPIENT_COLORS.length];
              const recipientName = recipients[f.recipientIdx]?.name || `Recipient ${f.recipientIdx + 1}`;
              const colors = fieldColorsByRecipient[f.recipientIdx % fieldColorsByRecipient.length];
              const isSelected = selectedFieldId === f.id;
              const isMoving = repositioning === f.id;

              return (
                <div
                  key={f.id}
                  onClick={(e) => { e.stopPropagation(); setSelectedFieldId(isSelected ? null : f.id); }}
                  onMouseDown={(e) => { if (e.button === 0) startReposition(e, f.id); }}
                  className={`absolute flex items-center gap-1.5 rounded-md border-2 px-2.5 py-1 text-[11px] font-medium cursor-move transition-shadow z-20 ${
                    isSelected
                      ? `${colors.border} ${colors.bg} ${colors.text} ring-2 ${colors.sel} shadow-lg`
                      : `${colors.border} ${colors.bg} ${colors.text} border-dashed hover:shadow-md`
                  } ${isMoving ? "opacity-80 shadow-xl" : ""}`}
                  style={{ top: `${f.top}%`, left: `${f.left}%`, userSelect: "none" }}
                >
                  <Move className="w-3 h-3 opacity-40 shrink-0" />
                  <span className={`h-2 w-2 rounded-full ${rColor} shrink-0`} />
                  {f.type}
                  <span className="text-[10px] opacity-60">({recipientName.split(" ")[0]})</span>
                  {!f.required && <span className="text-[8px] opacity-50 ml-0.5">opt</span>}

                  {/* Resize handle (visual) */}
                  <div className={`absolute -bottom-1 -right-1 w-2.5 h-2.5 rounded-sm border bg-white ${colors.border} ${isSelected ? "opacity-100" : "opacity-0"} transition-opacity cursor-se-resize`} />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-64 shrink-0 flex flex-col gap-5">
        {/* Selected field panel */}
        {selectedField && (
          <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-[13px] font-semibold text-slate-900">Field Settings</h4>
              <button onClick={() => setSelectedFieldId(null)} className="p-1 rounded hover:bg-slate-100 text-slate-400"><X className="w-3.5 h-3.5" /></button>
            </div>
            <div className="space-y-3">
              <div>
                <p className="text-[11px] font-medium text-slate-400 mb-1">Type</p>
                <p className="text-[13px] font-semibold text-slate-700">{selectedField.type}</p>
              </div>
              <div>
                <p className="text-[11px] font-medium text-slate-400 mb-1.5">Assigned to</p>
                <div className="space-y-1">
                  {recipients.map((r, idx) => (
                    <button
                      key={r.id}
                      onClick={() => reassignField(selectedField.id, idx)}
                      className={`flex w-full items-center gap-2 rounded-lg border px-2.5 py-1.5 text-[12px] transition-all ${
                        selectedField.recipientIdx === idx ? "border-ocean-300 bg-ocean-50" : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span className={`h-2.5 w-2.5 rounded-full ${RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length]}`} />
                      <span className="font-medium text-slate-700">{r.name || "Unnamed"}</span>
                      {selectedField.recipientIdx === idx && <Check className="w-3 h-3 text-ocean-600 ml-auto" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="text-[12px] text-slate-600">Required</span>
                <button
                  onClick={() => toggleFieldRequired(selectedField.id)}
                  className="transition-colors"
                >
                  {selectedField.required ? (
                    <ToggleRight className="w-6 h-6 text-ocean-500" />
                  ) : (
                    <ToggleLeft className="w-6 h-6 text-slate-300" />
                  )}
                </button>
              </div>
              <button
                onClick={() => removePlacedField(selectedField.id)}
                className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-white px-3 py-2 text-[12px] font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-3 h-3" />
                Delete field
              </button>
            </div>
          </div>
        )}

        {/* Drag fields */}
        <div>
          <h3 className="mb-1 text-[14px] font-semibold text-slate-900">Drag Fields</h3>
          <p className="mb-3 text-[12px] text-slate-500">Drag onto the document to place</p>
          <div className="space-y-1.5">
            {FIELD_TYPES.map((f) => (
              <div
                key={f.label}
                draggable
                onDragStart={(e) => {
                  e.dataTransfer.setData("text/plain", f.label);
                  e.dataTransfer.effectAllowed = "copy";
                  handleDragStart(f.label);
                }}
                onDragEnd={() => setDraggingFieldType(null)}
                className={`flex cursor-grab items-center gap-3 rounded-lg border bg-white px-3 py-2 text-[13px] font-medium text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md active:cursor-grabbing ${
                  draggingFieldType === f.label ? "border-ocean-300 ring-2 ring-ocean-100 opacity-60" : "border-slate-200"
                }`}
              >
                <div className={`flex h-7 w-7 items-center justify-center rounded-lg ${f.color}`}>
                  <f.icon className="h-3.5 w-3.5" />
                </div>
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Assign to recipient */}
        <div>
          <h4 className="mb-2 text-[13px] font-semibold text-slate-700">Assign to</h4>
          <div className="space-y-1.5">
            {recipients.map((r, idx) => (
              <button
                key={r.id}
                onClick={() => setActiveRecipientIdx(idx)}
                className={`flex w-full items-center gap-2 rounded-lg border px-3 py-2 text-[13px] transition-all ${
                  activeRecipientIdx === idx ? "border-ocean-300 bg-ocean-50 ring-1 ring-ocean-200" : "border-slate-200 bg-white hover:border-slate-300"
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length]}`} />
                <span className="font-medium text-slate-700">{r.name || "Unnamed"}</span>
                <span className="ml-auto text-[11px] text-slate-400">{r.role}</span>
                {activeRecipientIdx === idx && <Check className="h-3.5 w-3.5 text-ocean-600" />}
              </button>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-slate-400">
            {placedFields.length} field{placedFields.length !== 1 ? "s" : ""} placed &middot; {placedFields.filter((f) => f.required).length} required
          </p>
        </div>
      </div>
    </div>
  );

  const renderMessage = () => (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-[17px] font-semibold text-slate-900">Compose Message</h2>
      <p className="mt-1 text-[13px] text-slate-500">
        Customize the email recipients will receive with the signing request.
      </p>

      <div className="mt-6 space-y-4">
        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Subject Line</label>
          <input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-medium text-slate-700">Message</label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={8}
            className="w-full resize-none rounded-lg border border-slate-200 px-3.5 py-2.5 text-[13px] leading-relaxed text-slate-700 placeholder:text-slate-400 focus:border-ocean-300 focus:outline-none focus:ring-2 focus:ring-ocean-100"
          />
        </div>

        {/* Include summary toggle */}
        <div className="flex items-center justify-between rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-[14px] font-medium text-slate-800">Include contract summary</p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              Attach a brief overview of key contract terms in the email
            </p>
          </div>
          <button
            onClick={() => setIncludeSummary(!includeSummary)}
            className={`relative h-6 w-11 rounded-full transition-colors ${
              includeSummary ? "bg-ocean-500" : "bg-slate-300"
            }`}
          >
            <span
              className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                includeSummary ? "translate-x-5" : "translate-x-0.5"
              }`}
            />
          </button>
        </div>
      </div>

      {/* Email preview */}
      <div className="mt-8">
        <h3 className="mb-3 text-[14px] font-semibold text-slate-700">Email Preview</h3>
        <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-100 bg-slate-50 px-5 py-3">
            <p className="text-[12px] text-slate-500">
              <span className="font-medium text-slate-600">To:</span>{" "}
              {recipients.map((r) => r.email).join(", ")}
            </p>
            <p className="mt-0.5 text-[12px] text-slate-500">
              <span className="font-medium text-slate-600">Subject:</span> {subject}
            </p>
          </div>
          <div className="px-5 py-4">
            <div className="mb-4 flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-ocean-100">
                <Send className="h-4 w-4 text-ocean-600" />
              </div>
              <span className="text-[14px] font-semibold text-ocean-700">Contract Ocean</span>
            </div>
            <p className="whitespace-pre-line text-[13px] leading-relaxed text-slate-600">
              {message}
            </p>
            {includeSummary && (
              <div className="mt-4 rounded-lg border border-ocean-100 bg-ocean-50 px-4 py-3">
                <p className="text-[12px] font-semibold text-ocean-700">Contract Summary</p>
                <p className="mt-1 text-[12px] text-ocean-600">
                  Master Service Agreement - Meridian Technologies Ltd
                </p>
              </div>
            )}
            <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-5 py-2.5 text-[13px] font-semibold text-white">
              Review & Sign Document
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderReview = () =>
    sent ? (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 animate-[scale-in_0.3s_ease-out]">
          <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        </div>
        <h2 className="text-[20px] font-bold text-slate-900">Contract sent successfully</h2>
        <p className="mt-2 text-[14px] text-slate-500">
          All recipients have been notified and can now review and sign the contract.
        </p>
        <div className="mt-2 flex items-center gap-2 text-[13px] text-slate-400">
          <Clock className="h-4 w-4" />
          Expires in 30 days
        </div>
        <button
          onClick={() => navigate("/contracts")}
          className="mt-8 inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-6 py-2.5 text-[14px] font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700"
        >
          Track status in Contracts
          <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    ) : (
      <div className="mx-auto max-w-2xl">
        <h2 className="text-[17px] font-semibold text-slate-900">Review & Send</h2>
        <p className="mt-1 text-[13px] text-slate-500">
          Confirm all the details before sending the contract for signature.
        </p>

        <div className="mt-6 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {/* Document info */}
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="text-[12px] font-medium uppercase tracking-wider text-slate-400">
              Document
            </p>
            <p className="mt-1 text-[15px] font-semibold text-slate-900">
              Master Service Agreement
            </p>
            <p className="mt-0.5 text-[13px] text-slate-500">Meridian Technologies Ltd</p>
          </div>

          {/* Recipients */}
          <div className="border-b border-slate-100 px-6 py-4">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-slate-400">
              Recipients
            </p>
            <div className="space-y-2.5">
              {recipients.map((r, idx) => (
                <div key={r.id} className="flex items-center gap-3">
                  {signingOrder && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[11px] font-bold text-slate-500">
                      {idx + 1}
                    </span>
                  )}
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full text-[12px] font-bold text-white ${
                      RECIPIENT_COLORS[idx % RECIPIENT_COLORS.length]
                    }`}
                  >
                    {r.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p className="text-[13px] font-medium text-slate-800">{r.name}</p>
                    <p className="text-[12px] text-slate-500">{r.email}</p>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-[11px] font-semibold ${
                      r.role === "Signer"
                        ? "bg-ocean-50 text-ocean-700"
                        : r.role === "Reviewer"
                        ? "bg-amber-50 text-amber-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {r.role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Settings */}
          <div className="px-6 py-4">
            <p className="mb-3 text-[12px] font-medium uppercase tracking-wider text-slate-400">
              Settings
            </p>
            <div className="space-y-2 text-[13px] text-slate-600">
              <div className="flex justify-between">
                <span>Signing Order</span>
                <span className="font-medium text-slate-800">
                  {signingOrder ? "Sequential" : "Any order"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Expiration</span>
                <span className="font-medium text-slate-800">30 days</span>
              </div>
              <div className="flex justify-between">
                <span>Reminders</span>
                <span className="font-medium text-slate-800">Every 3 days</span>
              </div>
              <div className="flex justify-between">
                <span>Contract Summary</span>
                <span className="font-medium text-slate-800">
                  {includeSummary ? "Included" : "Not included"}
                </span>
              </div>
            </div>
          </div>
        </div>

        <button
          onClick={() => setSent(true)}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-ocean-600 py-3.5 text-[15px] font-semibold text-white shadow-sm transition-colors hover:bg-ocean-700"
        >
          <Send className="h-5 w-5" />
          Send for Signature
        </button>
      </div>
    );

  const stepRenderers = [renderRecipients, renderFields, renderMessage, renderReview];

  return (
    <div
      className="min-h-screen bg-slate-50 px-6 py-8 lg:px-10"
      style={{ fontFamily: "'Inter', system-ui, -apple-system, sans-serif" }}
    >
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-[22px] font-bold tracking-tight text-slate-900">Sign & Send</h1>
        <p className="mt-1 text-[14px] text-slate-500">
          Prepare your contract for signature and send it to recipients
        </p>
      </div>

      {/* Step Indicator */}
      <div className="mb-8 flex items-center justify-center gap-0">
        {STEPS.map((s, idx) => {
          const StepIcon = s.icon;
          const isActive = idx === step;
          const isComplete = idx < step;
          return (
            <div key={s.label} className="flex items-center">
              <button
                onClick={() => idx < step && !sent && setStep(idx)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                  isActive
                    ? "bg-ocean-600 text-white shadow-sm"
                    : isComplete
                    ? "bg-ocean-50 text-ocean-700 hover:bg-ocean-100"
                    : "bg-white text-slate-400 border border-slate-200"
                }`}
              >
                {isComplete ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <StepIcon className="h-4 w-4" />
                )}
                <span className="hidden sm:inline">{s.label}</span>
              </button>
              {idx < STEPS.length - 1 && (
                <ChevronRight className="mx-1 h-4 w-4 text-slate-300" />
              )}
            </div>
          );
        })}
      </div>

      {/* Step Content */}
      <div className="mb-8">{stepRenderers[step]()}</div>

      {/* Bottom Navigation */}
      {!sent && (
        <div className="flex items-center justify-between border-t border-slate-200 pt-6">
          <button
            onClick={() => setStep((s) => Math.max(0, s - 1))}
            disabled={step === 0}
            className={`inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-[13px] font-medium transition-colors ${
              step === 0
                ? "cursor-not-allowed text-slate-300"
                : "text-slate-600 hover:border-slate-300 hover:bg-slate-50"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
            Back
          </button>

          {step < 3 && (
            <button
              onClick={() => setStep((s) => Math.min(3, s + 1))}
              disabled={!canContinue()}
              className={`inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-[13px] font-semibold text-white shadow-sm transition-colors ${
                canContinue()
                  ? "bg-ocean-600 hover:bg-ocean-700"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Continue
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
