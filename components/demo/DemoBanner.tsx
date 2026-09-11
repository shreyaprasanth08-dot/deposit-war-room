'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { DisputeStore, UserRole } from '@/lib/store/dispute-store';
import { Sparkles, User, ShieldCheck, RefreshCw, Layers } from 'lucide-react';

export default function DemoBanner() {
  const router = useRouter();
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole>('TENANT');
  const [selectedScenario, setSelectedScenario] = useState<string>('scenario-1');

  useEffect(() => {
    setRole(DisputeStore.getActiveRole());
  }, [pathname]);

  const handleRoleChange = (newRole: UserRole) => {
    setRole(newRole);
    DisputeStore.setActiveRole(newRole);
  };

  const handleRun5MinDemo = () => {
    const dispute = DisputeStore.resetScenario('scenario-1');
    setSelectedScenario('scenario-1');
    handleRoleChange('TENANT');
    router.push(`/dispute/${dispute.id}`);
  };

  const handleScenarioChange = (scenarioKey: string) => {
    const dispute = DisputeStore.resetScenario(scenarioKey);
    setSelectedScenario(scenarioKey);
    router.push(`/dispute/${dispute.id}`);
  };

  return (
    <aside aria-label="Demo controls" className="bg-slate-900 border-b border-slate-800 text-white px-4 py-2.5 shadow-md no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs md:text-sm">
        
        {/* Left: Brand / Demo Flag */}
        <div className="flex items-center gap-2">
          <span className="bg-amber-500/20 text-amber-300 font-bold px-2 py-0.5 rounded text-[11px] uppercase tracking-wider border border-amber-500/30 flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-400" />
            DEMO MODE
          </span>
          <span className="hidden sm:inline text-slate-400 text-xs">
            Karnataka ODR Prototype
          </span>
        </div>

        {/* Center: Scenario Quick Switcher */}
        <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-lg border border-slate-700">
          <span className="text-slate-400 text-[11px] px-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3" /> Cases:
          </span>
          <button
            onClick={() => handleScenarioChange('scenario-1')}
            className={`px-2 py-1 rounded text-xs transition ${
              selectedScenario === 'scenario-1'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            1. Whitefield (5-Min Demo)
          </button>
          <button
            onClick={() => handleScenarioChange('scenario-2')}
            className={`px-2 py-1 rounded text-xs transition ${
              selectedScenario === 'scenario-2'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            2. Indiranagar (Quick Settle)
          </button>
          <button
            onClick={() => handleScenarioChange('scenario-3')}
            className={`px-2 py-1 rounded text-xs transition ${
              selectedScenario === 'scenario-3'
                ? 'bg-blue-600 text-white font-medium shadow-sm'
                : 'text-slate-300 hover:text-white hover:bg-slate-700'
            }`}
          >
            3. Koramangala (Mediator)
          </button>
        </div>

        {/* Right: Role Switcher & 5-Min Button */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 bg-slate-800 p-0.5 rounded border border-slate-700">
            <button
              onClick={() => handleRoleChange('TENANT')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                role === 'TENANT' 
                  ? 'bg-emerald-600 text-white font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <User className="w-3 h-3" /> Tenant
            </button>
            <button
              onClick={() => handleRoleChange('LANDLORD')}
              className={`px-2 py-1 rounded text-xs flex items-center gap-1 transition ${
                role === 'LANDLORD' 
                  ? 'bg-indigo-600 text-white font-semibold' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ShieldCheck className="w-3 h-3" /> Landlord
            </button>
          </div>

          <button
            onClick={handleRun5MinDemo}
            className="bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 text-white font-bold px-3 py-1.5 rounded text-xs shadow flex items-center gap-1.5 transition active:scale-95"
          >
            <span>🚀</span> RUN 5-MINUTE DEMO
          </button>
        </div>

      </div>
    </aside>
  );
}
