"use client";
import SearchBar from "./components/SearchBar";
import clsx from "clsx";
import CurrentTabContext from "./store/CurrentTabContext";
import StationsNearbyList from "./components/StationsNearbyList";
import FavoriteStationsList from "./components/FavoriteStationsList";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Page() {
  const searchParams = useSearchParams();
  const currentTab = parseInt(searchParams.get("tab") || "1");

  return (
    <CurrentTabContext.Provider value={currentTab}>
      <div className="container mx-auto flex h-full max-h-full flex-col">
        <SearchBar />
        <div className={clsx("grid w-full grid-cols-2")}>
          <Link href={"/?tab=0"}>
            <div
              className={clsx(
                "rounded-t-xl p-4 pb-2 text-center leading-none",
                currentTab === 0
                  ? "bg-cyan-600 text-white"
                  : "bg-white text-black",
              )}
            >
              附近站點
            </div>
          </Link>
          <Link href={"/?tab=1"}>
            <div
              className={clsx(
                "rounded-t-xl p-4 pb-2 text-center leading-none",
                currentTab === 1
                  ? "bg-orange-600 text-white"
                  : "bg-white text-black",
              )}
            >
              收藏站點
            </div>
          </Link>
        </div>
        <div className="flex-grow">
          <div
            className={clsx(
              currentTab === 0 ? "block" : "hidden",
              "h-full rounded-tr-xl bg-cyan-600",
            )}
          >
            <StationsNearbyList />
          </div>
          <div
            className={clsx(
              currentTab === 1 ? "block" : "hidden",
              "h-full rounded-tl-xl bg-orange-600",
            )}
          >
            <FavoriteStationsList />
          </div>
        </div>
      </div>
    </CurrentTabContext.Provider>
  );
}
