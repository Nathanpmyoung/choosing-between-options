#!/usr/bin/env node
// Create a test poll with sample data
const { db } = require('./firebase-admin');

async function createTestPoll() {
  const pollId = 'test-' + Date.now();

  const testData = {
    created: new Date().toISOString(),
    id: pollId,
    options: [
      "Tiktok implementing AI-written community notes",
      "10x the total AI-written notes on X currently",
      "10x the total number of AI-written notes on videos on X",
      "$100,000 to your expectation of what Nathan would spend it on",
      "Nathan working somewhere that pays him $200k for a year",
      "A new top-5 metaculus AI geopolitical forecaster",
      "A cloud tool which can be given a document and fact-checks all statements",
      "A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking",
      "A prediction market on a set of UK politics questions with £10k liquidity per question",
      "Cofound a company worth $10m",
      "Cofound a company worth $1b",
      "A 5% a month betting strategy on up to 100k for the next year",
      "A 5% a month betting strategy on up to 10m for the next year",
      "Get a job at METR",
      "Get a job at Perplexity"
    ],
    participants: [
      {
        name: "Nathan",
        timestamp: new Date().toISOString(),
        tiers: ['S', 'B', 'B', 'F', 'D', 'B', 'D', 'D', 'B', 'B', 'S', 'B', 'B', 'D', 'D'],
        probabilities: [0.15, 0.25, 0.20, 0.0, 0.10, 0.35, 0.12, 0.08, 0.40, 0.25, 0.05, 0.30, 0.15, 0.20, 0.18],
        comparisons: [
          {winner: 10, loser: 0},
          {winner: 5, loser: 0},
          {winner: 8, loser: 0},
          {winner: 9, loser: 0},
          {winner: 11, loser: 0},
          {winner: 12, loser: 0},
          {winner: 0, loser: 1},
          {winner: 0, loser: 2},
          {winner: 0, loser: 3},
          {winner: 0, loser: 4},
          {winner: 0, loser: 6},
          {winner: 0, loser: 7},
          {winner: 0, loser: 13},
          {winner: 0, loser: 14},
          {winner: 10, loser: 5},
          {winner: 10, loser: 8},
          {winner: 8, loser: 5},
          {winner: 11, loser: 9},
          {winner: 12, loser: 11}
        ],
        ranking: [
          {option: "Cofound a company worth $1b", rating: 1000000, tier: "S"},
          {option: "A 5% a month betting strategy on up to 10m for the next year", rating: 50000, tier: "B"},
          {option: "A 5% a month betting strategy on up to 100k for the next year", rating: 45000, tier: "B"},
          {option: "A prediction market on a set of UK politics questions with £10k liquidity per question", rating: 40000, tier: "B"},
          {option: "Cofound a company worth $10m", rating: 35000, tier: "B"},
          {option: "A new top-5 metaculus AI geopolitical forecaster", rating: 30000, tier: "B"},
          {option: "Tiktok implementing AI-written community notes", rating: 5000, tier: "C"},
          {option: "10x the total AI-written notes on X currently", rating: 800, tier: "C"},
          {option: "10x the total number of AI-written notes on videos on X", rating: 600, tier: "D"},
          {option: "Nathan working somewhere that pays him $200k for a year", rating: 500, tier: "D"},
          {option: "A cloud tool which can be given a document and fact-checks all statements", rating: 400, tier: "D"},
          {option: "A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking", rating: 300, tier: "D"},
          {option: "Get a job at METR", rating: 200, tier: "D"},
          {option: "Get a job at Perplexity", rating: 150, tier: "D"},
          {option: "$100,000 to your expectation of what Nathan would spend it on", rating: 100, tier: "F"}
        ],
        enabled: true
      }
    ]
  };

  try {
    await db.collection('polls').doc(pollId).set(testData);
    console.log(`✓ Created test poll: ${pollId}`);
    console.log(`\nURL: https://choosing-between-options-76h0slvyt-nathanpmyoungs-projects.vercel.app/?poll=${pollId}`);
    console.log(`\nAdmin view (add your name to admins): View Results button will appear`);
  } catch (error) {
    console.error('Error creating test poll:', error);
  }

  process.exit(0);
}

createTestPoll();
