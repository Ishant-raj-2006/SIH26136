// import axios, { AxiosInstance, AxiosError } from 'axios';
// import { AuthResponse } from '@/types';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// class APIClient {
//   private client: AxiosInstance;
//   private token: string | null = null;

//   constructor() {
//     this.client = axios.create({
//       baseURL: API_URL,
//       timeout: 30000,
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });

//     this.loadToken();
//     this.setupInterceptors();
//   }

//   private loadToken() {
//     if (typeof window !== 'undefined') {
//       this.token = localStorage.getItem('access_token');
//     }
//   }

//   private setupInterceptors() {
//     this.client.interceptors.request.use((config) => {
//       if (this.token) {
//         config.headers.Authorization = `Bearer ${this.token}`;
//       }
//       return config;
//     });

//     this.client.interceptors.response.use(
//       (response) => response,
//       (error: AxiosError) => {
//         if (error.response?.status === 401) {
//           this.logout();
//         }
//         return Promise.reject(error);
//       }
//     );
//   }

//   setToken(token: string) {
//     this.token = token;
//     if (typeof window !== 'undefined') {
//       localStorage.setItem('access_token', token);
//     }
//   }

//   getToken() {
//     return this.token;
//   }

//   logout() {
//     this.token = null;
//     if (typeof window !== 'undefined') {
//       localStorage.removeItem('access_token');
//       window.location.href = '/auth/login';
//     }
//   }

//   // Auth endpoints
//   async register(data: {
//     email: string;
//     username: string;
//     password: string;
//     full_name: string;
//     role: string;
//     organization?: string;
//   }) {
//     const response = await this.client.post('/api/auth/register', data);
//     return response.data;
//   }

//   async login(email: string, password: string): Promise<AuthResponse> {
//     const response = await this.client.post('/api/auth/login', { email, password });
//     return response.data;
//   }

//   async getCurrentUser() {
//     const response = await this.client.get('/api/auth/me');
//     return response.data;
//   }

//   // Startup endpoints
//   async createStartup(data: any) {
//     const response = await this.client.post('/api/startups', data);
//     return response.data;
//   }

//   async getStartup(id: number) {
//     const response = await this.client.get(`/api/startups/${id}`);
//     return response.data;
//   }

//   async listStartups(skip: number = 0, limit: number = 10, search?: string) {
//     // const params = { skip, limit };
//     const params: Record<string, any> = { skip, limit };
//     if (search) {
//       params['search'] = search;
//     }
//     const response = await this.client.get('/api/startups', { params });
//     return response.data;
//   }

//   async updateStartup(id: number, data: any) {
//     const response = await this.client.put(`/api/startups/${id}`, data);
//     return response.data;
//   }

//   // Challenge endpoints
//   async createChallenge(data: any) {
//     const response = await this.client.post('/api/challenges', data);
//     return response.data;
//   }

//   async getChallenge(id: number) {
//     const response = await this.client.get(`/api/challenges/${id}`);
//     return response.data;
//   }

//   // async listChallenges(skip: number = 0, limit: number = 10, status?: string, category?: string) {
//   //   const params = { skip, limit };
//   //   if (status) params['status'] = status;
//   //   if (category) params['category'] = category;
//   //   const response = await this.client.get('/api/challenges', { params });
//   //   return response.data;
//   // }

//   // async updateChallenge(id: number, data: any) {
//   //   const response = await this.client.put(`/api/challenges/${id}`, data);
//   //   return response.data;
//   // }
//   async listStartups(
//   skip: number = 0,
//   limit: number = 10,
//   search: string
// ) {
//   const params: Record<string, any> = { skip, limit };

//   if (search) {
//     params['search'] = search;
//   }

//   const response = await this.client.get('/api/startups', {
//     params
//   });
//   return response.data;
// }

//   // Proposal endpoints
//   async createProposal(data: any) {
//     const response = await this.client.post('/api/proposals', data);
//     return response.data;
//   }

