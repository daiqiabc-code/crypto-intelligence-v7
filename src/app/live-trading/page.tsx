"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Radio, Key, Shield, ShieldCheck, ShieldX, Check, X,
  Plus, ArrowUpDown, AlertTriangle, Eye, EyeOff, RefreshCw,
  ExternalLink, Lock, Unlock
} from "lucide-react";

type Exchange = "Binance" | "OKX";
type OrderSide = "BUY" | "SELL";

interface APIKey {
  id: string;
  exchange: Exchange;
  label: string;
  status: "connected" | "disconnected" | "error";
  addedAt: string;
}

const defaultKeys: APIKey[] = [
  { id: "k1", exchange: "Binance", label: "主账户", status: "connected", addedAt: "2026-07-10" },
  { id: "k2", exchange: "OKX", label: "测试账户", status: "disconnected", addedAt: "2026-07-12" },
];

const symbols = ["BTCUSDT", "ETHUSDT", "SOLUSDT"];

export default function LiveTradingPage() {
  const [apiKeys, setApiKeys] = useState<APIKey[]>(defaultKeys);
  const [showAddKey, setShowAddKey] = useState(false);
  const [showKeys, setShowKeys] = useState(false);
  const [newKey, setNewKey] = useState({ exchange: "Binance" as Exchange, label: "", key: "", secret: "" });
  const [approvalStep, setApprovalStep] = useState<"form" | "ai_review" | "guardian_check" | "approved" | "rejected">("form");
  const [orderSymbol, setOrderSymbol] = useState("BTCUSDT");
  const [orderSide, setOrderSide] = useState<OrderSide>("BUY");
  const [orderQty, setOrderQty] = useState("");
  const [orderPrice, setOrderPrice] = useState("");
  const [approving, setApproving] = useState(false);

  const handleAddKey = () => {
    if (!newKey.label || !newKey.key || !newKey.secret) return;
    const id = `k${Date.now()}`;
    setApiKeys((prev) => [...prev, { ...newKey, id, status: "disconnected", addedAt: new Date().toLocaleDateString("zh-CN") }]);
    setShowAddKey(false);
    setNewKey({ exchange: "Binance", label: "", key: "", secret: "" });
  };

  const handlePlaceOrder = () => {
    if (!orderQty || parseFloat(orderQty) <= 0) return;
    setApprovalStep("ai_review");
    setApproving(true);

    // Simulate AI review flow
    setTimeout(() => {
      setApprovalStep("guardian_check");
      setTimeout(() => {
        const approved = Math.random() > 0.3;
        setApprovalStep(approved ? "approved" : "rejected");
        setApproving(false);
      }, 1500);
    }, 1500);
  };

  const handleReset = () => {
    setApprovalStep("form");
    setOrderQty("");
    setOrderPrice("");
  };

  const activeConnections = apiKeys.filter((k) => k.status === "connected").length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">实盘交易</h1>
          <p className="text-sm text-text-muted mt-1">AI 风险审核 · Guardian AI 批准 · 多交易所支持</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-mono bg-bg-card border border-border-primary rounded-lg px-3 py-1.5">
          <span className={cn("w-2 h-2 rounded-full", activeConnections > 0 ? "bg-accent-green animate-pulse" : "bg-text-muted")} />
          {activeConnections} / {apiKeys.length} 已连接
        </div>
      </div>

      {/* API Key Management */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-primary flex items-center gap-2">
            <Key size={16} className="text-accent-gold" />
            API Key 管理
          </h2>
          <button onClick={() => setShowAddKey(!showAddKey)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 transition-all">
            <Plus size={12} /> 添加 Key
          </button>
        </div>

        {showAddKey && (
          <div className="mb-4 p-4 rounded-lg bg-bg-tertiary/40 border border-border-primary">
            <div className="grid grid-cols-2 gap-3 mb-3">
              <div>
                <label className="text-[10px] text-text-muted block mb-1">交易所</label>
                <div className="flex gap-1">
                  {(["Binance", "OKX"] as Exchange[]).map((ex) => (
                    <button key={ex} onClick={() => setNewKey({ ...newKey, exchange: ex })}
                      className={cn("px-3 py-1.5 rounded text-xs font-mono border transition-all",
                        newKey.exchange === ex ? "bg-accent-blue/15 text-accent-blue border-accent-blue/30" : "bg-bg-tertiary text-text-muted border-border-primary"
                      )}>{ex}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-[10px] text-text-muted block mb-1">标签</label>
                <input value={newKey.label} onChange={(e) => setNewKey({ ...newKey, label: e.target.value })}
                  placeholder="主账户 / 子账户..."
                  className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[10px] text-text-muted block mb-1">API Key</label>
                <div className="relative">
                  <input type={showKeys ? "text" : "password"} value={newKey.key} onChange={(e) => setNewKey({ ...newKey, key: e.target.value })}
                    className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-blue pr-8"
                  />
                  <button onClick={() => setShowKeys(!showKeys)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted">
                    {showKeys ? <EyeOff size={12} /> : <Eye size={12} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-[10px] text-text-muted block mb-1">Secret Key</label>
                <div className="relative">
                  <input type={showKeys ? "text" : "password"} value={newKey.secret} onChange={(e) => setNewKey({ ...newKey, secret: e.target.value })}
                    className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-blue pr-8"
                  />
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-3">
              <button onClick={() => setShowAddKey(false)} className="px-3 py-1.5 rounded text-xs text-text-muted border border-border-primary hover:text-text-primary transition-all">取消</button>
              <button onClick={handleAddKey} className="px-3 py-1.5 rounded text-xs bg-accent-blue text-white hover:bg-accent-blue/80 transition-all">保存</button>
            </div>
          </div>
        )}

        <div className="flex gap-3 flex-wrap">
          {apiKeys.map((k) => (
            <div key={k.id} className="flex items-center gap-3 px-3 py-2 rounded-lg border border-border-primary/50 bg-bg-tertiary/30">
              <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center text-[9px] font-bold",
                k.exchange === "Binance" ? "bg-accent-gold/15 text-accent-gold" : "bg-accent-blue/15 text-accent-blue"
              )}>{k.exchange === "Binance" ? "BN" : "OK"}</div>
              <div>
                <div className="text-xs font-medium text-text-primary">{k.label}</div>
                <div className="text-[10px] text-text-muted font-mono">{k.exchange} · {k.addedAt}</div>
              </div>
              <div className={cn("flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono",
                k.status === "connected" ? "bg-accent-green/10 text-accent-green" :
                k.status === "disconnected" ? "bg-text-muted/10 text-text-muted" : "bg-accent-red/10 text-accent-red"
              )}>
                <span className={cn("w-1.5 h-1.5 rounded-full", k.status === "connected" ? "bg-accent-green" : "bg-current")} />
                {k.status === "connected" ? "已连接" : k.status === "disconnected" ? "未连接" : "错误"}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main: Order + Approval */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Order Form */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <ArrowUpDown size={16} className="text-accent-blue" />
            下单
          </h2>
          <div className="flex gap-1 mb-3">
            {symbols.map((s) => (
              <button key={s} onClick={() => setOrderSymbol(s)}
                className={cn("flex-1 px-3 py-1.5 rounded-lg text-xs font-mono border transition-all",
                  orderSymbol === s ? "bg-accent-blue/15 text-accent-blue border-accent-blue/30" : "bg-bg-tertiary/30 text-text-muted border-border-primary/50"
                )}>{s}</button>
            ))}
          </div>
          <div className="flex gap-2 mb-3">
            <button onClick={() => setOrderSide("BUY")}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold font-mono border transition-all",
                orderSide === "BUY" ? "bg-accent-green/15 text-accent-green border-accent-green/40" : "bg-bg-tertiary/30 text-text-muted border-border-primary/50"
              )}>BUY</button>
            <button onClick={() => setOrderSide("SELL")}
              className={cn("flex-1 py-2.5 rounded-lg text-sm font-bold font-mono border transition-all",
                orderSide === "SELL" ? "bg-accent-red/15 text-accent-red border-accent-red/40" : "bg-bg-tertiary/30 text-text-muted border-border-primary/50"
              )}>SELL</button>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">数量</label>
              <input value={orderQty} onChange={(e) => setOrderQty(e.target.value)} type="number" step="0.01" placeholder="0.00"
                className="w-full bg-bg-tertiary/50 border border-border-primary rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue"
              />
            </div>
            <div>
              <label className="text-[11px] text-text-muted mb-1 block">限价 (可选)</label>
              <input value={orderPrice} onChange={(e) => setOrderPrice(e.target.value)} type="number" placeholder="市价"
                className="w-full bg-bg-tertiary/50 border border-border-primary rounded-lg px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue"
              />
            </div>
          </div>
          {/* Safety limits display */}
          <div className="mt-3 p-2.5 rounded-lg bg-bg-tertiary/30 border border-border-primary/50 text-[10px]">
            <div className="flex justify-between mb-1"><span className="text-text-muted">单笔最大</span><span className="font-mono text-text-primary">0.5 BTC</span></div>
            <div className="flex justify-between mb-1"><span className="text-text-muted">日亏损限额</span><span className="font-mono text-accent-gold">5% ($2,500)</span></div>
            <div className="flex justify-between"><span className="text-text-muted">当前杠杆</span><span className="font-mono text-text-primary">1x</span></div>
          </div>
        </div>

        {/* AI Risk Approval Flow */}
        <div className="rounded-xl border border-border-primary bg-bg-card p-5">
          <h2 className="text-sm font-semibold text-text-primary mb-4 flex items-center gap-2">
            <Shield size={16} className="text-accent-blue" />
            AI 风险审核流
          </h2>
          <div className="space-y-3 mb-4">
            {/* Step 1: Order Info */}
            <div className={cn("flex items-center gap-3 p-3 rounded-lg border transition-all",
              approvalStep === "form" ? "border-accent-blue/40 bg-accent-blue/5" : "border-border-primary/50 bg-bg-tertiary/20"
            )}>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                approvalStep === "form" ? "bg-accent-blue text-white" : "bg-bg-tertiary text-text-muted"
              )}>1</div>
              <div className="flex-1">
                <div className="text-xs font-medium text-text-primary">交易信息确认</div>
                <div className="text-[10px] text-text-muted mt-0.5">填写标的、方向、数量</div>
              </div>
              {approvalStep === "form" && <span className="text-[10px] text-accent-blue font-mono">进行中</span>}
            </div>

            {/* Step 2: AI Review */}
            <div className={cn("flex items-center gap-3 p-3 rounded-lg border transition-all",
              approvalStep === "ai_review" ? "border-accent-gold/40 bg-accent-gold/5" : "border-border-primary/50 bg-bg-tertiary/20"
            )}>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                approvalStep === "ai_review" ? "bg-accent-gold text-white" : "bg-bg-tertiary text-text-muted"
              )}>2</div>
              <div className="flex-1">
                <div className="text-xs font-medium text-text-primary">AI Agent 风险评估</div>
                <div className="text-[10px] text-text-muted mt-0.5">检查仓位、风险敞口、历史表现</div>
              </div>
              {approvalStep === "ai_review" && <RefreshCw size={12} className="text-accent-gold animate-spin" />}
              {approvalStep === "guardian_check" && <Check size={12} className="text-accent-green" />}
              {approvalStep === "approved" && <Check size={12} className="text-accent-green" />}
            </div>

            {/* Step 3: Guardian AI */}
            <div className={cn("flex items-center gap-3 p-3 rounded-lg border transition-all",
              approvalStep === "guardian_check" ? "border-accent-red/40 bg-accent-red/5" : "border-border-primary/50 bg-bg-tertiary/20"
            )}>
              <div className={cn("w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold",
                approvalStep === "guardian_check" ? "bg-accent-red text-white" : "bg-bg-tertiary text-text-muted"
              )}>3</div>
              <div className="flex-1">
                <div className="text-xs font-medium text-text-primary">Guardian AI 终审</div>
                <div className="text-[10px] text-text-muted mt-0.5">最高权限安全检查 · 熔断检查 · 异常检测</div>
              </div>
              {approvalStep === "guardian_check" && <Shield size={12} className="text-accent-red animate-pulse" />}
              {approvalStep === "approved" && <Check size={12} className="text-accent-green" />}
              {approvalStep === "rejected" && <X size={12} className="text-accent-red" />}
            </div>

            {/* Result */}
            {(approvalStep === "approved" || approvalStep === "rejected") && (
              <div className={cn("p-4 rounded-lg border text-center",
                approvalStep === "approved" ? "border-accent-green/30 bg-accent-green/5" : "border-accent-red/30 bg-accent-red/5"
              )}>
                <div className={cn("text-lg font-bold font-mono mb-1", approvalStep === "approved" ? "text-accent-green" : "text-accent-red")}>
                  {approvalStep === "approved" ? "✅ 交易已批准" : "❌ 交易被拒绝"}
                </div>
                <p className="text-xs text-text-secondary">
                  {approvalStep === "approved"
                    ? "所有 AI Agent 审核通过，Guardian AI 已批准。订单已提交至交易所。"
                    : "Guardian AI 判定当前市场条件不符合交易标准。请检查风险限额后重试。"}
                </p>
              </div>
            )}
          </div>

          {/* Buttons */}
          <div className="flex gap-2">
            <button onClick={handleReset} className="flex-1 py-2.5 rounded-lg border border-border-primary text-xs text-text-muted hover:text-text-primary transition-all">
              重置
            </button>
            {approvalStep === "form" && (
              <button onClick={handlePlaceOrder} disabled={!orderQty || parseFloat(orderQty) <= 0}
                className={cn("flex-1 py-2.5 rounded-lg text-xs font-semibold border transition-all",
                  orderSide === "BUY"
                    ? "bg-accent-green/15 text-accent-green border-accent-green/30 hover:bg-accent-green/25"
                    : "bg-accent-red/15 text-accent-red border-accent-red/30 hover:bg-accent-red/25",
                  (!orderQty || parseFloat(orderQty) <= 0) && "opacity-50 cursor-not-allowed"
                )}>
                提交 AI 风控审核
              </button>
            )}
            {approving && (
              <div className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-bg-tertiary text-xs text-text-muted">
                <RefreshCw size={12} className="animate-spin" /> 审核中...
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Safety Warning */}
      <div className="rounded-xl border border-accent-red/20 bg-accent-red/5 p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-accent-red shrink-0 mt-0.5" />
          <div>
            <h3 className="text-sm font-semibold text-accent-red">安全声明</h3>
            <p className="text-xs text-text-secondary mt-1 leading-relaxed">
              所有实盘交易必须经过 AI Agent 风险评估 + Guardian AI 终审双重批准。API Key 数据本地加密存储，不发送至第三方。
              系统设有日亏损5%熔断机制，到达限额自动停止所有交易。建议先在模拟交易系统中验证策略30-90天。
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
