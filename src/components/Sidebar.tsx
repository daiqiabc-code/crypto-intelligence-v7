"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Bot,
  Newspaper,
  Users,
  FlaskConical,
  BrainCircuit,
  GitBranch,
  LineChart,
  Shield,
  Wallet,
  TestTube,
  Radio,
  ScrollText,
  Settings,
  ChevronLeft,
  Activity,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
}

const navItems: NavItem[] = [
  { label: "Dashboard", href: "/", icon: <LayoutDashboard size={18} /> },
  { label: "AI Agent中心", href: "/agents", icon: <Bot size={18} />, badge: "7" },
  { label: "市场情报", href: "/market", icon: <Newspaper size={18} /> },
  { label: "AI投委会", href: "/committee", icon: <Users size={18} /> },
  { label: "策略实验室", href: "/strategies", icon: <FlaskConical size={18} /> },
  { label: "AI 模型", href: "/models", icon: <BrainCircuit size={18} />, badge: "ML" },
  { label: "PPO 强化学习", href: "/ppo", icon: <GitBranch size={18} />, badge: "RL" },
  { label: "回测中心", href: "/backtest", icon: <LineChart size={18} /> },
  { label: "风险控制", href: "/risk", icon: <Shield size={18} /> },
  { label: "资产管理", href: "/portfolio", icon: <Wallet size={18} /> },
  { label: "模拟交易", href: "/paper-trading", icon: <TestTube size={18} /> },
  { label: "实盘交易", href: "/live-trading", icon: <Radio size={18} /> },
  { label: "AI复盘", href: "/review", icon: <ScrollText size={18} /> },
  { label: "系统设置", href: "/settings", icon: <Settings size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-border-primary bg-bg-secondary transition-all duration-300",
        collapsed ? "w-[64px]" : "w-[220px]"
      )}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border-primary shrink-0">
        <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple">
          <Activity size={16} className="text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-text-primary tracking-tight leading-tight">
              Crypto Intel
            </span>
            <span className="text-[10px] text-accent-blue font-mono tracking-wider">
              AGENT V7
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group relative",
                isActive
                  ? "bg-bg-active text-accent-blue"
                  : "text-text-secondary hover:text-text-primary hover:bg-bg-hover"
              )}
            >
              <span className={cn("shrink-0", isActive && "text-accent-blue")}>
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className="text-sm font-medium truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-accent-blue/20 text-accent-blue font-mono">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
              {collapsed && item.badge && (
                <span className="absolute -top-0.5 -right-0.5 text-[9px] px-1 rounded bg-accent-blue/20 text-accent-blue font-mono">
                  {item.badge}
                </span>
              )}
              {/* Active indicator */}
              {isActive && !collapsed && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-accent-blue" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Collapse toggle */}
      <div className="border-t border-border-primary p-2">
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center w-full py-2 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-all"
        >
          <ChevronLeft size={16} className={cn("transition-transform", collapsed && "rotate-180")} />
        </button>
      </div>

      {/* Status bar */}
      {!collapsed && (
        <div className="border-t border-border-primary px-4 py-2 text-[10px] text-text-muted font-mono">
          <div className="flex items-center justify-between">
            <span>SYSTEM</span>
            <span className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-green animate-pulse" />
              ONLINE
            </span>
          </div>
          <div className="mt-0.5">v7.0.0 • AI QUANT HEDGE FUND</div>
        </div>
      )}
    </aside>
  );
}
