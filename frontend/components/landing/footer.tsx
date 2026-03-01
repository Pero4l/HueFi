import {Facebook} from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-[#05060a]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-6 text-xs text-white/60 sm:flex-row sm:items-center sm:justify-between">
        {/* Left: Logo + links */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-10">
          {/* Logo */}
          <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-[#111319]">
            <svg width="28" height="28" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <rect x="2" y="2" width="7" height="7" rx="2" fill="hsl(0 85% 55%)" />
              <rect x="11" y="2" width="7" height="7" rx="2" fill="hsl(217 91% 55%)" />
              <rect x="2" y="11" width="7" height="7" rx="2" fill="hsl(142 72% 45%)" />
              <rect x="11" y="11" width="7" height="7" rx="2" fill="hsl(47 100% 50%)" />
            </svg>
          </div>
          <span className="text-lg font-semibold tracking-tight">ColorStack</span>
        </div>

          {/* Links */}
          <div className="flex items-center gap-6 text-[11px]">
            <button className="transition hover:text-white">Terms</button>
            <button className="transition hover:text-white">Privacy</button>
            <button className="transition hover:text-white">Docs</button>
            <button className="transition hover:text-white">FAQ</button>
          </div>
        </div>

        {/* Right: Social icons (placeholders) */}
        <div className="flex items-center gap-3">
          {/* {[{id:1,icons: <Facebook/>, link: "https://facebook.com"}, "X", "D", "G"].map((icon) => (
            <button
              key={icon.id || icon}
              className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              {icon.icons || icon}
            </button>
          ))} */}

          <Link href="https://twitter.com" className="flex h-8 w-8 items-center justify-center rounded-xl bg-white/5 text-[11px] text-white/60 transition hover:bg-white/10 hover:text-white">
        </div>
      </div>

      {/* Bottom line */}
      <div className="border-t border-white/5">
        <div className="mx-auto flex max-w-6xl items-center justify-center px-4 py-4 text-[11px] text-white/50">
          © {new Date().getFullYear()} ColorStake. All rights reserved. Play responsibly.
        </div>
      </div>
    </footer>
  )
}