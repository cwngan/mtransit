"use server";

import { Database } from "@/database.types";
import { supabase } from "../instances/supabase";

export default async function getNearestStations({
  position,
}: {
  position: {
    latitude: number;
    longitude: number;
  };
}): Promise<NearestStationsData> {
  if (!supabase) return { error: "could not connect to db.", status: 500 };
  const res = await supabase
    .rpc("find_nearest_station", {
      target_lat: position.latitude,
      target_lon: position.longitude,
    })
    .limit(5)
    .select("*");
  const data = res.data;
  return { data, status: 200 };
}
