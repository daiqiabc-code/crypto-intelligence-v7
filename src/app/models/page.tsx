"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  BrainCircuit, TrendingUp, TrendingDown, BarChart3, Activity,
  RefreshCw, Play, RotateCcw, AlertTriangle, Target, Cpu, Layers,
  GitBranch, Sigma, ChartLine, Sparkles
} from "lucide-react";

// ─── XGBoost Mock Data ────────────────────────────────
const xgbFeatures = [
  { name: "RSI_14", importance: 0.185, color: "#34d399" },
  { name: "EMA_Cross", importance: 0.162, color: "#60a5fa" },
  { name: "Volume_Ratio", importance: 0.148, color: "#a78bfa" },
  { name: "ATR_Pct", importance: 0.125, color: "#fbbf24" },
  { name: "MACD_Hist", importance: 0.112, color: "#fb923c" },
  { name: "BB_Width", importance: 0.098, color: "#22d3ee" },
  { name: "OBV_Trend", importance: 0.085, color: "#f472b6" },
  { name: "ADX", importance: 0.085, color: "#34d399" },
];

const xgbMetrics = {
  accuracy: 67.8,
  precision: 0.72,
  recall: 0.65,
  f1: 0.68,
  auc: 0.74,
  trainSamples: 28450,
  features: 24,
  trees: 420,
  lastTrain: "2026-07-15 08:00 UTC",
  status: "ready" as const,
};

// ─── Transformer Mock Data ────────────────────────────
const transformerMetrics = {
  layers: 6,
  heads: 8,
  embeddingDim: 256,
  params: "4.2M",
  sequenceLen: 128,
  trainSamples: 85200,
  valLoss: 0.0285,
  trainLoss: 0.0213,
  lastEpoch: 48,
  totalEpochs: 100,
  status: "training" as const,
};

const trainLossCurve = [
  0.142, 0.098, 0.076, 0.062, 0.054, 0.048, 0.043, 0.039, 0.036, 0.034,
  0.032, 0.030, 0.029, 0.028, 0.027, 0.026, 0.025, 0.024, 0.023, 0.022,
  0.0218, 0.0215, 0.0213,
];

const valLossCurve = [
  0.158, 0.112, 0.089, 0.074, 0.065, 0.058, 0.053, 0.049, 0.045, 0.042,
  0.040, 0.038, 0.037, 0.036, 0.035, 0.034, 0.033, 0.032, 0.031, 0.030,
  0.0295, 0.0290, 0.0285,
];

type TabId = "xgb" | "transformer";

