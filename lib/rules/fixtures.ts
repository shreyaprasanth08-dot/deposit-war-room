import { ClaimInput, EvaluationResult } from './types';
import { defaultODRPolicy, ODRPolicyConfig } from '../config/odr-policy';

/**
 * Calculates lawful deductions for fixture damage applying straight-line depreciation.
 * 
 * Legal Basis:
 * - Common Law Tort Doctrine of Non-Betterment (Landlord cannot receive 'new for old').
 * - Indian Accounting Standard (Ind AS 16) & Income Tax Act Schedule XIV depreciation rules.
 * - NOT a statutory section in Karnataka Rent Act, 1999 (Explicitly an ODR Policy Rule).
 */
export function calculateFixtureDeduction(
  claim: ClaimInput,
  policy: ODRPolicyConfig = defaultODRPolicy
): EvaluationResult {
  const claimed = Math.max(0, claim.claimedAmount);
  const condition = claim.conditionTag ?? 'EXCESSIVE_DAMAGE';
  const ageYears = Math.max(0, claim.itemAgeYears ?? 0);
  const baseCost = claim.invoiceAmount && claim.invoiceAmount > 0 ? claim.invoiceAmount : claimed;

  // Case 1: Normal wear and tear on fixture
  if (condition === 'NORMAL_WEAR_AND_TEAR' || condition === 'GOOD') {
    return {
      claimId: claim.id,
      category: 'FIXTURES',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'STATUTORY_RULE',
      statutoryCitation: 'Transfer of Property Act, 1882, Section 108(m)',
      ruleName: 'Normal Wear and Tear on Fixtures',
      explanation: `The fixture (${claim.description}) degraded through ordinary usage and passage of time. Under Section 108(m) of the Transfer of Property Act, 1882, routine aging of amenities is the landlord's capital maintenance responsibility.`,
      formulaApplied: 'Allowed = ₹0 (TPA Sec 108(m))',
      evaluatorStatus: 'REJECTED'
    };
  }

  // Case 2: Actual damage requiring replacement/repair - apply depreciation
  const depreciationFactor = Math.min(
    ageYears * policy.fixtureDepreciationRate,
    policy.fixtureMaxDepreciation
  );
  const depreciationPercent = Math.round(depreciationFactor * 100);
  const residualFactor = Math.max(0, 1 - depreciationFactor);

  const rawAllowed = baseCost * residualFactor;
  const allowed = Math.min(claimed, Math.round(rawAllowed));
  const rejected = Math.max(0, claimed - allowed);

  const formulaStr = `Base: ₹${baseCost.toLocaleString('en-IN')} × (1 - (${ageYears} yrs × ${(policy.fixtureDepreciationRate * 100)}%)) = ${100 - depreciationPercent}% residual value`;

  return {
    claimId: claim.id,
    category: 'FIXTURES',
    claimedAmount: claimed,
    allowedAmount: allowed,
    rejectedAmount: rejected,
    ruleClassification: 'ODR_POLICY',
    statutoryCitation: 'Ind AS 16 / Tort Principle of Non-Betterment (ODR Policy Rule)',
    ruleName: 'Straight-Line Fixture Depreciation Policy',
    explanation: `Original replacement cost is ₹${baseCost.toLocaleString('en-IN')}. The fixture is ${ageYears} year(s) old. Under straight-line depreciation at ${(policy.fixtureDepreciationRate * 100)}% per year, the asset has already depreciated by ${depreciationPercent}%. Awarding a brand-new fixture would constitute unjust landlord betterment. The tenant is liable only for the ${100 - depreciationPercent}% residual value (₹${allowed.toLocaleString('en-IN')}). Disallowed ₹${rejected.toLocaleString('en-IN')}.`,
    formulaApplied: formulaStr,
    evaluatorStatus: allowed === claimed ? 'ACCEPTED' : (allowed > 0 ? 'PARTIALLY_ACCEPTED' : 'REJECTED')
  };
}
