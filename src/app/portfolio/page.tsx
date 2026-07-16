"use client";

import { cn } from "@/lib/utils";
import {
  Wallet, TrendingUp, TrendingDown, PieChart, RefreshCw,
  Target, AlertTriangle, DollarSign, BarChart3, ArrowRight,
  Sparkles, Shield
} from "lucide-react";

const currentAllocation = [
  { asset: "BTC", category: "crypto" as const, value: 25000, pct: 35.0, color: "#f7931a" },
  { asset: "ETH", category: "crypto" as const, value: 12000, pct: 16.8, color: "#627eea" },
  { asset: "SOL", category: "crypto" as const, value: 5000, pct: 7.0, color: "#00d18c" },
  { asset: "NVDA", category: "stock" as const, value: 15000, pct: 21.0, color: "#76b900" },
  { asset: "QQQ", category: "stock" as const, value: 8500, pct: 11.9, color: "#00a3e0" },
  { asset: "GLD", category: "commodity" as const, value: 6000, pct: 8.4, color: "#ffd700" },
];

const aiSuggested = [
  { asset: "BTC", current: 35.0, suggested: 40.0, diff: "+5.0", action: "增持" as const },
  { asset: "ETH", current: 16.8, suggested: 20.0, diff: "+3.2", action: "增持" as const },
  { asset: "SOL", current: 7.0, suggested: 5.0, diff: "-2.0", action: "减持" as const },
  { asset: "NVDA", current: 21.0, suggested: 18.0, diff: "-3.0", action: "减持" as const },
  { asset: "QQQ", current: 11.9, suggested: 10.0, diff: "-1.9", action: "减持" as const },
  { asset: "GLD", current: 8.4, suggested: 7.0, diff: "-1.4", action: "减持" as const },
];

const riskExposure = [
  { name: "Crypto 总敞口", value: 58.8, risk: "高" as const, color: "text-accent-red" },
  { name: "美股 总敞口", value: 32.9, risk: "中" as const, color: "text-accent-gold" },
  { name: "商品 总敞口", value: 8.4, risk: "低" as const, color: "text-accent-green" },
  { name: "相关性风险", value: 0.72, risk: "高" as const, color: "text-accent-red" },
];

const fundPerformance = [
  { month: "1月", value: 102000 }, { month: "2月", value: 108500 },
  { month: "3月", value: 104200 }, { month: "4月", value: 112800 },
  { month: "5月", value: 118500 }, { month: "6月", value: 125000 },
  { month: "7月", value: 130000 }, { month: "8月", value: 128500 },
  { month: "9月", value: 135200 }, { month: "10月", value: 142000 },
  { month: "11月", value: 138500 }, { month: "12月", value: 150000 },
];

function DonutChart({ data }: { data: { label: string; pct: number; color: string }[] }) {
  const cx = 90, cy = 90, r = 70, sw = 25;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <svg viewBox="0 0 180 180" className="w-44 h-44">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1a1a2e" strokeWidth={sw} />
      {data.map((d) => {
        const len = (d.pct / 100) * circumference;
        const seg = (
          <circle key={d.label} cx={cx} cy={cy} r={r} fill="none" stroke={d.color}
            strokeWidth={sw} strokeDasharray={`${len} ${circumference - len}`}
            strokeDashoffset={-offset} strokeLinecap="butt" transform={`rotate(-90 ${cx} ${cy})`}
          />
        );
        offset += len;
        return seg;
      })}
      {/* Center text */}
      <text x={cx} y={cy - 6} textAnchor="middle" fill="#e0e0e0" fontSize="22" fontFamily="monospace" fontWeight="bold">$71K</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="#555566" fontSize="9" fontFamily="monospace">总资产</text>
    </svg>
  );
}

