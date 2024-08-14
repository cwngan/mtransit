"use server";
import { supabase } from "../instances/supabase";
import { getRouteStationInfo } from "./get-route-station-info";
import { Database, Json } from "@/database.types";

export interface StationInfoData {
  error?: string;
  data?: Data;
  status: number;
}

interface Data {
  routes: (Route | undefined)[];
  station?: Database["public"]["Tables"]["stations"]["Row"];
}

interface Route {
  name: string;
  type: number;
  key: string;
  company: string;
  color: string;
  change: boolean;
  origin: Json | null;
  destination: Json | null;
  direction: string;
  code: string | null;
  busInfo: BusInfo[];
}

interface BusInfo {
  distance: number;
  staIndex: number;
  staRemaining: number;
}

export async function getStationInfo({
  staCode,
}: {
  staCode: string;
}): Promise<StationInfoData> {
  if (!supabase) return { error: "could not connect to db.", status: 500 };
  const res = await supabase.from("stations").select("*").eq("code", staCode);
  const routeKeys = res.data?.[0]?.routes;
  if (!routeKeys || routeKeys.length === 0)
    return { error: "no data.", status: 500 };
  const routes = await Promise.all(
    routeKeys.map(async (key) => {
      if (!supabase) return;
      const r = await supabase
        .rpc("get_all_routes_with_origin_and_destination")
        .eq("key", key)
        .select("*");
      return r.data?.[0];
    }),
  );
  const data = await Promise.all(
    routes.map(async (route) => {
      if (!route?.name || route.direction === null || !route.code) return;
      const res = await getRouteStationInfo({
        routeName: route.name,
        dir: `${route.direction}`,
        routeCode: route.code,
        staCode,
      });
      return {
        name: route.name,
        type: route.type,
        company: route.company,
        color: route.color,
        change: route.change,
        origin: route.origin,
        destination: route.destination,
        direction: route.direction,
        key: route.key,
        code: route.code,
        busInfo: res.map((bus) => {
          return {
            distance: bus.distance,
            staIndex: bus.staIndex,
            staRemaining: bus.staRemaining,
          };
        }),
      };
    }),
  );
  return { data: { routes: data, station: res.data?.[0] }, status: 200 };
}
