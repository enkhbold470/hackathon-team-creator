-- Updated applications table for DAHacks portal
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    user_id TEXT NOT NULL UNIQUE, -- Clerk Auth user ID

    -- From personalInfo
    cwid TEXT NOT NULL,
    full_name TEXT NOT NULL,
    discord TEXT NOT NULL,
    skill_level TEΩXT NOT NULL,
    hackathon_experience TEXT NOT NULL,
    hear_about_us TEXT NOT NULL,

    why_attend TEXT NOT NULL,
    project_experience TEXT NOT NULL,
    future_plans TEXT NOT NULL,
    fun_fact TEXT NOT NULL,
    self_description TEXT NOT NULL,
    links TEXT,
    teammates TEXT,
    referral_email TEXT,
    
    -- From aboutYou

    -- From additionalInfo
    dietary_restrictions_extra TEXT,
    tshirt_size TEXT,
 
    agree_to_terms BOOLEAN NOT NULL DEFAULT false,



    -- Meta
    status VARCHAR(50) NOT NULL DEFAULT 'not_started', -- not_started, in_progress, submitted, etc.
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
