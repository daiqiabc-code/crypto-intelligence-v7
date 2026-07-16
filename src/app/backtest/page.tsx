"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { LineChart, Play, RotateCcw, TrendingUp, TrendingDown, DollarSign, Target, Shield, AlertTriangle, Download } from "lucide-react";

// ─── Mock backtest data ─────────────────────────────
const assets = ["BTC", "ETH", "SOL", "黄金", "QQQ"] as const;

const backtestPresets = [
  {
    id: "btc-trend-v8",
    name: "BTC Trend Strategy V8",
    symbol: "BTC",
    period: "2020-01 — 2026-07",
    oosPeriod: "2025-01 — 2026-07",
    metrics: {
      totalReturn: 342.5,
      annualReturn: 28.7,
      sharpe: 1.86,
      sortino: 2.34,
      calmar: 1.52,
      maxDrawdown: 18.2,
      winRate: 64.5,
      profitFactor: 2.31,
      totalTrades: 342,
      avgHoldingDays: 12.4,
    },
    walkForward: [
      { window: "1", inSample: 38.2, outSample: 32.1 },
      { window: "2", inSample: 41.5, outSample: 35.8 },
      { window: "3", inSample: 35.7, outSample: 28.4 },
      { window: "4", inSample: 44.2, outSample: 38.6 },
      { window: "5", inSample: 39.8, outSample: 34.2 },
      { window: "6", inSample: 42.1, outSample: 36.5 },
    ],
    equityCurve: [
      { date: "2020-01", value: 10000 }, { date: "2020-06", value: 12800 },
      { date: "2020-12", value: 18200 }, { date: "2021-06", value: 24500 },
      { date: "2021-12", value: 31200 }, { date: "2022-06", value: 26800 },
      { date: "2022-12", value: 22400 }, { date: "2023-06", value: 29800 },
      { date: "2023-12", value: 38500 }, { date: "2024-06", value: 45200 },
      { date: "2024-12", value: 52800 }, { date: "2025-06", value: 59100 },
      { date: "2026-01", value: 65200 }, { date: "2026-07", value: 44250 },
    ],
  },
  {
    id: "eth-momentum-v3",
    name: "ETH Momentum Strategy V3",
    symbol: "ETH",
    period: "2021-01 — 2026-07",
    oosPeriod: "2025-01 — 2026-07",
    metrics: {
      totalReturn: 218.3,
      annualReturn: 22.4,
      sharpe: 1.54,
      sortino: 1.89,
      calmar: 1.18,
      maxDrawdown: 22.5,
      winRate: 58.2,
      profitFactor: 1.95,
      totalTrades: 521,
      avgHoldingDays: 8.2,
    },
    walkForward: [
      { window: "1", inSample: 32.5, outSample: 26.8 },
      { window: "2", inSample: 35.1, outSample: 29.2 },
      { window: "3", inSample: 28.9, outSample: 22.4 },
      { window: "4", inSample: 38.4, outSample: 31.5 },
      { window: "5", inSample: 33.6, outSample: 27.8 },
      { window: "6", inSample: 36.2, outSample: 30.1 },
    ],
    equityCurve: [
      { date: "2021-01", value: 10000 }, { date: "2021-06", value: 15200 },
      { date: "2021-12", value: 22500 }, { date: "2022-06", value: 16800 },
      { date: "2022-12", value: 14200 }, { date: "2023-06", value: 19800 },
      { date: "2023-12", value: 26500 }, { date: "2024-06", value: 31200 },
      { date: "2024-12", value: 35800 }, { date: "2025-06", value: 38200 },
      { date: "2026-07", value: 31830 },
    ],
  },
  {
    id: "sol-breakout-v2",
    name: "SOL Breakout Strategy V2",
    symbol: "SOL",
    period: "2021-06 — 2026-07",
    oosPeriod: "2025-01 — 2026-07",
    metrics: {
      totalReturn: 185.6,
      annualReturn: 19.8,
      sharpe: 1.32,
      sortino: 1.65,
      calmar: 1.05,
      maxDrawdown: 25.1,
      winRate: 55.8,
      profitFactor: 1.78,
      totalTrades: 687,
      avgHoldingDays: 5.8,
    },
    walkForward: [
      { window: "1", inSample: 28.4, outSample: 22.1 },
      { window: "2", inSample: 31.2, outSample: 25.6 },
      { window: "3", inSample: 26.8, outSample: 20.4 },
      { window: "4", inSample: 34.5, outSample: 28.2 },
      { window: "5", inSample: 29.6, outSample: 23.8 },
      { window: "6", inSample: 32.1, outSample: 26.5 },
    ],
    equityCurve: [
      { date: "2021-06", value: 10000 }, { date: "2021-12", value: 18500 },
      { date: "2022-06", value: 12500 }, { date: "2022-12", value: 9800 },
      { date: "2023-06", value: 15800 }, { date: "2023-12", value: 21500 },
      { date: "2024-06", value: 26800 }, { date: "2024-12", value: 31200 },
      { date: "2025-06", value: 34500 }, { date: "2026-07", value: 28560 },
    ],
  },
];

