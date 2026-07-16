"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  ScrollText, TrendingUp, TrendingDown, Target, Clock,
  CheckCircle, XCircle, AlertTriangle, Lightbulb, BarChart3,
  ArrowRight, Sparkles
} from "lucide-react";

interface TradeReview {
  id: string;
  symbol: string;
  side: "BUY" | "SELL";
  entryPrice: number;
  exitPrice: number;
  qty: number;
  pnl: number;
  pnlPercent: number;
  entryTime: string;
  exitTime: string;
  holdingPeriod: string;
  score: number;
  rating: "excellent" | "good" | "fair" | "poor";
  whyBuy: string;
  whySell: string;
  correct: string[];
  mistakes: string[];
  improvements: string[];
}

const reviews: TradeReview[] = [
  {
    id: "r1", symbol: "BTCUSDT", side: "BUY", entryPrice: 66200, exitPrice: 68400,
    qty: 0.3, pnl: 660, pnlPercent: 3.32, entryTime: "2026-07-14 09:30", exitTime: "2026-07-15 14:15",
    holdingPeriod: "1d 4h 45m", score: 85, rating: "excellent",
    whyBuy: "4H级别EMA55回踩确认，成交量放大1.8倍，RSI回撤至42后反弹。链上数据显示交易所BTC余额持续下降。",
    whySell: "15分钟级别出现RSI顶背离，价格触及前高$68,500阻力位。成交量萎缩，动能减弱。",
    correct: ["入场时机选择好，EMA回踩确认后入场", "止损设置在$65,500严格执行", "出场信号及时，顶背离识别准确"],
    mistakes: ["入场仓位偏保守，可增加至0.5 BTC", "出场可分批，锁定部分利润后持有剩余"],
    improvements: ["采用分批建仓策略（40/30/30）", "设置移动止盈追踪趋势"],
  },
  {
    id: "r2", symbol: "ETHUSDT", side: "BUY", entryPrice: 3450, exitPrice: 3520,
    qty: 2, pnl: 140, pnlPercent: 2.03, entryTime: "2026-07-13 14:00", exitTime: "2026-07-14 11:20",
    holdingPeriod: "21h 20m", score: 72, rating: "good",
    whyBuy: "ETH/BTC汇率触及支撑位反弹，ETF资金连续净流入。技术面呈上升三角形突破。",
    whySell: "价格在$3,520附近出现长上影线，RSI 68接近超买区。短期获利了结。",
    correct: ["顺势交易，抓住ETH突破行情", "资金流分析正确判断方向"],
    mistakes: ["入场偏早，未等成交量确认", "止盈设置过于保守，错过后半段涨幅"],
    improvements: ["等待成交量放大信号再入场", "使用ATR追踪止盈代替固定目标"],
  },
  {
    id: "r3", symbol: "SOLUSDT", side: "SELL", entryPrice: 148.5, exitPrice: 145.2,
    qty: 15, pnl: 49.5, pnlPercent: 2.22, entryTime: "2026-07-12 16:00", exitTime: "2026-07-13 09:45",
    holdingPeriod: "17h 45m", score: 65, rating: "fair",
    whyBuy: "SOL在$148上方出现双顶形态，MACD顶背离确认。空头放量突破颈线。",
    whySell: "价格快速下探至$144.5后反弹，短期超卖。空头动能减弱。",
    correct: ["形态识别准确，双顶+MACD背离配合", "空头方向正确"],
    mistakes: ["仓位过重，SOL波动性高应降低仓位", "出场太早，未跟踪趋势到目标位"],
    improvements: ["根据ATR调整仓位大小", "设置趋势跟踪止损，不提前平仓"],
  },
  {
    id: "r4", symbol: "BTCUSDT", side: "SELL", entryPrice: 67800, exitPrice: 68050,
    qty: 0.2, pnl: -50, pnlPercent: -0.37, entryTime: "2026-07-11 10:00", exitTime: "2026-07-11 15:30",
    holdingPeriod: "5h 30m", score: 45, rating: "poor",
    whyBuy: "15分钟级别出现小双顶，RSI超买。但日线趋势仍然向上。",
    whySell: "价格突破前高触发止损，反向亏损。",
    correct: ["严格执行止损纪律"],
    mistakes: ["逆大趋势交易，日线上升中不应做空", "时间框架过小，信号可靠性低", "未设置盈亏比验证（RR<1）"],
    improvements: ["只顺大趋势方向交易", "使用多时间框架确认信号", "确保RR至少1:2再入场"],
  },
];

