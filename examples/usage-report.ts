#!/usr/bin/env tsx
/**
 * Generate a usage report for the last 7 days
 * Usage: npm run dev examples/usage-report.ts
 */

import { CursorAdminClient } from '../src/cursor-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function generateUsageReport() {
  const apiKey = process.env.CURSOR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: CURSOR_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new CursorAdminClient(apiKey);
  
  // Calculate date range (last 7 days)
  const endDate = Date.now();
  const startDate = endDate - (7 * 24 * 60 * 60 * 1000);
  
  console.log('📊 Cursor Team Usage Report');
  console.log('=' .repeat(50));
  console.log(`Period: ${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`);
  console.log('=' .repeat(50) + '\n');

  try {
    // Get usage data
    const usageData = await client.getDailyUsageData(startDate, endDate);
    
    if (usageData.length === 0) {
      console.log('No usage data available for this period.');
      return;
    }

    // Calculate totals
    let totalLinesAdded = 0;
    let totalLinesDeleted = 0;
    let totalRequests = 0;
    let avgAcceptanceRate = 0;
    const modelUsage: Record<string, number> = {};
    const extensionUsage: Record<string, number> = {};

    usageData.forEach(day => {
      totalLinesAdded += day.linesAdded || 0;
      totalLinesDeleted += day.linesDeleted || 0;
      avgAcceptanceRate += day.acceptanceRate || 0;
      
      // Count requests
      if (day.requestTypes) {
        Object.values(day.requestTypes).forEach(count => {
          totalRequests += count;
        });
      }
      
      // Track model usage
      if (day.mostUsedModels) {
        day.mostUsedModels.forEach(model => {
          modelUsage[model] = (modelUsage[model] || 0) + 1;
        });
      }
      
      // Track extension usage
      if (day.mostUsedExtensions) {
        day.mostUsedExtensions.forEach(ext => {
          extensionUsage[ext] = (extensionUsage[ext] || 0) + 1;
        });
      }
    });

    avgAcceptanceRate = avgAcceptanceRate / usageData.length;

    // Display summary
    console.log('📈 Summary Statistics:');
    console.log(`  • Total lines added: ${totalLinesAdded.toLocaleString()}`);
    console.log(`  • Total lines deleted: ${totalLinesDeleted.toLocaleString()}`);
    console.log(`  • Net lines changed: ${(totalLinesAdded - totalLinesDeleted).toLocaleString()}`);
    console.log(`  • Total AI requests: ${totalRequests.toLocaleString()}`);
    console.log(`  • Average acceptance rate: ${(avgAcceptanceRate * 100).toFixed(1)}%\n`);

    // Display daily breakdown
    console.log('📅 Daily Breakdown:');
    usageData.forEach(day => {
      console.log(`\n  ${day.date}:`);
      console.log(`    • Lines: +${day.linesAdded} / -${day.linesDeleted}`);
      console.log(`    • Acceptance rate: ${(day.acceptanceRate * 100).toFixed(1)}%`);
      
      if (day.requestTypes) {
        const types = Object.entries(day.requestTypes)
          .map(([type, count]) => `${type}: ${count}`)
          .join(', ');
        console.log(`    • Requests: ${types}`);
      }
    });

    // Display most used models
    console.log('\n🤖 Most Used Models:');
    Object.entries(modelUsage)
      .sort(([, a], [, b]) => b - a)
      .forEach(([model, days]) => {
        console.log(`  • ${model}: ${days} days`);
      });

    // Display most used extensions
    console.log('\n🔧 Most Used Extensions:');
    Object.entries(extensionUsage)
      .sort(([, a], [, b]) => b - a)
      .forEach(([ext, days]) => {
        console.log(`  • ${ext}: ${days} days`);
      });

    console.log('\n✅ Report generated successfully!');

  } catch (error) {
    console.error('❌ Error generating report:', error);
    process.exit(1);
  }
}

// Run the report
generateUsageReport();