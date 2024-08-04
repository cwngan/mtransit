import { useContext, useEffect } from "react";
import { BusInfo } from "../types/bus";
import RouteInfoContext from "../store/RouteInfoContext";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useAxios from "@/app/instances/use-axios";

interface StationLineProps {
  first: boolean;
  last: boolean;
  busInfo: BusInfo[];
}
export default function StationLine({
  first,
  last,
  busInfo,
}: StationLineProps) {
  const routeInfo = useContext(RouteInfoContext);
  return (
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
  );
}
