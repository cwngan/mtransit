import { BusData } from "../bus-route/[id]/types/bus";
import { DSATInstance } from "../instances/axios";
import getRequestToken from "../utils/getRequestToken";

export async function getBus(params: { routeName: string; dir: string }) {
  const data = {
    action: "dy",
    routeName: params["routeName"],
    dir: params["dir"],
    lang: "zh_tw",
  };
  const result = await DSATInstance.request<BusData>({
    url: "macauweb/routestation/bus",
    data: new URLSearchParams(data),
    headers: {
      token: getRequestToken("macauweb/routestation/bus", data),
    },
  });
  return result.data;
}
