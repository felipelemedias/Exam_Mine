/*
  # Authentication Schema Setup

  1. New Tables
    - `users`
      - `id` (uuid, primary key): Unique identifier for each user
      - `email` (text, unique): User's email address
      - `hashed_password` (text): Securely hashed password
      - `is_active` (boolean): Account status flag
      - `created_at` (timestamptz): Account creation timestamp
      - `updated_at` (timestamptz): Last update timestamp
    
    - `interactions`
      - `id` (uuid, primary key): Unique identifier for each interaction
      - `user_email` (text, foreign key): Reference to users table
      - `agent_type` (text): Type of AI agent used
      - `question` (text): User's question/input
      - `answer` (text): AI response
      - `timestamp` (timestamptz): When the interaction occurred

  2. Security
    - Enable RLS on both tables
    - Add policies for authenticated users to:
      - Read their own data
      - Create new interactions
      - Update their own profile

  3. Indexes
    - Email index for fast user lookups
    - Timestamp index for interaction queries
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    email text UNIQUE NOT NULL,
    hashed_password text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Create interactions table
CREATE TABLE IF NOT EXISTS interactions (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_email text REFERENCES users(email) ON DELETE CASCADE,
    agent_type text NOT NULL,
    question text NOT NULL,
    answer text NOT NULL,
    timestamp timestamptz DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS users_email_idx ON users(email);
CREATE INDEX IF NOT EXISTS interactions_timestamp_idx ON interactions(timestamp DESC);
CREATE INDEX IF NOT EXISTS interactions_user_email_idx ON interactions(user_email);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE interactions ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read own data"
    ON users
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own data"
    ON users
    FOR UPDATE
    TO authenticated
    USING (auth.uid()::text = id::text);

-- Create policies for interactions table
CREATE POLICY "Users can read own interactions"
    ON interactions
    FOR SELECT
    TO authenticated
    USING (auth.uid()::text = (SELECT id::text FROM users WHERE email = user_email));

CREATE POLICY "Users can create interactions"
    ON interactions
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid()::text = (SELECT id::text FROM users WHERE email = user_email));

-- Create updated_at trigger for users table
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();