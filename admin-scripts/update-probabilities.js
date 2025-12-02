#!/usr/bin/env node
const { db } = require('./firebase-admin');

async function updateProbabilities() {
  const pollId = '0q7orafmiinboj1';
  
  try {
    const doc = await db.collection('polls').doc(pollId).get();
    
    if (!doc.exists) {
      console.log('Poll not found');
      process.exit(1);
    }
    
    const data = doc.data();
    
    // Add probabilities to Nathan's participant data
    // These are roughly based on the tier assignments
    // Order matches the options array
    const probabilities = [
      0.15,  // Tiktok implementing AI-written community notes (C tier)
      0.25,  // 10x the total AI-written notes on X currently (C tier)
      0.20,  // 10x the total number of AI-written notes on videos on X (C tier)
      0.02,  // $100,000 to your expectation of what Nathan would spend it on (D tier)
      0.10,  // Nathan working somewhere that pays him $200k for a year (D tier)
      0.35,  // A new top-5 metaculus AI geopolitical forecaster (B tier)
      0.12,  // A cloud tool which can be given a document and fact-checks all statements (C tier)
      0.08,  // A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking (D tier)
      0.40,  // A prediction market on a set of UK politics questions with £10k liquidity per question (B tier)
      0.25,  // Cofound a company worth $10m (B tier)
      0.05,  // Cofound a company worth $1b (S tier - low probability because very hard)
      0.30,  // A 5% a month betting strategy on up to 100k for the next year (B tier)
      0.15,  // A 5% a month betting strategy on up to 10m for the next year (B tier)
      0.20,  // Get a job at METR (C tier)
      0.18   // Get a job at Perplexity (D tier)
    ];
    
    // Update the participant data
    data.participants[0].probabilities = probabilities;
    
    await db.collection('polls').doc(pollId).set(data);
    
    console.log('✓ Updated probabilities for poll:', pollId);
    console.log('Probabilities added:', probabilities);
    
  } catch (error) {
    console.error('Error updating poll:', error);
  }
  
  process.exit(0);
}

updateProbabilities();
