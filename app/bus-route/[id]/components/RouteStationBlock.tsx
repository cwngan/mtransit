import { BusInfo } from "../types/bus";
import { StationInfo } from "../types/route-info";
import RouteStationLine from "./RouteStationLine";
import RouteStationInfoBlock from "./RouteStationInfoBlock";

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
        </div>
        {isOpen ? (
          <RouteStationInfoBlock staIndex={staIndex} isOpen={isOpen} />
        ) : null}
      </div>
    </div>
  );
}