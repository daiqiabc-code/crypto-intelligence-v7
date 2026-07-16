"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Users, TrendingUp, Globe, Link, Shield, Vote, Scale,
  ArrowUpRight, ArrowDownRight, Minus, BarChart3, RefreshCw
} from "lucide-react";

const agents = [
  { id: "trend", name: "趋势AI", role: "技术分析", weight: 40, icon: <TrendingUp size={18} />, color: "text-accent-green", bgColor: "bg-accent-green/10" },
  { id: "macro", name: "宏观AI", role: "宏观经济", weight: 20, icon: <Globe size={18} />, color: "text-accent-blue", bgColor: "bg-accent-blue/10" },
  { id: "chain", name: "链上AI", role: "链上数据", weight: 20, icon: <Link size={18} />, color: "text-accent-cyan", bgColor: "bg-accent-cyan/10" },
  { id: "risk", name: "风险AI", role: "风控评估", weight: 20, icon: <Shield size={18} />, color: "text-accent-red", bgColor: "bg-accent-red/10" },
];

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

// 预置投票方案
const votePresets: Record<string, { trend: { action: string; score: number }; macro: { action: string; score: number }; chain: { action: string; score: number }; risk: { action: string; score: number } }> = {
  BTCUSDT: {
    trend: { action: "BUY", score: 82 },
    macro: { action: "HOLD", score: 60 },
    chain: { action: "BUY", score: 85 },
    risk: { action: "REDUCE", score: 55 },
  },
  ETHUSDT: {
    trend: { action: "BUY", score: 75 },
    macro: { action: "BUY", score: 68 },
    chain: { action: "HOLD", score: 62 },
    risk: { action: "HOLD", score: 58 },
  },
  SOLUSDT: {
    trend: { action: "HOLD", score: 55 },
    macro: { action: "HOLD", score: 52 },
    chain: { action: "BUY", score: 70 },
    risk: { action: "REDUCE", score: 45 },
  },
};

const actionScore: Record<string, number> = { BUY: 2, HOLD: 1, SELL: 0, REDUCE: 0.5 };

function calcConsensus(votes: { action: string; score: number; weight: number }[]) {
  let totalScore = 0, totalWeight = 0;
  for (const v of votes) {
    const numeric = (actionScore[v.action] || 1) * (v.score / 100);
    totalScore += numeric * v.weight;
    totalWeight += v.weight;
  }
  const consensus = totalWeight > 0 ? (totalScore / totalWeight) * 100 : 0;
  if (consensus >= 65) return { decision: "BUY" as const, score: consensus };
  if (consensus >= 40) return { decision: "HOLD" as const, score: consensus };
  return { decision: "SELL" as const, score: consensus };
}

