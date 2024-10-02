"use server";

import DSATInstance from "../instance";
import { TrafficWithRouteData } from "../bus-route/[id]/types/traffic-with-route";
import getRequestToken from "../utils/getRequestToken";

export async function getTrafficWithRoute({
  routeCode,
  dir: direction,
}: {
  routeCode: string;
  dir: string;
}) {
  const data = {
    device: "web",
    routeCode,
    direction,
    indexType: "00",
  };

  const result = await DSATInstance.request<TrafficWithRouteData>({
    method: "POST",
    url: "ddbus/common/supermap/route/traffic",
    data: new URLSearchParams(data),
    headers: {
      token: getRequestToken("ddbus/common/supermap/route/traffic", data),
    },
  });
  return result.data;
}
