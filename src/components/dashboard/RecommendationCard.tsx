"use client";

import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight, AlertTriangle, Sparkles, Shield, Gauge } from "lucide-react";

interface RecommendationProps {
  symbol: string;
  action: "BUY" | "SELL" | "HOLD";
  confidence: number;
  maxPosition: string;
  riskLevel: "Low" | "Medium" | "High";
  reason: string;
  targets: { label: string; value: string }[];
}

const actionConfig = {
  BUY: { color: "text-accent-green", bg: "bg-accent-green/10", border: "border-accent-green/30", icon: ArrowUpRight },
  SELL: { color: "text-accent-red", bg: "bg-accent-red/10", border: "border-accent-red/30", icon: ArrowDownRight },
  HOLD: { color: "text-accent-gold", bg: "bg-accent-gold/10", border: "border-accent-gold/30", icon: AlertTriangle },
};

const riskConfig = {
  Low: { color: "text-accent-green", bg: "bg-accent-green/10" },
  Medium: { color: "text-accent-gold", bg: "bg-accent-gold/10" },
  High: { color: "text-accent-red", bg: "bg-accent-red/10" },
};

export default function RecommendationCard({ symbol, action, confidence, maxPosition, riskLevel, reason, targets }: RecommendationProps) {
  const ac = actionConfig[action];
  const rc = riskConfig[riskLevel];
  const ActionIcon = ac.icon;

  return (
    <div className="rounded-xl border border-border-primary bg-bg-card p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <Sparkles size={20} className="text-accent-blue" />
          <h2 className="text-base font-semibold text-text-primary">今日 AI 投资建议</h2>
        </div>
        <span className="text-[10px] text-text-muted font-mono">UPDATED: 08:00 UTC</span>
      </div>

      <div className="flex items-start gap-6">
        {/* Action badge */}
        <div className={cn("flex flex-col items-center p-4 rounded-xl border", ac.border, ac.bg, "min-w-[120px]")}>
          <ActionIcon size={28} className={cn(ac.color, "mb-1")} />
          <span className={cn("text-2xl font-bold font-mono", ac.color)}>{action}</span>
          <span className="text-[10px] text-text-muted mt-1">{symbol}</span>
        </div>

        {/* Details */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {/* Confidence */}
          <div className="space-y-1">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">信心指数</span>
            <div className="flex items-center gap-2">
              <Gauge size={16} className="text-accent-blue" />
              <span className="text-lg font-bold font-mono text-text-primary">{confidence}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-bg-tertiary w-full">
              <div
                className="h-full rounded-full bg-accent-blue transition-all"
                style={{ width: `${confidence}%` }}
              />
            </div>
          </div>

          {/* Risk Level */}
          <div className="space-y-1">
            <span className="text-[11px] text-text-muted uppercase tracking-wider">风险等级</span>
            <div className="flex items-center gap-2">
              <Shield size={16} className={rc.color} />
              <span className={cn("text-lg font-bold font-mono", rc.color)}>{riskLevel}</span>
            </div>
            <span className="text-xs text-text-muted">最大仓位: {maxPosition}</span>
          </div>
        </div>
      </div>

      {/* Reason */}
      <div className="mt-4 p-3 rounded-lg bg-bg-tertiary/50 border border-border-primary/50">
        <p className="text-sm text-text-secondary leading-relaxed">{reason}</p>
      </div>

      {/* Targets */}
      <div className="mt-4 grid grid-cols-3 gap-3">
        {targets.map((t) => (
          <div key={t.label} className="text-center p-2 rounded-lg bg-bg-tertiary/30">
            <div className="text-[10px] text-text-muted uppercase">{t.label}</div>
            <div className="text-sm font-mono font-semibold text-text-primary mt-0.5">{t.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
