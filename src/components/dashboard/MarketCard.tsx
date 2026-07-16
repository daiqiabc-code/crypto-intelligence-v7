"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface MarketCardProps {
  title: string;
  subtitle?: string;
  price: string;
  change: string;
  isUp: boolean;
  status?: string;
  details?: { label: string; value: string; isUp?: boolean }[];
  className?: string;
  large?: boolean;
}

export default function MarketCard({
  title,
  subtitle,
  price,
  change,
  isUp,
  status,
  details,
  className,
  large,
}: MarketCardProps) {
  const TrendIcon = isUp ? TrendingUp : TrendingDown;

  return (
    <div
      className={cn(
        "rounded-xl border border-border-primary bg-bg-card p-5 hover:border-border-secondary transition-all duration-300 group",
        large && "row-span-2",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">{title}</h3>
          {subtitle && (
            <p className="text-[11px] text-text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-mono",
            isUp ? "text-accent-green bg-accent-green/10" : "text-accent-red bg-accent-red/10"
          )}
        >
          <TrendIcon size={14} />
          <span className="font-semibold">{change}</span>
        </div>
      </div>

      {/* Price */}
      <div className="flex items-end gap-2 mb-3">
        <span className={cn("font-mono font-bold tracking-tight text-text-primary", large ? "text-3xl" : "text-2xl")}>
          {price}
        </span>
        {status && (
          <span
            className={cn(
              "text-xs font-mono px-2 py-0.5 rounded-full border",
              isUp
                ? "text-accent-green border-accent-green/30 bg-accent-green/5"
                : "text-accent-red border-accent-red/30 bg-accent-red/5"
            )}
          >
            {status}
          </span>
        )}
      </div>

      {/* Details */}
      {details && (
        <div className="space-y-1.5 pt-3 border-t border-border-primary/50">
          {details.map((d, i) => (
            <div key={i} className="flex items-center justify-between text-xs">
              <span className="text-text-muted">{d.label}</span>
              <span className={cn("font-mono font-medium", d.isUp !== undefined ? (d.isUp ? "text-accent-green" : "text-accent-red") : "text-text-secondary")}>
                {d.value}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
