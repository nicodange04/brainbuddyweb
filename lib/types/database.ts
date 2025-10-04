export interface Database {
  public: {
    Tables: {
      usuarios: {
        Row: {
          usuario_id: string
          nombre: string
          apellido: string
          correo: string
          password_hash: string
          rol: 'admin' | 'alumno' | 'padre'
          deleted_at?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          usuario_id?: string
          nombre: string
          apellido: string
          correo: string
          password_hash: string
          rol: 'admin' | 'alumno' | 'padre'
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          usuario_id?: string
          nombre?: string
          apellido?: string
          correo?: string
          password_hash?: string
          rol?: 'admin' | 'alumno' | 'padre'
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      admin: {
        Row: {
          admin_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          admin_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          admin_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      alumno: {
        Row: {
          alumno_id: string
          ranking_id?: number | null
          deleted_at?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          alumno_id: string
          ranking_id?: number | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          alumno_id?: string
          ranking_id?: number | null
          deleted_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      padre: {
        Row: {
          padre_id: string
          created_at: string
          updated_at: string
        }
        Insert: {
          padre_id: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          padre_id?: string
          created_at?: string
          updated_at?: string
        }
      }
      suscripcion: {
        Row: {
          suscripcion_id: string
          usuario_id: string
          plan: string
          estado: string
          fecha_inicio: string
          fecha_fin?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          suscripcion_id?: string
          usuario_id: string
          plan: string
          estado: string
          fecha_inicio: string
  
          fecha_fin?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          suscripcion_id?: string
          usuario_id?: string
          plan?: string
          estado?: string
          fecha_inicio?: string
          fecha_fin?: string | null
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      rol: 'admin' | 'alumno' | 'padre'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
