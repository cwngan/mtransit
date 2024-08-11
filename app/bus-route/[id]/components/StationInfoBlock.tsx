import { useContext, useRef, useEffect, useState } from "react";
import RouteInfoContext from "../store/RouteInfoContext";
import { RouteStationInfo } from "../types/route-station-info";
import { faWheelchair } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { getRouteStationInfo } from "@/app/actions/get-route-station-info";
import LoadingPlaceholder from "@/app/components/LoadingPlaceholder";

interface StationInfoProps {
  staIndex: number;
  isOpen: boolean;
}

export default function StationInfoBlock({
  staIndex,
  isOpen,
}: StationInfoProps) {
  const { routeCode, routeName, dir } = useContext(RouteInfoContext);
  const [data, setData] = useState<RouteStationInfo | null>(null);
  const [error, setError] = useState<boolean>(false);
  const interval = useRef<number | null>(null);
  useEffect(() => {
    if (!routeCode || !routeName || !dir) return;
    if (isOpen) {
      getRouteStationInfo({ routeCode, routeName, dir, staIndex })
        .then((res) => {
          setData(res);
        })
        .catch(() => {
          setError(true);
        });
      interval.current = window.setInterval(() => {
        getRouteStationInfo({ routeCode, routeName, dir, staIndex })
          .then((res) => {
            setData(res);
          })
          .catch(() => {
            setError(true);
          });
      }, 2500);
    } else {
      if (interval.current !== null) window.clearInterval(interval.current);
    }
    return () => {
      if (interval.current !== null) window.clearInterval(interval.current);
    };
  }, [isOpen, routeCode, routeName, dir, staIndex]);
  return (
    <div className="flex flex-col gap-2 pb-4 pl-2 pr-4">
      {data && data.length > 0 ? (
        data.map((bus) => {
          return (
            <div key={bus.busPlate} className="flex items-end gap-1">
              {bus.busType !== "" && (
                <div className="flex h-5 w-8 items-center justify-center rounded bg-violet-700 text-xs leading-none text-white">
                  {bus.busType === "1"
                    ? "大巴"
                    : bus.busType === "2"
                      ? "中巴"
                      : "小巴"}
                </div>
              )}
              {bus.isFacilities === "0" && (
                <div className="flex h-5 w-5 items-center justify-center rounded bg-gray-500 leading-none">
                  <FontAwesomeIcon icon={faWheelchair} size="sm" inverse />
                </div>
              )}
              {/* <div className="rounded bg-gray-900 p-1 font-mono text-xs leading-none text-white">
                      {bus.busPlate}
                    </div> */}
              <div className="ml-2 flex items-end font-mono leading-none">
                <div className="mr-1 text-xl leading-none">
                  {staIndex - bus.staIndex === 0
                    ? "到站"
                    : staIndex - bus.staIndex}
                </div>
                {staIndex - bus.staIndex !== 0 ? <div>站</div> : null}
              </div>
              <div className="ml-1 flex items-end font-mono leading-none">
                {bus.distance > 0.95 ? (
                  <>
                    <span className="mr-1 text-xl leading-none">
                      {Math.round(bus.distance * 10) / 10}
                    </span>
                    <span>km</span>
                  </>
                ) : bus.distance > 0 ? (
                  <>
                    <span className="mr-1 text-xl leading-none">
                      {"<"}
                      {Math.ceil(bus.distance * 20) * 50}
                    </span>
                    <span>m</span>
                  </>
                ) : staIndex !== bus.staIndex ? (
                  <>
                    <span className="mr-1 text-xl leading-none">0</span>
                    <span>m</span>
                  </>
                ) : null}
              </div>
              {bus.speed != "" ? (
                <div className="mb-1 ml-auto flex items-end text-gray-500">
                  <span className="text-sm leading-none">{bus.speed}</span>
                  <span className="text-xs leading-none">km/h</span>
                </div>
              ) : null}
              {bus.traffic !== "-1" ? (
                bus.traffic === "1" ? (
                  <div className="flex items-end rounded bg-green-300 p-1 text-sm leading-none">
                    行車暢順
                  </div>
                ) : bus.traffic === "2" ? (
                  <div className="flex items-end rounded bg-yellow-300 p-1 text-sm leading-none">
                    行車緩慢
                  </div>
                ) : (
                  <div className="flex items-end rounded bg-red-300 p-1 text-sm leading-none">
                    行程受阻
                  </div>
                )
              ) : null}
            </div>
          );
        })
      ) : data && data.length == 0 ? (
        <div className="text-xl">未發車</div>
      ) : error ? (
        <div>Error</div>
      ) : (
        <div>
          <LoadingPlaceholder lines={2} width="12rem" />
        </div>
      )}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </div>
  );
}
