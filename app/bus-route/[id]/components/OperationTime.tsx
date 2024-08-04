import APIInstance from "@/app/instances/axios";
import { BusRouteBase } from "@/app/types/bus-route";
import { useEffect, useRef, useState } from "react";

interface OperationTime extends BusRouteBase {}
export default function OperationTime({ routeName, dir }: OperationTime) {
  const init = useRef<boolean>(false);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [endTime, setEndTime] = useState<string | null>(null);
  useEffect(() => {
    if (init.current) return;
    init.current = true;
    APIInstance.request({
      url: "operation-time",
      method: "POST",
      data: { routeName, dir },
    }).then((res) => {
      setStartTime(res.data[0].data[0].firstBusTime);
      setEndTime(res.data[0].data[0].lastBusTime);
    });
  }, [dir, routeName]);
  return (
    <div className="flex gap-2 border-b bg-white p-2 text-sm">
      <div className="flex">
        <div className="mr-1 rounded bg-yellow-300 px-1 font-mono">頭</div>
        <div>{startTime ? startTime : "Loading"}</div>
      </div>
      <div className="flex">
        <div className="mr-1 rounded bg-indigo-900 px-1 font-mono text-white">
          尾
        </div>
        <div>{endTime ? endTime : "Loading..."}</div>
      </div>
    </div>
  );
}
