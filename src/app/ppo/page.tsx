"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  GitBranch, Play, Square, RotateCcw, TrendingUp, TrendingDown,
  Activity, Target, Cpu, Layers, Download, Save, BarChart3,
  Sparkles, Zap
} from "lucide-react";

// ─── Mock PPO Data ────────────────────────────────────
const ppoStatus = {
  state: "training" as "training" | "paused" | "stopped",
  episode: 2845,
  totalEpisodes: 10000,
  avgReward: 182.5,
  bestReward: 425.0,
  loss: 0.042,
  learningRate: 3e-4,
  clipEpsilon: 0.2,
  entropyBeta: 0.01,
  bufferSize: 2048,
  batchSize: 64,
  gamma: 0.99,
  gaeLambda: 0.95,
  epochs: 10,
  startedAt: "2026-07-15 14:00 UTC",
  uptime: "22h 45m",
};

// Reward curve (last 100 episodes, sampled to 20 points)
const rewardCurve = [
  45, 62, 58, 85, 92, 78, 105, 98, 120, 115,
  135, 128, 150, 142, 165, 158, 180, 175, 195, 188,
  210, 205, 225, 218, 240, 235, 255, 248, 265, 260,
  278, 272, 290, 285, 180, 142, 95, 68, 52, 45,
  58, 72, 88, 105, 120, 135, 148, 160, 172, 185,
  195, 208, 218, 230, 240, 252, 262, 275, 285, 295,
  305, 312, 320, 328, 335, 340, 182, 85, 42, 38,
  55, 78, 100, 125, 148, 168, 188, 208, 225, 242,
  258, 272, 285, 298, 310, 322, 335, 345, 355, 365,
  372, 378, 385, 390, 395, 398, 402, 408, 412, 418,
];

const lossCurve = [
  0.85, 0.72, 0.64, 0.58, 0.52, 0.48, 0.44, 0.40, 0.37, 0.34,
  0.32, 0.30, 0.28, 0.26, 0.25, 0.24, 0.23, 0.22, 0.21, 0.20,
  0.195, 0.190, 0.185, 0.180, 0.175, 0.170, 0.165, 0.160, 0.155, 0.150,
  0.145, 0.140, 0.135, 0.130, 0.42, 0.68, 0.72, 0.65, 0.55, 0.48,
  0.42, 0.38, 0.34, 0.31, 0.28, 0.26, 0.24, 0.22, 0.21, 0.20,
  0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12, 0.11, 0.10,
  0.095, 0.090, 0.085, 0.080, 0.075, 0.070, 0.42, 0.72, 0.78, 0.70,
  0.58, 0.50, 0.44, 0.38, 0.34, 0.30, 0.28, 0.26, 0.24, 0.22,
  0.21, 0.20, 0.19, 0.18, 0.17, 0.16, 0.15, 0.14, 0.13, 0.12,
  0.12, 0.11, 0.11, 0.10, 0.10, 0.09, 0.09, 0.08, 0.08, 0.07,
];

const modelVersions = [
  { ver: "v1.0.0", date: "2026-07-10", reward: 185.2, loss: 0.085, episodes: 1200, status: "archived" as const },
  { ver: "v1.1.0", date: "2026-07-12", reward: 245.8, loss: 0.062, episodes: 1800, status: "archived" as const },
  { ver: "v1.2.0", date: "2026-07-14", reward: 312.4, loss: 0.048, episodes: 2400, status: "current" as const },
  { ver: "v1.3.0", date: "2026-07-15", reward: 418.0, loss: 0.042, episodes: 2845, status: "training" as const },
];

const performanceStats = [
  { period: "最近 100 轮", avgReward: 385.2, maxReward: 418.0, winRate: 72.5, sharpe: 2.15 },
  { period: "最近 500 轮", avgReward: 342.8, maxReward: 418.0, winRate: 68.2, sharpe: 1.88 },
  { period: "最近 1000 轮", avgReward: 298.5, maxReward: 418.0, winRate: 64.8, sharpe: 1.62 },
  { period: "全部 2845 轮", avgReward: 182.5, maxReward: 425.0, winRate: 58.4, sharpe: 1.35 },
];

