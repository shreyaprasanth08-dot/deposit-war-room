'use client';

import { SCENARIOS, DisputeScenario } from '../mock-data/scenarios';
import { evaluateNegotiationRound, canTransition } from '../state-machine/transitions';
import { defaultODRPolicy } from '../config/odr-policy';
import { calculateTotalDeduction } from '../rules/total';

const STORAGE_KEY = 'deposit_war_room_active_disputes';
const ROLE_STORAGE_KEY = 'deposit_war_room_current_role';

export type UserRole = 'TENANT' | 'LANDLORD' | 'NEUTRAL_EVALUATOR';

/**
 * Initializes state from browser localStorage or loads default scenarios
 */
function getInitialDisputes(): Record<string, DisputeScenario> {
  if (typeof window === 'undefined') {
    return SCENARIOS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (e) {
    console.warn('Could not read localStorage, falling back to defaults:', e);
  }

  return SCENARIOS;
}

/**
 * Persists active dispute records to localStorage
 */
function persistDisputes(disputes: Record<string, DisputeScenario>) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(disputes));
  } catch (e) {
    console.warn('Failed to persist to localStorage:', e);
  }
}

export const DisputeStore = { 
  createDispute(data: {
    role: 'TENANT' | 'LANDLORD';

    myName: string;
    myEmail: string;
    myPhone: string;

    otherName: string;
    otherEmail: string;
    otherPhone: string;

    propertyAddress: string;
    city: string;

    monthlyRent: number;
    securityDeposit: number;
    withheldAmount: number;

    tenancyStartDate: string;
    tenancyEndDate: string;
    moveOutDate: string;

    disputeDescription: string;
    claimedAmount: number;
  }): DisputeScenario {
    const map = getInitialDisputes();

    const id = `DISP-${Date.now()}`;

    const tenant =
      data.role === 'TENANT'
        ? {
            name: data.myName,
            email: data.myEmail,
            phone: data.myPhone,
          }
        : {
            name: data.otherName,
            email: data.otherEmail,
            phone: data.otherPhone,
          };

    const landlord =
      data.role === 'LANDLORD'
        ? {
            name: data.myName,
            email: data.myEmail,
            phone: data.myPhone,
          }
        : {
            name: data.otherName,
            email: data.otherEmail,
            phone: data.otherPhone,
          };

    const claimId = `CLAIM-${Date.now()}`;

    const newDispute: DisputeScenario = {
      id,

      scenarioName: `User Dispute - ${data.city}`,

      scenarioDescription:
        data.disputeDescription,

      badge: 'User Created',

      propertyAddress:
        data.propertyAddress,

      city: data.city,

      monthlyRent:
        data.monthlyRent,

      securityDeposit:
        data.securityDeposit,

      depositReturned:
        Math.max(
          0,
          data.securityDeposit -
            data.withheldAmount
        ),

      withheldAmount:
        data.withheldAmount,

      tenancyStartDate:
        data.tenancyStartDate,

      tenancyEndDate:
        data.tenancyEndDate,

      moveOutDate:
        data.moveOutDate,

      status: 'NEGOTIATION',

      currentRound: 0,

      tenant,

      landlord,

      claims: [
        {
          id: claimId,
          category: 'OTHER',
          description:
            data.disputeDescription,
          claimedAmount:
            data.claimedAmount,
          invoiceAmount:
            data.claimedAmount,
          conditionTag:
            'GOOD',
          hasOfficialInvoice:
            false,
          tenantResponse:
            data.role === 'TENANT'
              ? data.disputeDescription
              : '',
        },
      ],

      evidence: [],

      negotiationHistory: [],

      consents: {},
    };

    map[id] = newDispute;

    persistDisputes(map);

    return newDispute;
  },

  getAll(): DisputeScenario[] {
    const map = getInitialDisputes();
    return Object.values(map);
  },

  getById(id: string): DisputeScenario | null {
    const map = getInitialDisputes();
    // Search by key or by id
    if (map[id]) return map[id];
    const found = Object.values(map).find(d => d.id === id);
    return found || null;
  },

  resetScenario(scenarioKey: string = 'scenario-1'): DisputeScenario {
    const map = getInitialDisputes();
    if (SCENARIOS[scenarioKey]) {
      // Deep clone from default
      map[scenarioKey] = JSON.parse(JSON.stringify(SCENARIOS[scenarioKey]));
      persistDisputes(map);
      return map[scenarioKey];
    }
    return SCENARIOS['scenario-1'];
  },

  resetAll(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SCENARIOS));
    } catch (e) {}
  },

  getActiveRole(): UserRole {
    if (typeof window === 'undefined') return 'TENANT';
    try {
      return (localStorage.getItem(ROLE_STORAGE_KEY) as UserRole) || 'TENANT';
    } catch {
      return 'TENANT';
    }
  },

  setActiveRole(role: UserRole): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ROLE_STORAGE_KEY, role);
    } catch {}
  },

  /**
   * Evaluates and updates a dispute with a new counteroffer round.
   * Enforces 3 rounds maximum and 5% settlement threshold.
   */
  submitCounteroffer(
    disputeId: string,
    role: 'TENANT' | 'LANDLORD',
    offerAmount: number,
    message?: string
  ): { success: boolean; message: string; dispute: DisputeScenario } {
    const map = getInitialDisputes();
    const dispute = Object.values(map).find(d => d.id === disputeId);

    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }

    const nextRoundNumber = dispute.negotiationHistory.length + 1;

    // Get previous counteroffer of other party or base estimate
    const latestRound = dispute.negotiationHistory[dispute.negotiationHistory.length - 1];
    let landlordOffer = role === 'LANDLORD' ? offerAmount : (latestRound ? latestRound.landlordOffer : dispute.withheldAmount);
    let tenantOffer = role === 'TENANT' ? offerAmount : (latestRound ? latestRound.tenantOffer : 10000);

    const roundEval = evaluateNegotiationRound({
      roundNumber: nextRoundNumber,
      landlordOffer,
      tenantOffer,
      landlordMessage: role === 'LANDLORD' ? message : latestRound?.landlordMessage,
      tenantMessage: role === 'TENANT' ? message : latestRound?.tenantMessage
    });

    // Record round in history
    dispute.negotiationHistory.push({
      roundNumber: nextRoundNumber,
      landlordOffer,
      tenantOffer,
      gapAmount: roundEval.gapAmount,
      gapPercentage: roundEval.gapPercentage,
      landlordMessage: role === 'LANDLORD' ? message : latestRound?.landlordMessage,
      tenantMessage: role === 'TENANT' ? message : latestRound?.tenantMessage,
      status: 'COMPLETED'
    });

    dispute.currentRound = nextRoundNumber;
    dispute.status = roundEval.nextState;

    persistDisputes(map);

    return {
      success: true,
      message: roundEval.systemMessage,
      dispute
    };
  },

  /**
   * Records digital consent from Tenant or Landlord
   */
  recordDigitalConsent(
    disputeId: string,
    role: 'TENANT' | 'LANDLORD',
    name: string
  ): { success: boolean; message: string; dispute: DisputeScenario } {
    const map = getInitialDisputes();
    const dispute = Object.values(map).find(d => d.id === disputeId);

    if (!dispute) {
      throw new Error(`Dispute ${disputeId} not found`);
    }

    if (!dispute.consents) {
      dispute.consents = {};
    }

    const istTime = new Date().toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    }) + ' IST';

    if (role === 'TENANT') {
      dispute.consents.tenant = {
        consented: true,
        consentedAt: istTime,
        name
      };
    } else {
      dispute.consents.landlord = {
        consented: true,
        consentedAt: istTime,
        name
      };
    }

    // Check if both have consented
    if (dispute.consents.tenant?.consented && dispute.consents.landlord?.consented) {
      dispute.status = 'SETTLED';
    }

    persistDisputes(map);

    return {
      success: true,
      message: `${role} consent recorded successfully.`,
      dispute
    };
  }
};
