"use client";

import { cn } from "@/lib/utils";

interface AIScoreCardProps {
  score: number;
  status: string;
  description: string;
  dimensions: { label: string; value: number; color: string }[];
}

export default function AIScoreCard({ score, status, description, dimensions }: AIScoreCardProps) {
  // Calculate circle parameters
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const getScoreColor = (s: number) => {
    if (s >= 75) return "text-accent-green";
    if (s >= 50) return "text-accent-gold";
    if (s >= 25) return "text-accent-orange";
    return "text-accent-red";
  };

  const getScoreBg = (s: number) => {
    if (s >= 75) return "#34d399";
    if (s >= 50) return "#fbbf24";
    if (s >= 25) return "#fb923c";
    return "#fb7185";
  };

  const scoreColor = getScoreColor(score);
  const scoreBg = getScoreBg(score);

  return (
    <div className="rounded-xl border border-border-primary bg-bg-card p-6">
      <div className="flex items-start gap-8">
        {/* Circular gauge */}
        <div className="relative shrink-0">
          <svg width="180" height="180" className="transform -rotate-90">
            <circle cx="90" cy="90" r={radius} fill="none" stroke="#1a1a2e" strokeWidth="10" />
            <circle
              cx="90"
              cy="90"
              r={radius}
              fill="none"
              stroke={scoreBg}
              strokeWidth="10"
              strokeDasharray={circumference}
              strokeDashoffset={offset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className={cn("text-4xl font-bold font-mono", scoreColor)}>{score}</span>
            <span className="text-xs text-text-muted mt-1">/ 100</span>
          </div>
        </div>

        {/* Info */}
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-text-primary">Crypto Intelligence Score</h2>
          <div className={cn("inline-flex items-center gap-1.5 mt-1 px-2.5 py-1 rounded-md text-sm font-semibold font-mono border", 
            score >= 75 ? "text-accent-green border-accent-green/30 bg-accent-green/5" :
            score >= 50 ? "text-accent-gold border-accent-gold/30 bg-accent-gold/5" :
            "text-accent-red border-accent-red/30 bg-accent-red/5"
          )}>
            <span className="w-2 h-2 rounded-full bg-current" />
            {status}
          </div>
          <p className="text-sm text-text-secondary mt-3 leading-relaxed">{description}</p>

          {/* Dimension bars */}
          <div className="mt-5 space-y-3">
            {dimensions.map((dim) => (
              <div key={dim.label}>
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-text-secondary">{dim.label}</span>
                  <span className="font-mono text-text-primary font-medium">{dim.value}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-bg-tertiary overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${dim.value}%`, backgroundColor: dim.color }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
