import { ClaimInput, EvaluationResult } from './types';

/**
 * Calculates lawful deductions for unpaid utility charges (BESCOM, BWSSB, Gas, Maintenance).
 * 
 * Statutory Authority:
 * - Karnataka Rent Act, 1999, Section 13 (prohibiting withholding of essential services without lawful payment).
 * - Contractual covenant under Section 108(b) of Transfer of Property Act, 1882.
 */
export function calculateUtilityDeduction(claim: ClaimInput): EvaluationResult {
  const claimed = Math.max(0, claim.claimedAmount);
  const invoice = claim.invoiceAmount !== undefined ? claim.invoiceAmount : claimed;
  const isDisputed = claim.conditionTag === 'DISPUTED';
  const hasInvoice = claim.hasOfficialInvoice ?? (claim.invoiceAmount !== undefined && claim.invoiceAmount > 0);

  if (isDisputed && !hasInvoice) {
    return {
      claimId: claim.id,
      category: 'UTILITIES',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'STATUTORY_RULE',
      statutoryCitation: 'Karnataka Rent Act, 1999, Section 13 & Indian Evidence Act',
      ruleName: 'Unverified Utility Claim Disallowance',
      explanation: `Claim of ₹${claimed.toLocaleString('en-IN')} for utilities is disputed and unsupported by an official utility bill (e.g. BESCOM/BWSSB statement). Landlords cannot levy estimated utility charges without billing proof.`,
      formulaApplied: 'Allowed = ₹0 (No Utility Statement)',
      evaluatorStatus: 'REJECTED'
    };
  }

  // Bill is verified
  const allowed = Math.min(claimed, invoice);
  const rejected = Math.max(0, claimed - allowed);

  return {
    claimId: claim.id,
    category: 'UTILITIES',
    claimedAmount: claimed,
    allowedAmount: allowed,
    rejectedAmount: rejected,
    ruleClassification: 'STATUTORY_RULE',
    statutoryCitation: 'Karnataka Rent Act, 1999, Section 13 & Lease Covenant',
    ruleName: 'Statutory Essential Services & Utility Reconciliation',
    explanation: `Corroborated by official utility bill (BESCOM/BWSSB) for ₹${invoice.toLocaleString('en-IN')} incurred during tenant occupancy. The tenant is legally liable for actual consumed utilities.${rejected > 0 ? ` Excess claim of ₹${rejected.toLocaleString('en-IN')} above actual meter bill rejected.` : ''}`,
    formulaApplied: `Allowed = min(Claimed: ₹${claimed}, Bill: ₹${invoice})`,
    evaluatorStatus: rejected === 0 ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
  };
}
