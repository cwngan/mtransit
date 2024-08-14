"use client";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Header from "./components/Header";
import RouteStationList from "./components/RouteStationList";
import { RouteData, StationInfo } from "./types/route-info";
import { BusData, BusInfo } from "./types/bus";
import { RouteDataWithBus } from "@/app/types/bus-route";
import RouteInfoContext from "./store/RouteInfoContext";
import { TrafficData } from "./types/traffic";
import { getRouteData } from "@/app/actions/get-route-data";
import { getBus } from "@/app/actions/get-bus";
import { getTraffic } from "@/app/actions/get-traffic";

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
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [busData, setBusData] = useState<BusData | null>(null);
  const [trafficData, setTrafficData] = useState<TrafficData | null>(null);

  useEffect(() => {
    const n = window.setInterval(() => {
      if (!routeInfo.routeCode || !routeInfo.routeName || !routeInfo.dir)
        return;
      getBus({ routeName: routeInfo.routeName, dir: routeInfo.dir }).then(
        (data) => {
          setBusData(data);
        },
      );
      getTraffic({ routeCode: routeInfo.routeCode, dir: routeInfo.dir }).then(
        (data) => {
          setTrafficData(data);
        },
      );
    }, 5000);
    return () => {
      window.clearInterval(n);
    };
  }, [routeInfo.dir, routeInfo.routeCode, routeInfo.routeName]);

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
    getTraffic({ routeCode: routeInfo.routeCode, dir: routeInfo.dir }).then(
      (data) => {
        setTrafficData(data);
      },
    );
  }, [routeInfo.routeCode, routeInfo.dir]);

  useEffect(() => {
    if (!id || !dir) return;
    getRouteData({ routeName: id, dir }).then((res) => {
      setRouteData(res);
      let data = res as RouteDataWithBus;
      if (!data.data) return;
      setRouteInfo((prev) => {
        return {
          ...prev,
          routeCode: data.data?.routeCode,
          routeType: data.data?.routeType,
        };
      });
    });
  }, [dir, id]);

  useEffect(() => {
    if (!id || !dir) return;
    getBus({ routeName: id, dir }).then((data) => {
      setBusData(data);
      setRouteInfo((prev) => {
        return { ...prev, busColor: data.data.busColor };
      });
    });
  }, [dir, id]);

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
      <div style={{ paddingTop: `${headerRef.current?.clientHeight || 80}px` }}>
        <RouteStationList {...currentRouteData} />
      </div>
    </RouteInfoContext.Provider>
  );
}
