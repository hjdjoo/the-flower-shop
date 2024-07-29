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
      cart_items: {
        Row: {
          card_message: string | null
          created_at: string
          delivery_date: string | null
          delivery_instructions: string | null
          id: number
          order_id: number | null
          product_id: number | null
          recipient_id: number | null
          selected_tier: number | null
        }
        Insert: {
          card_message?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_instructions?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          recipient_id?: number | null
          selected_tier?: number | null
        }
        Update: {
          card_message?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_instructions?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          recipient_id?: number | null
          selected_tier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "cart_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "cart_items_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      order_items: {
        Row: {
          card_message: string | null
          created_at: string
          delivery_date: string | null
          delivery_instructions: string | null
          id: number
          order_id: number | null
          product_id: number | null
          recipient_id: number | null
          selected_tier: number | null
        }
        Insert: {
          card_message?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_instructions?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          recipient_id?: number | null
          selected_tier?: number | null
        }
        Update: {
          card_message?: string | null
          created_at?: string
          delivery_date?: string | null
          delivery_instructions?: string | null
          id?: number
          order_id?: number | null
          product_id?: number | null
          recipient_id?: number | null
          selected_tier?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_recipient_id_fkey"
            columns: ["recipient_id"]
            isOneToOne: false
            referencedRelation: "recipients"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          created_at: string
          id: number
          product_id: number | null
          sender_id: number | null
          stripe_pi_id: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          product_id?: number | null
          sender_id?: number | null
          stripe_pi_id?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          product_id?: number | null
          sender_id?: number | null
          stripe_pi_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      product_categories: {
        Row: {
          created_at: string
          id: number
          is_active: boolean
          modified_at: string | null
          name: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_active?: boolean
          modified_at?: string | null
          name?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_active?: boolean
          modified_at?: string | null
          name?: string | null
        }
        Relationships: []
      }
      products: {
        Row: {
          alt_image_urls: string[] | null
          categories: number[] | null
          created_at: string | null
          deluxe_price: number | null
          description: string | null
          id: number
          image_url: string | null
          modified_at: string | null
          name: string | null
          premium_price: number | null
          prices: number[] | null
          standard_price: number | null
        }
        Insert: {
          alt_image_urls?: string[] | null
          categories?: number[] | null
          created_at?: string | null
          deluxe_price?: number | null
          description?: string | null
          id?: number
          image_url?: string | null
          modified_at?: string | null
          name?: string | null
          premium_price?: number | null
          prices?: number[] | null
          standard_price?: number | null
        }
        Update: {
          alt_image_urls?: string[] | null
          categories?: number[] | null
          created_at?: string | null
          deluxe_price?: number | null
          description?: string | null
          id?: number
          image_url?: string | null
          modified_at?: string | null
          name?: string | null
          premium_price?: number | null
          prices?: number[] | null
          standard_price?: number | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          id: number
          is_admin: boolean
          modified_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: number
          is_admin?: boolean
          modified_at?: string | null
          user_id?: string
        }
        Update: {
          created_at?: string
          id?: number
          is_admin?: boolean
          modified_at?: string | null
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
          id: number
          last_name: string | null
          phone: number | null
          sender_id: number | null
          street_address_1: string | null
          street_address_2: string | null
          zip: number | null
        }
        Insert: {
          city_town?: string | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          phone?: number | null
          sender_id?: number | null
          street_address_1?: string | null
          street_address_2?: string | null
          zip?: number | null
        }
        Update: {
          city_town?: string | null
          created_at?: string
          first_name?: string | null
          id?: number
          last_name?: string | null
          phone?: number | null
          sender_id?: number | null
          street_address_1?: string | null
          street_address_2?: string | null
          zip?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "recipients_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
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
