import test from 'node:test';
import assert from 'node:assert/strict';

// Test rule engine logic directly
const defaultODRPolicy = {
  fixtureDepreciationRate: 0.10,
  fixtureMaxDepreciation: 1.00,
  settlementThresholdPercent: 5.0,
  maxNegotiationRounds: 3,
  standardPaintingCycleYears: 2,
  maxCleaningDeduction: 5000,
  standardNoticePeriodDays: 30,
  statutoryDepositCapMonths: 2
};

function calculatePaintingDeduction(claim, policy = defaultODRPolicy) {
  const claimed = Math.max(0, claim.claimedAmount);
  const condition = claim.conditionTag ?? 'NORMAL_WEAR_AND_TEAR';
  const invoice = claim.invoiceAmount ?? claimed;
  const hasInvoice = claim.hasOfficialInvoice ?? (claim.invoiceAmount !== undefined && claim.invoiceAmount > 0);

  if (condition === 'NORMAL_WEAR_AND_TEAR' || condition === 'GOOD') {
    return {
      category: 'PAINTING',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'STATUTORY_RULE',
      statutoryCitation: 'Transfer of Property Act, 1882, Section 108(m)',
      evaluatorStatus: 'REJECTED'
    };
  }

  if (condition === 'EXCESSIVE_DAMAGE' && hasInvoice) {
    const allowed = Math.min(claimed, invoice);
    return {
      category: 'PAINTING',
      claimedAmount: claimed,
      allowedAmount: allowed,
      rejectedAmount: Math.max(0, claimed - allowed),
      ruleClassification: 'ODR_POLICY',
      evaluatorStatus: claimed === allowed ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
    };
  }

  return {
    category: 'PAINTING',
    claimedAmount: claimed,
    allowedAmount: 0,
    rejectedAmount: claimed,
    ruleClassification: 'ODR_POLICY',
    evaluatorStatus: 'REJECTED'
  };
}

function calculateFixtureDeduction(claim, policy = defaultODRPolicy) {
  const claimed = Math.max(0, claim.claimedAmount);
  const condition = claim.conditionTag ?? 'EXCESSIVE_DAMAGE';
  const ageYears = Math.max(0, claim.itemAgeYears ?? 0);
  const baseCost = claim.invoiceAmount && claim.invoiceAmount > 0 ? claim.invoiceAmount : claimed;

  if (condition === 'NORMAL_WEAR_AND_TEAR' || condition === 'GOOD') {
    return {
      category: 'FIXTURES',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'STATUTORY_RULE',
      evaluatorStatus: 'REJECTED'
    };
  }

  const depreciationFactor = Math.min(ageYears * policy.fixtureDepreciationRate, policy.fixtureMaxDepreciation);
  const residualFactor = Math.max(0, 1 - depreciationFactor);
  const allowed = Math.min(claimed, Math.round(baseCost * residualFactor));

  return {
    category: 'FIXTURES',
    claimedAmount: claimed,
    allowedAmount: allowed,
    rejectedAmount: Math.max(0, claimed - allowed),
    ruleClassification: 'ODR_POLICY',
    evaluatorStatus: allowed === claimed ? 'ACCEPTED' : (allowed > 0 ? 'PARTIALLY_ACCEPTED' : 'REJECTED')
  };
}

function calculateUtilityDeduction(claim) {
  const claimed = Math.max(0, claim.claimedAmount);
  const invoice = claim.invoiceAmount !== undefined ? claim.invoiceAmount : claimed;
  const isDisputed = claim.conditionTag === 'DISPUTED';
  const hasInvoice = claim.hasOfficialInvoice ?? (claim.invoiceAmount !== undefined && claim.invoiceAmount > 0);

  if (isDisputed && !hasInvoice) {
    return {
      category: 'UTILITIES',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'STATUTORY_RULE',
      evaluatorStatus: 'REJECTED'
    };
  }

  const allowed = Math.min(claimed, invoice);
  return {
    category: 'UTILITIES',
    claimedAmount: claimed,
    allowedAmount: allowed,
    rejectedAmount: Math.max(0, claimed - allowed),
    ruleClassification: 'STATUTORY_RULE',
    evaluatorStatus: claimed === allowed ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
  };
}