//   async getProposal(id: number) {
//     const response = await this.client.get(`/api/proposals/${id}`);
//     return response.data;
//   }

//   async getChallengeProposals(challengeId: number, skip: number = 0, limit: number = 10) {
//     const response = await this.client.get(`/api/challenges/${challengeId}/proposals`, {
//       params: { skip, limit },
//     });
//     return response.data;
//   }

//   // Evaluation endpoints
//   async createEvaluation(data: any) {
//     const response = await this.client.post('/api/evaluations', data);
//     return response.data;
//   }

//   async getProposalEvaluations(proposalId: number) {
//     const response = await this.client.get(`/api/proposals/${proposalId}/evaluations`);
//     return response.data;
//   }

//   // Pilot endpoints
//   async createPilot(data: any) {
//     const response = await this.client.post('/api/pilots', data);
//     return response.data;
//   }

//   async getPilot(id: number) {
//     const response = await this.client.get(`/api/pilots/${id}`);
//     return response.data;
//   }

//   async listPilots(skip: number = 0, limit: number = 10) {
//     const response = await this.client.get('/api/pilots', {
//       params: { skip, limit },
//     });
//     return response.data;
//   }

//   // Milestone endpoints
//   async createMilestone(data: any) {
//     const response = await this.client.post('/api/milestones', data);
//     return response.data;
//   }

//   async getPilotMilestones(pilotId: number) {
//     const response = await this.client.get(`/api/pilots/${pilotId}/milestones`);
//     return response.data;
//   }

//   // Notification endpoints
//   async getNotifications(skip: number = 0, limit: number = 10) {
//     const response = await this.client.get('/api/notifications', {
//       params: { skip, limit },
//     });
//     return response.data;
//   }

//   async markNotificationRead(id: number) {
//     const response = await this.client.put(`/api/notifications/${id}`);
//     return response.data;
//   }

//   // Analytics endpoints
//   async getDashboardStats() {
//     const response = await this.client.get('/api/stats/dashboard');
//     return response.data;
//   }

//   // Health check
//   async healthCheck() {
//     const response = await this.client.get('/api/health');
//     return response.data;
//   }
// }

// export const apiClient = new APIClient();









import axios, { AxiosInstance, AxiosError } from 'axios';
import { AuthResponse } from '@/types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

