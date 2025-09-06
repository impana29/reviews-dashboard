import { HostawayReview, NormalizedReview } from './types';


const toSlug = (s: string) =>
s
.toLowerCase()
.replace(/[^a-z0-9]+/g, '-')</code>
.replace(/(^-|-$)+/g, '');


const toISO = (s: string) => new Date(s.replace(' ', 'T') + 'Z').toISOString();


export function normalizeHostawayReviews(raw: HostawayReview[]): NormalizedReview[] {
return raw.map((r) => {
const listingName = r.listingName || 'Unknown Listing';
const listingId = toSlug(listingName);
const iso = toISO(r.submittedAt);
const date = iso.slice(0, 10);


return {
id: String(r.id),
listingId,
listingName,
reviewType: (r.type as any) || 'unknown',
channel: r.channel || 'hostaway',
status: (r.status as any) || 'unknown',
overallRating: r.rating ?? null,
categories: r.reviewCategory || [],
comment: r.publicReview || '',
author: r.guestName || 'Anonymous',
submittedAt: iso,
submittedDate: date,
};
});
}
