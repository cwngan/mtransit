import { NextResponse } from "next/server";
import DSATInstance from "../instance";
import { supabase } from "@/app/instances/supabase";

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
    action: "sd",
    routeName: params["routeName"],
    dir: params["dir"],
    lang: "zh_tw",
  });
  const [result, routeList] = await Promise.all([
    DSATInstance.request({
      url: "macauweb/getRouteData.html",
      data,
    }),
    DSATInstance.request({
      url: "macauweb/getRouteAndCompanyList.html",
    }),
  ]);

  if (!result.data || !routeList.data?.data)
    return NextResponse.json({ error: `No Data` }, { status: 404 });

  const routeType = routeList.data.data.routeList?.filter(
    (bus: any) => bus.routeName === params["routeName"],
  )?.[0]?.direction;

  if (!routeType)
    return NextResponse.json({ error: `No Data` }, { status: 404 });

  let returnData = result.data;
  returnData.data.routeType = routeType;
  return NextResponse.json(returnData);
}
