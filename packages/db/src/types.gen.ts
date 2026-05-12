// AUTO-GENERATED — 실제 운영 시 `supabase gen types typescript --local` 로 재생성
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
      customers: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          phone: string
          email: string | null
          business_name: string | null
          business_type: Database['public']['Enums']['customer_type']
          region: string
          address: string | null
          kakao_id: string | null
          referral_source: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          phone: string
          email?: string | null
          business_name?: string | null
          business_type: Database['public']['Enums']['customer_type']
          region: string
          address?: string | null
          kakao_id?: string | null
          referral_source?: string | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['customers']['Insert']>
        Relationships: []
      }
      quotes: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          customer_id: string
          status: Database['public']['Enums']['quote_status']
          environment: Database['public']['Enums']['environment']
          desired_width_mm: number | null
          desired_height_mm: number | null
          viewing_distance_m: number | null
          purpose: string | null
          budget_krw: number | null
          urgency: Database['public']['Enums']['urgency_level']
          additional_notes: string | null
          recommended_sku: Database['public']['Enums']['sku_code'] | null
          recommended_package: Database['public']['Enums']['package_tier'] | null
          estimate_min_krw: number | null
          estimate_max_krw: number | null
          estimate_disclaimer: string | null
          internal_cost_krw: number | null
          target_margin_pct: number | null
          admin_notes: string | null
          assigned_admin_id: string | null
          site_check_date: string | null
          expired_at: string | null
          contracted_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          customer_id: string
          status?: Database['public']['Enums']['quote_status']
          environment: Database['public']['Enums']['environment']
          desired_width_mm?: number | null
          desired_height_mm?: number | null
          viewing_distance_m?: number | null
          purpose?: string | null
          budget_krw?: number | null
          urgency?: Database['public']['Enums']['urgency_level']
          additional_notes?: string | null
          recommended_sku?: Database['public']['Enums']['sku_code'] | null
          recommended_package?: Database['public']['Enums']['package_tier'] | null
          estimate_min_krw?: number | null
          estimate_max_krw?: number | null
          estimate_disclaimer?: string | null
          internal_cost_krw?: number | null
          target_margin_pct?: number | null
          admin_notes?: string | null
          assigned_admin_id?: string | null
          site_check_date?: string | null
          expired_at?: string | null
          contracted_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['quotes']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'quotes_customer_id_fkey'
            columns: ['customer_id']
            referencedRelation: 'customers'
            referencedColumns: ['id']
          }
        ]
      }
      quote_photos: {
        Row: {
          id: string
          created_at: string
          quote_id: string
          storage_path: string
          file_name: string
          sort_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          quote_id: string
          storage_path: string
          file_name: string
          sort_order?: number
        }
        Update: Partial<Database['public']['Tables']['quote_photos']['Insert']>
        Relationships: [
          {
            foreignKeyName: 'quote_photos_quote_id_fkey'
            columns: ['quote_id']
            referencedRelation: 'quotes'
            referencedColumns: ['id']
          }
        ]
      }
      quote_items: {
        Row: {
          id: string
          quote_id: string
          product_id: string
          package_id: string
          quantity: number
          width_mm: number
          height_mm: number
          unit_price_krw: number
          install_price_krw: number
          monthly_cms_krw: number
          discount_pct: number
          notes: string | null
        }
        Insert: {
          id?: string
          quote_id: string
          product_id: string
          package_id: string
          quantity?: number
          width_mm: number
          height_mm: number
          unit_price_krw: number
          install_price_krw: number
          monthly_cms_krw: number
          discount_pct?: number
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['quote_items']['Insert']>
        Relationships: []
      }
      products: {
        Row: {
          id: string
          sku: Database['public']['Enums']['sku_code']
          display_name: string
          pitch: string
          environment: Database['public']['Enums']['environment']
          width_mm: number | null
          height_mm: number | null
          resolution: string | null
          brightness_nit: number | null
          base_price_krw: number
          install_price_krw: number
          monthly_cms_krw: number
          is_active: boolean
          sort_order: number
          spec_doc_url: string | null
        }
        Insert: {
          id?: string
          sku: Database['public']['Enums']['sku_code']
          display_name: string
          pitch: string
          environment: Database['public']['Enums']['environment']
          width_mm?: number | null
          height_mm?: number | null
          resolution?: string | null
          brightness_nit?: number | null
          base_price_krw: number
          install_price_krw: number
          monthly_cms_krw: number
          is_active?: boolean
          sort_order?: number
          spec_doc_url?: string | null
        }
        Update: Partial<Database['public']['Tables']['products']['Insert']>
        Relationships: []
      }
      packages: {
        Row: {
          id: string
          tier: Database['public']['Enums']['package_tier']
          display_name: string
          description: string | null
          includes_cms: boolean
          includes_warranty: number
          includes_spare_parts: boolean
          includes_monthly_check: boolean
          includes_emergency: boolean
          includes_content_setup: boolean
          price_multiplier: number
          is_active: boolean
        }
        Insert: {
          id?: string
          tier: Database['public']['Enums']['package_tier']
          display_name: string
          description?: string | null
          includes_cms?: boolean
          includes_warranty?: number
          includes_spare_parts?: boolean
          includes_monthly_check?: boolean
          includes_emergency?: boolean
          includes_content_setup?: boolean
          price_multiplier?: number
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['packages']['Insert']>
        Relationships: []
      }
      installers: {
        Row: {
          id: string
          created_at: string
          company_name: string
          contact_name: string
          phone: string
          email: string | null
          regions: string[]
          specialties: string[] | null
          status: Database['public']['Enums']['installer_status']
          rating: number | null
          completed_projects: number
          bank_account: string | null
          business_reg_no: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          company_name: string
          contact_name: string
          phone: string
          email?: string | null
          regions: string[]
          specialties?: string[] | null
          status?: Database['public']['Enums']['installer_status']
          rating?: number | null
          completed_projects?: number
          bank_account?: string | null
          business_reg_no?: string | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['installers']['Insert']>
        Relationships: []
      }
      projects: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          quote_id: string
          customer_id: string
          status: Database['public']['Enums']['project_status']
          installer_id: string | null
          scheduled_date: string | null
          completed_date: string | null
          site_address: string
          electrical_ok: boolean | null
          network_ok: boolean | null
          permit_required: boolean | null
          permit_status: string | null
          materials_ordered_at: string | null
          supplier_name: string | null
          deposit_paid_at: string | null
          deposit_amount_krw: number | null
          final_payment_at: string | null
          final_amount_krw: number | null
          installer_fee_krw: number | null
          completion_photos: string[] | null
          checklist: Json | null
          as_reserve_krw: number | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          quote_id: string
          customer_id: string
          status?: Database['public']['Enums']['project_status']
          installer_id?: string | null
          scheduled_date?: string | null
          completed_date?: string | null
          site_address: string
          electrical_ok?: boolean | null
          network_ok?: boolean | null
          permit_required?: boolean | null
          permit_status?: string | null
          materials_ordered_at?: string | null
          supplier_name?: string | null
          deposit_paid_at?: string | null
          deposit_amount_krw?: number | null
          final_payment_at?: string | null
          final_amount_krw?: number | null
          installer_fee_krw?: number | null
          completion_photos?: string[] | null
          checklist?: Json | null
          as_reserve_krw?: number | null
          notes?: string | null
        }
        Update: Partial<Database['public']['Tables']['projects']['Insert']>
        Relationships: []
      }
      subscriptions: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          project_id: string
          package_tier: Database['public']['Enums']['package_tier']
          status: Database['public']['Enums']['subscription_status']
          monthly_fee_krw: number
          billing_day: number
          started_at: string
          expires_at: string | null
          cancelled_at: string | null
          toss_billing_key: string | null
          last_billed_at: string | null
          next_billing_at: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          project_id: string
          package_tier: Database['public']['Enums']['package_tier']
          status?: Database['public']['Enums']['subscription_status']
          monthly_fee_krw: number
          billing_day?: number
          started_at: string
          expires_at?: string | null
          cancelled_at?: string | null
          toss_billing_key?: string | null
          last_billed_at?: string | null
          next_billing_at?: string | null
        }
        Update: Partial<Database['public']['Tables']['subscriptions']['Insert']>
        Relationships: []
      }
      devices: {
        Row: {
          id: string
          created_at: string
          project_id: string
          subscription_id: string | null
          device_code: string
          product_id: string
          status: Database['public']['Enums']['device_status']
          last_seen_at: string | null
          ip_address: string | null
          location_name: string | null
          timezone: string
          firmware_version: string | null
          health_score: number | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          subscription_id?: string | null
          device_code: string
          product_id: string
          status?: Database['public']['Enums']['device_status']
          last_seen_at?: string | null
          ip_address?: string | null
          location_name?: string | null
          timezone?: string
          firmware_version?: string | null
          health_score?: number | null
        }
        Update: Partial<Database['public']['Tables']['devices']['Insert']>
        Relationships: []
      }
      content_items: {
        Row: {
          id: string
          created_at: string
          customer_id: string
          title: string
          file_type: string
          storage_path: string
          duration_sec: number | null
          file_size_bytes: number | null
          thumbnail_path: string | null
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          customer_id: string
          title: string
          file_type: string
          storage_path: string
          duration_sec?: number | null
          file_size_bytes?: number | null
          thumbnail_path?: string | null
          is_active?: boolean
        }
        Update: Partial<Database['public']['Tables']['content_items']['Insert']>
        Relationships: []
      }
      playlists: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          device_id: string
          name: string
          schedule_start: string | null
          schedule_end: string | null
          repeat_days: number[] | null
          is_active: boolean
          priority: number
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          device_id: string
          name: string
          schedule_start?: string | null
          schedule_end?: string | null
          repeat_days?: number[] | null
          is_active?: boolean
          priority?: number
        }
        Update: Partial<Database['public']['Tables']['playlists']['Insert']>
        Relationships: []
      }
      playlist_items: {
        Row: {
          id: string
          playlist_id: string
          content_id: string
          sort_order: number
          duration_sec: number | null
        }
        Insert: {
          id?: string
          playlist_id: string
          content_id: string
          sort_order?: number
          duration_sec?: number | null
        }
        Update: Partial<Database['public']['Tables']['playlist_items']['Insert']>
        Relationships: []
      }
      maintenance_records: {
        Row: {
          id: string
          created_at: string
          project_id: string
          device_id: string | null
          installer_id: string | null
          record_type: string
          description: string
          resolution: string | null
          cost_krw: number
          covered_by_subscription: boolean
          completed_at: string | null
          photos: string[] | null
        }
        Insert: {
          id?: string
          created_at?: string
          project_id: string
          device_id?: string | null
          installer_id?: string | null
          record_type: string
          description: string
          resolution?: string | null
          cost_krw?: number
          covered_by_subscription?: boolean
          completed_at?: string | null
          photos?: string[] | null
        }
        Update: Partial<Database['public']['Tables']['maintenance_records']['Insert']>
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
      customer_type: 'cafe' | 'restaurant' | 'bar' | 'hospital' | 'academy' | 'gym' | 'franchise' | 'school' | 'government' | 'factory' | 'other'
      environment: 'indoor' | 'outdoor'
      sku_code: 'IN-S' | 'IN-M' | 'OUT-S' | 'OUT-M' | 'OUT-L' | 'P2.5'
      package_tier: 'basic' | 'standard' | 'premium' | 'rental'
      quote_status: 'pending' | 'reviewing' | 'estimated' | 'site_check' | 'confirmed' | 'contracted' | 'rejected' | 'expired'
      project_status: 'deposit_pending' | 'materials_order' | 'scheduled' | 'in_progress' | 'completed' | 'as_warranty'
      subscription_status: 'active' | 'paused' | 'cancelled' | 'expired'
      device_status: 'online' | 'offline' | 'error' | 'maintenance'
      installer_status: 'active' | 'inactive' | 'suspended'
      urgency_level: 'low' | 'normal' | 'high' | 'urgent'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
