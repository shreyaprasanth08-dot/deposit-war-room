# The Deposit War Room ⚖️🏢

> **Online Dispute Resolution (ODR) Platform for Residential Tenancy Deposit Disputes in Karnataka**  
> *"Resolve rental deposit disputes before they become court disputes."*

---

## 🌟 Welcome, Beginner Developer!

If you are a first-year student or beginner coder, **do not worry!** This guide was written specifically for you. It explains every single step from opening your terminal to deploying your project live on the internet so hackathon judges can test it.

---

## 🚀 Quick Summary: What is This Project?

In Bengaluru, security deposits can be huge (often ₹2 to ₹3 Lakhs). When moving out, landlords and tenants frequently fight over deductions for painting, geysers, cleaning, and utility bills.

**The Deposit War Room** helps both parties resolve their dispute in **under 5 minutes** without lawyers:
1. **Intake**: Collects claims and rebuttals without complicated forms.
2. **Evidence**: Evaluates photos, bills, and condition tags.
3. **Rule Engine**: Applies the **Karnataka Rent Act** and **Transfer of Property Act** (e.g., normal wear & tear cannot be billed to tenants, and 4-year-old fixtures receive 40% straight-line depreciation).
4. **Negotiation Room**: Allows up to 3 structured counteroffers with a visual **Gap Visualizer**.
5. **Settlement**: When the gap is $\le 5\%$, unlocks prototype digital consent and generates a signed **Settlement Agreement PDF**.

---

## 💻 Part 1: How to Run Locally on Your Computer

### STEP 1 — What is a Terminal?
On Windows:
1. Press the **Windows Key** on your keyboard.
2. Type `PowerShell` and press **Enter**.
3. A blue or black window will open. This is your **terminal** (where you type commands).

Navigate to the project folder by typing:
```powershell
cd C:\Users\alkha\.gemini\antigravity\scratch\deposit-war-room
```

---

### STEP 2 — Verify Node.js and Git
Node.js and Git are already configured on your machine! You can verify them anytime by running:
```powershell
node -v
npm -v
git --version
```
You should see:
- Node: `v20.18.0` (or higher)
- NPM: `10.8.2` (or higher)
- Git: `2.46.2` (or higher)

---

### STEP 3 — Run Automated Tests
Before starting the website, verify the legal calculation engine and 3-round state machine by running:
```powershell
npm test
```
*(Or `node --test tests/test-suite.mjs`)*  
You will see **14 passing tests** confirming:
- Painting wear-and-tear exemption (TPA Sec 108(m))
- 10% annual straight-line fixture depreciation
- Utility and rent statutory validations
- 5% settlement eligibility threshold
- Strict blocking of Round 4 counteroffers
- Automatic escalation to mediator review

---

### STEP 4 — Install Dependencies
Type this command in your terminal and press **Enter**:
```powershell
npm install
```
*What this does:* It downloads the small libraries (like Next.js, Tailwind CSS, and Lucide icons) listed in `package.json`. It will take around 15–30 seconds.

---

### STEP 5 — (Optional) Configure Supabase Cloud Database

> [!NOTE]
> **Hackathon Zero-Friction Feature:** You do NOT need Supabase to run your demo! The application includes a built-in instant local demo store so the entire 5-minute pitch works right out of the box.

