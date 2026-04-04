export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      episode_completions: {
        Row: {
          completion_pct: number
          created_at: string
          duration_ms: number | null
          episode_id: string | null
          episode_name: string
          id: string
          last_played_at: string
          progress_ms: number | null
          show_name: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          completion_pct?: number
          created_at?: string
          duration_ms?: number | null
          episode_id?: string | null
          episode_name: string
          id?: string
          last_played_at?: string
          progress_ms?: number | null
          show_name: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          completion_pct?: number
          created_at?: string
          duration_ms?: number | null
          episode_id?: string | null
          episode_name?: string
          id?: string
          last_played_at?: string
          progress_ms?: number | null
          show_name?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      playlist_items: {
        Row: {
          created_at: string
          episode_description: string | null
          episode_name: string
          external_url: string | null
          id: string
          image_url: string | null
          listened: boolean
          playlist_id: string
          position: number
          reason: string | null
          show_name: string
          source_recommendation_id: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          episode_description?: string | null
          episode_name: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          listened?: boolean
          playlist_id: string
          position?: number
          reason?: string | null
          show_name: string
          source_recommendation_id?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          episode_description?: string | null
          episode_name?: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          listened?: boolean
          playlist_id?: string
          position?: number
          reason?: string | null
          show_name?: string
          source_recommendation_id?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_items_playlist_id_fkey"
            columns: ["playlist_id"]
            isOneToOne: false
            referencedRelation: "playlist_queues"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "playlist_items_source_recommendation_id_fkey"
            columns: ["source_recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      playlist_queues: {
        Row: {
          category: string
          created_at: string
          id: string
          name: string
          updated_at: string
          user_id: string
        }
        Insert: {
          category: string
          created_at?: string
          id?: string
          name: string
          updated_at?: string
          user_id: string
        }
        Update: {
          category?: string
          created_at?: string
          id?: string
          name?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      playlist_saves: {
        Row: {
          created_at: string
          episode_name: string
          id: string
          recommendation_id: string | null
          show_name: string
          spotify_playlist_id: string
          spotify_playlist_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          episode_name: string
          id?: string
          recommendation_id?: string | null
          show_name: string
          spotify_playlist_id: string
          spotify_playlist_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          episode_name?: string
          id?: string
          recommendation_id?: string | null
          show_name?: string
          spotify_playlist_id?: string
          spotify_playlist_name?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "playlist_saves_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          id?: string
          user_id?: string
        }
        Relationships: []
      }
      recommendation_feedback: {
        Row: {
          created_at: string
          feedback: string
          id: string
          recommendation_id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          feedback: string
          id?: string
          recommendation_id: string
          user_id: string
        }
        Update: {
          created_at?: string
          feedback?: string
          id?: string
          recommendation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_feedback_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          created_at: string
          episode_description: string | null
          episode_id: string | null
          episode_name: string
          external_url: string | null
          id: string
          image_url: string | null
          is_new_show: boolean | null
          reason: string | null
          score: number | null
          show_id: string | null
          show_name: string
          user_id: string
        }
        Insert: {
          created_at?: string
          episode_description?: string | null
          episode_id?: string | null
          episode_name: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_new_show?: boolean | null
          reason?: string | null
          score?: number | null
          show_id?: string | null
          show_name: string
          user_id: string
        }
        Update: {
          created_at?: string
          episode_description?: string | null
          episode_id?: string | null
          episode_name?: string
          external_url?: string | null
          id?: string
          image_url?: string | null
          is_new_show?: boolean | null
          reason?: string | null
          score?: number | null
          show_id?: string | null
          show_name?: string
          user_id?: string
        }
        Relationships: []
      }
      spotify_tokens: {
        Row: {
          access_token: string
          created_at: string
          expires_at: string
          id: string
          refresh_token: string
          updated_at: string
          user_id: string
        }
        Insert: {
          access_token: string
          created_at?: string
          expires_at: string
          id?: string
          refresh_token: string
          updated_at?: string
          user_id: string
        }
        Update: {
          access_token?: string
          created_at?: string
          expires_at?: string
          id?: string
          refresh_token?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      taste_profiles: {
        Row: {
          analysis_count: number
          created_at: string
          id: string
          last_analyzed_at: string | null
          listening_history_snapshot: Json | null
          profile_data: Json
          updated_at: string
          user_id: string
        }
        Insert: {
          analysis_count?: number
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          listening_history_snapshot?: Json | null
          profile_data?: Json
          updated_at?: string
          user_id: string
        }
        Update: {
          analysis_count?: number
          created_at?: string
          id?: string
          last_analyzed_at?: string | null
          listening_history_snapshot?: Json | null
          profile_data?: Json
          updated_at?: string
          user_id?: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