class APIClient {
  private client: AxiosInstance;
  private token: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.loadToken();
    this.setupInterceptors();
  }

  private loadToken() {
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('access_token');
    }
  }

  private setupInterceptors() {
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }

      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          this.logout();
        }

        return Promise.reject(error);
      }
    );
  }

  setToken(token: string) {
    this.token = token;

    if (typeof window !== 'undefined') {
      localStorage.setItem('access_token', token);
    }
  }

  getToken() {
    return this.token;
  }

  logout() {
    this.token = null;

    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      window.location.href = '/auth/login';
    }
  }

  // =========================
  // Auth endpoints
  // =========================

  async register(data: {
    email: string;
    username: string;
    password: string;
    full_name: string;
    role: string;
    organization?: string;
  }) {
    const response = await this.client.post(
      '/api/auth/register',
      data
    );

    return response.data;
  }

  async login(
    email: string,
    password: string
  ): Promise<AuthResponse> {
    const response = await this.client.post(
      '/api/auth/login',
      {
        email,
        password,
      }
    );

    return response.data;
  }

  async getCurrentUser() {
    const response = await this.client.get('/api/auth/me');

    return response.data;
  }

  // =========================
  // Startup endpoints
  // =========================

  async createStartup(data: any) {
    const response = await this.client.post(
      '/api/startups',
      data
    );

    return response.data;
  }

  async getStartup(id: number) {
    const response = await this.client.get(
      `/api/startups/${id}`
    );

    return response.data;
  }

  async listStartups(
    skip: number = 0,
    limit: number = 10,
    search?: string
  ) {
    const params: Record<string, any> = {
      skip,
      limit,
    };

    if (search) {
      params['search'] = search;
    }

    const response = await this.client.get(
      '/api/startups',
      { params }
    );

    return response.data;
  }

  async updateStartup(id: number, data: any) {
    const response = await this.client.put(
      `/api/startups/${id}`,
      data
    );

    return response.data;
  }

  // =========================
  // Challenge endpoints
  // =========================

  async createChallenge(data: any) {
    const response = await this.client.post(
      '/api/challenges',
      data
    );

    return response.data;
  }

  async getChallenge(id: number) {
    const response = await this.client.get(
      `/api/challenges/${id}`
    );

    return response.data;
  }

  async listChallenges(
    skip: number = 0,
    limit: number = 10,
    status?: string,
    category?: string
  ) {
    const params: Record<string, any> = {
      skip,
      limit,
    };

    if (status) {
      params['status'] = status;
    }

    if (category) {
      params['category'] = category;
    }

    const response = await this.client.get(
      '/api/challenges',
      { params }
    );

    return response.data;
  }

  async updateChallenge(id: number, data: any) {
    const response = await this.client.put(
      `/api/challenges/${id}`,
      data
    );

    return response.data;
  }

  // =========================
  // Proposal endpoints
  // =========================

  async createProposal(data: any) {
    const response = await this.client.post(
      '/api/proposals',
      data
    );

    return response.data;
  }

  async getProposal(id: number) {
    const response = await this.client.get(
      `/api/proposals/${id}`
    );

    return response.data;
  }

  async getChallengeProposals(
    challengeId: number,
    skip: number = 0,
    limit: number = 10
  ) {
    const response = await this.client.get(
      `/api/challenges/${challengeId}/proposals`,
      {
        params: {
          skip,
          limit,
        },
      }
    );

    return response.data;
  }

  // =========================
  // Evaluation endpoints
  // =========================

  async createEvaluation(data: any) {
    const response = await this.client.post(
      '/api/evaluations',
      data
    );

    return response.data;
  }

  async getProposalEvaluations(proposalId: number) {
    const response = await this.client.get(
      `/api/proposals/${proposalId}/evaluations`
    );

    return response.data;
  }

  // =========================
  // Pilot endpoints
  // =========================

  async createPilot(data: any) {
    const response = await this.client.post(
      '/api/pilots',
      data
    );

    return response.data;
  }

  async getPilot(id: number) {
    const response = await this.client.get(
      `/api/pilots/${id}`
    );

    return response.data;
  }

  async listPilots(
    skip: number = 0,
    limit: number = 10
  ) {
    const response = await this.client.get(
      '/api/pilots',
      {
        params: {
          skip,
          limit,
        },
      }
    );

    return response.data;
  }

  // =========================
  // Milestone endpoints
  // =========================

  async createMilestone(data: any) {
    const response = await this.client.post(
      '/api/milestones',
      data
    );

    return response.data;
  }

  async getPilotMilestones(pilotId: number) {
    const response = await this.client.get(
      `/api/pilots/${pilotId}/milestones`
    );

    return response.data;
  }

  // =========================
  // Notification endpoints
  // =========================

  async getNotifications(
    skip: number = 0,
    limit: number = 10
  ) {
    const response = await this.client.get(
      '/api/notifications',
      {
        params: {
          skip,
          limit,
        },
      }
    );

    return response.data;
  }

  async markNotificationRead(id: number) {
    const response = await this.client.put(
      `/api/notifications/${id}`
    );

    return response.data;
  }

  // =========================
  // Analytics endpoints
  // =========================

  async getDashboardStats() {
    const response = await this.client.get(
      '/api/stats/dashboard'
    );

    return response.data;
  }

  // =========================
  // Health check
  // =========================

  async healthCheck() {
    const response = await this.client.get(
      '/api/health'
    );

    return response.data;
  }
}

export const apiClient = new APIClient();