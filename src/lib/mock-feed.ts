export type Sentiment = 'pos' | 'neg' | 'neu';
export type Source = 'proprietary' | 'aggregated' | 'cvm';

export type NewsItem = {
  id: string;
  timestamp: string;
  headline: Record<string, string>;
  tickers: string[];
  sector: Record<string, string>;
  theme: string;
  sentiment: Sentiment;
  sentimentScore: number;
  source: Source;
  urgent?: boolean;
};

export const mockFeed: NewsItem[] = [
  {
    id: 'n_001', timestamp: '2026-04-20T09:31:54-03:00',
    headline: {
      pt: 'Petrobras aprova plano 2026-30; CapEx de US$ 111 bi e dividendos preservados',
      en: 'Petrobras approves 2026-30 plan; US$ 111bn capex and dividends preserved',
      es: 'Petrobras aprueba plan 2026-30; CapEx de US$ 111.000 M y dividendos preservados',
    },
    tickers: ['PETR4', 'PETR3'],
    sector: { pt: 'Energia', en: 'Energy', es: 'Energia' },
    theme: 'Corporate',
    sentiment: 'pos', sentimentScore: 0.72,
    source: 'proprietary', urgent: true,
  },
  {
    id: 'n_002', timestamp: '2026-04-20T09:30:02-03:00',
    headline: {
      pt: 'Payroll EUA: 168 mil vagas, consenso 195 mil; desemprego em 4,2%',
      en: 'US payrolls: 168k jobs vs 195k consensus; unemployment at 4.2%',
      es: 'Payroll EE.UU.: 168k vacantes vs 195k consenso; desempleo en 4,2%',
    },
    tickers: ['SPX', 'DXY'],
    sector: { pt: 'Macro', en: 'Macro', es: 'Macro' },
    theme: 'Indicator',
    sentiment: 'neg', sentimentScore: 0.31,
    source: 'proprietary',
  },
  {
    id: 'n_003', timestamp: '2026-04-20T09:22:18-03:00',
    headline: {
      pt: 'Fed sinaliza paciencia; dot plot mantem mediana em 2 cortes para 2026',
      en: 'Fed signals patience; dot plot keeps median at 2 cuts for 2026',
      es: 'Fed senala paciencia; dot plot mantiene mediana en 2 recortes para 2026',
    },
    tickers: ['DXY', 'US10Y'],
    sector: { pt: 'Macro', en: 'Macro', es: 'Macro' },
    theme: 'Rates',
    sentiment: 'neu', sentimentScore: 0.50,
    source: 'proprietary',
  },
  {
    id: 'n_004', timestamp: '2026-04-20T09:14:33-03:00',
    headline: {
      pt: 'IPCA de marco vem a 0,32%, abaixo do consenso (0,38%); em 12 meses, 4,21%',
      en: 'Brazil IPCA March at 0.32%, below the 0.38% consensus; 12M print 4.21%',
      es: 'IPCA Brasil marzo en 0,32%, bajo el consenso (0,38%); 12M en 4,21%',
    },
    tickers: ['IBOV', 'DI'],
    sector: { pt: 'Macro', en: 'Macro', es: 'Macro' },
    theme: 'Inflation',
    sentiment: 'pos', sentimentScore: 0.64,
    source: 'proprietary',
  },
  {
    id: 'n_005', timestamp: '2026-04-20T09:08:11-03:00',
    headline: {
      pt: 'Relator apresenta substitutivo da reforma tributaria com regime especial para financeiro',
      en: 'Rapporteur releases tax-reform substitute with special financial-sector regime',
      es: 'Relator presenta sustitutivo de reforma tributaria con regimen especial financiero',
    },
    tickers: ['ITUB4', 'BBDC4', 'BBAS3'],
    sector: { pt: 'Financeiro', en: 'Banking', es: 'Financiero' },
    theme: 'Policy',
    sentiment: 'neu', sentimentScore: 0.48,
    source: 'proprietary',
  },
  {
    id: 'n_006', timestamp: '2026-04-20T09:02:44-03:00',
    headline: {
      pt: 'Vale (VALE3) protocola fato relevante sobre revisao de guidance de minerio',
      en: 'Vale (VALE3) files material fact on iron ore guidance revision',
      es: 'Vale (VALE3) protocola hecho relevante sobre revision de guidance de mineral',
    },
    tickers: ['VALE3'],
    sector: { pt: 'Mineracao', en: 'Mining', es: 'Mineria' },
    theme: 'Guidance',
    sentiment: 'neg', sentimentScore: 0.28,
    source: 'cvm', urgent: true,
  },
  {
    id: 'n_007', timestamp: '2026-04-20T08:58:12-03:00',
    headline: {
      pt: 'Magalu anuncia follow-on de R$ 1,5 bi para reforco de capital',
      en: 'Magalu announces R$ 1.5bn follow-on to strengthen capital',
      es: 'Magalu anuncia follow-on de R$ 1.500 M para refuerzo de capital',
    },
    tickers: ['MGLU3'],
    sector: { pt: 'Varejo', en: 'Retail', es: 'Retail' },
    theme: 'Equity',
    sentiment: 'neu', sentimentScore: 0.46,
    source: 'proprietary',
  },
  {
    id: 'n_008', timestamp: '2026-04-20T08:51:30-03:00',
    headline: {
      pt: 'CVM 44: compras de insiders da Suzano somam R$ 34 mi em abril',
      en: 'CVM 44: Suzano insider purchases total R$ 34m in April',
      es: 'CVM 44: compras de insiders de Suzano suman R$ 34 M en abril',
    },
    tickers: ['SUZB3'],
    sector: { pt: 'Papel e Celulose', en: 'Paper & Pulp', es: 'Papel y Celulosa' },
    theme: 'Insider',
    sentiment: 'pos', sentimentScore: 0.68,
    source: 'cvm',
  },
  {
    id: 'n_009', timestamp: '2026-04-20T08:44:08-03:00',
    headline: {
      pt: 'Itau (ITUB4) reporta lucro ajustado acima do consenso; ROE em 22,8%',
      en: 'Itau (ITUB4) reports adjusted profit above consensus; ROE at 22.8%',
      es: 'Itau (ITUB4) reporta beneficio ajustado sobre el consenso; ROE en 22,8%',
    },
    tickers: ['ITUB4'],
    sector: { pt: 'Financeiro', en: 'Banking', es: 'Financiero' },
    theme: 'Earnings',
    sentiment: 'pos', sentimentScore: 0.81,
    source: 'proprietary',
  },
  {
    id: 'n_010', timestamp: '2026-04-20T08:39:22-03:00',
    headline: {
      pt: 'Brent cai 1,4% em Londres apos dados de estoques acima do esperado',
      en: 'Brent drops 1.4% in London after inventory data beats expectations',
      es: 'Brent cae 1,4% en Londres tras datos de inventarios sobre lo esperado',
    },
    tickers: ['BRENT', 'WTI'],
    sector: { pt: 'Energia', en: 'Energy', es: 'Energia' },
    theme: 'Commodities',
    sentiment: 'neg', sentimentScore: 0.34,
    source: 'aggregated',
  },
  {
    id: 'n_011', timestamp: '2026-04-20T08:33:55-03:00',
    headline: {
      pt: 'JBS (JBSS3) conclui aquisicao de ativos nos EUA por US$ 720 mi',
      en: 'JBS (JBSS3) completes US$ 720m asset acquisition in the US',
      es: 'JBS (JBSS3) concluye adquisicion de activos en EE.UU. por US$ 720 M',
    },
    tickers: ['JBSS3'],
    sector: { pt: 'Alimentos', en: 'Food', es: 'Alimentos' },
    theme: 'M&A',
    sentiment: 'pos', sentimentScore: 0.69,
    source: 'proprietary',
  },
  {
    id: 'n_012', timestamp: '2026-04-20T08:27:14-03:00',
    headline: {
      pt: 'Copom eleva Selic em 25bps para 11,00%; comunicado reforca cautela',
      en: 'Copom raises Selic by 25bps to 11.00%; statement reinforces caution',
      es: 'Copom eleva Selic en 25bps a 11,00%; comunicado refuerza cautela',
    },
    tickers: ['DI', 'BRL'],
    sector: { pt: 'Macro', en: 'Macro', es: 'Macro' },
    theme: 'Rates',
    sentiment: 'neu', sentimentScore: 0.52,
    source: 'proprietary', urgent: true,
  },
];

// Filter options — curated to ensure every option has at least one match.
const allSectors = Array.from(new Set(mockFeed.map((n) => JSON.stringify(n.sector))));
export const sectorOptions: Record<string, string[]> = {
  pt: Array.from(new Set(mockFeed.map((n) => n.sector.pt))),
  en: Array.from(new Set(mockFeed.map((n) => n.sector.en))),
  es: Array.from(new Set(mockFeed.map((n) => n.sector.es))),
};

export const filterOptions = {
  tickers: ['PETR4', 'VALE3', 'ITUB4', 'BBDC4', 'IBOV', 'DXY', 'MGLU3', 'JBSS3', 'SUZB3'],
  sentiment: ['pos', 'neu', 'neg'] as Sentiment[],
};
