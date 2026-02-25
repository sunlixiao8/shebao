export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      cities: {
        Row: {
          id: number
          city_name: string
          year: string
          base_min: number
          base_max: number
          rate: number
        }
        Insert: {
          id?: number
          city_name: string
          year: string
          base_min: number
          base_max: number
          rate: number
        }
        Update: {
          id?: number
          city_name?: string
          year?: string
          base_min?: number
          base_max?: number
          rate?: number
        }
        Relationships: []
      }
      salaries: {
        Row: {
          id: number
          employee_id: string
          employee_name: string
          month: string
          salary_amount: number
          city_name: string
          year: string | null
        }
        Insert: {
          id?: number
          employee_id: string
          employee_name: string
          month: string
          salary_amount: number
          city_name: string
          year?: string | null
        }
        Update: {
          id?: number
          employee_id?: string
          employee_name?: string
          month?: string
          salary_amount?: number
          city_name?: string
          year?: string | null
        }
        Relationships: []
      }
      results: {
        Row: {
          id: number
          employee_id: string
          employee_name: string
          city_name: string
          year: string
          avg_salary: number
          contribution_base: number
          company_fee: number
          created_at: string
        }
        Insert: {
          id?: number
          employee_id: string
          employee_name: string
          city_name: string
          year: string
          avg_salary: number
          contribution_base: number
          company_fee: number
          created_at?: string
        }
        Update: {
          id?: number
          employee_id?: string
          employee_name?: string
          city_name?: string
          year?: string
          avg_salary?: number
          contribution_base?: number
          company_fee?: number
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in string]: never
    }
    Functions: {
      [_ in string]: never
    }
    Enums: {
      [_ in string]: never
    }
    CompositeTypes: {
      [_ in string]: never
    }
  }
}
