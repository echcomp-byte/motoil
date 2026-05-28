// Temporary hand-rolled Database type — replace with output of:
//   npx supabase gen types typescript --linked > src/lib/supabase/types.ts
// Schema source: supabase/migrations (RLS enforced — clients only see their own rows).

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          teudat_zehut: string | null;
          blood_type: string | null;
          allergies: string[] | null;
          medications: string[] | null;
          conditions: string[] | null;
          kupat_holim: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          teudat_zehut?: string | null;
          blood_type?: string | null;
          allergies?: string[] | null;
          medications?: string[] | null;
          conditions?: string[] | null;
          kupat_holim?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
        Relationships: [];
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          relation: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          relation?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["emergency_contacts"]["Insert"]>;
        Relationships: [];
      };
      bikes: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          year: number | null;
          license_plate: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          make: string;
          model: string;
          year?: number | null;
          license_plate?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["bikes"]["Insert"]>;
        Relationships: [];
      };
      public_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          token?: string;
          expires_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["public_tokens"]["Insert"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
