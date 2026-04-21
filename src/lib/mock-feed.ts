// Seed data for the Playground island.
// Shape mirrors the live API response; used to simulate the stream in-browser.

export type Sentiment = 'pos' | 'neg' | 'neu';
export type Source = 'proprietary' | 'aggregated' | 'cvm';

export type NewsItem = {
  id: string;
  timestamp: string;        // ISO 8601
  headline: string;
  tickers: string[];
  sector: string;           // e.g. "Energy", "Banking", "Retail"
  theme: string;            // e.g. "Earnings", "Macro", "M&A"
  language: 'pt' | 'en' | 'es';
  sentiment: Sentiment;
  sentimentScore: number;   // 0..1
  source: Source;
  urgent?: boolean;
};

// Pool of realistic items the Playground samples from every ~3s.
export const mockFeed: NewsItem[] = [
  {
    id: 'n_001', timestamp: '2026-04-20T09:31:54-03:00',
    headline: 'Petrobras aprova plano 2026–30; CapEx de US$ 111 bi e dividendos preservados',
    tickers: ['PETR4', 'PETR3'], sector: 'Energy', theme: 'Corporate',
    language: 'pt', sentiment: 'pos', sentimentScore: 0.72,
    source: 'proprietary', urgent: true,
  },
  {
    id: 'n_002', timestamp: '2026-04-20T09:30:02-03:00',
    headline: 'Payroll EUA: 168 mil vagas, consenso 195 mil; unemployment em 4,2%',
    tickers: ['SPX', 'DXY'], sector: 'Macro', theme: 'Indicator',
    language: 'pt', sentiment: 'neg', sentimentScore: 0.31,
    source: 'proprietary',
  },
  {
    id: 'n_003', timestamp: '2026-04-20T09:22:18-03:00',
    headline: 'Fed sinaliza paciência; dot plot mantém mediana em 2 cortes para 2026',
    tickers: ['DXY', 'US10Y'], sector: 'Macro', theme: 'Rates',
    language: 'pt', sentiment: 'neu', sentimentScore: 0.50,
    source: 'proprietary',
  },
  {
    id: 'n_004', timestamp: '2026-04-20T09:14:33-03:00',
    headline: 'IPCA de março vem a 0,32%, abaixo do consenso (0,38%); em 12 meses, 4,21%',
    tickers: ['IBOV', 'DI'], sector: 'Macro', theme: 'Inflation',
    language: 'pt', sentiment: 'pos', sentimentScore: 0.64,
    source: 'proprietary',
  },
  {
    id: 'n_005', timestamp: '2026-04-20T09:08:11-03:00',
    headline: 'Relator apresenta substitutivo da reforma tributária com regime especial para financeiro',
    tickers: ['ITUB4', 'BBDC4', 'BBAS3'], sector: 'Banking', theme: 'Policy',
    language: 'pt', sentiment: 'neu', sentimentScore: 0.48,
    source: 'proprietary',
  },
  {
    id: 'n_006', timestamp: '2026-04-20T09:02:44-03:00',
    headline: 'Vale (VALE3) protocola fato relevante sobre revisão de guidance de minério',
    tickers: ['VALE3'], sector: 'Mining', theme: 'Guidance',
    language: 'pt', sentiment: 'neg', sentimentScore: 0.28,
    source: 'cvm', urgent: true,
  },
  {
    id: 'n_007', timestamp: '2026-04-20T08:58:12-03:00',
    headline: 'Magalu anuncia follow-on de R$ 1,5 bi para reforço de capital',
    tickers: ['MGLU3'], sector: 'Retail', theme: 'Equity',
    language: 'pt', sentiment: 'neu', sentimentScore: 0.46,
    source: 'proprietary',
  },
  {
    id: 'n_008', timestamp: '2026-04-20T08:51:30-03:00',
    headline: 'CVM 44: compras de insiders da Suzano somam R$ 34 mi em abril',
    tickers: ['SUZB3'], sector: 'Paper & Pulp', theme: 'Insider',
    language: 'pt', sentiment: 'pos', sentimentScore: 0.68,
    source: 'cvm',
  },
  {
    id: 'n_009', timestamp: '2026-04-20T08:44:08-03:00',
    headline: 'Itaú (ITUB4) reporta lucro ajustado acima do consenso; ROE em 22,8%',
    tickers: ['ITUB4'], sector: 'Banking', theme: 'Earnings',
    language: 'pt', sentiment: 'pos', sentimentScore: 0.81,
    source: 'proprietary',
  },
  {
    id: 'n_010', timestamp: '2026-04-20T08:39:22-03:00',
    headline: 'Brent cai 1,4% em Londres após dados de estoques acima do esperado',
    tickers: ['BRENT', 'WTI'], sector: 'Energy', theme: 'Commodities',
    language: 'pt', sentiment: 'neg', sentimentScore: 0.34,
    source: 'aggregated',
  },
  {
    id: 'n_011', timestamp: '2026-04-20T08:33:55-03:00',
    headline: 'JBS (JBSS3) conclui aquisição de ativos nos EUA por US$ 720 mi',
    tickers: ['JBSS3'], sector: 'Food', theme: 'M&A',
    language: 'pt', sentiment: 'pos', sentimentScore: 0.69,
    source: 'proprietary',
  },
  {
    id: 'n_012', timestamp: '2026-04-20T08:27:14-03:00',
    headline: 'Copom eleva Selic em 25bps para 11,00%; comunicado reforça cautela',
    tickers: ['DI', 'BRL'], sector: 'Macro', theme: 'Rates',
    language: 'pt', sentiment: 'neu', sentimentScore: 0.52,
    source: 'proprietary', urgent: true,
  },
];

// All unique values for filter chip options.
export const filterOptions = {
  tickers: Array.from(new Set(mockFeed.flatMap((n) => n.tickers))),
  sectors: Array.from(new Set(mockFeed.map((n) => n.sector))),
  themes:  Array.from(new Set(mockFeed.map((n) => n.theme))),
  sentiment: ['pos', 'neu', 'neg'] as Sentiment[],
};
