"use server";

import DSATInstance from "../instance";
import { RouteData } from "../bus-route/[id]/types/route-info";
import { supabase } from "../instances/supabase";

async function updateDatabase(
  routeList: any,
  routeData: RouteData,
  routeName: string,
  dir: string,
) {
  if (!supabase) return;
  // add new routes to route_info
  const rowsToAdd = [];
  for (let route of routeList.data.data.routeList) {
    const company = route.color === "Blue" ? "新福利" : "澳門";
    rowsToAdd.push({
      company,
      color: route.color,
      type: parseInt(route.direction),
      direction: 0,
      change: route.routeChange === "1",
      name: route.routeName,
      key: `${route.routeName}_${0}`,
    });
    if (route.direction === "0")
      rowsToAdd.push({
        company,
        color: route.color,
        type: parseInt(route.direction),
        direction: 1,
        change: route.routeChange === "1",
        name: route.routeName,
        key: `${route.routeName}_${1}`,
      });
  }
  await supabase.from("route_info").insert(rowsToAdd);
  // update route data
  if (routeData.data?.routeInfo) {
    await supabase
      .from("route_info")
      .update({
        origin: routeData.data.routeInfo[0].staCode,
        destination: routeData.data.routeInfo.findLast(() => true)?.staCode,
        code: routeData.data.routeCode,
        stations: routeData.data.routeInfo.map((sta) => sta.staCode),
      })
      .eq("name_direction", `${routeName}_${dir}`);
  }
}

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

  if (!result.data || !routeList.data?.data?.routeList)
    return { data: { error: "No data." } } as RouteData;

  const routeType = routeList.data.data.routeList?.filter(
    (route: any) => route.routeName === routeName,
  )?.[0]?.direction;

  if (!routeType) return { data: { error: "No data." } } as RouteData;

  let returnData = result.data;
  if (!returnData.data) return { data: { error: "No data." } } as RouteData;
  returnData.data.routeType = routeType;

  // updateDatabase(routeList, result.data, routeName, dir);

  return returnData;
}
