import { Database, Json } from "@/database.types";
import { supabase } from "../instances/supabase";
import getRouteStationInfo from "./get-route-station-info";

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
export default async function getStationInfo(params: { staCode: string }) {
  const { staCode } = params;

  if (!supabase)
    return {
      error: "could not connect to db.",
      status: 500,
    };
  const res = await supabase.from("stations").select("*").eq("code", staCode);
  const routeKeys = res.data?.[0]?.routes;
  if (!routeKeys || routeKeys.length === 0)
    return { error: "no data.", status: 500 };
  const routes =
    (
      await supabase
        .rpc("get_all_routes_with_origin_and_destination")
        .in("key", routeKeys)
        .select("*")
    ).data || [];
  const data = await Promise.all(
    routes.map(async (route) => {
      if (!route?.name || route.direction === null || !route.code) return;
      const res = await getRouteStationInfo({
        routeName: route.name,
        routeCode: route.code,
        dir: `${route.direction}`,
        staCode,
      });
      if (!res.buses) return;
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
        staIndex: res.staIndex,
        busInfo: res.buses.map((bus) => {
          return {
            distance: bus.distance,
            staIndex: bus.staIndex,
            staRemaining: bus.staRemaining,
          };
        }),
      };
    }),
  );
  return {
    data: { routes: data, station: res.data?.[0] },
    status: 200,
  };
}
