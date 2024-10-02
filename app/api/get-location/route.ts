"use server";

import { LocationData } from "@/app/bus-route/[id]/types/location";
import { DSATInstance } from "@/app/instances/axios";
import { supabase } from "@/app/instances/supabase";
import getRequestToken from "@/app/utils/getRequestToken";
import { NextRequest, NextResponse } from "next/server";

async function updateDatabase(
  data: LocationData,
  routeName: string,
  dir: string,
) {
  if (supabase) {
    for (let sta of data.data.stationInfoList) {
      supabase
        .from("stations")
        .select()
        .eq("code", sta.stationCode)
        .then((value) => {
          if (!supabase) return;
          if (value.data?.length === 0) {
            supabase
              .from("stations")
              .upsert(
                [
                  {
                    code: sta.stationCode,
                    name_zh: sta.stationName,
                    lat: parseFloat(sta.latitude),
                    lon: parseFloat(sta.longitude),
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
                station_id: sta.stationCode,
                route_name: `${routeName}_${dir}`,
              })
              .then((value) => {});
          }
        });
    }
  }
}

const requiredKeys = ["routeName", "dir", "routeCode"];

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
    routeCode,
  }: {
    routeName: string;
    dir: string;
    routeCode: string;
  } = params;
  const data = {
    routeName,
    dir,
    lang: "zh_tw",
    routeCode,
    device: "web",
  };
  const result = await DSATInstance.request<LocationData>({
    method: "POST",
    url: "macauweb/routestation/location",
    data: new URLSearchParams(data),
    headers: {
      token: getRequestToken("/routestation/location", data),
    },
  });
  // console.log(result.headers);
  // console.log(result.data);
  // updateDatabase(result.data, routeName, dir);
  return NextResponse.json(result.data);
}