function calculateUnpaidRentDeduction(claim) {
  const claimed = Math.max(0, claim.claimedAmount);
  const invoice = claim.invoiceAmount !== undefined ? claim.invoiceAmount : claimed;
  const allowed = Math.min(claimed, invoice);
  return {
    category: 'UNPAID_RENT',
    claimedAmount: claimed,
    allowedAmount: allowed,
    rejectedAmount: Math.max(0, claimed - allowed),
    ruleClassification: 'STATUTORY_RULE',
    evaluatorStatus: 'ACCEPTED'
  };
}

function calculateCleaningDeduction(claim, policy = defaultODRPolicy) {
  const claimed = Math.max(0, claim.claimedAmount);
  const condition = claim.conditionTag ?? 'GOOD';
  const invoice = claim.invoiceAmount ?? claimed;
  const hasInvoice = claim.hasOfficialInvoice ?? (claim.invoiceAmount !== undefined && claim.invoiceAmount > 0);

  if (condition === 'GOOD' || condition === 'NORMAL_WEAR_AND_TEAR') {
    return {
      category: 'CLEANING',
      claimedAmount: claimed,
      allowedAmount: 0,
      rejectedAmount: claimed,
      ruleClassification: 'ODR_POLICY',
      evaluatorStatus: 'REJECTED'
    };
  }

  if (condition === 'UNSANITARY' && hasInvoice) {
    const cappedInvoice = Math.min(invoice, policy.maxCleaningDeduction);
    const allowed = Math.min(claimed, cappedInvoice);
    return {
      category: 'CLEANING',
      claimedAmount: claimed,
      allowedAmount: allowed,
      rejectedAmount: Math.max(0, claimed - allowed),
      ruleClassification: 'ODR_POLICY',
      evaluatorStatus: allowed === claimed ? 'ACCEPTED' : 'PARTIALLY_ACCEPTED'
    };
  }

  const partial = Math.min(claimed, 2000);
  return {
    category: 'CLEANING',
    claimedAmount: claimed,
    allowedAmount: partial,
    rejectedAmount: claimed - partial,
    ruleClassification: 'ODR_POLICY',
    evaluatorStatus: 'PARTIALLY_ACCEPTED'
  };
}

function calculateGapPercentage(landlordAmount, tenantAmount) {
  const maxOffer = Math.max(landlordAmount, tenantAmount);
  if (maxOffer === 0) return 0;
  const difference = Math.abs(landlordAmount - tenantAmount);
  return Number(((difference / maxOffer) * 100).toFixed(2));
}

function evaluateNegotiationRound(roundInput, policy = defaultODRPolicy) {
  const { roundNumber, landlordOffer, tenantOffer } = roundInput;

  if (roundNumber > policy.maxNegotiationRounds) {
    return {
      roundNumber,
      isSettlementEligible: false,
      isMaxRoundsExhausted: true,
      nextState: 'MEDIATOR_REVIEW',
      systemMessage: 'Maximum negotiation rounds exceeded. Counteroffer rejected. Escalated to Mediator.'
    };
  }

  const gapPercentage = calculateGapPercentage(landlordOffer, tenantOffer);
  const isSettlementEligible = gapPercentage <= policy.settlementThresholdPercent;
  const isMaxRoundsExhausted = roundNumber === policy.maxNegotiationRounds && !isSettlementEligible;

  let nextState = 'NEGOTIATION';
  if (isSettlementEligible) {
    nextState = 'SETTLEMENT_ELIGIBLE';
  } else if (isMaxRoundsExhausted) {
    nextState = 'MEDIATOR_REVIEW';
  }

  return {
    roundNumber,
    landlordOffer,
    tenantOffer,
    gapPercentage,
    isSettlementEligible,
    isMaxRoundsExhausted,
    nextState
  };
}

