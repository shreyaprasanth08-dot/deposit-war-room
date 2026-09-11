'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DisputeStore } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import { calculateTotalDeduction } from '@/lib/rules/total';
import { EvaluationResult } from '@/lib/rules/types';
import ProgressStepper from '@/components/dispute/ProgressStepper';
import WhyThisDeductionModal from '@/components/dispute/WhyThisDeductionModal';
import { 
  Scale, 
  HelpCircle, 
  ShieldCheck, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ArrowRight, 
  Calculator, 
  FileSpreadsheet 
} from 'lucide-react';

export default function DeductionEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [activeModalEval, setActiveModalEval] = useState<EvaluationResult | null>(null);

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
  }, [disputeId]);

  if (!dispute) return null;

  const totalEval = calculateTotalDeduction(dispute.claims);
  const refundAmount = dispute.securityDeposit - totalEval.totalAllowed;

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <ProgressStepper disputeId={dispute.id} currentState={dispute.status} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
            Step 3: Explainable Rule Engine
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Lawful Deduction Calculations
          </h1>
          <p className="text-xs text-slate-500">
            Deterministic evaluation grounded in Karnataka Rent Act, Transfer of Property Act, and ODR depreciation standards.
          </p>
        </div>

        <Link
          href={`/dispute/${dispute.id}/negotiate`}
          className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center gap-1.5 transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          Proceed to Negotiation <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* High-Level Financial Ledger Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-lg border border-slate-800 mb-8 font-mono">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 text-center sm:text-left">
          
          <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-sans block">
              Held Security Deposit
            </span>
            <span className="text-2xl font-black text-white block mt-1">
              ₹{dispute.securityDeposit.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[11px] text-red-400 uppercase tracking-wider font-sans block">
              Landlord Total Claimed
            </span>
            <span className="text-2xl font-black text-red-400 block mt-1">
              ₹{totalEval.totalClaimed.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="border-b sm:border-b-0 sm:border-r border-slate-800 pb-3 sm:pb-0 sm:pr-4">
            <span className="text-[11px] text-emerald-400 uppercase tracking-wider font-sans block font-semibold">
              Rule Engine Allowed
            </span>
            <span className="text-2xl font-black text-emerald-400 block mt-1">
              ₹{totalEval.totalAllowed.toLocaleString('en-IN')}
            </span>
          </div>

          <div>
            <span className="text-[11px] text-cyan-400 uppercase tracking-wider font-sans block font-semibold">
              Net Tenant Refund
            </span>
            <span className="text-2xl font-black text-cyan-300 block mt-1">
              ₹{refundAmount.toLocaleString('en-IN')}
            </span>
          </div>

        </div>
      </div>

      {/* 5 Required Categories Grid */}
      <div className="space-y-4 mb-8">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 flex items-center gap-2">
          <FileSpreadsheet className="w-4 h-4 text-emerald-600" /> Five Required Deduction Categories Breakdown
        </h3>

        {totalEval.itemizedEvaluations.map((evaluation) => {
          const isStatutory = evaluation.ruleClassification === 'STATUTORY_RULE';
          const isPolicy = evaluation.ruleClassification === 'ODR_POLICY';

          return (
            <div
              key={evaluation.claimId}
              className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm hover:border-slate-300 transition"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2.5">
                  <span className="px-2.5 py-0.5 rounded text-xs font-black uppercase bg-slate-100 text-slate-800 font-mono">
                    {evaluation.category}
                  </span>

                  {/* Badge distinguishing statutory vs policy */}
                  {isStatutory && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      ✓ Statutory Rule
                    </span>
                  )}
                  {isPolicy && (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                      <ShieldCheck className="w-3 h-3 text-blue-600" />
                      ℹ️ ODR Policy Rule
                    </span>
                  )}

                  <span className="text-xs text-slate-400 font-mono">
                    {evaluation.ruleName}
                  </span>
                </div>

                <div className="flex items-center gap-4 font-mono text-sm">
                  <div>
                    <span className="text-[10px] text-slate-400 block font-sans">Claimed</span>
                    <span className="font-bold text-slate-800">
                      ₹{evaluation.claimedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-emerald-700 block font-sans font-semibold">Allowed</span>
                    <span className="font-bold text-emerald-600">
                      ₹{evaluation.allowedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-red-700 block font-sans font-semibold">Disallowed</span>
                    <span className="font-bold text-red-600">
                      ₹{evaluation.rejectedAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Rationale and Formula Snippet */}
              <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <p className="text-slate-600 leading-relaxed max-w-3xl">
                  {evaluation.explanation}
                </p>

                <button
                  type="button"
                  onClick={() => setActiveModalEval(evaluation)}
                  className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold rounded-lg text-xs flex items-center gap-1 transition shrink-0 self-start sm:self-auto"
                >
                  <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                  Why this amount?
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Navigation */}
      <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h4 className="text-sm font-bold text-slate-900">
            Rule Engine Evaluation Complete
          </h4>
          <p className="text-xs text-slate-500">
            The suggested legal deduction is ₹{totalEval.totalAllowed.toLocaleString('en-IN')}. Take this objective benchmark into the Negotiation Room.
          </p>
        </div>

        <Link
          href={`/dispute/${dispute.id}/negotiate`}
          className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md flex items-center gap-2 transition active:scale-95 shrink-0"
        >
          Open Negotiation Room <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Explainability Modal */}
      <WhyThisDeductionModal
        evaluation={activeModalEval}
        isOpen={Boolean(activeModalEval)}
        onClose={() => setActiveModalEval(null)}
      />

    </div>
  );
}
