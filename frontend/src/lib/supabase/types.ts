export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "farmer" | "consumer" | "admin";
export type QualityGrade = "Grade A+" | "Grade A" | "Grade B" | "Standard";
export type CropCategory = "vegetables" | "fruits" | "grains" | "pulses" | "spices" | "oilseeds";
export type SeasonType = "kharif" | "rabi" | "zaid" | "all_year";
export type StandardUnit = "kg" | "quintal" | "bag" | "crate" | "dozen";
export type ListingStatus = "active" | "sold_out" | "expired" | "under_review" | "delisted";
export type InquiryStatus = "pending" | "contacted" | "completed" | "cancelled";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string;
          phone: string | null;
          email: string | null;
          role: UserRole;
          avatar_url: string | null;
          preferred_locale: "en" | "kn" | "hi";
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name: string;
          phone?: string | null;
          email?: string | null;
          role?: UserRole;
          avatar_url?: string | null;
          preferred_locale?: "en" | "kn" | "hi";
          is_verified?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Insert"]>;
      };
      farmers: {
        Row: {
          id: string;
          farm_name: string;
          village: string;
          taluk: string;
          district: string;
          state: string;
          farm_size_acres: number;
          organic_certified: boolean;
          ksoca_cert_number: string | null;
          experience_years: number | null;
          bio: string | null;
          latitude: number | null;
          longitude: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          farm_name: string;
          village: string;
          taluk: string;
          district: string;
          state?: string;
          farm_size_acres: number;
          organic_certified?: boolean;
          ksoca_cert_number?: string | null;
          experience_years?: number | null;
          bio?: string | null;
          latitude?: number | null;
          longitude?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["farmers"]["Insert"]>;
      };
      markets: {
        Row: {
          id: string;
          name: string;
          name_kn: string | null;
          name_hi: string | null;
          market_type: "apmc" | "rythu_bazaar" | "private_yard" | "fpo_hub";
          district: string;
          state: string;
          latitude: number;
          longitude: number;
          operating_hours: string;
          contact_phone: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["markets"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["markets"]["Insert"]>;
      };
      crops: {
        Row: {
          id: string;
          name_en: string;
          name_kn: string;
          name_hi: string;
          category: CropCategory;
          season: SeasonType;
          standard_unit: StandardUnit;
          msp_benchmark_price: number | null;
          shelf_life_days: number;
          icon_name: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["crops"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["crops"]["Insert"]>;
      };
      listings: {
        Row: {
          id: string;
          farmer_id: string;
          crop_id: string;
          market_id: string | null;
          title: string;
          description: string | null;
          price_per_unit: number;
          unit: StandardUnit;
          total_quantity: number;
          available_quantity: number;
          minimum_order_quantity: number;
          harvest_date: string;
          quality_grade: QualityGrade;
          is_organic: boolean;
          status: ListingStatus;
          views_count: number;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["listings"]["Row"], "created_at" | "updated_at">;
        Update: Partial<Database["public"]["Tables"]["listings"]["Insert"]>;
      };
      price_history: {
        Row: {
          id: string;
          crop_id: string;
          market_id: string;
          recorded_date: string;
          modal_price: number;
          min_price: number;
          max_price: number;
          arrivals_quintals: number;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["price_history"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["price_history"]["Insert"]>;
      };
      reviews: {
        Row: {
          id: string;
          farmer_id: string;
          consumer_id: string;
          listing_id: string | null;
          rating: number;
          comment: string | null;
          is_verified_buyer: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["reviews"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["reviews"]["Insert"]>;
      };
      favorites: {
        Row: {
          id: string;
          user_id: string;
          listing_id: string;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["favorites"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["favorites"]["Insert"]>;
      };
      alerts: {
        Row: {
          id: string;
          user_id: string;
          crop_id: string;
          market_id: string | null;
          target_price: number | null;
          alert_type: "price_drop" | "new_arrival" | "mandi_rate";
          is_active: boolean;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["alerts"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["alerts"]["Insert"]>;
      };
      inquiries: {
        Row: {
          id: string;
          listing_id: string;
          farmer_id: string;
          consumer_id: string;
          consumer_name: string;
          consumer_phone: string;
          quantity_requested: number | null;
          message: string | null;
          status: InquiryStatus;
          created_at: string;
        };
        Insert: Omit<Database["public"]["Tables"]["inquiries"]["Row"], "created_at">;
        Update: Partial<Database["public"]["Tables"]["inquiries"]["Insert"]>;
      };
    };
  };
}
