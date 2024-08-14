"use server";

import { Database } from "@/database.types";
import { supabase } from "../instances/supabase";

export interface NearestStationsData {
  error?: string;
  data?:
    | Database["public"]["Functions"]["find_nearest_station"]["Returns"]
    | null;
  status: number;
}

export default async function getNearestStations(
  prevState: NearestStationsData | null,
  {
    position,
  }: {
    position: {
      latitude: number;
      longitude: number;
    };
  },
): Promise<NearestStationsData> {
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
