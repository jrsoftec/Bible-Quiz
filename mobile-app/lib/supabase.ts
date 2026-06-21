import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
  },
});

export type Category = {
  id: string;
  name: string;
  description: string | null;
  icon: string | null;
  color: string | null;
  created_at: string;
};

export type Question = {
  id: string;
  category_id: string;
  question: string;
  options: string[];
  correct_answer: number;
  difficulty: string;
  reference: string | null;
  created_at: string;
};

export type LeaderboardEntry = {
  id: string;
  player_name: string;
  score: number;
  category_id: string | null;
  total_questions: number;
  correct_answers: number;
  created_at: string;
  categories?: { name: string } | null;
};
