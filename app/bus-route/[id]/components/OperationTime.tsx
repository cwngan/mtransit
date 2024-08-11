import { getOperationTime } from "@/app/actions/get-operation-time";
import LoadingPlaceholder from "@/app/components/LoadingPlaceholder";
import { BusRouteBase } from "@/app/types/bus-route";
import { useEffect, useRef, useState } from "react";

interface OperationTime extends BusRouteBase {}
export default function OperationTime({ routeName, dir }: OperationTime) {
  const init = useRef<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  useEffect(() => {
    getOperationTime({ routeName, dir }).then((data) => {
      setStartTime(data[0].data[0].firstBusTime);
      setEndTime(data[0].data[0].lastBusTime);
    });
  }, [dir, routeName]);
  return (
    <div className="flex gap-2 border-b bg-white p-2 text-sm">
      <div className="flex">
        <div className="mr-1 rounded bg-yellow-300 px-1 font-mono">頭</div>
        <div>{startTime ? startTime : <LoadingPlaceholder width="3rem" />}</div>
      </div>
      <div className="flex">
        <div className="mr-1 rounded bg-indigo-900 px-1 font-mono text-white">
          尾
        </div>
        <div>{endTime ? endTime : <LoadingPlaceholder width="3rem" />}</div>
      </div>
    </div>
  );
}
