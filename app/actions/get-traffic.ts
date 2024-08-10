"use server";

import DSATInstance from "../instance";
import { TrafficData } from "../bus-route/[id]/types/traffic";

export async function getTraffic({
  routeCode,
  dir: direction,
}: {
  routeCode: string;
  dir: string;
}) {
  const reqParams = {
    device: "web",
    routeCode,
    direction,
    indexType: "00",
  };

  const result = await DSATInstance.request<TrafficData>({
    method: "GET",
    url: "ddbus/common/supermap/routeStation/traffic",
    params: reqParams,
  });
  return result.data;
}
