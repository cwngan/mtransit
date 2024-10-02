"use server";

import { supabase } from "@/app/instances/supabase";
import { NextRequest, NextResponse } from "next/server";

const requiredKeys = ["query"];

export async function POST(request: NextRequest) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  const { query } = params;
  if (!supabase) return;
  const { data, error } = await supabase
    .rpc("get_all_routes_with_origin_and_destination")
    .ilike("name", `%${query}%`)
    .select("*")
    .limit(10);
  return NextResponse.json(data);
}