function MiniChart({ data }: { data: { month: string; value: number }[] }) {
  const w = 400, h = 100, pad = { top: 10, right: 10, bottom: 20, left: 45 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const minV = Math.min(...data.map((d) => d.value)) * 0.98;
  const maxV = Math.max(...data.map((d) => d.value)) * 1.02;
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * cw;
    const y = pad.top + ch - ((d.value - minV) / range) * ch;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id="fundGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#60a5fa" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon points={`${pad.left},${pad.top + ch} ${pts} ${pad.left + cw},${pad.top + ch}`} fill="url(#fundGrad)" />
      <polyline points={pts} fill="none" stroke="#60a5fa" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

export default function PortfolioPage() {
  const totalValue = currentAllocation.reduce((s, a) => s + a.value, 0);
  const cryptoPct = currentAllocation.filter((a) => a.category === "crypto").reduce((s, a) => s + a.pct, 0);
  const stockPct = currentAllocation.filter((a) => a.category === "stock").reduce((s, a) => s + a.pct, 0);
  const commodityPct = currentAllocation.filter((a) => a.category === "commodity").reduce((s, a) => s + a.pct, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI 基金管理</h1>
          <p className="text-sm text-text-muted mt-1">AI 配置优化 · 多资产管理 · 风险暴露监控</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-bg-card border border-border-primary rounded-lg px-3 py-1.5">
          <Sparkles size={14} className="text-accent-blue" />
          AI 基金管理模式
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "总资产净值", value: "$71,500", icon: <Wallet size={14} />, color: "text-text-primary" },
          { label: "今日盈亏", value: "+$1,245 (+1.77%)", icon: <TrendingUp size={14} />, color: "text-accent-green" },
          { label: "累计收益", value: "+$21,500 (+43%)", icon: <TrendingUp size={14} />, color: "text-accent-green" },
          { label: "年化收益", value: "+28.7%", icon: <DollarSign size={14} />, color: "text-accent-green" },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border-primary bg-bg-card p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
              <span className={s.color}>{s.icon}</span> {s.label}
            </div>
            <div className={cn("text-base font-bold font-mono", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Current Allocation */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <PieChart size={16} className="text-accent-blue" />
            当前配置
          </h2>
          <div className="flex justify-center mb-4">
            <DonutChart data={currentAllocation.map((a) => ({ label: a.asset, pct: a.pct, color: a.color }))} />
          </div>
          <div className="space-y-1.5">
            {currentAllocation.map((a) => (
              <div key={a.asset} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: a.color }} />
                  <span className="font-mono text-text-primary">{a.asset}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-text-muted">${(a.value / 1000).toFixed(1)}K</span>
                  <span className="font-mono text-text-primary w-[45px] text-right">{a.pct.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
          {/* Category summary */}
          <div className="mt-4 pt-3 border-t border-border-primary/50 grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-sm font-bold font-mono text-accent-gold">{cryptoPct.toFixed(1)}%</div>
              <div className="text-[10px] text-text-muted">Crypto</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold font-mono text-accent-blue">{stockPct.toFixed(1)}%</div>
              <div className="text-[10px] text-text-muted">Stocks</div>
            </div>
            <div className="text-center">
              <div className="text-sm font-bold font-mono text-accent-cyan">{commodityPct.toFixed(1)}%</div>
              <div className="text-[10px] text-text-muted">Commodity</div>
            </div>
          </div>
        </div>

        {/* AI Suggested Allocation */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Sparkles size={16} className="text-accent-purple" />
            AI 建议配置
          </h2>
          <div className="space-y-3">
            {aiSuggested.map((a) => (
              <div key={a.asset} className="p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold font-mono text-text-primary">{a.asset}</span>
                    <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-mono",
                      a.action === "增持" ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
                    )}>{a.action}</span>
                  </div>
                  <span className={cn("text-xs font-mono", a.action === "增持" ? "text-accent-green" : "text-accent-red")}>
                    {a.diff}%
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                    <div className="h-full rounded-full bg-accent-gold" style={{ width: `${a.current}%` }} />
                  </div>
                  <ArrowRight size={10} className="text-text-muted" />
                  <div className="flex-1 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                    <div className={cn("h-full rounded-full", a.action === "增持" ? "bg-accent-green" : "bg-accent-red")}
                      style={{ width: `${a.suggested}%` }} />
                  </div>
                </div>
                <div className="flex justify-between text-[9px] text-text-muted font-mono mt-1">
                  <span>当前 {a.current.toFixed(1)}%</span>
                  <span>建议 {a.suggested.toFixed(1)}%</span>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-3 py-2 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 transition-all text-xs font-medium flex items-center justify-center gap-1">
            <RefreshCw size={12} /> 执行 AI 调仓建议
          </button>
        </div>

        {/* Risk Exposure */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield size={16} className="text-accent-red" />
            风险暴露分析
          </h2>
          <div className="space-y-3 mb-4">
            {riskExposure.map((r) => (
              <div key={r.name} className="p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-text-primary">{r.name}</span>
                  <span className={cn("text-xs font-mono font-semibold", r.color)}>{r.risk}</span>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="flex-1 h-2 rounded-full bg-bg-tertiary overflow-hidden">
                    <div className={cn("h-full rounded-full", r.risk === "高" ? "bg-accent-red" : r.risk === "中" ? "bg-accent-gold" : "bg-accent-green")}
                      style={{ width: `${typeof r.value === "number" ? r.value : parseFloat(r.value)}%` }} />
                  </div>
                  <span className="text-[10px] font-mono text-text-muted min-w-[40px] text-right">{r.value}{typeof r.value === "number" && r.name.includes("相关性") ? "" : "%"}</span>
                </div>
              </div>
            ))}
          </div>

          <h3 className="text-xs font-semibold text-text-primary mb-2">集中度风险</h3>
          <div className="p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-muted">Top 3 持仓占比</span>
              <span className="font-mono text-accent-gold">{35.0 + 21.0 + 16.8}%</span>
            </div>
            <div className="flex items-center justify-between text-xs mb-1">
              <span className="text-text-muted">单一资产最大敞口</span>
              <span className="font-mono text-accent-gold">35.0% (BTC)</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">Crypto 总敞口</span>
              <span className="font-mono text-accent-red">{cryptoPct}%</span>
            </div>
          </div>

          <div className="mt-3 p-3 rounded-lg bg-accent-gold/5 border border-accent-gold/30">
            <div className="flex items-start gap-2">
              <AlertTriangle size={14} className="text-accent-gold shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-medium text-accent-gold">AI 建议</div>
                <p className="text-[10px] text-text-secondary mt-0.5">Crypto 总敞口偏高。建议减持部分 SOL 和 NVDA，将资金转入 BTC 和稳定币以降低波动风险。</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fund Performance */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-green" />
            基金净值走势
          </h2>
          <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono">
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-accent-blue" />净值</span>
            <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-text-dim" />基准</span>
          </div>
        </div>
        <MiniChart data={fundPerformance} />
        <div className="mt-2 flex justify-between text-[10px] text-text-muted font-mono">
          <span>{fundPerformance[0].month}</span>
          <span>{fundPerformance[fundPerformance.length - 1].month}</span>
        </div>
      </div>
    </div>
  );
}
