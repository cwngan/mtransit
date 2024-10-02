"use server";

import { supabase } from "@/app/instances/supabase";
import { Database } from "@/database.types";
import { NextRequest, NextResponse } from "next/server";

export interface NearestStationsData {
  error?: string;
  data?:
    | Database["public"]["Functions"]["find_nearest_station"]["Returns"]
    | null;
  status: number;
}

const requiredKeys = ["position"];

export async function POST(request: NextRequest) {
  if (!supabase) return { error: "could not connect to db.", status: 500 };
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  const {
    position,
  }: {
    position: {
      latitude: number;
      longitude: number;
    };
  } = params;
  const res = await supabase
    .rpc("find_nearest_station", {
      target_lat: position.latitude,
      target_lon: position.longitude,
    })
    .limit(5)
    .select("*");
  const data = res.data;
  return NextResponse.json({ data, status: 200 });
}
