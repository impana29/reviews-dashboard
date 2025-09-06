"use client";
import React from "react";

export type FiltersState = {
  channel: "all" | string;
  type: "all" | "guest-to-host" | "host-to-guest";
  minRating: number | null;
  category: "all" | string;
  from: string | "";
  to: string | "";
  search: string;
};

export function Filters({ value, onChange }: { value: FiltersState; onChange: (v: FiltersState) => void }) {
  const set = (patch: Partial<FiltersState>) => onChange({ ...value, ...patch });
  return (
    <div className="rounded-2xl shadow-sm bg-white p-5 grid md:grid-cols-6 gap-4">
      <input className="border rounded-xl px-3 py-2" placeholder="Search text" value={value.search}
             onChange={(e) => set({ search: e.target.value })} />
      <select className="border rounded-xl px-3 py-2" value={value.channel}
              onChange={(e) => set({ channel: e.target.value as any })}>
        <option value="all">All channels</option>
        <option value="hostaway">Hostaway</option>
        <option value="airbnb">Airbnb</option>
        <option value="booking">Booking</option>
        <option value="google">Google</option>
        <option value="direct">Direct</option>
      </select>
      <select className="border rounded-xl px-3 py-2" value={value.type}
              onChange={(e) => set({ type: e.target.value as any })}>
        <option value="all">All types</option>
        <option value="guest-to-host">Guest → Host</option>
        <option value="host-to-guest">Host → Guest</option>
      </select>
      <select className="border rounded-xl px-3 py-2" value={value.category}
              onChange={(e) => set({ category: e.target.value as any })}>
        <option value="all">All categories</option>
        <option value="cleanliness">Cleanliness</option>
        <option value="communication">Communication</option>
        <option value="location">Location</option>
        <option value="wifi">Wi-Fi</option>
        <option value="amenities">Amenities</option>
      </select>
      <input type="number" min={0} max={10} placeholder="Min rating" className="border rounded-xl px-3 py-2"
             value={value.minRating ?? ''} onChange={(e) => set({ minRating: e.target.value ? Number(e.target.value) : null })} />
      <div className="flex gap-2">
        <input type="date" className="border rounded-xl px-3 py-2 w-full" value={value.from}
               onChange={(e) => set({ from: e.target.value })} />
        <input type="date" className="border rounded-xl px-3 py-2 w-full" value={value.to}
               onChange={(e) => set({ to: e.target.value })} />
      </div>
    </div>
  );
}
