import { useContext, useEffect, useMemo } from "react";
import { BusInfo } from "../types/bus";
import RouteInfoContext from "../store/RouteInfoContext";
import { faBus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface StationLineProps {
  first: boolean;
  last: boolean;
  busInfo: BusInfo[];
  traffic: string;
}
export default function StationLine({
  first,
  last,
  busInfo,
  traffic,
}: StationLineProps) {
  const routeInfo = useContext(RouteInfoContext);
  const roadClasses = useMemo(() => {
    if (last) return `relative h-fit w-4 top-[1.625rem]`;
    if (traffic === "1")
      return `relative h-full w-4 bg-green-300 top-[1.625rem]`;
    else if (traffic === "2")
      return `relative h-full w-4 bg-yellow-300 top-[1.625rem]`;
    else if (traffic === "3")
      return `relative h-full w-4 bg-red-300 top-[1.625rem]`;
    else return `relative h-full w-4 bg-gray-300 top-[1.625rem]`;
  }, [traffic, last]);
  const busIconClasses = useMemo(() => {
    return `${
      routeInfo?.busColor === "Orange"
        ? "bg-tcm-orange"
        : routeInfo?.busColor === "Blue"
          ? "bg-transmac-blue"
          : ""
    } absolute -left-[2px] z-10 flex h-5 w-5 items-center justify-center rounded leading-none`;
  }, [routeInfo?.busColor]);
  return (
    <div className="col-span-1 flex justify-center">
      <div className={roadClasses}>
        {busInfo.filter((bus) => bus.status === "0").length > 0 ? (
          <div className={`${busIconClasses} top-4 animate-pulse`}>
            <FontAwesomeIcon icon={faBus} size="xs" inverse />
          </div>
        ) : null}
        {busInfo.filter((bus) => bus.status === "1").length > 0 ? (
          <div className={`${busIconClasses} -top-[0.625rem]`}>
            <FontAwesomeIcon icon={faBus} size="xs" inverse />
          </div>
        ) : null}
        <div className="relative -top-2 h-4 w-4 rounded-full border-2 border-black bg-white"></div>
      </div>
    </div>
  );
}
