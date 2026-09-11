'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { DisputeStore } from '@/lib/store/dispute-store';
import { DisputeScenario } from '@/lib/mock-data/scenarios';
import { calculateTotalDeduction } from '@/lib/rules/total';
import { EvaluationResult, ConditionTag } from '@/lib/rules/types';
import ProgressStepper from '@/components/dispute/ProgressStepper';
import WhyThisDeductionModal from '@/components/dispute/WhyThisDeductionModal';
import { 
  FileText, 
  Scale, 
  ShieldCheck, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  ArrowRight, 
  Info,
  Edit3
} from 'lucide-react';

export default function EvidenceEvaluationPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [activeModalEval, setActiveModalEval] = useState<EvaluationResult | null>(null);
  const [selectedOverrides, setSelectedOverrides] = useState<Record<string, string>>({});

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
  }, [disputeId]);

  if (!dispute) return null;

  // Run Rule Engine
  const totalEval = calculateTotalDeduction(dispute.claims);

  const handleConditionToggle = (claimId: string, newCondition: ConditionTag) => {
    const updatedClaims = dispute.claims.map((c) => {
      if (c.id === claimId) {
        return { ...c, conditionTag: newCondition };
      }
      return c;
    });

    const updatedDispute = { ...dispute, claims: updatedClaims };
    setDispute(updatedDispute);
  };

  const handleOverrideStatus = (claimId: string, status: 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED') => {
    setSelectedOverrides(prev => ({
      ...prev,
      [claimId]: status
    }));
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <ProgressStepper disputeId={dispute.id} currentState={dispute.status} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 border border-blue-200 px-2.5 py-0.5 rounded-full">
            Evidence Evaluation Matrix
          </span>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight mt-1">
            Structured Evidence &amp; Rule Assessment
          </h1>
          <p className="text-xs text-slate-500">
            Compare Landlord claim against Tenant rebuttal, submitted proof, and statutory Karnataka rules.
          </p>
        </div>

        <Link
          href={`/dispute/${dispute.id}/evaluation`}
          className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-sm shadow-sm flex items-center gap-1.5 transition active:scale-95 shrink-0 self-start sm:self-auto"
        >
          View Deduction Math <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Itemized Evidence Cards */}
      <div className="space-y-6">
        {totalEval.itemizedEvaluations.map((evaluation) => {
          const claim = dispute.claims.find((c) => c.id === evaluation.claimId);
          if (!claim) return null;

          const currentOverride = selectedOverrides[claim.id] || evaluation.evaluatorStatus;
          const isWearAndTear = claim.conditionTag === 'NORMAL_WEAR_AND_TEAR';

          return (
            <div
              key={claim.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden hover:border-slate-300 transition"
            >
              
              {/* Category Card Header */}
              <div className="bg-slate-900 text-white px-6 py-4 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="px-3 py-1 rounded-md text-xs font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    {claim.category}
                  </span>
                  <span className="text-base font-bold text-white">
                    {claim.description}
                  </span>
                </div>

                <div className="font-mono text-sm">
                  <span className="text-slate-400 text-xs mr-2 font-sans">Claimed Amount:</span>
                  <span className="font-bold text-red-400">
                    ₹{claim.claimedAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Side-by-Side Content Matrix */}
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                
                {/* Left Column: Landlord Claim & Tenant Statement */}
                <div className="space-y-4">
                  <div className="bg-indigo-50/60 p-3.5 rounded-xl border border-indigo-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-700 block mb-1">
                      Landlord Submission
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {claim.description}
                    </p>
                    <div className="mt-2 text-[11px] text-slate-500 flex flex-wrap gap-3 font-mono">
                      <span>Invoice: {claim.invoiceAmount ? `₹${claim.invoiceAmount.toLocaleString('en-IN')}` : 'None'}</span>
                      {claim.itemAgeYears !== undefined && claim.itemAgeYears > 0 && (
                        <span>Age: {claim.itemAgeYears} years</span>
                      )}
                    </div>
                  </div>

                  <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 block mb-1">
                      Tenant Response
                    </span>
                    <p className="text-slate-800 leading-relaxed font-medium">
                      {claim.tenantResponse || 'No specific counter-argument provided.'}
                    </p>
                  </div>
                </div>

                {/* Right Column: Evidence & Rule Engine Assessment */}
                <div className="space-y-4">
                  
                  {/* Evidence Condition Toggle */}
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Evidence Classification
                      </span>
                      <span className="text-[11px] text-slate-400">
                        Evaluator Tag
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => handleConditionToggle(claim.id, 'NORMAL_WEAR_AND_TEAR')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1 ${
                          isWearAndTear
                            ? 'bg-amber-600 text-white shadow'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        NORMAL WEAR &amp; TEAR
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConditionToggle(claim.id, 'EXCESSIVE_DAMAGE')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          claim.conditionTag === 'EXCESSIVE_DAMAGE'
                            ? 'bg-red-600 text-white shadow'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        EXCESSIVE DAMAGE
                      </button>

                      <button
                        type="button"
                        onClick={() => handleConditionToggle(claim.id, 'GOOD')}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition ${
                          claim.conditionTag === 'GOOD'
                            ? 'bg-emerald-600 text-white shadow'
                            : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        BROOM-CLEAN / GOOD
                      </button>
                    </div>
                  </div>

                  {/* System Recommendation Box */}
                  <div className="bg-slate-900 text-white p-4 rounded-xl border border-slate-800">
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1">
                        <Scale className="w-3.5 h-3.5" /> System Legal Assessment
                      </span>
                      <button
                        type="button"
                        onClick={() => setActiveModalEval(evaluation)}
                        className="text-[11px] text-blue-300 hover:text-white underline font-mono flex items-center gap-1"
                      >
                        <Info className="w-3 h-3" /> Why this amount?
                      </button>
                    </div>

                    <p className="text-slate-300 text-xs leading-relaxed mb-3">
                      {evaluation.explanation}
                    </p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-800 font-mono text-xs">
                      <div>
                        <span className="text-slate-400 block text-[10px]">Statutory / Policy Rule:</span>
                        <span className="text-slate-200 font-semibold">{evaluation.ruleName}</span>
                      </div>
                      <div className="text-right">
                        <span className="text-slate-400 block text-[10px]">Recommended Deduction:</span>
                        <span className="text-sm font-bold text-emerald-400">
                          ₹{evaluation.allowedAmount.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Evaluator Status / Manual Override Bar */}
              <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-700 flex items-center gap-1">
                    <Edit3 className="w-3.5 h-3.5 text-slate-500" /> Evaluator Decision:
                  </span>
                  <span className="font-bold text-slate-900">
                    {currentOverride.replace('_', ' ')}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleOverrideStatus(claim.id, 'ACCEPTED')}
                    className={`px-3 py-1 rounded-md font-bold transition text-xs ${
                      currentOverride === 'ACCEPTED'
                        ? 'bg-emerald-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-emerald-50'
                    }`}
                  >
                    ACCEPT
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOverrideStatus(claim.id, 'PARTIALLY_ACCEPTED')}
                    className={`px-3 py-1 rounded-md font-bold transition text-xs ${
                      currentOverride === 'PARTIALLY_ACCEPTED'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-blue-50'
                    }`}
                  >
                    PARTIALLY ACCEPT
                  </button>

                  <button
                    type="button"
                    onClick={() => handleOverrideStatus(claim.id, 'REJECTED')}
                    className={`px-3 py-1 rounded-md font-bold transition text-xs ${
                      currentOverride === 'REJECTED'
                        ? 'bg-red-600 text-white'
                        : 'bg-white border border-slate-300 text-slate-600 hover:bg-red-50'
                    }`}
                  >
                    REJECT
                  </button>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Modal for "Why this amount?" */}
      <WhyThisDeductionModal
        evaluation={activeModalEval}
        isOpen={Boolean(activeModalEval)}
        onClose={() => setActiveModalEval(null)}
      />

    </div>
  );
}
