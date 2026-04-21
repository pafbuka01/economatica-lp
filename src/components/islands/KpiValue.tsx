import { useEffect, useMemo, useRef, useState } from 'react';

type Props = {
  value: string;
  durationMs?: number;
  className?: string;
};

function parseValue(raw: string) {
  const value = raw.trim();
  if (!/[0-9]/.test(value)) return null;
  if (/REST|WS|24\/7/i.test(value)) return null;

  const match = value.match(/^(?<prefix><\s*)?(?<num>\d+(?:\.\d+)?)(?<suffix>%|\+)?(?:\s*(?<tail>anos|years))?$/i);
  if (!match || !match.groups) return null;

  const num = Number(match.groups.num);
  if (Number.isNaN(num)) return null;

  return {
    target: num,
    prefix: match.groups.prefix ?? '',
    suffix: match.groups.suffix ?? '',
    tail: match.groups.tail ? ` ${match.groups.tail}` : '',
    decimals: String(match.groups.num).includes('.') ? String(match.groups.num).split('.')[1].length : 0,
  };
}

export default function KpiValue({ value, durationMs = 1200, className }: Props) {
  const parsed = useMemo(() => parseValue(value), [value]);
  const ref = useRef<HTMLSpanElement | null>(null);
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!parsed || !ref.current) {
      setDisplay(value);
      return;
    }

    const node = ref.current;
    let started = false;
    let raf = 0;

    const format = (n: number) => {
      const fixed = parsed.decimals > 0 ? n.toFixed(parsed.decimals) : Math.round(n).toString();
      return `${parsed.prefix}${fixed}${parsed.suffix}${parsed.tail}`;
    };

    const run = () => {
      if (started) return;
      started = true;
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / durationMs, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = parsed.target * eased;
        setDisplay(format(current));
        if (progress < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          run();
          observer.disconnect();
        }
      },
      { threshold: 0.45 }
    );

    observer.observe(node);

    return () => {
      observer.disconnect();
      if (raf) cancelAnimationFrame(raf);
    };
  }, [durationMs, parsed, value]);

  return <span ref={ref} className={className}>{display}</span>;
}
