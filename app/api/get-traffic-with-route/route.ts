"use server";

import { TrafficWithRouteData } from "@/app/bus-route/[id]/types/traffic-with-route";
import { DSATInstance } from "@/app/instances/axios";
import getRequestToken from "@/app/utils/getRequestToken";
import { NextRequest, NextResponse } from "next/server";

const requiredKeys = ["routeCode", "dir"];

export async function POST(request: NextRequest) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  const {
    routeCode,
    dir: direction,
  }: {
    routeCode: string;
    dir: string;
  } = params;
  const data = {
    device: "web",
    routeCode,
    direction,
    indexType: "00",
  };

  const result = await DSATInstance.request<TrafficWithRouteData>({
    method: "POST",
    url: "ddbus/common/supermap/route/traffic",
    data: new URLSearchParams(data),
    headers: {
      token: getRequestToken("ddbus/common/supermap/route/traffic", data),
    },
  });
  return NextResponse.json(result.data);
}
