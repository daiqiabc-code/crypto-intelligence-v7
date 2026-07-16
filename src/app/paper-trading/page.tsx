"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import {
  TestTube, Wallet, TrendingUp, TrendingDown, Clock, DollarSign,
  ArrowDownUp, Plus, X, Check, Search, Timer, BarChart3,
  Play, RotateCcw, RefreshCw
} from "lucide-react";

// ─── Types ────────────────────────────────────────────
type Exchange = "Binance" | "OKX" | "IBKR";
type OrderSide = "BUY" | "SELL";
type OrderType = "MARKET" | "LIMIT";

interface Position {
  id: string;
  symbol: string;
  side: OrderSide;
  qty: number;
  entryPrice: number;
  markPrice: number;
  pnl: number;
  pnlPercent: number;
  time: string;
}

interface Trade {
  id: string;
  symbol: string;
  side: OrderSide;
  qty: number;
  price: number;
  pnl: number;
  time: string;
  status: "filled" | "partial" | "canceled";
}

// ─── Mock Data ────────────────────────────────────────
const exchanges: Exchange[] = ["Binance", "OKX", "IBKR"];

const initialPositions: Position[] = [
  { id: "p1", symbol: "BTCUSDT", side: "BUY", qty: 0.5, entryPrice: 67450, markPrice: 67842, pnl: 196, pnlPercent: 0.58, time: "2026-07-14 09:30" },
  { id: "p2", symbol: "ETHUSDT", side: "BUY", qty: 2.0, entryPrice: 3480, markPrice: 3522, pnl: 84, pnlPercent: 1.21, time: "2026-07-15 14:15" },
];

const initialTrades: Trade[] = [
  { id: "t1", symbol: "SOLUSDT", side: "BUY", qty: 10, price: 144.5, pnl: 0, time: "2026-07-16 10:30", status: "filled" },
  { id: "t2", symbol: "BTCUSDT", side: "SELL", qty: 0.2, price: 67800, pnl: 285, time: "2026-07-16 09:15", status: "filled" },
  { id: "t3", symbol: "ETHUSDT", side: "BUY", qty: 1.0, price: 3490, pnl: 0, time: "2026-07-15 16:45", status: "filled" },
  { id: "t4", symbol: "SOLUSDT", side: "SELL", qty: 5, price: 146.2, pnl: -12.5, time: "2026-07-15 14:00", status: "filled" },
  { id: "t5", symbol: "BTCUSDT", side: "BUY", qty: 0.3, price: 67200, pnl: 0, time: "2026-07-15 11:20", status: "filled" },
  { id: "t6", symbol: "ETHUSDT", side: "SELL", qty: 0.5, price: 3510, pnl: 45, time: "2026-07-14 15:00", status: "filled" },
];

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"] as const;

// ─── Helpers ──────────────────────────────────────────
function formatUSD(n: number): string {
  const abs = Math.abs(n);
  const fmt = abs >= 1000 ? abs.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : abs.toFixed(2);
  return n < 0 ? `-$${fmt}` : `$${fmt}`;
}

