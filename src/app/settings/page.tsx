"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Settings, Key, Bell, Shield, Sliders, Bot, Globe,
  Save, RefreshCw, ChevronRight, ToggleLeft, ToggleRight,
  Eye, EyeOff, AlertTriangle, Check
} from "lucide-react";

type TabId = "api" | "agents" | "risk" | "notify" | "system";

const tabs: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: "api", label: "API 配置", icon: <Key size={16} /> },
  { id: "agents", label: "Agent 设置", icon: <Bot size={16} /> },
  { id: "risk", label: "风控参数", icon: <Shield size={16} /> },
  { id: "notify", label: "通知设置", icon: <Bell size={16} /> },
  { id: "system", label: "系统偏好", icon: <Globe size={16} /> },
];

function Toggle({ enabled, onChange }: { enabled: boolean; onChange: () => void }) {
  return (
    <button onClick={onChange} className={cn(
      "relative w-10 h-5 rounded-full transition-all",
      enabled ? "bg-accent-green" : "bg-bg-tertiary"
    )}>
      <span className={cn(
        "absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all shadow",
        enabled ? "left-[22px]" : "left-0.5"
      )} />
    </button>
  );
}

function SettingRow({ label, desc, children }: { label: string; desc?: string; children: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-border-primary/30 last:border-b-0">
      <div className="flex-1">
        <div className="text-sm text-text-primary">{label}</div>
        {desc && <div className="text-[11px] text-text-muted mt-0.5">{desc}</div>}
      </div>
      <div className="shrink-0 ml-4">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const [tab, setTab] = useState<TabId>("api");
  const [saved, setSaved] = useState(false);
  const [showSecrets, setShowSecrets] = useState(false);

  // Toggles
  const [toggles, setToggles] = useState({
    autoTrading: false,
    guardianEnabled: true,
    agentDebate: true,
    emailAlert: true,
    pushAlert: true,
    dailyReport: true,
    darkMode: true,
    autoBacktest: false,
    riskCheck: true,
  });

  const toggle = (key: keyof typeof toggles) => setToggles((prev) => ({ ...prev, [key]: !prev[key] }));

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-text-primary">系统设置</h1>
          <p className="text-sm text-text-muted mt-1">API Key · Agent · 风控 · 通知 · 系统偏好</p>
        </div>
        <button onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent-blue/10 text-accent-blue border border-accent-blue/30 hover:bg-accent-blue/20 transition-all text-sm">
          {saved ? <Check size={14} /> : <Save size={14} />}
          {saved ? "已保存" : "保存设置"}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 bg-bg-card border border-border-primary rounded-xl p-1 flex-wrap">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={cn("flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-medium transition-all",
              tab === t.id ? "bg-accent-blue/15 text-accent-blue" : "text-text-muted hover:text-text-primary"
            )}>
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="rounded-xl border border-border-primary bg-bg-card p-6">

        {/* ─── API CONFIG ─── */}
        {tab === "api" && (
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-primary mb-4">交易所 API 配置</h2>

            {/* Binance */}
            <div className="rounded-lg bg-bg-tertiary/30 border border-border-primary/50 p-4 mb-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-accent-gold/15 text-accent-gold flex items-center justify-center text-[9px] font-bold">BN</span>
                  <span className="text-sm font-medium text-text-primary">Binance</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-accent-green/10 text-accent-green">已连接</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-text-muted block mb-1">API Key</label>
                  <div className="relative">
                    <input type={showSecrets ? "text" : "password"} defaultValue="b1a2c3d4e5f6..."
                      className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-blue pr-8"
                      readOnly />
                    <button onClick={() => setShowSecrets(!showSecrets)} className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted">
                      {showSecrets ? <EyeOff size={12} /> : <Eye size={12} />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-1">Secret Key</label>
                  <input type={showSecrets ? "text" : "password"} defaultValue="••••••••••••"
                    className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none focus:border-accent-blue"
                    readOnly />
                </div>
              </div>
            </div>

            {/* OKX */}
            <div className="rounded-lg bg-bg-tertiary/30 border border-border-primary/50 p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded bg-accent-blue/15 text-accent-blue flex items-center justify-center text-[9px] font-bold">OK</span>
                  <span className="text-sm font-medium text-text-primary">OKX</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-text-muted/10 text-text-muted">未配置</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] text-text-muted block mb-1">API Key</label>
                  <input placeholder="请输入 OKX API Key"
                    className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue" />
                </div>
                <div>
                  <label className="text-[10px] text-text-muted block mb-1">Secret Key</label>
                  <input type="password" placeholder="请输入 Secret Key"
                    className="w-full bg-bg-tertiary/50 border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue" />
                </div>
              </div>
            </div>

            <p className="text-[10px] text-text-muted mt-4 flex items-center gap-1">
              <AlertTriangle size={10} className="text-accent-gold" />
              API Key 本地加密存储，仅用于交易接口调用。建议使用子账户/仅交易权限 Key。
            </p>
          </div>
        )}

        {/* ─── AGENT CONFIG ─── */}
        {tab === "agents" && (
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-primary mb-4">AI Agent 设置</h2>
            <SettingRow label="AI 代理辩论" desc="允许 Agent 之间进行多轮辩论后再输出结论">
              <Toggle enabled={toggles.agentDebate} onChange={() => toggle("agentDebate")} />
            </SettingRow>
            <SettingRow label="自动交易执行" desc="AI Agent 可直接执行交易（需Guardian批准）">
              <Toggle enabled={toggles.autoTrading} onChange={() => toggle("autoTrading")} />
            </SettingRow>
            <SettingRow label="每日自动分析" desc="每天08:00 UTC 自动运行全套分析">
              <Toggle enabled={toggles.dailyReport} onChange={() => toggle("dailyReport")} />
            </SettingRow>
            <SettingRow label="策略自动回测" desc="新增策略时自动运行回测">
              <Toggle enabled={toggles.autoBacktest} onChange={() => toggle("autoBacktest")} />
            </SettingRow>
            <div className="mt-4 p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
              <div className="text-xs text-text-muted mb-2">Agent 权重配置</div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: "基金经理", val: "40%" },
                  { label: "趋势交易员", val: "25%" },
                  { label: "量化交易员", val: "20%" },
                  { label: "宏观分析师", val: "15%" },
                ].map((a) => (
                  <div key={a.label} className="flex items-center justify-between px-3 py-2 rounded bg-bg-tertiary/50 text-xs">
                    <span className="text-text-secondary">{a.label}</span>
                    <span className="font-mono text-text-primary">{a.val}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── RISK CONFIG ─── */}
        {tab === "risk" && (
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-primary mb-4">风控参数</h2>
            <SettingRow label="Guardian AI 自动风控" desc="启用后自动监控并执行熔断">
              <Toggle enabled={toggles.guardianEnabled} onChange={() => toggle("guardianEnabled")} />
            </SettingRow>
            <SettingRow label="交易前风险检查" desc="每笔交易前执行风险评估">
              <Toggle enabled={toggles.riskCheck} onChange={() => toggle("riskCheck")} />
            </SettingRow>
            <div className="mt-4 space-y-3">
              {[
                { label: "日亏损限额", value: "5%", desc: "当日亏损达此比例自动停止交易" },
                { label: "最大回撤", value: "20%", desc: "账户总回撤达此比例触发熔断" },
                { label: "最大杠杆", value: "3x", desc: "单个交易最大杠杆倍数" },
                { label: "单笔最大仓位", value: "10%", desc: "单笔交易占总资产最大比例" },
                { label: "单币种最大敞口", value: "40%", desc: "单个币种占总资产最大比例" },
              ].map((p) => (
                <div key={p.label} className="flex items-center justify-between p-3 rounded-lg bg-bg-tertiary/30 border border-border-primary/40">
                  <div>
                    <div className="text-xs text-text-primary">{p.label}</div>
                    <div className="text-[10px] text-text-muted">{p.desc}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <input type="text" defaultValue={p.value}
                      className="w-16 bg-bg-tertiary border border-border-primary rounded px-2 py-1 text-xs font-mono text-text-primary text-center focus:outline-none focus:border-accent-blue" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ─── NOTIFY CONFIG ─── */}
        {tab === "notify" && (
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-primary mb-4">通知设置</h2>
            <SettingRow label="邮件通知" desc="接收交易执行和风控告警邮件">
              <Toggle enabled={toggles.emailAlert} onChange={() => toggle("emailAlert")} />
            </SettingRow>
            <SettingRow label="推送通知" desc="交易状态变更实时推送">
              <Toggle enabled={toggles.pushAlert} onChange={() => toggle("pushAlert")} />
            </SettingRow>
            <div className="mt-4">
              <label className="text-xs text-text-muted block mb-1.5">通知邮箱</label>
              <input type="email" defaultValue="trader@example.com" placeholder="your@email.com"
                className="w-full max-w-xs bg-bg-tertiary/50 border border-border-primary rounded px-3 py-2 text-xs font-mono text-text-primary placeholder:text-text-dim focus:outline-none focus:border-accent-blue" />
            </div>
            <div className="mt-3">
              <label className="text-xs text-text-muted block mb-1.5">通知事件</label>
              <div className="grid grid-cols-2 gap-2">
                {["交易执行", "风控告警", "策略更新", "系统通知", "回测完成", "模型更新"].map((evt) => (
                  <label key={evt} className="flex items-center gap-2 p-2 rounded bg-bg-tertiary/30 border border-border-primary/40 cursor-pointer">
                    <input type="checkbox" defaultChecked className="accent-accent-blue" />
                    <span className="text-xs text-text-secondary">{evt}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ─── SYSTEM CONFIG ─── */}
        {tab === "system" && (
          <div className="space-y-1">
            <h2 className="text-sm font-semibold text-text-primary mb-4">系统偏好</h2>
            <SettingRow label="深色主题" desc="Bloomberg 金融终端风格">
              <Toggle enabled={toggles.darkMode} onChange={() => toggle("darkMode")} />
            </SettingRow>
            <SettingRow label="数据刷新间隔" desc="市场数据自动刷新频率">
              <select className="bg-bg-tertiary border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none">
                <option>15 秒</option>
                <option>30 秒</option>
                <option>60 秒</option>
              </select>
            </SettingRow>
            <SettingRow label="默认交易所" desc="下单时默认选择的交易所">
              <select className="bg-bg-tertiary border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none">
                <option>Binance</option>
                <option>OKX</option>
              </select>
            </SettingRow>
            <SettingRow label="默认交易对" desc="打开时的默认交易对">
              <select className="bg-bg-tertiary border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none">
                <option>BTCUSDT</option>
                <option>ETHUSDT</option>
                <option>SOLUSDT</option>
              </select>
            </SettingRow>
            <SettingRow label="显示货币" desc="价格显示货币单位">
              <select className="bg-bg-tertiary border border-border-primary rounded px-2.5 py-1.5 text-xs font-mono text-text-primary focus:outline-none">
                <option>USD</option>
                <option>CNY</option>
              </select>
            </SettingRow>
            <div className="mt-4 pt-4 border-t border-border-primary/50">
              <button className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs text-accent-red border border-accent-red/30 hover:bg-accent-red/5 transition-all">
                <RefreshCw size={12} /> 恢复默认设置
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
