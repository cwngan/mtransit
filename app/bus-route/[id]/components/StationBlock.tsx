import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BusInfo } from "../types/bus";
import { StationInfo } from "../types/route-info";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { useContext, useEffect, useState } from "react";
import useAxios from "@/app/instances/use-axios";
import RouteInfoContext from "../store/RouteInfoContext";

type StationBlockProps = StationInfo & { busInfo: BusInfo[] } & {
  first: boolean;
  last: boolean;
  staIndex: number;
  isOpen: boolean;
  open: () => void;
  close: () => void;
};

export default function StationBlock({
  isOpen,
  open,
  close,
  busInfo,
  staCode,
  staIndex,
  staName,
  first,
  last,
}: StationBlockProps) {
  const routeInfo = useContext(RouteInfoContext);
  const [{ data, loading, error }, getStationInfo] = useAxios({
    url: "route-station-info",
    data: { ...routeInfo, staIndex },
  });
  useEffect(() => {
    if (isOpen) getStationInfo();
  }, [isOpen, getStationInfo]);
  return (
    <div className={`grid grid-cols-12 ${isOpen ? "bg-gray-100" : "bg-white"}`}>
      <div className="col-span-1 -my-1 flex justify-center">
        <div
          className={`relative h-full w-4 ${
            first
              ? "bg-gradient-to-b from-transparent from-[1.875em] to-gray-300 to-[1.875em]"
              : last
                ? "bg-gradient-to-b from-gray-300 from-[1.875em] to-transparent to-[1.875em]"
                : "bg-gray-300"
          }`}
        >
          {busInfo.filter((bus) => bus.status === "0").length > 0 ? (
            <div
              className={`${
                routeInfo?.busColor === "Orange"
                  ? "bg-tcm-orange"
                  : routeInfo?.busColor === "Blue"
                    ? "bg-transmac-blue"
                    : ""
              } absolute -left-[2px] top-[2.875em] z-10 flex h-5 w-5 animate-pulse items-center justify-center rounded leading-none`}
            >
              <FontAwesomeIcon icon={faBus} size="xs" inverse />
            </div>
          ) : null}
          {busInfo.filter((bus) => bus.status === "1").length > 0 ? (
            <div
              className={`${
                routeInfo?.busColor === "Orange"
                  ? "bg-tcm-orange"
                  : routeInfo?.busColor === "Blue"
                    ? "bg-transmac-blue"
                    : ""
              } absolute -left-[2px] top-[1.25rem] z-10 flex h-5 w-5 items-center justify-center rounded leading-none`}
            >
              <FontAwesomeIcon icon={faBus} size="xs" inverse />
            </div>
          ) : null}
          <div className="relative top-[1.375em] h-4 w-4 rounded-full border-2 border-black bg-white"></div>
        </div>
      </div>
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
        </div>
        {isOpen ? (
          <div>
            <pre>{}</pre>
          </div>
        ) : null}
      </div>
    </div>
  );
}
