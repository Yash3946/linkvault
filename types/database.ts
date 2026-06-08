export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          handle: string;
          created_at: string;
        };
        Insert: {
          id: string;
          email: string;
          handle: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          handle?: string;
          created_at?: string;
        };
        Relationships: [];
      };
      bookmarks: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          url: string;
          is_public: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          url: string;
          is_public?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          url?: string;
          is_public?: boolean;
          created_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          handle: string;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