// ==================== TEST CASES ====================

test('1. Painting accepted when malicious damage is documented with invoice', () => {
  const result = calculatePaintingDeduction({
    id: 'p-1',
    category: 'PAINTING',
    claimedAmount: 15000,
    invoiceAmount: 15000,
    conditionTag: 'EXCESSIVE_DAMAGE',
    hasOfficialInvoice: true
  });
  assert.equal(result.allowedAmount, 15000);
  assert.equal(result.rejectedAmount, 0);
  assert.equal(result.evaluatorStatus, 'ACCEPTED');
});

test('2. Painting rejected due to normal wear and tear under TPA Sec 108(m)', () => {
  const result = calculatePaintingDeduction({
    id: 'p-2',
    category: 'PAINTING',
    claimedAmount: 18000,
    invoiceAmount: 15000,
    conditionTag: 'NORMAL_WEAR_AND_TEAR',
    hasOfficialInvoice: true
  });
  assert.equal(result.allowedAmount, 0);
  assert.equal(result.rejectedAmount, 18000);
  assert.equal(result.ruleClassification, 'STATUTORY_RULE');
  assert.equal(result.statutoryCitation, 'Transfer of Property Act, 1882, Section 108(m)');
  assert.equal(result.evaluatorStatus, 'REJECTED');
});

test('3. Cleaning accepted for unsanitary condition capped at policy standard', () => {
  const result = calculateCleaningDeduction({
    id: 'c-1',
    category: 'CLEANING',
    claimedAmount: 7000,
    invoiceAmount: 7000,
    conditionTag: 'UNSANITARY',
    hasOfficialInvoice: true
  });
  // Should be capped at maxCleaningDeduction (₹5,000)
  assert.equal(result.allowedAmount, 5000);
  assert.equal(result.rejectedAmount, 2000);
  assert.equal(result.evaluatorStatus, 'PARTIALLY_ACCEPTED');
});

test('4. Cleaning rejected when apartment handed over in broom-clean condition', () => {
  const result = calculateCleaningDeduction({
    id: 'c-2',
    category: 'CLEANING',
    claimedAmount: 5000,
    conditionTag: 'GOOD'
  });
  assert.equal(result.allowedAmount, 0);
  assert.equal(result.rejectedAmount, 5000);
  assert.equal(result.evaluatorStatus, 'REJECTED');
});

test('5. Utility bill accepted when supported by official bill', () => {
  const result = calculateUtilityDeduction({
    id: 'u-1',
    category: 'UTILITIES',
    claimedAmount: 7000,
    invoiceAmount: 7000,
    conditionTag: 'GOOD',
    hasOfficialInvoice: true
  });
  assert.equal(result.allowedAmount, 7000);
  assert.equal(result.rejectedAmount, 0);
  assert.equal(result.evaluatorStatus, 'ACCEPTED');
});

test('6. Utility bill rejected when disputed and unsupported by bill', () => {
  const result = calculateUtilityDeduction({
    id: 'u-2',
    category: 'UTILITIES',
    claimedAmount: 5000,
    conditionTag: 'DISPUTED',
    hasOfficialInvoice: false
  });
  assert.equal(result.allowedAmount, 0);
  assert.equal(result.rejectedAmount, 5000);
  assert.equal(result.evaluatorStatus, 'REJECTED');
});

test('7. Unpaid rent allowed under Karnataka Rent Act Sec 27(2)(a)', () => {
  const result = calculateUnpaidRentDeduction({
    id: 'r-1',
    category: 'UNPAID_RENT',
    claimedAmount: 30000,
    invoiceAmount: 30000
  });
  assert.equal(result.allowedAmount, 30000);
  assert.equal(result.rejectedAmount, 0);
  assert.equal(result.ruleClassification, 'STATUTORY_RULE');
});

