"use client";

// import { cn } from "@/lib/utils"

interface StakeInputProps {
  stake: number;
  setStake: (value: number) => void;
  balance: number;
  disabled: boolean;
}

const QUICK_AMOUNTS = [5, 10, 25, 50, 100];

export function StakeInput({
  stake,
  setStake,
  balance,
  disabled,
}: StakeInputProps) {
  return (
    <div className="flex flex-col gap-3">
      <label
        htmlFor="stake-input"
        className="text-sm font-medium text-muted-foreground text-[#74899d]"
      >
        Stake Amount
      </label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-sm text-muted-foreground">
          $
        </span>
        <input
          id="stake-input"
          type="number"
          min={1}
          max={balance}
          step={1}
          value={stake}
          onChange={(e) => {
            const val = Math.max(0, Number(e.target.value));
            setStake(Math.min(val, balance));
          }}
          disabled={disabled}
          className="h-11 w-full rounded-lg border border-[#25262f] bg-[#25262f] pl-7 pr-3 font-mono text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
      </div>
      <div className="flex flex-wrap gap-2">
        {QUICK_AMOUNTS.map((amount) => (
          <button
            key={amount}
            onClick={() => setStake(Math.min(amount, balance))}
            disabled={disabled || amount > balance}
            className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all
              hover:bg-secondary hover:text-foreground
              disabled:cursor-not-allowed disabled:opacity-30
              ${
                stake === amount
                  ? "border-[#feb808] bg-[#2b2514] text-[#feb808]"
                  : "border-[#25262f] bg-[#25262f] text-muted-foreground"
              }`}
          >
            ${amount}
          </button>
        ))}
        <button
          onClick={() => setStake(balance)}
          disabled={disabled || balance <= 0}
          className={`rounded-lg border px-3 py-1.5 font-mono text-xs font-medium transition-all
            hover:bg-secondary hover:text-foreground
            disabled:cursor-not-allowed disabled:opacity-30
            ${
              stake === balance && balance > 0
                ? "border-[#feb808] bg-[#2b2514] text-[#feb808]"
                : "border-[#25262f] bg-[#25262f] text-muted-foreground"
          }`}
        >
          All In
        </button>
      </div>
    </div>
  );
}
