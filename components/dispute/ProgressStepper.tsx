'use client';

import React from 'react';
import Link from 'next/link';
import { DisputeState } from '@/lib/state-machine/types';
import { Check, Circle } from 'lucide-react';

interface ProgressStepperProps {
  disputeId: string;
  currentState: DisputeState;
}

const STEPS = [
  { id: 'intake', label: '1. Intake', states: ['DRAFT', 'SUBMITTED'], href: (id: string) => `/dispute/${id}/tenant` },
  { id: 'evidence', label: '2. Evidence', states: ['EVIDENCE_COLLECTION'], href: (id: string) => `/dispute/${id}/evidence` },
  { id: 'evaluation', label: '3. Rule Engine', states: ['EVALUATION'], href: (id: string) => `/dispute/${id}/evaluation` },
  { id: 'negotiation', label: '4. Negotiation', states: ['NEGOTIATION', 'MEDIATOR_REVIEW'], href: (id: string) => `/dispute/${id}/negotiate` },
  { id: 'settlement', label: '5. Settle & Sign', states: ['SETTLEMENT_ELIGIBLE'], href: (id: string) => `/dispute/${id}/settle` },
  { id: 'agreement', label: '6. Settlement PDF', states: ['SETTLED', 'CLOSED'], href: (id: string) => `/dispute/${id}/settle/pdf` }
];

export default function ProgressStepper({ disputeId, currentState }: ProgressStepperProps) {
  const getStepIndex = (state: DisputeState) => {
    switch (state) {
      case 'DRAFT':
      case 'SUBMITTED':
        return 0;
      case 'EVIDENCE_COLLECTION':
        return 1;
      case 'EVALUATION':
        return 2;
      case 'NEGOTIATION':
      case 'MEDIATOR_REVIEW':
        return 3;
      case 'SETTLEMENT_ELIGIBLE':
        return 4;
      case 'SETTLED':
      case 'CLOSED':
        return 5;
      default:
        return 0;
    }
  };

  const activeIndex = getStepIndex(currentState);

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm mb-6 no-print">
      <div className="flex items-center justify-between overflow-x-auto pb-2 sm:pb-0 gap-2">
        {STEPS.map((step, index) => {
          const isCompleted = index < activeIndex || currentState === 'SETTLED' || currentState === 'CLOSED';
          const isCurrent = index === activeIndex;

          return (
            <Link
              key={step.id}
              href={step.href(disputeId)}
              className="flex items-center gap-2 group shrink-0"
            >
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition ${
                  isCompleted
                    ? 'bg-emerald-600 text-white'
                    : isCurrent
                    ? 'bg-blue-600 text-white ring-4 ring-blue-100'
                    : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                }`}
              >
                {isCompleted ? <Check className="w-4 h-4 stroke-[3]" /> : index + 1}
              </div>

              <div className="hidden sm:block text-left">
                <span
                  className={`text-xs block font-medium transition ${
                    isCurrent
                      ? 'text-blue-700 font-bold'
                      : isCompleted
                      ? 'text-slate-800'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`hidden md:block w-8 lg:w-12 h-0.5 ml-2 ${
                    index < activeIndex ? 'bg-emerald-500' : 'bg-slate-200'
                  }`}
                />
              )}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
