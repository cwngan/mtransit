import { RouteDataWithBus } from "@/app/types/bus-route";
import { BusInfo } from "../types/bus";
import { StationInfo } from "../types/route-info";
import StationBlock from "./StationBlock";
import { useState } from "react";

export default function StationList({ data }: RouteDataWithBus) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <div>
      {data && data.routeInfo.length > 0
        ? data.routeInfo.map(
            (station: StationInfo & { busInfo: BusInfo[] }, index) => {
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
                />
              );
            },
          )
        : null}
    </div>
  );
}
