# 🎨 HueFi: Decentralized Color Prediction on Starknet

[![Starknet](https://img.shields.io/badge/Network-Starknet-orange.svg)](https://starknet.io)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**HueFi** is a high-performance, decentralized color prediction arcade built on **Starknet**. It combines the thrill of fast-paced arcade gaming with the transparency of blockchain technology, allowing players to stake STRK tokens and win rewards in a trustless environment.

---

## 🚀 Overview

HueFi is designed for the modern Web3 gamer. Players pick a color, set their stake, and watch as the blockchain determines the outcome. Powered by Cairo smart contracts, every round is provably fair, and payouts are handled automatically with zero intermediary risk.

### Key Pillars:

- **Provably Fair:** Outcomes are determined on-chain using deterministic randomness.
- **Trustless Payouts:** Winners receive 2x rewards instantly via smart contract automation.
- **Ultra-Low Fees:** Leverages Starknet's ZK-Rollup technology for lightning-fast and cheap transactions.
- **Professional UX:** A sleek, dark-mode interface designed for high-stakes engagement.

---

## 🎮 How to Play

1. **Connect:** Securely link your Starknet wallet (Argent X or Braavos).
2. **Select:** Choose your lucky color (Red, Blue, Green, or Yellow).
3. **Stake:** Enter the amount of **STRK** you want to play.
4. **Predict:** Hit "Place Bet" and wait for the countdown.
5. **Win:** If the generated color matches your choice, collect **2x your stake** instantly!

---

## 🛠️ Technology Stack

| Component              | Technology                        |
| ---------------------- | --------------------------------- |
| **Smart Contracts**    | Cairo 1.0                         |
| **Blockchain**         | Starknet (Layer 2)                |
| **Frontend**           | Next.js 14, React, Tailwind CSS   |
| **Wallet Integration** | @starknet-react/core, Starknet.js |
| **Icons & UI**         | Lucide React, Framer Motion       |

---

## 🏗️ Project Structure

```bash
HueFi/
├── contract/       # Cairo smart contracts & deployment scripts
└── frontend/       # Next.js web application
```

---

## 🏁 Quick Start

### 1. Prerequisites

- Node.js v18+
- A Starknet wallet (Argent X or Braavos)

### 2. Run Locally

```bash
# Clone the repository
git clone https://github.com/Pero4l/HueFi.git
cd HueFi/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔒 Security & Privacy

HueFi is committed to user security, data sovereignty, and protocol integrity:

- **Zero-Knowledge Privacy:** We do not collect or store personal identifiable information (PII). No Gmail, phone number, or KYC is required. User identity is managed exclusively through decentralized wallet authentication.
- **Non-Custodial Architecture:** Users maintain absolute control over their assets. HueFi never takes custody of your funds; all interactions occur directly with the smart contracts.
- **On-Chain Transparency:** Every game round, payout, and contract state transition is logged on-chain, ensuring a fully auditable and provably fair ecosystem.
- **Protocol Solvency:** The smart contracts are engineered with built-in safeguards to guarantee reward distribution for all valid winning predictions.

---

## 👨‍💻 Authors

- **Peter Idiku**
- **Promise Obi**

---

## 📄 License

This project is licensed under the **MIT License**. See the [LICENSE](LICENSE) file for more details.

---
