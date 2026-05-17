import { CheckCircle2, FileText, Info, Loader2, ShieldCheck, Upload, Play, Gavel } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

export function VerificationPage() {
  const [step, setStep] = useState(1);
  const [uploading, setUploading] = useState(false);

  function handleUpload() {
    setUploading(true);
    setTimeout(() => {
      setUploading(false);
      setStep(2);
    }, 1500);
  }

  return (
    <section className="mx-auto max-w-4xl px-5 py-12">
      <header className="mb-12 text-center">
        <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary"
        >
          <ShieldCheck size={32} />
        </motion.div>
        <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="font-headline-lg text-primary"
        >
            Institutional Verification
        </motion.h1>
        <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-4 font-body-md text-on-surface-variant"
        >
          To certify your land for carbon credits, we must establish legal ownership and location accuracy.
        </motion.p>
      </header>

      {/* Demo Guide */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-10 rounded-2xl bg-primary-container p-6 text-on-primary-container shadow-lg"
      >
        <h2 className="flex items-center gap-2 text-xl font-bold mb-3">
            <Play size={20} />
            Auction Demo Walkthrough
        </h2>
        <div className="grid gap-4 md:grid-cols-3 text-sm font-medium">
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                <p className="opacity-70 uppercase text-[10px] mb-1">Step 1</p>
                <p>Register a farm and wait for 'Calculated' status.</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                <p className="opacity-70 uppercase text-[10px] mb-1">Step 2</p>
                <p>Click 'Mint NFT' on Farm Details to tokenize credits.</p>
            </div>
            <div className="bg-white/10 p-3 rounded-xl border border-white/20">
                <p className="opacity-70 uppercase text-[10px] mb-1">Step 3</p>
                <p>Click 'Start Auction' and switch to a Buyer account to bid.</p>
            </div>
        </div>
      </motion.div>

      <div className="relative">
        <div className="absolute left-8 top-0 h-full w-0.5 bg-surface-container-highest" />

        <div className="space-y-12">
          <VerificationStep
            active={step === 1}
            done={step > 1}
            icon={<FileText size={20} />}
            title="Land Ownership Documents"
            description="Upload official land titles or registry documents for verification."
          >
            <div className="mt-6 flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-outline-variant bg-surface-container-low p-10 transition-colors hover:border-primary">
              <Upload className="mb-4 text-outline" size={32} />
              <p className="text-sm font-bold text-primary">Drop files here or click to browse</p>
              <p className="mt-1 text-xs text-outline">PDF, JPG, PNG up to 10MB</p>
              <button
                disabled={uploading}
                onClick={handleUpload}
                className="btn-primary mt-6 h-12 px-8 rounded-xl shadow-lg"
              >
                {uploading ? <Loader2 className="animate-spin" size={18} /> : "Upload Documents"}
              </button>
            </div>
          </VerificationStep>

          <VerificationStep
            active={step === 2}
            done={step > 2}
            icon={<CheckCircle2 size={20} />}
            title="Digital Land Survey"
            description="Our GIS experts are cross-referencing your drawn boundary with satellite records."
          >
             <div className="mt-6 p-4 rounded-xl bg-surface-container border border-outline-variant">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full border-4 border-primary border-t-transparent animate-spin" />
                    <div>
                        <p className="font-bold text-primary">Surveying in progress...</p>
                        <p className="text-xs text-outline font-medium">Checking Sentinel-2 overlap for Warangal district.</p>
                    </div>
                </div>
             </div>
             <button onClick={() => setStep(3)} className="btn-secondary mt-4 h-10 px-4 text-xs font-bold uppercase tracking-widest">
                Simulate Approval
             </button>
          </VerificationStep>

          <VerificationStep
            active={step === 3}
            done={step > 3}
            icon={<Info size={20} />}
            title="Carbon Credit Certification"
            description="Finalizing the sequestration certificate for global market listing."
          >
            <div className="mt-6 rounded-2xl bg-secondary-container/20 p-6 border border-secondary-container">
                <h3 className="font-bold text-secondary flex items-center gap-2 mb-2">
                    <ShieldCheck size={18} />
                    Ready for Tokenization
                </h3>
                <p className="text-sm text-on-secondary-container font-medium leading-relaxed">
                    Once certification is complete, go to your <strong>Dashboard</strong>, select your farm, and click <strong>'Mint NFT'</strong> to enable the auction system.
                </p>
                <Link to="/" className="btn-primary mt-4 h-12 px-6 rounded-xl inline-flex">
                    Back to Dashboard
                </Link>
            </div>
          </VerificationStep>
        </div>
      </div>
    </section>
  );
}

function VerificationStep({ active, done, icon, title, description, children }) {
  return (
    <motion.div
        initial={{ x: -20, opacity: 0 }}
        whileInView={{ x: 0, opacity: 1 }}
        viewport={{ once: true }}
        className={`relative pl-16 ${active ? "opacity-100" : "opacity-60"}`}
    >
      <div
        className={`absolute left-5 top-0 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border-2 transition-colors ${
          done ? "border-primary bg-primary text-white" : active ? "border-primary bg-white text-primary" : "border-outline-variant bg-white text-outline"
        }`}
      >
        {done ? <CheckCircle2 size={16} /> : icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-primary">{title}</h3>
        <p className="text-sm font-medium text-on-surface-variant">{description}</p>
        {active && children}
      </div>
    </motion.div>
  );
}
