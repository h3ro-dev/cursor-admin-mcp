import axios, { AxiosInstance, AxiosError } from 'axios';

export interface TeamMember {
  name: string;
  email: string;
  role: string;
}

export interface TeamMembersResponse {
  teamMembers: TeamMember[];
}

export interface DailyUsageEntry {
  date: number;
  email: string;
  isActive: boolean;
  totalLinesAdded: number;
  totalLinesDeleted: number;
  acceptedLinesAdded: number;
  acceptedLinesDeleted: number;
  totalApplies: number;
  totalAccepts: number;
  totalRejects: number;
  totalTabsShown: number;
  totalTabsAccepted: number;
  composerRequests: number;
  chatRequests: number;
  agentRequests: number;
  cmdkUsages: number;
  subscriptionIncludedReqs: number;
  apiKeyReqs: number;
  usageBasedReqs: number;
  bugbotUsages: number;
  mostUsedModel?: string;
  applyMostUsedExtension?: string;
  clientVersion?: string;
  [key: string]: any;
}

export interface DailyUsageData {
  period: {
    startDate: number;
    endDate: number;
  };
  data: DailyUsageEntry[];
}

export interface SpendingOptions {
  searchTerm?: string;
  sortBy?: string;
  sortDirection?: 'asc' | 'desc';
  page?: number;
  pageSize?: number;
}

export interface TeamMemberSpend {
  spendCents: number;
  fastPremiumRequests: number;
  name: string;
  email: string;
  role: string;
  hardLimitOverrideDollars: number;
}

export interface SpendingData {
  teamMemberSpend: TeamMemberSpend[];
  subscriptionCycleStart: number;
  totalMembers: number;
  totalPages: number;
}

export class CursorApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public response?: any
  ) {
    super(message);
    this.name = 'CursorApiError';
  }
}

export class CursorAdminClient {
  private axios: AxiosInstance;

  constructor(apiKey: string) {
    if (!apiKey) {
      throw new Error('API key is required');
    }

    // Create axios instance with basic auth
    this.axios = axios.create({
      baseURL: 'https://api.cursor.com',
      auth: {
        username: apiKey,
        password: '', // Empty password for basic auth
      },
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'cursor-admin-mcp/1.0.0',
      },
      timeout: 30000, // 30 second timeout
    });

    // Add response interceptor for error handling
    this.axios.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response) {
          const data = error.response.data as any;
          throw new CursorApiError(
            error.response.status,
            data?.message || error.message,
            data
          );
        } else if (error.request) {
          throw new CursorApiError(
            0,
            'No response received from Cursor API',
            error.request
          );
        } else {
          throw new CursorApiError(0, error.message);
        }
      }
    );
  }

  /**
   * Get team members
   */
  async getTeamMembers(): Promise<TeamMember[]> {
    try {
      const response = await this.axios.get<TeamMembersResponse>('/teams/members');
      return response.data.teamMembers;
    } catch (error) {
      if (error instanceof CursorApiError) {
        throw error;
      }
      throw new CursorApiError(
        500,
        `Failed to get team members: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get daily usage data
   * @param startDate - Start date in epoch milliseconds
   * @param endDate - End date in epoch milliseconds
   */
  async getDailyUsageData(
    startDate: number,
    endDate: number
  ): Promise<DailyUsageData> {
    // Validate inputs
    if (!Number.isInteger(startDate) || startDate < 0) {
      throw new Error('Invalid startDate: must be a positive integer (epoch milliseconds)');
    }
    if (!Number.isInteger(endDate) || endDate < 0) {
      throw new Error('Invalid endDate: must be a positive integer (epoch milliseconds)');
    }
    if (endDate < startDate) {
      throw new Error('endDate must be greater than or equal to startDate');
    }

    // Check 90-day limit
    const daysDiff = (endDate - startDate) / (1000 * 60 * 60 * 24);
    if (daysDiff > 90) {
      throw new Error('Date range cannot exceed 90 days');
    }

    try {
      const response = await this.axios.post<DailyUsageData>(
        '/teams/daily-usage-data',
        {
          startDate,
          endDate,
        }
      );
      return response.data;
    } catch (error) {
      if (error instanceof CursorApiError) {
        throw error;
      }
      throw new CursorApiError(
        500,
        `Failed to get daily usage data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get spending data
   */
  async getSpendingData(options?: SpendingOptions): Promise<SpendingData> {
    try {
      const response = await this.axios.post<SpendingData>(
        '/teams/spend',
        options || {}
      );
      return response.data;
    } catch (error) {
      if (error instanceof CursorApiError) {
        throw error;
      }
      throw new CursorApiError(
        500,
        `Failed to get spending data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Test API connectivity
   */
  async testConnection(): Promise<boolean> {
    try {
      await this.getTeamMembers();
      return true;
    } catch (error) {
      if (error instanceof CursorApiError && error.statusCode === 401) {
        throw new Error('Invalid API key');
      }
      throw error;
    }
  }
}