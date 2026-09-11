'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Scale, 
  ShieldCheck, 
  ArrowRight, 
  Sparkles, 
  FileCheck, 
  TrendingDown, 
  CheckCircle2, 
  Users, 
  Building2,
  FileText
} from 'lucide-react';
import { DisputeStore } from '@/lib/store/dispute-store';

export default function LandingPage() {
  const router = useRouter();

const handleStartAsTenant = () => {
  DisputeStore.setActiveRole('TENANT');
  router.push('/create-dispute');
};

const handleStartAsLandlord = () => {
  DisputeStore.setActiveRole('LANDLORD');
  router.push('/create-dispute');
};

  const handleRun5MinDemo = () => {
    DisputeStore.setActiveRole('TENANT');
    const dispute = DisputeStore.resetScenario('scenario-1');
    router.push(`/dispute/${dispute.id}`);
  };

  return (
    <div className="bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-white min-h-[calc(100vh-4rem)]">
      
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        
        {/* Compliance Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-6 animate-pulse">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          Built for residential tenancy deposit disputes in Karnataka
        </div>

        {/* Main Title & Subtitle */}
        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white max-w-4xl mx-auto leading-tight mb-6">
          THE DEPOSIT <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">WAR ROOM</span>
        </h1>

        <p className="text-lg sm:text-2xl font-light text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
          &ldquo;Resolve rental deposit disputes before they become court disputes.&rdquo;
        </p>

        {/* Hero CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16 max-w-md mx-auto">
          <button
            onClick={handleStartAsTenant}
            className="w-full sm:w-auto px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg hover:shadow-emerald-500/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Users className="w-4 h-4" /> START AS TENANT
          </button>

          <button
            onClick={handleStartAsLandlord}
            className="w-full sm:w-auto px-6 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl shadow-lg hover:shadow-indigo-500/20 flex items-center justify-center gap-2 transition active:scale-95"
          >
            <Building2 className="w-4 h-4" /> START AS LANDLORD
          </button>
        </div>

        {/* Highlight Banner: 5-Minute Hackathon Demo */}
        <div className="max-w-xl mx-auto bg-slate-800/80 border border-slate-700 rounded-2xl p-5 shadow-2xl backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <div className="text-left">
              <span className="text-amber-400 text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> For Hackathon Judges
              </span>
              <h4 className="text-base font-bold text-white mt-0.5">
                Experience Complete Dispute in &lt; 5 Minutes
              </h4>
              <p className="text-xs text-slate-400">
                Pre-loads Whitefield 2BHK case with painting, geyser depreciation & consensus.
              </p>
            </div>

            <button
              onClick={handleRun5MinDemo}
              className="px-4 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-extrabold rounded-xl text-xs sm:text-sm shrink-0 shadow-lg flex items-center gap-1.5 transition active:scale-95"
            >
              <span>🚀</span> LOAD DEMO
            </button>
          </div>
        </div>

      </div>

      {/* 5-Stage Lifecycle Visualizer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="text-center mb-12">
          <h2 className="text-xs uppercase tracking-widest font-bold text-emerald-400 mb-2">
            Structured ODR Lifecycle
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            How The Deposit War Room Resolves Conflicts
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
          
          <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl text-center">
            <div className="w-10 h-10 bg-blue-500/20 text-blue-400 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              1
            </div>
            <h4 className="text-sm font-bold text-white mb-1">INTAKE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Structured tenant & landlord intake without OCR complexity.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl text-center">
            <div className="w-10 h-10 bg-cyan-500/20 text-cyan-400 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              2
            </div>
            <h4 className="text-sm font-bold text-white mb-1">EVIDENCE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Photos, move-in checklists & invoices tagged with condition metadata.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl text-center">
            <div className="w-10 h-10 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              3
            </div>
            <h4 className="text-sm font-bold text-white mb-1">EVALUATE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Explainable Rule Engine enforces TPA Sec 108(m) wear & tear + depreciation.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl text-center">
            <div className="w-10 h-10 bg-amber-500/20 text-amber-400 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              4
            </div>
            <h4 className="text-sm font-bold text-white mb-1">NEGOTIATE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Visual Gap Tracker with hard 3-round ceiling & 5% settlement threshold.
            </p>
          </div>

          <div className="bg-slate-800/60 border border-slate-700 p-5 rounded-2xl text-center">
            <div className="w-10 h-10 bg-teal-500/20 text-teal-400 rounded-xl flex items-center justify-center mx-auto mb-3 font-bold text-sm">
              5
            </div>
            <h4 className="text-sm font-bold text-white mb-1">SETTLE</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dual digital consent locks terms into an official Settlement PDF Agreement.
            </p>
          </div>

        </div>
      </div>

      {/* Feature Pillars: Law vs Custom */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 border-t border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-xl w-fit mb-4">
              <Scale className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Statutory Wear & Tear Doctrine
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Transfer of Property Act Section 108(m) protects tenants from automatic one-month repainting deductions for normal weathering.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80">
            <div className="p-2.5 bg-blue-500/20 text-blue-400 rounded-xl w-fit mb-4">
              <TrendingDown className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Straight-Line Fixture Depreciation
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Applies 10% annual depreciation under non-betterment tort rules. Landlords cannot replace 4-year-old geysers with brand-new ones on tenant dime.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-700/80">
            <div className="p-2.5 bg-indigo-500/20 text-indigo-400 rounded-xl w-fit mb-4">
              <FileCheck className="w-5 h-5" />
            </div>
            <h4 className="text-base font-bold text-white mb-2">
              Instant Legal Settlement Agreement
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Generates an itemized, cryptographically-hashed legal settlement document with dual party digital consent in IST.
            </p>
          </div>

        </div>
      </div>

    </div>
  );
}