// ─── SVG sub-components ────────────────────────────────
function FeatureBar({ data }: { data: { name: string; importance: number; color: string }[] }) {
  const maxImp = Math.max(...data.map((d) => d.importance));
  return (
    <div className="space-y-2">
      {data.map((f) => (
        <div key={f.name}>
          <div className="flex items-center justify-between text-xs mb-0.5">
            <span className="text-text-secondary font-mono">{f.name}</span>
            <span className="text-text-primary font-mono">{(f.importance * 100).toFixed(1)}%</span>
          </div>
          <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${(f.importance / maxImp) * 100}%`, backgroundColor: f.color }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function LossChart({ trainData, valData }: { trainData: number[]; valData: number[] }) {
  const w = 460, h = 160, pad = { top: 10, right: 10, bottom: 20, left: 40 };
  const cw = w - pad.left - pad.right;
  const ch = h - pad.top - pad.bottom;

  const allVals = [...trainData, ...valData];
  const minV = 0;
  const maxV = Math.max(...allVals) * 1.1;

  const toPt = (d: number, i: number, arr: number[]) => {
    const x = pad.left + (i / (arr.length - 1)) * cw;
    const y = pad.top + ch - ((d - minV) / (maxV - minV)) * ch;
    return `${x},${y}`;
  };

  const trainPts = trainData.map((d, i) => toPt(d, i, trainData)).join(" ");
  const valPts = valData.map((d, i) => toPt(d, i, valData)).join(" ");

  return (
    <div className="relative">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" preserveAspectRatio="xMidYMid meet">
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct) => {
          const y = pad.top + ch - pct * ch;
          const val = (minV + (maxV - minV) * pct).toFixed(3);
          return (
            <g key={pct}>
              <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} stroke="#1a1a2e" strokeWidth="1" />
              <text x={pad.left - 6} y={y + 3} textAnchor="end" fill="#555566" fontSize="9" fontFamily="monospace">
                {val}
              </text>
            </g>
          );
        })}
        {/* Train line */}
        <polyline points={trainPts} fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeLinejoin="round" />
        {/* Val line */}
        <polyline points={valPts} fill="none" stroke="#fbbf24" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="4,3" />
        {/* Labels */}
        <text x={pad.left} y={h - 2} fill="#555566" fontSize="8" fontFamily="monospace">Epoch 1</text>
        <text x={w - pad.right} y={h - 2} textAnchor="end" fill="#555566" fontSize="8" fontFamily="monospace">Epoch {trainData.length}</text>
      </svg>
      <div className="absolute bottom-0 right-2 flex items-center gap-3 text-[10px] text-text-muted font-mono">
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-accent-blue" />Train Loss</span>
        <span className="flex items-center gap-1"><span className="w-3 h-0.5 rounded bg-accent-gold" />Val Loss</span>
      </div>
    </div>
  );
}

function MetricStat({ label, value, icon, color = "text-text-primary" }: { label: string; value: string; icon: React.ReactNode; color?: string }) {
  return (
    <div className="rounded-lg bg-bg-tertiary/30 border border-border-primary/50 p-3 text-center">
      <div className={cn("flex items-center justify-center mb-1", color)}>{icon}</div>
      <div className={cn("text-sm font-bold font-mono", color)}>{value}</div>
      <div className="text-[10px] text-text-muted mt-0.5">{label}</div>
    </div>
  );
}

// ─── Transformer Architecture Visual ─────────────────
function TransformerArch() {
  const boxes = [
    { label: "Input Embedding", w: 80, row: 0 },
    { label: "Positional Encoding", w: 80, row: 0 },
    { label: "Multi-Head Attention ×8", w: 120, row: 1 },
    { label: "Add & Norm", w: 70, row: 1 },
    { label: "Feed Forward", w: 90, row: 2 },
    { label: "Add & Norm", w: 70, row: 2 },
    { label: "×6 Layers", w: 70, row: 3 },
    { label: "Linear Head", w: 70, row: 4 },
    { label: "Output", w: 50, row: 5 },
  ];

  return (
    <div className="flex flex-col items-center gap-2 py-4">
      {[0, 1, 2, 3, 4, 5].map((row) => {
        const rowBoxes = boxes.filter((b) => b.row === row);
        return (
          <div key={row} className="flex items-center gap-2 justify-center">
            {rowBoxes.map((b) => (
              <div
                key={b.label}
                className={cn(
                  "px-3 py-1.5 rounded-lg border text-[10px] font-mono text-center leading-tight",
                  b.label === "Multi-Head Attention ×8" ? "border-accent-purple/40 bg-accent-purple/10 text-accent-purple" :
                  b.label === "×6 Layers" ? "border-accent-gold/40 bg-accent-gold/10 text-accent-gold" :
                  b.label === "Output" ? "border-accent-green/40 bg-accent-green/10 text-accent-green" :
                  "border-border-primary text-text-secondary bg-bg-tertiary/30"
                )}
                style={{ width: b.w }}
              >
                {b.label}
              </div>
            ))}
            {row < 5 && (
              <div className="flex items-center justify-center text-text-muted">
                <svg width="16" height="12" viewBox="0 0 16 12"><path d="M0 6h14M10 2l4 4-4 4" stroke="currentColor" fill="none" strokeWidth="1.5"/></svg>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ModelsPage() {
  const [tab, setTab] = useState<TabId>("xgb");
  const [training, setTraining] = useState(false);

  const handleTrain = () => {
    setTraining(true);
    setTimeout(() => setTraining(false), 3000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI 量化模型中心</h1>
          <p className="text-sm text-text-muted mt-1">XGBoost · Transformer · 机器学习驱动的交易信号</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono bg-bg-card border border-border-primary rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-blue animate-pulse" />
          模型运行中
        </div>
      </div>

      {/* Tab selector */}
      <div className="flex items-center gap-1 bg-bg-card border border-border-primary rounded-xl p-1 w-fit">
        {[
          { id: "xgb" as TabId, label: "XGBoost", icon: <BarChart3 size={16} /> },
          { id: "transformer" as TabId, label: "Transformer", icon: <Cpu size={16} /> },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              tab === t.id ? "bg-accent-blue/15 text-accent-blue" : "text-text-secondary hover:text-text-primary"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* ─────────────── XGBoost Tab ─────────────── */}
      {tab === "xgb" && (
        <div className="space-y-4">
          {/* Model Header */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-green to-accent-blue">
                  <BarChart3 size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">XGBoost 梯度提升模型</h2>
                  <p className="text-[11px] text-text-muted mt-0.5">树集成学习 · 分类/回归 · 特征重要性排序</p>
                </div>
              </div>
              <div className={cn(
                "px-2.5 py-1 rounded-md text-[10px] font-mono border",
                xgbMetrics.status === "ready" ? "text-accent-green border-accent-green/30 bg-accent-green/5" : "text-accent-gold border-accent-gold/30 bg-accent-gold/5"
              )}>
                {xgbMetrics.status === "ready" ? "● READY" : "TRAINING"}
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3 mb-4">
              <MetricStat label="准确率" value={`${xgbMetrics.accuracy}%`} icon={<Target size={14} />} color="text-accent-green" />
              <MetricStat label="精确率" value={xgbMetrics.precision.toFixed(2)} icon={<Activity size={14} />} color="text-accent-blue" />
              <MetricStat label="召回率" value={xgbMetrics.recall.toFixed(2)} icon={<GitBranch size={14} />} color="text-accent-purple" />
              <MetricStat label="F1 Score" value={xgbMetrics.f1.toFixed(2)} icon={<Sigma size={14} />} color="text-accent-gold" />
              <MetricStat label="AUC" value={xgbMetrics.auc.toFixed(2)} icon={<ChartLine size={14} />} color={xgbMetrics.auc >= 0.7 ? "text-accent-green" : "text-accent-gold"} />
              <MetricStat label="特征数" value={`${xgbMetrics.features}`} icon={<Layers size={14} />} />
              <MetricStat label="决策树" value={`${xgbMetrics.trees}`} icon={<GitBranch size={14} />} />
              <MetricStat label="训练样本" value={`${(xgbMetrics.trainSamples / 1000).toFixed(0)}K`} icon={<Activity size={14} />} />
            </div>

            <div className="text-[10px] text-text-muted font-mono">最后训练: {xgbMetrics.lastTrain}</div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Feature Importance */}
            <div className="rounded-xl border border-border-primary bg-bg-card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <BarChart3 size={16} className="text-accent-green" />
                特征重要性 (Top 8)
              </h3>
              <FeatureBar data={xgbFeatures} />
            </div>

            {/* Prediction Signal */}
            <div className="rounded-xl border border-border-primary bg-bg-card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <Sparkles size={16} className="text-accent-blue" />
                当前预测信号
              </h3>
              <div className="space-y-4">
                {/* Signal gauge */}
                <div className="flex items-center gap-6 p-4 rounded-lg bg-bg-tertiary/40 border border-border-primary/50">
                  <div className="text-center">
                    <div className="text-3xl font-bold font-mono text-accent-green">+0.62</div>
                    <div className="text-[10px] text-text-muted mt-1">XGBoost Score</div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between text-xs mb-1">
                      <span className="text-text-muted">信号强度</span>
                      <span className="font-mono text-accent-green">看多</span>
                    </div>
                    <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                      <div className="h-full rounded-full bg-gradient-to-r from-accent-red via-accent-gold to-accent-green"
                        style={{ width: "62%" }} />
                    </div>
                    <div className="flex justify-between text-[10px] text-text-muted mt-1 font-mono">
                      <span>-1.0</span><span>0</span><span>+1.0</span>
                    </div>
                  </div>
                </div>

                {/* Feature contributions */}
                <div className="space-y-1.5">
                  <div className="text-[11px] text-text-muted font-medium">特征贡献分解</div>
                  {[
                    { feat: "RSI_14", contrib: "+0.18", pos: true },
                    { feat: "EMA_Cross", contrib: "+0.15", pos: true },
                    { feat: "Volume_Ratio", contrib: "+0.12", pos: true },
                    { feat: "ATR_Pct", contrib: "+0.08", pos: true },
                    { feat: "MACD_Hist", contrib: "+0.05", pos: true },
                    { feat: "BB_Width", contrib: "+0.02", pos: true },
                    { feat: "OBV_Trend", contrib: "+0.01", pos: true },
                    { feat: "ADX", contrib: "+0.01", pos: true },
                  ].map((f) => (
                    <div key={f.feat} className="flex items-center justify-between text-xs py-0.5">
                      <span className="text-text-secondary font-mono">{f.feat}</span>
                      <span className={cn("font-mono", f.pos ? "text-accent-green" : "text-accent-red")}>{f.contrib}</span>
                    </div>
                  ))}
                </div>

                <button onClick={handleTrain} disabled={training} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 transition-all text-sm disabled:opacity-50">
                  {training ? <RotateCcw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  {training ? "重新训练中..." : "重新训练模型"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ─────────────── Transformer Tab ─────────────── */}
      {tab === "transformer" && (
        <div className="space-y-4">
          {/* Model Header */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-accent-purple to-accent-cyan">
                  <Cpu size={20} className="text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-text-primary">Transformer 时序预测模型</h2>
                  <p className="text-[11px] text-text-muted mt-0.5">多头自注意力 · 编码器-解码器 · 价格趋势预测</p>
                </div>
              </div>
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-md text-[10px] font-mono border border-accent-gold/30 bg-accent-gold/5 text-accent-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-accent-gold animate-pulse" />
                TRAINING {((transformerMetrics.lastEpoch / transformerMetrics.totalEpochs) * 100).toFixed(0)}%
              </div>
            </div>

            {/* Training progress */}
            <div className="mb-4">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-text-muted">训练进度</span>
                <span className="font-mono text-text-primary">Epoch {transformerMetrics.lastEpoch} / {transformerMetrics.totalEpochs}</span>
              </div>
              <div className="h-2 rounded-full bg-bg-tertiary overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-accent-purple to-accent-cyan transition-all"
                  style={{ width: `${(transformerMetrics.lastEpoch / transformerMetrics.totalEpochs) * 100}%` }} />
              </div>
            </div>

            {/* Metrics grid */}
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
              <MetricStat label="Train Loss" value={transformerMetrics.trainLoss.toFixed(4)} icon={<Activity size={14} />} color="text-accent-blue" />
              <MetricStat label="Val Loss" value={transformerMetrics.valLoss.toFixed(4)} icon={<Activity size={14} />} color="text-accent-gold" />
              <MetricStat label="Layers" value={`${transformerMetrics.layers}`} icon={<Layers size={14} />} />
              <MetricStat label="Attention Heads" value={`${transformerMetrics.heads}`} icon={<BrainCircuit size={14} />} color="text-accent-purple" />
              <MetricStat label="Embed Dim" value={`${transformerMetrics.embeddingDim}`} icon={<Sigma size={14} />} />
              <MetricStat label="Parameters" value={transformerMetrics.params} icon={<Cpu size={14} />} color="text-accent-cyan" />
              <MetricStat label="Seq Length" value={`${transformerMetrics.sequenceLen}`} icon={<GitBranch size={14} />} />
              <MetricStat label="训练样本" value={`${(transformerMetrics.trainSamples / 1000).toFixed(0)}K`} icon={<Activity size={14} />} />
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {/* Training Loss Chart */}
            <div className="rounded-xl border border-border-primary bg-bg-card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
                <TrendingDown size={16} className="text-accent-blue" />
                训练损失曲线
              </h3>
              <LossChart trainData={trainLossCurve} valData={valLossCurve} />
            </div>

            {/* Architecture */}
            <div className="rounded-xl border border-border-primary bg-bg-card p-5">
              <h3 className="text-sm font-semibold text-text-primary mb-2 flex items-center gap-2">
                <Cpu size={16} className="text-accent-purple" />
                模型架构
              </h3>
              <TransformerArch />
              <div className="mt-3 text-[10px] text-text-muted leading-relaxed">
                <p>6层 Transformer Encoder，每层包含 8 头自注意力和前馈网络。</p>
                <p className="mt-1">输入序列 128 步 × 256 维嵌入 → 多头注意力 → 前馈网络 → 价格预测头。</p>
              </div>
            </div>
          </div>

          {/* Prediction Preview */}
          <div className="rounded-xl border border-border-primary bg-bg-card p-5">
            <h3 className="text-sm font-semibold text-text-primary mb-3 flex items-center gap-2">
              <Sparkles size={16} className="text-accent-cyan" />
              Transformer 价格预测 (下一个 24H)
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {[
                { label: "1H 预测", value: "$68,120", change: "+0.41%", up: true },
                { label: "4H 预测", value: "$68,450", change: "+0.89%", up: true },
                { label: "12H 预测", value: "$67,800", change: "-0.06%", up: false },
                { label: "24H 预测", value: "$69,200", change: "+2.01%", up: true },
              ].map((p) => (
                <div key={p.label} className="rounded-lg bg-bg-tertiary/40 border border-border-primary/50 p-3 text-center">
                  <div className="text-[10px] text-text-muted mb-1">{p.label}</div>
                  <div className="text-base font-bold font-mono text-text-primary">{p.value}</div>
                  <div className={cn("text-xs font-mono mt-1", p.up ? "text-accent-green" : "text-accent-red")}>{p.change}</div>
                  <div className={cn("mt-1", p.up ? "text-accent-green" : "text-accent-red")}>
                    {p.up ? <TrendingUp size={14} className="inline" /> : <TrendingDown size={14} className="inline" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
