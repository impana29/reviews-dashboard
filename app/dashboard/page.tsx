// app/dashboard/page.tsx (SERVER)
import React from "react";
import type { NormalizedReview } from "@/lib/types";
import DashboardClient from "@/components/Dashboard/DashboardClient";

async function fetchAll(): Promise<NormalizedReview[]> {
  const base =
    process.env.NEXT_PUBLIC_BASE_URL ?? "http://localhost:3000";

  const h = await fetch(`${base}/api/reviews/hostaway`, {
    cache: "no-store",
  }).then((r) => r.json());

  return (h.result ?? []) as NormalizedReview[];
}

export default async function DashboardPage() {
  const all = await fetchAll();
  return <DashboardClient all={all} />;
}
