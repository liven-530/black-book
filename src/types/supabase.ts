export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      events: {
        Row: {
          created_at: string | null
          id: number
          location: string
          name: string
          time: string
          type: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          location: string
          name: string
          time: string
          type: string
        }
        Update: {
          created_at?: string | null
          id?: number
          location?: string
          name?: string
          time?: string
          type?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          boss_role: string | null
          channel_id: string
          created_at: string | null
          event_role: string | null
          guild_id: string
          helltide: boolean
          helltide_role: string | null
          id: number
          role: string | null
          worldboss: boolean
          zoneevent: boolean
        }
        Insert: {
          boss_role?: string | null
          channel_id: string
          created_at?: string | null
          event_role?: string | null
          guild_id: string
          helltide?: boolean
          helltide_role?: string | null
          id?: number
          role?: string | null
          worldboss?: boolean
          zoneevent?: boolean
        }
        Update: {
          boss_role?: string | null
          channel_id?: string
          created_at?: string | null
          event_role?: string | null
          guild_id?: string
          helltide?: boolean
          helltide_role?: string | null
          id?: number
          role?: string | null
          worldboss?: boolean
          zoneevent?: boolean
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
