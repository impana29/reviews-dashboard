import React from "react";
import { getHostawayNormalizedWithSource } from "../../../lib/getHostawayNormalized";

async function getApproved(listingId: string) {
  // Keep approvals via API (it’s fast and only reads)
  const res = await fetch(
    `/api/approvals?listingId=${listingId}`,
    { cache: "no-store" }
  );
  // On server you need absolute URL; but during request Next will resolve relative.
  // If your runtime complains, switch to direct file read like in the API.
  const data = await res.json();
  return data.result || [];
}

export default async function ListingPage({ params }: { params: { listingId: string } }) {
  const { listingId } = params;
  const { result } = await getHostawayNormalizedWithSource();
  const all = result.filter((r) => r.listingId === listingId);
  let approved: string[] = [];
  try { approved = await getApproved(listingId); } catch { approved = []; }
  const toShow = all.filter((r) => approved.includes(r.id));
  const listingName = all[0]?.listingName || "Property";

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold">{listingName}</h1>
        <p className="text-gray-500">City • Neighborhood • 2 guests • 1 bed • 1 bath</p>
      </header>

      <section className="grid md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-gray-200 rounded-2xl h-64" />
        <aside className="bg-white rounded-2xl shadow-sm p-5">
          <div className="text-xl font-medium">Book this stay</div>
          <div className="text-sm text-gray-500">(Demo layout)</div>
        </aside>
      </section>

      <section className="space-y-2">
        <h2 className="text-2xl font-semibold">Guest Reviews</h2>
        {!toShow.length ? (
          <p className="text-gray-500">
            No reviews displayed. A manager must approve reviews in the dashboard.
          </p>
        ) : (
          <ul className="grid md:grid-cols-2 gap-4">
            {toShow.map((r) => (
              <li key={r.id} className="bg-white rounded-2xl shadow-sm p-5">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-medium">{r.author}</div>
                  <div className="text-sm bg-gray-100 rounded px-2 py-1">{r.overallRating ?? "—"}/10</div>
                </div>
                <p className="text-sm text-gray-700">{r.comment}</p>
                <div className="mt-2 text-xs text-gray-500">
                  {r.submittedDate} • {r.channel}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
