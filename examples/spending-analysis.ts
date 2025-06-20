#!/usr/bin/env tsx
/**
 * Analyze team spending data
 * Usage: npm run dev examples/spending-analysis.ts
 */

import { CursorAdminClient } from '../src/cursor-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function analyzeSpending() {
  const apiKey = process.env.CURSOR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: CURSOR_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new CursorAdminClient(apiKey);
  
  console.log('💰 Cursor Team Spending Analysis');
  console.log('=' .repeat(50));
  console.log(`Generated: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(50) + '\n');

  try {
    // Get spending data
    console.log('📊 Fetching spending data...\n');
    const spendingData = await client.getSpendingData({
      sortBy: 'spending',
      sortDirection: 'desc',
      pageSize: 100, // Get more results
    });

    if (spendingData.members.length === 0) {
      console.log('No spending data available.');
      return;
    }

    // Display total spending
    console.log(`💵 Total Team Spending: $${spendingData.total.toFixed(2)}\n`);

    // Calculate statistics
    const spendingAmounts = spendingData.members.map(m => m.spending);
    const avgSpending = spendingAmounts.reduce((a, b) => a + b, 0) / spendingAmounts.length;
    const maxSpending = Math.max(...spendingAmounts);
    const minSpending = Math.min(...spendingAmounts);

    console.log('📈 Statistics:');
    console.log(`  • Team members: ${spendingData.members.length}`);
    console.log(`  • Average spending: $${avgSpending.toFixed(2)}`);
    console.log(`  • Highest spending: $${maxSpending.toFixed(2)}`);
    console.log(`  • Lowest spending: $${minSpending.toFixed(2)}\n`);

    // Display top spenders
    console.log('🏆 Top 10 Spenders:');
    spendingData.members.slice(0, 10).forEach((member, index) => {
      const percentage = (member.spending / spendingData.total * 100).toFixed(1);
      console.log(`  ${index + 1}. ${member.name} (${member.email})`);
      console.log(`     $${member.spending.toFixed(2)} (${percentage}% of total)\n`);
    });

    // Spending distribution
    const ranges = [
      { label: '$0-50', min: 0, max: 50, count: 0 },
      { label: '$50-100', min: 50, max: 100, count: 0 },
      { label: '$100-200', min: 100, max: 200, count: 0 },
      { label: '$200-500', min: 200, max: 500, count: 0 },
      { label: '$500+', min: 500, max: Infinity, count: 0 },
    ];

    spendingData.members.forEach(member => {
      const range = ranges.find(r => member.spending >= r.min && member.spending < r.max);
      if (range) range.count++;
    });

    console.log('📊 Spending Distribution:');
    ranges.forEach(range => {
      const percentage = (range.count / spendingData.members.length * 100).toFixed(1);
      const bar = '█'.repeat(Math.round(range.count / spendingData.members.length * 20));
      console.log(`  ${range.label.padEnd(10)} ${bar} ${range.count} members (${percentage}%)`);
    });

    // Search for specific users (example)
    console.log('\n🔍 Example: Searching for specific users...');
    const searchResult = await client.getSpendingData({
      searchTerm: 'admin',
      pageSize: 5,
    });

    if (searchResult.members.length > 0) {
      console.log(`Found ${searchResult.members.length} members matching "admin":`);
      searchResult.members.forEach(member => {
        console.log(`  • ${member.name}: $${member.spending.toFixed(2)}`);
      });
    }

    console.log('\n✅ Analysis complete!');

  } catch (error) {
    console.error('❌ Error analyzing spending:', error);
    process.exit(1);
  }
}

// Run the analysis
analyzeSpending();