// ─── SVG Charts ──────────────────────────────────────
function LineChartSVG({ data, color, yLabel, height = 160 }: { data: number[]; color: string; yLabel: string; height?: number }) {
  const w = 480, h = height, pad = { top: 15, right: 10, bottom: 22, left: 45 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;
  const minV = Math.min(...data) * 0.95;
  const maxV = Math.max(...data) * 1.05;
  const range = maxV - minV || 1;

  const pts = data.map((d, i) => {
    const x = pad.left + (i / (data.length - 1)) * cw;
    const y = pad.top + ch - ((d - minV) / range) * ch;
    return `${x},${y}`;
  }).join(" ");

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={`grad-${color.replace("#","")}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0.02" />
        </linearGradient>
      </defs>
      {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
        const yP = pad.top + ch - pct * ch;
        const val = (minV + range * pct).toFixed(1);
        return (
          <g key={pct}>
            <line x1={pad.left} y1={yP} x2={w - pad.right} y2={yP} stroke="#1a1a2e" strokeWidth="1" />
            <text x={pad.left - 6} y={yP + 3} textAnchor="end" fill="#555566" fontSize="9" fontFamily="monospace">{val}</text>
          </g>
        );
      })}
      <polygon points={`${pad.left},${pad.top + ch} ${pts} ${pad.left + cw},${pad.top + ch}`} fill={`url(#grad-${color.replace("#","")})`} />
      <polyline points={pts} fill="none" stroke={color} strokeWidth="1.5" strokeLinejoin="round" />
      <text x={w - pad.right} y={h - 2} textAnchor="end" fill="#555566" fontSize="8" fontFamily="monospace">Episode</text>
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

export default function PPOPage() {
  const [training, setTraining] = useState(ppoStatus.state === "training");

  const toggleTraining = () => setTraining((t) => !t);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">PPO 强化学习引擎</h1>
          <p className="text-sm text-text-muted mt-1">Proximal Policy Optimization · Stable Baselines3 · 自主进化交易策略</p>
        </div>
        <div className="flex items-center gap-2">
          <div className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono border",
            training ? "text-accent-green border-accent-green/30 bg-accent-green/5" :
                       "text-accent-gold border-accent-gold/30 bg-accent-gold/5"
          )}>
            <span className={cn("w-2 h-2 rounded-full", training ? "bg-accent-green animate-pulse" : "bg-accent-gold")} />
            {training ? "TRAINING" : "PAUSED"}
          </div>
          <button
            onClick={toggleTraining}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium border transition-all",
              training
                ? "text-accent-red border-accent-red/30 bg-accent-red/5 hover:bg-accent-red/10"
                : "text-accent-green border-accent-green/30 bg-accent-green/5 hover:bg-accent-green/10"
            )}
          >
            {training ? <Square size={12} /> : <Play size={12} />}
            {training ? "暂停" : "继续训练"}
          </button>
        </div>
      </div>

      {/* Status + Metrics */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-4">
        {/* Training Progress */}
        <div className="xl:col-span-1 rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Activity size={16} className="text-accent-blue" />
            训练进度
          </h2>
          <div className="text-center mb-3">
            <div className="text-3xl font-bold font-mono text-accent-blue">{ppoStatus.episode.toLocaleString()}</div>
            <div className="text-[10px] text-text-muted mt-0.5">/ {ppoStatus.totalEpisodes.toLocaleString()} Episodes</div>
          </div>
          <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden mb-4">
            <div className="h-full rounded-full bg-gradient-to-r from-accent-blue to-accent-purple transition-all"
              style={{ width: `${(ppoStatus.episode / ppoStatus.totalEpisodes) * 100}%` }} />
          </div>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-text-muted">运行时长</span><span className="font-mono text-text-primary">{ppoStatus.uptime}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">学习率</span><span className="font-mono text-text-primary">{ppoStatus.learningRate.toExponential()}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">Clip ε</span><span className="font-mono text-text-primary">{ppoStatus.clipEpsilon}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">γ (Gamma)</span><span className="font-mono text-text-primary">{ppoStatus.gamma}</span></div>
            <div className="flex justify-between"><span className="text-text-muted">GAE λ</span><span className="font-mono text-text-primary">{ppoStatus.gaeLambda}</span></div>
          </div>
        </div>

        {/* Reward Curve */}
        <div className="xl:col-span-3 rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-accent-green" />
            奖励曲线 (Reward)
          </h2>
          <LineChartSVG data={rewardCurve} color="#34d399" yLabel="Reward" />

          {/* Key metrics under chart */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            <MetricCard label="当前平均奖励" value={ppoStatus.avgReward.toFixed(1)} icon={<Target size={14} />} color="text-accent-green" />
            <MetricCard label="历史最高奖励" value={ppoStatus.bestReward.toFixed(1)} icon={<Sparkles size={14} />} color="text-accent-gold" />
            <MetricCard label="当前 Loss" value={ppoStatus.loss.toFixed(4)} icon={<Activity size={14} />} color={ppoStatus.loss < 0.1 ? "text-accent-green" : "text-accent-gold"} />
            <MetricCard label="Buffer Size" value={`${ppoStatus.bufferSize}`} icon={<Layers size={14} />} />
          </div>
        </div>
      </div>

      {/* Performance + Loss + Versions */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Performance Table */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <BarChart3 size={16} className="text-accent-blue" />
            分阶段表现
          </h2>
          <div className="space-y-2">
            {performanceStats.map((ps) => (
              <div key={ps.period} className="rounded-lg bg-bg-tertiary/30 border border-border-primary/40 p-3">
                <div className="text-[11px] text-text-muted mb-2">{ps.period}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex justify-between"><span className="text-text-muted">Avg Reward</span><span className="font-mono text-accent-green">{ps.avgReward.toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Max Reward</span><span className="font-mono text-accent-gold">{ps.maxReward.toFixed(1)}</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">胜率</span><span className="font-mono text-text-primary">{ps.winRate.toFixed(1)}%</span></div>
                  <div className="flex justify-between"><span className="text-text-muted">Sharpe</span><span className={cn("font-mono", ps.sharpe >= 1.5 ? "text-accent-green" : "text-accent-gold")}>{ps.sharpe.toFixed(2)}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Loss Curve */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <TrendingDown size={16} className="text-accent-red" />
            Loss 曲线
          </h2>
          <LineChartSVG data={lossCurve} color="#fb7185" yLabel="Loss" />
          <div className="mt-3 p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
            <div className="flex items-center justify-between text-xs">
              <span className="text-text-muted">当前 Loss</span>
              <span className="font-mono text-accent-green">{ppoStatus.loss.toFixed(4)}</span>
            </div>
            <div className="flex items-center justify-between text-xs mt-1">
              <span className="text-text-muted">收敛状态</span>
              <span className="text-accent-green font-medium">收敛中</span>
            </div>
          </div>
        </div>

        {/* Model Versions */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
            <Save size={16} className="text-accent-purple" />
            模型版本
          </h2>
          <div className="space-y-2">
            {modelVersions.map((mv) => (
              <div key={mv.ver} className={cn(
                "flex items-center justify-between p-3 rounded-lg border transition-all",
                mv.status === "current" ? "bg-accent-blue/5 border-accent-blue/30" :
                mv.status === "training" ? "bg-accent-green/5 border-accent-green/30" :
                "bg-bg-tertiary/30 border-border-primary/40"
              )}>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold font-mono text-text-primary">{mv.ver}</span>
                    <span className={cn(
                      "text-[9px] px-1.5 py-0.5 rounded font-mono",
                      mv.status === "current" ? "bg-accent-blue/15 text-accent-blue" :
                      mv.status === "training" ? "bg-accent-green/15 text-accent-green" :
                      "bg-bg-tertiary text-text-muted"
                    )}>{mv.status === "current" ? "当前" : mv.status === "training" ? "训练中" : "归档"}</span>
                  </div>
                  <div className="text-[10px] text-text-muted mt-0.5">{mv.date} · {mv.episodes} episodes</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-mono text-accent-green">R: {mv.reward.toFixed(1)}</div>
                  <div className="text-[10px] font-mono text-text-muted">L: {mv.loss.toFixed(4)}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-border-primary text-text-secondary hover:text-accent-blue hover:border-accent-blue transition-all text-xs">
              <Download size={12} /> 导出模型
            </button>
            <button className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg border border-border-primary text-text-secondary hover:text-accent-green hover:border-accent-green transition-all text-xs">
              <Save size={12} /> 保存检查点
            </button>
          </div>
        </div>
      </div>

      {/* Strategy Performance from PPO */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <h2 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
          <Zap size={16} className="text-accent-gold" />
          PPO 策略表现 (模拟交易验证)
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: "年化收益", value: "+38.2%", color: "text-accent-green" },
            { label: "Sharpe", value: "1.88", color: "text-accent-green" },
            { label: "Calmar", value: "1.45", color: "text-accent-green" },
            { label: "最大回撤", value: "-22.5%", color: "text-accent-red" },
            { label: "胜率", value: "64.2%", color: "text-accent-blue" },
            { label: "盈亏比", value: "2.15", color: "text-accent-blue" },
            { label: "总交易", value: "1,284", color: "text-text-primary" },
            { label: "日均交易", value: "8.5", color: "text-text-primary" },
          ].map((s) => (
            <div key={s.label} className="text-center p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
              <div className={cn("text-lg font-bold font-mono", s.color)}>{s.value}</div>
              <div className="text-[10px] text-text-muted mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
