import { DisputeState, NegotiationRoundInput, NegotiationRoundResult, DigitalConsentRecord } from './types';
import { defaultODRPolicy, ODRPolicyConfig } from '../config/odr-policy';

/**
 * Calculates the percentage gap between Landlord and Tenant counteroffers.
 * 
 * Formula:
 * gapPercentage = abs(landlordAmount - tenantAmount) / max(landlordAmount, tenantAmount) * 100
 */
export function calculateGapPercentage(landlordAmount: number, tenantAmount: number): number {
  const maxOffer = Math.max(landlordAmount, tenantAmount);
  if (maxOffer === 0) return 0;
  const difference = Math.abs(landlordAmount - tenantAmount);
  const gap = (difference / maxOffer) * 100;
  return Number(gap.toFixed(2));
}

/**
 * Evaluates a negotiation counteroffer round, enforcing:
 * 1. Maximum 3 rounds.
 * 2. Settlement threshold <= 5%.
 * 3. Automatic escalation to MEDIATOR_REVIEW if rounds exhausted without consensus.
 */
export function evaluateNegotiationRound(
  roundInput: NegotiationRoundInput,
  policy: ODRPolicyConfig = defaultODRPolicy
): NegotiationRoundResult {
  const { roundNumber, landlordOffer, tenantOffer } = roundInput;

  // Invariant Guard: Maximum 3 rounds
  if (roundNumber > policy.maxNegotiationRounds) {
    return {
      roundNumber,
      landlordOffer,
      tenantOffer,
      gapAmount: Math.abs(landlordOffer - tenantOffer),
      gapPercentage: calculateGapPercentage(landlordOffer, tenantOffer),
      isSettlementEligible: false,
      isMaxRoundsExhausted: true,
      nextState: 'MEDIATOR_REVIEW',
      systemMessage: `Maximum negotiation rounds (${policy.maxNegotiationRounds}) exceeded. Counteroffer round ${roundNumber} rejected. Dispute escalated to Mediator Review.`
    };
  }

  const gapAmount = Math.abs(landlordOffer - tenantOffer);
  const gapPercentage = calculateGapPercentage(landlordOffer, tenantOffer);
  const isSettlementEligible = gapPercentage <= policy.settlementThresholdPercent;
  const isMaxRoundsExhausted = roundNumber === policy.maxNegotiationRounds && !isSettlementEligible;

  let nextState: DisputeState = 'NEGOTIATION';
  let systemMessage = '';

  if (isSettlementEligible) {
    nextState = 'SETTLEMENT_ELIGIBLE';
    systemMessage = `Settlement Eligible! The gap between Landlord (₹${landlordOffer.toLocaleString('en-IN')}) and Tenant (₹${tenantOffer.toLocaleString('en-IN')}) is ${gapPercentage}%, which is within the ${policy.settlementThresholdPercent}% threshold. Digital consent unlocked.`;
  } else if (isMaxRoundsExhausted) {
    nextState = 'MEDIATOR_REVIEW';
    systemMessage = `Maximum negotiation rounds (${policy.maxNegotiationRounds}) completed without reaching consensus. Current gap is ${gapPercentage}%. Matter escalated to Mediator Review.`;
  } else {
    nextState = 'NEGOTIATION';
    systemMessage = `Round ${roundNumber} recorded. Gap is ${gapPercentage}% (₹${gapAmount.toLocaleString('en-IN')}). Further negotiation required (Round ${roundNumber + 1} of ${policy.maxNegotiationRounds}).`;
  }

  return {
    roundNumber,
    landlordOffer,
    tenantOffer,
    gapAmount,
    gapPercentage,
    isSettlementEligible,
    isMaxRoundsExhausted,
    nextState,
    systemMessage
  };
}

/**
 * Validates legal transitions between dispute states according to the formal state diagram.
 */
const ALLOWED_TRANSITIONS: Record<DisputeState, DisputeState[]> = {
  DRAFT: ['SUBMITTED'],
  SUBMITTED: ['EVIDENCE_COLLECTION'],
  EVIDENCE_COLLECTION: ['EVALUATION'],
  EVALUATION: ['NEGOTIATION'],
  NEGOTIATION: ['NEGOTIATION', 'SETTLEMENT_ELIGIBLE', 'MEDIATOR_REVIEW'],
  SETTLEMENT_ELIGIBLE: ['SETTLED', 'NEGOTIATION'],
  SETTLED: ['CLOSED'],
  MEDIATOR_REVIEW: ['SETTLEMENT_ELIGIBLE', 'CLOSED'],
  CLOSED: []
};

export function canTransition(fromState: DisputeState, toState: DisputeState): boolean {
  const allowed = ALLOWED_TRANSITIONS[fromState];
  return allowed ? allowed.includes(toState) : false;
}

/**
 * Verifies that both parties have recorded digital consent before finalizing settlement.
 */
export function validateSettlementConsents(
  tenantConsent?: DigitalConsentRecord,
  landlordConsent?: DigitalConsentRecord
): { isValid: boolean; message: string } {
  if (!tenantConsent && !landlordConsent) {
    return { isValid: false, message: 'Digital consent required from both Tenant and Landlord.' };
  }
  if (!tenantConsent) {
    return { isValid: false, message: 'Awaiting Tenant digital consent.' };
  }
  if (!landlordConsent) {
    return { isValid: false, message: 'Awaiting Landlord digital consent.' };
  }
  return { isValid: true, message: 'Both parties have recorded valid digital consent. Settlement agreement finalized.' };
}
