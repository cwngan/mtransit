"use server";

import { DSATInstance } from "@/app/instances/axios";
import getRequestToken from "@/app/utils/getRequestToken";
import { NextRequest, NextResponse } from "next/server";

const requiredKeys = ["routeName", "dir"];

export async function POST(request: NextRequest) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }
  const {
    routeName,
    dir,
  }: {
    routeName: string;
    dir: string;
  } = params;
  const data = {
    action: "opstime",
    routeName,
    dir: routeName === "25B" ? "0" : dir,
    lang: "zh_tw",
    BypassToken: "HuatuTesting0307",
  };
  const result = await DSATInstance.request({
    url: "ddbus/route/operationtime",
    data: new URLSearchParams(data),
    headers: {
      token: getRequestToken("ddbus/route/operationtime", data),
    },
  });
  // console.log(data);
  return NextResponse.json(result.data);
}
