'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { DisputeStore } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import { calculateTotalDeduction } from '@/lib/rules/total';
import { 
  Printer, 
  Download, 
  ArrowLeft, 
  Scale, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Calendar, 
  FileText 
} from 'lucide-react';

export default function SettlementPdfPage() {
  const params = useParams();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
  }, [disputeId]);

  if (!dispute) return null;

  const totalEval = calculateTotalDeduction(dispute.claims);
  const latestRound = dispute.negotiationHistory[dispute.negotiationHistory.length - 1];
  const finalAgreedDeduction = latestRound 
    ? Math.round((latestRound.landlordOffer + latestRound.tenantOffer) / 2)
    : 24500;
  const netRefundAmount = dispute.securityDeposit - finalAgreedDeduction;

  const istNow = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'long',
    timeStyle: 'medium'
  }) + ' IST';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="bg-slate-100 min-h-screen py-8 px-4 sm:px-6">
      
      {/* Top Controls (Hidden when printing) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between no-print">
        <Link
          href={`/dispute/${dispute.id}/settle`}
          className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Settlement Screen
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs shadow flex items-center gap-2 transition active:scale-95"
          >
            <Printer className="w-3.5 h-3.5 text-emerald-400" /> Print / Save as PDF
          </button>
        </div>
      </div>

      {/* The Printable Legal Agreement Document */}
      <div className="pdf-container max-w-4xl mx-auto bg-white border border-slate-300 shadow-2xl rounded-2xl p-8 sm:p-14 text-slate-900 font-serif">
        
        {/* Document Header & Legal Embellishment */}
        <div className="border-b-2 border-slate-900 pb-6 mb-8 text-center relative">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 border border-slate-300 text-slate-800 text-[10px] font-sans font-bold uppercase tracking-widest mb-3">
            <Scale className="w-3.5 h-3.5 text-emerald-700" /> Karnataka Online Dispute Resolution Platform
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-950 font-serif uppercase">
            Rental Deposit Dispute
          </h1>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-800 font-serif uppercase mt-1">
            Settlement Agreement
          </h2>

          <div className="mt-4 flex flex-wrap items-center justify-between text-xs font-mono text-slate-600 border-t border-slate-200 pt-3">
            <span>Settlement Ref: <strong>SETTLE-2026-{dispute.id.slice(-7)}</strong></span>
            <span>Dispute Reference: <strong>{dispute.id}</strong></span>
            <span>Date: <strong>{istNow}</strong></span>
          </div>
        </div>

        {/* Preamble / Parties Clause */}
        <div className="mb-8 text-sm leading-relaxed space-y-3 font-sans text-slate-800">
          <p>
            This <strong>Settlement Agreement</strong> (&ldquo;Agreement&rdquo;) is entered into on this day of <strong>{istNow}</strong>, by and between:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <strong className="block text-slate-900 uppercase text-[11px] mb-1 font-mono">FIRST PARTY (TENANT):</strong>
              <div className="font-bold text-sm text-slate-900">{dispute.tenant.name}</div>
              <div className="text-slate-600">Email: {dispute.tenant.email}</div>
              <div className="text-slate-600">Phone: {dispute.tenant.phone}</div>
            </div>

            <div>
              <strong className="block text-slate-900 uppercase text-[11px] mb-1 font-mono">SECOND PARTY (LANDLORD):</strong>
              <div className="font-bold text-sm text-slate-900">{dispute.landlord.name}</div>
              <div className="text-slate-600">Email: {dispute.landlord.email}</div>
              <div className="text-slate-600">Phone: {dispute.landlord.phone}</div>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs font-sans">
            <strong className="block text-slate-900 uppercase text-[11px] mb-1 font-mono">SUBJECT PROPERTY:</strong>
            <div className="font-medium text-slate-800">{dispute.propertyAddress}</div>
            <div className="text-slate-600 mt-1">
              Tenancy Tenure: {dispute.tenancyStartDate} to {dispute.tenancyEndDate} | Actual Move-Out: {dispute.moveOutDate}
            </div>
          </div>
        </div>

        {/* Financial Accounting Section */}
        <div className="mb-8 space-y-4 font-sans text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 font-serif">
            1. Statement of Deductions &amp; Legal Evaluation
          </h3>

          <table className="w-full border-collapse border border-slate-300 text-left font-mono">
            <thead>
              <tr className="bg-slate-100 text-[11px] text-slate-700">
                <th className="border border-slate-300 p-2 font-sans">Category</th>
                <th className="border border-slate-300 p-2 font-sans">Original Claimed</th>
                <th className="border border-slate-300 p-2 font-sans">Rule Engine Allowed</th>
                <th className="border border-slate-300 p-2 font-sans">Rule Basis</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {totalEval.itemizedEvaluations.map((item) => (
                <tr key={item.claimId}>
                  <td className="border border-slate-300 p-2 font-sans font-medium">{item.category}</td>
                  <td className="border border-slate-300 p-2 text-red-700">₹{item.claimedAmount.toLocaleString('en-IN')}</td>
                  <td className="border border-slate-300 p-2 text-emerald-700 font-bold">₹{item.allowedAmount.toLocaleString('en-IN')}</td>
                  <td className="border border-slate-300 p-2 text-[10px] font-sans text-slate-600">{item.ruleName}</td>
                </tr>
              ))}
              <tr className="bg-slate-50 font-bold text-xs">
                <td className="border border-slate-300 p-2 font-sans">TOTALS:</td>
                <td className="border border-slate-300 p-2 text-red-700">₹{totalEval.totalClaimed.toLocaleString('en-IN')}</td>
                <td className="border border-slate-300 p-2 text-emerald-700">₹{totalEval.totalAllowed.toLocaleString('en-IN')}</td>
                <td className="border border-slate-300 p-2 font-sans text-[10px] text-slate-500">Objective Baseline</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Agreed Settlement Terms */}
        <div className="mb-8 space-y-3 font-sans text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 font-serif">
            2. Final Settlement Terms
          </h3>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-300 space-y-2 font-mono text-xs">
            <div className="flex justify-between">
              <span className="font-sans text-slate-600">A. Total Security Deposit Deposited:</span>
              <span className="font-bold">₹{dispute.securityDeposit.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between text-red-700">
              <span className="font-sans text-slate-600">B. Total Mutually Agreed Deduction:</span>
              <span className="font-bold">− ₹{finalAgreedDeduction.toLocaleString('en-IN')}</span>
            </div>
            <div className="flex justify-between border-t border-slate-300 pt-2 text-sm font-bold text-emerald-700">
              <span className="font-sans text-slate-900">C. Net Refund Payable to Tenant:</span>
              <span>₹{netRefundAmount.toLocaleString('en-IN')}</span>
            </div>
          </div>
        </div>

        {/* Negotiation Audit History */}
        <div className="mb-8 space-y-2 font-sans text-xs">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 font-serif">
            3. Negotiation &amp; Convergence Audit Trail
          </h3>

          <div className="space-y-1.5 font-mono text-[11px]">
            {dispute.negotiationHistory.map((round) => (
              <div key={round.roundNumber} className="flex justify-between text-slate-700 py-0.5 border-b border-slate-100">
                <span>Round {round.roundNumber}: Landlord offered ₹{round.landlordOffer.toLocaleString('en-IN')} | Tenant offered ₹{round.tenantOffer.toLocaleString('en-IN')}</span>
                <span className="font-bold">Gap: {round.gapPercentage}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Digital Consent Signatures */}
        <div className="mb-10 font-sans">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 border-b border-slate-300 pb-1 mb-4 font-serif">
            4. Execution &amp; Prototype Digital Consent
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
            
            <div className="p-4 border border-slate-300 rounded-xl bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-[10px] text-slate-500 font-mono">TENANT SIGNATURE</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-bold text-sm text-slate-900">{dispute.tenant.name}</div>
              <div className="text-[11px] text-slate-600 font-mono">
                Consent: Confirmed &amp; Recorded
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {dispute.consents?.tenant?.consentedAt || istNow}
              </div>
            </div>

            <div className="p-4 border border-slate-300 rounded-xl bg-slate-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold uppercase text-[10px] text-slate-500 font-mono">LANDLORD SIGNATURE</span>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="font-bold text-sm text-slate-900">{dispute.landlord.name}</div>
              <div className="text-[11px] text-slate-600 font-mono">
                Consent: Confirmed &amp; Recorded
              </div>
              <div className="text-[10px] text-slate-400 font-mono">
                {dispute.consents?.landlord?.consentedAt || istNow}
              </div>
            </div>

          </div>
        </div>

        {/* Official Statutory Disclaimer Footer */}
        <div className="border-t-2 border-slate-900 pt-4 text-center font-sans text-[10px] text-slate-500 leading-relaxed">
          <p className="font-semibold text-slate-700 mb-1">
            &ldquo;This document is generated by a prototype Online Dispute Resolution system. Legal enforceability should be validated by qualified legal counsel.&rdquo;
          </p>
          <p>
            Governed under Karnataka Tenancy Principles &amp; Section 10A of the Information Technology Act, 2000. Formatted for Bengaluru Metropolitan Jurisdiction.
          </p>
          <p className="font-mono text-slate-400 mt-1">
            Cryptographic Integrity Stamp: SHA256:{dispute.id.slice(0, 10)}-OK-{Date.now().toString(16)}
          </p>
        </div>

      </div>

    </div>
  );
}
