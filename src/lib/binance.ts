// Binance USDⓈ-M Futures API — 唯一价格数据源
const BASE = "https://fapi.binance.com/fapi/v1";

export interface BinanceTicker {
  symbol: string;
  lastPrice: string;
  priceChangePercent: string;
  highPrice: string;
  lowPrice: string;
  volume: string;
  quoteVolume: string;
}

export interface TickerData {
  symbol: string;
  price: string;
  change: string;
  isUp: boolean;
  high: string;
  low: string;
  volume: string;
}

const SYMBOL_MAP: Record<string, string> = {
  BTC: "BTCUSDT",
  ETH: "ETHUSDT",
  SOL: "SOLUSDT",
};

function toBase(s: string): string {
  return s.replace("USDT", "");
}

function parseOne(raw: BinanceTicker): TickerData {
  const chg = parseFloat(raw.priceChangePercent);
  return {
    symbol: toBase(raw.symbol),
    price: formatPriceStr(raw.lastPrice),
    change: `${chg >= 0 ? "+" : ""}${chg.toFixed(2)}%`,
    isUp: chg >= 0,
    high: formatPriceStr(raw.highPrice),
    low: formatPriceStr(raw.lowPrice),
    volume: formatVolume(raw.quoteVolume),
  };
}

export async function fetchTicker24hr(symbol: string): Promise<BinanceTicker | null> {
  const pair = SYMBOL_MAP[symbol] || symbol;
  try {
    const res = await fetch(`${BASE}/ticker/24hr?symbol=${pair}`);
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

export async function fetchMultiTickers(symbols: string[]): Promise<Record<string, TickerData>> {
  const pairs = symbols.map((s) => SYMBOL_MAP[s] || s);
  // Binance requires: symbols=["BTCUSDT","ETHUSDT"]
  const query = `symbols=[${pairs.map((p) => `"${p}"`).join(",")}]`;
  try {
    const res = await fetch(`${BASE}/ticker/24hr?${query}`);
    if (!res.ok) {
      // Fallback: parallel single fetches
      const results: Record<string, TickerData> = {};
      const all = await Promise.all(symbols.map((s) => fetchTicker24hr(s)));
      for (const data of all) {
        if (data) results[toBase(data.symbol)] = parseOne(data);
      }
      return results;
    }
    const json: BinanceTicker[] = await res.json();
    const results: Record<string, TickerData> = {};
    for (const data of json) {
      results[toBase(data.symbol)] = parseOne(data);
    }
    return results;
  } catch {
    // Ultimate fallback: parallel single fetches
    const results: Record<string, TickerData> = {};
    const all = await Promise.all(symbols.map((s) => fetchTicker24hr(s)));
    for (const data of all) {
      if (data) results[toBase(data.symbol)] = parseOne(data);
    }
    return results;
  }
}

export async function fetchKlines(symbol: string, interval = "1d", limit = 100): Promise<any[]> {
  const pair = SYMBOL_MAP[symbol] || symbol;
  try {
    const res = await fetch(`${BASE}/klines?symbol=${pair}&interval=${interval}&limit=${limit}`);
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

function formatPriceStr(price: string): string {
  const n = parseFloat(price);
  if (n >= 1000) return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  if (n >= 1) return n.toFixed(2);
  return n.toFixed(4);
}

function formatVolume(v: string): string {
  const n = parseFloat(v);
  if (n >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  return `${(n / 1e3).toFixed(1)}K`;
}
