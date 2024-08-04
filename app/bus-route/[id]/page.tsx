"use client";
import {
  ReducerAction,
  ReducerState,
  useEffect,
  useReducer,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import useAxios from "@/app/instances/use-axios";
import Header from "./components/Header";
import StationList from "./components/StationList";
import { RouteData, StationInfo } from "./types/route-info";
import { BusData, BusInfo } from "./types/bus";
import { RouteDataWithBus } from "@/app/types/bus-route";
import RouteInfoContext from "./store/RouteInfoContext";

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
  // const [
  //   { loading: capacityLoading, data: capacity, error: capacityError },
  //   getCapacity,
  // ] = useAxios({
  //   url: "capacity",
  //   data: { routeName: id, dir: 0 },
  // });

  useEffect(() => {
    if (!routeInfo.routeCode) return;
    const n = window.setInterval(() => {
      getBusData();
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
    getRouteData().then((res) => {
      let data = res.data as RouteDataWithBus;
      if (!data.data) return;
      for (let i = 0; i < data.data.routeInfo.length; i++) {
        data.data.routeInfo[i].busInfo = [];
      }
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
    if (!busData || !routeData?.data) return;
    setCurrentRouteData({
      data: {
        ...routeData.data,
        routeInfo: routeData.data.routeInfo.map((s, i) => {
          const tmp = s as StationInfo & { busInfo: BusInfo[] };
          tmp.busInfo = busData.data.routeInfo[i].busInfo;
          return tmp;
        }),
      },
    });
  }, [busData, routeData]);

  if (routeData?.data?.error) return <div>{routeData.data.error}</div>;

  return (
    <RouteInfoContext.Provider value={routeInfo}>
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
    </RouteInfoContext.Provider>
  );
}
