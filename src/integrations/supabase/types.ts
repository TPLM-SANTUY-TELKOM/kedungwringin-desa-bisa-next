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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      penduduk: {
        Row: {
          agama: Database["public"]["Enums"]["agama"]
          alamat: string
          created_at: string
          dusun: string
          id: string
          jenis_kelamin: Database["public"]["Enums"]["jenis_kelamin"]
          nama: string
          nik: string
          no_kk: string
          pekerjaan: string | null
          pendidikan: string | null
          rt: string
          rw: string
          status: Database["public"]["Enums"]["status_penduduk"]
          status_kawin: Database["public"]["Enums"]["status_kawin"]
          tanggal_lahir: string
          tempat_lahir: string
          updated_at: string
        }
        Insert: {
          agama: Database["public"]["Enums"]["agama"]
          alamat: string
          created_at?: string
          dusun: string
          id?: string
          jenis_kelamin: Database["public"]["Enums"]["jenis_kelamin"]
          nama: string
          nik: string
          no_kk: string
          pekerjaan?: string | null
          pendidikan?: string | null
          rt: string
          rw: string
          status?: Database["public"]["Enums"]["status_penduduk"]
          status_kawin: Database["public"]["Enums"]["status_kawin"]
          tanggal_lahir: string
          tempat_lahir: string
          updated_at?: string
        }
        Update: {
          agama?: Database["public"]["Enums"]["agama"]
          alamat?: string
          created_at?: string
          dusun?: string
          id?: string
          jenis_kelamin?: Database["public"]["Enums"]["jenis_kelamin"]
          nama?: string
          nik?: string
          no_kk?: string
          pekerjaan?: string | null
          pendidikan?: string | null
          rt?: string
          rw?: string
          status?: Database["public"]["Enums"]["status_penduduk"]
          status_kawin?: Database["public"]["Enums"]["status_kawin"]
          tanggal_lahir?: string
          tempat_lahir?: string
          updated_at?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          full_name: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          full_name: string
          id: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          full_name?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          updated_at?: string
        }
        Relationships: []
      }
      surat: {
        Row: {
          created_at: string
          created_by: string | null
          id: string
          jenis_surat: Database["public"]["Enums"]["jenis_surat"]
          keperluan: string
          nomor_surat: string
          pejabat_ttd: string
          penduduk_id: string
          tanggal_surat: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          id?: string
          jenis_surat: Database["public"]["Enums"]["jenis_surat"]
          keperluan: string
          nomor_surat: string
          pejabat_ttd: string
          penduduk_id: string
          tanggal_surat?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          id?: string
          jenis_surat?: Database["public"]["Enums"]["jenis_surat"]
          keperluan?: string
          nomor_surat?: string
          pejabat_ttd?: string
          penduduk_id?: string
          tanggal_surat?: string
        }
        Relationships: [
          {
            foreignKeyName: "surat_penduduk_id_fkey"
            columns: ["penduduk_id"]
            isOneToOne: false
            referencedRelation: "penduduk"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_next_surat_number: {
        Args: { p_jenis_surat: Database["public"]["Enums"]["jenis_surat"] }
        Returns: string
      }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      search_penduduk_by_nik: {
        Args: { p_nik: string }
        Returns: {
          alamat: string
          dusun: string
          id: string
          jenis_kelamin: Database["public"]["Enums"]["jenis_kelamin"]
          nama: string
          nik: string
          rt: string
          rw: string
          tanggal_lahir: string
          tempat_lahir: string
        }[]
      }
      submit_public_surat: {
        Args: {
          p_jenis_surat: Database["public"]["Enums"]["jenis_surat"]
          p_keperluan: string
          p_pejabat_ttd: string
          p_penduduk_id: string
        }
        Returns: Json
      }
    }
    Enums: {
      agama: "Islam" | "Kristen" | "Katolik" | "Hindu" | "Buddha" | "Konghucu"
      app_role: "admin" | "user"
      jenis_kelamin: "Laki-laki" | "Perempuan"
      jenis_surat:
        | "SKTM"
        | "Domisili"
        | "Usaha"
        | "SKCK"
        | "N1"
        | "N2"
        | "N3"
        | "N4"
        | "N5"
      status_kawin: "Belum Kawin" | "Kawin" | "Cerai Hidup" | "Cerai Mati"
      status_penduduk: "Aktif" | "Pindah" | "Meninggal"
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
    Enums: {
      agama: ["Islam", "Kristen", "Katolik", "Hindu", "Buddha", "Konghucu"],
      app_role: ["admin", "user"],
      jenis_kelamin: ["Laki-laki", "Perempuan"],
      jenis_surat: [
        "SKTM",
        "Domisili",
        "Usaha",
        "SKCK",
        "N1",
        "N2",
        "N3",
        "N4",
        "N5",
      ],
      status_kawin: ["Belum Kawin", "Kawin", "Cerai Hidup", "Cerai Mati"],
      status_penduduk: ["Aktif", "Pindah", "Meninggal"],
    },
  },
} as const
