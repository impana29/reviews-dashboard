export type ReviewCategory = {
category: string; // e.g., "cleanliness", "communication"
rating: number | null; // 0-10 or null
};


export type HostawayReview = {
id: number | string;
type: 'host-to-guest' | 'guest-to-host' | string;
status: 'published' | 'draft' | string;
rating: number | null; // overall rating if present
publicReview: string | null;
reviewCategory?: ReviewCategory[];
submittedAt: string; // e.g., "2020-08-21 22:45:14"
guestName?: string;
listingName?: string;
channel?: string; // e.g., 'airbnb', 'booking', 'direct'
};


export type NormalizedReview = {
id: string;
listingId: string; // derived slug
listingName: string;
reviewType: 'host-to-guest' | 'guest-to-host' | 'unknown';
channel: string; // 'hostaway'|'google'|'airbnb'|'booking'|'direct'|...
status: 'published' | 'draft' | 'unknown';
overallRating: number | null; // 0-10 scale where possible
categories: ReviewCategory[];
comment: string;
author: string;
submittedAt: string; // ISO 8601
submittedDate: string; // YYYY-MM-DD
};


export type Approvals = {
// key: listingId -> Set of review ids
[listingId: string]: string[];
};
