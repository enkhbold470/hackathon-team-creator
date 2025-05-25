export interface MatchedUser {
  user_id: string;
  full_name: string;
  discord: string;
  skill_level: string;
  hackathon_experience: string;
  project_experience: string;
  fun_fact: string;
  self_description: string;
  future_plans: string;
  links: string;
}

export interface Match {
  id: string;
  user_id_1: string;
  user_id_2: string;
  status: string;
  created_at: Date;
  is_mutual_match: boolean;
  is_user_interested: boolean;
  is_other_interested: boolean;
  other_user: MatchedUser;
}

export interface User {
  user_id: string;
  email: string;
  full_name: string;
  discord: string;
  linkedin: string;
  instagram: string;
  github: string;
  skill_level: string;
  hackathon_experience: string;
  project_experience: string;
  what_to_build: string;
  fun_fact: string;
  self_description: string;
  created_at: Date;
  updated_at: Date;
}
