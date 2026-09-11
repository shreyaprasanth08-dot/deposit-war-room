'use client';

import React from 'react';
import { ArrowRight, AlertCircle, CheckCircle2, TrendingDown } from 'lucide-react';

interface GapVisualizerProps {
  landlordAmount: number;
  tenantAmount: number;
  systemAmount: number;
  depositTotal: number;
  settlementThreshold?: number; // default 5%
}

export default function GapVisualizer({
  landlordAmount,
  tenantAmount,
  systemAmount,
  depositTotal,
  settlementThreshold = 5.0
}: GapVisualizerProps) {
  const maxDeduction = Math.max(landlordAmount, tenantAmount, systemAmount, 1000);
  const scale = (amount: number) => {
    return Math.max(5, Math.min(100, Math.round((amount / maxDeduction) * 100)));
  };

  const gapAmount = Math.abs(landlordAmount - tenantAmount);
  const gapPercentage = maxDeduction > 0 
    ? Number(((gapAmount / Math.max(landlordAmount, tenantAmount)) * 100).toFixed(2))
    : 0;

  const isEligible = gapPercentage <= settlementThreshold;

  return (
    <div className="bg-slate-900 text-white rounded-2xl p-6 border border-slate-800 shadow-xl mb-6">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-emerald-400 block mb-1">
            Visual Consensus Engine
          </span>
          <h3 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            Settlement Gap Visualizer
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 text-right">
            <span className="text-[10px] text-slate-400 block uppercase">Settlement Threshold</span>
            <span className="text-xs font-mono font-bold text-amber-400">
              Gap ≤ {settlementThreshold}%
            </span>
          </div>

          <div className={`px-3 py-1.5 rounded-lg border flex items-center gap-1.5 font-mono text-sm font-bold ${
            isEligible
              ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300'
              : 'bg-amber-950/80 border-amber-500 text-amber-300'
          }`}>
            {isEligible ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Gap: {gapPercentage}% (Eligible)</span>
              </>
            ) : (
              <>
                <AlertCircle className="w-4 h-4 text-amber-400" />
                <span>Gap: {gapPercentage}% (₹{gapAmount.toLocaleString('en-IN')})</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Visual Bars Comparison */}
      <div className="space-y-4 mb-6">
        
        {/* Landlord Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-indigo-300 flex items-center gap-1">
              LANDLORD COUNTEROFFER
            </span>
            <span className="font-mono text-indigo-200 text-sm">
              ₹{landlordAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-5 p-0.5 border border-slate-700 overflow-hidden">
            <div
              className="bg-gradient-to-r from-indigo-500 to-indigo-600 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${scale(landlordAmount)}%` }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow">
                {scale(landlordAmount)}%
              </span>
            </div>
          </div>
        </div>

        {/* System Recommended Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-emerald-400 flex items-center gap-1">
              ⚖️ SYSTEM STATUTORY / ODR RECOMMENDATION
            </span>
            <span className="font-mono text-emerald-300 text-sm font-bold">
              ₹{systemAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-5 p-0.5 border border-emerald-500/30 overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${scale(systemAmount)}%` }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow">
                {scale(systemAmount)}%
              </span>
            </div>
          </div>
        </div>

        {/* Tenant Bar */}
        <div>
          <div className="flex justify-between text-xs font-semibold mb-1">
            <span className="text-emerald-300 flex items-center gap-1">
              TENANT CONCESSION OFFER
            </span>
            <span className="font-mono text-emerald-200 text-sm">
              ₹{tenantAmount.toLocaleString('en-IN')}
            </span>
          </div>
          <div className="w-full bg-slate-800 rounded-full h-5 p-0.5 border border-slate-700 overflow-hidden">
            <div
              className="bg-gradient-to-r from-teal-500 to-cyan-500 h-full rounded-full transition-all duration-700 flex items-center justify-end pr-2"
              style={{ width: `${scale(tenantAmount)}%` }}
            >
              <span className="text-[10px] font-bold text-white drop-shadow">
                {scale(tenantAmount)}%
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Convergence Metric Footnote */}
      <div className="bg-slate-800/60 rounded-xl p-3 border border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
        <div className="text-slate-300 flex items-center gap-2">
          <TrendingDown className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            {isEligible 
              ? 'Consensus reached within the 5% legal threshold! Both parties may now execute digital consent.' 
              : `Positions are ₹${gapAmount.toLocaleString('en-IN')} apart (${gapPercentage}%). System recommendation provides the legal midpoint.`
            }
          </span>
        </div>

        <div className="text-slate-400 font-mono text-[11px] shrink-0">
          Total Deposit: ₹{depositTotal.toLocaleString('en-IN')}
        </div>
      </div>

    </div>
  );
}
