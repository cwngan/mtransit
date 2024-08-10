"use server";

import { BusInfo } from "@/app/bus-route/[id]/types/bus";
import getDistance from "@/app/utils/getDistance";
import { getBus } from "./get-bus";
import { getLocation } from "./get-location";
import { getTrafficWithRoute } from "./get-traffic-with-route";

export async function getRouteStationInfo({
  routeCode,
  routeName,
  dir,
  staIndex,
}: {
  routeCode: string;
  routeName: string;
  dir: string;
  staIndex: number;
}) {
  const [busData, locationData, geoTrafficData] = await Promise.all([
    getBus({ routeName, dir }),
    getLocation({ routeName, dir }),
    getTrafficWithRoute({ routeCode, dir }),
  ]);

  let buses: (BusInfo & {
    staIndex: number;
    staCode: string;
    staName: string;
    lat: string;
    lon: string;
    distance: number;
    traffic: string;
  })[] = [];
  for (let i = staIndex; i >= 0; i--) {
    if (buses.length >= 3) break;
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

  return buses;
}