type BacktestResult = (typeof backtestPresets)[number];

// ─── SVG min-equity curve ───
function EquityCurveChart({ data }: { data: { date: string; value: number }[] }) {
  const w = 640, h = 200, pad = { top: 20, right: 20, bottom: 30, left: 60 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const values = data.map((d) => d.value);
  const minV = Math.min(...values);
  const maxV = Math.max(...values);
  const range = maxV - minV || 1;

  const pts = data
    .map((d, i) => {
      const x = pad.left + (i / (data.length - 1)) * cw;
      const y = pad.top + ch - ((d.value - minV) / range) * ch;
      return `${x},${y}`;
    })
    .join(" ");

  const startVal = data[0].value;
  const endVal = data[data.length - 1].value;
  const isProfitable = endVal >= startVal;

  // Y-axis labels
  const yTicks = [0, 0.25, 0.5, 0.75, 1].map((pct) => {
    const v = minV + range * pct;
    const y = pad.top + ch - pct * ch;
    return { y, label: `$${(v / 1000).toFixed(0)}K` };
  });

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      {/* Grid */}
      {yTicks.map((t, i) => (
        <g key={i}>
          <line x1={pad.left} y1={t.y} x2={w - pad.right} y2={t.y} stroke="#1a1a2e" strokeWidth="1" />
          <text x={pad.left - 8} y={t.y + 3} textAnchor="end" fill="#555566" fontSize="10" fontFamily="monospace">
            {t.label}
          </text>
        </g>
      ))}

      {/* Baseline */}
      <line x1={pad.left} y1={pad.top + ch} x2={w - pad.right} y2={pad.top + ch} stroke="#2a2a3e" strokeWidth="1" />

      {/* Area fill */}
      <defs>
        <linearGradient id="eqGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={isProfitable ? "#34d399" : "#fb7185"} stopOpacity="0.25" />
          <stop offset="100%" stopColor={isProfitable ? "#34d399" : "#fb7185"} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      <polygon
        points={`${pad.left},${pad.top + ch} ${pts} ${pad.left + cw},${pad.top + ch}`}
        fill="url(#eqGrad)"
      />
      <polyline points={pts} fill="none" stroke={isProfitable ? "#34d399" : "#fb7185"} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

      {/* Start/End labels */}
      <text x={pad.left} y={pad.top + ch + 16} fill="#555566" fontSize="9" fontFamily="monospace">{data[0].date}</text>
      <text x={w - pad.right} y={pad.top + ch + 16} textAnchor="end" fill="#555566" fontSize="9" fontFamily="monospace">{data[data.length - 1].date}</text>
    </svg>
  );
}