test('8. Fixture depreciation correctly calculates 40% reduction for 4-year geyser', () => {
  const result = calculateFixtureDeduction({
    id: 'f-1',
    category: 'FIXTURES',
    claimedAmount: 25000,
    invoiceAmount: 25000,
    itemAgeYears: 4.0,
    conditionTag: 'EXCESSIVE_DAMAGE'
  });
  // 4 years * 10% = 40% depreciation. Residual value = 60% of 25,000 = 15,000
  assert.equal(result.allowedAmount, 15000);
  assert.equal(result.rejectedAmount, 10000);
  assert.equal(result.ruleClassification, 'ODR_POLICY');
  assert.equal(result.evaluatorStatus, 'PARTIALLY_ACCEPTED');
});

test('9. Fixture wear and tear rejected under TPA Sec 108(m)', () => {
  const result = calculateFixtureDeduction({
    id: 'f-2',
    category: 'FIXTURES',
    claimedAmount: 10000,
    itemAgeYears: 2.0,
    conditionTag: 'NORMAL_WEAR_AND_TEAR'
  });
  assert.equal(result.allowedAmount, 0);
  assert.equal(result.rejectedAmount, 10000);
  assert.equal(result.evaluatorStatus, 'REJECTED');
});

test('10. Settlement threshold <= 5% triggers SETTLEMENT_ELIGIBLE', () => {
  // Landlord: 25,000 | Tenant: 24,000 => Gap = (1000 / 25000) * 100 = 4.0%
  const gap = calculateGapPercentage(25000, 24000);
  assert.equal(gap, 4.0);
  
  const round = evaluateNegotiationRound({
    roundNumber: 3,
    landlordOffer: 25000,
    tenantOffer: 24000
  });
  assert.equal(round.isSettlementEligible, true);
  assert.equal(round.nextState, 'SETTLEMENT_ELIGIBLE');
});

test('11. Settlement threshold > 5% requires further negotiation', () => {
  // Landlord: 32,000 | Tenant: 22,000 => Gap = (10000 / 32000) * 100 = 31.25%
  const gap = calculateGapPercentage(32000, 22000);
  assert.equal(gap, 31.25);
  
  const round = evaluateNegotiationRound({
    roundNumber: 2,
    landlordOffer: 32000,
    tenantOffer: 22000
  });
  assert.equal(round.isSettlementEligible, false);
  assert.equal(round.nextState, 'NEGOTIATION');
});

test('12. Negotiation Round 1, 2, and 3 flow properly', () => {
  const r1 = evaluateNegotiationRound({ roundNumber: 1, landlordOffer: 48000, tenantOffer: 15000 });
  assert.equal(r1.nextState, 'NEGOTIATION');

  const r2 = evaluateNegotiationRound({ roundNumber: 2, landlordOffer: 35000, tenantOffer: 20000 });
  assert.equal(r2.nextState, 'NEGOTIATION');

  const r3 = evaluateNegotiationRound({ roundNumber: 3, landlordOffer: 25000, tenantOffer: 24000 });
  assert.equal(r3.nextState, 'SETTLEMENT_ELIGIBLE');
});

test('13. Round 4 is strictly rejected and blocked', () => {
  const r4 = evaluateNegotiationRound({ roundNumber: 4, landlordOffer: 24500, tenantOffer: 24000 });
  assert.equal(r4.isMaxRoundsExhausted, true);
  assert.equal(r4.nextState, 'MEDIATOR_REVIEW');
});

test('14. Mediator escalation triggered when Round 3 finishes with gap > 5%', () => {
  const r3Deadlock = evaluateNegotiationRound({ roundNumber: 3, landlordOffer: 80000, tenantOffer: 35000 });
  assert.equal(r3Deadlock.isSettlementEligible, false);
  assert.equal(r3Deadlock.isMaxRoundsExhausted, true);
  assert.equal(r3Deadlock.nextState, 'MEDIATOR_REVIEW');
});
