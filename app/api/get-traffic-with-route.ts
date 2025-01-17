import { TrafficWithRouteData } from "../bus-route/[id]/types/traffic-with-route";
import { DSATInstance } from "../instances/axios";
import getRequestToken from "../utils/getRequestToken";

export default async function getTrafficWithRoute(params: {
  routeCode: string;
  dir: string;
}) {
  const { routeCode, dir: direction } = params;
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
