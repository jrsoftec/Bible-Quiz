/*
# Bible Quiz Schema

1. New Tables
- `categories` - Quiz categories (e.g., Old Testament, New Testament, Gospels)
  - `id` (uuid, primary key)
  - `name` (text, not null)
  - `description` (text)
  - `icon` (text) - icon name for display
  - `color` (text) - hex color for display
  - `created_at` (timestamptz)

- `questions` - Quiz questions
  - `id` (uuid, primary key)
  - `category_id` (uuid, references categories)
  - `question` (text, not null)
  - `options` (text array, not null)
  - `correct_answer` (integer, not null) - index of correct option (0-based)
  - `difficulty` (text, default 'medium') - easy, medium, hard
  - `reference` (text) - Bible verse reference
  - `created_at` (timestamptz)

- `leaderboard` - High scores (no auth required)
  - `id` (uuid, primary key)
  - `player_name` (text, not null)
  - `score` (integer, not null)
  - `category_id` (uuid, references categories, nullable)
  - `total_questions` (integer, not null)
  - `correct_answers` (integer, not null)
  - `created_at` (timestamptz)

2. Security
- Enable RLS on all tables.
- Allow anon and authenticated users full CRUD access since the quiz is intentionally public and shared.
*/

CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  icon text DEFAULT 'book-open',
  color text DEFAULT '#3B82F6',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  options text[] NOT NULL,
  correct_answer integer NOT NULL,
  difficulty text NOT NULL DEFAULT 'medium',
  reference text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS leaderboard (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  player_name text NOT NULL,
  score integer NOT NULL,
  category_id uuid REFERENCES categories(id) ON DELETE SET NULL,
  total_questions integer NOT NULL,
  correct_answers integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_categories" ON categories;
CREATE POLICY "anon_select_categories" ON categories FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_select_questions" ON questions;
CREATE POLICY "anon_select_questions" ON questions FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_leaderboard_all" ON leaderboard;
CREATE POLICY "anon_leaderboard_all" ON leaderboard FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_leaderboard_insert" ON leaderboard;
CREATE POLICY "anon_leaderboard_insert" ON leaderboard FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_leaderboard_update" ON leaderboard;
CREATE POLICY "anon_leaderboard_update" ON leaderboard FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_leaderboard_delete" ON leaderboard;
CREATE POLICY "anon_leaderboard_delete" ON leaderboard FOR DELETE
  TO anon, authenticated USING (true);
