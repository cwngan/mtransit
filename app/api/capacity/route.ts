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

  const reqParams = {
    device: "web",
    routeName: params["routeName"],
    dir: params["dir"],
  };
  const result = await DSATInstance.request({
    method: "GET",
    url: "ddbus/common/station/capacity",
    params: reqParams,
  });
  return NextResponse.json(result.data);
}
