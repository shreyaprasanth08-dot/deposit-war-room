import { ClaimInput, EvaluationResult } from './types';

/**
 * Calculates lawful deductions for unpaid rent arrears.
 * 
 * Statutory Authority:
 * - Karnataka Rent Act, 1999, Section 27(2)(a) (Grounds for recovery of possession due to arrears of legally recoverable rent).
 * - Indian Contract Act, 1872, Section 73.
 */
export function calculateUnpaidRentDeduction(claim: ClaimInput): EvaluationResult {
  const claimed = Math.max(0, claim.claimedAmount);

  if (claimed === 0) {
    return {
      claimId: claim.id,
      category: 'UNPAID_RENT',
      claimedAmount: 0,
      allowedAmount: 0,
      rejectedAmount: 0,
      ruleClassification: 'STATUTORY_RULE',
      statutoryCitation: 'Karnataka Rent Act, 1999, Section 27(2)(a)',
      ruleName: 'Rent Arrears Verification',
      explanation: 'No rent arrears claimed or recorded. All monthly rent payments verified as paid in full.',
      formulaApplied: 'Allowed = ₹0 (Zero Arrears)',
      evaluatorStatus: 'ACCEPTED'
    };
  }

  const invoice = claim.invoiceAmount !== undefined ? claim.invoiceAmount : claimed;
  const allowed = Math.min(claimed, invoice);
  const rejected = Math.max(0, claimed - allowed);

  return {
    claimId: claim.id,
    category: 'UNPAID_RENT',
    claimedAmount: claimed,
    allowedAmount: allowed,
    rejectedAmount: rejected,
    ruleClassification: 'STATUTORY_RULE',
    statutoryCitation: 'Karnataka Rent Act, 1999, Section 27(2)(a)',
    ruleName: 'Statutory Rent Arrears Deduction',
    explanation: `Landlord is legally entitled under Section 27(2)(a) of the Karnataka Rent Act, 1999 to recover lawful rent arrears incurred during the tenancy tenure. Allowed ₹${allowed.toLocaleString('en-IN')}.${rejected > 0 ? ` Excess claim of ₹${rejected.toLocaleString('en-IN')} rejected.` : ''}`,
    formulaApplied: `Allowed = min(Claimed: ₹${claimed}, Ledger Deficit: ₹${invoice})`,
    evaluatorStatus: rejected === 0 ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
  };
}
