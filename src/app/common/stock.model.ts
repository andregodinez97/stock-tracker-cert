export interface SymbolLookupResponse {
  count: number,
  result: Symbol[],
}

export interface Symbol {
  description: string;
  displaySymbol: string;
  symbol: string;
  type: string
}

export interface StockQuote {
  symbol: string;
  description: string;
  currentPrice: number;
  change: number;
  percentChange: number;
  highPriceOfTheDay: number;
  openPriceOfTheDay: number;
  previousClosePrice: number;
}

export interface StockQuoteResponse {
  c: number;
  d: number;
  dp: number;
  h: number;
  l: number;
  o: number;
  pc: number;
}

export interface StockSentiment {
  symbol: string;
  year: number;
  month: number;
  change: number;
  mspr: number;
}
export interface StockSentimentResponse {
  symbol: string;
  data: StockSentiment[];
}
