import { Database, Json } from "@/database.types";

export interface StationsNearbyData {
  error?: string;
  data?:
    | Database["public"]["Functions"]["find_stations_nearby"]["Returns"]
    | null;
  status: number;
}

export interface StationInfoData {
  error?: string;
  data?: {
    routes: (
      | {
          name: string;
          type: number;
          key: string;
          company: string;
          color: string;
          change: boolean;
          origin: Json | null;
          destination: Json | null;
          direction: string;
          code: string | null;
          busInfo: {
            distance: number;
            staIndex: number;
            staRemaining: number;
          }[];
        }
      | undefined
    )[];
    station?: Database["public"]["Tables"]["stations"]["Row"];
  };
  status: number;
}
