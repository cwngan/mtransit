"use server";

import DSATInstance from "../instance";
import { LocationData } from "../bus-route/[id]/types/location";
import { supabase } from "../instances/supabase";

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
              .insert([
                {
                  code: sta.stationCode,
                  name_zh: sta.stationName,
                  lat: parseFloat(sta.latitude),
                  lon: parseFloat(sta.longitude),
                  lane_name: sta.laneName ? sta.laneName : null,
                  routes: [`${routeName}_${dir}`],
                },
              ])
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
  // updateDatabase(result.data, routeName, dir);
  return result.data;
}
