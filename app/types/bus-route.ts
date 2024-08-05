import { BusInfo } from "../bus-route/[id]/types/bus";
import {
  Data,
  RouteData,
  StationInfo,
} from "../bus-route/[id]/types/route-info";

export interface BusRouteBase {
  routeName: string;
  dir: string;
}

export interface RouteDataWithBus extends RouteData {
  data?: Data & {
    routeInfo: (StationInfo & { busInfo: BusInfo[]; traffic: string })[];
  };
}
