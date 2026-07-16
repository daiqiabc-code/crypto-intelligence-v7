"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FlaskConical, Copy, Check, RefreshCw, Play, Download, Code2, TrendingUp, Shield, Gauge, Sparkles } from "lucide-react";

// ─── Strategy Templates ────────────────────────────────
const strategies = [
  {
    id: "btc-trend-v8",
    name: "BTC Trend Strategy V8",
    description: "多时间框架趋势跟踪策略，EMA金叉确认 + ATR动态止损",
    type: "趋势跟踪",
    timeframe: "4H / 1D",
    rating: 87,
    trades: 342,
    winRate: 64.5,
    profitFactor: 2.31,
    sharpe: 1.86,
    maxDrawdown: 18.2,
    rules: [
      { label: "趋势过滤", value: "日线EMA200上方" },
      { label: "入场信号", value: "4H EMA55回踩 + 成交量确认" },
      { label: "止损", value: "ATR(14) × 2.0" },
      { label: "止盈", value: "RR 1:3 或 EMA21跌破" },
      { label: "仓位管理", value: "基础仓位 × 趋势强度系数" },
    ],
    code: `//@version=5
strategy("BTC Trend Strategy V8", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=100, commission_type=strategy.commission.percent, commission_value=0.04)

// ─── Parameters ───
emaTrendLen = input.int(200, "Trend EMA")
emaEntryLen = input.int(55, "Entry EMA")
emaFastLen = input.int(21, "Fast EMA")
atrLen = input.int(14, "ATR Length")
atrMult = input.float(2.0, "ATR Multiplier")
volThreshold = input.float(1.2, "Volume Threshold")

// ─── Calculations ───
emaTrend = ta.ema(close, emaTrendLen)
emaEntry = ta.ema(close, emaEntryLen)
emaFast = ta.ema(close, emaFastLen)
atr = ta.atr(atrLen)
volRatio = volume / ta.sma(volume, 20)

// ─── Conditions ───
trendUp = close > emaTrend
emaCrossUp = ta.crossover(emaEntry, emaFast)
volumeConfirm = volRatio > volThreshold
pullback = close < emaEntry and close > emaEntry * 0.98

// ─── Entry ───
longCondition = trendUp and emaCrossUp and volumeConfirm
if (longCondition)
    strategy.entry("Long", strategy.long)

// ─── Exit ───
stopLoss = strategy.position_avg_price - atr * atrMult
takeProfit = strategy.position_avg_price + atr * atrMult * 3
if (strategy.position_size > 0)
    strategy.exit("Exit", "Long", stop=stopLoss, limit=takeProfit)
    if (ta.crossunder(close, emaFast))
        strategy.close("Long")

// ─── Visuals ───
plot(emaTrend, "EMA200", color=color.red, linewidth=2)
plot(emaEntry, "EMA55", color=color.blue, linewidth=1)
plot(emaFast, "EMA21", color=color.green, linewidth=1)`,
  },
  {
    id: "eth-momentum-v3",
    name: "ETH Momentum Strategy V3",
    description: "RSI + MACD 动量突破策略，结合波动率过滤",
    type: "动量突破",
    timeframe: "1H / 4H",
    rating: 82,
    trades: 521,
    winRate: 58.2,
    profitFactor: 1.95,
    sharpe: 1.54,
    maxDrawdown: 22.5,
    rules: [
      { label: "趋势过滤", value: "MACD柱线 > 0" },
      { label: "入场信号", value: "RSI(14)突破65 + 成交量放大" },
      { label: "止损", value: "前低 - ATR × 1.5" },
      { label: "止盈", value: "RR 1:2 或 RSI超买" },
      { label: "波动率过滤", value: "ATR% > 1.5% 才交易" },
    ],
    code: `//@version=5
strategy("ETH Momentum V3", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=100, commission_value=0.04)

// ─── Parameters ───
rsiLen = input.int(14, "RSI Length")
rsiThreshold = input.int(65, "RSI Entry Threshold")
macdFast = input.int(12, "MACD Fast")
macdSlow = input.int(26, "MACD Slow")
macdSignal = input.int(9, "MACD Signal")
atrLen = input.int(14, "ATR Length")
volMultiplier = input.float(1.5, "Vol Multiplier")

// ─── Indicators ───
rsi = ta.rsi(close, rsiLen)
[macdLine, signalLine, hist] = ta.macd(close, macdFast, macdSlow, macdSignal)
atr = ta.atr(atrLen)
avgVol = ta.sma(volume, 20)
volatility = atr / close * 100

// ─── Conditions ───
trendUp = hist > 0
rsiBreak = ta.crossover(rsi, rsiThreshold)
volSurge = volume > avgVol * volMultiplier
volFilter = volatility > 1.5

// ─── Entry ───
longCondition = trendUp and rsiBreak and volSurge and volFilter
if (longCondition)
    strategy.entry("Long", strategy.long)

// ─── Exit ───
profitTarget = strategy.position_avg_price + atr * 2
stopLoss = strategy.position_avg_price - atr * 1.5
if (strategy.position_size > 0)
    strategy.exit("Exit", "Long", stop=stopLoss, limit=profitTarget)
    if (rsi > 80)
        strategy.close("Long")

// ─── Visuals ───
hline(80, "Overbought", color=color.red)
hline(20, "Oversold", color=color.green)
plot(rsi, "RSI", color=color.purple)`,
  },
  {
    id: "sol-breakout-v2",
    name: "SOL Breakout Strategy V2",
    description: "通道突破 + 成交量确认 + 趋势强度评分",
    type: "突破策略",
    timeframe: "15m / 1H",
    rating: 79,
    trades: 687,
    winRate: 55.8,
    profitFactor: 1.78,
    sharpe: 1.32,
    maxDrawdown: 25.1,
    rules: [
      { label: "通道", value: "20周期 Donchian Channel" },
      { label: "入场信号", value: "价格突破上轨 + 成交量×2" },
      { label: "止损", value: "通道中轨" },
      { label: "止盈", value: "通道宽度 × 2" },
      { label: "趋势确认", value: "ADX > 25" },
    ],
    code: `//@version=5
strategy("SOL Breakout V2", overlay=true, initial_capital=10000, default_qty_type=strategy.percent_of_equity, default_qty_value=100, commission_value=0.04)

// ─── Parameters ───
dcLen = input.int(20, "Donchian Length")
adxLen = input.int(14, "ADX Length")
adxThreshold = input.int(25, "ADX Threshold")
volMult = input.float(2.0, "Volume Multiplier")
rrRatio = input.float(2.0, "Risk/Reward")

// ─── Indicators ───
dcHigh = ta.highest(high, dcLen)
dcLow = ta.lowest(low, dcLen)
dcMid = (dcHigh + dcLow) / 2
dcWidth = dcHigh - dcLow
[diPlus, diMinus, adx] = ta.dmi(high, low, close, adxLen)
avgVol = ta.sma(volume, 20)

// ─── Conditions ───
breakout = close > dcHigh[1]
volSurge = volume > avgVol * volMult
trendStrong = adx > adxThreshold
longCondition = breakout and volSurge and trendStrong

// ─── Entry ───
if (longCondition)
    strategy.entry("Long", strategy.long)

// ─── Exit ───
entryPrice = strategy.position_avg_price
stopLoss = dcMid
takeProfit = entryPrice + dcWidth * rrRatio
if (strategy.position_size > 0)
    strategy.exit("Exit", "Long", stop=stopLoss, limit=takeProfit)
    if (ta.crossunder(close, dcMid))
        strategy.close("Long")

// ─── Visuals ───
plot(dcHigh, "DC High", color=color.green)
plot(dcMid, "DC Mid", color=color.gray)
plot(dcLow, "DC Low", color=color.red)`,
  },
];

