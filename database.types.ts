export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      route_info: {
        Row: {
          change: boolean | null
          code: string | null
          color: string | null
          company: string | null
          created_at: string
          destination: string | null
          direction: number | null
          id: number
          key: string | null
          name: string | null
          origin: string | null
          stations: string[] | null
          type: number | null
        }
        Insert: {
          change?: boolean | null
          code?: string | null
          color?: string | null
          company?: string | null
          created_at?: string
          destination?: string | null
          direction?: number | null
          id?: number
          key?: string | null
          name?: string | null
          origin?: string | null
          stations?: string[] | null
          type?: number | null
        }
        Update: {
          change?: boolean | null
          code?: string | null
          color?: string | null
          company?: string | null
          created_at?: string
          destination?: string | null
          direction?: number | null
          id?: number
          key?: string | null
          name?: string | null
          origin?: string | null
          stations?: string[] | null
          type?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "route-info_destination_fkey"
            columns: ["destination"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["code"]
          },
          {
            foreignKeyName: "route-info_origin_fkey"
            columns: ["origin"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["code"]
          },
        ]
      }
      stations: {
        Row: {
          code: string
          created_at: string
          id: string
          lane_name: string | null
          lat: number | null
          lon: number | null
          name_en: string | null
          name_pt: string | null
          name_zh: string | null
          routes: string[] | null
        }
        Insert: {
          code: string
          created_at?: string
          id?: string
          lane_name?: string | null
          lat?: number | null
          lon?: number | null
          name_en?: string | null
          name_pt?: string | null
          name_zh?: string | null
          routes?: string[] | null
        }
        Update: {
          code?: string
          created_at?: string
          id?: string
          lane_name?: string | null
          lat?: number | null
          lon?: number | null
          name_en?: string | null
          name_pt?: string | null
          name_zh?: string | null
          routes?: string[] | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      append_routes: {
        Args: {
          station_id: string
          route_name: string
        }
        Returns: {
          code: string
          created_at: string
          id: string
          lane_name: string | null
          lat: number | null
          lon: number | null
          name_en: string | null
          name_pt: string | null
          name_zh: string | null
          routes: string[] | null
        }
      }
      get_all_routes_with_origin_and_destination: {
        Args: Record<PropertyKey, never>
        Returns: {
          code: string
          color: string
          company: string
          direction: string
          name: string
          key: string
          type: number
          origin: Json
          destination: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

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
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

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
    : never
