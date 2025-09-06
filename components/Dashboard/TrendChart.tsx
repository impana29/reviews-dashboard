'use client';
import React, { useMemo } from 'react';
import type { NormalizedReview } from '@/lib/types';


// Simple SVG line chart (no external libs) to comply with minimal deps
export function TrendChart({ reviews }: { reviews: NormalizedReview[] }) {
const series = useMemo(() => {
const byMonth: Record<string, { sum: number; count: number }> = {};
for (const r of reviews) {
const ym = r.submittedDate.slice(0, 7);
if (!byMonth[ym]) byMonth[ym] = { sum: 0, count: 0 };
if (typeof r.overallRating === 'number') {
byMonth[ym].sum += r.overallRating;
byMonth[ym].count += 1;
}
}
const points = Object.entries(byMonth)
.sort(([a], [b]) => (a < b ? -1 : 1))
.map(([k, v]) => ({ month: k, avg: v.count ? v.sum / v.count : null }));
return points;
}, [reviews]);


if (!series.length) return null;


// SVG layout
const W = 700, H = 220, P = 30;
const xs = series.map((_, i) => i);
const ys = series.map((p) => p.avg ?? 0);
const x = (i: number) => P + (i * (W - 2 * P)) / Math.max(1, series.length - 1);
const y = (v: number) => H - P - (v * (H - 2 * P)) / 10; // 0..10 scale
const path = series
.map((p, i) => `${i ? 'L' : 'M'} ${x(i)} ${y((p.avg ?? 0))}`)
.join(' ');


return (
<div className="rounded-2xl bg-white shadow-sm p-5">
<div className="mb-2 font-medium">Average Rating Trend</div>
<svg width={W} height={H}>
<rect x={0} y={0} width={W} height={H} fill="#ffffff" stroke="#eee" />
<path d={path} fill="none" stroke="#111" strokeWidth={2} />
{series.map((p, i) => (
<g key={i}>
<circle cx={x(i)} cy={y((p.avg ?? 0))} r={3} fill="#111" />
<text x={x(i)} y={H - 8} textAnchor="middle" fontSize="10">{p.month}</text>
</g>
))}
</svg>
</div>
);
}
