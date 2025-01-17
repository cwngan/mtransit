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
  const res = await supabase.from("stations").select("*").eq("code", staCode);
  const routeKeys = res.data?.[0]?.routes;
  if (!res.data || !routeKeys || routeKeys.length === 0)
    return { error: "no data.", status: 500 };
  const routes =
    (
      await supabase
        .rpc("get_all_routes_with_origin_and_destination")
        .in("key", routeKeys)
        .select("*")
    ).data || [];
  const dsatRouteInfo = await DSATInstance.request<DSATStationInfo[]>({
    method: "POST",
    url: "ddbus/dynamic/station/v2",
    data: new URLSearchParams({
      staCode: res.data[0].dsat_id || "",
      action: "staCode",
      BypassToken: "HuatuTesting0307", // some weird entry that has to be put in order to yield results
    }),
  }).then((res) => res.data);
  const dsatRouteInfoObj: {
    [routeCode: string]: DSATStationInfoRouteDynamicinfo;
  } = {};
  for (let route of dsatRouteInfo[0].data[0].routeDynamicinfo) {
    dsatRouteInfoObj[route.routecode] = route;
  }
  const data = await Promise.all(
    routes.map(async (route) => {
      if (!route?.name || route.direction === null || !route.code) return;
      // const res = await getRouteStationInfo({
      //   routeName: route.name,
      //   routeCode: route.code,
      //   dir: `${route.direction}`,
      //   staCode,
      // });
      // if (!res.buses) return;
      const dsatRoute = dsatRouteInfoObj[route.code];
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
        key: route.key,
        code: route.code,
        staIndex: parseInt(dsatRoute.stopxh) - 1,
        busInfo: {
          staRemaining:
            dsatRoute.stopcounts === "n"
              ? dsatRoute.nonOperation
                ? 9999
                : 999
              : dsatRoute.stopcounts === "x"
                ? 1
                : parseInt(dsatRoute.stopcounts),
          operating: !dsatRoute.nonOperation,
        },
        // busInfo: res.buses.map((bus) => {
        //   return {
        //     distance: bus.distance,
        //     staIndex: bus.staIndex,
        //     staRemaining: bus.staRemaining,
        //   };
        // }),
      };
    }),
  );
  data.sort((a, b) => {
    if (!a || !b) return 0;
    return a.busInfo.staRemaining === b.busInfo.staRemaining
      ? a.code > b.code
        ? 1
        : a.code === b.code
          ? 0
          : -1
      : a.busInfo.staRemaining - b.busInfo.staRemaining;
  });
  return {
    data: { routes: data, station: res.data?.[0] },
    status: 200,
  };
}
