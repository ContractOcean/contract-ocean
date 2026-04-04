export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          full_name: string;
          avatar_url: string | null;
          role: 'admin' | 'manager' | 'member';
          company_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>;
      };
      contracts: {
        Row: {
          id: string;
          name: string;
          counterparty: string;
          owner_id: string;
          owner_name: string;
          category: string;
          status: 'draft' | 'in_review' | 'sent' | 'awaiting_signature' | 'signed' | 'completed' | 'expiring_soon' | 'archived';
          created_at: string;
          updated_at: string;
          expiry_date: string;
          value: number;
          signature_status: string;
          content: Json | null;
        };
        Insert: Omit<Database['public']['Tables']['contracts']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['contracts']['Insert']>;
      };
      contacts: {
        Row: {
          id: string;
          name: string;
          email: string;
          role: string;
          company: string;
          phone: string;
          tags: string[];
          contract_count: number;
          status: 'active' | 'inactive';
          last_activity: string;
          owner_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>;
      };
      templates: {
        Row: {
          id: string;
          name: string;
          category: string;
          description: string;
          use_case: string;
          estimated_time: string;
          popular: boolean;
          recommended: boolean;
          usage_count: number;
          content: Json | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['templates']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['templates']['Insert']>;
      };
      activity_feed: {
        Row: {
          id: string;
          action: string;
          description: string;
          contract_id: string | null;
          user_id: string;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['activity_feed']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['activity_feed']['Insert']>;
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
