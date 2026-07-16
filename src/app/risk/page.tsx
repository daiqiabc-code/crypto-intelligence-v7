"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Shield, ShieldAlert, ShieldCheck, ShieldX, AlertTriangle,
  Ban, Activity, TrendingDown, Gauge, Lock, Unlock,
  Power, PowerOff, Bell, BellOff, BarChart3
} from "lucide-react";

const triggers = [
  { id: "daily-loss", label: "日亏损 > 5%", threshold: "5%", current: "2.1%", status: "safe" as const, icon: <TrendingDown size={14} /> },
  { id: "drawdown", label: "最大回撤 > 20%", threshold: "20%", current: "8.5%", status: "safe" as const, icon: <Activity size={14} /> },
  { id: "volatility", label: "市场异常波动", threshold: "ATR x3", current: "正常", status: "safe" as const, icon: <BarChart3 size={14} /> },
  { id: "model-fail", label: "模型失效检测", threshold: "Score<60", current: "78", status: "safe" as const, icon: <Gauge size={14} /> },
  { id: "leverage", label: "杠杆超限", threshold: "3x max", current: "1x", status: "safe" as const, icon: <Activity size={14} /> },
];

const riskMetrics = [
  { label: "VaR (95%)", value: "$1,850", pct: "3.7%", color: "text-accent-green" },
  { label: "CVaR (95%)", value: "$2,420", pct: "4.8%", color: "text-accent-gold" },
  { label: "最大回撤", value: "$4,250", pct: "8.5%", color: "text-accent-gold" },
  { label: "波动率(年化)", value: "42.5%", pct: "—", color: "text-accent-blue" },
  { label: "Sharpe Ratio", value: "1.86", pct: "—", color: "text-accent-green" },
  { label: "Calmar Ratio", value: "1.52", pct: "—", color: "text-accent-green" },
  { label: "杠杆倍数", value: "1.0x", pct: "—", color: "text-accent-blue" },
  { label: "总风险敞口", value: "$50,000", pct: "100%", color: "text-accent-cyan" },
];

const positionLimits = [
  { asset: "BTC", maxSize: "1.0", current: "0.5", usage: 50, status: "safe" as const },
  { asset: "ETH", maxSize: "10.0", current: "2.0", usage: 20, status: "safe" as const },
  { asset: "SOL", maxSize: "50.0", current: "0", usage: 0, status: "safe" as const },
  { asset: "NVDA", maxSize: "100", current: "0", usage: 0, status: "safe" as const },
  { asset: "QQQ", maxSize: "50", current: "0", usage: 0, status: "safe" as const },
];

const guardianLog = [
  { time: "12:45:22", action: "日常巡检", result: "正常" as const },
  { time: "12:30:15", action: "风险指标计算", result: "正常" as const },
  { time: "12:15:08", action: "杠杆检查", result: "安全" as const },
  { time: "11:50:33", action: "波动率扫描", result: "正常" as const },
  { time: "11:30:00", action: "熔断阈值校验", result: "通过" as const },
  { time: "11:15:42", action: "模型健康度检查", result: "正常" as const },
];

