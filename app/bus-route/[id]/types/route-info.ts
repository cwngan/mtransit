export interface RouteData {
  data?: Data;
  header?: string;
}

export interface Data {
  error?: string;
  routeCode: string;
  direction: string;
  routeInfo: StationInfo[];
  msgList: any[];
  routeChange: string;
  routeChangeWebBaseURL: string;
  suspend: string;
}

export interface StationInfo {
  staCode: string;
  staName: string;
  laneName?: string;
  suspendState: string;
  busstopcode: string;
}
