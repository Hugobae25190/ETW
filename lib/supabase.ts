import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'YOUR_SUPABASE_URL'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          username: string | null
          full_name: string | null
          avatar_url: string | null
          role: 'member' | 'disciplined' | 'captain' | 'mentor' | 'admin'
          strength_points: number
          coins: number
          login_streak: number
          last_login: string | null
          campus: 'home' | 'sport' | 'business' | 'behavior' | 'talking'
          level: 'nobody' | 'learner' | 'soldier' | 'gentlemen' | 'b-force'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'member' | 'disciplined' | 'captain' | 'mentor' | 'admin'
          strength_points?: number
          coins?: number
          login_streak?: number
          last_login?: string | null
          campus?: 'home' | 'sport' | 'business' | 'behavior' | 'talking'
          level?: 'nobody' | 'learner' | 'soldier' | 'gentlemen' | 'b-force'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          role?: 'member' | 'disciplined' | 'captain' | 'mentor' | 'admin'
          strength_points?: number
          coins?: number
          login_streak?: number
          last_login?: string | null
          campus?: 'home' | 'sport' | 'business' | 'behavior' | 'talking'
          level?: 'nobody' | 'learner' | 'soldier' | 'gentlemen' | 'b-force'
          created_at?: string
          updated_at?: string
        }
      }
      tasks: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'personal'
          status: 'pending' | 'completed' | 'failed'
          strength_reward: number
          coins_reward: number
          due_date: string | null
          completed_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          type: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'personal'
          status?: 'pending' | 'completed' | 'failed'
          strength_reward: number
          coins_reward: number
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          type?: 'daily' | 'weekly' | 'monthly' | 'yearly' | 'personal'
          status?: 'pending' | 'completed' | 'failed'
          strength_reward?: number
          coins_reward?: number
          due_date?: string | null
          completed_at?: string | null
          created_at?: string
        }
      }
      teams: {
        Row: {
          id: string
          name: string
          leader_id: string
          member_count: number
          total_strength: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          leader_id: string
          member_count?: number
          total_strength?: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          leader_id?: string
          member_count?: number
          total_strength?: number
          created_at?: string
        }
      }
    }
  }
}
