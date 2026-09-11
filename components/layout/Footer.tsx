import React from 'react';
import Link from 'next/link';
import { Scale, ExternalLink, ShieldCheck } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs py-8 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-6">
          
          <div>
            <div className="flex items-center gap-2 text-white font-bold text-sm mb-2">
              <Scale className="w-4 h-4 text-emerald-400" />
              THE DEPOSIT WAR ROOM
            </div>
            <p className="text-slate-400 leading-relaxed mb-3">
              An explainable Online Dispute Resolution (ODR) platform built specifically for residential tenancy deposit disputes in Bengaluru, Karnataka.
            </p>
            <div className="text-[11px] text-slate-500">
              Built for Hackathon Demo • 5-Minute Resolution Target
            </div>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">
              Statutory Foundations
            </h4>
            <ul className="space-y-1.5 text-[11px]">
              <li className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Transfer of Property Act, 1882 (Sec 108(m) Wear & Tear)
              </li>
              <li className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Karnataka Rent Act, 1999 (Sec 13 & Sec 27(2)(a))
              </li>
              <li className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Karnataka Rent (Amendment) Act, 2025 (2-Month Cap)
              </li>
              <li className="flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-500" />
                Information Technology Act, 2000 (Sec 10A Contracts)
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-xs uppercase tracking-wider mb-2">
              Authoritative Reference
            </h4>
            <p className="text-[11px] text-slate-400 mb-2">
              Statutory verification performed via the official India Code legislative repository.
            </p>
            <a
              href="https://www.indiacode.nic.in"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 text-xs font-medium"
            >
              India Code Repository <ExternalLink className="w-3 h-3" />
            </a>
          </div>

        </div>

        <div className="border-t border-slate-800 pt-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-slate-500">
          <div>
            Legal Disclaimer: This application is a hackathon prototype for alternative dispute resolution. Digital consent recorded herein is for demonstration and does not substitute certified legal counsel or Aadhaar e-Sign.
          </div>
          <div className="shrink-0 font-mono">
            Bengaluru, Karnataka • 2026
          </div>
        </div>
      </div>
    </footer>
  );
}
