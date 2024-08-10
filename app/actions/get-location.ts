"use server";

import DSATInstance from "../instance";
import { LocationData } from "../bus-route/[id]/types/location";

export async function getLocation({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
  const data = new URLSearchParams({
    routeName,
    dir,
    lang: "zh_tw",
  });
  const result = await DSATInstance.request<LocationData>({
    method: "POST",
    url: "macauweb/routestation/location",
    data,
  });
  return result.data;
}
