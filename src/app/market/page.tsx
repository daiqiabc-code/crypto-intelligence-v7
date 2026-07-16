"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, ExternalLink, Clock, MessageSquare, Zap, Globe, BarChart3 } from "lucide-react";

// ─── Mock data ─────────────────────────────────────────
const hotTopics = [
  { rank: 1, title: "BTC 突破 $68,000，24h涨幅2.3%", source: "CoinDesk", time: "12min ago", impact: 95, sentiment: "positive" as const, summary: "比特币突破68,000美元关口，创近两周新高。分析师认为与美联储降息预期加强有关。" },
  { rank: 2, title: "以太坊ETF连续5日净流入", source: "The Block", time: "35min ago", impact: 88, sentiment: "positive" as const, summary: "以太坊现货ETF昨日净流入1.2亿美元，连续5个交易日保持净流入态势。" },
  { rank: 3, title: "美联储9月降息概率升至62%", source: "Bloomberg", time: "1h ago", impact: 92, sentiment: "positive" as const, summary: "CME FedWatch显示9月降息概率升至62%，市场加大对宽松政策的押注。" },
  { rank: 4, title: "Solana TVL突破45亿美元", source: "DeFiLlama", time: "2h ago", impact: 82, sentiment: "positive" as const, summary: "Solana链上总锁仓量突破45亿美元，生态活跃度持续攀升。" },
  { rank: 5, title: "美国SEC推迟多个以太坊ETF期权决定", source: "Reuters", time: "2h ago", impact: 78, sentiment: "negative" as const, summary: "SEC推迟了对多个以太坊ETF期权产品的审批决定，市场反应平淡。" },
  { rank: 6, title: "Crypto X平台热议BTC减半后效应", source: "X/Twitter", time: "3h ago", impact: 75, sentiment: "neutral" as const, summary: "X平台关于BTC减半后价格发现机制的讨论热度持续上升。" },
  { rank: 7, title: "Arthur Hayes: 预测BTC年底达$100K", source: "X/Twitter", time: "4h ago", impact: 85, sentiment: "positive" as const, summary: "BitMEX联合创始人Arthur Hayes预测比特币年底将突破10万美元。" },
  { rank: 8, title: "全球央行黄金储备连续第15个月增加", source: "WGC", time: "5h ago", impact: 72, sentiment: "neutral" as const, summary: "全球央行6月净增持黄金45吨，连续第15个月保持增持态势。" },
  { rank: 9, title: "Circle发行2.5亿USDC", source: "Circle", time: "5h ago", impact: 70, sentiment: "positive" as const, summary: "Circle在Solana链上增发2.5亿USDC，显示市场对稳定币需求旺盛。" },
  { rank: 10, title: "NVIDIA股价创历史新高", source: "CNBC", time: "6h ago", impact: 80, sentiment: "positive" as const, summary: "NVIDIA股价突破$900大关，AI算力需求推动增长，加密挖矿芯片订单同步增长。" },
];

const sentimentLabels = {
  positive: { label: "利多", color: "text-accent-green", bg: "bg-accent-green/10" },
  negative: { label: "利空", color: "text-accent-red", bg: "bg-accent-red/10" },
  neutral: { label: "中性", color: "text-accent-gold", bg: "bg-accent-gold/10" },
};

const analysisCards = [
  {
    title: "BTC 市场分析",
    icon: <TrendingUp size={18} />,
    content: "比特币价格在66,500-68,500区间震荡上行。日线EMA50与EMA200金叉确认中期看涨趋势。4H级别上行通道完整，RSI 62处于健康区间。MACD柱线持续放大显示多头动能增强。支撑位66,000美元，压力位68,500美元。成交量较前日放大28%，市场参与度提升。",
    score: { value: 82, label: "看多" },
    scoreColor: "text-accent-green",
  },
  {
    title: "ETH 市场分析",
    icon: <Zap size={18} />,
    content: "以太坊沿3,400-3,600区间稳步攀升。ETH/BTC汇率0.0518持续走强。ETF资金连续净流入提供支撑。2层网络TVL创新高。技术面呈上升三角形突破形态，目标3,800美元。支撑位3,400美元。",
    score: { value: 78, label: "看多" },
    scoreColor: "text-accent-green",
  },
  {
    title: "资金流分析",
    icon: <BarChart3 size={18} />,
    content: "BTC交易所余额持续下降至2018年以来最低水平，表明长期持有者坚定持币。稳定币市值月增5.2%，场外资金入场意愿增强。USDT溢价率+0.3%。Crypto基金连续3周净流入，上周流入金额4.5亿美元。",
    score: { value: 75, label: "看多" },
    scoreColor: "text-accent-green",
  },
];

