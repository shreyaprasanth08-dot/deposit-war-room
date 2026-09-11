import { ClaimInput, EvaluationResult } from '../rules/types';
import { calculateTotalDeduction } from '../rules/total';
import { DisputeState } from '../state-machine/types';

export interface DisputeScenario {
  id: string;
  scenarioName: string;
  scenarioDescription: string;
  badge: string;
  propertyAddress: string;
  city: string;
  monthlyRent: number;
  securityDeposit: number;
  depositReturned: number;
  withheldAmount: number;
  tenancyStartDate: string;
  tenancyEndDate: string;
  moveOutDate: string;
  status: DisputeState;
  currentRound: number;
  tenant: {
    name: string;
    email: string;
    phone: string;
  };
  landlord: {
    name: string;
    email: string;
    phone: string;
  };
  claims: ClaimInput[];
  evidence: {
    id: string;
    claimId?: string;
    title: string;
    type: string;
    conditionTag: string;
    submittedBy: 'TENANT' | 'LANDLORD';
    description: string;
  }[];
  negotiationHistory: {
    roundNumber: number;
    landlordOffer: number;
    tenantOffer: number;
    gapAmount: number;
    gapPercentage: number;
    landlordMessage?: string;
    tenantMessage?: string;
    status: 'COMPLETED' | 'PENDING';
  }[];
  consents?: {
    tenant?: { consented: boolean; consentedAt: string; name: string };
    landlord?: { consented: boolean; consentedAt: string; name: string };
  };
}

