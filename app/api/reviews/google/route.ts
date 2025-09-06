import { NextResponse } from 'next/server';
reviewType: 'guest-to-host',
channel: 'google',
status: 'published',
overallRating: 5,
categories: [],
comment: 'Amazing stay!',
author: 'Google User',
submittedAt: new Date().toISOString(),
submittedDate: new Date().toISOString().slice(0, 10),
},
],
});
}


if (!placeId) {
return NextResponse.json({ status: 'error', message: 'placeId is required when using live Google API' }, { status: 400 });
}


// Minimal live fetch: Place Details with reviews field
const resp = await fetch(
`https://maps.googleapis.com/maps/api/place/details/json?place_id=${encodeURIComponent(placeId)}&fields=name,reviews&key=${env.GOOGLE_PLACES_API_KEY}`
);
const json = await resp.json();


const listingName: string = json?.result?.name || 'Google Place';
const listingId = listingName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');


const normalized = (json?.result?.reviews || []).map((r: any, idx: number) => ({
id: `google-${idx}-${r.time}`,
listingId,
listingName,
reviewType: 'guest-to-host',
channel: 'google',
status: 'published',
overallRating: r.rating ?? null,
categories: [],
comment: r.text || '',
author: r.author_name || 'Google User',
submittedAt: new Date((r.time || 0) * 1000).toISOString(),
submittedDate: new Date((r.time || 0) * 1000).toISOString().slice(0, 10),
}));


return NextResponse.json({ status: 'success', count: normalized.length, result: normalized });
} catch (err: any) {
return NextResponse.json({ status: 'error', message: err?.message || 'Unexpected error' }, { status: 500 });
}
}
