export interface BusData {
  data: Data;
  header: string;
}

export interface Data {
  busColor: string;
  lastBusPlate: string;
  lastBusType: string;
  routeInfo: StationInfo[];
  toBeginBus: string;
}

export interface StationInfo {
  staCode: string;
  busInfo: BusInfo[];
}

export interface BusInfo {
  busPlate: string;
  busCode: string;
  status: string;
  isFacilities: string;
  passengerFlow: string;
  speed: string;
  busType: string;
}
