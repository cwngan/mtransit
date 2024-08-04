export interface LocationData {
  data: Data;
  header: string;
}

export interface Data {
  stationInfoList: StationInfoList[];
  busInfoList: BusInfoList[];
  lastBusPlate: string;
  lastBusType: string;
  busColor: string;
}

export interface BusInfoList {
  latitude: string;
  longitude: string;
  busPlate: string;
  busType: string;
  speed: number;
}

export interface StationInfoList {
  latitude: string;
  longitude: string;
  stationCode: string;
  stationName: string;
  laneName?: string;
}
