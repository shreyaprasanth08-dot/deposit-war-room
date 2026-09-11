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
  TrendingDown, 
  Send, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  ArrowRight, 
  History, 
  User, 
  ShieldCheck, 
  Clock,
  Sparkles,
  Lock
} from 'lucide-react';

export default function NegotiationRoomPage() {
  const params = useParams();
  const router = useRouter();
  const disputeId = (params?.id as string) || 'DISP-2026-BLR-001';

  const [dispute, setDispute] = useState<DisputeScenario | null>(null);
  const [activeRole, setActiveRole] = useState<UserRole>('TENANT');

  // Counteroffer form state
  const [offerAmount, setOfferAmount] = useState<number>(24000);
  const [offerMessage, setOfferMessage] = useState<string>('');
  const [statusNotification, setStatusNotification] = useState<string | null>(null);

  useEffect(() => {
    const loaded = DisputeStore.getById(disputeId) || DisputeStore.resetScenario('scenario-1');
    setDispute(loaded);
    setActiveRole(DisputeStore.getActiveRole());
  }, [disputeId]);

  if (!dispute) return null;

  const totalEval = calculateTotalDeduction(dispute.claims);
  const systemRecommendedDeduction = totalEval.totalAllowed;

  // Active round metrics
  const latestRound = dispute.negotiationHistory[dispute.negotiationHistory.length - 1];
  const landlordPosition = latestRound ? latestRound.landlordOffer : dispute.withheldAmount;
  const tenantPosition = latestRound ? latestRound.tenantOffer : 15000;
  const roundCount = dispute.negotiationHistory.length;

  const isMaxRoundsReached = roundCount >= 3;
  const isSettlementEligible = dispute.status === 'SETTLEMENT_ELIGIBLE' || (latestRound && latestRound.gapPercentage <= 5.0);
  const isMediatorReview = dispute.status === 'MEDIATOR_REVIEW' || (isMaxRoundsReached && !isSettlementEligible);

  const handleSubmitCounteroffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dispute || isMaxRoundsReached || isSettlementEligible) return;

    try {
      const result = DisputeStore.submitCounteroffer(
        dispute.id,
        activeRole === 'LANDLORD' ? 'LANDLORD' : 'TENANT',
        Number(offerAmount),
        offerMessage || undefined
      );

      setDispute({ ...result.dispute });
      setStatusNotification(result.message);
      setOfferMessage('');

      if (result.dispute.status === 'SETTLEMENT_ELIGIBLE') {
        setTimeout(() => {
          router.push(`/dispute/${dispute.id}/settle`);
        }, 1500);
      }
    } catch (err: any) {
      alert(err.message || 'Counteroffer error');
    }
  };

  const handleRoleToggle = (newRole: UserRole) => {
    setActiveRole(newRole);
    DisputeStore.setActiveRole(newRole);
    // Suggest contextual next offer based on role
    if (newRole === 'LANDLORD') {
      setOfferAmount(Math.max(systemRecommendedDeduction, landlordPosition - 5000));
    } else {
      setOfferAmount(Math.min(systemRecommendedDeduction, tenantPosition + 5000));
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      
      <ProgressStepper disputeId={dispute.id} currentState={dispute.status} />

      {/* Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-purple-600 bg-purple-50 border border-purple-200 px-2.5 py-0.5 rounded-full">
              Negotiation Room • 3 Rounds Strict Ceiling
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">
              Active Round: {Math.min(3, roundCount)} of 3
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 tracking-tight">
            Structured Dispute Negotiation
          </h1>
          <p className="text-xs text-slate-500">
            Make counteroffers toward the legal recommendation. If gap falls within 5%, settlement triggers automatically.
          </p>
        </div>

        {/* Dual-Party Role Toggle Pill */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => handleRoleToggle('TENANT')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeRole === 'TENANT'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <User className="w-3.5 h-3.5" /> Offering as Tenant
          </button>
          <button
            type="button"
            onClick={() => handleRoleToggle('LANDLORD')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 transition ${
              activeRole === 'LANDLORD'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" /> Offering as Landlord
          </button>
        </div>
      </div>

      {/* Gap Visualizer */}
      <GapVisualizer
        landlordAmount={landlordPosition}
        tenantAmount={tenantPosition}
        systemAmount={systemRecommendedDeduction}
        depositTotal={dispute.securityDeposit}
        settlementThreshold={5.0}
      />

      {/* State Callout: Eligible vs Deadlock */}
      {isSettlementEligible && (
        <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-6 mb-8 text-center shadow-md animate-fadeIn">
          <div className="w-12 h-12 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
            <CheckCircle2 className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-emerald-950 mb-1">
            Settlement Threshold Reached (Gap ≤ 5%)!
          </h3>
          <p className="text-xs text-emerald-800 max-w-lg mx-auto mb-4">
            The gap between offers is within 5%. No further counteroffers are required. Both parties may now proceed to digital consent and generate the Settlement Agreement PDF.
          </p>
          <Link
            href={`/dispute/${dispute.id}/settle`}
            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95"
          >
            Proceed to Digital Consent &amp; Settlement <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {isMediatorReview && !isSettlementEligible && (
        <div className="bg-red-50 border-2 border-red-500 rounded-2xl p-6 mb-8 text-center shadow-md animate-fadeIn">
          <div className="w-12 h-12 bg-red-500 text-white rounded-full flex items-center justify-center mx-auto mb-3 shadow">
            <AlertTriangle className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-black text-red-950 mb-1">
            Maximum 3 Rounds Reached — Escalate to Mediator
          </h3>
          <p className="text-xs text-red-800 max-w-lg mx-auto mb-4">
            Under ODR platform rules, a maximum of 3 negotiation rounds are permitted. Consensus could not be reached. The case is now locked and escalated to human mediator review.
          </p>
          <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-800 text-white font-bold rounded-xl text-xs">
            <Lock className="w-3.5 h-3.5" /> Case Locked: Assigned to Karnataka Mediation Centre
          </div>
        </div>
      )}

      {/* Main 2-Column: Left = Counteroffer Form, Right = Audit History */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left: Counteroffer Submission Form */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
            <Send className="w-4 h-4 text-emerald-600" /> Submit Round {Math.min(3, roundCount + 1)} Counteroffer
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Acting as: <strong className="text-slate-900">{activeRole}</strong>. Adjust your proposed deduction amount.
          </p>

          <form onSubmit={handleSubmitCounteroffer} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Proposed Total Deduction (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3.5 top-2.5 text-sm font-mono text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  value={offerAmount}
                  onChange={(e) => setOfferAmount(Number(e.target.value))}
                  disabled={isMaxRoundsReached || isSettlementEligible}
                  className="w-full pl-8 pr-4 py-2.5 border border-slate-300 rounded-xl font-mono text-base font-bold text-slate-900 outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
                  required
                />
              </div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Rule engine legal recommendation is ₹{systemRecommendedDeduction.toLocaleString('en-IN')}.
              </span>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Optional Message / Rationale
              </label>
              <textarea
                rows={3}
                value={offerMessage}
                onChange={(e) => setOfferMessage(e.target.value)}
                disabled={isMaxRoundsReached || isSettlementEligible}
                placeholder="E.g., I am willing to meet at ₹25,000 to resolve this amicably today..."
                className="w-full px-3 py-2 border border-slate-300 rounded-xl text-xs leading-relaxed outline-none focus:ring-2 focus:ring-emerald-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>

            <button
              type="submit"
              disabled={isMaxRoundsReached || isSettlementEligible}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm shadow-md transition active:scale-95 disabled:bg-slate-200 disabled:text-slate-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Counteroffer (Round {Math.min(3, roundCount + 1)}/3)
            </button>
          </form>

          {statusNotification && (
            <div className="mt-4 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 font-medium animate-fadeIn">
              {statusNotification}
            </div>
          )}
        </div>

        {/* Right: Negotiation Rounds Audit Log */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900 mb-2 flex items-center gap-2">
            <History className="w-4 h-4 text-purple-600" /> Negotiation History &amp; Audit Trail
          </h3>
          <p className="text-xs text-slate-500 mb-4">
            Immutable log of offers and convergence metrics across rounds.
          </p>

          <div className="space-y-4">
            {dispute.negotiationHistory.map((round) => (
              <div
                key={round.roundNumber}
                className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2 font-mono text-xs"
              >
                <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                  <span className="font-bold text-slate-900 font-sans">
                    Round {round.roundNumber}
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    round.gapPercentage <= 5.0
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    Gap: {round.gapPercentage}%
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div>
                    <span className="text-slate-400 block font-sans">Landlord Offer:</span>
                    <span className="font-bold text-indigo-700">₹{round.landlordOffer.toLocaleString('en-IN')}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-sans">Tenant Offer:</span>
                    <span className="font-bold text-teal-700">₹{round.tenantOffer.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {round.landlordMessage && (
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 font-sans">
                    <strong>Landlord note:</strong> &ldquo;{round.landlordMessage}&rdquo;
                  </div>
                )}
                {round.tenantMessage && (
                  <div className="text-[11px] text-slate-600 bg-white p-2 rounded border border-slate-200 font-sans">
                    <strong>Tenant note:</strong> &ldquo;{round.tenantMessage}&rdquo;
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
}
