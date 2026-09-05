export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  role: 'department' | 'startup' | 'evaluator' | 'admin';
  organization?: string;
  is_verified: boolean;
  created_at: string;
}

export interface Startup {
  id: number;
  name: string;
  description: string;
  logo_url?: string;
  website?: string;
  industry: string;
  founded_year: number;
  team_size: number;
  funding_stage: string;
  technologies: string[];
  verification_score: number;
  is_verified: boolean;
  created_at: string;
}

export interface Challenge {
  id: number;
  title: string;
  description: string;
  problem_statement: string;
  budget: number;
  status: 'open' | 'evaluating' | 'pilot_running' | 'completed' | 'cancelled';
  category: string;
  tags: string[];
  deadline: string;
  expected_outcome: string;
  creator_id: number;
  created_at: string;
}

export interface Proposal {
  id: number;
  startup_id: number;
  challenge_id: number;
  title: string;
  description: string;
  technical_approach: string;
  timeline: string;
  cost: number;
  evaluation_score: number;
  status: string;
  submitted_at: string;
}

export interface Evaluation {
  id: number;
  proposal_id: number;
  evaluator_id: number;
  technical_score: number;
  feasibility_score: number;
  innovation_score: number;
  cost_score: number;
  overall_score: number;
  feedback: string;
  recommendation: string;
  created_at: string;
}

export interface Pilot {
  id: number;
  challenge_id: number;
  startup_id: number;
  status: 'negotiation' | 'active' | 'monitoring' | 'completed' | 'failed';
  start_date?: string;
  end_date?: string;
  budget_approved: number;
  compliance_status: string;
  created_at: string;
}

export interface Milestone {
  id: number;
  pilot_id: number;
  title: string;
  description: string;
  due_date: string;
  payment_amount: number;
  status: string;
  completed_at?: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  is_read: boolean;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  skip: number;
  limit: number;
  pages: number;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface DashboardStats {
  challenges?: number;
  proposals?: number;
  pilots?: number;
  verification_score?: number;
  is_verified?: boolean;
  total_budget?: number;
}
