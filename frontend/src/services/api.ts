/**
 * Eshal Typed API Client
 * Manages communication with the backend with credentials and error handling.
 */

export interface ApiUser {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'support' | 'admin';
  status: 'active' | 'suspended' | 'pending_verification';
  emailVerified: boolean;
  avatar: string;
  preferences: {
    soundEnabled: boolean;
    reducedMotion: boolean;
    highContrast: boolean;
    theme: string;
    dailyGoalMinutes: number;
  };
}

export interface ApiGoal {
  id: string;
  title: string;
  category: string;
  targetCount: number;
  completedCount: number;
  completed: boolean;
}

export interface ApiContentItem {
  id: string;
  type: 'activity' | 'story' | 'resource' | 'life_skill' | 'sensory';
  title: string;
  description: string;
  category: string;
  categoryName: string;
  ageRange: string;
  difficulty: string;
  duration: string;
  status: 'published' | 'draft' | 'archived';
  orderIndex: number;
  details?: any;
}

export interface ApiAuditLog {
  id: string;
  actorId: string | null;
  actorEmail: string | null;
  eventType: string;
  targetType: string | null;
  targetId: string | null;
  details: any;
  ipAddress?: string;
  createdAt: string;
}

export interface ApiOverviewStats {
  totalUsers: number;
  activeUsers: number;
  suspendedUsers: number;
  publishedContent: number;
  draftContent: number;
  auditEventsCount: number;
  recentAuthEvents: {
    email: string | null;
    eventType: string;
    timestamp?: string;
    createdAt?: string;
    ipAddress?: string;
  }[];
}

export interface ApiAnalyticsData {
  summary: {
    totalUsers: number;
    newUsersThisMonth: number;
    totalStoriesAndGames: number;
    totalActivitySessions: number;
    mostUsedContent?: {
      id: string;
      title: string;
      type: string;
      categoryName: string;
      interactions: number;
    };
  };
  userGrowth: {
    date: string;
    label: string;
    newUsers: number;
    cumulativeUsers: number;
  }[];
  roleDistribution: {
    role: string;
    label: string;
    count: number;
    percentage: number;
    color: string;
  }[];
  contentPerformance: {
    type: string;
    label: string;
    count: number;
    sessions: number;
    completions: number;
    color: string;
  }[];
  platformActivity: {
    date: string;
    label: string;
    storyViews: number;
    gameSessions: number;
    completedActivities: number;
    total: number;
  }[];
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
    credentials: 'include', // Includes httpOnly session cookie
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const errorMsg = data?.error || `Request failed with status ${response.status}`;
    throw new Error(errorMsg);
  }

  return data as T;
}

export const api = {
  auth: {
    register: (payload: { email: string; password: string; name: string; avatar?: string }) =>
      request<{ message: string; user: ApiUser; devVerificationToken?: string }>('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    login: (payload: { email: string; password: string }) =>
      request<{ message: string; user: ApiUser }>('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),

    logout: () =>
      request<{ message: string }>('/api/auth/logout', {
        method: 'POST',
      }),

    me: () =>
      request<{ user: ApiUser }>('/api/auth/me'),

    verifyEmail: (token: string) =>
      request<{ message: string }>('/api/auth/verify-email', {
        method: 'POST',
        body: JSON.stringify({ token }),
      }),

    forgotPassword: (email: string) =>
      request<{ message: string; devResetToken?: string }>('/api/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      }),

    resetPassword: (payload: { token: string; newPassword: string }) =>
      request<{ message: string }>('/api/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
  },

  users: {
    updateProfile: (updates: {
      name?: string;
      avatar?: string;
      soundEnabled?: boolean;
      reducedMotion?: boolean;
      highContrast?: boolean;
      theme?: string;
      dailyGoalMinutes?: number;
    }) =>
      request<{ message: string; user: ApiUser }>('/api/users/profile', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
  },

  content: {
    getActivities: (category?: string, type?: string) => {
      const params = new URLSearchParams();
      if (category) params.append('category', category);
      if (type) params.append('type', type);
      const query = params.toString() ? `?${params.toString()}` : '';
      return request<ApiContentItem[]>(`/api/content/activities${query}`);
    },

    getItem: (id: string) =>
      request<ApiContentItem>(`/api/content/item/${id}`),
  },

  progress: {
    getGoals: () =>
      request<ApiGoal[]>('/api/progress/goals'),

    toggleGoal: (id: string, completed?: boolean) =>
      request<ApiGoal>(`/api/progress/goals/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ completed }),
      }),

    completeActivity: (activityId: string, steps?: number, percent?: number) =>
      request<{ success: boolean; progress: any }>(`/api/progress/complete/${activityId}`, {
        method: 'POST',
        body: JSON.stringify({ steps, percent }),
      }),
  },

  admin: {
    getOverview: () =>
      request<ApiOverviewStats>('/api/admin/overview'),

    getUsers: (params?: { search?: string; role?: string; status?: string; page?: number; limit?: number }) => {
      const sp = new URLSearchParams();
      if (params?.search) sp.append('search', params.search);
      if (params?.role) sp.append('role', params.role);
      if (params?.status) sp.append('status', params.status);
      if (params?.page) sp.append('page', params.page.toString());
      if (params?.limit) sp.append('limit', params.limit.toString());
      const query = sp.toString() ? `?${sp.toString()}` : '';
      return request<{ users: any[]; total: number; page: number; limit: number }>(`/api/admin/users${query}`);
    },

    updateUserStatus: (id: string, status: 'active' | 'suspended', reason?: string) =>
      request<{ message: string; status: string }>(`/api/admin/users/${id}/status`, {
        method: 'PUT',
        body: JSON.stringify({ status, reason }),
      }),

    updateUserRole: (id: string, role: 'user' | 'support' | 'admin') =>
      request<{ message: string; role: string }>(`/api/admin/users/${id}/role`, {
        method: 'PUT',
        body: JSON.stringify({ role }),
      }),

    revokeSessions: (id: string) =>
      request<{ message: string }>(`/api/admin/users/${id}/revoke-sessions`, {
        method: 'POST',
      }),

    triggerReset: (id: string) =>
      request<{ message: string; devResetToken: string }>(`/api/admin/users/${id}/trigger-reset`, {
        method: 'POST',
      }),

    deleteUser: (id: string) =>
      request<{ message: string }>(`/api/admin/users/${id}`, {
        method: 'DELETE',
      }),

    getContent: (type?: string, status?: string) => {
      const sp = new URLSearchParams();
      if (type) sp.append('type', type);
      if (status) sp.append('status', status);
      const query = sp.toString() ? `?${sp.toString()}` : '';
      return request<ApiContentItem[]>(`/api/admin/content${query}`);
    },

    createContent: (item: any) =>
      request<ApiContentItem>('/api/admin/content', {
        method: 'POST',
        body: JSON.stringify(item),
      }),

    updateContent: (id: string, updates: any) =>
      request<ApiContentItem>(`/api/admin/content/${id}`, {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),

    deleteContent: (id: string) =>
      request<{ message: string }>(`/api/admin/content/${id}`, {
        method: 'DELETE',
      }),

    getAnalytics: (range: string = '30d') =>
      request<ApiAnalyticsData>(`/api/admin/analytics?range=${range}`),

    getAuditLogs: () =>
      request<ApiAuditLog[]>('/api/admin/audit-logs'),

    getSettings: () =>
      request<any>('/api/admin/settings'),

    updateSettings: (updates: any) =>
      request<any>('/api/admin/settings', {
        method: 'PUT',
        body: JSON.stringify(updates),
      }),
  },
};
