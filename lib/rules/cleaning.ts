import { ClaimInput, EvaluationResult } from './types';
import { defaultODRPolicy, ODRPolicyConfig } from '../config/odr-policy';

/**
 * Calculates lawful deductions for move-out cleaning.
 * 
 * Legal Basis:
 * - Contractual handover covenants under Indian Contract Act, 1872.
 * - Standard ODR policy: Ordinary dust or broom-clean condition is landlord turnaround responsibility.
 * - Deep cleaning is only deductible if tenant left the premises in an abnormal unsanitary condition.
 */
export function calculateCleaningDeduction(
  claim: ClaimInput,
  policy: ODRPolicyConfig = defaultODRPolicy
): EvaluationResult {
  const claimed = Math.max(0, claim.claimedAmount);
  const condition = claim.conditionTag ?? 'GOOD';
  const invoice = claim.invoiceAmount ?? claimed;
  const hasInvoice = claim.hasOfficialInvoice ?? (claim.invoiceAmount !== undefined && claim.invoiceAmount > 0);

  // Case 1: Handed over broom clean or standard dust
  if (condition === 'GOOD' || condition === 'NORMAL_WEAR_AND_TEAR') {
    return {
      claimId: claim.id,
      category: 'CLEANING',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'ODR_POLICY',
      ruleName: 'Standard Broom-Clean Handover Rule',
      explanation: `Flat was handed over in ordinary swept/broom-clean condition. Routine inter-tenancy cleaning and dust removal is the landlord's operational turnaround cost. Arbitrary cleaning fees are disallowed under ODR policy.`,
      formulaApplied: 'Allowed = ₹0 (Broom-Clean Condition)',
      evaluatorStatus: 'REJECTED'
    };
  }

  // Case 2: Documented unsanitary state with invoice, capped at reasonable policy standard
  if (condition === 'UNSANITARY' && hasInvoice) {
    const cappedInvoice = Math.min(invoice, policy.maxCleaningDeduction);
    const allowed = Math.min(claimed, cappedInvoice);
    const rejected = Math.max(0, claimed - allowed);

    return {
      claimId: claim.id,
      category: 'CLEANING',
      claimedAmount: claimed,
      allowedAmount: allowed,
      rejectedAmount: rejected,
      ruleClassification: 'ODR_POLICY',
      ruleName: 'Abnormal Contamination Remediation Policy',
      explanation: `Evidence substantiates abnormal kitchen grease/unsanitary conditions exceeding ordinary living. Allowed verified cleaning agency invoice capped at the standard residential policy threshold of ₹${policy.maxCleaningDeduction.toLocaleString('en-IN')}.${rejected > 0 ? ` Excess claim of ₹${rejected.toLocaleString('en-IN')} rejected.` : ''}`,
      formulaApplied: `Allowed = min(Claimed: ₹${claimed}, Invoice: ₹${invoice}, Policy Cap: ₹${policy.maxCleaningDeduction})`,
      evaluatorStatus: rejected === 0 ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
    };
  }

  // Case 3: Unsanitary claim without invoice
  // Standard partial allowance or rejection
  const partial = Math.min(claimed, 2000); // Standard minimal sanitization contribution
  const rejected = claimed - partial;

  return {
    claimId: claim.id,
    category: 'CLEANING',
    claimedAmount: claimed,
    allowedAmount: partial,
    rejectedAmount: rejected,
    ruleClassification: 'ODR_POLICY',
    ruleName: 'Unverified Cleaning Standard Allowance',
    explanation: `Landlord claims unsanitary conditions without submitting an official professional cleaning invoice. Allowed standard nominal sanitization contribution of ₹${partial.toLocaleString('en-IN')}. Disallowed remaining ₹${rejected.toLocaleString('en-IN')}.`,
    formulaApplied: `Allowed = min(Claimed: ₹${claimed}, Flat Standard: ₹2,000)`,
    evaluatorStatus: 'PARTIALLY_ACCEPTED'
  };
}
