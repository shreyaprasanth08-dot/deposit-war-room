'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DisputeStore } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import ProgressStepper from '@/components/dispute/ProgressStepper';
import { 
  User, 
  Building2, 
  Calendar, 
  FileText, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Plus 
} from 'lucide-react';

export default function TenantPortalPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Form State initialized from dispute
  const [tenantName, setTenantName] = useState('');
  const [tenantEmail, setTenantEmail] = useState('');
  const [tenantPhone, setTenantPhone] = useState('');
  const [propertyAddress, setPropertyAddress] = useState('');
  const [city, setCity] = useState('Bengaluru');
  const [monthlyRent, setMonthlyRent] = useState(30000);
  const [securityDeposit, setSecurityDeposit] = useState(200000);
  const [depositReturned, setDepositReturned] = useState(145000);
  const [withheldAmount, setWithheldAmount] = useState(55000);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [moveOutDate, setMoveOutDate] = useState('');
  const [disputeStatement, setDisputeStatement] = useState(
    'I accept the utility bill (₹7,000) but strongly disagree with the ₹18,000 painting deduction (normal wear & tear) and ₹25,000 geyser replacement (4-year-old appliance).'
  );

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
    setTenantName(loaded.tenant.name);
    setTenantEmail(loaded.tenant.email);
    setTenantPhone(loaded.tenant.phone);
    setPropertyAddress(loaded.propertyAddress);
    setCity(loaded.city);
    setMonthlyRent(loaded.monthlyRent);
    setSecurityDeposit(loaded.securityDeposit);
    setDepositReturned(loaded.depositReturned);
    setWithheldAmount(loaded.withheldAmount);
    setStartDate(loaded.tenancyStartDate);
    setEndDate(loaded.tenancyEndDate);
    setMoveOutDate(loaded.moveOutDate);
  }, [disputeId]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispute) return;

    dispute.tenant.name = tenantName;
    dispute.tenant.email = tenantEmail;
    dispute.tenant.phone = tenantPhone;
    dispute.depositReturned = Number(depositReturned);
    dispute.withheldAmount = Number(withheldAmount);

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
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Tenant Intake &amp; Rebuttal Portal
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Submit Tenancy &amp; Dispute Details
          </h1>
          <p className="text-xs text-slate-500">
            Provide tenancy facts, withholding amounts, and structured counter-arguments.
          </p>
        </div>

        <div className="text-right font-mono text-xs text-slate-400">
          Case: {dispute.id}
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        
        {/* Card 1: Personal & Tenancy Details */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <User className="w-4 h-4 text-emerald-600" /> 1. Tenant Information &amp; Property
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Tenant Full Name</label>
              <input
                type="text"
                value={tenantName}
                onChange={(e) => setTenantName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Email Address</label>
              <input
                type="email"
                value={tenantEmail}
                onChange={(e) => setTenantEmail(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Phone Number</label>
              <input
                type="tel"
                value={tenantPhone}
                onChange={(e) => setTenantPhone(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-slate-700 mb-1">Rented Property Address</label>
              <input
                type="text"
                value={propertyAddress}
                onChange={(e) => setPropertyAddress(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Lease Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Lease End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1">Actual Move-Out Date</label>
              <input
                type="date"
                value={moveOutDate}
                onChange={(e) => setMoveOutDate(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Financial Withholding Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-4 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" /> 2. Security Deposit Financials
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-4 font-mono">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">Monthly Rent (₹)</label>
              <input
                type="number"
                value={monthlyRent}
                onChange={(e) => setMonthlyRent(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">Total Deposit Paid (₹)</label>
              <input
                type="number"
                value={securityDeposit}
                onChange={(e) => setSecurityDeposit(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1 font-sans">Amount Returned (₹)</label>
              <input
                type="number"
                value={depositReturned}
                onChange={(e) => {
                  const ret = Number(e.target.value);
                  setDepositReturned(ret);
                  setWithheldAmount(Math.max(0, securityDeposit - ret));
                }}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-red-600 mb-1 font-sans font-bold">Amount Withheld (₹)</label>
              <input
                type="number"
                value={withheldAmount}
                onChange={(e) => setWithheldAmount(Number(e.target.value))}
                className="w-full px-3 py-2 border border-red-300 bg-red-50 text-red-700 font-bold rounded-lg text-sm outline-none"
                required
              />
            </div>
          </div>
        </div>

        {/* Card 3: Dispute Description & Statements */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-4 h-4 text-purple-600" /> 3. Dispute Statement &amp; Category Rebuttal
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Summarize which deductions you accept and which you dispute.
          </p>

          <textarea
            rows={3}
            value={disputeStatement}
            onChange={(e) => setDisputeStatement(e.target.value)}
            className="w-full px-3 py-2.5 border border-slate-300 rounded-lg text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none"
            placeholder="Describe your dispute here..."
            required
          />

          {/* Itemized Rebuttal Badges */}
          <div className="mt-4 border-t border-slate-100 pt-4">
            <h4 className="text-xs font-bold text-slate-700 mb-2">Category Rebuttal Status:</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold text-red-800 block">❌ Painting (₹18,000 claimed)</span>
                <span className="text-slate-600 text-[11px]">Tenant: Disputed as normal wear and tear under TPA Sec 108(m).</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold text-red-800 block">❌ Fixtures: Geyser (₹25,000 claimed)</span>
                <span className="text-slate-600 text-[11px]">Tenant: Disputed. 4-year-old geyser requires 40% depreciation.</span>
              </div>
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <span className="font-bold text-red-800 block">❌ Deep Cleaning (₹5,000 claimed)</span>
                <span className="text-slate-600 text-[11px]">Tenant: Disputed. Apartment was broom-cleaned at move-out.</span>
              </div>
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="font-bold text-emerald-800 block">✓ Utilities: BESCOM (₹7,000 claimed)</span>
                <span className="text-slate-600 text-[11px]">Tenant: Accepted. Verified meter bill for May 2026.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 4: Structured Evidence Submission */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
              <Upload className="w-4 h-4 text-emerald-600" /> 4. Structured Evidence Records
            </h3>
            <span className="text-[11px] text-slate-400">
              No complex OCR needed
            </span>
          </div>

          <div className="space-y-3">
            {dispute.evidence.map((item) => (
              <div
                key={item.id}
                className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between gap-3 text-xs"
              >
                <div>
                  <span className="font-bold text-slate-900 block">{item.title}</span>
                  <span className="text-slate-500 text-[11px]">{item.description}</span>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-200 text-slate-700">
                    {item.type}
                  </span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                    {item.conditionTag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Bar */}
        <div className="flex items-center justify-between pt-2">
          {savedSuccess && (
            <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4" /> Tenancy records saved successfully! Proceeding to evidence...
            </span>
          )}
          {!savedSuccess && <div />}

          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition active:scale-95 ml-auto"
          >
            Save &amp; Continue to Evidence <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </form>

    </div>
  );
}