const ratingConfig = {
  excellent: { label: "优秀", color: "text-accent-green", bg: "bg-accent-green/10", border: "border-accent-green/30" },
  good: { label: "良好", color: "text-accent-blue", bg: "bg-accent-blue/10", border: "border-accent-blue/30" },
  fair: { label: "一般", color: "text-accent-gold", bg: "bg-accent-gold/10", border: "border-accent-gold/30" },
  poor: { label: "需改进", color: "text-accent-red", bg: "bg-accent-red/10", border: "border-accent-red/30" },
};

function StarScore({ score }: { score: number }) {
  const stars = score >= 80 ? 5 : score >= 65 ? 4 : score >= 50 ? 3 : 2;
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} className={cn(s <= stars ? "text-accent-gold" : "text-text-dim")}>★</span>
      ))}
    </div>
  );
}

export default function ReviewPage() {
  const [selected, setSelected] = useState(reviews[0].id);
  const r = reviews.find((rv) => rv.id === selected)!;
  const rc = ratingConfig[r.rating];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI 复盘中心</h1>
          <p className="text-sm text-text-muted mt-1">每笔交易自动分析 · 评分 · 错误识别 · 优化建议</p>
        </div>
        <div className="text-[10px] text-text-muted font-mono bg-bg-card border border-border-primary rounded-lg px-3 py-1.5">
          共 {reviews.length} 笔复盘
        </div>
      </div>

      {/* Trade List */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {reviews.map((rv) => (
          <button key={rv.id} onClick={() => setSelected(rv.id)}
            className={cn("whitespace-nowrap flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-medium border transition-all",
              selected === rv.id
                ? "bg-accent-blue/15 border-accent-blue/40 text-accent-blue"
                : "bg-bg-card border-border-primary text-text-secondary hover:border-border-secondary"
            )}>
            <span className={cn("w-1.5 h-1.5 rounded-full", rv.pnl >= 0 ? "bg-accent-green" : "bg-accent-red")} />
            {rv.symbol} · {rv.side}
            <span className={cn("text-[10px] font-mono", rv.pnl >= 0 ? "text-accent-green" : "text-accent-red")}>
              {rv.pnl >= 0 ? "+" : ""}${rv.pnl}
            </span>
          </button>
        ))}
      </div>

      {/* Detail Review */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Score & Summary */}
        <div className="space-y-4">
          {/* Score Card */}
          <div className={cn("rounded-xl border p-6 text-center", rc.border, rc.bg)}>
            <div className="text-5xl font-bold font-mono" style={{ color: rc.color.replace("text-", "#") === "#text-accent-green" ? "#34d399" : rc.color.replace("text-", "#") === "#text-accent-blue" ? "#60a5fa" : rc.color.replace("text-", "#") === "#text-accent-gold" ? "#fbbf24" : "#fb7185" }}>
              {r.score}
            </div>
            <div className="text-xs text-text-muted mt-1">/ 100</div>
            <div className="flex justify-center mt-2">
              <StarScore score={r.score} />
            </div>
            <div className={cn("mt-2 inline-flex px-3 py-1 rounded-full text-xs font-semibold", rc.bg, rc.color)}>{rc.label}</div>
          </div>

          {/* Trade Info */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-4 space-y-2">
            {[
              { label: "标的", value: r.symbol },
              { label: "方向", value: r.side },
              { label: "数量", value: `${r.qty}` },
              { label: "入场价", value: `$${r.entryPrice.toLocaleString()}` },
              { label: "出场价", value: `$${r.exitPrice.toLocaleString()}` },
              { label: "盈亏", value: `${r.pnl >= 0 ? "+" : ""}$${r.pnl} (${r.pnlPercent >= 0 ? "+" : ""}${r.pnlPercent.toFixed(2)}%)`, color: r.pnl >= 0 ? "text-accent-green" : "text-accent-red" },
              { label: "持仓时间", value: r.holdingPeriod },
              { label: "入场", value: r.entryTime },
              { label: "出场", value: r.exitTime },
            ].map((info) => (
              <div key={info.label} className="flex items-center justify-between text-xs">
                <span className="text-text-muted">{info.label}</span>
                <span className={cn("font-mono font-medium", "color" in info ? (info as any).color : "text-text-primary")}>
                  {info.value}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Analysis */}
        <div className="xl:col-span-2 space-y-4">
          {/* Why Buy / Why Sell */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-primary bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp size={14} className="text-accent-green" />
                <span className="text-xs font-semibold text-text-primary">为什么买入？</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{r.whyBuy}</p>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown size={14} className="text-accent-red" />
                <span className="text-xs font-semibold text-text-primary">为什么卖出？</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">{r.whySell}</p>
            </div>
          </div>

          {/* Correct */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-4">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle size={14} className="text-accent-green" />
              <span className="text-xs font-semibold text-text-primary">做得好的地方</span>
            </div>
            <div className="space-y-2">
              {r.correct.map((c, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="text-accent-green mt-0.5 shrink-0">✓</span>
                  <span className="text-xs text-text-secondary">{c}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Mistakes & Improvements */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border-primary bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={14} className="text-accent-red" />
                <span className="text-xs font-semibold text-text-primary">错误与问题</span>
              </div>
              <div className="space-y-2">
                {r.mistakes.map((m, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-accent-red mt-0.5 shrink-0">✗</span>
                    <span className="text-xs text-text-secondary">{m}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-xl border border-border-primary bg-bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Lightbulb size={14} className="text-accent-gold" />
                <span className="text-xs font-semibold text-text-primary">优化建议</span>
              </div>
              <div className="space-y-2">
                {r.improvements.map((imp, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-accent-gold mt-0.5 shrink-0">→</span>
                    <span className="text-xs text-text-secondary">{imp}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Aggregate Stats */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <BarChart3 size={16} className="text-accent-blue" />
          交易统计汇总
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "平均评分", value: `${(reviews.reduce((s, rv) => s + rv.score, 0) / reviews.length).toFixed(0)}`, color: "text-accent-blue" },
            { label: "总盈亏", value: reviews.reduce((s, rv) => s + rv.pnl, 0) >= 0 ? "+$${...}" : "-$${...}", color: reviews.reduce((s, rv) => s + rv.pnl, 0) >= 0 ? "text-accent-green" : "text-accent-red" },
            { label: "胜率", value: `${((reviews.filter(rv => rv.pnl >= 0).length / reviews.length) * 100).toFixed(0)}%`, color: "text-accent-green" },
            { label: "最常犯错误", value: "逆势交易", color: "text-accent-red" },
          ].map((s) => {
            const totalPnl = reviews.reduce((sum, rv) => sum + rv.pnl, 0);
            return (
              <div key={s.label} className="text-center p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
                <div className={cn("text-base font-bold font-mono",
                  s.label === "总盈亏" ? (totalPnl >= 0 ? "text-accent-green" : "text-accent-red") : s.color
                )}>
                  {s.label === "总盈亏" ? `${totalPnl >= 0 ? "+" : ""}$${Math.abs(totalPnl)}` : s.value}
                </div>
                <div className="text-[10px] text-text-muted mt-0.5">{s.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
