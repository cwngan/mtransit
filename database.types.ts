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
  public: {
    Tables: {
      company: {
        Row: {
          color: string;
          created_at: string;
          name: string;
        };
        Insert: {
          color: string;
          created_at?: string;
          name: string;
        };
        Update: {
          color?: string;
          created_at?: string;
          name?: string;
        };
        Relationships: [];
      };
      route_info: {
        Row: {
          change: boolean;
          code: string | null;
          company: string;
          created_at: string;
          direction: number;
          disabled: boolean;
          key: string;
          name: string;
          order_key: number;
          stations: string[] | null;
          type: number;
        };
        Insert: {
          change: boolean;
          code?: string | null;
          company: string;
          created_at?: string;
          direction: number;
          disabled?: boolean;
          key: string;
          name: string;
          order_key?: number;
          stations?: string[] | null;
          type: number;
        };
        Update: {
          change?: boolean;
          code?: string | null;
          company?: string;
          created_at?: string;
          direction?: number;
          disabled?: boolean;
          key?: string;
          name?: string;
          order_key?: number;
          stations?: string[] | null;
          type?: number;
        };
        Relationships: [
          {
            foreignKeyName: "route_info_company_fkey";
            columns: ["company"];
            isOneToOne: false;
            referencedRelation: "company";
            referencedColumns: ["name"];
          },
        ];
      };
      route_stations: {
        Row: {
          created_at: string;
          direction: number;
          dsat_id: string | null;
          name: string;
          position: number;
        };
        Insert: {
          created_at?: string;
          direction: number;
          dsat_id?: string | null;
          name: string;
          position: number;
        };
        Update: {
          created_at?: string;
          direction?: number;
          dsat_id?: string | null;
          name?: string;
          position?: number;
        };
        Relationships: [
          {
            foreignKeyName: "route_station_dsat_id_fkey";
            columns: ["dsat_id"];
            isOneToOne: false;
            referencedRelation: "stations";
            referencedColumns: ["dsat_id"];
          },
          {
            foreignKeyName: "route_station_name_direction_fkey";
            columns: ["name", "direction"];
            isOneToOne: false;
            referencedRelation: "route_info";
            referencedColumns: ["name", "direction"];
          },
        ];
      };
      stations: {
        Row: {
          code: string;
          created_at: string;
          dsat_id: string;
          dsat_label: string | null;
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
          dsat_id: string;
          dsat_label?: string | null;
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
          dsat_id?: string;
          dsat_label?: string | null;
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
      find_stations_nearby: {
        Args: { target_lat: number; target_lon: number };
        Returns: {
          code: string;
          created_at: string;
          distance: number;
          lane_name: string;
          lat: number;
          lon: number;
          name_en: string;
          name_pt: string;
          name_zh: string;
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
          direction: number;
          name: string;
          origin: Json;
          type: string;
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
  public: {
    Enums: {},
  },
} as const;
