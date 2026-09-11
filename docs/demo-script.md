# 5-Minute Judge Pitch & Demo Script

**Project:** The Deposit War Room  
**Target Pitch Duration:** Under 5 minutes (approx. 3m 45s demo + 1m Q&A)

---

## 🎙️ The 30-Second Hook (Opening)

> *"Judges, in Bengaluru, moving out of a rented flat is practically an extreme sport. Tenants pay ₹2 to ₹3 Lakhs in security deposits, and landlords routinely deduct ₹50,000 or more on autopilot for repainting, deep cleaning, or aged geysers.*
>
> *Today, tenants either surrender their hard-earned money or get stuck in expensive court disputes.*
>
> *We built **The Deposit War Room** — an explainable Online Dispute Resolution (ODR) platform specifically engineered for Karnataka residential tenancy law. It transforms arbitrary deductions into objective legal math and guides parties to an enforceable settlement in minutes."*

---

## ⏱️ Step-by-Step 5-Minute Demo Walkthrough

### Step 1: The Landing Page (0:00 - 0:30)
1. **Show the screen**: Point to the landing page at `/`.
2. **What to say**:
   > *"Notice the clear 5-stage lifecycle: Intake, Evidence, Rule Engine, Negotiation, and Settlement.*
   > *To save your time today, we built a dedicated **One-Click Demo Mode**."*
3. **Action**: Click the vibrant **"🚀 RUN 5-MINUTE DEMO"** button.

---

### Step 2: The Dispute Dashboard & Compliance (0:30 - 1:15)
1. **Show the screen**: You are now in the Whitefield 2BHK scenario.
2. **What to highlight**:
   - **Deposit**: ₹2,00,000 (Notice the badge highlighting that legacy 6.6-month deposits exceed the modern 2-month cap under the Karnataka Rent Amendment Act, 2025).
   - **Landlord Claim**: ₹55,000 withheld across 5 categories.
   - **Progress Stepper**: We are currently progressing through Evidence & Evaluation.
3. **Action**: Click the **Role Switcher** at the top right from `Tenant` to `Landlord` and back to show the seamless dual-party experience.

---

### Step 3: Evidence Evaluation & Legal Transparency (1:15 - 2:00)
1. **Action**: Click **"Evidence Evaluation"** tab.
2. **What to show**:
   - Point out the side-by-side comparison table.
   - **Painting**: Landlord claimed ₹18,000. Tenant submitted move-out photos showing only minor marks. Show the **"✓ Statutory Rule"** badge referencing Transfer of Property Act Section 108(m) on *Normal Wear & Tear*.
   - **Fixtures (Water Geyser)**: Landlord claimed ₹25,000 for a 4-year-old geyser.
3. **What to say**:
   > *"Unlike black-box AI tools, our engine is completely deterministic and explainable. We distinguish statutory provisions from ODR policy rules so we never hallucinate legal certainty."*

---

### Step 4: The Explainable Rule Engine (2:00 - 2:45)
1. **Action**: Click **"Deduction Calculation"** tab.
2. **What to show**:
   - Total claimed: ₹55,000.
   - Total allowed: **₹24,000**.
   - Click **"Why this amount?"** on the Geyser claim:
     - Show the popup: Replacement cost ₹25,000, Age 4 years, Straight-line depreciation at 10% per year = 40% (₹10,000 deduction disallowed). Tenant only pays the ₹15,000 residual value!

---

### Step 5: The Negotiation Room & Gap Visualizer (2:45 - 3:45)
1. **Action**: Click **"Negotiation Room"** tab.
2. **What to highlight**:
   - Point to the **Gap Visualizer**:
     - Landlord bar: ₹48,000
     - Tenant bar: ₹15,000
     - System recommendation: ₹24,000
     - Initial Gap: **68.7%** (Status: *Further Negotiation Required*).
3. **Action**:
   - Submit Round 2 counteroffers: Landlord ₹32,000, Tenant ₹22,000 (Gap drops to 31%).
   - Submit Round 3 counteroffers: Landlord ₹25,000, Tenant ₹24,000.
   - Watch the Gap drop to **4.0%**!
4. **What to say**:
   > *"Because the gap is now 4%, which is under our configured 5% settlement threshold, the state machine automatically transitions from NEGOTIATION to SETTLEMENT_ELIGIBLE!"*
   > *(Note: If Round 3 ended with a gap > 5%, our backend strictly prevents Round 4 and triggers ESCALATE TO MEDIATOR.)*

---

### Step 6: Digital Consent & Generated Settlement PDF (3:45 - 4:30)
1. **Action**: Click **"Proceed to Settlement"**.
2. **What to show**:
   - Check the digital consent box as Tenant (Prasanth) -> live IST timestamp records.
   - Switch role to Landlord (Rahul) -> check consent -> live IST timestamp records.
   - Status changes to **SETTLED**!
3. **Action**: Click **"View Settlement PDF"**.
4. **What to show**:
   - The official **Rental Deposit Dispute Settlement Agreement** document.
   - Complete breakdown: Original claimed (₹55,000) vs Final agreed deduction (₹24,500) vs Net refund (₹1,75,500).
   - Digital signatures and legal disclaimer footer.
   - Click `Print / Save PDF`.

---

## 🎯 High-Probability Judge Questions & Winning Answers

| Question | Winning Answer |
| :--- | :--- |
| **"Is 10% annual depreciation actually in the Karnataka Rent Act?"** | *"No! That is an essential distinction we made during our legal research on India Code. The 10% rule is an ODR policy rule grounded in tort law non-betterment damages and accounting depreciation (Ind AS 16). We explicitly label it as an ODR Policy Rule, never a fake statute section."* |
| **"Why cap negotiation at 3 rounds?"** | *"Without hard limits, online disputes drag on indefinitely. 3 rounds encourage parties to converge near the system recommendation, while preventing deadlock. If consensus fails, it immediately escalates to a qualified human mediator."* |
| **"Is the digital signature legally valid?"** | *"It is a prototype digital consent under Section 10A of the IT Act. For the production roadmap, we plan to integrate Aadhaar e-Sign or DigiLocker for legally certified execution."* |
