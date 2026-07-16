"use client";

import AgentCard from "@/components/agents/AgentCard";
import { Bot, Users, TrendingUp, Activity } from "lucide-react";

const agents = [
  {
    id: "manager",
    name: "AI基金经理",
    role: "Portfolio Manager | 最终决策者",
    status: "active" as const,
    view: "建议增持BTC至30%仓位。综合多Agent分析，趋势指标看多，链上数据积极，宏观环境中性偏多。建议在$66,500-67,500区间建仓。",
    score: 85,
    accuracy: 76,
    contribution: 35,
    description: "接收所有Agent的分析结果，综合评估后输出最终投资组合建议。拥有投资决策权重40%。",
  },
  {
    id: "trend",
    name: "AI趋势交易员",
    role: "Trend Trader | 技术分析",
    status: "active" as const,
    view: "日线EMA50上穿EMA200金叉确认，4H级别呈上升通道。RSI 62未超买，MACD柱线持续放大。看多，目标$72,000。",
    score: 82,
    accuracy: 71,
    contribution: 25,
    description: "基于EMA、MA、突破形态和趋势跟踪策略分析。擅长识别趋势启动和持续性信号。",
  },
  {
    id: "quant",
    name: "AI量化交易员",
    role: "Quant Trader | 统计套利",
    status: "analyzing" as const,
    view: "机器学习模型预测短期上涨概率65%。统计套利信号中性。因子模型显示动量因子贡献+2.1%，价值因子-0.8%。",
    score: 78,
    accuracy: 68,
    contribution: 20,
    description: "使用机器学习、统计套利和因子模型进行量化分析。持续优化多因子评分系统。",
  },
  {
    id: "macro",
    name: "AI宏观分析师",
    role: "Macro Analyst | 宏观经济",
    status: "active" as const,
    view: "美联储9月降息概率62%，美元指数走弱至103.4对BTC有利。全球流动性拐点临近，风险资产偏好提升。",
    score: 65,
    accuracy: 62,
    contribution: 12,
    description: "分析美联储政策、美元走势、利率变化和全球流动性。评估宏观经济对加密市场的影响。",
  },
  {
    id: "chain",
    name: "AI链上分析师",
    role: "On-chain Analyst | 链上数据",
    status: "active" as const,
    view: "MVRV 2.8处于健康区间，SOPR 1.12显示获利盘正常。交易所BTC余额持续下降，鲸鱼地址月增3.2%。看多。",
    score: 85,
    accuracy: 74,
    contribution: 18,
    description: "分析MVRV、SOPR、鲸鱼地址变动、交易所流量等链上指标。擅长捕捉大资金动向。",
  },
  {
    id: "sentiment",
    name: "AI情绪分析师",
    role: "Sentiment Analyst | 市场情绪",
    status: "analyzing" as const,
    view: "X平台情绪指数68/100偏积极。新闻情感分析正面。恐惧贪心指数72。社交媒体提及率上升15%。",
    score: 72,
    accuracy: 65,
    contribution: 10,
    description: "实时监控Twitter/X、新闻媒体和社交平台情绪。量化市场fear/greed指数。",
  },
  {
    id: "risk",
    name: "AI风险经理",
    role: "Risk Manager | 最高风控权限",
    status: "warning" as const,
    view: "当前组合风险评分MEDIUM。最大回撤警戒线15%。建议设置止损在$64,500。监控杠杆率。",
    score: 90,
    accuracy: 82,
    contribution: 30,
    description: "拥有最高风控权限。负责仓位限制、风险预警和强制停止交易。可独立否决任何交易。",
  },
];

const statsCards = [
  { label: "活跃 Agent", value: "5", icon: <Bot size={18} />, color: "text-accent-green" },
  { label: "平均评分", value: "79.6", icon: <Activity size={18} />, color: "text-accent-blue" },
  { label: "平均准确率", value: "71.1%", icon: <TrendingUp size={18} />, color: "text-accent-purple" },
  { label: "总贡献", value: "100%", icon: <Users size={18} />, color: "text-accent-gold" },
];

export default function AgentsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">AI Agent 中心</h1>
          <p className="text-sm text-text-muted mt-1">Multi-Agent AI 研究交易团队 — 7个专业角色实时运作</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono bg-bg-card border border-border-primary rounded-lg px-3 py-2">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          全系统正常运行
        </div>
      </div>

      {/* Stats summary */}
      <div className="grid grid-cols-4 gap-4">
        {statsCards.map((s) => (
          <div key={s.label} className="rounded-lg border border-border-primary bg-bg-card p-4 flex items-center gap-3">
            <div className={s.color}>{s.icon}</div>
            <div>
              <div className="text-xl font-bold font-mono text-text-primary">{s.value}</div>
              <div className="text-[11px] text-text-muted">{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
        {agents.map((agent) => (
          <AgentCard key={agent.id} {...agent} />
        ))}
      </div>
    </div>
  );
}
