import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { RouteListData } from "../types/route-list";
import search from "../actions/search";
import { useRouter } from "next/navigation";
import LoadingPlaceholder from "./LoadingPlaceholder";
import clsx from "clsx";
import RouteBlock from "./RouteBlock";

export default function SearchBar() {
  const router = useRouter();
  const [query, setQuery] = useState<string>("");
  const [routeQueryResult, setRouteQueryResult] = useState<
    RouteListData[] | null
  >(null);
  useEffect(() => {
    const n = window.setTimeout(() => {
      if (query.length === 0) setRouteQueryResult(null);
      else
        search({ query }).then((data: any) => {
          if (data === null || data === undefined) {
            // Error handling
            return;
          }
          setRouteQueryResult(data);
        });
    }, 250);
    return () => {
      window.clearTimeout(n);
    };
  }, [query, setRouteQueryResult]);
  return (
    <div className="flex w-full flex-col gap-2 p-2">
      <input
        className="w-full rounded-lg border border-gray-300 bg-gray-50 p-3 leading-none"
        onInput={(e) => setQuery(e.currentTarget.value)}
        placeholder="輸入路線號碼搜尋"
      />
      {query.length > 0 ? (
        <div className="flex flex-row flex-wrap gap-2">
          {routeQueryResult ? (
            routeQueryResult.length > 0 ? (
              routeQueryResult.map((route) => {
                const { key, ...rest } = route;
                return <RouteBlock {...rest} key={key} />;
              })
            ) : (
              <div>查無結果</div>
            )
          ) : (
            <div className="w-full">
              <div className="from-0 absolute z-10 h-full w-full bg-gradient-to-b from-transparent to-white to-100%"></div>
              <div className="flex flex-row flex-wrap gap-2">
                <LoadingPlaceholder
                  blocks={3}
                  lineHeight="2.125rem"
                  random
                  gap="0"
                />
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
