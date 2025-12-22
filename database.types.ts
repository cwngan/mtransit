export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4";
  };
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
          extensions?: Json;
          operationName?: string;
          query?: string;
          variables?: Json;
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
          dsat_id: string | null;
          dsat_label: string | null;
          id: string;
          image_url: string | null;
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
          dsat_id?: string | null;
          dsat_label?: string | null;
          id?: string;
          image_url?: string | null;
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
          dsat_id?: string | null;
          dsat_label?: string | null;
          id?: string;
          image_url?: string | null;
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
        Args: { route_name: string; station_id: string };
        Returns: {
          code: string;
          created_at: string;
          dsat_id: string | null;
          dsat_label: string | null;
          id: string;
          image_url: string | null;
          lane_name: string | null;
          lat: number | null;
          lon: number | null;
          name_en: string | null;
          name_pt: string | null;
          name_zh: string | null;
          routes: string[] | null;
        };
        SetofOptions: {
          from: "*";
          to: "stations";
          isOneToOne: true;
          isSetofReturn: false;
        };
      };
      find_stations_nearby: {
        Args: { target_lat: number; target_lon: number };
        Returns: {
          code: string;
          created_at: string;
          distance: number;
          id: string;
          lane_name: string;
          lat: number;
          lon: number;
          name_en: string;
          name_pt: string;
          name_zh: string;
          routes: string[];
        }[];
      };
      get_all_routes_with_origin_and_destination: {
        Args: never;
        Returns: {
          change: boolean;
          code: string;
          color: string;
          company: string;
          destination: Json;
          direction: string;
          key: string;
          name: string;
          origin: Json;
          type: number;
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<
  keyof Database,
  "public"
>];

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const;
