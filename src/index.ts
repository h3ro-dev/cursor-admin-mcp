#!/usr/bin/env node
import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
} from '@modelcontextprotocol/sdk/types.js';
import { z } from 'zod';
import { CursorAdminClient } from './cursor-client.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Tool schemas
const GetTeamMembersSchema = z.object({});

const GetDailyUsageDataSchema = z.object({
  startDate: z.number().describe('Start date in epoch milliseconds'),
  endDate: z.number().describe('End date in epoch milliseconds'),
});

const GetSpendingDataSchema = z.object({
  searchTerm: z.string().optional().describe('Search term for filtering'),
  sortBy: z.string().optional().describe('Field to sort by'),
  sortDirection: z.enum(['asc', 'desc']).optional().describe('Sort direction'),
  page: z.number().optional().describe('Page number'),
  pageSize: z.number().optional().describe('Number of items per page'),
});

// Server implementation
class CursorAdminMCPServer {
  private server: Server;
  private client: CursorAdminClient;

  constructor() {
    this.server = new Server(
      {
        name: 'cursor-admin-mcp',
        version: '1.0.0',
      },
      {
        capabilities: {
          tools: {},
        },
      }
    );

    const apiKey = process.env.CURSOR_API_KEY;
    if (!apiKey) {
      console.error('Error: CURSOR_API_KEY environment variable is required');
      console.error('Please set it in your .env file or environment');
      process.exit(1);
    }

    this.client = new CursorAdminClient(apiKey);
    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: [
        {
          name: 'get_team_members',
          description: 'Get list of team members with their names, emails, and roles',
          inputSchema: {
            type: 'object',
            properties: {},
          },
        },
        {
          name: 'get_daily_usage_data',
          description: 'Get detailed daily usage metrics for the team including lines added/deleted, AI suggestions, and model usage',
          inputSchema: {
            type: 'object',
            properties: {
              startDate: {
                type: 'number',
                description: 'Start date in epoch milliseconds',
              },
              endDate: {
                type: 'number',
                description: 'End date in epoch milliseconds',
              },
            },
            required: ['startDate', 'endDate'],
          },
        },
        {
          name: 'get_spending_data',
          description: 'Get team member spending information with optional filtering and pagination',
          inputSchema: {
            type: 'object',
            properties: {
              searchTerm: {
                type: 'string',
                description: 'Search term for filtering',
              },
              sortBy: {
                type: 'string',
                description: 'Field to sort by',
              },
              sortDirection: {
                type: 'string',
                enum: ['asc', 'desc'],
                description: 'Sort direction',
              },
              page: {
                type: 'number',
                description: 'Page number',
              },
              pageSize: {
                type: 'number',
                description: 'Number of items per page',
              },
            },
          },
        },
      ],
    }));

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      try {
        switch (request.params.name) {
          case 'get_team_members': {
            const members = await this.client.getTeamMembers();
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(members, null, 2),
                },
              ],
            };
          }

          case 'get_daily_usage_data': {
            const args = GetDailyUsageDataSchema.parse(request.params.arguments);
            
            // Validate date range (90 days max)
            const daysDiff = (args.endDate - args.startDate) / (1000 * 60 * 60 * 24);
            if (daysDiff > 90) {
              throw new McpError(
                ErrorCode.InvalidParams,
                'Date range cannot exceed 90 days'
              );
            }

            const usageData = await this.client.getDailyUsageData(
              args.startDate,
              args.endDate
            );
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(usageData, null, 2),
                },
              ],
            };
          }

          case 'get_spending_data': {
            const args = GetSpendingDataSchema.parse(request.params.arguments);
            const spendingData = await this.client.getSpendingData(args);
            return {
              content: [
                {
                  type: 'text',
                  text: JSON.stringify(spendingData, null, 2),
                },
              ],
            };
          }

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${request.params.name}`
            );
        }
      } catch (error) {
        if (error instanceof z.ZodError) {
          throw new McpError(
            ErrorCode.InvalidParams,
            `Invalid arguments: ${error.errors.map(e => e.message).join(', ')}`
          );
        }
        if (error instanceof McpError) {
          throw error;
        }
        throw new McpError(
          ErrorCode.InternalError,
          `Tool execution failed: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    });
  }

  async run(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Cursor Admin MCP server running');
  }
}

// Main execution
const server = new CursorAdminMCPServer();
server.run().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});