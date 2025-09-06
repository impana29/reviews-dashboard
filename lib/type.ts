export type ReviewCategory = { category: string; rating: number | null; };

export type HostawayReview = {
  id: number | string;
  type: 'host-to-guest' | 'guest-to-host' | string;
  status: 'published' | 'draft' | string;
  rating: number | null;
  publicReview: string | null;
  reviewCategory?: ReviewCategory[];
  submittedAt: string;
  guestName?: string;
  listingName?: string;
  channel?: string;
};

export type NormalizedReview = {
  id: string;
  listingId: string;
  listingName: string;
  reviewType: 'host-to-guest' | 'guest-to-host' | 'unknown';
  channel: string;
  status: 'published' | 'draft' | 'unknown';
  overallRating: number | null;
  categories: ReviewCategory[];
  comment: string;
  author: string;
  submittedAt: string;   // ISO
  submittedDate: string; // YYYY-MM-DD
};

export type Approvals = { [listingId: string]: string[] };

