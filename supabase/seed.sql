-- The Deposit War Room: Seed Demo Data
-- Populates 3 realistic scenarios for demonstration

-- SCENARIO 1: Primary 5-Minute Demo (Whitefield 2BHK)
INSERT INTO disputes (
    id, property_address, city, monthly_rent, security_deposit, deposit_returned, withheld_amount,
    tenancy_start_date, tenancy_end_date, move_out_date, status, current_round, settlement_threshold
) VALUES (
    'DISP-2026-BLR-001', 
    'Flat 402, Tower B, Palm Meadows Greens, Whitefield, Bengaluru', 
    'Bengaluru', 
    30000.00, 
    200000.00, 
    145000.00, 
    55000.00, 
    '2024-06-01', 
    '2026-05-31', 
    '2026-05-31', 
    'NEGOTIATION', 
    1, 
    5.00
) ON CONFLICT (id) DO NOTHING;

INSERT INTO parties (id, dispute_id, role, name, email, phone) VALUES
('PARTY-T-001', 'DISP-2026-BLR-001', 'TENANT', 'Prasanth Kumar', 'prasanth.k@example.com', '+91 98450 12345'),
('PARTY-L-001', 'DISP-2026-BLR-001', 'LANDLORD', 'Rahul Chandrashekar', 'rahul.chandrashekar@example.com', '+91 98860 67890')
ON CONFLICT (id) DO NOTHING;

INSERT INTO deduction_claims (id, dispute_id, category, description, claimed_amount, invoice_amount, item_age_years, tenant_response) VALUES
('CLAIM-001-P', 'DISP-2026-BLR-001', 'PAINTING', 'Complete apartment repaint upon move-out', 18000.00, 15000.00, 2.0, 'Apartment was inhabited for 2 years with only normal wall fading and minor sofa rub marks. No illegal wall alterations.'),
('CLAIM-001-F', 'DISP-2026-BLR-001', 'FIXTURES', 'Damaged master bedroom water geyser tank replacement', 25000.00, 25000.00, 4.0, 'Geyser was already 4 years old and failing due to hard water scaling. Disagree with paying brand new replacement.'),
('CLAIM-001-C', 'DISP-2026-BLR-001', 'CLEANING', 'Professional deep cleaning charge', 5000.00, 3500.00, 0.0, 'Flat was handed over thoroughly broomed and mopped. Deep cleaning is standard landlord turnaround.'),
('CLAIM-001-U', 'DISP-2026-BLR-001', 'UTILITIES', 'Final unpaid BESCOM electricity bill for May 2026', 7000.00, 7000.00, 0.0, 'Accepted. I agree this electricity bill is my responsibility.'),
('CLAIM-001-R', 'DISP-2026-BLR-001', 'UNPAID_RENT', 'Rent arrears', 0.00, 0.00, 0.0, 'All monthly rent transfers were executed on the 1st of every month via NEFT.')
ON CONFLICT (id) DO NOTHING;

INSERT INTO evaluations (id, dispute_id, claim_id, category, claimed_amount, allowed_amount, rejected_amount, rule_type, statutory_citation, explanation, evaluator_status) VALUES
('EVAL-001-P', 'DISP-2026-BLR-001', 'CLAIM-001-P', 'PAINTING', 18000.00, 0.00, 18000.00, 'STATUTORY_RULE', 'Transfer of Property Act, 1882, Section 108(m)', 'Tenant resided for 24 months. Wall marks constitute normal wear and tear. Statutory law explicitly exempts tenant liability for normal wear and tear.', 'REJECTED'),
('EVAL-001-F', 'DISP-2026-BLR-001', 'CLAIM-001-F', 'FIXTURES', 25000.00, 15000.00, 10000.00, 'ODR_POLICY', 'Ind AS 16 / Tort Principle of Non-Betterment (ODR Policy Rule)', 'Replacement geyser cost is ₹25,000. Applying 10% straight-line annual depreciation over 4 years lifespan (40% reduction). Allowed deduction is 60% residual value (₹15,000).', 'PARTIALLY_ACCEPTED'),
('EVAL-001-C', 'DISP-2026-BLR-001', 'CLAIM-001-C', 'CLEANING', 5000.00, 2000.00, 3000.00, 'ODR_POLICY', 'ODR Policy Rule (Standard Flat Handover Policy)', 'No photographic evidence of abnormal contamination. Capped at standard handover sanitization fee of ₹2,000. Excess ₹3,000 disallowed.', 'PARTIALLY_ACCEPTED'),
('EVAL-001-U', 'DISP-2026-BLR-001', 'CLAIM-001-U', 'UTILITIES', 7000.00, 7000.00, 0.00, 'STATUTORY_RULE', 'Karnataka Rent Act 1999, Section 13 & Lease Covenant', 'Corroborated by official BESCOM utility bill for May 2026 matching tenancy tenure. Allowed in full.', 'ACCEPTED'),
('EVAL-001-R', 'DISP-2026-BLR-001', 'CLAIM-001-R', 'UNPAID_RENT', 0.00, 0.00, 0.00, 'STATUTORY_RULE', 'Karnataka Rent Act 1999, Section 27(2)(a)', 'No rent arrears claimed or recorded.', 'ACCEPTED')
ON CONFLICT (id) DO NOTHING;

INSERT INTO negotiation_rounds (id, dispute_id, round_number, landlord_offer, tenant_offer, gap_amount, gap_percentage, landlord_message, tenant_message, status) VALUES
('RND-001-1', 'DISP-2026-BLR-001', 1, 48000.00, 15000.00, 33000.00, 68.75, 'I am willing to reduce painting to ₹15,000 and geyser to ₹22,000.', 'I accept utilities (₹7,000) and can pay ₹8,000 for geyser repair. Total ₹15,000.', 'COMPLETED')
ON CONFLICT (id) DO NOTHING;
