import { useEffect, useMemo, useState } from 'react';
import { mockFeed, filterOptions, type NewsItem, type Sentiment } from '../../lib/mock-feed';

type PlaygroundDict = {
  tickers: string; sectors: string; themes: string; langs: string; sentiment: string;
  all: string; pos: string; neg: string; neu: string;
  showing: string; events: string; live: string; paused: string;
  clickHint: string;
};

type Filters = {
  ticker: string | null;
  sector: string | null;
  theme: string | null;
  sentiment: Sentiment | null;
};

const EMPTY: Filters = { ticker: null, sector: null, theme: null, sentiment: null };

function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function matches(item: NewsItem, f: Filters): boolean {
  if (f.ticker && !item.tickers.includes(f.ticker)) return false;
  if (f.sector && item.sector !== f.sector) return false;
  if (f.theme  && item.theme !== f.theme) return false;
  if (f.sentiment && item.sentiment !== f.sentiment) return false;
  return true;
}

const sentLabel: Record<string, string> = { pos: 'pos', neg: 'neg', neu: 'neu' };

export default function Playground({ t }: { t: PlaygroundDict }) {
  const [feed, setFeed] = useState<NewsItem[]>(mockFeed.slice(0, 6));
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      setFeed((prev) => {
        const base = pick(mockFeed);
        const next: NewsItem = {
          ...base,
          id: 'n_' + Math.random().toString(36).slice(2, 8),
          timestamp: new Date().toISOString(),
        };
        return [next, ...prev].slice(0, 12);
      });
    }, 3000);
    return () => clearInterval(id);
  }, [paused]);

  const visible = useMemo(() => feed.filter((n) => matches(n, filters)), [feed, filters]);

  const sentimentLabels: Record<string, string> = {
    pos: t.pos, neg: t.neg, neu: t.neu,
  };

  return (
    <>
      {/* Toolbar */}
      <div className="pg-toolbar">
        <div className="pg-toolbar-left">
          <span className={`chip ${paused ? '' : 'live'}`}>
            <span className="chip-dot" />
            {paused ? t.paused : t.live}
          </span>
          <span className="chip">
            <span className="chip-dot" style={{ background: 'var(--blue)' }} />
            wss://api.econews/v1/stream
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span className="mono" style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>
            {t.showing} <strong style={{ color: 'var(--fg)' }}>{visible.length}</strong> {t.events}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused((p) => !p)}>
            {paused ? '\u25B6' : '\u275A\u275A'}
          </button>
        </div>
      </div>

      {/* Body: filters left + feed right */}
      <div className="pg-body">
        <div className="pg-filters">
          <FilterGroup
            label={t.tickers}
            allLabel={t.all}
            options={filterOptions.tickers}
            value={filters.ticker}
            onChange={(v) => setFilters((f) => ({ ...f, ticker: v }))}
          />
          <FilterGroup
            label={t.sectors}
            allLabel={t.all}
            options={filterOptions.sectors}
            value={filters.sector}
            onChange={(v) => setFilters((f) => ({ ...f, sector: v }))}
          />
          <FilterGroup
            label={t.themes}
            allLabel={t.all}
            options={filterOptions.themes}
            value={filters.theme}
            onChange={(v) => setFilters((f) => ({ ...f, theme: v }))}
          />
          <FilterGroup
            label={t.sentiment}
            allLabel={t.all}
            options={filterOptions.sentiment}
            value={filters.sentiment}
            onChange={(v) => setFilters((f) => ({ ...f, sentiment: v as Sentiment | null }))}
            renderLabel={(v) => sentimentLabels[v] || v}
          />
        </div>

        <div className="pg-feed">
          <div className="pg-feed-head">
            <span>GET /v1/articles</span>
            <span style={{ color: 'var(--fg-subtle)' }}>{t.clickHint}</span>
          </div>
          <div className="pg-feed-list">
            {visible.map((item) => (
              <FeedRow
                key={item.id}
                item={item}
                active={selected?.id === item.id}
                onClick={() => setSelected(selected?.id === item.id ? null : item)}
              />
            ))}
            {visible.length === 0 && (
              <div style={{ padding: 40, textAlign: 'center', color: 'var(--fg-subtle)' }}>
                Ajuste os filtros para ver noticias
              </div>
            )}
          </div>
        </div>
      </div>

      {/* JSON drawer */}
      {selected && (
        <div className="pg-drawer">
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )}
    </>
  );
}

function FilterGroup<T extends string>({
  label, allLabel, options, value, onChange, renderLabel = (v) => String(v),
}: {
  label: string;
  allLabel: string;
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  renderLabel?: (v: T) => string;
}) {
  return (
    <div className="pg-filter">
      <span className="pg-filter-lbl">{label}</span>
      <div className="pill-row">
        <button
          className={`pill ${value === null ? 'active' : ''}`}
          onClick={() => onChange(null)}
        >
          {allLabel}
        </button>
        {options.map((o) => (
          <button
            key={o}
            className={`pill ${value === o ? 'active' : ''}`}
            onClick={() => onChange(value === o ? null : o)}
          >
            {renderLabel(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedRow({ item, active, onClick }: { item: NewsItem; active: boolean; onClick: () => void }) {
  const sentClass = item.sentiment === 'pos' ? 'pos' : item.sentiment === 'neg' ? 'neg' : 'neu';
  return (
    <div className={`feed-item ${active ? 'active' : ''}`} onClick={onClick}>
      <div className="feed-time">
        {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
        <br />
        <span style={{ color: item.sentimentScore > 0.5 ? 'var(--green)' : item.sentimentScore < 0.4 ? 'var(--red)' : 'var(--amber)' }}>
          {item.sentimentScore > 0.5 ? '+' : ''}{(item.sentimentScore - 0.5).toFixed(2)}
        </span>
      </div>
      <div>
        <div className="feed-head-txt">{item.headline}</div>
        <div className="feed-meta">
          <span className={`chip ${sentClass}`}>
            <span className="chip-dot" />
            {item.sector}
          </span>
          <span className="chip">
            {item.theme}
          </span>
          <span className="chip mono" style={{ fontSize: 11 }}>
            rel {Math.round(item.sentimentScore * 100)}%
          </span>
        </div>
      </div>
      <div className="feed-tags">
        <span className="ticker">{item.tickers[0]}</span>
        <span className={`chip ${sentClass}`}>
          <span className="chip-dot" />
          {sentClass}
        </span>
      </div>
    </div>
  );
}
