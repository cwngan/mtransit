"use server";

import { NextRequest, NextResponse } from "next/server";
import searchRoutes from "../search-routes";

const requiredKeys = ["query"];

export async function POST(request: NextRequest) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  return NextResponse.json(await searchRoutes(params));
}