function PositionSlider({ value, onChange }: { value: number; onChange?: (v: number) => void }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] text-text-muted font-mono">
        <span>0%</span>
        <span>建议仓位: {value}%</span>
        <span>100%</span>
      </div>
      <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden relative">
        <div
          className={cn("h-full rounded-full transition-all", value > 60 ? "bg-accent-green" : value > 30 ? "bg-accent-gold" : "bg-accent-red")}
          style={{ width: `${value}%` }}
        />
        <input
          type="range" min="0" max="100" value={value}
          onChange={(e) => onChange?.(parseInt(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>
    </div>
  );
}

export default function CommitteePage() {
  const [symbol, setSymbol] = useState("BTCUSDT");
  const [position, setPosition] = useState(30);
  const preset = votePresets[symbol];

  const votes = [
    { action: preset.trend.action, score: preset.trend.score, weight: agents[0].weight },
    { action: preset.macro.action, score: preset.macro.score, weight: agents[1].weight },
    { action: preset.chain.action, score: preset.chain.score, weight: agents[2].weight },
    { action: preset.risk.action, score: preset.risk.score, weight: agents[3].weight },
  ];
  const consensus = calcConsensus(votes);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI 投委会</h1>
          <p className="text-sm text-text-muted mt-1">Multi-Agent 投资委员会 · 加权投票决策系统</p>
        </div>
        <div className="flex items-center gap-1 bg-bg-card border border-border-primary rounded-xl p-1">
          {symbols.map((s) => (
            <button key={s} onClick={() => setSymbol(s)}
              className={cn("px-3 py-1.5 rounded-lg text-xs font-mono transition-all",
                symbol === s ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted hover:text-text-primary"
              )}>{s}</button>
          ))}
        </div>
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5 text-center">
        <div className="text-xs text-text-muted mb-2">本期议题</div>
        <h2 className="text-lg font-bold text-text-primary font-mono">是否买入 {symbol}？</h2>
      </div>

      {/* Agent Votes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {agents.map((agent, i) => {
          const v = i === 0 ? preset.trend : i === 1 ? preset.macro : i === 2 ? preset.chain : preset.risk;
          const actionColor = v.action === "BUY" ? "text-accent-green" : v.action === "SELL" || v.action === "REDUCE" ? "text-accent-red" : "text-accent-gold";
          const ActionIcon = v.action === "BUY" ? ArrowUpRight : v.action === "SELL" || v.action === "REDUCE" ? ArrowDownRight : Minus;

          return (
            <div key={agent.id} className="rounded-xl border border-border-primary bg-bg-card p-5 hover:border-border-secondary transition-all">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl", agent.bgColor)}>
                    <span className={agent.color}>{agent.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-text-primary">{agent.name}</h3>
                    <p className="text-[10px] text-text-muted">{agent.role} · 权重 {agent.weight}%</p>
                  </div>
                </div>
                <div className={cn("flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border", actionColor.replace("text", "border").replace("green","green/30").replace("red","red/30").replace("gold","gold/30"), agent.bgColor)}>
                  <ActionIcon size={14} />
                  <span className="text-sm font-bold font-mono">{v.action}</span>
                </div>
              </div>

              {/* Score gauge */}
              <div className="flex items-center gap-3">
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-text-muted">信心评分</span>
                    <span className={cn("font-mono font-bold", actionColor)}>{v.score}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                    <div className={cn("h-full rounded-full transition-all",
                      v.action === "BUY" ? "bg-accent-green" : v.action === "SELL" || v.action === "REDUCE" ? "bg-accent-red" : "bg-accent-gold"
                    )} style={{ width: `${v.score}%` }} />
                  </div>
                </div>
                <span className="text-[10px] text-text-muted font-mono min-w-[40px] text-right">权重 {agent.weight}%</span>
              </div>

              {/* Contribution bar */}
              <div className="mt-2 flex items-center gap-2 text-[10px] text-text-muted">
                <Scale size={10} />
                <span>加权贡献: {((v.action === "BUY" ? 2 : v.action === "HOLD" ? 1 : 0.5) * (v.score / 100) * agent.weight).toFixed(1)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Consensus Result */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-6">
        <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
          <BarChart3 size={16} className="text-accent-purple" />
          综合裁决
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Decision */}
          <div className="flex flex-col items-center justify-center p-6 rounded-xl bg-bg-tertiary/40 border border-border-primary/50">
            <div className={cn("text-4xl font-bold font-mono mb-2",
              consensus.decision === "BUY" ? "text-accent-green" : consensus.decision === "HOLD" ? "text-accent-gold" : "text-accent-red"
            )}>{consensus.decision}</div>
            <div className="text-xs text-text-muted">投资决策</div>
            <div className={cn("text-lg font-bold font-mono mt-3",
              consensus.decision === "BUY" ? "text-accent-green" : consensus.decision === "HOLD" ? "text-accent-gold" : "text-accent-red"
            )}>{consensus.score.toFixed(1)}</div>
            <div className="text-[10px] text-text-muted">Consensus Score</div>
          </div>

          {/* Weight breakdown */}
          <div className="space-y-3">
            <div className="text-[11px] text-text-muted font-medium">权重构成</div>
            {agents.map((a, i) => {
              const v = i === 0 ? preset.trend : i === 1 ? preset.macro : i === 2 ? preset.chain : preset.risk;
              const numeric = (actionScore[v.action] || 1) * (v.score / 100);
              return (
                <div key={a.id} className="flex items-center gap-2">
                  <span className={cn("text-xs font-mono w-12", a.color)}>{a.id === "trend" ? "技术40%": a.id === "macro" ? "宏观20%": a.id === "chain" ? "链上20%": "风控20%"}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                    <div className={cn("h-full rounded-full", a.color.replace("text", "bg").replace("green","green").replace("blue","blue").replace("cyan","cyan").replace("red","red").split(" ")[0])}
                      style={{ width: `${numeric * 50}%` }} />
                  </div>
                  <span className={cn("text-[10px] font-mono w-8 text-right", a.color)}>{(numeric * a.weight).toFixed(1)}</span>
                </div>
              );
            })}
          </div>

          {/* Position Sizer */}
          <div className="space-y-3">
            <div className="text-[11px] text-text-muted font-medium">建议仓位</div>
            <PositionSlider value={position} onChange={setPosition} />
            <div className={cn("text-center text-lg font-bold font-mono", position > 60 ? "text-accent-green" : position > 30 ? "text-accent-gold" : "text-accent-red")}>
              {position}%
            </div>
            <div className="text-center text-[10px] text-text-muted">占总资产比例</div>

            {/* Action button */}
            <button className={cn("w-full py-2.5 rounded-lg text-sm font-semibold border transition-all mt-2",
              consensus.decision === "BUY"
                ? "bg-accent-green/15 text-accent-green border-accent-green/30 hover:bg-accent-green/25"
                : consensus.decision === "SELL"
                ? "bg-accent-red/15 text-accent-red border-accent-red/30 hover:bg-accent-red/25"
                : "bg-accent-gold/15 text-accent-gold border-accent-gold/30 hover:bg-accent-gold/25"
            )}>
              执行 {consensus.decision} {symbol}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
