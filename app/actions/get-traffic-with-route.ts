"use server";

import DSATInstance from "../instance";
import { TrafficWithRouteData } from "../bus-route/[id]/types/traffic-with-route";

export async function getTrafficWithRoute({
  routeCode,
  dir: direction,
}: {
  routeCode: string;
  dir: string;
}) {
  const data = new URLSearchParams({
    device: "web",
    routeCode,
    direction,
    indexType: "00",
  });

  const result = await DSATInstance.request<TrafficWithRouteData>({
    method: "POST",
    url: "ddbus/common/supermap/route/traffic",
    data,
  });
  return result.data;
}
