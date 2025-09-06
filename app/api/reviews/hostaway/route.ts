import { NextResponse } from 'next/server';
type: r.type ?? r.reviewType ?? 'guest-to-host',
status: r.status ?? 'published',
rating: r.rating ?? r.overallRating ?? null,
publicReview: r.publicReview ?? r.comment ?? r.text ?? '',
reviewCategory: r.reviewCategory ?? r.categories ?? [],
submittedAt: r.submittedAt ?? r.createdAt ?? r.date ?? new Date().toISOString().replace('T',' ').slice(0,19),
guestName: r.guestName ?? r.author ?? r.reviewerName ?? 'Guest',
listingName: r.listingName ?? r.propertyName ?? r.listing?.name ?? 'Listing',
channel: r.channel ?? 'hostaway',
}));


return mapped;
} catch (e) {
console.warn('[hostaway] live fetch failed, falling back to mock:', (e as Error).message);
return null;
}
}


export async function GET() {
try {
// 1) Try live Hostaway when API key is present
const live = await fetchHostawayLive();
if (live && live.length) {
const normalized = normalizeHostawayReviews(live);
return NextResponse.json({ source: 'live', status: 'success', count: normalized.length, result: normalized });
}


// 2) Fallback to mocked JSON and normalize
const p = path.join(process.cwd(), 'data', 'hostaway_mock.json');
const raw = JSON.parse(await fs.readFile(p, 'utf8')) as { status: string; result: HostawayReview[] };
const normalized = normalizeHostawayReviews(raw.result || []);


return NextResponse.json({ source: 'mock', status: 'success', count: normalized.length, result: normalized });
} catch (err: any) {
return NextResponse.json({ status: 'error', message: err?.message || 'Unexpected error' }, { status: 500 });
}
}
```ts
import { NextResponse } from 'next/server';
import { normalizeHostawayReviews } from '@/lib/normalizeHostaway';
import { env } from '@/lib/env';
import type { HostawayReview } from '@/lib/types';
import fs from 'node:fs/promises';
import path from 'node:path';


export async function GET() {
try {
// In a real scenario, you would call Hostaway sandbox API using env.HOSTAWAY_*.
// Since sandbox has no reviews, we load mocked JSON and normalize it.
const p = path.join(process.cwd(), 'data', 'hostaway_mock.json');
const raw = JSON.parse(await fs.readFile(p, 'utf8')) as { status: string; result: HostawayReview[] };


const normalized = normalizeHostawayReviews(raw.result || []);


return NextResponse.json({ status: 'success', count: normalized.length, result: normalized });
} catch (err: any) {
return NextResponse.json({ status: 'error', message: err?.message || 'Unexpected error' }, { status: 500 });
}
}
