import { CursorAdminClient, CursorApiError } from '../src/cursor-client';
import axios from 'axios';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('CursorAdminClient', () => {
  let client: CursorAdminClient;
  const mockApiKey = 'key_test123456789';

  beforeEach(() => {
    jest.clearAllMocks();
    
    // Mock axios.create to return a mock axios instance
    const mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      interceptors: {
        response: {
          use: jest.fn(),
        },
      },
    };
    
    mockedAxios.create.mockReturnValue(mockAxiosInstance as any);
    
    client = new CursorAdminClient(mockApiKey);
  });

  describe('constructor', () => {
    it('should throw error if API key is not provided', () => {
      expect(() => new CursorAdminClient('')).toThrow('API key is required');
    });

    it('should create axios instance with correct config', () => {
      expect(mockedAxios.create).toHaveBeenCalledWith({
        baseURL: 'https://api.cursor.com',
        auth: {
          username: mockApiKey,
          password: '',
        },
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'cursor-admin-mcp/1.0.0',
        },
        timeout: 30000,
      });
    });
  });

  describe('getTeamMembers', () => {
    it('should return team members successfully', async () => {
      const mockMembers = [
        { name: 'John Doe', email: 'john@example.com', role: 'admin' },
        { name: 'Jane Smith', email: 'jane@example.com', role: 'member' },
      ];

      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      axiosInstance.get.mockResolvedValueOnce({ data: mockMembers });

      const result = await client.getTeamMembers();
      
      expect(axiosInstance.get).toHaveBeenCalledWith('/teams/members');
      expect(result).toEqual(mockMembers);
    });

    it('should handle API errors', async () => {
      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      axiosInstance.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(client.getTeamMembers()).rejects.toThrow(CursorApiError);
    });
  });

  describe('getDailyUsageData', () => {
    const validStartDate = Date.now() - 7 * 24 * 60 * 60 * 1000; // 7 days ago
    const validEndDate = Date.now();

    it('should return daily usage data successfully', async () => {
      const mockUsageData = [
        {
          date: '2024-01-01',
          linesAdded: 100,
          linesDeleted: 50,
          acceptanceRate: 0.75,
          requestTypes: { completion: 10, chat: 5 },
          mostUsedModels: ['gpt-4'],
          mostUsedExtensions: ['copilot'],
          clientVersion: '0.42.0',
        },
      ];

      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      axiosInstance.post.mockResolvedValueOnce({ data: mockUsageData });

      const result = await client.getDailyUsageData(validStartDate, validEndDate);
      
      expect(axiosInstance.post).toHaveBeenCalledWith('/teams/daily-usage-data', {
        startDate: validStartDate,
        endDate: validEndDate,
      });
      expect(result).toEqual(mockUsageData);
    });

    it('should validate startDate is a positive integer', async () => {
      await expect(client.getDailyUsageData(-1, validEndDate)).rejects.toThrow(
        'Invalid startDate: must be a positive integer (epoch milliseconds)'
      );
      
      await expect(client.getDailyUsageData(1.5, validEndDate)).rejects.toThrow(
        'Invalid startDate: must be a positive integer (epoch milliseconds)'
      );
    });

    it('should validate endDate is a positive integer', async () => {
      await expect(client.getDailyUsageData(validStartDate, -1)).rejects.toThrow(
        'Invalid endDate: must be a positive integer (epoch milliseconds)'
      );
    });

    it('should validate endDate is greater than startDate', async () => {
      await expect(client.getDailyUsageData(validEndDate, validStartDate)).rejects.toThrow(
        'endDate must be greater than or equal to startDate'
      );
    });

    it('should validate date range does not exceed 90 days', async () => {
      const startDate = Date.now() - 100 * 24 * 60 * 60 * 1000; // 100 days ago
      const endDate = Date.now();
      
      await expect(client.getDailyUsageData(startDate, endDate)).rejects.toThrow(
        'Date range cannot exceed 90 days'
      );
    });
  });

  describe('getSpendingData', () => {
    it('should return spending data without options', async () => {
      const mockSpendingData = {
        members: [
          { email: 'john@example.com', name: 'John Doe', spending: 100 },
        ],
        total: 100,
        page: 1,
        pageSize: 10,
      };

      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      axiosInstance.post.mockResolvedValueOnce({ data: mockSpendingData });

      const result = await client.getSpendingData();
      
      expect(axiosInstance.post).toHaveBeenCalledWith('/teams/spend', {});
      expect(result).toEqual(mockSpendingData);
    });

    it('should return spending data with options', async () => {
      const options = {
        searchTerm: 'john',
        sortBy: 'spending',
        sortDirection: 'desc' as const,
        page: 2,
        pageSize: 20,
      };

      const mockSpendingData = {
        members: [],
        total: 0,
        page: 2,
        pageSize: 20,
      };

      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      axiosInstance.post.mockResolvedValueOnce({ data: mockSpendingData });

      const result = await client.getSpendingData(options);
      
      expect(axiosInstance.post).toHaveBeenCalledWith('/teams/spend', options);
      expect(result).toEqual(mockSpendingData);
    });
  });

  describe('testConnection', () => {
    it('should return true if connection is successful', async () => {
      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      axiosInstance.get.mockResolvedValueOnce({ data: [] });

      const result = await client.testConnection();
      expect(result).toBe(true);
    });

    it('should throw "Invalid API key" for 401 errors', async () => {
      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      const error = new CursorApiError(401, 'Unauthorized');
      axiosInstance.get.mockRejectedValueOnce(error);

      await expect(client.testConnection()).rejects.toThrow('Invalid API key');
    });

    it('should rethrow other errors', async () => {
      const axiosInstance = (mockedAxios.create as jest.Mock).mock.results[0].value;
      const error = new CursorApiError(500, 'Server error');
      axiosInstance.get.mockRejectedValueOnce(error);

      await expect(client.testConnection()).rejects.toThrow(error);
    });
  });
});