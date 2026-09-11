import { ClaimInput, EvaluationResult } from './types';
import { defaultODRPolicy, ODRPolicyConfig } from '../config/odr-policy';

/**
 * Calculates lawful deductions for painting claims.
 * 
 * Statutory Authority:
 * - Transfer of Property Act, 1882, Section 108(m) ("reasonable wear and tear excepted").
 * - There is NO statutory section in the Karnataka Rent Act authorizing automatic 1-month repainting deductions.
 */
export function calculatePaintingDeduction(
  claim: ClaimInput,
  policy: ODRPolicyConfig = defaultODRPolicy
): EvaluationResult {
  const claimed = Math.max(0, claim.claimedAmount);
  const tenure = claim.tenureYears ?? 2.0;
  const condition = claim.conditionTag ?? 'NORMAL_WEAR_AND_TEAR';
  const invoice = claim.invoiceAmount ?? claimed;
  const hasInvoice = claim.hasOfficialInvoice ?? (claim.invoiceAmount !== undefined && claim.invoiceAmount > 0);

  // Case 1: Normal wear and tear or tenancy exceeded repainting cycle
  if (condition === 'NORMAL_WEAR_AND_TEAR' || condition === 'GOOD') {
    return {
      claimId: claim.id,
      category: 'PAINTING',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'STATUTORY_RULE',
      statutoryCitation: 'Transfer of Property Act, 1882, Section 108(m)',
      ruleName: 'Statutory Normal Wear and Tear Exemption',
      explanation: `Tenant occupied the property for ${tenure} year(s). Evidence shows normal wall aging and minor scuffs. Under Section 108(m) of the Transfer of Property Act, 1882, the tenant is explicitly exempt from ordinary wear and tear. Bangalore customary flat 1-month painting deductions without documented structural wall damage are disallowed.`,
      formulaApplied: 'Allowed = ₹0 (TPA Sec 108(m))',
      evaluatorStatus: 'REJECTED'
    };
  }

  // Case 2: Excessive damage with verified invoice
  if (condition === 'EXCESSIVE_DAMAGE' && hasInvoice) {
    const allowed = Math.min(claimed, invoice);
    const rejected = Math.max(0, claimed - allowed);

    return {
      claimId: claim.id,
      category: 'PAINTING',
      claimedAmount: claimed,
      allowedAmount: allowed,
      rejectedAmount: rejected,
      ruleClassification: 'ODR_POLICY',
      statutoryCitation: 'Contract Law / Actual Damage Reparation (ODR Policy Rule)',
      ruleName: 'Documented Damage Remediation Policy',
      explanation: `Photographic evidence demonstrates wall damage beyond normal wear and tear (e.g. wall chipping or unauthorized paint alterations). Allowed verified contractor invoice amount of ₹${allowed.toLocaleString('en-IN')}.${rejected > 0 ? ` Excess claim of ₹${rejected.toLocaleString('en-IN')} rejected.` : ''}`,
      formulaApplied: `Allowed = min(Claimed: ₹${claimed}, Invoice: ₹${invoice})`,
      evaluatorStatus: rejected === 0 ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
    };
  }

  // Case 3: Claimed excessive damage without invoice
  return {
    claimId: claim.id,
    category: 'PAINTING',
    claimedAmount: claimed,
    allowedAmount: 0,
    rejectedAmount: claimed,
    ruleClassification: 'ODR_POLICY',
    ruleName: 'Unsubstantiated Painting Claim Disallowance',
    explanation: `Claim of ₹${claimed.toLocaleString('en-IN')} lacks a verified GST painter invoice or proof of damage beyond normal wear and tear. Disallowed under ODR substantiation standards.`,
    formulaApplied: 'Allowed = ₹0 (Missing Proof/Invoice)',
    evaluatorStatus: 'REJECTED'
  };
}
