#!/usr/bin/env tsx
/**
 * Generate a comprehensive team summary
 */

import { CursorAdminClient } from '../src/cursor-client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function generateTeamSummary() {
  const apiKey = process.env.CURSOR_API_KEY;
  
  if (!apiKey) {
    console.error('❌ Error: CURSOR_API_KEY environment variable is required');
    process.exit(1);
  }

  const client = new CursorAdminClient(apiKey);
  
  console.log('🚀 Cursor Team Summary Report');
  console.log('=' .repeat(60));
  console.log(`Generated: ${new Date().toLocaleString()}`);
  console.log('=' .repeat(60) + '\n');

  try {
    // 1. Get team members
    console.log('👥 TEAM MEMBERS');
    console.log('-'.repeat(40));
    const members = await client.getTeamMembers();
    
    members.forEach((member, index) => {
      console.log(`${index + 1}. ${member.name || '(No name)'}`);
      console.log(`   Email: ${member.email}`);
      console.log(`   Role: ${member.role}`);
      console.log('');
    });

    // 2. Get usage data for last 7 days
    const endDate = Date.now();
    const startDate = endDate - (7 * 24 * 60 * 60 * 1000);
    
    console.log('\n📊 USAGE STATISTICS (Last 7 Days)');
    console.log('-'.repeat(40));
    
    const usageData = await client.getDailyUsageData(startDate, endDate);
    
    // Aggregate stats by user
    const userStats: Record<string, any> = {};
    
    usageData.data.forEach(entry => {
      if (!userStats[entry.email]) {
        userStats[entry.email] = {
          name: members.find(m => m.email === entry.email)?.name || '(No name)',
          totalLinesAdded: 0,
          totalLinesDeleted: 0,
          acceptedLinesAdded: 0,
          acceptedLinesDeleted: 0,
          totalRequests: 0,
          composerRequests: 0,
          chatRequests: 0,
          agentRequests: 0,
          activeDays: 0,
          models: new Set(),
          extensions: new Set(),
        };
      }
      
      const stats = userStats[entry.email];
      if (entry.isActive) {
        stats.activeDays++;
        stats.totalLinesAdded += entry.totalLinesAdded;
        stats.totalLinesDeleted += entry.totalLinesDeleted;
        stats.acceptedLinesAdded += entry.acceptedLinesAdded;
        stats.acceptedLinesDeleted += entry.acceptedLinesDeleted;
        stats.composerRequests += entry.composerRequests;
        stats.chatRequests += entry.chatRequests;
        stats.agentRequests += entry.agentRequests;
        stats.totalRequests += entry.composerRequests + entry.chatRequests + entry.agentRequests;
        
        if (entry.mostUsedModel) stats.models.add(entry.mostUsedModel);
        if (entry.applyMostUsedExtension) stats.extensions.add(entry.applyMostUsedExtension);
      }
    });

    // Display user stats
    Object.entries(userStats).forEach(([email, stats]) => {
      console.log(`\n${stats.name} (${email})`);
      console.log(`  Active Days: ${stats.activeDays}/7`);
      console.log(`  Lines Added: ${stats.totalLinesAdded.toLocaleString()} (${stats.acceptedLinesAdded.toLocaleString()} accepted)`);
      console.log(`  Lines Deleted: ${stats.totalLinesDeleted.toLocaleString()}`);
      console.log(`  Total AI Requests: ${stats.totalRequests}`);
      if (stats.totalRequests > 0) {
        console.log(`    - Composer: ${stats.composerRequests}`);
        console.log(`    - Chat: ${stats.chatRequests}`);
        console.log(`    - Agent: ${stats.agentRequests}`);
      }
      
      const acceptanceRate = stats.totalLinesAdded > 0 
        ? ((stats.acceptedLinesAdded / stats.totalLinesAdded) * 100).toFixed(1) 
        : '0';
      console.log(`  Acceptance Rate: ${acceptanceRate}%`);
      
      if (stats.models.size > 0) {
        console.log(`  Models Used: ${Array.from(stats.models).join(', ')}`);
      }
      if (stats.extensions.size > 0) {
        console.log(`  Languages: ${Array.from(stats.extensions).join(', ')}`);
      }
    });

    // 3. Get spending data
    console.log('\n\n💰 SPENDING SUMMARY');
    console.log('-'.repeat(40));
    
    const spendingData = await client.getSpendingData();
    
    const totalSpendCents = spendingData.teamMemberSpend.reduce((sum, member) => sum + member.spendCents, 0);
    const totalSpendDollars = totalSpendCents / 100;
    
    console.log(`Total Team Spending: $${totalSpendDollars.toFixed(2)}`);
    console.log(`Subscription Cycle Start: ${new Date(spendingData.subscriptionCycleStart).toLocaleDateString()}`);
    console.log('\nIndividual Spending:');
    
    spendingData.teamMemberSpend
      .sort((a, b) => b.spendCents - a.spendCents)
      .forEach((member, index) => {
        const dollars = member.spendCents / 100;
        const percentage = totalSpendCents > 0 ? ((member.spendCents / totalSpendCents) * 100).toFixed(1) : '0';
        console.log(`  ${index + 1}. ${member.name || '(No name)'} - $${dollars.toFixed(2)} (${percentage}%)`);
        if (member.fastPremiumRequests > 0) {
          console.log(`     Fast Premium Requests: ${member.fastPremiumRequests}`);
        }
      });

    // Summary insights
    console.log('\n\n🎯 KEY INSIGHTS');
    console.log('-'.repeat(40));
    
    // Most active user
    const mostActiveUser = Object.entries(userStats)
      .sort(([, a], [, b]) => b.totalRequests - a.totalRequests)[0];
    
    if (mostActiveUser) {
      console.log(`• Most Active: ${mostActiveUser[1].name} (${mostActiveUser[1].totalRequests} AI requests)`);
    }
    
    // Most productive (lines added)
    const mostProductive = Object.entries(userStats)
      .sort(([, a], [, b]) => b.totalLinesAdded - a.totalLinesAdded)[0];
    
    if (mostProductive && mostProductive[1].totalLinesAdded > 0) {
      console.log(`• Most Productive: ${mostProductive[1].name} (${mostProductive[1].totalLinesAdded.toLocaleString()} lines added)`);
    }
    
    // Popular models
    const allModels = new Set<string>();
    Object.values(userStats).forEach((stats: any) => {
      stats.models.forEach((model: string) => allModels.add(model));
    });
    
    if (allModels.size > 0) {
      console.log(`• Models in Use: ${Array.from(allModels).join(', ')}`);
    }
    
    // Team activity
    const activeMembers = Object.values(userStats).filter((stats: any) => stats.activeDays > 0).length;
    console.log(`• Active Members: ${activeMembers}/${members.length}`);
    
    console.log('\n✅ Report complete!');

  } catch (error) {
    console.error('❌ Error generating summary:', error);
    process.exit(1);
  }
}

// Run the summary
generateTeamSummary();