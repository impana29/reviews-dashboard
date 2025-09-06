// app/dashboard/page.tsx (SERVER)
import React from "react";
import type { NormalizedReview } from "../../lib/types";
import { getHostawayNormalizedWithSource } from "../../lib/getHostawayNormalized";
import DashboardClient from "../../components/Dashboard/DashboardClient";

export default async function DashboardPage() {
  const { result } = await getHostawayNormalizedWithSource();
  return <DashboardClient all={result as NormalizedReview[]} />;
}
