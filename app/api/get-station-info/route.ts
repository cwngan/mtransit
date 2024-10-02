"use server";
import { APIInstance } from "@/app/instances/axios";
import { supabase } from "@/app/instances/supabase";
import { Database, Json } from "@/database.types";
import { NextRequest, NextResponse } from "next/server";

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

const requiredKeys = ["staCode"];

export async function POST(request: NextRequest) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  const {
    staCode,
  }: {
    staCode: string;
  } = params;

  if (!supabase)
    return NextResponse.json({
      error: "could not connect to db.",
      status: 500,
    });
  const res = await supabase.from("stations").select("*").eq("code", staCode);
  const routeKeys = res.data?.[0]?.routes;
  if (!routeKeys || routeKeys.length === 0)
    return NextResponse.json({ error: "no data.", status: 500 });
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
      const res = await APIInstance.request<
        (BusInfo & {
          staIndex: number;
          staCode: string;
          staRemaining: number;
          staName: string;
          lat: string;
          lon: string;
          distance: number;
          traffic: string;
        })[]
      >({
        url: "get-route-station-info",
        data: {
          routeName: route.name,
          dir: `${route.direction}`,
          routeCode: route.code,
          staCode,
        },
      }).then((res) => res.data);
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
  return NextResponse.json({
    data: { routes: data, station: res.data?.[0] },
    status: 200,
  });
}
