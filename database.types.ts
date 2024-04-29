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
      orders: {
        Row: {
          card_message: string | null
          delivery_date: string | null
          id: number
          order_date: string
          products: string
          recipient_id: string
          sender_id: string | null
        }
        Insert: {
          card_message?: string | null
          delivery_date?: string | null
          id?: number
          order_date?: string
          products: string
          recipient_id: string
          sender_id?: string | null
        }
        Update: {
          card_message?: string | null
          delivery_date?: string | null
          id?: number
          order_date?: string
          products?: string
          recipient_id?: string
          sender_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_orders_products_fkey"
            columns: ["products"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          name?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          categories: number[]
          created_at: string
          deluxe_price: number | null
          description: string | null
          id: string
          image_url: string | null
          name: string | null
          premium_price: number | null
          standard_price: number | null
        }
        Insert: {
          categories?: number[]
          created_at?: string
          deluxe_price?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          premium_price?: number | null
          standard_price?: number | null
        }
        Update: {
          categories?: number[]
          created_at?: string
          deluxe_price?: number | null
          description?: string | null
          id?: string
          image_url?: string | null
          name?: string | null
          premium_price?: number | null
          standard_price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: string
          is_admin: boolean
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_admin?: boolean
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: string
          is_admin?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_profiles_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      recipients: {
        Row: {
          city_town: string | null
          created_at: string
          first_name: string | null
          id: string | null
          last_name: string | null
          phone: number | null
          street_address_1: string | null
          street_address_2: string | null
          zip: number | null
        }
        Insert: {
          city_town?: string | null
          created_at?: string
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          phone?: number | null
          street_address_1?: string | null
          street_address_2?: string | null
          zip?: number | null
        }
        Update: {
          city_town?: string | null
          created_at?: string
          first_name?: string | null
          id?: string | null
          last_name?: string | null
          phone?: number | null
          street_address_1?: string | null
          street_address_2?: string | null
          zip?: number | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
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