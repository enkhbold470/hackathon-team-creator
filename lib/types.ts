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
    id: number;
    user_id_1: string;
    user_id_2: string;
    status: string;
    created_at: Date;
    is_mutual_match: boolean;
    is_user_interested: boolean;
    is_other_interested: boolean;
    other_user: MatchedUser | null;
  }