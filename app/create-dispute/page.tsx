'use client';

import React, { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  CheckCircle2,
  Home,
  IndianRupee,
  User,
  Users,
} from 'lucide-react';

import { DisputeStore } from '@/lib/store/dispute-store';

export default function CreateDisputePage() {
  const router = useRouter();

  const [role, setRole] = useState<'TENANT' | 'LANDLORD'>('TENANT');

  const [form, setForm] = useState({
    myName: '',
    myEmail: '',
    myPhone: '',

    otherName: '',
    otherEmail: '',
    otherPhone: '',

    propertyAddress: '',
    city: '',

    monthlyRent: '',
    securityDeposit: '',
    withheldAmount: '',

    tenancyStartDate: '',
    tenancyEndDate: '',
    moveOutDate: '',

    disputeDescription: '',
    claimedAmount: '',
  });

  const [error, setError] = useState('');

  const updateField = (
    field: keyof typeof form,
    value: string
  ) => {
    setForm((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (
      !form.myName ||
      !form.otherName ||
      !form.propertyAddress ||
      !form.city ||
      !form.securityDeposit ||
      !form.withheldAmount ||
      !form.tenancyStartDate ||
      !form.moveOutDate ||
      !form.disputeDescription
    ) {
      setError('Please fill in all required fields.');
      return;
    }

    const dispute = DisputeStore.createDispute({
      role,

      myName: form.myName,
      myEmail: form.myEmail,
      myPhone: form.myPhone,

      otherName: form.otherName,
      otherEmail: form.otherEmail,
      otherPhone: form.otherPhone,

      propertyAddress: form.propertyAddress,
      city: form.city,

      monthlyRent: Number(form.monthlyRent) || 0,
      securityDeposit: Number(form.securityDeposit),
      withheldAmount: Number(form.withheldAmount),

      tenancyStartDate: form.tenancyStartDate,
      tenancyEndDate:
        form.tenancyEndDate || form.moveOutDate,
      moveOutDate: form.moveOutDate,

      disputeDescription: form.disputeDescription,
      claimedAmount:
        Number(form.claimedAmount) ||
        Number(form.withheldAmount),
    });

    DisputeStore.setActiveRole(role);

    router.push(`/dispute/${dispute.id}/${role === 'TENANT' ? 'tenant' : 'landlord'}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="border-b border-slate-800 bg-slate-900/80">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          <div className="text-sm font-bold text-emerald-400">
            THE DEPOSIT WAR ROOM
          </div>
        </div>
      </div>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        {/* Heading */}
        <div className="mb-8">
          <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-widest mb-3">
            <Building2 className="w-4 h-4" />
            New Dispute
          </div>

          <h1 className="text-3xl sm:text-4xl font-black">
            Create your dispute
          </h1>

          <p className="text-slate-400 mt-2">
            Enter the actual tenancy details to start a new dispute.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Role */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-lg">I am the...</h2>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setRole('TENANT')}
                className={`p-4 rounded-xl border text-left transition ${
                  role === 'TENANT'
                    ? 'border-emerald-500 bg-emerald-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <User className="w-5 h-5 mb-2 text-emerald-400" />
                <div className="font-bold">Tenant</div>
                <div className="text-xs text-slate-400 mt-1">
                  I rented the property
                </div>
              </button>

              <button
                type="button"
                onClick={() => setRole('LANDLORD')}
                className={`p-4 rounded-xl border text-left transition ${
                  role === 'LANDLORD'
                    ? 'border-indigo-500 bg-indigo-500/10'
                    : 'border-slate-700 bg-slate-800 hover:border-slate-600'
                }`}
              >
                <Building2 className="w-5 h-5 mb-2 text-indigo-400" />
                <div className="font-bold">Landlord</div>
                <div className="text-xs text-slate-400 mt-1">
                  I own/lease the property
                </div>
              </button>
            </div>
          </section>

          {/* Your details */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <User className="w-5 h-5 text-emerald-400" />
              <h2 className="font-bold text-lg">Your details</h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Your name"
                required
                value={form.myName}
                onChange={(v) => updateField('myName', v)}
                placeholder="Enter your full name"
              />

              <Input
                label="Email"
                type="email"
                value={form.myEmail}
                onChange={(v) => updateField('myEmail', v)}
                placeholder="you@example.com"
              />

              <Input
                label="Phone"
                value={form.myPhone}
                onChange={(v) => updateField('myPhone', v)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </section>

          {/* Other party */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Users className="w-5 h-5 text-indigo-400" />
              <h2 className="font-bold text-lg">
                {role === 'TENANT'
                  ? "Landlord's details"
                  : "Tenant's details"}
              </h2>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                label="Name"
                required
                value={form.otherName}
                onChange={(v) => updateField('otherName', v)}
                placeholder="Enter their full name"
              />

              <Input
                label="Email"
                type="email"
                value={form.otherEmail}
                onChange={(v) => updateField('otherEmail', v)}
                placeholder="other@example.com"
              />

              <Input
                label="Phone"
                value={form.otherPhone}
                onChange={(v) => updateField('otherPhone', v)}
                placeholder="+91 XXXXX XXXXX"
              />
            </div>
          </section>

          {/* Property */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Home className="w-5 h-5 text-cyan-400" />
              <h2 className="font-bold text-lg">Property details</h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Property address"
                required
                value={form.propertyAddress}
                onChange={(v) =>
                  updateField('propertyAddress', v)
                }
                placeholder="Flat / House number, street, locality"
              />

              <Input
                label="City"
                required
                value={form.city}
                onChange={(v) => updateField('city', v)}
                placeholder="Bengaluru"
              />

              <div className="grid sm:grid-cols-3 gap-4">
                <Input
                  label="Monthly rent"
                  type="number"
                  value={form.monthlyRent}
                  onChange={(v) =>
                    updateField('monthlyRent', v)
                  }
                  placeholder="30000"
                />

                <Input
                  label="Security deposit"
                  required
                  type="number"
                  value={form.securityDeposit}
                  onChange={(v) =>
                    updateField('securityDeposit', v)
                  }
                  placeholder="100000"
                />

                <Input
                  label="Amount withheld"
                  required
                  type="number"
                  value={form.withheldAmount}
                  onChange={(v) =>
                    updateField('withheldAmount', v)
                  }
                  placeholder="25000"
                />
              </div>
            </div>
          </section>

          {/* Tenancy dates */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <Calendar className="w-5 h-5 text-amber-400" />
              <h2 className="font-bold text-lg">Tenancy period</h2>
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <Input
                label="Tenancy start"
                required
                type="date"
                value={form.tenancyStartDate}
                onChange={(v) =>
                  updateField('tenancyStartDate', v)
                }
              />

              <Input
                label="Tenancy end"
                type="date"
                value={form.tenancyEndDate}
                onChange={(v) =>
                  updateField('tenancyEndDate', v)
                }
              />

              <Input
                label="Move-out date"
                required
                type="date"
                value={form.moveOutDate}
                onChange={(v) =>
                  updateField('moveOutDate', v)
                }
              />
            </div>
          </section>

          {/* Dispute */}
          <section className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-5">
              <IndianRupee className="w-5 h-5 text-rose-400" />
              <h2 className="font-bold text-lg">Dispute details</h2>
            </div>

            <div className="space-y-4">
              <Input
                label="Amount being claimed"
                type="number"
                value={form.claimedAmount}
                onChange={(v) =>
                  updateField('claimedAmount', v)
                }
                placeholder="25000"
              />

              <div>
                <label className="block text-sm font-semibold text-slate-300 mb-2">
                  What is the dispute about? *
                </label>

                <textarea
                  required
                  value={form.disputeDescription}
                  onChange={(e) =>
                    updateField(
                      'disputeDescription',
                      e.target.value
                    )
                  }
                  rows={5}
                  placeholder="Example: Landlord withheld ₹25,000 for painting and geyser replacement. I believe these deductions are excessive..."
                  className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition resize-none"
                />
              </div>
            </div>
          </section>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-300 rounded-xl p-4 text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-4 rounded-xl flex items-center justify-center gap-2 transition shadow-lg shadow-emerald-900/20"
          >
            CREATE DISPUTE
            <ArrowRight className="w-5 h-5" />
          </button>

          <p className="text-center text-xs text-slate-500">
            Your dispute is stored locally in this browser for the demo.
          </p>
        </form>
      </main>
    </div>
  );
}

/* Reusable input component */

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-slate-300 mb-2">
        {label}
        {required && (
          <span className="text-emerald-400 ml-1">*</span>
        )}
      </label>

      <input
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-emerald-500 transition"
      />
    </div>
  );
}
