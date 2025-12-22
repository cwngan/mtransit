import { TrafficData } from "../bus-route/[id]/types/traffic";
import { DSATInstance } from "../instances/axios";

export default async function getTraffic(params: {
  routeCode: string;
  dir: string;
}) {
  const { routeCode, dir: direction } = params;
  const reqParams = {
    device: "web",
    routeCode,
    direction,
    indexType: "00",
    lang: "zh_tw", // idk why there's no text response but still needs
  };

  const result = await DSATInstance.request<TrafficData>({
    method: "GET",
    url: "ddbus/common/supermap/routeStation/traffic",
    params: reqParams,
  });
  return result.data;
}
