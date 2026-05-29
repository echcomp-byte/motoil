export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
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
          locale: string | null;
          created_at: string | null;
          updated_at: string | null;
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
          locale?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          teudat_zehut?: string | null;
          blood_type?: string | null;
          allergies?: string[] | null;
          medications?: string[] | null;
          conditions?: string[] | null;
          kupat_holim?: string | null;
          locale?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey";
            columns: ["id"];
            isOneToOne: true;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      emergency_contacts: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          phone: string;
          relation: string | null;
          priority: number;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          phone: string;
          relation?: string | null;
          priority?: number;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          phone?: string;
          relation?: string | null;
          priority?: number;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "emergency_contacts_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      bikes: {
        Row: {
          id: string;
          user_id: string;
          make: string;
          model: string;
          year: number | null;
          license_plate: string | null;
          is_primary: boolean;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          make: string;
          model: string;
          year?: number | null;
          license_plate?: string | null;
          is_primary?: boolean;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          make?: string;
          model?: string;
          year?: number | null;
          license_plate?: string | null;
          is_primary?: boolean;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "bikes_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
      public_tokens: {
        Row: {
          id: string;
          user_id: string;
          token: string;
          expires_at: string | null;
          revoked_at: string | null;
          created_at: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          token?: string;
          expires_at?: string | null;
          revoked_at?: string | null;
          created_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string;
          token?: string;
          expires_at?: string | null;
          revoked_at?: string | null;
          created_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "public_tokens_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};

export const KUPAT_HOLIM_OPTIONS = ["clalit", "maccabi", "meuhedet", "leumit"] as const;
export type KupatHolim = (typeof KUPAT_HOLIM_OPTIONS)[number];

export const BLOOD_TYPE_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"] as const;
export type BloodType = (typeof BLOOD_TYPE_OPTIONS)[number];
