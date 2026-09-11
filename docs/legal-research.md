# Legal Research & Rule Mapping: Karnataka Residential Tenancy Law

**Project:** The Deposit War Room (Online Dispute Resolution Prototype)  
**Jurisdiction:** Karnataka, India (Focus: Bengaluru Metropolitan Area)  
**Primary Authorities:**  
- *The Karnataka Rent Act, 1999* (Karnataka Act No. 34 of 2001) & *Karnataka Rent (Amendment) Act, 2025* (enacted Jan 8, 2026)  
- *The Transfer of Property Act, 1882* (Central Act IV of 1882)  
- *The Indian Contract Act, 1872*  
- Official India Code Repository: [https://www.indiacode.nic.in/](https://www.indiacode.nic.in/)

---

## 1. Statutory Reality vs. Market Myth

In Bangalore's residential rental market, landlords frequently assert practices such as *"mandatory 1-month deduction for painting"*, *"automatic forfeiture of deposit for early termination"*, or *"deducting brand-new fixture costs"*. 

As an Online Dispute Resolution (ODR) platform built for credibility and fairness, **The Deposit War Room strictly distinguishes between three classes of rules**:

1. **Category A: Directly Supported by Statute** (Explicitly written in legislation or binding case law).
2. **Category B: Reasonable ODR Policy / Business Rule** (Rooted in valuation principles, contract law, or standard accounting practices; configurable and clearly labeled).
3. **Category C: Hackathon Prototype Assumption** (Algorithmic dispute resolution mechanisms, such as round limits and settlement threshold percentages).

> [!IMPORTANT]
> **Anti-Hallucination Mandate:** The rule engine will NEVER label a market custom or prototype heuristic as a "Karnataka Rent Act Section" unless an exact statutory section exists.

---

## 2. Category-by-Category Legal Analysis

### 2.1 Unpaid Rent (Arrears)
- **Rule:** The landlord is legally entitled to deduct accrued and unpaid rent for the duration of the tenant's actual lawful possession.
- **Source:** *Karnataka Rent Act, 1999*, Section 27(2)(a) (non-payment of rent) and *Indian Contract Act, 1872*, Section 73.
- **Classification:** **A. Directly Supported by Statute**
- **Short Explanation:** Rent is the fundamental consideration of a lease. Arrears evidenced by bank statements, rent ledgers, or rent receipts are statutory grounds for claim and deduction.
- **Application Implementation:**
  - Function: `calculateUnpaidRentDeduction()`
  - Claimed amount is validated against rental tenure dates and ledger records. If proof is verified, 100% of unpaid rent is allowed as a deduction.

---

### 2.2 Utility Deductions (Electricity, Water, Maintenance)
- **Rule:** Unpaid utility charges (BESCOM, BWSSB, piped gas, society maintenance) incurred during tenancy are deductible up to the exact invoiced meter amount.
- **Source:** *Karnataka Rent Act, 1999*, Section 13 (cutting off or withholding essential services) & Contractual covenants under Section 108(b) of *Transfer of Property Act, 1882*.
- **Classification:** **A. Directly Supported by Statute & Contract**
- **Short Explanation:** The tenant is legally obligated to discharge consumable utility liabilities for their duration of occupancy. Landlords cannot apply lump-sum or inflated penalties without official utility bills.
- **Application Implementation:**
  - Function: `calculateUtilityDeduction()`
  - System requires billing dates to match tenant occupancy. Deduction is capped strictly at the verified utility bill/receipt amount.

---

### 2.3 Normal Wear and Tear Doctrine
- **Rule:** A tenant is obligated to return the premises in as good condition as received, **"reasonable wear and tear excepted"**. Landlords cannot charge tenants for normal aging, paint fading, or standard weathering.
- **Source:** *Transfer of Property Act, 1882*, Section 108(m) (*"...to keep, and on the termination of the lease to restore, the property in as good condition as it was in at the time when he was put in possession, subject only to the changes caused by reasonable wear and tear or irresistible force..."*).
- **Classification:** **A. Directly Supported by Statute**
- **Short Explanation:** Living in a house naturally degrades paint, caulking, and switch plates over time. Landlords factor capital upkeep into rent. Charging the tenant for standard aging constitutes unjust enrichment.
- **Application Implementation:**
  - Evaluators can flag evidence as `NORMAL_WEAR_AND_TEAR`.
  - When marked as normal wear and tear, the rule engine automatically zeros out the damage deduction (`Allowed = ₹0`).

---

### 2.4 Security Deposit Cap (2 Months)
- **Rule:** The residential security deposit is capped at a maximum of **2 months' rent**.
- **Source:** *Karnataka Rent (Amendment) Act, 2025* (enacted into law on January 8, 2026, aligning state law with the Model Tenancy Act).
- **Classification:** **A. Directly Supported by Statute**
- **Short Explanation:** Historically, Bangalore landlords demanded 6 to 10 months of deposit. The modern statutory amendment restricts residential deposits to 2 months.
- **Application Implementation:**
  - Displayed prominently as a statutory compliance indicator on the Dispute Dashboard.
  - If a legacy agreement had 6+ months deposit, the system notes: *"Legacy deposit: ₹2,00,000 (Exceeds current 2-month statutory cap under Karnataka Rent Amendment Act, 2025; dispute governed by contractual deposit held)."*

---

### 2.5 Fixture Damage & 10% Annual Depreciation
- **Rule:** When a fixture (e.g., geyser, fan, kitchen chimney, sanitary fitting) is damaged beyond repair, the landlord cannot claim the full cost of a brand-new replacement. Depreciation must be applied based on the fixture's age, allowing only the remaining residual value.
- **Source:** 
  - *Tort Law Principle of Non-Betterment* (*Harbutt's Plasticine v Wayne Tank* doctrine in Indian common law damages).
  - *Indian Accounting Standard (Ind AS 16)* & *Income Tax Act, 1961* (Schedule XIV straight-line depreciation principles).
  - **NOT** an explicit section in the Karnataka Rent Act.
- **Classification:** **B. Reasonable ODR Policy / Business Rule**
- **Short Explanation:** If a 4-year-old water geyser (expected life: 10 years) is damaged by the tenant, the landlord was already enjoying an asset that depreciated by 40%. Awarding 100% of a brand-new geyser would give the landlord a "betterment" windfall at the tenant's expense.
- **Application Implementation:**
  - Configurable policy parameter: `fixtureDepreciationRate = 0.10` (10% per year, straight-line).
  - Formula:
    $$\text{Depreciation \%} = \min(\text{Age} \times 10\%, 100\%)$$
    $$\text{Allowed Deduction} = \text{Replacement Cost} \times (1 - \text{Depreciation \%})$$
  - Example: Geyser replacement cost = ₹25,000; Age = 4 years; Depreciation = 40% (₹10,000); Allowed deduction = ₹15,000; Rejected = ₹10,000.

---

### 2.6 Painting Deductions
- **Rule:** The conventional Bengaluru clause deducting "one month's rent for painting" is a customary contract clause, not a statutory requirement. It cannot be deducted automatically unless genuine damage beyond normal wear & tear is substantiated with an invoice.
- **Source:** Bengaluru rental practice / Contract law; subject to Section 108(m) TPA. No statutory section exists in the Karnataka Rent Act.
- **Classification:** **B. Reasonable ODR Policy / Business Rule**
- **Short Explanation:** Landlords routinely deduct ₹20,000–₹40,000 on autopilot upon move-out. Under ODR policy, painting is disallowed if the walls only show normal wear & tear (e.g., standard furniture shadows, dust). It is only allowed if deliberate marks, structural nail holes, or water damage caused by negligence exist, and must be backed by a GST tax invoice.
- **Application Implementation:**
  - Function: `calculatePaintingDeduction()`
  - If tenant stayed $\ge 2$ years and damage is `NORMAL_WEAR_AND_TEAR`: Allowed = ₹0.
  - If damage is `EXCESSIVE_DAMAGE` and invoice is provided: Allowed up to verified invoice (or prorated).

---

### 2.7 Cleaning Deductions
- **Rule:** Deep cleaning deductions are only valid if the premises were surrendered in an abnormally filthy or unsanitary state, verified by move-out photos and supported by an official cleaning service invoice.
- **Source:** Tenancy agreement covenants; *Indian Contract Act, 1872*, Section 73.
- **Classification:** **B. Reasonable ODR Policy / Business Rule**
- **Short Explanation:** Ordinary dust that settles between move-out and inspection is the landlord's turnaround responsibility. Deep cleaning cannot be billed arbitrarily without proof of abnormal mess.
- **Application Implementation:**
  - Function: `calculateCleaningDeduction()`
  - Deduction allowed only if move-out condition is `UNSANITARY` and tax invoice is attached. Capped at `maxCleaningDeduction` (default ₹5,000).

---

### 2.8 Notice Period (1-Month Rule)
- **Rule:** Deduction of rent in lieu of notice is permissible only if the tenant vacated without serving the contractually agreed notice (typically 30 days in Bengaluru) and the landlord suffered actual vacancy loss.
- **Source:** *Transfer of Property Act, 1882*, Section 106 (statutory baseline 15 days for monthly lease; overridden by 30-day lease contract).
- **Classification:** **B. Reasonable ODR Policy / Business Rule**
- **Short Explanation:** If a tenant gives 10 days notice instead of 30 days, the landlord may deduct up to 20 days rent, provided the flat was not immediately re-occupied by another tenant.
- **Application Implementation:**
  - Configurable policy parameter: `standardNoticePeriodDays = 30`.

---

### 2.9 Algorithmic Settlement Threshold (Gap $\le$ 5%)
- **Rule:** When the difference between the landlord's counteroffer and the tenant's counteroffer reaches 5% or less of the larger offer, the dispute enters `SETTLEMENT_ELIGIBLE`.
- **Source:** Online Dispute Resolution (ODR) heuristic design; automated consensus building.
- **Classification:** **C. Hackathon Assumption Requiring Legal Validation**
- **Application Implementation:**
  - Formula:
    $$\text{Gap \%} = \frac{|\text{Landlord Amount} - \text{Tenant Amount}|}{\max(\text{Landlord Amount}, \text{Tenant Amount})} \times 100$$
  - If $\text{Gap \%} \le 5\%$, the system unlocks the Digital Consent & Settlement module.

---

### 2.10 Maximum 3 Negotiation Rounds
- **Rule:** Parties are allowed a maximum of 3 structured counteroffer rounds. If no consensus is reached after Round 3, the platform transitions to `MEDIATOR_REVIEW`.
- **Source:** ODR efficiency standard to prevent endless cycling and deadlock.
- **Classification:** **C. Hackathon Assumption Requiring Legal Validation**
- **Application Implementation:**
  - Enforced server-side and in state machine. Submitting round 4 is blocked.

---

### 2.11 Prototype Digital Consent
- **Rule:** Both parties record consent via a digital confirmation checkbox, timestamp, and IP/session ID.
- **Source:** Prototype user agreement; acknowledged under *Information Technology Act, 2000*, Section 10A (validity of contracts formed through electronic means).
- **Classification:** **C. Hackathon Assumption Requiring Legal Validation**
- **Application Implementation:**
  - Stamped with IST timestamp, dispute ID, and user name.
  - Explicit disclaimer added: *"Prototype Digital Consent (Demonstration only; not an Aadhaar e-Sign or Section 10A certified electronic signature)."*

---

## 3. Summary Matrix for UI Presentation

In the UI, every deduction card displays one of these three badges:

| UI Badge | Visual Style | Meaning |
| :--- | :--- | :--- |
| `✓ Statutory Rule` | Green border & pill | Grounded in Karnataka Rent Act, 1999 or TPA 1882 |
| `ℹ️ ODR Policy Rule` | Blue border & pill | Grounded in standard valuation/accounting/contract principles |
| `⚡ Demo Assumption` | Purple border & pill | Algorithmic parameter for hackathon dispute flow |
