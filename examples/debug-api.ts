#!/usr/bin/env tsx
/**
 * Debug API responses
 */

import { CursorAdminClient } from '../src/cursor-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function debugAPI() {
  const apiKey = process.env.CURSOR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: CURSOR_API_KEY environment variable is required');
    process.exit(1);
  }

  console.log('🔍 Debugging Cursor API responses...\n');

  try {
    const client = new CursorAdminClient(apiKey);
    
    // Test 1: Get team members
    console.log('1. Testing GET /teams/members...');
    try {
      const members = await client.getTeamMembers();
      console.log('Response type:', typeof members);
      console.log('Response:', JSON.stringify(members, null, 2));
      console.log('Is array?', Array.isArray(members));
      console.log('');
    } catch (error) {
      console.error('Error:', error);
      console.log('');
    }
    
    // Test 2: Get usage data for last 7 days
    console.log('2. Testing POST /teams/daily-usage-data...');
    try {
      const endDate = Date.now();
      const startDate = endDate - (7 * 24 * 60 * 60 * 1000);
      
      const usageData = await client.getDailyUsageData(startDate, endDate);
      console.log('Response type:', typeof usageData);
      console.log('Response:', JSON.stringify(usageData, null, 2));
      console.log('Is array?', Array.isArray(usageData));
      console.log('');
    } catch (error) {
      console.error('Error:', error);
      console.log('');
    }
    
    // Test 3: Get spending data
    console.log('3. Testing POST /teams/spend...');
    try {
      const spendingData = await client.getSpendingData();
      console.log('Response type:', typeof spendingData);
      console.log('Response:', JSON.stringify(spendingData, null, 2));
      console.log('');
    } catch (error) {
      console.error('Error:', error);
      console.log('');
    }
    
  } catch (error) {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  }
}

// Run the debug
debugAPI();