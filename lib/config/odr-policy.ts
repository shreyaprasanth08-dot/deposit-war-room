/**
 * ODR Policy Configuration
 * 
 * IMPORTANT: These values represent configurable dispute resolution policy parameters,
 * accounting depreciation standards, and contractual norms.
 * They are NOT statutory provisions of the Karnataka Rent Act unless explicitly noted.
 */

export interface ODRPolicyConfig {
  /**
   * Straight-line annual depreciation on residential fixtures (geysers, ACs, fans, chimneys).
   * Grounded in Ind AS 16 and Tort Law principle of non-betterment.
   * Default: 10% (0.10) per annum, equivalent to a 10-year useful lifespan.
   */
  fixtureDepreciationRate: number;

  /**
   * Maximum deduction percentage allowable on any aged fixture.
   * Default: 100% (1.00). An asset older than 10 years at 10%/year has 0% residual value.
   */
  fixtureMaxDepreciation: number;

  /**
   * Threshold difference (in %) between Landlord and Tenant counteroffers to trigger settlement.
   * Calculated as: abs(Landlord - Tenant) / max(Landlord, Tenant) * 100.
   * Default: 5% (5.0).
   */
  settlementThresholdPercent: number;

  /**
   * Maximum allowed rounds of structured counteroffers before compulsory escalation to human mediator.
   * Default: 3 rounds.
   */
  maxNegotiationRounds: number;

  /**
   * Typical residential wall painting lifespan cycle in years.
   * If tenancy exceeds this cycle, wall marks are presumed normal wear and tear unless deliberate structural damage exists.
   * Default: 2 years.
   */
  standardPaintingCycleYears: number;

  /**
   * Maximum reasonable standard deduction for residential move-out deep cleaning without specialized hazmat/remediation invoices.
   * Default: ₹5,000.
   */
  maxCleaningDeduction: number;

  /**
   * Contractually standard notice period in days for Bengaluru residential leases.
   * Statutory baseline in TPA Sec 106 is 15 days; Bengaluru lease agreements routinely standardise on 30 days.
   * Default: 30 days.
   */
  standardNoticePeriodDays: number;

  /**
   * Statutory residential security deposit cap under the Karnataka Rent (Amendment) Act, 2025 (effective Jan 8, 2026).
   * Expressed as multiple of monthly rent.
   */
  statutoryDepositCapMonths: number;
}

export const defaultODRPolicy: ODRPolicyConfig = {
  fixtureDepreciationRate: 0.10, // 10% per year
  fixtureMaxDepreciation: 1.00,  // 100% maximum depreciation cap
  settlementThresholdPercent: 5.0, // 5% settlement eligibility gap
  maxNegotiationRounds: 3,         // Max 3 rounds
  standardPaintingCycleYears: 2,   // 2-year paint renewal cycle
  maxCleaningDeduction: 5000,      // Max ₹5,000 cleaning standard
  standardNoticePeriodDays: 30,    // 30 days notice
  statutoryDepositCapMonths: 2     // 2 months statutory cap (Karnataka Rent Amendment 2025)
};
