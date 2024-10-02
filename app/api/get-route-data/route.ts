"use server";

import { RouteData } from "@/app/bus-route/[id]/types/route-info";
import { DSATInstance } from "@/app/instances/axios";
import { supabase } from "@/app/instances/supabase";
import getRequestToken from "@/app/utils/getRequestToken";
import { NextRequest, NextResponse } from "next/server";

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

const requiredKeys = ["routeName", "dir"];

export async function POST(request: NextRequest) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  const {
    routeName,
    dir,
  }: {
    routeName: string;
    dir: string;
  } = params;
  const data = {
    action: "sd",
    routeName,
    dir,
    lang: "zh_tw",
  };
  const [result, routeList] = await Promise.all([
    DSATInstance.request<RouteData>({
      url: "macauweb/getRouteData.html",
      data: new URLSearchParams(data),
      headers: {
        token: getRequestToken("macauweb/getRouteData.html", data),
      },
    }),
    DSATInstance.request({
      url: "macauweb/getRouteAndCompanyList.html",
      headers: {
        token: getRequestToken("macauweb/getRouteData.html"),
      },
    }),
  ]);

  if (!result.data || !routeList.data?.data?.routeList)
    return NextResponse.json({ data: { error: "No data." } } as RouteData);

  const routeType = routeList.data.data.routeList?.filter(
    (route: any) => route.routeName === routeName,
  )?.[0]?.direction;

  if (!routeType)
    return NextResponse.json({ data: { error: "No data." } } as RouteData);

  let returnData = result.data;
  if (!returnData.data)
    return NextResponse.json({ data: { error: "No data." } } as RouteData);
  returnData.data.routeType = routeType;

  // updateDatabase(routeList, result.data, routeName, dir);

  return NextResponse.json(returnData);
}
