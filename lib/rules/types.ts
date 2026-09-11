import { ODRPolicyConfig } from '../config/odr-policy';

export type DeductionCategory = 
  | 'PAINTING' 
  | 'FIXTURES' 
  | 'UTILITIES' 
  | 'UNPAID_RENT' 
  | 'CLEANING' 
  | 'OTHER';

export type RuleClassification = 
  | 'STATUTORY_RULE'    // Category A: Karnataka Rent Act or TPA 1882
  | 'ODR_POLICY'         // Category B: Straight-line depreciation, non-betterment, cleaning standards
  | 'DEMO_ASSUMPTION';   // Category C: 5% threshold, 3 rounds limit

export type ConditionTag = 
  | 'GOOD' 
  | 'NORMAL_WEAR_AND_TEAR' 
  | 'EXCESSIVE_DAMAGE' 
  | 'UNSANITARY' 
  | 'DISPUTED';

export interface ClaimInput {
  id: string;
  category: DeductionCategory;
  description: string;
  claimedAmount: number;
  invoiceAmount?: number;
  itemAgeYears?: number;
  tenureYears?: number;
  conditionTag?: ConditionTag;
  hasOfficialInvoice?: boolean;
  tenantResponse?: string;
}

export interface EvaluationResult {
  claimId: string;
  category: DeductionCategory;
  claimedAmount: number;
  allowedAmount: number;
  rejectedAmount: number;
  ruleClassification: RuleClassification;
  statutoryCitation?: string;
  ruleName: string;
  explanation: string;
  formulaApplied?: string;
  evaluatorStatus: 'ACCEPTED' | 'PARTIALLY_ACCEPTED' | 'REJECTED';
}

export interface TotalEvaluationResult {
  totalClaimed: number;
  totalAllowed: number;
  totalRejected: number;
  itemizedEvaluations: EvaluationResult[];
  summaryNote: string;
}
