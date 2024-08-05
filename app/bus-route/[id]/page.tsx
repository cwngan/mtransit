"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import useAxios from "@/app/instances/use-axios";
import Header from "./components/Header";
import StationList from "./components/StationList";
import { RouteData, StationInfo } from "./types/route-info";
import { BusData, BusInfo } from "./types/bus";
import { RouteDataWithBus } from "@/app/types/bus-route";
import RouteInfoContext from "./store/RouteInfoContext";
import { TrafficData } from "./types/traffic";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const searchParams = useSearchParams();
  const dir = searchParams.get("dir") || "0";
  const headerRef = useRef<HTMLDivElement>(null);
  const [routeInfo, setRouteInfo] = useState<{
    routeCode?: string;
    routeName: string;
    routeType?: string;
    dir: string;
    busColor?: string;
  }>({ routeName: id, dir });
  const [currentRouteData, setCurrentRouteData] =
    useState<RouteDataWithBus | null>(null);
  const [
    { loading: routeDataLoading, data: routeData, error: routeDataError },
    getRouteData,
  ] = useAxios<RouteData>({
    url: "route-data",
    data: { routeName: id, dir },
  });
  const [
    { loading: busDataLoading, data: busData, error: busDataError },
    getBusData,
  ] = useAxios<BusData>({
    url: "bus",
    data: { routeName: id, dir },
  });
  // const [
  //   { loading: capacityLoading, data: capacity, error: capacityError },
  //   getCapacity,
  // ] = useAxios({
  //   url: "capacity",
  //   data: { routeName: id, dir },
  // });
  const [
    { loading: trafficLoading, data: trafficData, error: trafficError },
    getTraffic,
  ] = useAxios<TrafficData>({
    url: "traffic",
  });

  useEffect(() => {
    if (!routeInfo.routeCode) return;
    const n = window.setInterval(() => {
      getBusData();
      getTraffic({ data: { ...routeInfo } });
      // getCapacity();
    }, 5000);
    return () => {
      window.clearInterval(n);
    };
  }, [routeInfo]);

  // useEffect(() => {
  //   getCapacity();
  // }, [getCapacity]);

  useEffect(() => {
    setRouteInfo((prev) => {
      return { ...prev, dir };
    });
  }, [dir]);

  useEffect(() => {
    if (!routeInfo.routeCode || !routeInfo.dir) return;
    getTraffic({ data: { ...routeInfo } });
  }, [getTraffic, routeInfo]);

  useEffect(() => {
    getRouteData().then((res) => {
      let data = res.data as RouteDataWithBus;
      if (!data.data) return;
      setRouteInfo((prev) => {
        return {
          ...prev,
          routeCode: data.data?.routeCode,
          routeType: data.data?.routeType,
        };
      });
    });
  }, [getRouteData]);

  useEffect(() => {
    getBusData().then((res) => {
      setRouteInfo((prev) => {
        return { ...prev, busColor: res.data.data.busColor };
      });
    });
  }, [getBusData]);

  useEffect(() => {
    if (!busData || !routeData?.data || !trafficData) return;
    setCurrentRouteData({
      data: {
        ...routeData.data,
        routeInfo: routeData.data.routeInfo.map((s, i) => {
          const tmp = s as StationInfo & {
            busInfo: BusInfo[];
            traffic: string;
          };
          tmp.busInfo = busData.data.routeInfo?.[i]?.busInfo || [];
          tmp.traffic =
            trafficData.data.stationInfo?.[i]?.newRouteTraffic || "-1";
          return tmp;
        }),
      },
    });
  }, [busData, routeData, trafficData]);

  if (routeData?.data?.error) return <div>{routeData.data.error}</div>;

  return (
    <RouteInfoContext.Provider value={routeInfo}>
      <Header
        routeName={id}
        from={routeData?.data?.routeInfo[0].staName}
        to={routeData?.data?.routeInfo.findLast(() => true)?.staName}
        dir={dir}
        ref={headerRef}
      />
      <div style={{ paddingTop: `${headerRef.current?.clientHeight || 0}px` }}>
        <StationList {...currentRouteData} />
      </div>
    </RouteInfoContext.Provider>
  );
}
