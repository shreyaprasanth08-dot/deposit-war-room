'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DisputeStore, UserRole } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import ProgressStepper from '@/components/dispute/ProgressStepper';
import { 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Calendar, 
  ArrowRight, 
  Clock, 
  User, 
  Lock,
  Building2,
  AlertCircle
} from 'lucide-react';

export default function SettlementConsentPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('TENANT');

  const [tenantAgreed, setTenantAgreed] = useState<boolean>(false);
  const [landlordAgreed, setLandlordAgreed] = useState<boolean>(false);
  const [tenantNameInput, setTenantNameInput] = useState<string>('');
  const [landlordNameInput, setLandlordNameInput] = useState<string>('');

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
    setActiveRole(DisputeStore.getActiveRole());
    setTenantNameInput(loaded.tenant.name);
    setLandlordNameInput(loaded.landlord.name);
    if (loaded.consents?.tenant?.consented) setTenantAgreed(true);
    if (loaded.consents?.landlord?.consented) setLandlordAgreed(true);
  }, [disputeId]);

  if (!dispute) return null;

  // Derive agreed settlement numbers
  const latestRound = dispute.negotiationHistory[dispute.negotiationHistory.length - 1];
  const finalAgreedDeduction = latestRound 
    ? Math.round((latestRound.landlordOffer + latestRound.tenantOffer) / 2)
    : 24500;
  const netRefundAmount = dispute.securityDeposit - finalAgreedDeduction;

  const handleRecordTenantConsent = () => {
    const res = DisputeStore.recordDigitalConsent(dispute.id, 'TENANT', tenantNameInput);
    setDispute({ ...res.dispute });
    setTenantAgreed(true);
  };

  const handleRecordLandlordConsent = () => {
    const res = DisputeStore.recordDigitalConsent(dispute.id, 'LANDLORD', landlordNameInput);
    setDispute({ ...res.dispute });
    setLandlordAgreed(true);
  };

  const bothConsented = (dispute.consents?.tenant?.consented && dispute.consents?.landlord?.consented) || (tenantAgreed && landlordAgreed);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <ProgressStepper disputeId={dispute.id} currentState={dispute.status} />

      {/* Header */}
      <div className="text-center mb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
          Step 5: Digital Settlement &amp; Mutual Consent
        </span>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mt-2">
          Formal Dispute Settlement Terms
        </h1>
        <p className="text-xs text-slate-500 max-w-lg mx-auto mt-1">
          Review the negotiated financial settlement and record prototype digital consent to execute the agreement.
        </p>
      </div>

      {/* Agreed Settlement Terms Card */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800 mb-8 font-mono">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-sans">
              Mutually Negotiated Agreement
            </span>
            <h3 className="text-lg font-bold text-white">
              Settlement Term Sheet
            </h3>
          </div>
          <div className="text-right text-xs text-slate-400">
            Case: {dispute.id}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <span className="text-[11px] text-slate-400 uppercase font-sans block">Total Deposit</span>
            <span className="text-xl font-black text-white block mt-1">
              ₹{dispute.securityDeposit.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700">
            <span className="text-[11px] text-amber-400 uppercase font-sans block font-semibold">Agreed Deduction</span>
            <span className="text-xl font-black text-amber-300 block mt-1">
              ₹{finalAgreedDeduction.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="bg-emerald-950/60 p-4 rounded-xl border border-emerald-600/40">
            <span className="text-[11px] text-emerald-400 uppercase font-sans block font-bold">Net Refund to Tenant</span>
            <span className="text-2xl font-black text-emerald-300 block mt-1">
              ₹{netRefundAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Dual Digital Consent Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        
        {/* Tenant Consent Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                <User className="w-3 h-3" /> Tenant Consent
              </span>
              {dispute.consents?.tenant?.consented ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Signed
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-600 font-mono">
                  Pending Signature
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Tenant: {tenantNameInput}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              I agree to the deduction of ₹{finalAgreedDeduction.toLocaleString('en-IN')} from my security deposit, with the remaining balance of ₹{netRefundAmount.toLocaleString('en-IN')} to be refunded to my account within 7 business days.
            </p>
          </div>

          <div>
            {dispute.consents?.tenant?.consented ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-mono">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Consent Recorded:
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  {dispute.consents.tenant.consentedAt}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRecordTenantConsent}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Record Tenant Digital Consent
              </button>
            )}
          </div>
        </div>

        {/* Landlord Consent Card */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-bold uppercase text-indigo-700 bg-indigo-50 px-2.5 py-0.5 rounded-full border border-indigo-200 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> Landlord Consent
              </span>
              {dispute.consents?.landlord?.consented ? (
                <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 font-mono">
                  <CheckCircle2 className="w-4 h-4" /> Signed
                </span>
              ) : (
                <span className="text-xs font-semibold text-amber-600 font-mono">
                  Pending Signature
                </span>
              )}
            </div>

            <h4 className="text-sm font-bold text-slate-900 mb-2">
              Landlord: {landlordNameInput}
            </h4>

            <p className="text-xs text-slate-600 leading-relaxed mb-4">
              I agree to accept ₹{finalAgreedDeduction.toLocaleString('en-IN')} as full and final settlement of all withholding claims and agree to transfer the refund of ₹{netRefundAmount.toLocaleString('en-IN')} to the tenant.
            </p>
          </div>

          <div>
            {dispute.consents?.landlord?.consented ? (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-mono">
                <div className="font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Consent Recorded:
                </div>
                <div className="text-[11px] text-emerald-700 mt-0.5">
                  {dispute.consents.landlord.consentedAt}
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleRecordLandlordConsent}
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-xs shadow-sm transition active:scale-95 flex items-center justify-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" /> Record Landlord Digital Consent
              </button>
            )}
          </div>
        </div>

      </div>

      {/* Statutory Disclaimer & Agreement Unlock Bar */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-center space-y-4">
        <p className="text-[11px] text-slate-500 max-w-xl mx-auto leading-relaxed">
          <strong>Notice:</strong> Prototype digital consent is recorded under Section 10A of the Information Technology Act, 2000 for demonstration purposes. It is not equivalent to a certified Aadhaar e-Sign or qualified digital signature token.
        </p>

        {bothConsented ? (
          <div className="animate-fadeIn">
            <div className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm mb-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              Both Parties Have Consented! Settlement Agreement is Ready.
            </div>
            <br />
            <Link
              href={`/dispute/${dispute.id}/settle/pdf`}
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-sm shadow-xl transition active:scale-95"
            >
              <FileText className="w-4 h-4 text-emerald-400" /> View &amp; Download Settlement Agreement PDF <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <div className="text-xs text-slate-400 font-mono">
            Click both consent buttons above to unlock the final Settlement Agreement PDF.
          </div>
        )}
      </div>

    </div>
  );
}
