import { useSearchParams } from "next/navigation";
import CurrentTabContext from "../store/CurrentTabContext";
import SearchBar from "./SearchBar";
import Link from "next/link";
import clsx from "clsx";
import StationsNearbyList from "./StationsNearbyList";
import FavoriteStationsList from "./FavoriteStationsList";
import StationsMap from "./StationsMap";
import { useEffect, useReducer, useState } from "react";
import { Station, StationsNearbyData } from "../types/data";

function stationsReducer(
  state: Station[],
  action:
    | { type: "nearby"; payload: StationsNearbyData | null }
    | { type: "favorite"; payload: Station[] },
): Station[] {
  const { type, payload } = action;
  switch (type) {
    case "nearby":
      if (!payload?.data) break;
      state = payload.data.map((station) => {
        return {
          code: station.code,
          latitude: station.lat,
          longitude: station.lon,
        };
      });
      break;
    case "favorite":
      state = payload;
  }
  return state;
}

export default function Home() {
  const searchParams = useSearchParams();
  const currentTab = parseInt(searchParams.get("tab") || "1");
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [stationsNearby, setStationsNearby] =
    useState<StationsNearbyData | null>(null);
  const [stations, updateStations] = useReducer(stationsReducer, []);

  useEffect(() => {
    if (currentTab === 0)
      updateStations({ type: "nearby", payload: stationsNearby });
  }, [currentTab, stationsNearby]);

  return (
    <CurrentTabContext.Provider value={currentTab}>
      <div className="container mx-auto flex h-full max-h-full max-w-screen-sm flex-col">
        <StationsMap {...{ stations, setLocation }} />
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
        <div className="flex-grow overflow-hidden">
          <div
            className={clsx(
              currentTab === 0 ? "block" : "hidden",
              "h-full overflow-hidden rounded-tr-xl bg-cyan-600 p-3",
            )}
          >
            <StationsNearbyList
              {...{
                location,
                stationsNearby,
                setStationsNearby,
                updateStations,
              }}
            />
          </div>
          <div
            className={clsx(
              currentTab === 1 ? "block" : "hidden",
              "h-full overflow-hidden rounded-tl-xl bg-orange-600 p-3",
            )}
          >
            <FavoriteStationsList {...{ updateStations }} />
          </div>
        </div>
      </div>
    </CurrentTabContext.Provider>
  );
}
