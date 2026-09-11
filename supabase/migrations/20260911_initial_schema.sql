-- The Deposit War Room: Initial Database Schema
-- Designed for Supabase (PostgreSQL)

-- 1. DISPUTES TABLE
CREATE TABLE IF NOT EXISTS disputes (
    id TEXT PRIMARY KEY,
    property_address TEXT NOT NULL,
    city TEXT DEFAULT 'Bengaluru',
    monthly_rent NUMERIC(10, 2) NOT NULL,
    security_deposit NUMERIC(10, 2) NOT NULL,
    deposit_returned NUMERIC(10, 2) DEFAULT 0.00,
    withheld_amount NUMERIC(10, 2) NOT NULL,
    tenancy_start_date DATE NOT NULL,
    tenancy_end_date DATE NOT NULL,
    move_out_date DATE NOT NULL,
    status TEXT NOT NULL DEFAULT 'EVIDENCE_COLLECTION' CHECK (
        status IN (
            'DRAFT', 
            'SUBMITTED', 
            'EVIDENCE_COLLECTION', 
            'EVALUATION', 
            'NEGOTIATION', 
            'SETTLEMENT_ELIGIBLE', 
            'SETTLED', 
            'MEDIATOR_REVIEW', 
            'CLOSED'
        )
    ),
    current_round INTEGER DEFAULT 1 CHECK (current_round BETWEEN 0 AND 3),
    settlement_threshold NUMERIC(4, 2) DEFAULT 5.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. PARTIES TABLE
CREATE TABLE IF NOT EXISTS parties (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('TENANT', 'LANDLORD', 'MEDIATOR')),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. DEDUCTION CLAIMS TABLE
CREATE TABLE IF NOT EXISTS deduction_claims (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) ON DELETE CASCADE,
    category TEXT NOT NULL CHECK (
        category IN ('PAINTING', 'FIXTURES', 'UTILITIES', 'UNPAID_RENT', 'CLEANING', 'OTHER')
    ),
    description TEXT NOT NULL,
    claimed_amount NUMERIC(10, 2) NOT NULL,
    invoice_amount NUMERIC(10, 2),
    item_age_years NUMERIC(4, 1) DEFAULT 0.0,
    invoice_date DATE,
    tenant_response TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. EVIDENCE ITEMS TABLE
CREATE TABLE IF NOT EXISTS evidence_items (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) ON DELETE CASCADE,
    claim_id TEXT REFERENCES deduction_claims(id) ON DELETE SET NULL,
    submitted_by TEXT NOT NULL CHECK (submitted_by IN ('TENANT', 'LANDLORD')),
    evidence_type TEXT NOT NULL CHECK (
        evidence_type IN (
            'MOVE_IN_PHOTO', 
            'MOVE_OUT_PHOTO', 
            'INVOICE', 
            'UTILITY_BILL', 
            'RENT_AGREEMENT', 
            'BANK_STATEMENT', 
            'OTHER'
        )
    ),
    title TEXT NOT NULL,
    description TEXT,
    condition_tag TEXT DEFAULT 'GOOD' CHECK (
        condition_tag IN ('GOOD', 'NORMAL_WEAR_AND_TEAR', 'EXCESSIVE_DAMAGE', 'UNSANITARY', 'DISPUTED')
    ),
    document_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. EVALUATIONS TABLE
CREATE TABLE IF NOT EXISTS evaluations (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) ON DELETE CASCADE,
    claim_id TEXT REFERENCES deduction_claims(id) ON DELETE CASCADE,
    category TEXT NOT NULL,
    claimed_amount NUMERIC(10, 2) NOT NULL,
    allowed_amount NUMERIC(10, 2) NOT NULL,
    rejected_amount NUMERIC(10, 2) NOT NULL,
    rule_type TEXT NOT NULL CHECK (
        rule_type IN ('STATUTORY_RULE', 'ODR_POLICY', 'DEMO_ASSUMPTION')
    ),
    statutory_citation TEXT,
    explanation TEXT NOT NULL,
    evaluator_status TEXT DEFAULT 'ACCEPTED' CHECK (
        evaluator_status IN ('ACCEPTED', 'PARTIALLY_ACCEPTED', 'REJECTED', 'MANUAL_OVERRIDE')
    ),
    evaluated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. NEGOTIATION ROUNDS TABLE
CREATE TABLE IF NOT EXISTS negotiation_rounds (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) ON DELETE CASCADE,
    round_number INTEGER NOT NULL CHECK (round_number BETWEEN 1 AND 3),
    landlord_offer NUMERIC(10, 2) NOT NULL,
    tenant_offer NUMERIC(10, 2) NOT NULL,
    gap_amount NUMERIC(10, 2) NOT NULL,
    gap_percentage NUMERIC(5, 2) NOT NULL,
    landlord_message TEXT,
    tenant_message TEXT,
    status TEXT DEFAULT 'COMPLETED' CHECK (status IN ('PENDING', 'COMPLETED', 'REJECTED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. CONSENTS TABLE
CREATE TABLE IF NOT EXISTS consents (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) ON DELETE CASCADE,
    party_role TEXT NOT NULL CHECK (party_role IN ('TENANT', 'LANDLORD')),
    party_name TEXT NOT NULL,
    agreed_deduction NUMERIC(10, 2) NOT NULL,
    consent_statement TEXT NOT NULL,
    consented_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 8. SETTLEMENTS TABLE
CREATE TABLE IF NOT EXISTS settlements (
    id TEXT PRIMARY KEY,
    dispute_id TEXT REFERENCES disputes(id) UNIQUE ON DELETE CASCADE,
    total_deposit NUMERIC(10, 2) NOT NULL,
    final_deduction NUMERIC(10, 2) NOT NULL,
    refund_amount NUMERIC(10, 2) NOT NULL,
    agreement_title TEXT DEFAULT 'RENTAL DEPOSIT DISPUTE SETTLEMENT AGREEMENT',
    settled_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    pdf_hash TEXT NOT NULL
);
