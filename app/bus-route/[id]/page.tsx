"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import useAxios from "@/app/instances/use-axios";
import Header from "./components/Header";
import StationList from "./components/StationList";
import { RouteData } from "./types/route-info";
import { BusData } from "./types/bus";
import { RouteDataWithBus } from "@/app/types/bus-route";
import BusColorContext from "./store/RouteInfoContext";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const router = useRouter();
  const init = useRef<boolean>(false);
  const headerRef = useRef<HTMLDivElement>(null);
  const [routeInfo, setRouteInfo] = useState<{
    routeCode?: string;
    routeName: string;
    dir: string;
    busColor?: string;
  }>({ routeName: id, dir: "0" });
  const [currentRouteData, setCurrentRouteData] =
    useState<RouteDataWithBus | null>(null);
  const [
    { loading: routeDataLoading, data: routeData, error: routeDataError },
    getRouteData,
  ] = useAxios<RouteData>({
    url: "route-data",
    data: { routeName: id, dir: 0 },
  });
  const [
    { loading: busDataLoading, data: busData, error: busDataError },
    getBusData,
  ] = useAxios<BusData>({
    url: "bus",
    data: { routeName: id, dir: 0 },
  });
  const [
    { loading: capacityLoading, data: capacity, error: capacityError },
    getCapacity,
  ] = useAxios({
    url: "capacity",
    data: { routeName: id, dir: 0 },
  });
  const [
    { loading: trafficLoading, data: traffic, error: trafficError },
    getTraffic,
  ] = useAxios({
    url: "traffic",
  });

  useEffect(() => {
    if (!routeInfo.routeCode) return;
    const n = window.setInterval(() => {
      getBusData();
      getCapacity();
      getTraffic({ data: { routeCode: routeInfo.routeCode, dir: 0 } });
    }, 5000);
    return () => {
      window.clearInterval(n);
    };
  }, [routeInfo]);

  useEffect(() => {
    getCapacity();
  }, [getCapacity]);

  useEffect(() => {
    getRouteData().then((res) => {
      let data = res.data as RouteDataWithBus;
      if (!data.data) return;
      for (let i = 0; i < data.data.routeInfo.length; i++) {
        data.data.routeInfo[i].busInfo = [];
      }
      setCurrentRouteData(data);
      setRouteInfo((prev) => {
        return { ...prev, routeCode: data.data?.routeCode };
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
    console.log("route info changed");
  }, [routeInfo]);

  useEffect(() => {
    if (!routeData?.data) return;
    getTraffic({ data: { routeCode: routeData.data.routeCode, dir: 0 } });
  }, [routeData, getTraffic]);

  useEffect(() => {
    if (!busData) return;
    setCurrentRouteData((prev) => {
      let tmp = prev;
      if (!tmp?.data) return null;
      for (let i = 0; i < busData.data.routeInfo.length; i++) {
        tmp.data.routeInfo[i].busInfo = busData.data.routeInfo[i].busInfo;
      }
      return tmp;
    });
  }, [busData, currentRouteData?.data]);

  if (routeData?.data?.error) return <div>{routeData.data.error}</div>;

  return (
    <BusColorContext.Provider value={routeInfo}>
      <Header
        routeName={id}
        from={routeData?.data?.routeInfo[0].staName}
        to={routeData?.data?.routeInfo.findLast(() => true)?.staName}
        dir={0}
        ref={headerRef}
      />
      <div style={{ paddingTop: `${headerRef.current?.clientHeight || 0}px` }}>
        <StationList {...currentRouteData} />
      </div>
    </BusColorContext.Provider>
  );
}
