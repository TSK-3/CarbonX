import { AlertCircle, CheckCircle2, FileImage, UploadCloud } from "lucide-react";

function DocumentCard({ title, subtitle, status, body, actionLabel }) {
  const statusTone =
    status === "Verified"
      ? "bg-sage-soft text-secondary"
      : status === "Action Required"
        ? "bg-red-100 text-red-700"
        : "bg-surface-container text-stone-700";

  return (
    <div className="terra-card p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <div className="rounded-xl bg-surface-low p-3 text-field">
            <FileImage size={20} />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-field">{title}</h3>
            <p className="text-sm text-stone-600">{subtitle}</p>
          </div>
        </div>
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusTone}`}>{status}</span>
      </div>
      <div className="mt-5 rounded-xl border border-outline-variant bg-surface-low p-6 text-center">
        <UploadCloud className="mx-auto text-outline" size={22} />
        <p className="mt-3 text-sm leading-6 text-stone-700">{body}</p>
        <button className="btn-secondary mt-4" type="button">
          {actionLabel}
        </button>
      </div>
    </div>
  );
}

export function VerificationPage() {
  return (
    <section className="mx-auto grid max-w-7xl gap-6 px-5 py-8 lg:grid-cols-[298px_1fr]">
      <aside className="space-y-4">
        <div className="terra-card p-6">
          <AlertCircle className="text-field" size={18} />
          <h2 className="mt-4 text-2xl font-semibold text-field">Why Verify?</h2>
          <p className="mt-3 text-sm leading-7 text-stone-700">
            To certify your land for carbon credits, we must establish legal ownership and location accuracy.
          </p>
          <div className="mt-5 space-y-3 text-sm text-stone-700">
            <p>Institutional-grade validation</p>
            <p>Stronger buyer confidence</p>
            <p>Transparent payout readiness</p>
          </div>
        </div>
        <div className="terra-card p-4">
          <p className="font-semibold text-field">Current Progress</p>
          <div className="mt-3 h-2 rounded-full bg-surface-high">
            <div className="h-2 w-2/3 rounded-full bg-field" />
          </div>
          <div className="mt-2 flex justify-between text-xs text-stone-600">
            <span>2 of 3 uploaded</span>
            <span>67%</span>
          </div>
        </div>
      </aside>

      <div>
        <div className="mb-6">
          <h1 className="text-4xl font-bold text-field">Land Ownership Documents</h1>
          <p className="mt-2 text-stone-600">
            Upload original scanned copies or clear photos of the following documents.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <DocumentCard
            actionLabel="View verified copy"
            body="Land title already uploaded and accepted."
            status="Verified"
            subtitle="Primary ownership record"
            title="Land Title"
          />
          <DocumentCard
            actionLabel="Upload ID proof"
            body="Upload Aadhaar card or alternate ID for farmer verification."
            status="Pending"
            subtitle="Identity verification"
            title="Aadhaar / ID Proof"
          />
        </div>

        <div className="mt-4 terra-card p-5">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-field">Tax Receipts</h3>
              <p className="text-sm text-stone-600">Recent land revenue or tax documentation</p>
            </div>
            <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
              Action Required
            </span>
          </div>
          <div className="mt-5 grid gap-4 lg:grid-cols-2">
            <div className="rounded-xl border border-outline-variant bg-surface-low p-6 text-center">
              <UploadCloud className="mx-auto text-outline" size={22} />
              <p className="mt-3 text-sm text-stone-700">Upload a high-resolution tax receipt image or PDF.</p>
            </div>
            <div className="rounded-xl border border-red-200 bg-red-50 p-6">
              <div className="flex items-center gap-2 text-red-700">
                <AlertCircle size={18} />
                <p className="font-semibold">Issue detected</p>
              </div>
              <p className="mt-3 text-sm leading-6 text-red-700">
                The 2023 document is blurry and the survey number is not legible. Please upload a sharper image.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-between rounded-xl border border-outline-variant bg-white px-6 py-5">
          <div>
            <p className="text-lg font-semibold text-field">Need help with verification?</p>
            <p className="text-sm text-stone-600">Our support team can guide you through accepted document formats.</p>
          </div>
          <button className="btn-primary" type="button">
            <CheckCircle2 size={18} />
            Contact support
          </button>
        </div>
      </div>
    </section>
  );
}
