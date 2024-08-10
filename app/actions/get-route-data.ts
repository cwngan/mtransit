"use server";

import DSATInstance from "../instance";
import { RouteData } from "../bus-route/[id]/types/route-info";

export async function getRouteData({
  routeName,
  dir,
}: {
  routeName: string;
  dir: string;
}) {
  const data = new URLSearchParams({
    action: "sd",
    routeName,
    dir,
    lang: "zh_tw",
  });
  const [result, routeList] = await Promise.all([
    DSATInstance.request<RouteData>({
      url: "macauweb/getRouteData.html",
      data,
    }),
    DSATInstance.request({
      url: "macauweb/getRouteAndCompanyList.html",
    }),
  ]);

  if (!result.data || !routeList.data?.data)
    return { data: { error: "No data." } } as RouteData;

  const routeType = routeList.data.data.routeList?.filter(
    (bus: any) => bus.routeName === routeName,
  )?.[0]?.direction;

  if (!routeType) return { data: { error: "No data." } } as RouteData;

  let returnData = result.data;
  if (!returnData.data) return { data: { error: "No data." } } as RouteData;
  returnData.data.routeType = routeType;
  return returnData;
}
