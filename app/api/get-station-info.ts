import { Database, Json } from "@/database.types";
import { supabase } from "../instances/supabase";
import getRouteStationInfo from "./get-route-station-info";
import { DSATInstance } from "../instances/axios";

export type DSATStationInfo = {
  data: DSATStationInfoDatum[];
  header: DSATStationInfoHeader;
};

export interface DSATStationInfoDatum {
  routeDynamicinfo: DSATStationInfoRouteDynamicinfo[];
  stacode: string;
}

export interface DSATStationInfoRouteDynamicinfo {
  buslabel: string;
  busstopCode: string;
  dir: string;
  nonOperation: boolean;
  routecode: string;
  stopcounts: string;
  stopxh: string;
}

export interface DSATStationInfoHeader {
  status: string;
}

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
  const stationRes = await supabase
    .from("stations")
    .select("*")
    .eq("code", staCode);
  if (!stationRes.data) return { error: "no data.", status: 500 };

  const routeKeys = await supabase
    .from("route_stations")
    .select("name,direction")
    .match({ dsat_id: stationRes.data[0].dsat_id });

  if (!routeKeys.data || routeKeys.data.length === 0)
    return { error: "no data.", status: 500 };

  const unfilteredRoutes =
    (
      await supabase
        .rpc("get_all_routes_with_origin_and_destination")
        .select("*")
    ).data || [];

  const routes = unfilteredRoutes.filter((route) =>
    routeKeys.data?.some(
      (key) => key.name === route.name && key.direction === route.direction,
    ),
  );

  const dsatStationInfo = await DSATInstance.request<DSATStationInfo[]>({
    method: "POST",
    url: "ddbus/dynamic/station/v2",
    data: new URLSearchParams({
      staCode: stationRes.data[0].dsat_id || "",
      action: "staCode",
      BypassToken: "HuatuTesting0307", // some weird entry that has to be put in order to yield results
    }),
  }).then((res) => res.data);
  const dsatStationInfoObj: {
    [routeCode: string]: DSATStationInfoRouteDynamicinfo;
  } = {};
  for (let route of dsatStationInfo[0].data[0].routeDynamicinfo) {
    dsatStationInfoObj[route.routecode] = route;
  }
  const data = await Promise.all(
    routes.map(async (route) => {
      if (!route?.name || route.direction === null || !route.code) return;
      const res = await getRouteStationInfo({
        routeName: route.name,
        routeCode: route.code,
        dir: `${route.direction}`,
        staCode,
        limit: 1,
      });
      if (!res.buses) return;
      const dsatRoute = dsatStationInfoObj[route.code];
      if (!dsatRoute) return;
      return {
        name: route.name,
        type: route.type,
        company: route.company,
        color: route.color,
        change: route.change,
        origin: route.origin,
        destination: route.destination,
        direction: route.direction,
        code: route.code,
        staIndex: res.staIndex,
        busInfo: {
          staRemaining: dsatRoute.nonOperation
            ? 9999 // Not operating
            : res.buses.length > 0
              ? res.buses[0].staRemaining
              : 999, // Operating but no bus
          operating: !dsatRoute.nonOperation,
          distance:
            res.buses.length > 0
              ? res.buses[0].distance
              : dsatRoute.nonOperation
                ? 9999999 // Not operating
                : 999999, // Operating but no bus
        },
      };
    }),
  );
  data.sort((a, b) => {
    if (!a || !b) return 0;
    return a.busInfo.distance === b.busInfo.distance
      ? a.code > b.code
        ? 1
        : a.code === b.code
          ? 0
          : -1
      : a.busInfo.distance - b.busInfo.distance;
  });
  return {
    data: { routes: data, station: stationRes.data?.[0] },
    status: 200,
  };
}
