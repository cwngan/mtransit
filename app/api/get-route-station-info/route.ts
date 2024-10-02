"use server";

import { BusData, BusInfo } from "@/app/bus-route/[id]/types/bus";
import { LocationData } from "@/app/bus-route/[id]/types/location";
import { TrafficWithRouteData } from "@/app/bus-route/[id]/types/traffic-with-route";
import { APIInstance } from "@/app/instances/axios";
import getDistance from "@/app/utils/getDistance";
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
  let {
    routeCode,
    routeName,
    dir,
    staIndex,
    staCode,
    limit = 3,
  }: {
    routeCode?: string;
    routeName: string;
    dir: string;
    staIndex?: number;
    staCode?: string;
    limit?: number;
  } = params;
  if (!routeCode) {
    let { data: tmp } = await APIInstance.request({
      url: "get-route-data",
      method: "POST",
      data: { routeName, dir },
    });
    if (!tmp.data?.routeCode) return NextResponse.json([]);
    routeCode = tmp.data.routeCode;
  }
  const [busData, locationData, geoTrafficData] = await Promise.all([
    APIInstance.request<BusData>({
      url: "get-bus",
      method: "POST",
      data: { routeName, dir },
    }).then((res) => res.data),
    APIInstance.request<LocationData>({
      url: "get-location",
      method: "POST",
      data: { routeName, dir, routeCode },
    }).then((res) => res.data),
    APIInstance.request<TrafficWithRouteData>({
      url: "get-traffic-with-route",
      method: "POST",
      data: { routeCode, dir },
    }).then((res) => res.data),
  ]);

  let buses: (BusInfo & {
    staIndex: number;
    staCode: string;
    staRemaining: number;
    staName: string;
    lat: string;
    lon: string;
    distance: number;
    traffic: string;
  })[] = [];

  if (staIndex === undefined) {
    staIndex = busData.data.routeInfo.findIndex(
      (sta) => sta.staCode === staCode,
    );
    if (staIndex === -1) return NextResponse.json([]);
  }

  for (let i = staIndex; i >= 0; i--) {
    if (buses.length >= limit) break;
    let bi = busData.data.routeInfo[i].busInfo;
    for (let bus of bi) {
      if (i === staIndex && bus.status === "0") continue;
      const location = locationData.data.busInfoList.find(
        (b) => b.busPlate === bus.busPlate,
      );
      buses.push({
        ...bus,
        staCode: locationData.data.stationInfoList[i].stationCode,
        staName: locationData.data.stationInfoList[i].stationName,
        staIndex: i,
        staRemaining: staIndex - i,
        lat: location?.latitude || "0",
        lon: location?.longitude || "0",
        distance: 0,
        traffic: geoTrafficData.data[i].newRouteTraffic,
      });
    }
  }
  buses = buses.slice(0, 3);
  for (let i = 0; i < buses.length; i++) {
    const busStaIndex = buses[i].staIndex;
    let distance = 0;
    if (busStaIndex === staIndex) continue;
    let { lat, lon } = buses[i];
    let tmp = geoTrafficData.data[busStaIndex].routeCoordinates
      .split(";")
      .findIndex(
        (s) =>
          parseFloat(s.split(",")[0]) === parseFloat(lon) &&
          parseFloat(s.split(",")[1]) === parseFloat(lat),
      );
    let p = geoTrafficData.data[busStaIndex].routeCoordinates
      .split(";")
      .slice(tmp)
      .filter((s) => s.length > 0)
      .map((s) => {
        return { lat: s.split(",")[1], lon: s.split(",")[0] };
      });
    distance += getDistance(p);
    for (let j = busStaIndex + 1; j < staIndex; j++) {
      let points: { lat: string; lon: string }[] = geoTrafficData.data[
        j
      ].routeCoordinates
        .split(";")
        .filter((s) => s.length > 0)
        .map((s) => {
          return { lat: s.split(",")[1], lon: s.split(",")[0] };
        });
      distance += getDistance(points);
    }
    buses[i].distance = distance;
  }

  return NextResponse.json(buses);
}