export default function PaperTradingPage() {
  const [exchange, setExchange] = useState<Exchange>("Binance");
  const [positions, setPositions] = useState<Position[]>(initialPositions);
  const [trades, setTrades] = useState<Trade[]>(initialTrades);
  const [balance, setBalance] = useState(50000);
  const [startBalance] = useState(50000);

  // Order form
  const [orderSymbol, setOrderSymbol] = useState("BTCUSDT");
  const [orderSide, setOrderSide] = useState<OrderSide>("BUY");
  const [orderType, setOrderType] = useState<OrderType>("MARKET");
  const [orderQty, setOrderQty] = useState("");
  const [orderPrice, setOrderPrice] = useState("");

  // Verification timer
  const [startDate] = useState(() => new Date("2026-07-01"));
  const [verificationDays] = useState(60);

  const today = new Date();
  const daysElapsed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));
  const progressPct = Math.min(100, (daysElapsed / verificationDays) * 100);
  const remainingDays = Math.max(0, verificationDays - daysElapsed);

  // Account stats
  const totalPnl = useMemo(() => {
    const posPnl = positions.reduce((s, p) => s + p.pnl, 0);
    const tradePnl = trades.filter((t) => t.status === "filled").reduce((s, t) => s + t.pnl, 0);
    return posPnl + tradePnl;
  }, [positions, trades]);

  const equity = balance + totalPnl;
  const dailyPnl = 245.8;

  const handlePlaceOrder = () => {
    const qty = parseFloat(orderQty);
    if (!qty || qty <= 0) return;

    const price = orderType === "MARKET"
      ? (orderSymbol === "BTCUSDT" ? 67842 : orderSymbol === "ETHUSDT" ? 3522 : 145.3)
      : parseFloat(orderPrice);

    const now = new Date().toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" });

    const newTrade: Trade = {
      id: `t${Date.now()}`,
      symbol: orderSymbol,
      side: orderSide,
      qty,
      price,
      pnl: 0,
      time: now,
      status: "filled",
    };

    setTrades((prev) => [newTrade, ...prev]);

    // Add to positions
    const existingIdx = positions.findIndex((p) => p.symbol === orderSymbol && p.side === orderSide);
    if (existingIdx >= 0) {
      setPositions((prev) => prev.map((p, i) =>
        i === existingIdx ? { ...p, qty: p.qty + qty } : p
      ));
    } else {
      setPositions((prev) => [{
        id: `p${Date.now()}`,
        symbol: orderSymbol,
        side: orderSide,
        qty,
        entryPrice: price,
        markPrice: price,
        pnl: 0,
        pnlPercent: 0,
        time: now,
      }, ...prev]);
    }

    setOrderQty("");
    setOrderPrice("");
  };

  const handleClosePosition = (id: string) => {
    const pos = positions.find((p) => p.id === id);
    if (!pos) return;

    const closePnl = pos.pnl;
    setPositions((prev) => prev.filter((p) => p.id !== id));
    setTrades((prev) => [{
      id: `t${Date.now()}`,
      symbol: pos.symbol,
      side: pos.side === "BUY" ? "SELL" : "BUY",
      qty: pos.qty,
      price: pos.markPrice,
      pnl: closePnl,
      time: new Date().toLocaleString("zh-CN", { month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" }),
      status: "filled",
    }, ...prev]);
  };

  const handleReset = () => {
    setPositions([]);
    setTrades([]);
    setBalance(50000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">模拟交易 (Paper Trading)</h1>
          <p className="text-sm text-text-muted mt-1">模拟 OKX · Binance · IBKR · {verificationDays}天验证期</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={handleReset} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border-primary text-xs text-text-muted hover:text-accent-red hover:border-accent-red transition-all">
            <RotateCcw size={12} /> 重置
          </button>
        </div>
      </div>

      {/* Exchange Selector + Verification Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 bg-bg-card border border-border-primary rounded-xl p-1">
          {exchanges.map((ex) => (
            <button
              key={ex}
              onClick={() => setExchange(ex)}
              className={cn("px-4 py-2 rounded-lg text-xs font-medium font-mono transition-all",
                exchange === ex ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted hover:text-text-primary"
              )}
            >{ex}</button>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs">
          <div className="flex items-center gap-2 text-text-muted">
            <Timer size={14} className="text-accent-gold" />
            <span className="font-mono">验证期: 第 {daysElapsed} / {verificationDays} 天</span>
          </div>
          <div className="w-24 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
            <div className="h-full rounded-full bg-accent-gold" style={{ width: `${progressPct}%` }} />
          </div>
          <span className={cn("font-mono font-medium", remainingDays > 0 ? "text-accent-gold" : "text-accent-green")}>
            {remainingDays > 0 ? `剩余 ${remainingDays} 天` : "✅ 通过验证"}
          </span>
        </div>
      </div>

      {/* Account Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        {[
          { label: "初始余额", value: formatUSD(startBalance), icon: <Wallet size={14} />, color: "text-text-primary" },
          { label: "当前权益", value: formatUSD(equity), icon: <DollarSign size={14} />, color: equity >= startBalance ? "text-accent-green" : "text-accent-red" },
          { label: "总盈亏", value: `${totalPnl >= 0 ? "+" : ""}${formatUSD(totalPnl)}`, icon: <TrendingUp size={14} />, color: totalPnl >= 0 ? "text-accent-green" : "text-accent-red" },
          { label: "每日盈亏", value: `+${formatUSD(dailyPnl)}`, icon: <BarChart3 size={14} />, color: "text-accent-green" },
          { label: "持仓数量", value: `${positions.length}`, icon: <ArrowDownUp size={14} />, color: "text-accent-blue" },
          { label: "总交易", value: `${trades.filter(t => t.status === "filled").length}`, icon: <RefreshCw size={14} /> },
        ].map((s) => (
          <div key={s.label} className="rounded-lg border border-border-primary bg-bg-card p-3">
            <div className="flex items-center gap-1.5 text-[10px] text-text-muted mb-1">
              <span className={s.color}>{s.icon}</span>
              {s.label}
            </div>
            <div className={cn("text-sm font-bold font-mono", s.color)}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Order Form + Open Positions */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Order Entry */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Plus size={16} className="text-accent-blue" />
            下单
          </h2>

          {/* Symbol */}
          <div className="flex gap-1 mb-3">
            {symbols.map((s) => (
              <button key={s} onClick={() => setOrderSymbol(s)}
                className={cn("px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex-1",
                  orderSymbol === s ? "bg-accent-blue/15 text-accent-blue border border-accent-blue/30" : "bg-bg-tertiary/30 text-text-muted border border-border-primary/50 hover:text-text-primary"
                )}>{s}</button>
            ))}
          </div>

          {/* Side */}
          <div className="flex gap-2 mb-3">
            <button onClick={() => setOrderSide("BUY")}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold font-mono transition-all border",
                orderSide === "BUY" ? "bg-accent-green/15 text-accent-green border-accent-green/40" : "bg-bg-tertiary/30 text-text-muted border-border-primary/50"
              )}>BUY</button>
            <button onClick={() => setOrderSide("SELL")}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold font-mono transition-all border",
                orderSide === "SELL" ? "bg-accent-red/15 text-accent-red border-accent-red/40" : "bg-bg-tertiary/30 text-text-muted border-border-primary/50"
              )}>SELL</button>
          </div>

          {/* Type */}
          <div className="flex gap-2 mb-3">
            {(["MARKET", "LIMIT"] as const).map((t) => (
              <button key={t} onClick={() => { setOrderType(t); if (t === "MARKET") setOrderPrice(""); }}
                className={cn("flex-1 py-1.5 rounded-lg text-[11px] font-mono transition-all border",
                  orderType === t ? "bg-bg-hover text-text-primary border-border-secondary" : "bg-bg-tertiary/30 text-text-muted border-border-primary/50"
                )}>{t === "MARKET" ? "市价单" : "限价单"}</button>
            ))}
          </div>

          {/* Quantity */}
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">数量</label>
              <input
                type="number" step="0.01" placeholder="0.00"
                value={orderQty} onChange={(e) => setOrderQty(e.target.value)}
                className="w-full bg-bg-tertiary/50 border border-border-primary rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue"
              />
            </div>
            {orderType === "LIMIT" && (
              <div>
                <label className="text-[11px] text-text-muted mb-1 block">限价 (USD)</label>
                <input
                  type="number" placeholder="0.00"
                  value={orderPrice} onChange={(e) => setOrderPrice(e.target.value)}
                  className="w-full bg-bg-tertiary/50 border border-border-primary rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue"
                />
              </div>
            )}
          </div>

          <button
            onClick={handlePlaceOrder}
            disabled={!orderQty || parseFloat(orderQty) <= 0}
            className={cn(
              "w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-all border",
              orderSide === "BUY"
                ? "bg-accent-green/15 text-accent-green border-accent-green/30 hover:bg-accent-green/25"
                : "bg-accent-red/15 text-accent-red border-accent-red/30 hover:bg-accent-red/25",
              (!orderQty || parseFloat(orderQty) <= 0) && "opacity-50 cursor-not-allowed"
            )}
          >
            {orderSide === "BUY" ? "买入" : "卖出"} {orderQty || "0"} {orderSymbol.replace("USDT", "")}
          </button>
        </div>

        {/* Open Positions */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Wallet size={16} className="text-accent-purple" />
            当前持仓 ({positions.length})
          </h2>
          {positions.length === 0 ? (
            <div className="py-8 text-center text-sm text-text-muted">暂无持仓</div>
          ) : (
            <div className="space-y-2">
              {positions.map((pos) => (
                <div key={pos.id} className="rounded-lg bg-bg-tertiary/30 border border-border-primary/40 p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold font-mono text-text-primary">{pos.symbol}</span>
                      <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-mono",
                        pos.side === "BUY" ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
                      )}>{pos.side}</span>
                    </div>
                    <button onClick={() => handleClosePosition(pos.id)}
                      className="text-[10px] text-text-muted hover:text-accent-red px-2 py-0.5 rounded border border-border-primary hover:border-accent-red/30 transition-all">
                      平仓
                    </button>
                  </div>
                  <div className="grid grid-cols-4 gap-2 text-[11px]">
                    <div><span className="text-text-muted">数量</span><div className="font-mono text-text-primary">{pos.qty}</div></div>
                    <div><span className="text-text-muted">开仓价</span><div className="font-mono text-text-primary">{formatUSD(pos.entryPrice)}</div></div>
                    <div><span className="text-text-muted">标记价</span><div className="font-mono text-text-primary">{formatUSD(pos.markPrice)}</div></div>
                    <div>
                      <span className="text-text-muted">盈亏</span>
                      <div className={cn("font-mono", pos.pnl >= 0 ? "text-accent-green" : "text-accent-red")}>
                        {pos.pnl >= 0 ? "+" : ""}{formatUSD(pos.pnl)}
                        <span className="text-[10px] ml-1">({pos.pnlPercent >= 0 ? "+" : ""}{pos.pnlPercent.toFixed(2)}%)</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trade History */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Clock size={16} className="text-text-muted" />
            交易日志
          </h2>
          <span className="text-[10px] text-text-muted font-mono">共 {trades.length} 笔</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted font-mono border-b border-border-primary/50">
                <th className="text-left py-2 pr-3">时间</th>
                <th className="text-left py-2 pr-3">标的</th>
                <th className="text-center py-2 pr-3">方向</th>
                <th className="text-right py-2 pr-3">数量</th>
                <th className="text-right py-2 pr-3">价格</th>
                <th className="text-right py-2 pr-3">盈亏</th>
                <th className="text-center py-2">状态</th>
              </tr>
            </thead>
            <tbody>
              {trades.map((t) => (
                <tr key={t.id} className="border-b border-border-primary/30 hover:bg-bg-hover/30 transition-colors">
                  <td className="py-2.5 pr-3 text-text-muted font-mono">{t.time}</td>
                  <td className="py-2.5 pr-3 font-mono text-text-primary">{t.symbol}</td>
                  <td className="py-2.5 pr-3 text-center">
                    <span className={cn("px-1.5 py-0.5 rounded text-[10px] font-mono",
                      t.side === "BUY" ? "bg-accent-green/10 text-accent-green" : "bg-accent-red/10 text-accent-red"
                    )}>{t.side}</span>
                  </td>
                  <td className="py-2.5 pr-3 text-right font-mono text-text-primary">{t.qty}</td>
                  <td className="py-2.5 pr-3 text-right font-mono text-text-primary">{formatUSD(t.price)}</td>
                  <td className={cn("py-2.5 pr-3 text-right font-mono", t.pnl >= 0 ? "text-accent-green" : t.pnl < 0 ? "text-accent-red" : "text-text-muted")}>
                    {t.pnl === 0 ? "—" : `${t.pnl >= 0 ? "+" : ""}${formatUSD(t.pnl)}`}
                  </td>
                  <td className="py-2.5 text-center">
                    <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded",
                      t.status === "filled" ? "text-accent-green bg-accent-green/10" :
                      t.status === "partial" ? "text-accent-gold bg-accent-gold/10" :
                      "text-text-muted bg-bg-tertiary"
                    )}>
                      {t.status === "filled" ? "成交" : t.status === "partial" ? "部分" : "已取消"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Status */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Check size={18} className={progressPct >= 100 ? "text-accent-green" : "text-accent-gold"} />
            <div>
              <div className="text-sm font-medium text-text-primary">
                {progressPct >= 100 ? "✅ 30-90 天验证期已完成" : `📋 验证期进行中 — 第 ${daysElapsed} / ${verificationDays} 天`}
              </div>
              <p className="text-xs text-text-muted mt-0.5">
                {progressPct >= 100
                  ? "该策略已通过模拟验证，可申请实盘交易。"
                  : `还需 ${remainingDays} 天完成验证。验证通过后策略可部署至实盘。`}
              </p>
            </div>
          </div>
          <div className="text-right">
            <div className={cn("text-lg font-bold font-mono", progressPct >= 100 ? "text-accent-green" : "text-accent-gold")}>
              {progressPct.toFixed(0)}%
            </div>
            <div className="text-[10px] text-text-muted">完成度</div>
          </div>
        </div>
      </div>
    </div>
  );
}
