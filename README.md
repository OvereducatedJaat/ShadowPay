# ShadowPay: The Encrypted Payroll & Compliance Engine

ShadowPay is a privacy-native protocol built to solve the "Transparency Trap" of on-chain payroll. Utilizing **Fully Homomorphic Encryption (FHE)** via the Fhenix ecosystem and compliant financial primitives from Privara, ShadowPay allows organizations to execute complex payroll logic—including tax withholding, bonuses, and benefits—on encrypted data. 

With ShadowPay, salaries remain confidential while the movement of funds remains fully verifiable and compliant with global financial regulations.

---

## ⚠️ The Problem
On public blockchains, transparency is the default. This creates three critical blockers for institutional adoption:
1. **Privacy Leaks:** Every employee's salary and every company’s burn rate is visible to the public.
2. **Regulatory Deadlock:** Compliance with GDPR and CCPA is impossible when sensitive HR data is stored on a transparent ledger.
3. **MEV Risk:** Publicly visible payment flows can be targeted by front-runners and metadata harvesters.

## ✅ The Solution
ShadowPay introduces **Privacy-by-Design** by performing computation directly on ciphertexts. 
* **Encrypted State:** Salaries are stored as `euint` types, visible only to the owner and authorized parties.
* **Shielded Deductions:** The protocol calculates tax percentages and insurance deductions without ever "unsealing" the raw gross salary.
* **Selective Disclosure:** Organizations can grant temporary "View Permits" to auditors or tax authorities, maintaining privacy while ensuring compliance.

---

## 🛠️ Technical Architecture

### Core Stack
- **Encrypted Compute:** [Fhenix](https://fhenix.io) (CoFHE) for encrypted smart contract logic.
- **Compliance Layer:** [Privara](https://reineira.xyz) for audited settlement rails and programmable transfers.
- **Identity:** ERC-4337 (Account Abstraction) for gasless, seedless employee onboarding.
- **Client-Side:** `@cofhe/sdk` for local encryption/decryption and permit generation.

### The Logic Cycle
1. **Encryption:** The Employer encrypts the payroll data locally using the Fhenix SDK.
2. **Encrypted Execution:** The Fhenix smart contract processes the payroll, splitting the encrypted total into `Net Pay` and `Tax Withholding`.
3. **Settlement:** Privara-powered rails move the funds to the respective shielded vaults or public tax repositories.
4. **Decryption:** Employees use their unique private keys/permits to view and claim their own earnings.

---

## 🚀 Roadmap

### Wave 1: The Core Privacy Engine (MVP)
- Implementation of the `ShadowSplit` contract for encrypted tax logic.
- Basic CLI for employer payroll submission.
- Integration of `euint64` arithmetic for secure salary scaling.

### Wave 2: Compliance & Productization
- Integration with Privara for compliant stablecoin settlement.
- Implementation of Account Abstraction (Passkeys) for gasless UX.
- Shielded Treasury checks (Verify solvency without revealing balance).

### Wave 3: The Institutional Suite
- Auditor Access Portals (Selective Disclosure).
- Encrypted Paystub dashboard for employees.
- Batch processing logic for enterprise-scale payroll cycles.

---

## 🏗️ Getting Started

### Prerequisites
- Node.js v18+
- Docker (for LocalFhenix)
- pnpm

### Installation
```bash
git clone [https://github.com/your-username/shadowpay.git](https://github.com/your-username/shadowpay.git)
cd shadowpay
pnpm install
