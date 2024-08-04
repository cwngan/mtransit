export interface GeoTrafficData {
  data: Data[];
  header: Header;
}

export interface Data {
  routeCoordinates: string;
  routeTraffic: string;
  newRouteTraffic: string;
}

export interface Header {
  status: string;
}
