"use client";

import { cn } from "@/lib/utils";
import { Bot, TrendingUp, Brain, Globe, Link, MessageSquare, Shield, ChevronRight, Sparkles } from "lucide-react";

const agentIcons: Record<string, React.ReactNode> = {
  manager: <Bot size={22} />,
  trend: <TrendingUp size={22} />,
  quant: <Brain size={22} />,
  macro: <Globe size={22} />,
  chain: <Link size={22} />,
  sentiment: <MessageSquare size={22} />,
  risk: <Shield size={22} />,
};

const agentGradients: Record<string, string> = {
  manager: "from-accent-purple to-accent-blue",
  trend: "from-accent-green to-accent-cyan",
  quant: "from-accent-blue to-accent-cyan",
  macro: "from-accent-gold to-accent-orange",
  chain: "from-accent-cyan to-accent-blue",
  sentiment: "from-accent-orange to-accent-gold",
  risk: "from-accent-red to-accent-purple",
};

interface AgentCardProps {
  id: string;
  name: string;
  role: string;
  status: "active" | "analyzing" | "idle" | "warning";
  view: string;
  score: number;
  accuracy: number;
  contribution: number;
  description: string;
}

const statusConfig = {
  active: { label: "Active", color: "text-accent-green", dot: "bg-accent-green" },
  analyzing: { label: "Analyzing", color: "text-accent-blue", dot: "bg-accent-blue animate-pulse" },
  idle: { label: "Idle", color: "text-text-muted", dot: "bg-text-muted" },
  warning: { label: "Warning", color: "text-accent-red", dot: "bg-accent-red animate-pulse" },
};

export default function AgentCard({ id, name, role, status, view, score, accuracy, contribution, description }: AgentCardProps) {
  const st = statusConfig[status];

  return (
    <div className="rounded-xl border border-border-primary bg-bg-card p-5 hover:border-border-secondary transition-all duration-300 group">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className={cn("flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br", agentGradients[id] || "from-accent-blue to-accent-purple")}>
            <span className="text-white">{agentIcons[id] || <Bot size={22} />}</span>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-text-primary group-hover:text-accent-blue transition-colors">{name}</h3>
            <p className="text-[11px] text-text-muted mt-0.5">{role}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={cn("w-2 h-2 rounded-full", st.dot)} />
          <span className={cn("text-[10px] font-mono", st.color)}>{st.label}</span>
        </div>
      </div>

      {/* Current View */}
      <div className="mb-4 p-2.5 rounded-lg bg-bg-tertiary/40 border border-border-primary/40">
        <div className="text-[10px] text-text-muted mb-1 uppercase tracking-wider">当前观点</div>
        <p className="text-xs text-text-secondary leading-relaxed">{view}</p>
      </div>

      {/* Description */}
      <p className="text-[11px] text-text-muted mb-4 leading-relaxed">{description}</p>

      {/* Metrics */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-border-primary/50">
        <div className="text-center">
          <div className={cn("text-sm font-bold font-mono", score >= 75 ? "text-accent-green" : score >= 50 ? "text-accent-gold" : "text-accent-red")}>
            {score}
          </div>
          <div className="text-[10px] text-text-muted mt-0.5">评分</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono text-accent-blue">{accuracy}%</div>
          <div className="text-[10px] text-text-muted mt-0.5">准确率</div>
        </div>
        <div className="text-center">
          <div className="text-sm font-bold font-mono text-accent-purple">{contribution}%</div>
          <div className="text-[10px] text-text-muted mt-0.5">贡献度</div>
        </div>
      </div>
    </div>
  );
}
