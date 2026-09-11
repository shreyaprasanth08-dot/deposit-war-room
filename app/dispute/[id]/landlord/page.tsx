'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DisputeStore } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import ProgressStepper from '@/components/dispute/ProgressStepper';
import { 
  Building2, 
  User, 
  ShieldCheck, 
  Receipt, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle,
  Clock
} from 'lucide-react';

export default function LandlordPortalPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Landlord form fields
  const [landlordName, setLandlordName] = useState('');
  const [landlordEmail, setLandlordEmail] = useState('');
  const [landlordPhone, setLandlordPhone] = useState('');

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
    setLandlordName(loaded.landlord.name);
    setLandlordEmail(loaded.landlord.email);
    setLandlordPhone(loaded.landlord.phone);
  }, [disputeId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispute) return;

    dispute.landlord.name = landlordName;
    dispute.landlord.email = landlordEmail;
    dispute.landlord.phone = landlordPhone;

    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      router.push(`/dispute/${dispute.id}/evidence`);
    }, 1200);
  };

  if (!dispute) return null;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <ProgressStepper disputeId={dispute.id} currentState={dispute.status} />

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 border border-indigo-200 px-2.5 py-0.5 rounded-full">
            Landlord Withholding Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Itemized Deposit Deduction Claims
          </h1>
          <p className="text-xs text-slate-500">
            Submit your breakdown of withheld security deposit amounts with invoices and asset ages.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          Case: {dispute.id}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Landlord Contact Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" /> 1. Landlord Profile
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Landlord Full Name</label>
              <input
                type="text"
                value={landlordName}
                onChange={(e) => setLandlordName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={landlordEmail}
                onChange={(e) => setLandlordEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={landlordPhone}
                onChange={(e) => setLandlordPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Itemized Deduction Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Receipt className="w-4 h-4 text-indigo-600" /> 2. Itemized Deduction Claims (Total: ₹{dispute.withheldAmount.toLocaleString('en-IN')})
            </h3>
            <span className="text-xs text-slate-500 font-mono">
              Deposit: ₹{dispute.securityDeposit.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="space-y-4">
            {dispute.claims.map((claim) => (
              <div
                key={claim.id}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white transition space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                      {claim.category}
                    </span>
                    <span className="text-sm font-bold text-slate-900">
                      {claim.description}
                    </span>
                  </div>

                  <div className="font-mono text-sm font-black text-red-600">
                    Claimed: ₹{claim.claimedAmount.toLocaleString('en-IN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600 font-mono">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-sans">Invoice / Bill Amount</span>
                    <span className="font-bold text-slate-800">
                      {claim.invoiceAmount ? `₹${claim.invoiceAmount.toLocaleString('en-IN')}` : 'No invoice attached'}
                    </span>
                  </div>

                  {claim.itemAgeYears !== undefined && claim.itemAgeYears > 0 && (
                    <div>
                      <span className="text-[10px] text-slate-400 uppercase block font-sans">Item Age</span>
                      <span className="font-bold text-amber-700 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {claim.itemAgeYears} years old
                      </span>
                    </div>
                  )}

                  <div>
                    <span className="text-[10px] text-slate-400 uppercase block font-sans">Evidence Status</span>
                    <span className="font-bold text-emerald-700">
                      {claim.hasOfficialInvoice ? '✓ Official Receipt Provided' : 'Self-declared estimate'}
                    </span>
                  </div>
                </div>

                {claim.tenantResponse && (
                  <div className="bg-slate-100 p-2.5 rounded-lg text-xs text-slate-700 border border-slate-200">
                    <span className="font-semibold text-slate-900 block mb-0.5">Tenant Rebuttal:</span>
                    {claim.tenantResponse}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Submit Action */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Landlord claims updated! Proceeding to evidence evaluation...
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition active:scale-95 ml-auto"
          >
            Confirm Claims &amp; Evaluate Evidence <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
