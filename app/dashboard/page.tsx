import React from 'react';
const [approved, setApproved] = useState<string[]>([]);


const rows = useMemo(() => applyFilters(all, filters), [all, filters]);


// Load/save approvals to server
useEffect(() => {
async function load() {
// naive: load approvals for first listing in data set to pre-populate (or fetch all and merge)
const listingIds = Array.from(new Set(all.map((r) => r.listingId)));
const resp = await fetch(`/api/approvals`);
const json = await resp.json();
const merged: string[] = [];
for (const id of listingIds) {
const list = json.result?.[id] || [];
merged.push(...list);
}
setApproved(merged);
}
load();
}, [all]);


const save = async (ids: string[]) => {
setApproved(ids);
const byListing: Record<string, string[]> = {};
for (const r of all) {
if (ids.includes(r.id)) {
byListing[r.listingId] = byListing[r.listingId] || [];
byListing[r.listingId].push(r.id);
}
}
await Promise.all(
Object.entries(byListing).map(([listingId, reviewIds]) => fetch('/api/approvals', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ listingId, reviewIds }) }))
);
};


return (
<div className="space-y-6">
<h1 className="text-2xl font-semibold">Manager Dashboard</h1>
<Filters value={filters} onChange={setFilters} />
<TrendChart reviews={rows} />
<ReviewsTable reviews={rows} approved={approved} onApproveChange={save} />
<p className="text-sm text-gray-500">Tip: Approve reviews to display them on each property page.</p>
</div>
);
}
