'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Scale, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Header() {
  const pathname = usePathname();

  // Extract dispute ID if present in URL
  const disputeMatch = pathname.match(/\/dispute\/([^/]+)/);
  const disputeId = disputeMatch ? disputeMatch[1] : 'DISP-2026-BLR-001';

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-40 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <div className="bg-emerald-600 text-white p-2 rounded-lg shadow-sm group-hover:bg-emerald-700 transition">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-slate-900 block leading-tight">
                  THE DEPOSIT WAR ROOM
                </span>
                <span className="text-[11px] font-medium text-emerald-700 block tracking-wide">
                  Karnataka Tenancy ODR Platform
                </span>
              </div>
            </Link>
          </div>

          {/* Navigation links if on a dispute page */}
          {pathname.startsWith('/dispute/') && (
            <nav className="hidden md:flex items-center space-x-1 text-sm font-medium">
              <Link
                href={`/dispute/${disputeId}`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname === `/dispute/${disputeId}`
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href={`/dispute/${disputeId}/tenant`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname.endsWith('/tenant')
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Tenant Portal
              </Link>
              <Link
                href={`/dispute/${disputeId}/landlord`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname.endsWith('/landlord')
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Landlord Portal
              </Link>
              <Link
                href={`/dispute/${disputeId}/evidence`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname.endsWith('/evidence')
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Evidence
              </Link>
              <Link
                href={`/dispute/${disputeId}/evaluation`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname.endsWith('/evaluation')
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Rule Engine
              </Link>
              <Link
                href={`/dispute/${disputeId}/negotiate`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname.endsWith('/negotiate')
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Negotiation
              </Link>
              <Link
                href={`/dispute/${disputeId}/settle`}
                className={`px-3 py-1.5 rounded-md transition ${
                  pathname.endsWith('/settle')
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                Settlement
              </Link>
            </nav>
          )}

          {/* Karnataka Compliance Pill */}
          <div className="hidden sm:flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              Karnataka Rent Act & TPA Compliant
            </span>
          </div>

        </div>
      </div>
    </header>
  );
}
