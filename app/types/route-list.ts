export interface RouteListData {
  code: string;
  color: Color;
  company: Company;
  direction: string;
  name: string;
  key: string;
  type: number;
  origin: Destination;
  destination: Destination;
}

export enum Color {
  Blue = "Blue",
  Orange = "Orange",
}

export enum Company {
  新福利 = "新福利",
  澳門 = "澳門",
}

export interface Destination {
  sta_code: string;
  sta_name: string;
  lane_name: LaneName | null;
}

export enum LaneName {
  A車道 = "A 車道",
  B車道 = "B 車道",
  C車道 = "C 車道",
  D車道 = "D 車道",
  E車道 = "E 車道",
  F車道 = "F 車道",
  G車道 = "G 車道",
  落客區 = "落客區",
}
