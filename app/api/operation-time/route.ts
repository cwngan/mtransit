import { NextResponse } from "next/server";
import DSATInstance from "../instance";

const requiredKeys = ["routeName", "dir"];

export async function POST(request: Request) {
  const params = await request.json();
  if (typeof params !== "object")
    return NextResponse.json({ error: "Bad Request" }, { status: 400 });

  for (let k of requiredKeys) {
    if (params?.[k] == null)
      return NextResponse.json({ error: `Missing ${k}` }, { status: 400 });
  }

  const data = new URLSearchParams({
    action: "opstime",
    routeName: params["routeName"],
    dir: params["dir"],
    lang: "zh_tw",
    BypassToken: "HuatuTesting0307",
  });
  const result = await DSATInstance.request({
    url: "ddbus/route/operationtime",
    data,
  });
  return NextResponse.json(result.data);
}
