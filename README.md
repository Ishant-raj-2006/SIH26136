# GoPilot-X BHARAT 🇮🇳
### Startup-Friendly Public Procurement Mechanism & Innovation Sandbox Platform
**Smart India Hackathon 2024 — Problem Statement SIH26136**

[![Framework](https://img.shields.io/badge/Frontend-Next.js%2014%20(Pages%20Router)-blue?style=flat-square&logo=next.js)](https://nextjs.org/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%7C%20Python%203.11-009688?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com/)
[![Typography](https://img.shields.io/badge/Typography-Inter%20(Sans)-black?style=flat-square)](https://fonts.google.com/specimen/Inter)
[![Statutory Compliance](https://img.shields.io/badge/Compliance-GFR%202017%20Rule%20194-059669?style=flat-square)](https://doe.gov.in/)
[![DPIIT Recognition](https://img.shields.io/badge/Statutory%20Waiver-DPIIT%20Startup%20India-d97706?style=flat-square)](https://www.startupindia.gov.in/)

---

## 📌 Executive Summary & The SIH26136 Mandate

Conventional government public procurement in India relies on rigid tender specifications and **L1 (lowest-cost) bidding** engineered for commodities like cement and stationery. This legacy architecture inherently discriminates against seed and growth deep-tech startups due to:
1. **Balance Sheet Disqualifications**: Mandatory 3+ year past financial turnover clauses.
2. **Prior Delivery Certifications**: Inflexible past government deployment requirements.
3. **Vendor-Biased Problem Specs**: Pre-describing technical implementation instead of desired outcome KPIs.
4. **IP Insecurity & Long Sales Cycles**: 12–18 month procurement lead times that exhaust young startup capital.

**GoPilot-X** bridges this systemic gap. It operationalizes a national outcome-based procurement sandbox where government ministries post target challenges, eligible DPIIT-recognized startups compete on technical merit without turnover barriers, test in controlled 30–90 day field sandboxes with ring-fenced escrow payments, and transition directly into sovereign commercial scale-up contracts under **General Financial Rules (GFR 2017) Rule 194** without re-tendering.

---

## 🌟 Core Differentiators & High-Impact Modules

### 1. 📜 Automated GFR 194 Scale-Up Certificate & GeM Contract Generator
* **Statutory Transition Instrument**: Under GFR 2017 Rule 194, when a startup proves technical efficacy during sandbox pilots, government departments are legally empowered to award direct procurement contracts without conventional L1 re-tendering.
* **Cryptographic Integrity**:
  * Immutably registers each pilot sign-off with a **SHA-256 verification hash**.
  * Dynamic scannable **NIC-standard QR code** embedding public proof parameters.
  * Pre-filled **GeM (Government e-Marketplace) Direct Purchase Requisition** justification note.
  * Native print/export stylesheet (`@media print`) rendering an authentic Republic of India Gazette certificate.

### 2. 🏛️ Live DPIIT Recognition & Statutory Turnover Waiver Engine
* **Instant Exemption Stamping**: Startups validate their `DIPPxxxxx` recognition certificate in real-time.
* **Automated Eligibility Checks**:
  * Entity age verification (< 10 years from incorporation).
  * Statutory turnover cap check (< ₹100 Crore).
  * Automatically issues a verified **"Turnover & Prior Experience Waived"** stamp across all proposals and profile bids.

### 3. 💸 Milestone Escrow Disbursal Workflow (PFMS Simulation)
* **Risk-Contained Capital Flow**: Solves delayed payments to startups by locking approved pilot grants in sovereign escrow.
* **Phased Milestone Gates**: Automated tranche tracking (25% Architecture Ingress ➡️ 35% Field Trials ➡️ 25% VAPT Audit ➡️ 15% Scale-Up Handover).
* **Officer PIN Authorization**: Department officers inspect field telemetry deliverables and digitally authorize disbursements using security PINs.
* **PFMS Treasury Integration**: Generates official Public Financial Management System transaction references (`PFMS-TXN-2026-XXXX`).

### 4. ⚖️ Double-Blind Multi-Criteria Technical Rubric
* **Bias-Free Screening**: Anonymizes startup identity and team background during initial technical evaluation.
* **100-Point Standardized Rubric**: Evaluates Technical Rigor (30 pts), Innovation & IP (25 pts), Operational Feasibility (25 pts), and Cost-Efficiency (20 pts).
* **TRL Readiness Mapping**: Verifies Technology Readiness Levels (TRL 1–9) with cryptographic audit logging.

### 5. 🛡️ Controlled Sandbox & IP Escrow Protection
* Automated Master Sandbox Agreement (MSA) protecting founder background and foreground patents.
* Department receives strictly non-exclusive evaluation rights for sandbox telemetry.

---

## 🏛️ Three Integrated Role Workspaces

| Workspace | Target Persona | Key Operational Capabilities |
| :--- | :--- | :--- |
| **🏛️ Department Portal** | Central/State Ministries, Public Sector Undertakings (PSUs) | Outcome RFP wizard, blind proposal shortlisting, real-time sandbox telemetry monitor, PFMS tranche release, GFR 194 scale-up certificate issuance. |
| **🚀 Startup Portal** | DPIIT-Recognized DeepTech Startups | Challenge discovery, DPIIT eligibility auto-stamping, proposal drafting with IP escrow, milestone proof submissions, PFMS payment tracker. |
| **⚖️ Evaluator Workspace** | Empaneled Technical Experts & IIT/IISc Council Members | Double-blind scoring panel, 4-axis interactive evaluation rubric, TRL readiness verification, composite ranking. |

---

## 💻 Technology Stack & Design System

### Frontend
- **Framework**: Next.js 14 (Pages Router)
- **UI & State**: React 18, Zustand state stores, Framer Motion animations
- **Styling**: TailwindCSS v3, Vanilla CSS design tokens
- **Typography**: **Inter** (weights 300–900) for crisp, authoritative institutional readability
- **Color Palette**: Sovereign Federal Blue (`#1e3a8a`), Forest Emerald (`#065f46`), Subtle National Amber (`#b45309`), and Architectural Neutral Slate (`#0f172a` / `#f8fafc`)
- **Icons & Data**: Lucide React, Recharts, React Hot Toast

### Backend
- **Framework**: FastAPI (Python 3.11)
- **ORM & Database**: SQLAlchemy / SQLModel (PostgreSQL / SQLite ready)
- **Authentication**: JWT (JSON Web Tokens) with passlib / bcrypt
- **Architecture**: Asynchronous RESTful API with automated Swagger UI (`/docs`)

---

## 🚀 Quick Start Guide

### Prerequisites
- **Node.js**: v18.0 or higher
- **Python**: v3.11 or higher
- **Package Managers**: `npm` and `pip`

---

### Step 1: Clone & Configure Repository
```bash
git clone https://github.com/your-username/GoPilot-X.git
cd GoPilot-X
```

### Step 2: Backend Setup
```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```
> The API server will be live at `http://127.0.0.1:8000`  
> Interactive Swagger API documentation: `http://127.0.0.1:8000/docs`

---

### Step 3: Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install

# Start Next.js development server
npm run dev
```
> The web application will be live at `http://localhost:3000`

---

## 🔑 Default Demonstration Credentials

Use these pre-seeded persona accounts to test end-to-end workflows:

| Role | Email Address | Password | Demonstration Focus |
| :--- | :--- | :--- | :--- |
| **🏛️ Department Officer** | `dept@example.com` | `password123` | Publish RFPs, authorize PFMS escrow tranches, issue GFR 194 certificate |
| **🚀 Startup Founder** | `startup@example.com` | `password123` | Validate DPIIT status, submit proposals, track milestone payments |
| **⚖️ Expert Evaluator** | `eval@example.com` | `password123` | Double-blind proposal scoring & TRL verification |
| **🛡️ System Administrator** | `admin@example.com` | `password123` | System oversight & user role governance |

> **Tip**: You can also use the **Quick Demo Switcher** in the sliding sign-in drawer on the home page (`http://localhost:3000`) for one-click instant access.

---

## 📁 Repository Directory Structure

```text
SIH26136/
├── backend/
│   ├── main.py                  # FastAPI entry point & API endpoints
│   ├── models.py                # Database models & schema definitions
│   ├── database.py              # Engine configuration & connection pooling
│   └── requirements.txt         # Python dependencies
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── AuthDrawer.tsx               # Right-sliding modern authentication drawer
│   │   │   ├── GFR194CertificateModal.tsx   # GFR 194 Scale-Up Certificate Generator (SHA-256 & QR)
│   │   │   ├── DpiitVerificationModal.tsx   # DPIIT turnover & experience waiver validator
│   │   │   ├── MilestoneEscrowModal.tsx     # Milestone escrow & PFMS disbursal workflow
│   │   │   ├── Navigation.tsx               # Header and role-based navigation bar
│   │   │   └── UI.tsx                       # Buttons, Cards, Inputs, and Badges
│   │   ├── pages/
│   │   │   ├── index.tsx                    # Landing page with interactive live HUD preview
│   │   │   ├── dashboard.tsx                # Role-specific analytics dashboard
│   │   │   ├── challenges/                  # RFP browsing & publishing wizard
│   │   │   ├── proposals/                   # Proposal management & DPIIT exemption tags
│   │   │   ├── pilots/                      # Sandbox pilot tracking & escrow manager
│   │   │   ├── evaluations/                 # Double-blind 100-pt scoring matrix
│   │   │   └── startups/profile.tsx         # Founder profile with DPIIT waiver engine
│   │   └── styles/
│   │       └── globals.css                  # Typography, theme tokens & smooth transitions
│   ├── tailwind.config.js                   # Extended typography & color palette
│   └── package.json                         # Frontend dependencies & scripts
└── README.md                                # Platform technical documentation
```

---

## 📜 Statutory Legal Frameworks & References

1. **General Financial Rules (GFR 2017) — Rule 194**: Governs the procurement of innovative non-consulting solutions, permitting direct commercial scale-up without conventional L1 re-tendering once technical milestones are validated.
2. **DPIIT Notification No. 5(4)/2016-BE-I**: Waives past turnover and prior experience criteria for DPIIT-recognized startups in all central government procurements.
3. **Manual for Procurement of Goods (Ministry of Finance)**: Guidelines for outcome-oriented problem formulation and risk-contained departmental sandbox piloting.
4. **GeM Special Procurement Provision (Section 14.1)**: Framework for custom bid creation and direct award under verified pilot outcome certifications.

---

## 👥 Team & Hackathon Attributions

* **Problem Statement**: SIH26136 — Startup-Friendly Public Procurement Mechanism
* **Platform Name**: **GoPilot-X BHARAT**
* **Target Audience**: Central/State Ministries, DPIIT Startups, Evaluation Committees, GeM Procurement Officers
* **Developed For**: Smart India Hackathon (SIH) 2024
Hello
---
*Dedicated to building transparent, agile, and merit-driven digital public infrastructure for Bharat's deep-tech innovators.*


cd backend
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
cp .env.example .env
python seed_users.py
uvicorn main:app --reload --host 0.0.0.0 --port 8000


