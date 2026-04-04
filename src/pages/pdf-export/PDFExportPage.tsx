import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Download,
  Printer,
  Send,
} from 'lucide-react';

// ─── PDFExportPage ───────────────────────────────────────────────────────────

export default function PDFExportPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Toolbar */}
      <div className="sticky top-0 z-10 border-b border-slate-200 bg-white shadow-card">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <div className="h-5 w-px bg-slate-200" />
            <h1 className="text-sm font-semibold text-slate-900">Master Service Agreement</h1>
          </div>

          <div className="flex items-center gap-2">
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              <Send className="h-4 w-4" />
              Send
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 transition-colors">
              <Printer className="h-4 w-4" />
              Print
            </button>
            <button className="inline-flex items-center gap-2 rounded-lg bg-ocean-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-ocean-700 transition-colors focus:outline-none focus:ring-2 focus:ring-ocean-500 focus:ring-offset-2">
              <Download className="h-4 w-4" />
              Download PDF
            </button>
          </div>
        </div>
      </div>

      {/* Document preview area */}
      <div className="py-10 px-6">
        <div className="mx-auto max-w-[800px] rounded-sm bg-white shadow-modal">
          <div className="px-16 py-16 font-serif text-[13px] leading-[1.8] text-slate-800">
            {/* Letterhead */}
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="font-sans text-xl font-bold tracking-wide text-slate-900">ACME CORPORATION</h2>
                <p className="mt-1 font-sans text-xs text-slate-500">Contract Management Division</p>
              </div>
              <div className="text-right font-sans text-xs text-slate-500 leading-relaxed">
                <p>100 Market Street, Suite 400</p>
                <p>San Francisco, CA 94105</p>
                <p>+1 (415) 555-0100</p>
                <p>contracts@acmecorp.com</p>
              </div>
            </div>

            <hr className="border-slate-300 mb-8" />

            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="font-sans text-lg font-bold uppercase tracking-widest text-slate-900">
                Master Service Agreement
              </h1>
              <div className="mt-3 flex items-center justify-center gap-8 font-sans text-xs text-slate-500">
                <span>Agreement No: <span className="font-medium text-slate-700">CON-001</span></span>
                <span>Date: <span className="font-medium text-slate-700">March 21, 2026</span></span>
              </div>
            </div>

            {/* Section 1 */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">1. PARTIES</h3>
              <p>
                This Master Service Agreement (the &ldquo;Agreement&rdquo;) is entered into as of March 21, 2026
                (the &ldquo;Effective Date&rdquo;) by and between:
              </p>
              <p className="mt-3">
                <strong>Acme Corporation</strong>, a Delaware corporation with its principal place of business at
                100 Market Street, Suite 400, San Francisco, CA 94105 (hereinafter referred to as the
                &ldquo;Company&rdquo;); and
              </p>
              <p className="mt-3">
                <strong>Meridian Technologies Ltd</strong>, a company organized under the laws of the State of
                California with its principal place of business at 2500 Innovation Drive, Palo Alto, CA 94304
                (hereinafter referred to as the &ldquo;Service Provider&rdquo;).
              </p>
            </div>

            {/* Section 2 */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">2. SCOPE OF SERVICES</h3>
              <p>
                The Service Provider agrees to provide the Company with professional technology consulting and
                software development services as described in each Statement of Work (&ldquo;SOW&rdquo;) executed
                under this Agreement. Each SOW shall specify the scope, deliverables, timeline, and fees for the
                services to be performed.
              </p>
              <p className="mt-3">
                The Service Provider shall perform all services in a professional and workmanlike manner, consistent
                with industry standards and in accordance with applicable laws and regulations. The Service Provider
                shall assign qualified personnel with the appropriate skills and experience to perform the services.
              </p>
            </div>

            {/* Section 3 */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">3. FEES AND PAYMENT</h3>
              <p>
                The Company shall pay the Service Provider the fees specified in each applicable SOW. Unless
                otherwise stated in a SOW, the Service Provider shall invoice the Company monthly in arrears for
                services performed during the preceding calendar month.
              </p>
              <p className="mt-3">
                Payment shall be due within thirty (30) days of receipt of a valid invoice. Late payments shall bear
                interest at the rate of one and one-half percent (1.5%) per month, or the maximum rate permitted by
                law, whichever is less.
              </p>
            </div>

            {/* Section 4 */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">4. CONFIDENTIALITY</h3>
              <p>
                Each party acknowledges that during the performance of this Agreement, it may receive or have access
                to Confidential Information of the other party. &ldquo;Confidential Information&rdquo; means any
                information, whether written, oral, electronic, or visual, that is designated as confidential or
                that, given the nature of the information or the circumstances of disclosure, should reasonably be
                considered confidential.
              </p>
              <p className="mt-3">
                Each party agrees to: (a) hold the other party&rsquo;s Confidential Information in strict confidence;
                (b) not disclose such Confidential Information to any third party without prior written consent; and
                (c) use such Confidential Information solely for the purposes of performing its obligations under
                this Agreement.
              </p>
            </div>

            {/* Section 5 */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">5. TERM AND TERMINATION</h3>
              <p>
                This Agreement shall commence on the Effective Date and shall remain in effect for an initial term
                of twelve (12) months (the &ldquo;Initial Term&rdquo;), unless earlier terminated as provided herein.
                After the Initial Term, this Agreement shall automatically renew for successive twelve-month periods
                unless either party provides written notice of non-renewal at least sixty (60) days prior to the end
                of the then-current term.
              </p>
              <p className="mt-3">
                Either party may terminate this Agreement for cause upon thirty (30) days&rsquo; written notice if the
                other party materially breaches any provision of this Agreement and fails to cure such breach within
                the notice period.
              </p>
            </div>

            {/* Section 6 */}
            <div className="mb-6">
              <h3 className="font-sans text-sm font-bold text-slate-900 mb-2">6. GOVERNING LAW</h3>
              <p>
                This Agreement shall be governed by and construed in accordance with the laws of the State of
                California, without regard to its conflict of laws principles. Any disputes arising out of or
                relating to this Agreement shall be resolved in the state or federal courts located in San Francisco
                County, California, and each party consents to the exclusive jurisdiction of such courts.
              </p>
            </div>

            {/* Signature block */}
            <div className="mt-14 mb-8">
              <p className="font-sans text-sm font-bold text-slate-900 mb-6">
                IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.
              </p>

              <div className="grid grid-cols-2 gap-16">
                {/* Left signatory */}
                <div>
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-8">
                    The Company
                  </p>
                  <div className="border-b border-slate-400 mb-1.5" />
                  <p className="font-sans text-xs text-slate-500 mb-4">Signature</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-sans text-xs text-slate-500">Name</p>
                      <p className="font-sans text-sm font-medium text-slate-800">Sarah Chen</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-slate-500">Title</p>
                      <p className="font-sans text-sm font-medium text-slate-800">VP of Operations</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-slate-500">Date</p>
                      <p className="font-sans text-sm font-medium text-slate-800">_________________</p>
                    </div>
                  </div>
                </div>

                {/* Right signatory */}
                <div>
                  <p className="text-xs font-sans font-semibold uppercase tracking-wider text-slate-500 mb-8">
                    The Service Provider
                  </p>
                  <div className="border-b border-slate-400 mb-1.5" />
                  <p className="font-sans text-xs text-slate-500 mb-4">Signature</p>
                  <div className="space-y-3">
                    <div>
                      <p className="font-sans text-xs text-slate-500">Name</p>
                      <p className="font-sans text-sm font-medium text-slate-800">Rachel Morrison</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-slate-500">Title</p>
                      <p className="font-sans text-sm font-medium text-slate-800">VP of Operations</p>
                    </div>
                    <div>
                      <p className="font-sans text-xs text-slate-500">Date</p>
                      <p className="font-sans text-sm font-medium text-slate-800">_________________</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 pt-4 mt-12">
              <p className="text-center font-sans text-xs text-slate-400">Page 1 of 3</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
