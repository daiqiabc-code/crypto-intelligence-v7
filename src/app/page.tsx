"use client";

import { useMarketData } from "@/lib/useMarketData";
import MarketCard from "@/components/dashboard/MarketCard";
import AIScoreCard from "@/components/dashboard/AIScoreCard";
import RecommendationCard from "@/components/dashboard/RecommendationCard";

const aiDimensions = [
  { label: "趋势动能", value: 85, color: "#34d399" },
  { label: "链上数据", value: 78, color: "#60a5fa" },
  { label: "市场情绪", value: 72, color: "#a78bfa" },
  { label: "宏观经济", value: 65, color: "#fbbf24" },
  { label: "风险评估", value: 70, color: "#22d3ee" },
];

export default function DashboardPage() {
  const { prices } = useMarketData(["BTC", "ETH"], 15000);

  const btc = prices["BTC"];
  const eth = prices["ETH"];

  const btcPrice = btc?.price ?? "—";
  const btcChange = btc?.change ?? "—";
  const btcUp = btc?.isUp ?? true;
  const btcHigh = btc?.high ?? "—";
  const btcLow = btc?.low ?? "—";
  const btcVol = btc?.volume ?? "—";

  const ethPrice = eth?.price ?? "—";
  const ethChange = eth?.change ?? "—";
  const ethUp = eth?.isUp ?? true;
  const ethHigh = eth?.high ?? "—";
  const ethLow = eth?.low ?? "—";
  const ethVol = eth?.volume ?? "—";

  const btcDetails = [
    { label: "24h 高点", value: `$${btcHigh}`, isUp: true },
    { label: "24h 低点", value: `$${btcLow}`, isUp: false },
    { label: "24h 成交量", value: btcVol },
    { label: "数据源", value: "Binance Futures" },
  ];

  const ethDetails = [
    { label: "24h 高点", value: `$${ethHigh}`, isUp: true },
    { label: "24h 低点", value: `$${ethLow}`, isUp: false },
    { label: "24h 成交量", value: ethVol },
    { label: "数据源", value: "Binance Futures" },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">Dashboard</h1>
          <p className="text-sm text-text-muted mt-1">AI Multi-Agent Quant Hedge Fund — 实时监控面板</p>
        </div>
        <div className="flex items-center gap-2 text-xs text-text-muted font-mono bg-bg-card border border-border-primary rounded-lg px-3 py-1.5">
          <span className="w-2 h-2 rounded-full bg-accent-green animate-pulse" />
          {btc ? "Binance LIVE" : "加载中..."}
        </div>
      </div>

      {/* Market State Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <MarketCard
          title="BTC / USDT"
          subtitle="比特币 · Binance USDⓈ-M"
          price={`$${btcPrice}`}
          change={btcChange}
          isUp={btcUp}
          status={btcUp ? "Bull Trend" : "Bear Trend"}
          details={btcDetails}
          large
        />
        <MarketCard
          title="ETH / USDT"
          subtitle="以太坊 · Binance USDⓈ-M"
          price={`$${ethPrice}`}
          change={ethChange}
          isUp={ethUp}
          status={ethUp ? "Up Trend" : "Down Trend"}
          details={ethDetails}
        />
        <MarketCard
          title="全球市场"
          subtitle="宏观环境"
          price="Risk On"
          change="—"
          isUp={true}
          status="Risk On"
          details={[
            { label: "S&P 500", value: "5,234", isUp: true },
            { label: "黄金(XAU)", value: "$2,345", isUp: true },
            { label: "美元指数", value: "103.45", isUp: false },
            { label: "恐惧贪心指数", value: "72", isUp: true },
          ]}
        />
      </div>

      {/* AI Score */}
      <AIScoreCard
        score={82}
        status="Bull Market"
        description="综合多维度AI分析，当前市场处于上升趋势。趋势动能强劲，链上数据显示资金持续流入，市场情绪积极。建议维持多头仓位，注意宏观风险。"
        dimensions={aiDimensions}
      />

      {/* AI Recommendation */}
      <RecommendationCard
        symbol="BTC"
        action="BUY"
        confidence={78}
        maxPosition="30%"
        riskLevel="Medium"
        reason="趋势指标显示EMA金叉确认，成交量放大支撑突破。链上MVRV处于合理区间，鲸鱼地址持续增持。宏观环境中性偏多。建议在回踩支撑位时分批建仓。"
        targets={[
          { label: "入场区间", value: "$66,500 - $67,500" },
          { label: "目标价位", value: "$72,000" },
          { label: "止损价位", value: "$64,500" },
        ]}
      />
    </div>
  );
}