export default function RiskPage() {
  const [guardianActive, setGuardianActive] = useState(true);
  const [guardianLocked, setGuardianLocked] = useState(false);

  const safeCount = triggers.filter((t) => t.status === "safe").length;
  const dangerCount = triggers.filter((t) => t.status === "danger").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">风险控制中心</h1>
          <p className="text-sm text-text-muted mt-1">Guardian AI · 熔断机制 · 仓位限制 · 实时监控</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border",
            guardianLocked ? "text-accent-red border-accent-red/30 bg-accent-red/5" :
            guardianActive ? "text-accent-green border-accent-green/30 bg-accent-green/5" : "text-accent-gold border-accent-gold/30 bg-accent-gold/5"
          )}>
            {guardianLocked ? <Lock size={12} /> : guardianActive ? <ShieldCheck size={12} /> : <ShieldAlert size={12} />}
            {guardianLocked ? "交易已锁定" : guardianActive ? "监控中" : "已暂停"}
          </div>
          <button onClick={() => setGuardianActive(!guardianActive)}
            className={cn("px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
              guardianActive ? "text-accent-gold border-accent-gold/30 bg-accent-gold/5" : "text-accent-green border-accent-green/30 bg-accent-green/5"
            )}>
            {guardianActive ? "暂停 Guardian" : "激活 Guardian"}
          </button>
        </div>
      </div>

      {/* Guardian AI Status */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={cn("flex items-center justify-center w-12 h-12 rounded-2xl",
              guardianLocked ? "bg-accent-red/20" : guardianActive ? "bg-accent-green/20" : "bg-accent-gold/20"
            )}>
              {guardianLocked ? <ShieldX size={24} className="text-accent-red" /> :
               guardianActive ? <ShieldCheck size={24} className="text-accent-green" /> :
               <ShieldAlert size={24} className="text-accent-gold" />}
            </div>
            <div>
              <h2 className="text-base font-semibold text-text-primary">Guardian AI</h2>
              <p className="text-xs text-text-muted mt-0.5">最高权限 · 自动熔断 · 异常交易停止</p>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-2">
              {guardianLocked ? (
                <button onClick={() => setGuardianLocked(false)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-red/10 text-accent-red border border-accent-red/30 text-xs hover:bg-accent-red/20 transition-all">
                  <Unlock size={12} /> 解锁交易
                </button>
              ) : (
                <button onClick={() => setGuardianLocked(true)}
                  className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-accent-gold/10 text-accent-gold border border-accent-gold/30 text-xs hover:bg-accent-gold/20 transition-all">
                  <Lock size={12} /> 紧急锁定
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Guardian Status Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <div className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-3 text-center">
            <div className="text-xs text-text-muted mb-1">熔断状态</div>
            <div className="text-lg font-bold font-mono text-accent-green">正常</div>
            <div className="text-[10px] text-text-muted mt-0.5">0 次触发</div>
          </div>
          <div className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-3 text-center">
            <div className="text-xs text-text-muted mb-1">安全阈值</div>
            <div className="text-lg font-bold font-mono text-accent-blue">{safeCount}/{triggers.length}</div>
            <div className="text-[10px] text-text-muted mt-0.5">通过</div>
          </div>
          <div className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-3 text-center">
            <div className="text-xs text-text-muted mb-1">风险等级</div>
            <div className="text-lg font-bold font-mono text-accent-green">低风险</div>
            <div className="text-[10px] text-text-muted mt-0.5">综合评分 82</div>
          </div>
          <div className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-3 text-center">
            <div className="text-xs text-text-muted mb-1">模型健康度</div>
            <div className="text-lg font-bold font-mono text-accent-green">98%</div>
            <div className="text-[10px] text-text-muted mt-0.5">所有 Agent 正常</div>
          </div>
        </div>

        {/* Trigger List */}
        <h3 className="text-xs font-semibold text-text-primary mb-2">熔断触发条件</h3>
        <div className="space-y-1.5">
          {triggers.map((t) => (
            <div key={t.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
              <div className="flex items-center gap-2">
                <span className={t.status === "safe" ? "text-accent-green" : "text-accent-red"}>{t.icon}</span>
                <span className="text-xs text-text-secondary">{t.label}</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[10px] text-text-muted font-mono">阈值: {t.threshold}</span>
                <span className={cn("text-xs font-mono", t.status === "safe" ? "text-accent-green" : "text-accent-red")}>
                  {t.current}
                </span>
                <span className={cn("w-2 h-2 rounded-full", t.status === "safe" ? "bg-accent-green" : "bg-accent-red animate-pulse")} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Metrics + Position Limits */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Risk Metrics */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Activity size={16} className="text-accent-blue" />
            风险指标
          </h2>
          <div className="grid grid-cols-2 gap-2">
            {riskMetrics.map((m) => (
              <div key={m.label} className="flex items-center justify-between p-2.5 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
                <div>
                  <div className="text-[10px] text-text-muted">{m.label}</div>
                  <div className={cn("text-sm font-bold font-mono", m.color)}>{m.value}</div>
                </div>
                {m.pct !== "—" && <span className={cn("text-[11px] font-mono", m.color)}>{m.pct}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Position Limits */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <BarChart3 size={16} className="text-accent-purple" />
            仓位限额
          </h2>
          <div className="space-y-2">
            {positionLimits.map((pl) => (
              <div key={pl.asset} className="p-2.5 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-text-primary font-mono">{pl.asset}</span>
                    <span className="text-[10px] text-text-muted font-mono">最大 {pl.maxSize}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-text-primary">{pl.current} / {pl.maxSize}</span>
                    <span className={cn("text-[10px] font-mono", pl.status === "safe" ? "text-accent-green" : "text-accent-red")}>{pl.usage}%</span>
                  </div>
                </div>
                <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                  <div className={cn("h-full rounded-full transition-all", pl.usage > 80 ? "bg-accent-red" : pl.usage > 50 ? "bg-accent-gold" : "bg-accent-green")}
                    style={{ width: `${pl.usage}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Guardian Log */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Bell size={16} className="text-text-muted" />
          Guardian AI 操作日志
        </h2>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-text-muted font-mono border-b border-border-primary/50">
                <th className="text-left py-2 pr-4">时间</th>
                <th className="text-left py-2 pr-4">操作</th>
                <th className="text-right py-2">结果</th>
              </tr>
            </thead>
            <tbody>
              {guardianLog.map((entry, i) => (
                <tr key={i} className="border-b border-border-primary/20">
                  <td className="py-2 pr-4 font-mono text-text-muted">{entry.time}</td>
                  <td className="py-2 pr-4 text-text-primary">{entry.action}</td>
                  <td className="py-2 text-right">
                    <span className={cn("text-[10px] font-mono px-1.5 py-0.5 rounded",
                      entry.result === "正常" || entry.result === "安全" || entry.result === "通过" ? "bg-accent-green/10 text-accent-green" :
                      "bg-accent-red/10 text-accent-red"
                    )}>{entry.result}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
