import { NextResponse } from 'next/server';
import { normalizeHostawayReviews } from '../../../../lib/normalizeHostaway';
import { env } from '../../../../lib/env';
import type { HostawayReview } from '../../../../lib/types';
import fs from 'node:fs/promises';
import path from 'node:path';

async function fetchHostawayLive(): Promise<HostawayReview[] | null> {
  if (!env.HOSTAWAY_API_KEY) return null;
  try {
    const base = env.HOSTAWAY_BASE_URL || 'https://api.sandbox.hostaway.com';
    const url = new URL('/v1/reviews', base);
    url.searchParams.set('accountId', env.HOSTAWAY_ACCOUNT_ID);

    const resp = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${env.HOSTAWAY_API_KEY}`,
        'X-Hostaway-API-Key': env.HOSTAWAY_API_KEY,
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    });
    if (!resp.ok) throw new Error(`Hostaway responded ${resp.status}`);
    const json = await resp.json();

    const list: any[] = Array.isArray(json?.result)
      ? json.result
      : Array.isArray(json?.data)
      ? json.data
      : Array.isArray(json)
      ? json
      : [];

    const mapped: HostawayReview[] = list.map((r: any) => ({
      id: r.id ?? r.reviewId ?? r._id ?? Math.random().toString(36).slice(2),
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
    const live = await fetchHostawayLive();
    if (live && live.length) {
      const normalized = normalizeHostawayReviews(live);
      return NextResponse.json({ source: 'live', status: 'success', count: normalized.length, result: normalized });
    }

    const p = path.join(process.cwd(), 'data', 'hostaway_mock.json');
    const raw = JSON.parse(await fs.readFile(p, 'utf8')) as { status: string; result: HostawayReview[] };
    const normalized = normalizeHostawayReviews(raw.result || []);
    return NextResponse.json({ source: 'mock', status: 'success', count: normalized.length, result: normalized });
  } catch (err: any) {
    return NextResponse.json({ status: 'error', message: err?.message || 'Unexpected error' }, { status: 500 });
  }
}
