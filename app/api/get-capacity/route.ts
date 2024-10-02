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
  const reqParams = {
    device: "web",
    routeName,
    dir,
  };
  const result = await DSATInstance.request({
    url: "macauweb/routestation/bus",
    data: reqParams,
    headers: {
      token: getRequestToken("macauweb/routestation/bus", reqParams),
    },
  });
  return NextResponse.json(result.data);
}
