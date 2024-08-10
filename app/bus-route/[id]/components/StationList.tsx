import { RouteDataWithBus } from "@/app/types/bus-route";
import { BusInfo } from "../types/bus";
import { StationInfo } from "../types/route-info";
import StationBlock from "./StationBlock";
import { useState } from "react";
import LoadingPlaceholder from "@/app/components/LoadingPlaceholder";

export default function StationList({ data }: RouteDataWithBus) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div>
      {data && data.routeInfo.length > 0 ? (
        data.routeInfo.map(
          (
            station: StationInfo & { busInfo: BusInfo[]; traffic: string },
            index,
          ) => {
            return (
              <StationBlock
                {...station}
                key={index + station.staCode}
                first={index === 0}
                last={index === data.routeInfo.length - 1}
                staIndex={index}
                isOpen={openIndex === index}
                open={() => {
                  setOpenIndex(index);
                }}
                close={() => {
                  setOpenIndex(null);
                }}
                traffic={station.traffic}
              />
            );
          },
        )
      ) : (
        <div className="relative p-4">
          <div className="from-0 absolute z-10 h-full w-full bg-gradient-to-b from-transparent to-white to-100%"></div>
          <LoadingPlaceholder lines={10} gap="1rem" lineHeight="2.25rem" />
        </div>
      )}
    </div>
  );
}
