import { AlertCircle, CheckCircle2, FileImage, UploadCloud, ShieldCheck, ChevronRight, Info } from "lucide-react";
import { useI18n } from "../i18n/I18nContext.jsx";

function DocumentCard({ title, subtitle, status, body, actionLabel }) {
  const statusConfig = {
    "Verified": "bg-secondary-container/50 text-secondary border-secondary-container",
    "Action Required": "bg-error-container/30 text-error border-error-container",
    "Pending": "bg-surface-container text-outline border-outline-variant"
  };

  const statusTone = statusConfig[status] || statusConfig["Pending"];

  return (
    <div className="terra-card p-6 flex flex-col shadow-lg transition-all hover:shadow-xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-surface-container p-3 text-primary">
            <FileImage size={24} />
          </div>
          <div>
            <h3 className="font-bold text-primary">{title}</h3>
            <p className="text-xs font-medium text-on-surface-variant mt-0.5">{subtitle}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase tracking-widest border ${statusTone}`}>
            {status}
        </span>
      </div>

      <div className="flex-1 rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-8 text-center flex flex-col items-center justify-center group cursor-pointer hover:bg-surface-container transition-colors">
        <UploadCloud className="text-outline group-hover:text-primary transition-colors" size={32} />
        <p className="mt-4 text-sm font-medium leading-relaxed text-on-surface-variant">{body}</p>
        <button className="btn-secondary mt-6 h-10 px-6 rounded-lg text-xs" type="button">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export function VerificationPage() {
  const { t } = useI18n();

  return (
    <section className="mx-auto grid max-w-7xl gap-10 px-5 py-10 lg:grid-cols-[320px_1fr]">
      <aside className="space-y-6">
        <div className="terra-card p-8 bg-primary text-on-primary shadow-2xl">
          <ShieldCheck className="text-white" size={32} />
          <h2 className="mt-6 font-headline-md">Why Verify?</h2>
          <p className="mt-4 text-sm font-medium leading-relaxed opacity-80">
            To certify your land for carbon credits, we must establish legal ownership and location accuracy.
          </p>
          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-sm font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                Institutional Validation
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                Buyer Confidence
            </div>
            <div className="flex items-center gap-3 text-sm font-bold">
                <div className="w-1.5 h-1.5 rounded-full bg-white" />
                Payout Readiness
            </div>
          </div>
        </div>

        <div className="terra-card p-6 shadow-md">
          <p className="terra-kicker">Current Progress</p>
          <div className="mt-4 h-3 rounded-full bg-surface-container overflow-hidden">
            <div className="h-full w-2/3 rounded-full bg-primary shadow-[0_0_10px_rgba(23,49,36,0.3)]" />
          </div>
          <div className="mt-3 flex justify-between text-xs font-black text-primary uppercase tracking-widest">
            <span>2 of 3 verified</span>
            <span>67%</span>
          </div>
        </div>
      </aside>

      <div className="space-y-10">
        <div>
          <p className="terra-kicker">Documents</p>
          <h1 className="mt-1 font-headline-lg text-primary">Land Ownership Proof</h1>
          <p className="mt-2 font-body-md text-on-surface-variant max-w-2xl">
            Upload original scanned copies or clear photos of the following documents to complete your profile.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <DocumentCard
            actionLabel="View Verification"
            body="Land title successfully verified by our team."
            status="Verified"
            subtitle="Primary ownership record"
            title="Land Title (Patta)"
          />
          <DocumentCard
            actionLabel="Upload Aadhaar"
            body="Upload Aadhaar card for farmer identity verification."
            status="Pending"
            subtitle="Identity verification"
            title="Farmer ID Proof"
          />
        </div>

        <div className="terra-card p-8 shadow-lg border-2 border-primary/5">
          <div className="flex items-start justify-between gap-4 mb-8">
            <div className="flex items-center gap-4">
                <div className="rounded-xl bg-surface-container p-3 text-primary">
                    <FileImage size={24} />
                </div>
                <div>
                    <h3 className="font-bold text-primary">Tax Receipts</h3>
                    <p className="text-xs font-medium text-on-surface-variant mt-0.5">Recent land revenue documentation</p>
                </div>
            </div>
            <span className="rounded-full bg-error-container/30 border border-error-container px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-error">
              Action Required
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-10 text-center flex flex-col items-center justify-center group cursor-pointer hover:bg-surface-container transition-colors">
              <UploadCloud className="text-outline group-hover:text-primary transition-colors" size={32} />
              <p className="mt-4 text-sm font-medium text-on-surface-variant">Re-upload tax receipt</p>
            </div>

            <div className="rounded-2xl bg-error-container/20 p-8 border border-error-container/30">
              <div className="flex items-center gap-3 text-error">
                <AlertCircle size={24} />
                <p className="font-black uppercase tracking-widest text-xs">Issue Detected</p>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-error font-medium">
                The 2023 document is blurry and the survey number is not legible. Please upload a high-resolution image of the original document.
              </p>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between rounded-3xl bg-secondary-container/20 border-2 border-secondary-container/30 px-10 py-8 gap-6 shadow-inner">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-secondary text-white flex items-center justify-center shadow-lg">
                <Info size={32} />
            </div>
            <div>
                <p className="text-lg font-black text-primary">Need help with verification?</p>
                <p className="text-sm font-medium text-on-surface-variant">Our support team can guide you through accepted document formats.</p>
            </div>
          </div>
          <button className="btn-primary h-14 px-8 rounded-xl shadow-lg whitespace-nowrap group" type="button">
            <CheckCircle2 size={20} />
            Contact Support
            <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}
