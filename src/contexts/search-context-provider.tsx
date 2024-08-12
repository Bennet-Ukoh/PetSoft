"use client";
import { useState } from "react";
import { createContext } from "react";

type TSearchContext = {
  searchQuery: string;
  setSearchQuery: (newValue: string) => void;
  handleChangeSearchQuery: (newValue: string) => void;
};
type SearchContextProviderProps = {
  children: React.ReactNode;
};

export const SearchContext = createContext<TSearchContext | null>(null);

export default function SearchContextProvider({
  children,
}: SearchContextProviderProps) {
  //state
  const [searchQuery, setSearchQuery] = useState("");
  //derived state

  //event handlers/actions
  function handleChangeSearchQuery(newValue: string) {
    setSearchQuery(newValue);
  }
  return (
    <SearchContext.Provider
      value={{
        searchQuery,
        setSearchQuery,
        handleChangeSearchQuery,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}
