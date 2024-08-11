"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { RouteListData } from "./types/route-list";
import SearchBar from "./components/SearchBar";
import dynamic from "next/dynamic";

const LoadingPlaceholder = dynamic(
  () => import("./components/LoadingPlaceholder"),
  { ssr: false },
);

export default function Page() {
  const router = useRouter();
  const [routeQueryResult, setRouteQueryResult] = useState<
    RouteListData[] | null
  >(null);

  return (
    <div className="container mx-auto">
      <SearchBar setQueryResult={setRouteQueryResult} />
      <div className="flex flex-row flex-wrap gap-2 p-2">
        {routeQueryResult ? (
          routeQueryResult.length > 0 ? (
            routeQueryResult.map((route) => {
              return (
                <div
                  key={route.key}
                  className="flex cursor-pointer items-center overflow-hidden rounded-lg leading-none"
                  onClick={() => {
                    router.push(
                      `/bus-route/${route.name}?dir=${route.direction}`,
                    );
                  }}
                >
                  <div
                    className={`flex min-h-full min-w-8 items-center justify-center p-2 font-bold ${route.color === "Orange" ? "bg-tcm-orange" : route.color === "Blue" ? "bg-transmac-blue" : ""} `}
                  >
                    <div className="text-white">{route.name}</div>
                  </div>
                  <div
                    className={`flex h-full items-end p-2 leading-none ${route.color === "Orange" ? "bg-tcm-brown text-white" : route.color === "Blue" ? "bg-transmac-yellow" : ""}`}
                  >
                    <div className="mr-1 leading-none">
                      {route.origin.sta_name}
                    </div>
                    <div className="text-xs leading-none">開出</div>
                    {/* <div className="mr-1 text-xs leading-none">往</div>
                    <div className="leading-none">
                      {route.destination.sta_name}
                    </div> */}
                    {/* {route.type === 2 ? (
                      <div className="mx-1">↺</div>
                    ) : (
                      <div className="mx-1">⇨</div>
                    )} */}
                  </div>
                </div>
              );
            })
          ) : (
            <div>無結果</div>
          )
        ) : (
          <div className="w-full">
            <div className="from-0 absolute z-10 h-full w-full bg-gradient-to-b from-transparent to-white to-100%"></div>
            <LoadingPlaceholder
              lines={10}
              gap="1rem"
              lineHeight="2.125rem"
              random
            />
          </div>
        )}
      </div>
    </div>
  );
}
