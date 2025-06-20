#!/usr/bin/env tsx
/**
 * Test connection to Cursor API
 * Usage: npm run dev examples/test-connection.ts
 */

import { CursorAdminClient } from '../src/cursor-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function testConnection() {
  const apiKey = process.env.CURSOR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: CURSOR_API_KEY environment variable is required');
    console.error('Please set it in your .env file');
    process.exit(1);
  }

  console.log('🔍 Testing connection to Cursor API...\n');

  try {
    const client = new CursorAdminClient(apiKey);
    
    // Test connection
    console.log('Testing API connection...');
    const isConnected = await client.testConnection();
    
    if (isConnected) {
      console.log('✅ Successfully connected to Cursor API!\n');
      
      // Get team members
      console.log('📋 Fetching team members...');
      const members = await client.getTeamMembers();
      console.log(`Found ${members.length} team members:`);
      
      members.forEach((member, index) => {
        console.log(`  ${index + 1}. ${member.name} (${member.email}) - ${member.role}`);
      });
      
      console.log('\n✨ All tests passed! Your API key is valid and working.');
    }
  } catch (error) {
    console.error('❌ Connection test failed:', error);
    
    if (error instanceof Error && error.message.includes('Invalid API key')) {
      console.error('\n💡 Please check that:');
      console.error('  1. Your API key is correct');
      console.error('  2. You have admin access to the team');
      console.error('  3. The API key hasn\'t been revoked');
    }
    
    process.exit(1);
  }
}

// Run the test
testConnection();