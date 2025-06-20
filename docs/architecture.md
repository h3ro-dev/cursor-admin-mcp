# Architecture Overview

## How Cursor Admin MCP Works

```mermaid
graph TD
    A[AI Assistant<br/>Claude/GPT/etc] -->|MCP Protocol| B[Cursor Admin MCP Server]
    B -->|HTTPS + Basic Auth| C[Cursor Admin API]
    
    B --> D[get_team_members]
    B --> E[get_daily_usage_data]
    B --> F[get_spending_data]
    
    D --> G[Team Roster]
    E --> H[Usage Analytics]
    F --> I[Spending Reports]
    
    style A fill:#f9f,stroke:#333,stroke-width:4px
    style B fill:#bbf,stroke:#333,stroke-width:4px
    style C fill:#bfb,stroke:#333,stroke-width:4px
```

## Data Flow

1. **User Query**: "Show me team usage"
2. **AI Processing**: Understands intent, calls appropriate tool
3. **MCP Server**: Validates request, formats API call
4. **Cursor API**: Returns data with authentication
5. **Response Processing**: Formats data for human readability
6. **AI Response**: Natural language summary with insights

## Security Architecture

```mermaid
graph LR
    A[Environment Variable] -->|CURSOR_API_KEY| B[MCP Server]
    B -->|Basic Auth Header| C[HTTPS Request]
    C -->|Encrypted| D[Cursor API]
    
    style A fill:#faa,stroke:#333,stroke-width:2px
    style D fill:#afa,stroke:#333,stroke-width:2px
```

## Tool Architecture

### get_team_members
- **Endpoint**: GET /teams/members
- **Response**: Array of team members
- **Use Case**: Team roster, role verification

### get_daily_usage_data
- **Endpoint**: POST /teams/daily-usage-data
- **Parameters**: startDate, endDate (epoch ms)
- **Validation**: 90-day maximum range
- **Response**: Detailed metrics per user per day

### get_spending_data
- **Endpoint**: POST /teams/spend
- **Parameters**: Optional filters and pagination
- **Response**: Credit usage and costs
- **Features**: Search, sort, paginate