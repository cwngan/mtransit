import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RouteListData } from "../types/route-list";
import search from "../actions/search";

interface SearchBarProps {
  setQueryResult: Dispatch<SetStateAction<RouteListData[] | null>>;
}
export default function SearchBar({ setQueryResult }: SearchBarProps) {
  const [query, setQuery] = useState<string>("");
  useEffect(() => {
    const n = window.setTimeout(() => {
      search({ query }).then((data: any) => {
        if (data === null || data === undefined) {
          // Error handling
          return;
        }
        setQueryResult(data);
      });
    }, 250);
    return () => {
      window.clearTimeout(n);
    };
  }, [query, setQueryResult]);
  return (
    <div className="p-2">
      <input
        className="rounded-lg border border-gray-300 bg-gray-50 p-2 leading-none"
        onInput={(e) => setQuery(e.currentTarget.value)}
      />
    </div>
  );
}
