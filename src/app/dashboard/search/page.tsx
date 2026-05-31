import type { Metadata } from "next";
import { getFilterOptions } from "@/actions/search";
import { SearchClient } from "@/components/search/search-client";

export const metadata: Metadata = {
  title: "Search — Synq",
  description: "Search community members, filter by roles/skills/interests, and view compatibility scores.",
};

export default async function SearchPage() {
  const initialOptions = await getFilterOptions();

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
      <div className="mb-8">
        <p
          className="text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: "#e07a5f" }}
        >
          Search
        </p>
        <h1
          style={{
            fontFamily: "Instrument Serif, ui-serif, Georgia, serif",
            fontSize: "clamp(1.8rem, 4vw, 2.6rem)",
            color: "#1e1a17",
            fontWeight: 400,
            letterSpacing: "-0.02em",
            lineHeight: 1.1,
          }}
        >
          Community Search
        </h1>
        <p className="mt-2 text-[15px]" style={{ color: "#6b6560" }}>
          Find specific builders, developers, creators, or filtering by professional credentials.
        </p>
      </div>

      <SearchClient initialOptions={initialOptions} />
    </div>
  );
}
