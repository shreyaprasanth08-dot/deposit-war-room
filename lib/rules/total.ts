import { ClaimInput, EvaluationResult, TotalEvaluationResult } from './types';
import { calculatePaintingDeduction } from './painting';
import { calculateFixtureDeduction } from './fixtures';
import { calculateUtilityDeduction } from './utilities';
import { calculateUnpaidRentDeduction } from './unpaid-rent';
import { calculateCleaningDeduction } from './cleaning';
import { defaultODRPolicy, ODRPolicyConfig } from '../config/odr-policy';

/**
 * Orchestrates evaluation across all deduction claims and calculates totals.
 */
export function calculateTotalDeduction(
  claims: ClaimInput[],
  policy: ODRPolicyConfig = defaultODRPolicy
): TotalEvaluationResult {
  const evaluations: EvaluationResult[] = claims.map((claim) => {
    switch (claim.category) {
      case 'PAINTING':
        return calculatePaintingDeduction(claim, policy);
      case 'FIXTURES':
        return calculateFixtureDeduction(claim, policy);
      case 'UTILITIES':
        return calculateUtilityDeduction(claim);
      case 'UNPAID_RENT':
        return calculateUnpaidRentDeduction(claim);
      case 'CLEANING':
        return calculateCleaningDeduction(claim, policy);
      case 'OTHER':
      default: {
        const claimed = Math.max(0, claim.claimedAmount);
        const invoice = claim.invoiceAmount ?? 0;
        const allowed = Math.min(claimed, invoice);
        return {
          claimId: claim.id,
          category: claim.category,
          claimedAmount: claimed,
          allowedAmount: allowed,
          rejectedAmount: claimed - allowed,
          ruleClassification: 'ODR_POLICY',
          ruleName: 'General Substantiated Expense Rule',
          explanation: allowed > 0 
            ? `Allowed documented expense of ₹${allowed.toLocaleString('en-IN')}.`
            : `Unsubstantiated miscellaneous claim of ₹${claimed.toLocaleString('en-IN')} disallowed.`,
          formulaApplied: `Allowed = min(Claimed: ₹${claimed}, Invoice: ₹${invoice})`,
          evaluatorStatus: allowed === claimed ? 'ACCEPTED' : (allowed > 0 ? 'PARTIALLY_ACCEPTED' : 'REJECTED')
        };
      }
    }
  });

  const totalClaimed = evaluations.reduce((sum, e) => sum + e.claimedAmount, 0);
  const totalAllowed = evaluations.reduce((sum, e) => sum + e.allowedAmount, 0);
  const totalRejected = evaluations.reduce((sum, e) => sum + e.rejectedAmount, 0);

  const statutoryCount = evaluations.filter(e => e.ruleClassification === 'STATUTORY_RULE').length;
  const policyCount = evaluations.filter(e => e.ruleClassification === 'ODR_POLICY').length;

  return {
    totalClaimed,
    totalAllowed,
    totalRejected,
    itemizedEvaluations: evaluations,
    summaryNote: `Evaluated ${evaluations.length} claims: ${statutoryCount} statutory rules applied, ${policyCount} ODR policy rules applied. Claimed: ₹${totalClaimed.toLocaleString('en-IN')} | Allowed: ₹${totalAllowed.toLocaleString('en-IN')} | Disallowed: ₹${totalRejected.toLocaleString('en-IN')}.`
  };
}