export default function MarketPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">市场情报中心</h1>
          <p className="text-sm text-text-muted mt-1">24/7 自动采集 — 新闻 / X热帖 / 链上数据 / 资金流</p>
        </div>
        <div className="text-[10px] text-text-muted font-mono border border-border-primary rounded-lg px-3 py-2 bg-bg-card">
          <span className="text-accent-green">●</span> 最后更新: 2分钟前
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* ── Hot Topics ── */}
        <div className="xl:col-span-2 space-y-4">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Globe size={16} className="text-accent-blue" />
            24小时热点 TOP 10
          </h2>
          <div className="space-y-2">
            {hotTopics.map((topic) => {
              const s = sentimentLabels[topic.sentiment];
              return (
                <div
                  key={topic.rank}
                  className="rounded-lg border border-border-primary bg-bg-card p-4 hover:border-border-secondary transition-all"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xs font-bold font-mono text-text-muted min-w-[20px] pt-0.5">
                      #{String(topic.rank).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-medium text-text-primary truncate">{topic.title}</h3>
                        <ExternalLink size={12} className="text-text-muted shrink-0 mt-1" />
                      </div>
                      <p className="text-xs text-text-secondary mt-1.5 leading-relaxed">{topic.summary}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <span className="text-[10px] text-text-muted font-mono">{topic.source}</span>
                        <span className="text-[10px] text-text-muted flex items-center gap-1">
                          <Clock size={10} />
                          {topic.time}
                        </span>
                        <span className={cn("text-[10px] px-1.5 py-0.5 rounded font-mono", s.bg, s.color)}>{s.label}</span>
                        <div className="flex items-center gap-1 ml-auto">
                          <span className="text-[10px] text-text-muted">影响</span>
                          <div className="w-12 h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                            <div
                              className="h-full rounded-full bg-accent-blue"
                              style={{ width: `${topic.impact}%` }}
                            />
                          </div>
                          <span className="text-[10px] font-mono text-text-muted">{topic.impact}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Right Column ── */}
        <div className="space-y-4">
          {/* AI Analysis */}
          <div className="space-y-3">
            {analysisCards.map((card) => (
              <div key={card.title} className="rounded-xl border border-border-primary bg-bg-card p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary flex items-center gap-2">
                    <span className="text-accent-blue">{card.icon}</span>
                    {card.title}
                  </h3>
                  <div className={cn("text-sm font-bold font-mono", card.scoreColor)}>
                    {card.score.value} <span className="text-[10px]">{card.score.label}</span>
                  </div>
                </div>
                <p className="text-xs text-text-secondary leading-relaxed">{card.content}</p>
              </div>
            ))}
          </div>

          {/* X Hot Posts */}
          <div>
            <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2 mb-3">
              <MessageSquare size={16} className="text-accent-purple" />
              Crypto X 热帖 TOP 5
            </h2>
            <div className="space-y-2">
              {[
                { author: "Arthur Hayes", content: "BTC年底$100K目标不变，流动性拐点已经到来。全球央行将被迫进入宽松周期。", likes: "12.5K", engagement: "high" },
                { author: "PlanB", content: "Stock-to-Flow模型显示BTC当前估值偏低。减半效应将在Q3-Q4充分体现。", likes: "8.2K", engagement: "high" },
                { author: "CryptoQuant CEO", content: "交易所BTC余额创5年新低。这是最强烈的底部信号之一。", likes: "6.8K", engagement: "high" },
                { author: "CZ", content: "监管清晰化是行业最大的利好。Building is everything。", likes: "15.3K", engagement: "high" },
                { author: "Coin Bureau", content: "ETH的ETF资金流正在超越BTC ETF早期的表现。注意这个变化。", likes: "4.5K", engagement: "medium" },
              ].map((post, i) => (
                <div key={i} className="rounded-lg border border-border-primary bg-bg-card p-3">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className="w-4 h-4 rounded-full bg-gradient-to-br from-accent-purple to-accent-blue text-[8px] flex items-center justify-center text-white font-bold">
                      {post.author[0]}
                    </span>
                    <span className="text-xs font-medium text-text-primary">{post.author}</span>
                    <span className="text-[10px] text-text-muted ml-auto">
                      ❤ {post.likes}
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
