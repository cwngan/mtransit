import { BusInfo } from "../types/bus";
import { StationInfo } from "../types/route-info";
import RouteStationLine from "./RouteStationLine";
import RouteStationInfoBlock from "./RouteStationInfoBlock";
import { StarIcon } from "@heroicons/react/24/outline";
import { StarIcon as SolidStarIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";

type RouteStationBlockProps = StationInfo & { busInfo: BusInfo[] } & {
  first: boolean;
  last: boolean;
  staIndex: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
  traffic: string;
};

export default function RouteStationBlock({
  isOpen,
  open,
  close,
  busInfo,
  staCode,
  staIndex,
  staName,
  first,
  last,
  traffic,
}: RouteStationBlockProps) {
  const [isFavorite, setIsFavorite] = useState<boolean | null>(null);
  useEffect(() => {
    if (!window.localStorage) return;
    const dataString = window.localStorage.getItem("favoriteStations");
    if (dataString === null) return;
    const data: string[] = JSON.parse(dataString);
    setIsFavorite(
      data.findIndex((sta) => sta == staCode) !== -1 ? true : false,
    );
  }, [staCode]);
  useEffect(() => {
    const dataString = window.localStorage.getItem("favoriteStations");
    if (dataString === null) return;
    const data: string[] = JSON.parse(dataString);
    const idx = data.findIndex((sta) => sta == staCode);
    if (isFavorite && idx === -1) {
      window.localStorage.setItem(
        "favoriteStations",
        JSON.stringify([...data, staCode]),
      );
    } else if (isFavorite === false && idx !== -1) {
      data.splice(idx);
      const s = JSON.stringify(data);
      window.localStorage.setItem("favoriteStations", s);
    }
  }, [isFavorite, staCode]);
  return (
    <div className={`grid grid-cols-12 ${isOpen ? "bg-gray-100" : "bg-white"}`}>
      <RouteStationLine
        busInfo={busInfo}
        first={first}
        last={last}
        traffic={traffic}
      />
      <div
        className="col-span-11"
        onClick={() => {
          if (isOpen) close();
          else open();
        }}
      >
        <div className="flex items-center gap-2 px-2 py-4 leading-none">
          <div className="rounded bg-gray-200 p-1 text-xs leading-none text-gray-600">
            {staCode}
          </div>
          <div>{staName}</div>
          {(isFavorite || isOpen) && (
            <div
              className="-my-2 ml-auto pr-2"
              onClick={(e) => {
                e.stopPropagation();
                setIsFavorite((prev) => !prev);
              }}
            >
              <div>
                {isFavorite ? (
                  <SolidStarIcon className="h-6 text-yellow-500" />
                ) : (
                  <StarIcon className="h-6 stroke-gray-600" />
                )}
              </div>
            </div>
          )}
        </div>
        {isOpen ? (
          <RouteStationInfoBlock staIndex={staIndex} isOpen={isOpen} />
        ) : null}
      </div>
    </div>
  );
}
