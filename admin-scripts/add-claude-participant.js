#!/usr/bin/env node
const { db } = require('./firebase-admin');

async function addClaudeParticipant() {
  const pollId = '0q7orafmiinboj1';
  
  try {
    const doc = await db.collection('polls').doc(pollId).get();
    
    if (!doc.exists) {
      console.log('Poll not found');
      process.exit(1);
    }
    
    const data = doc.data();
    
    // Claude's assessments
    const probabilities = [
      0.08,  // Tiktok implementing AI-written community notes
      0.15,  // 10x the total AI-written notes on X currently
      0.12,  // 10x the total number of AI-written notes on videos on X
      0.05,  // $100,000 to your expectation of what Nathan would spend it on
      0.40,  // Nathan working somewhere that pays him $200k for a year
      0.25,  // A new top-5 metaculus AI geopolitical forecaster
      0.30,  // A cloud tool which can be given a document and fact-checks all statements
      0.35,  // A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking
      0.45,  // A prediction market on a set of UK politics questions with £10k liquidity per question
      0.15,  // Cofound a company worth $10m
      0.02,  // Cofound a company worth $1b
      0.25,  // A 5% a month betting strategy on up to 100k for the next year
      0.08,  // A 5% a month betting strategy on up to 10m for the next year
      0.35,  // Get a job at METR
      0.40   // Get a job at Perplexity
    ];
    
    // Impact multipliers (will determine tiers)
    // Mapping: 10000x->S, 1000x->S, 100x->A, 15x->B, 10x->B, 5x->C, 1x->C, 0.2x->D, 0.1x->F
    const multipliers = [5, 3, 4, 0.1, 0.2, 15, 8, 6, 20, 100, 10000, 12, 150, 30, 5];
    
    // Convert multipliers to tiers
    const tiers = {};
    multipliers.forEach((mult, idx) => {
      if (mult >= 1000) {
        tiers[idx] = 'S';
      } else if (mult >= 50) {
        tiers[idx] = 'A';
      } else if (mult >= 10) {
        tiers[idx] = 'B';
      } else if (mult >= 2) {
        tiers[idx] = 'C';
      } else if (mult >= 0.15) {
        tiers[idx] = 'D';
      } else if (mult >= 0.05) {
        tiers[idx] = 'E';
      } else {
        tiers[idx] = 'F';
      }
    });
    
    // Create some comparison data based on the multipliers
    // Compare adjacent pairs and some key comparisons
    const comparisons = [
      // $1b company beats everything
      {winner: 10, loser: 0},
      {winner: 10, loser: 5},
      {winner: 10, loser: 9},
      {winner: 10, loser: 13},
      
      // 5%/month on 10m beats most things
      {winner: 12, loser: 6},
      {winner: 12, loser: 11},
      
      // $10m company vs prediction market
      {winner: 9, loser: 6},
      {winner: 9, loser: 13},
      
      // METR vs other jobs
      {winner: 13, loser: 14},
      {winner: 13, loser: 4},
      
      // Prediction market vs fact-checking tools
      {winner: 8, loser: 6},
      {winner: 8, loser: 7},
      
      // Forecaster vs fact-checking
      {winner: 5, loser: 6},
      {winner: 5, loser: 7},
      
      // Betting strategy comparisons
      {winner: 11, loser: 8},
      
      // Low impact items
      {winner: 1, loser: 3},
      {winner: 0, loser: 3},
      {winner: 14, loser: 0},
      {winner: 4, loser: 3}
    ];
    
    // Create ranking based on multipliers
    const ranking = data.options.map((option, idx) => ({
      option: option,
      rating: Math.round(multipliers[idx] * 1000), // Scale up for ratings
      tier: tiers[idx]
    })).sort((a, b) => b.rating - a.rating);
    
    // Add Claude as participant
    const claudeParticipant = {
      name: "Claude",
      timestamp: new Date().toISOString(),
      tiers: tiers,
      probabilities: probabilities,
      comparisons: comparisons,
      ranking: ranking,
      enabled: true
    };
    
    data.participants.push(claudeParticipant);
    
    await db.collection('polls').doc(pollId).set(data);
    
    console.log('✓ Added Claude as participant to poll:', pollId);
    console.log('Probabilities:', probabilities);
    console.log('Top 5 rankings:');
    ranking.slice(0, 5).forEach((item, idx) => {
      console.log(`  ${idx + 1}. [${item.tier}] ${item.option} - ${multipliers[data.options.indexOf(item.option)]}x`);
    });
    
  } catch (error) {
    console.error('Error adding participant:', error);
  }
  
  process.exit(0);
}

addClaudeParticipant();