// ─── Strategy Generator Dialog ───
type StrategyType = "趋势跟踪" | "动量策略" | "均值回归" | "突破策略" | "网格策略";

const genSteps = [
  { label: "选择资产", options: ["BTC", "ETH", "SOL"] },
  { label: "策略类型", options: ["趋势跟踪", "动量策略", "均值回归", "突破策略", "网格策略"] },
  { label: "时间框架", options: ["15m", "1H", "4H", "1D"] },
  { label: "风险偏好", options: ["保守", "适中", "激进"] },
];

export default function StrategiesPage() {
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showGenerator, setShowGenerator] = useState(false);
  const [generating, setGenerating] = useState(false);

  const handleCopy = async (id: string, code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const handleGenerate = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      setShowGenerator(false);
    }, 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">策略实验室</h1>
          <p className="text-sm text-text-muted mt-1">AI 自动生成交易策略 · TradingView Pine Script · 部署测试</p>
        </div>
        <button
          onClick={() => setShowGenerator(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 transition-all text-sm font-medium"
        >
          <Sparkles size={16} />
          AI 生成策略
        </button>
      </div>

      {/* AI Generator Modal */}
      {showGenerator && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={() => !generating && setShowGenerator(false)}>
          <div className="bg-bg-card border border-border-primary rounded-2xl p-6 w-[480px] shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-base font-semibold text-text-primary mb-4 flex items-center gap-2">
              <FlaskConical size={18} className="text-accent-blue" />
              AI 自动生成交易策略
            </h2>
            {generating ? (
              <div className="py-12 text-center">
                <RefreshCw size={32} className="mx-auto text-accent-blue animate-spin mb-3" />
                <p className="text-sm text-text-secondary">AI 正在生成策略...</p>
                <p className="text-xs text-text-muted mt-2">分析市场数据 · 优化参数 · 生成 Pine Script</p>
              </div>
            ) : (
              <div className="space-y-4">
                {genSteps.map((step) => (
                  <div key={step.label}>
                    <label className="text-xs text-text-muted mb-1.5 block">{step.label}</label>
                    <div className="flex gap-2">
                      {step.options.map((opt) => (
                        <button key={opt} className="px-3 py-1.5 rounded-lg text-xs border border-border-primary text-text-secondary hover:border-accent-blue hover:text-accent-blue bg-bg-tertiary/30 transition-all">
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
                <button onClick={handleGenerate} className="w-full py-2.5 rounded-lg bg-accent-blue text-white text-sm font-medium hover:bg-accent-blue/80 transition-all">
                  开始生成
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Strategy Cards */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-8">
        {strategies.map((s) => (
          <div key={s.id} className="rounded-xl border border-border-primary bg-bg-card overflow-hidden hover:border-border-secondary transition-all">
            {/* Card Header */}
            <div className="p-5 pb-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn("px-2 py-0.5 rounded text-[10px] font-mono border",
                      s.type === "趋势跟踪" ? "text-accent-green border-accent-green/30 bg-accent-green/5" :
                      s.type === "动量突破" ? "text-accent-blue border-accent-blue/30 bg-accent-blue/5" :
                      "text-accent-purple border-accent-purple/30 bg-accent-purple/5"
                    )}>
                      {s.type}
                    </span>
                    <span className="text-[10px] text-text-muted font-mono">{s.timeframe}</span>
                  </div>
                  <h3 className="text-sm font-semibold text-text-primary mt-1.5">{s.name}</h3>
                  <p className="text-xs text-text-muted mt-1 leading-relaxed">{s.description}</p>
                </div>
                <div className={cn("text-lg font-bold font-mono",
                  s.rating >= 85 ? "text-accent-green" : s.rating >= 75 ? "text-accent-gold" : "text-accent-blue"
                )}>
                  {s.rating}
                </div>
              </div>

              {/* Rules */}
              <div className="mt-3 space-y-1">
                {s.rules.map((r) => (
                  <div key={r.label} className="flex items-center justify-between text-[11px]">
                    <span className="text-text-muted">{r.label}</span>
                    <span className="text-text-secondary font-medium">{r.value}</span>
                  </div>
                ))}
              </div>

              {/* Stats */}
              <div className="grid grid-cols-4 gap-2 mt-4 pt-3 border-t border-border-primary/50">
                {[
                  { label: "交易", value: s.trades },
                  { label: "胜率", value: `${s.winRate}%` },
                  { label: "Sharpe", value: s.sharpe.toFixed(2) },
                  { label: "回撤", value: `${s.maxDrawdown}%` },
                ].map((stat) => (
                  <div key={stat.label} className="text-center">
                    <div className="text-xs font-bold font-mono text-text-primary">{stat.value}</div>
                    <div className="text-[9px] text-text-muted">{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Pine Script Section */}
            <div className="border-t border-border-primary">
              <div className="flex items-center justify-between px-5 py-2 bg-bg-tertiary/30">
                <div className="flex items-center gap-1.5 text-[11px] text-text-muted">
                  <Code2 size={14} className="text-accent-blue" />
                  TradingView Pine Script
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleCopy(s.id, s.code)}
                    className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-muted hover:text-accent-blue hover:bg-bg-hover transition-all"
                  >
                    {copiedId === s.id ? <Check size={12} className="text-accent-green" /> : <Copy size={12} />}
                    {copiedId === s.id ? "已复制" : "复制"}
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-muted hover:text-accent-green hover:bg-bg-hover transition-all">
                    <Play size={12} />
                    测试
                  </button>
                  <button className="flex items-center gap-1 px-2 py-1 rounded text-[10px] text-text-muted hover:text-accent-blue hover:bg-bg-hover transition-all">
                    <Download size={12} />
                    导出
                  </button>
                </div>
              </div>
              <pre className="p-4 overflow-x-auto text-[11px] leading-relaxed font-mono text-text-secondary max-h-[200px] overflow-y-auto bg-black/20">
                <code>{s.code}</code>
              </pre>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
