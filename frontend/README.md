# 🌐 HueFi Frontend

This is the high-performance web interface for **HueFi**, the decentralized color prediction game built on Starknet.

## ✨ Features

- **Real-Time Integration:** Direct connection to Starknet Mainnet & Sepolia via `@starknet-react`.
- **Responsive Design:** Optimized for mobile, tablet, and desktop play.
- **Dynamic Animations:** Smooth transitions using Framer Motion and custom CSS micro-animations.
- **Wallet Support:** Native support for Argent X and Braavos.
- **Demo Mode:** Interactive onboarding for users to try the game without real funds.

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Blockchain Hooks:** [@starknet-react/core](https://starknet-react.com/)
- **State Management:** Custom React Hooks for game logic
- **Icons:** [Lucide React](https://lucide.dev/)

## 🚀 Getting Started

### 📦 Installation

```bash
cd frontend
npm install
```

### 🏃‍♂️ Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application in action.

## 📝 Configuration

### Environment Variables

Create a `.env.local` file in the root of the `frontend` directory:

```env
NEXT_PUBLIC_STRK_TOKEN_ADDRESS=0x04718f5a0fc34cc1af16a1cdee98ffb20c31f5cd61d6ab07201858f4287c938d
NEXT_PUBLIC_CONTRACT_ADDRESS=your_contract_address_here
```

## 🏗️ Deployment

The easiest way to deploy the HueFi frontend is via **Vercel**:

1. Push your code to GitHub.
2. Connect your repo to [Vercel](https://vercel.com).
3. Set your environment variables and hit deploy!

---

Part of the **HueFi** ecosystem.
