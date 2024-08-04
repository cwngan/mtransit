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
    routeName: params["routeName"],
    dir: params["dir"],
    lang: "zh_tw",
  });
  const result = await DSATInstance.request({
    method: "POST",
    url: "macauweb/routestation/location",
    data,
  });
  return NextResponse.json(result.data);
}
