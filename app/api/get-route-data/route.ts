"use server";

import { RouteData } from "@/app/bus-route/[id]/types/route-info";
import { DSATInstance } from "@/app/instances/axios";
import { supabase } from "@/app/instances/supabase";
import getRequestToken from "@/app/utils/getRequestToken";
import { NextRequest, NextResponse } from "next/server";

async function updateDatabase(
  routeList: any,
  routeData: RouteData,
  detailedInfo: any,
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
  await supabase.from("route_info").upsert(rowsToAdd, { onConflict: "key" });
  // update route data
  if (routeData.data?.routeInfo) {
    const res = await supabase
      .from("route_info")
      .update({
        origin: routeData.data.routeInfo[0].staCode,
        destination: routeData.data.routeInfo.findLast(() => true)?.staCode,
        code: routeData.data.routeCode,
        stations: routeData.data.routeInfo.map((sta) => sta.staCode),
      })
      .eq("key", `${routeName}_${dir}`);
    // console.log(res)
  }

  if (detailedInfo.header.status === "000") {
    const data = detailedInfo.data[0];
    await Promise.all(
      data.routeinfo.map((station: any) => {
        return supabase
          ?.from("stations")
          .update({
            dsat_id: station.stacode,
            dsat_label: station.stalabel,
            image_url: station.stationurl,
          })
          .eq("code", station.stationcode);
      }),
    );
    for (let sta of data.routeinfo) {
      supabase
        .from("stations")
        .select()
        .eq("code", sta.stationcode)
        .then((value) => {
          if (!supabase) return;
          if (value.data?.length === 0) {
            supabase
              .from("stations")
              .upsert(
                [
                  {
                    code: sta.stationcode,
                    name_zh: sta.staname,
                    lat: parseFloat(sta.lat),
                    lon: parseFloat(sta.log),
                    lane_name: sta.laneName ? sta.laneName : null,
                    routes: [`${routeName}_${dir}`],
                  },
                ],
                { onConflict: "code" },
              )
              .then(() => {
                // console.log("Insert success");
              });
          } else {
            // console.log(`Updating ${sta.stationName}`);
            supabase
              .rpc("append_routes", {
                station_id: sta.stationcode,
                route_name: `${routeName}_${dir}`,
              })
              .then((value) => {});
          }
        });
    }
    const current_stations = await supabase
      .from("stations")
      .select("*")
      .contains("routes", [`${routeName}_${dir}`]);
    if (!current_stations.data) return;
    // console.log(current_stations.data);
    const extra = current_stations.data.filter(
      ({ code }) =>
        data.routeinfo.filter((sta: any) => sta.stationcode === code).length ===
        0,
    );
    let promises = [];
    for (let sta of extra) {
      if (!sta.routes) continue;
      sta.routes = sta.routes.filter(
        (route) => route !== `${routeName}_${dir}`,
      );
      promises.push(supabase.from("stations").update(sta).eq("id", sta.id));
    }
    await Promise.all(promises);
    // console.log(extra);
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
  const data1 = {
    action: "sd",
    routeName,
    dir,
    lang: "zh_tw",
  };
  const [routeData, routeList] = await Promise.all([
    DSATInstance.request<RouteData>({
      url: "macauweb/getRouteData.html",
      data: new URLSearchParams(data1),
      headers: {
        token: getRequestToken("macauweb/getRouteData.html", data1),
      },
    }),
    DSATInstance.request({
      url: "macauweb/getRouteAndCompanyList.html",
      headers: {
        token: getRequestToken("macauweb/getRouteData.html"),
      },
    }),
  ]);

  if (!routeData.data || !routeList.data?.data?.routeList)
    return NextResponse.json({ data: { error: "No data." } } as RouteData);

  const routeType = routeList.data.data.routeList?.filter(
    (route: any) => route.routeName === routeName,
  )?.[0]?.direction;

  if (!routeType)
    return NextResponse.json({ data: { error: "No data." } } as RouteData);

  let returnData = routeData.data;
  if (!returnData.data)
    return NextResponse.json({ data: { error: "No data." } } as RouteData);
  returnData.data.routeType = routeType;

  // const data2 = {
  //   routecode: returnData.data.routeCode,
  //   dir,
  //   device: "web",
  //   lang: "zh_tw",
  //   BypassToken: "HuatuTesting0307",
  //   HUID: crypto.randomUUID(),
  // };

  // DSATInstance.request<RouteData>({
  //   url: "ddbus/app/routestation/station",
  //   data: new URLSearchParams(data2),
  //   headers: {
  //     token: getRequestToken("ddbus/app/routestation/station", data2),
  //   },
  // }).then((detailedInfo) => {
  //   updateDatabase(
  //     routeList,
  //     routeData.data,
  //     detailedInfo.data,
  //     routeName,
  //     dir,
  //   );
  // });

  return NextResponse.json(returnData);
}
