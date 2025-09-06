import { NextResponse } from 'next/server';
import { env } from '../../../../lib/env';

// GET /api/reviews/google?placeId=...
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const placeId = url.searchParams.get('placeId');

    if (!env.GOOGLE_PLACES_API_KEY) {
      const now = new Date();
      return NextResponse.json({
        status: 'stub',
        message: 'GOOGLE_PLACES_API_KEY not set; returning sample shape.',
        result: [
          {
            id: 'google-123',
            listingId: '2b-n1-a-29-shoreditch-heights',
            listingName: '2B N1 A - 29 Shoreditch Heights',
            reviewType: 'guest-to-host',
            channel: 'google',
            status: 'published',
            overallRating: 5,
            categories: [],
            comment: 'Amazing stay!',
            author: 'Google User',
            submittedAt: now.toISOString(),
            submittedDate: now.toISOString().slice(0, 10),
          },
        ],
      });
    }

    if (!placeId) {
      return NextResponse.json(
        { status: 'error', message: 'placeId is required when using live Google API' },
        { status: 400 }
      );
    }

    const resp = await fetch(
      `https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,reviews&key=${env.GOOGLE_PLACES_API_KEY}`,
      { cache: 'no-store' }
    );
    if (!resp.ok) {
      return NextResponse.json(
        { status: 'error', message: `Google responded ${resp.status}` },
        { status: resp





ChatGPT can make mistakes. 
