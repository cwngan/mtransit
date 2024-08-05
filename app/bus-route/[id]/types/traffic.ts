export interface TrafficData {
  data: Data;
  header: Header;
}

export interface Data {
  routeCode: string;
  stationInfo: StationInfo[];
}

export interface StationInfo {
  stationCode: string;
  trafficLevel: number;
  newRouteTraffic: string;
}

export interface Header {
  status: string;
}
