'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DisputeStore, UserRole } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import { calculateTotalDeduction } from '@/lib/rules/total';
import ProgressStepper from '@/components/dispute/ProgressStepper';
import GapVisualizer from '@/components/dispute/GapVisualizer';
import { 
  Building2, 
  Calendar, 
  CheckCircle2, 
  AlertCircle, 
  Scale, 
  ArrowRight, 
  ShieldAlert, 
  FileText, 
  Coins, 
  Users, 
  TrendingDown, 
  Sparkles 
} from 'lucide-react';

export default function DisputeDashboardPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('TENANT');

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId);
    if (loaded) {
      setDispute(loaded);
    } else {
      const fallback = DisputeStore.resetScenario('scenario-1');
      setDispute(fallback);
    }
    setActiveRole(DisputeStore.getActiveRole());
  }, [disputeId]);

  if (!dispute) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-slate-500">
        Loading dispute record...
      </div>
    );
  }

  // Calculate rule engine recommendations
  const totalEval = calculateTotalDeduction(dispute.claims);
  const latestRound = dispute.negotiationHistory[dispute.negotiationHistory.length - 1];
  const landlordPosition = latestRound ? latestRound.landlordOffer : dispute.withheldAmount;
  const tenantPosition = latestRound ? latestRound.tenantOffer : 15000;
  const systemPosition = totalEval.totalAllowed;

  const refundAtSystemAmount = dispute.securityDeposit - systemPosition;

  // 2-Month Statutory Cap Comparison
  const statutoryDepositLimit = dispute.monthlyRent * 2;
  const isDepositExceedingCap = dispute.securityDeposit > statutoryDepositLimit;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      {/* Progress Stepper */}
      <ProgressStepper disputeId={dispute.id} currentState={dispute.status} />

      {/* Top Banner: Dispute Header & Status */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs font-bold text-slate-500 uppercase tracking-wider">
              Dispute Ref: {dispute.id}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {dispute.status.replace('_', ' ')}
            </span>
            <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200">
              Round {dispute.currentRound} of 3
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <Building2 className="w-6 h-6 text-emerald-600" />
            {dispute.propertyAddress}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Tenancy: {dispute.tenancyStartDate} to {dispute.tenancyEndDate}
            </span>
            <span className="flex items-center gap-1">
              <Users className="w-3.5 h-3.5" />
              Tenant: {dispute.tenant.name} | Landlord: {dispute.landlord.name}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={`/dispute/${dispute.id}/negotiate`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center gap-1.5 transition active:scale-95"
          >
            Enter Negotiation <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* 2-Month Statutory Deposit Cap Notice */}
      {isDepositExceedingCap && (
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 text-xs text-amber-900 flex items-start gap-3">
          <ShieldAlert className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold block text-sm mb-0.5">
              Karnataka Rent (Amendment) Act, 2025 Statutory Notice
            </span>
            <span>
              The held security deposit of ₹{dispute.securityDeposit.toLocaleString('en-IN')} ({(dispute.securityDeposit / dispute.monthlyRent).toFixed(1)} months&apos; rent) reflects Bengaluru&apos;s legacy market custom. Under the Karnataka Rent (Amendment) Act 2025 (effective Jan 8, 2026), residential deposits are capped at <strong>2 months&apos; rent (₹{statutoryDepositLimit.toLocaleString('en-IN')})</strong>. This dispute is governed by the actual deposit held under contract.
            </span>
          </div>
        </div>
      )}

      {/* Key Financial Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6 font-mono">
        
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-slate-500 uppercase tracking-wider block font-sans">
            Total Security Deposit
          </span>
          <span className="text-2xl font-black text-slate-900 block mt-1">
            ₹{dispute.securityDeposit.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 font-sans block mt-1">
            Monthly Rent: ₹{dispute.monthlyRent.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <span className="text-xs text-red-600 uppercase tracking-wider block font-sans font-semibold">
            Landlord Withheld Claim
          </span>
          <span className="text-2xl font-black text-red-600 block mt-1">
            ₹{dispute.withheldAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-slate-400 font-sans block mt-1">
            Across {dispute.claims.length} claimed categories
          </span>
        </div>

        <div className="bg-emerald-50/50 p-5 rounded-xl border border-emerald-200 shadow-sm">
          <span className="text-xs text-emerald-800 uppercase tracking-wider block font-sans font-bold flex items-center gap-1">
            <Scale className="w-3.5 h-3.5" /> Rule Engine Allowed
          </span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">
            ₹{totalEval.totalAllowed.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-emerald-700 font-sans block mt-1">
            Disallowed: ₹{totalEval.totalRejected.toLocaleString('en-IN')}
          </span>
        </div>

        <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-200 shadow-sm">
          <span className="text-xs text-blue-800 uppercase tracking-wider block font-sans font-bold">
            Lawful Tenant Refund
          </span>
          <span className="text-2xl font-black text-blue-700 block mt-1">
            ₹{refundAtSystemAmount.toLocaleString('en-IN')}
          </span>
          <span className="text-[11px] text-blue-700 font-sans block mt-1">
            Deposit − Lawful Deductions
          </span>
        </div>

      </div>

      {/* Gap Visualizer */}
      <GapVisualizer
        landlordAmount={landlordPosition}
        tenantAmount={tenantPosition}
        systemAmount={systemPosition}
        depositTotal={dispute.securityDeposit}
        settlementThreshold={5.0}
      />

      {/* Quick Access Tabs to Dispute Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Link
          href={`/dispute/${dispute.id}/evidence`}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Step 2</span>
            <FileText className="w-5 h-5 text-emerald-600 group-hover:scale-110 transition" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Evidence Evaluation
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Review move-out photos, Asian Paints quotation, geyser age receipts, and apply normal wear &amp; tear tags.
          </p>
        </Link>

        <Link
          href={`/dispute/${dispute.id}/evaluation`}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Step 3</span>
            <Scale className="w-5 h-5 text-blue-600 group-hover:scale-110 transition" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Deduction Calculations
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Click &ldquo;Why this amount?&rdquo; to inspect straight-line 10% depreciation and TPA Sec 108(m) exemptions.
          </p>
        </Link>

        <Link
          href={`/dispute/${dispute.id}/negotiate`}
          className="bg-white p-5 rounded-xl border border-slate-200 hover:border-emerald-500 hover:shadow-md transition group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase text-slate-400">Step 4</span>
            <TrendingDown className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition" />
          </div>
          <h4 className="text-base font-bold text-slate-900 mb-1">
            Negotiation Room (3 Rounds)
          </h4>
          <p className="text-xs text-slate-500 leading-relaxed">
            Submit counteroffers, converge the gap below 5%, or escalate to human mediation if rounds expire.
          </p>
        </Link>

      </div>

    </div>
  );
}