export const SCENARIOS: Record<string, DisputeScenario> = {
  'scenario-1': {
    id: 'DISP-2026-BLR-001',
    scenarioName: 'Scenario 1: Primary 5-Minute Pitch (Whitefield 2BHK)',
    scenarioDescription: 'Bangalore deposit dispute with painting wear-and-tear, 4-year-old geyser depreciation, and 3-round convergence.',
    badge: 'Recommended for Judges',
    propertyAddress: 'Flat 402, Tower B, Palm Meadows Greens, Whitefield, Bengaluru',
    city: 'Bengaluru',
    monthlyRent: 30000,
    securityDeposit: 200000,
    depositReturned: 145000,
    withheldAmount: 55000,
    tenancyStartDate: '2024-06-01',
    tenancyEndDate: '2026-05-31',
    moveOutDate: '2026-05-31',
    status: 'NEGOTIATION',
    currentRound: 1,
    tenant: {
      name: 'Prasanth Kumar',
      email: 'prasanth.k@example.com',
      phone: '+91 98450 12345'
    },
    landlord: {
      name: 'Rahul Chandrashekar',
      email: 'rahul.chandrashekar@example.com',
      phone: '+91 98860 67890'
    },
    claims: [
      {
        id: 'CLAIM-P1',
        category: 'PAINTING',
        description: 'Complete apartment repainting post-moveout',
        claimedAmount: 18000,
        invoiceAmount: 15000,
        tenureYears: 2.0,
        conditionTag: 'NORMAL_WEAR_AND_TEAR',
        hasOfficialInvoice: true,
        tenantResponse: 'Apartment was inhabited for 2 years with only normal wall fading and minor sofa rub marks. No illegal wall alterations.'
      },
      {
        id: 'CLAIM-F1',
        category: 'FIXTURES',
        description: 'Master bedroom 25L water geyser replacement',
        claimedAmount: 25000,
        invoiceAmount: 25000,
        itemAgeYears: 4.0,
        conditionTag: 'EXCESSIVE_DAMAGE',
        hasOfficialInvoice: true,
        tenantResponse: 'Geyser was already 4 years old and failing due to hard water scaling. Disagree with paying for a brand-new model without depreciation.'
      },
      {
        id: 'CLAIM-C1',
        category: 'CLEANING',
        description: 'Deep kitchen & balcony sanitization charge',
        claimedAmount: 5000,
        invoiceAmount: 3500,
        conditionTag: 'GOOD',
        hasOfficialInvoice: true,
        tenantResponse: 'Flat was handed over thoroughly broomed and mopped. Deep cleaning is standard landlord turnaround between tenants.'
      },
      {
        id: 'CLAIM-U1',
        category: 'UTILITIES',
        description: 'Final unpaid BESCOM electricity bill for May 2026',
        claimedAmount: 7000,
        invoiceAmount: 7000,
        conditionTag: 'GOOD',
        hasOfficialInvoice: true,
        tenantResponse: 'Accepted. I agree this electricity bill is my lawful responsibility.'
      },
      {
        id: 'CLAIM-R1',
        category: 'UNPAID_RENT',
        description: 'Rent arrears',
        claimedAmount: 0,
        invoiceAmount: 0,
        conditionTag: 'GOOD',
        hasOfficialInvoice: false,
        tenantResponse: 'All monthly rents transferred via NEFT on the 1st of every month.'
      }
    ],
    evidence: [
      {
        id: 'EVID-P1',
        claimId: 'CLAIM-P1',
        title: 'Move-out Living Room Wall Photos',
        type: 'MOVE_OUT_PHOTO',
        conditionTag: 'NORMAL_WEAR_AND_TEAR',
        submittedBy: 'TENANT',
        description: 'Shows light fading where wall frames hung; no gouges or crayon marks.'
      },
      {
        id: 'EVID-P2',
        claimId: 'CLAIM-P1',
        title: 'Painting Contractor Quotation',
        type: 'INVOICE',
        conditionTag: 'NORMAL_WEAR_AND_TEAR',
        submittedBy: 'LANDLORD',
        description: 'Quotation of ₹15,000 from Asian Paints authorized contractor.'
      },
      {
        id: 'EVID-F1',
        claimId: 'CLAIM-F1',
        title: 'Original Geyser Purchase Warranty Card (2022)',
        type: 'OTHER',
        conditionTag: 'EXCESSIVE_DAMAGE',
        submittedBy: 'LANDLORD',
        description: 'Shows geyser was purchased in June 2022 (4 years old).'
      },
      {
        id: 'EVID-U1',
        claimId: 'CLAIM-U1',
        title: 'BESCOM Official Statement May 2026',
        type: 'UTILITY_BILL',
        conditionTag: 'GOOD',
        submittedBy: 'LANDLORD',
        description: 'Electricity consumption bill for billing cycle May 1 to May 31, 2026.'
      }
    ],
    negotiationHistory: [
      {
        roundNumber: 1,
        landlordOffer: 48000,
        tenantOffer: 15000,
        gapAmount: 33000,
        gapPercentage: 68.75,
        landlordMessage: 'I am willing to reduce painting to ₹15,000 and geyser to ₹22,000.',
        tenantMessage: 'I accept utilities (₹7,000) and can pay ₹8,000 for geyser repair. Total ₹15,000.',
        status: 'COMPLETED'
      }
    ]
  },

  'scenario-2': {
    id: 'DISP-2026-BLR-002',
    scenarioName: 'Scenario 2: Quick Consensus (Indiranagar 1BHK)',
    scenarioDescription: 'Minor dispute settled amicably in Round 1 within 5% settlement threshold.',
    badge: 'Round 1 Settlement',
    propertyAddress: '45, 12th Main, HAL 2nd Stage, Indiranagar, Bengaluru',
    city: 'Bengaluru',
    monthlyRent: 25000,
    securityDeposit: 120000,
    depositReturned: 98000,
    withheldAmount: 22000,
    tenancyStartDate: '2025-01-01',
    tenancyEndDate: '2025-12-31',
    moveOutDate: '2025-12-31',
    status: 'SETTLEMENT_ELIGIBLE',
    currentRound: 1,
    tenant: {
      name: 'Sneha Rao',
      email: 'sneha.rao@example.com',
      phone: '+91 97410 54321'
    },
    landlord: {
      name: 'Venkatesh Prasad',
      email: 'v.prasad@example.com',
      phone: '+91 98440 98765'
    },
    claims: [
      {
        id: 'CLAIM-S2-U',
        category: 'UTILITIES',
        description: 'Unpaid BWSSB water charges',
        claimedAmount: 6000,
        invoiceAmount: 6000,
        hasOfficialInvoice: true,
        tenantResponse: 'Agreed. This matches our metered consumption.'
      },
      {
        id: 'CLAIM-S2-F',
        category: 'FIXTURES',
        description: 'Bathroom mixer tap leakage replacement',
        claimedAmount: 4000,
        invoiceAmount: 4000,
        itemAgeYears: 1.0,
        hasOfficialInvoice: true,
        tenantResponse: 'Agreed. Tap handle was cracked during tenure.'
      },
      {
        id: 'CLAIM-S2-C',
        category: 'CLEANING',
        description: 'Window glass deep cleaning',
        claimedAmount: 12000,
        invoiceAmount: 4000,
        conditionTag: 'NORMAL_WEAR_AND_TEAR',
        hasOfficialInvoice: false,
        tenantResponse: '₹12,000 for 1BHK cleaning is exorbitant.'
      }
    ],
    evidence: [
      {
        id: 'EVID-S2-1',
        title: 'BWSSB Bill December 2025',
        type: 'UTILITY_BILL',
        conditionTag: 'GOOD',
        submittedBy: 'LANDLORD',
        description: 'Official water supply bill for ₹6,000.'
      }
    ],
    negotiationHistory: [
      {
        roundNumber: 1,
        landlordOffer: 10500,
        tenantOffer: 10000,
        gapAmount: 500,
        gapPercentage: 4.76,
        landlordMessage: 'I will absorb the extra cleaning and agree to ₹10,500 total deduction.',
        tenantMessage: 'I accept ₹10,000 total deduction for utilities and plumbing tap.',
        status: 'COMPLETED'
      }
    ]
  },

  'scenario-3': {
    id: 'DISP-2026-BLR-003',
    scenarioName: 'Scenario 3: Deadlock & Mediator Escalation (Koramangala 3BHK)',
    scenarioDescription: 'Heavy landlord renovation demands reaching maximum 3 rounds without agreement -> Escalated to Mediator.',
    badge: 'Mediator Escalation',
    propertyAddress: 'Villa 12, 4th Block, Koramangala, Bengaluru',
    city: 'Bengaluru',
    monthlyRent: 60000,
    securityDeposit: 350000,
    depositReturned: 240000,
    withheldAmount: 110000,
    tenancyStartDate: '2023-01-01',
    tenancyEndDate: '2025-12-31',
    moveOutDate: '2025-12-31',
    status: 'MEDIATOR_REVIEW',
    currentRound: 3,
    tenant: {
      name: 'Vikram Malhotra',
      email: 'vikram.m@example.com',
      phone: '+91 99000 11223'
    },
    landlord: {
      name: 'Sunita Hegde',
      email: 'sunita.hegde@example.com',
      phone: '+91 98800 44556'
    },
    claims: [
      {
        id: 'CLAIM-S3-M',
        category: 'OTHER',
        description: 'Italian marble floor repolishing',
        claimedAmount: 50000,
        invoiceAmount: 45000,
        conditionTag: 'NORMAL_WEAR_AND_TEAR',
        tenantResponse: 'Marble floor dulling after 3 years of living is normal wear and tear.'
      },
      {
        id: 'CLAIM-S3-K',
        category: 'FIXTURES',
        description: 'Modular kitchen cabinet hinge and shutter overhaul',
        claimedAmount: 45000,
        invoiceAmount: 40000,
        itemAgeYears: 6.0,
        conditionTag: 'EXCESSIVE_DAMAGE',
        tenantResponse: 'Kitchen cabinets were already 6 years old when we moved in.'
      },
      {
        id: 'CLAIM-S3-C',
        category: 'CLEANING',
        description: 'Villa deep disinfection and terrace scrubbing',
        claimedAmount: 15000,
        invoiceAmount: 12000,
        conditionTag: 'UNSANITARY',
        tenantResponse: 'Villa was handed over clean; ₹15,000 is unreasonable.'
      }
    ],
    evidence: [
      {
        id: 'EVID-S3-1',
        title: 'Move-in Video Recording 2023',
        type: 'MOVE_IN_PHOTO',
        conditionTag: 'GOOD',
        submittedBy: 'TENANT',
        description: 'Proves modular kitchen already had prior hinge wear.'
      }
    ],
    negotiationHistory: [
      {
        roundNumber: 1,
        landlordOffer: 95000,
        tenantOffer: 25000,
        gapAmount: 70000,
        gapPercentage: 73.68,
        landlordMessage: 'Reduced marble polishing by ₹15,000.',
        tenantMessage: 'Willing to contribute ₹25,000 maximum for kitchen repairs.',
        status: 'COMPLETED'
      },
      {
        roundNumber: 2,
        landlordOffer: 85000,
        tenantOffer: 30000,
        gapAmount: 55000,
        gapPercentage: 64.71,
        landlordMessage: 'Lowest offer is ₹85,000.',
        tenantMessage: 'Will increase to ₹30,000 as final gesture.',
        status: 'COMPLETED'
      },
      {
        roundNumber: 3,
        landlordOffer: 80000,
        tenantOffer: 35000,
        gapAmount: 45000,
        gapPercentage: 56.25,
        landlordMessage: 'Cannot go below ₹80,000.',
        tenantMessage: 'Max limit is ₹35,000.',
        status: 'COMPLETED'
      }
    ]
  }
};
