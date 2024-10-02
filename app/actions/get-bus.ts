"use server";

import DSATInstance from "../instance";
import { BusData } from "../bus-route/[id]/types/bus";
import getRequestToken from "../utils/getRequestToken";

export async function getBus({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
  const data = {
    action: "dy",
    routeName,
    dir,
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
