'use client';

import React from 'react';
import { X, HelpCircle, ShieldCheck, Scale, Calculator, AlertTriangle, CheckCircle } from 'lucide-react';
import { EvaluationResult } from '@/lib/rules/types';

interface WhyThisDeductionModalProps {
  evaluation: EvaluationResult | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function WhyThisDeductionModal({
  evaluation,
  isOpen,
  onClose
}: WhyThisDeductionModalProps) {
  if (!isOpen || !evaluation) return null;

  const isStatutory = evaluation.ruleClassification === 'STATUTORY_RULE';
  const isPolicy = evaluation.ruleClassification === 'ODR_POLICY';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-200">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold tracking-tight text-white">
                Legal & Mathematical Explanation
              </h3>
              <p className="text-xs text-slate-400">
                {evaluation.category} Claim Analysis
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 text-sm">
          
          {/* Classification Badge */}
          <div className="flex items-center gap-2">
            {isStatutory && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                ✓ Statutory Rule (Directly Supported by Law)
              </span>
            )}
            {isPolicy && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-300">
                <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                ℹ️ ODR Policy Rule (Configurable Standard)
              </span>
            )}
            {!isStatutory && !isPolicy && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-300">
                ⚡ Demo Assumption
              </span>
            )}
          </div>

          {/* Amount Summary Cards */}
          <div className="grid grid-cols-3 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-200 text-center font-mono">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Claimed</span>
              <span className="text-sm font-bold text-slate-900">
                ₹{evaluation.claimedAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-emerald-700 uppercase block font-semibold">Allowed</span>
              <span className="text-sm font-bold text-emerald-600">
                ₹{evaluation.allowedAmount.toLocaleString('en-IN')}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-red-700 uppercase block font-semibold">Disallowed</span>
              <span className="text-sm font-bold text-red-600">
                ₹{evaluation.rejectedAmount.toLocaleString('en-IN')}
              </span>
            </div>
          </div>

          {/* Statutory / Policy Source */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1">
              <Scale className="w-3.5 h-3.5 text-slate-600" /> Applicable Rule & Legal Authority
            </h4>
            <div className="p-2.5 bg-slate-100 rounded-lg text-slate-800 font-medium text-xs border border-slate-200">
              {evaluation.ruleName}
              {evaluation.statutoryCitation && (
                <div className="text-[11px] text-slate-600 mt-0.5">
                  Authority: {evaluation.statutoryCitation}
                </div>
              )}
            </div>
          </div>

          {/* Calculation Formula */}
          {evaluation.formulaApplied && (
            <div>
              <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1">
                <Calculator className="w-3.5 h-3.5 text-slate-600" /> Calculation Formula
              </h4>
              <div className="p-2.5 bg-blue-50/60 rounded-lg text-blue-950 font-mono text-xs border border-blue-200">
                {evaluation.formulaApplied}
              </div>
            </div>
          )}

          {/* Plain English Explanation */}
          <div>
            <h4 className="text-xs font-bold uppercase text-slate-500 tracking-wider mb-1 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5 text-slate-600" /> Plain-English Legal Rationale
            </h4>
            <p className="text-xs leading-relaxed text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200">
              {evaluation.explanation}
            </p>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold transition"
          >
            Close Explanation
          </button>
        </div>

      </div>
    </div>
  );
}
