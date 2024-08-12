"use client";

import { useSearchContext } from "@/lib/hooks";

export default function SearchForm() {
  const { searchQuery, setSearchQuery } = useSearchContext();
  return (
    <form className="w-full h-full">
      <input
        className="w-full h-full bg-white/20 rounded-md px-5 outline-none transition focus:bg-white/50 hover:bg-white/30"
        placeholder="Search pets"
        type="serach"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
}
