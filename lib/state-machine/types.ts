export type DisputeState = 
  | 'DRAFT'
  | 'SUBMITTED'
  | 'EVIDENCE_COLLECTION'
  | 'EVALUATION'
  | 'NEGOTIATION'
  | 'SETTLEMENT_ELIGIBLE'
  | 'SETTLED'
  | 'MEDIATOR_REVIEW'
  | 'CLOSED';

export interface NegotiationRoundInput {
  roundNumber: number;
  landlordOffer: number;
  tenantOffer: number;
  landlordMessage?: string;
  tenantMessage?: string;
}

export interface NegotiationRoundResult {
  roundNumber: number;
  landlordOffer: number;
  tenantOffer: number;
  gapAmount: number;
  gapPercentage: number;
  isSettlementEligible: boolean;
  isMaxRoundsExhausted: boolean;
  nextState: DisputeState;
  systemMessage: string;
}

export interface DigitalConsentRecord {
  disputeId: string;
  partyRole: 'TENANT' | 'LANDLORD';
  partyName: string;
  agreedAmount: number;
  consentedAt: string; // ISO string or IST formatted string
}
