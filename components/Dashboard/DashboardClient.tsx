"use client";

import React, { useEffect, useMemo, useState } from "react";
import type { NormalizedReview } from "@/lib/types";
import { Filters, type FiltersState } from "./Filters";
import { ReviewsTable } from "./ReviewsTable";
import { TrendChart } from "./TrendChart";

function applyFilters(rows: NormalizedReview[], f: FiltersState) {
  return rows.filter((r) => {
    if (f.channel !== "all" && r.channel !== f.channel) return false;
    if (f.type !== "all" && r.reviewType !== f.type) return false;
    if (
      f.category !== "all" &&
      !(r.categories || []).some((c) => c.category === f.category)
    ) return false;
    if (typeof f.minRating === "number" && (r.overallRating ?? -1) < f.minRating) return false;
    if (f.from && r.submittedDate < f.from) return false;
    if (f.to && r.submittedDate > f.to) return false;
    if (f.search) {
      const s = f.search.toLowerCase();
      const blob = (r.comment + " " + r.listingName + " " + r.author).toLowerCase();
      if (!blob.includes(s)) return false;
    }
    return true;
  });
}

export default function DashboardClient({ all }: { all: NormalizedReview[] }) {
  const [filters, setFilters] = useState<FiltersState>({
    channel: "all",
    type: "all",
    minRating: null,
    category: "all",
    from: "",
    to: "",
    search: "",
  });
  const [approved, setApproved] = useState<string[]>([]);

  const rows = useMemo(() => applyFilters(all, filters), [all, filters]);

  useEffect(() => {
    async function load() {
      const resp = await fetch(`/api/approvals`, { cache: "no-store" });
      const json = await resp.json();
      const listingIds = Array.from(new Set(all.map((r) => r.listingId)));
      const merged: string[] = [];
      for (const id of listingIds) merged.push(...(json.result?.[id] || []));
      setApproved(Array.from(new Set(merged)));
    }
    load();
  }, [all]);

  const save = async (ids: string[]) => {
    setApproved(ids);
    const byListing: Record<string, string[]> = {};
    for (const r of all) {
      if (ids.includes(r.id)) (byListing[r.listingId] ||= []).push(r.id);
    }
    await Promise.all(
      Object.entries(byListing).map(([listingId, reviewIds]) =>
        fetch("/api/approvals", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ listingId, reviewIds }),
        })
      )
    );
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Manager Dashboard</h1>
      <Filters value={filters} onChange={setFilters} />
      <TrendChart reviews={rows} />
      <ReviewsTable reviews={rows} approved={approved} onApproveChange={save} />
      <p className="text-sm text-gray-500">
        Tip: Approve reviews to display them on each property page.
      </p>
    </div>
  );
}
