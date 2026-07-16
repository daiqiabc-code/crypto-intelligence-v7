"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { useMarketData } from "@/lib/useMarketData";
import ThemeToggle from "@/components/ThemeToggle";

const tickerSymbols = ["BTC", "ETH", "SOL"];

// Fallback for non-crypto tickers (static mock data)
const staticTickers: Record<string, { price: string; change: string; isUp: boolean }> = {
  NVDA: { price: "892.45", change: "+3.21%", isUp: true },
  QQQ: { price: "478.12", change: "+0.89%", isUp: true },
  GLD: { price: "2,345.60", change: "+0.12%", isUp: true },
  DXY: { price: "103.45", change: "-0.23%", isUp: false },
};

export default function TopBar() {
  const [time, setTime] = useState(new Date());
  const { prices } = useMarketData(tickerSymbols);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const allTickerSymbols = [...tickerSymbols, "NVDA", "QQQ", "GLD", "DXY"];

  return (
    <header className="h-10 border-b border-border-primary bg-bg-secondary flex items-center shrink-0">
      {/* Ticker tape */}
      <div className="flex-1 flex items-center overflow-hidden">
        <div className="flex items-center gap-6 px-4 animate-ticker min-w-max">
          {allTickerSymbols.map((sym) => {
            const live = prices[sym];
            const fallback = staticTickers[sym];
            const price = live?.price ?? fallback?.price ?? "—";
            const change = live?.change ?? fallback?.change ?? "—";
            const isUp = live?.isUp ?? fallback?.isUp ?? true;

            return (
              <div key={sym} className="flex items-center gap-2 text-xs data-text">
                <span className="text-text-secondary font-medium">{sym}</span>
                <span className="text-text-primary font-semibold">{price}</span>
                <span className={cn("font-medium", isUp ? "text-accent-green" : "text-accent-red")}>
                  {change}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right: theme toggle + status */}
      <div className="flex items-center gap-3 px-4 text-xs text-text-muted font-mono border-l border-border-primary h-full">
        <ThemeToggle />
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
          <span>
            {prices["BTC"] ? "LIVE" : "MOCK"}
          </span>
        </div>
        <span className="hidden sm:inline">
          {time.toLocaleDateString("zh-CN", { year: "numeric", month: "2-digit", day: "2-digit" })}
        </span>
        <span>
          {time.toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}
        </span>
      </div>
    </header>
  );
}
