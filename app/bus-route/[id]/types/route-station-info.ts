export type RouteStationInfo = BusInfo[];
export interface BusInfo {
  busPlate: string;
  busCode: string;
  status: string;
  isFacilities: string;
  passengerFlow: string;
  speed: string;
  busType: string;
  staCode: string;
  staName: string;
  staIndex: number;
  lat: string;
  lon: string;
  distance: number;
  traffic: string;
}
