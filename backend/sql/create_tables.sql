-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    settings JSONB DEFAULT '{"language": "ru", "timezone": "Europe/Moscow", "theme": "system"}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create analysis_history table
CREATE TABLE IF NOT EXISTS analysis_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    file_type TEXT NOT NULL,
    file_name TEXT NOT NULL,
    file_url TEXT,
    analysis_results JSONB NOT NULL,
    dominant_emotion TEXT NOT NULL,
    overall_score INTEGER NOT NULL,
    message_count INTEGER NOT NULL,
    participants INTEGER NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create presets table
CREATE TABLE IF NOT EXISTS presets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    icon TEXT NOT NULL,
    color TEXT NOT NULL,
    settings JSONB NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create RLS policies
-- Users can only access their own data
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_policy ON users
    USING (auth.uid() = id);

ALTER TABLE analysis_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY analysis_history_policy ON analysis_history
    USING (auth.uid() = user_id);

ALTER TABLE presets ENABLE ROW LEVEL SECURITY;
CREATE POLICY presets_policy ON presets
    USING (auth.uid() = user_id);
