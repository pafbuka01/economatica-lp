// src/components/islands/Playground.tsx
// React island — live-updating feed + filter chips + JSON drawer.
//
// This is a scaffold showing the intended shape. Wire it up against your
// real API by replacing the `useInterval` seed with a fetch/WS subscription.

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

export default function Playground({ t }: { t: PlaygroundDict }) {
  const [feed, setFeed] = useState<NewsItem[]>(mockFeed.slice(0, 6));
  const [filters, setFilters] = useState<Filters>(EMPTY);
  const [paused, setPaused] = useState(false);
  const [selected, setSelected] = useState<NewsItem | null>(null);

  // Simulate the stream: every 3s, prepend a fresh sample with a new id + timestamp.
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

  return (
    <div className="playground-grid">
      <aside className="playground-filters">
        <FilterGroup
          label={t.tickers}
          options={filterOptions.tickers}
          value={filters.ticker}
          onChange={(v) => setFilters((f) => ({ ...f, ticker: v }))}
        />
        <FilterGroup
          label={t.sectors}
          options={filterOptions.sectors}
          value={filters.sector}
          onChange={(v) => setFilters((f) => ({ ...f, sector: v }))}
        />
        <FilterGroup
          label={t.themes}
          options={filterOptions.themes}
          value={filters.theme}
          onChange={(v) => setFilters((f) => ({ ...f, theme: v }))}
        />
        <FilterGroup
          label={t.sentiment}
          options={filterOptions.sentiment}
          value={filters.sentiment}
          onChange={(v) => setFilters((f) => ({ ...f, sentiment: v as Sentiment | null }))}
          renderLabel={(v) => (v === 'pos' ? t.pos : v === 'neg' ? t.neg : v === 'neu' ? t.neu : v)}
        />
      </aside>

      <div className="playground-feed">
        <div className="playground-head">
          <span className={`chip ${paused ? '' : 'live'}`}>
            <span className="chip-dot" />
            {paused ? t.paused : t.live}
          </span>
          <span className="mono" style={{ fontSize: 12, color: 'var(--fg-subtle)' }}>
            {t.showing} {visible.length} {t.events}
          </span>
          <button className="btn btn-ghost btn-sm" onClick={() => setPaused((p) => !p)}>
            {paused ? '▶' : '❚❚'}
          </button>
        </div>

        <ul className="feed-list">
          {visible.map((item) => (
            <FeedRow key={item.id} item={item} onClick={() => setSelected(item)} />
          ))}
          {visible.length === 0 && (
            <li className="feed-empty">Ajuste os filtros para ver notícias</li>
          )}
        </ul>

        <p className="playground-hint mono">{t.clickHint}</p>
      </div>

      {selected && (
        <div className="playground-drawer">
          <button onClick={() => setSelected(null)} aria-label="close">×</button>
          <pre className="mono">{JSON.stringify(selected, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

function FilterGroup<T extends string>({
  label, options, value, onChange, renderLabel = (v) => String(v),
}: {
  label: string;
  options: T[];
  value: T | null;
  onChange: (v: T | null) => void;
  renderLabel?: (v: T) => string;
}) {
  return (
    <div className="filter-group">
      <div className="filter-label mono">{label}</div>
      <div className="filter-chips">
        {options.map((o) => (
          <button
            key={o}
            className={`chip ${value === o ? 'chip-active' : ''}`}
            onClick={() => onChange(value === o ? null : o)}
          >
            {renderLabel(o)}
          </button>
        ))}
      </div>
    </div>
  );
}

function FeedRow({ item, onClick }: { item: NewsItem; onClick: () => void }) {
  const sentimentClass = item.sentiment;
  return (
    <li className="feed-row" onClick={onClick}>
      <time className="mono feed-time">
        {new Date(item.timestamp).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
      </time>
      <div className="feed-tickers mono">
        {item.tickers.slice(0, 2).join(' · ')}
      </div>
      <div className="feed-headline">{item.headline}</div>
      <span className={`chip ${sentimentClass}`}>
        <span className="chip-dot" />
        {item.sentiment.toUpperCase()}
      </span>
    </li>
  );
}
