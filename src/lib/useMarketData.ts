"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { fetchMultiTickers, type TickerData } from "./binance";

export function useMarketData(symbols: string[], intervalMs = 15000) {
  const [prices, setPrices] = useState<Record<string, TickerData>>({});
  const [loading, setLoading] = useState(true);

  // Stable ref: symbols content is what matters, not the array reference
  const symbolsStr = symbols.join(",");
  const symbolsRef = useRef(symbols);
  if (symbolsStr !== symbolsRef.current.join(",")) {
    symbolsRef.current = symbols;
  }

  // Guard against state update after unmount
  const mountedRef = useRef(true);

  // Stable refresh function — only uses symbolsRef internally
  const refresh = useCallback(async () => {
    try {
      const data = await fetchMultiTickers(symbolsRef.current);
      if (!mountedRef.current) return;

      setPrices((prev) => {
        const keys = Object.keys(data);
        if (keys.length === 0) return prev;
        // Skip re-render if nothing changed
        let changed = false;
        for (const k of keys) {
          if (prev[k]?.price !== data[k]?.price || prev[k]?.change !== data[k]?.change) {
            changed = true;
            break;
          }
        }
        return changed ? { ...prev, ...data } : prev;
      });
      setLoading(false);
    } catch {
      if (mountedRef.current) setLoading(false);
    }
  }, []);

  useEffect(() => {
    mountedRef.current = true;
    refresh();

    const timer = setInterval(refresh, intervalMs);
    return () => {
      mountedRef.current = false;
      clearInterval(timer);
    };
  }, [refresh, intervalMs]);

  return { prices, loading, refresh };
}
