"use server";

import DSATInstance from "../instance";
import { BusData } from "../bus-route/[id]/types/bus";

export async function getBus({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
  const data = new URLSearchParams({
    action: "dy",
    routeName,
    dir,
    lang: "zh_tw",
  });
  const result = await DSATInstance.request<BusData>({
    url: "macauweb/routestation/bus",
    data,
  });
  return result.data;
}