If you want to connect a live Supabase database:
1. Go to [https://supabase.com](https://supabase.com) and click **Start your project** (Free).
2. Name your project `deposit-war-room` and choose Region **Singapore** or **Mumbai**.
3. In the left sidebar, click the **SQL Editor** icon (`>_`).
4. Open the file `/supabase/migrations/20260911_initial_schema.sql` in this project, copy everything, paste it into the Supabase SQL Editor, and click **Run**.
5. Copy the file `.env.example` to `.env.local`:
   ```powershell
   copy .env.example .env.local
   ```
6. In Supabase, go to **Project Settings** (gear icon) -> **API**. Copy:
   - `Project URL` -> Paste into `NEXT_PUBLIC_SUPABASE_URL`
   - `anon public key` -> Paste into `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

### STEP 6 — Start the Development Server
In your terminal, run:
```powershell
npm run dev
```

---

### STEP 7 — Open in Your Browser
Open your browser (Chrome, Edge, Brave) and visit:
👉 **[http://localhost:3000](http://localhost:3000)**

You will see **THE DEPOSIT WAR ROOM** live on your screen!

---

## ⏱️ How to Run the 5-Minute Hackathon Demo

1. On the landing page, click **"🚀 RUN 5-MINUTE DEMO"**.
2. **Dispute Dashboard**: Observe the ₹2,00,000 deposit and the badge noting Bengaluru's 6.6x deposit versus the modern 2-month statutory cap under the Karnataka Rent (Amendment) Act 2025.
3. Switch role from **Tenant** to **Landlord** using the top banner.
4. Go to **Evidence Evaluation**: Point out the Transfer of Property Act Section 108(m) badge exempting normal wear and tear on painting.
5. Go to **Deduction Calculation**: Click **"Why this amount?"** on the geyser fixture to show the 10% annual depreciation formula (4 years = 40% reduction).
6. Go to **Negotiation Room**: Point to the **Gap Visualizer**.
   - Make a counteroffer to bring the gap under 5%.
   - Notice the system transitions to **SETTLEMENT_ELIGIBLE**!
7. Go to **Settlement**: Record digital consent for Tenant (Prasanth) and Landlord (Rahul).
8. Click **View Settlement PDF**: See the formal, signed settlement document and click **Print / Save as PDF**.

---

## 🌐 Part 2: Deploying to Vercel (Online URL for Judges)

Deploying makes your website accessible to judges anywhere on their phones or laptops (e.g. `https://deposit-war-room.vercel.app`).

### Step 1: Initialize Git Repository
In your terminal, run:
```powershell
git init
git add .
git commit -m "feat: complete Deposit War Room ODR prototype"
```

### Step 2: Push to GitHub
1. Go to [https://github.com](https://github.com) and log in.
2. Click the **"+"** button at the top right -> **New repository**.
3. Repository name: `deposit-war-room`.
4. Keep it **Public** and click **Create repository**.
5. Copy the 3 lines GitHub gives you and paste them into your PowerShell terminal:
   ```powershell
   git branch -M main
   git remote add origin https://github.com/YOUR-USERNAME/deposit-war-room.git
   git push -u origin main
   ```

### Step 3: Deploy on Vercel
1. Go to [https://vercel.com](https://vercel.com) and click **Sign Up** (or Log in with GitHub).
2. Click **"Add New..."** -> **Project**.
3. You will see `deposit-war-room` from your GitHub account. Click **Import**.
4. Framework Preset: Next.js (automatically detected).
5. Click **Deploy**.
6. Wait 60 seconds. You will see fireworks and a link like:
   👉 `https://deposit-war-room-xyz.vercel.app`
7. Send this link to judges!

---

## 📁 Repository Structure

```
├── app/
│   ├── layout.tsx                     # App shell with banner, header & footer
│   ├── page.tsx                       # Landing page with 5-stage lifecycle
│   └── dispute/[id]/
│       ├── page.tsx                   # Dispute Dashboard & Gap Visualizer
│       ├── tenant/page.tsx            # Tenant intake & structured rebuttal
│       ├── landlord/page.tsx          # Landlord claims intake
│       ├── evidence/page.tsx          # Evidence matrix with wear-and-tear toggles
│       ├── evaluation/page.tsx        # Deduction calculation & legal basis
│       ├── negotiate/page.tsx         # Negotiation room (3 rounds ceiling)
│       ├── settle/page.tsx            # Digital consent screen
│       └── settle/pdf/page.tsx        # Printable legal agreement PDF
├── components/
│   ├── demo/DemoBanner.tsx            # One-click 5-minute demo & role toggler
│   ├── dispute/GapVisualizer.tsx      # Bar visualization comparing positions
│   ├── dispute/ProgressStepper.tsx    # 6-step lifecycle tracker
│   ├── dispute/WhyThisDeductionModal.tsx # Transparent math & legal rationale modal
│   └── layout/Header.tsx & Footer.tsx
├── lib/
│   ├── config/odr-policy.ts           # Configurable depreciation & thresholds
│   ├── rules/                         # Explainable rule engine (painting, fixtures, etc.)
│   ├── state-machine/                 # State transitions, invariants, round limits
│   ├── mock-data/scenarios.ts         # 3 complete scenarios (Whitefield, Indiranagar, Koramangala)
│   └── store/dispute-store.ts         # Dual-mode local/cloud storage engine
├── supabase/
│   ├── migrations/20260911_initial_schema.sql
│   └── seed.sql
├── docs/
│   ├── legal-research.md              # Exhaustive Karnataka Rent Act analysis
│   ├── architecture.md                # Simple architecture explanation
│   ├── database.md                    # Database guide
│   ├── state-machine.md               # State machine diagram & rules
│   └── demo-script.md                 # 5-minute pitch script
└── tests/
    └── test-suite.mjs                 # 14 automated tests for rules & state machine
```

---

## ⚖️ Legal Classification Summary

| Claim Category | Legal Authority | Classification |
| :--- | :--- | :--- |
| **Unpaid Rent** | Karnataka Rent Act, 1999 Sec 27(2)(a) | ✓ **Statutory Rule** |
| **Utility Bills** | Karnataka Rent Act, 1999 Sec 13 & TPA Sec 108(b) | ✓ **Statutory Rule** |
| **Normal Wear & Tear** | Transfer of Property Act, 1882 Sec 108(m) | ✓ **Statutory Rule** |
| **2-Month Deposit Cap** | Karnataka Rent (Amendment) Act, 2025 | ✓ **Statutory Rule** |
| **10% Fixture Depreciation** | Tort Non-Betterment & Ind AS 16 | ℹ️ **ODR Policy Rule** |
| **Cleaning Standard Cap** | Handover Covenants & Standard Allowance | ℹ️ **ODR Policy Rule** |
| **1-Month Notice Period** | Lease Contract / TPA Sec 106 baseline | ℹ️ **ODR Policy Rule** |
| **5% Settlement Threshold** | Algorithmic Consensus Trigger | ⚡ **Demo Assumption** |
| **Max 3 Negotiation Rounds** | Dispute Escalation Protocol | ⚡ **Demo Assumption** |
| **Digital Consent Checkbox** | IT Act 2000 Section 10A Acknowledgement | ⚡ **Demo Assumption** |

---

*Built with pride for the Karnataka Residential Tenancy Online Dispute Resolution Hackathon.*