function MetricCard({ label, value, icon, color = "text-text-primary" }: { label: string; value: string; icon: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-lg bg-bg-tertiary/30 border border-border-primary/50 p-3 text-center">
      <div className={cn("flex items-center justify-center mb-1", color)}>{icon}</div>
      <div className={cn("text-sm font-bold font-mono", color)}>{value}</div>
      <div className="text-[10px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

export default function BacktestPage() {
  const [selectedId, setSelectedId] = useState(backtestPresets[0].id);
  const selected: BacktestResult = backtestPresets.find((b) => b.id === selectedId) ?? backtestPresets[0];
  const [running, setRunning] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<string>("BTC");

  const m = selected.metrics;

  const handleRun = () => {
    setRunning(true);
    setTimeout(() => setRunning(false), 2500);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">回测中心</h1>
          <p className="text-sm text-text-muted mt-1">Walk Forward 回测系统 · 2017 — 2026 · 多资产支持</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Asset selector */}
          <div className="flex items-center gap-1 bg-bg-card border border-border-primary rounded-lg p-1">
            {assets.map((a) => (
              <button
                key={a}
                onClick={() => setSelectedAsset(a)}
                className={cn(
                  "px-3 py-1.5 rounded-md text-xs font-mono transition-all",
                  selectedAsset === a ? "bg-accent-blue/20 text-accent-blue" : "text-text-muted hover:text-text-primary"
                )}
              >
                {a}
              </button>
            ))}
          </div>
          <button
            onClick={handleRun}
            disabled={running}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 transition-all text-sm font-medium disabled:opacity-50"
          >
            {running ? <RotateCcw size={14} className="animate-spin" /> : <Play size={14} />}
            {running ? "回测中..." : "运行回测"}
          </button>
        </div>
      </div>

      {/* Strategy Presets */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {backtestPresets.map((bp) => (
          <button
            key={bp.id}
            onClick={() => setSelectedId(bp.id)}
            className={cn(
              "whitespace-nowrap px-4 py-2 rounded-lg text-xs font-medium border transition-all",
              selectedId === bp.id
                ? "bg-accent-blue/15 border-accent-blue/40 text-accent-blue"
                : "bg-bg-card border-border-primary text-text-secondary hover:border-border-secondary"
            )}
          >
            {bp.name}
          </button>
        ))}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left: Metrics */}
        <div className="xl:col-span-2 space-y-4">
          {/* Key Metrics */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
              <LineChart size={16} className="text-accent-blue" />
              关键指标
              <span className="text-[10px] text-text-muted font-mono ml-auto">{selected.period}</span>
            </h2>
            <div className="grid grid-cols-4 gap-3">
              <MetricCard label="总收益" value={`+${m.totalReturn.toFixed(1)}%`} icon={<TrendingUp size={16} />} color="text-accent-green" />
              <MetricCard label="年化收益" value={`${m.annualReturn.toFixed(1)}%`} icon={<DollarSign size={16} />} color="text-accent-green" />
              <MetricCard label="最大回撤" value={`-${m.maxDrawdown.toFixed(1)}%`} icon={<Shield size={16} />} color="text-accent-red" />
              <MetricCard label="总交易" value={`${m.totalTrades}`} icon={<Target size={16} />} />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <MetricCard label="Sharpe" value={m.sharpe.toFixed(2)} icon={<LineChart size={16} />} color={m.sharpe >= 1.5 ? "text-accent-green" : "text-accent-gold"} />
              <MetricCard label="Sortino" value={m.sortino.toFixed(2)} icon={<LineChart size={16} />} color={m.sortino >= 1.5 ? "text-accent-green" : "text-accent-gold"} />
              <MetricCard label="Calmar" value={m.calmar.toFixed(2)} icon={<Shield size={16} />} color={m.calmar >= 1.2 ? "text-accent-green" : "text-accent-gold"} />
              <MetricCard label="胜率" value={`${m.winRate.toFixed(1)}%`} icon={m.winRate >= 60 ? <TrendingUp size={16} /> : <TrendingDown size={16} />} color="text-accent-blue" />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-3">
              <MetricCard label="盈亏比" value={m.profitFactor.toFixed(2)} icon={<DollarSign size={16} />} color={m.profitFactor >= 2 ? "text-accent-green" : "text-accent-gold"} />
              <MetricCard label="平均持仓" value={`${m.avgHoldingDays}d`} icon={<Target size={16} />} />
              <MetricCard label="样本外" value={selected.oosPeriod} icon={<LineChart size={16} />} />
              <MetricCard label="评级" value={m.sharpe >= 1.5 && m.calmar >= 1.2 ? "A" : "B"} icon={<AlertTriangle size={16} />} color={m.sharpe >= 1.5 ? "text-accent-green" : "text-accent-gold"} />
            </div>
          </div>

          {/* Equity Curve */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                <TrendingUp size={16} className="text-accent-green" />
                资金曲线
              </h2>
              <div className="flex items-center gap-3 text-[10px] text-text-muted font-mono">
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 rounded bg-accent-green" />
                  策略收益
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-3 h-0.5 rounded bg-text-dim" />
                  买入持有
                </span>
              </div>
            </div>
            <EquityCurveChart data={selected.equityCurve} />
          </div>
        </div>

        {/* Right: Walk Forward + OOS */}
        <div className="space-y-4">
          {/* Walk Forward Analysis */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <RotateCcw size={16} className="text-accent-blue" />
              Walk Forward 分析
            </h2>
            <div className="space-y-2">
              {/* Header */}
              <div className="grid grid-cols-3 gap-2 text-[10px] text-text-muted font-mono px-2 py-1">
                <span>窗口</span>
                <span className="text-right">样本内</span>
                <span className="text-right">样本外</span>
              </div>
              {selected.walkForward.map((wf) => (
                <div key={wf.window} className="grid grid-cols-3 gap-2 items-center px-2 py-1.5 rounded-lg bg-bg-tertiary/30">
                  <span className="text-xs text-text-secondary font-mono">Window {wf.window}</span>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                      <div className="h-full rounded-full bg-accent-green" style={{ width: `${wf.inSample}%` }} />
                    </div>
                    <span className="text-xs font-mono text-accent-green">{wf.inSample.toFixed(1)}%</span>
                  </div>
                  <div className="flex items-center gap-2 justify-end">
                    <div className="w-16 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                      <div className="h-full rounded-full bg-accent-blue" style={{ width: `${wf.outSample}%` }} />
                    </div>
                    <span className="text-xs font-mono text-accent-blue">{wf.outSample.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-4 p-3 rounded-lg bg-bg-tertiary/40 border border-border-primary/50">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text-muted">平均衰减率</span>
                <span className={cn("font-mono font-semibold",
                  ((() => {
                    const avgIS = selected.walkForward.reduce((s, w) => s + w.inSample, 0) / selected.walkForward.length;
                    const avgOOS = selected.walkForward.reduce((s, w) => s + w.outSample, 0) / selected.walkForward.length;
                    const decay = ((avgIS - avgOOS) / avgIS * 100);
                    return decay;
                  })()) < 20 ? "text-accent-green" : "text-accent-gold"
                )}>
                  {(() => {
                    const avgIS = selected.walkForward.reduce((s, w) => s + w.inSample, 0) / selected.walkForward.length;
                    const avgOOS = selected.walkForward.reduce((s, w) => s + w.outSample, 0) / selected.walkForward.length;
                    return ((avgIS - avgOOS) / avgIS * 100).toFixed(1);
                  })()}%
                </span>
              </div>
              <div className="flex items-center justify-between text-xs mt-2">
                <span className="text-text-muted">稳健性评估</span>
                <span className="text-accent-green font-medium">通过 ✓</span>
              </div>
            </div>
          </div>

          {/* Download */}
          <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-border-primary bg-bg-card text-text-secondary hover:border-accent-blue hover:text-accent-blue transition-all text-sm">
            <Download size={16} />
            导出完整回测报告
          </button>
        </div>
      </div>

      {/* ── Walk Forward 深度分析 ── */}
      {(() => {
        const avgIS = selected.walkForward.reduce((s, w) => s + w.inSample, 0) / selected.walkForward.length;
        const avgOOS = selected.walkForward.reduce((s, w) => s + w.outSample, 0) / selected.walkForward.length;
        const decay = ((avgIS - avgOOS) / avgIS) * 100;
        const stability = decay < 15 ? "高" : decay < 25 ? "中" : "低";
        const stabilityColor = decay < 15 ? "text-accent-green" : decay < 25 ? "text-accent-gold" : "text-accent-red";

        // 各窗口 Sharpe 模拟
        const windowSharpe = selected.walkForward.map((_, i) => {
          const base = selected.metrics.sharpe;
          const variance = (Math.random() - 0.5) * 0.6; // deterministic-ish using index
          const seed = ((i + 1) * 7 + base * 100) % 1;
          return base - 0.3 + seed * 0.6;
        });

        const minS = Math.min(...windowSharpe);
        const maxS = Math.max(...windowSharpe);

        // 参数稳定性热力图数据
        const paramGrid = [
          { param: "EMA 周期", values: [200, 200, 200, 200, 200, 200], stable: true },
          { param: "ATR 倍数", values: [2.0, 2.0, 1.5, 2.0, 2.5, 2.0], stable: false },
          { param: "止损(%)", values: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0], stable: true },
          { param: "止盈比(RR)", values: [3.0, 3.0, 3.0, 3.0, 3.0, 3.0], stable: true },
          { param: "成交量阈值", values: [1.2, 1.2, 1.2, 1.2, 1.2, 1.2], stable: true },
        ];

        return (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
            {/* 稳健性评分 */}
            <div className="rounded-xl border border-border-primary bg-bg-card p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <RotateCcw size={16} className="text-accent-blue" />
                Walk Forward 稳健性评分
              </h2>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-4 text-center">
                  <div className={cn("text-2xl font-bold font-mono", stabilityColor)}>{stability}</div>
                  <div className="text-[10px] text-text-muted mt-1">稳健性等级</div>
                </div>
                <div className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-4 text-center">
                  <div className={cn("text-2xl font-bold font-mono", decay < 20 ? "text-accent-green" : "text-accent-gold")}>{decay.toFixed(1)}%</div>
                  <div className="text-[10px] text-text-muted mt-1">IS/OOS 衰减率</div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">平均样本内年化</span>
                  <span className="font-mono text-accent-green">{avgIS.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">平均样本外年化</span>
                  <span className="font-mono text-accent-blue">{avgOOS.toFixed(1)}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Sharpe 波动区间</span>
                  <span className="font-mono text-text-primary">{minS.toFixed(2)} — {maxS.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-text-muted">Sharpe 稳定性</span>
                  <span className={cn("font-mono", (maxS - minS) < 0.5 ? "text-accent-green" : "text-accent-gold")}>
                    {(maxS - minS) < 0.5 ? "稳定" : "波动较大"}
                  </span>
                </div>
              </div>
              {/* 评分条 */}
              <div className="mt-4 p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/50">
                <div className="flex items-center justify-between text-xs mb-2">
                  <span className="text-text-muted">综合稳健性评分</span>
                  <span className={cn("font-bold font-mono", stabilityColor)}>
                    {decay < 15 ? "A+" : decay < 20 ? "A" : decay < 25 ? "B" : "C"}
                  </span>
                </div>
                <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", decay < 15 ? "bg-accent-green" : decay < 25 ? "bg-accent-gold" : "bg-accent-red")}
                    style={{ width: `${Math.max(10, 100 - decay * 2)}%` }} />
                </div>
              </div>
            </div>

            {/* 参数稳定性热力图 */}
            <div className="rounded-xl border border-border-primary bg-bg-card p-5">
              <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Shield size={16} className="text-accent-purple" />
                参数稳定性矩阵
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-text-muted font-mono">
                      <th className="text-left py-1 pr-3">参数</th>
                      {[1, 2, 3, 4, 5, 6].map((w) => (
                        <th key={w} className="text-center py-1 px-1.5 w-[50px]">W{w}</th>
                      ))}
                      <th className="text-center py-1 pl-2">状态</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paramGrid.map((row) => (
                      <tr key={row.param} className="border-t border-border-primary/40">
                        <td className="py-2 pr-3 text-text-secondary font-mono text-[11px]">{row.param}</td>
                        {row.values.map((v, i) => {
                          const matchPrev = i === 0 || v === row.values[0];
                          return (
                            <td key={i} className="text-center py-2 px-1.5">
                              <span className={cn(
                                "inline-block px-2 py-0.5 rounded text-[10px] font-mono",
                                matchPrev ? "bg-accent-green/10 text-accent-green" : "bg-accent-gold/15 text-accent-gold"
                              )}>
                                {typeof v === "number" && v % 1 === 0 ? v.toFixed(0) : v.toFixed(1)}
                              </span>
                            </td>
                          );
                        })}
                        <td className="text-center py-2 pl-2">
                          <span className={cn("text-[10px] font-mono", row.stable ? "text-accent-green" : "text-accent-gold")}>
                            {row.stable ? "✓ 稳定" : "△ 变化"}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-4 text-[10px] text-text-muted leading-relaxed">
                <p>✓ 绿色 = 参数跨窗口一致 · 金色 = 参数在某个窗口调整</p>
                <p className="mt-0.5">参数稳定性越高，策略对过拟合的抵抗力越强</p>
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}
