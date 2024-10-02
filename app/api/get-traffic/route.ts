"use server";

import { TrafficData } from "@/app/bus-route/[id]/types/traffic";
import { DSATInstance } from "@/app/instances/axios";
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
  {
    const reqParams = {
      device: "web",
      routeCode,
      direction,
      indexType: "00",
    };

    const result = await DSATInstance.request<TrafficData>({
      method: "GET",
      url: "ddbus/common/supermap/routeStation/traffic",
      params: reqParams,
    });
    return NextResponse.json(result.data);
  }
}
