export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      route_info: {
        Row: {
          change: boolean;
          code: string | null;
          color: string;
          company: string;
          created_at: string;
          destination: string | null;
          direction: number;
          id: number;
          key: string;
          name: string;
          order_key: number;
          origin: string | null;
          stations: string[] | null;
          type: number;
        };
        Insert: {
          change: boolean;
          code?: string | null;
          color: string;
          company: string;
          created_at?: string;
          destination?: string | null;
          direction: number;
          id?: number;
          key: string;
          name: string;
          order_key?: number;
          origin?: string | null;
          stations?: string[] | null;
          type: number;
        };
        Update: {
          change?: boolean;
          code?: string | null;
          color?: string;
          company?: string;
          created_at?: string;
          destination?: string | null;
          direction?: number;
          id?: number;
          key?: string;
          name?: string;
          order_key?: number;
          origin?: string | null;
          stations?: string[] | null;
          type?: number;
        };
        Relationships: [
          {
            foreignKeyName: "route-info_destination_fkey";
            columns: ["destination"];
            isOneToOne: false;
            referencedRelation: "stations";
            referencedColumns: ["code"];
          },
          {
            foreignKeyName: "route-info_origin_fkey";
            columns: ["origin"];
            isOneToOne: false;
            referencedRelation: "stations";
            referencedColumns: ["code"];
          },
        ];
      };
      stations: {
        Row: {
          code: string;
          created_at: string;
          id: string;
          lane_name: string | null;
          lat: number | null;
          lon: number | null;
          name_en: string | null;
          name_pt: string | null;
          name_zh: string | null;
          routes: string[] | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: string;
          lane_name?: string | null;
          lat?: number | null;
          lon?: number | null;
          name_en?: string | null;
          name_pt?: string | null;
          name_zh?: string | null;
          routes?: string[] | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: string;
          lane_name?: string | null;
          lat?: number | null;
          lon?: number | null;
          name_en?: string | null;
          name_pt?: string | null;
          name_zh?: string | null;
          routes?: string[] | null;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      append_routes: {
        Args: {
          station_id: string;
          route_name: string;
        };
        Returns: {
          code: string;
          created_at: string;
          id: string;
          lane_name: string | null;
          lat: number | null;
          lon: number | null;
          name_en: string | null;
          name_pt: string | null;
          name_zh: string | null;
          routes: string[] | null;
        };
      };
      find_nearest_station: {
        Args: {
          target_lat: number;
          target_lon: number;
        };
        Returns: {
          id: string;
          name_zh: string;
          name_pt: string;
          name_en: string;
          routes: string[];
          lat: number;
          lon: number;
          lane_name: string;
          created_at: string;
          code: string;
          distance: number;
        }[];
      };
      get_all_routes_with_origin_and_destination: {
        Args: Record<PropertyKey, never>;
        Returns: {
          code: string;
          color: string;
          company: string;
          change: boolean;
          direction: string;
          name: string;
          key: string;
          type: number;
          origin: Json;
          destination: Json;
        }[];
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never;
