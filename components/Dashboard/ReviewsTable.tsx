'use client';
<Card>
<div className="overflow-x-auto">
<table className="min-w-full text-sm">
<thead>
<tr className="text-left text-gray-500">
<th className="py-2 pr-4">Approve</th>
<th className="py-2 pr-4">Listing</th>
<th className="py-2 pr-4">Type</th>
<th className="py-2 pr-4">Channel</th>
<th className="py-2 pr-4">Rating</th>
<th className="py-2 pr-4">Categories</th>
<th className="py-2 pr-4">Date</th>
<th className="py-2 pr-4">Comment</th>
</tr>
</thead>
<tbody>
{reviews.map((r) => (
<tr key={r.id} className="border-t">
<td className="py-2 pr-4">
<input type="checkbox" checked={approved.includes(r.id)} onChange={() => toggle(r.id)} />
</td>
<td className="py-2 pr-4">
<a className="underline" href={`/listings/${r.listingId}`}>{r.listingName}</a>
</td>
<td className="py-2 pr-4">{r.reviewType}</td>
<td className="py-2 pr-4">{r.channel}</td>
<td className="py-2 pr-4">{r.overallRating ?? '—'}</td>
<td className="py-2 pr-4">
{r.categories?.map((c) => (
<span key={c.category} className="mr-2 text-xs bg-gray-100 rounded px-2 py-1 inline-block">{c.category}:{c.rating ?? '—'}</span>
))}
</td>
<td className="py-2 pr-4">{r.submittedDate}</td>
<td className="py-2 pr-4 max-w-xl truncate" title={r.comment}>{r.comment}</td>
</tr>
))}
</tbody>
</table>
</div>
<div className="mt-4 flex justify-end gap-2">
<Button onClick={() => onApproveChange([])}>Clear</Button>
</div>
</Card>
);
}
