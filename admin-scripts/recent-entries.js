#!/usr/bin/env node
// Get recent entries from the last N minutes
const { db } = require('./firebase-admin');

async function getRecentEntries(minutesAgo = 5) {
  console.log(`Fetching entries from the last ${minutesAgo} minutes...\n`);

  try {
    const snapshot = await db.collection('polls').get();
    const cutoffTime = new Date(Date.now() - minutesAgo * 60 * 1000);

    let recentEntries = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      const pollId = doc.id;

      if (data.participants) {
        data.participants.forEach(participant => {
          const timestamp = new Date(participant.timestamp);
          if (timestamp >= cutoffTime) {
            recentEntries.push({
              pollId,
              participant,
              options: data.options,
              timestamp
            });
          }
        });
      }
    });

    // Sort by timestamp, newest first
    recentEntries.sort((a, b) => b.timestamp - a.timestamp);

    if (recentEntries.length === 0) {
      console.log(`No entries found in the last ${minutesAgo} minutes.`);
      process.exit(0);
    }

    console.log(`Found ${recentEntries.length} recent entry(ies):\n`);

    recentEntries.forEach((entry, idx) => {
      console.log(`=== Entry ${idx + 1} ===`);
      console.log(`Poll ID: ${entry.pollId}`);
      console.log(`Participant: ${entry.participant.name}`);
      console.log(`Timestamp: ${entry.timestamp.toISOString()}`);
      console.log(`Comparisons made: ${entry.participant.comparisons ? entry.participant.comparisons.length : 0}`);

      if (entry.participant.ranking) {
        console.log(`\nRanking (${entry.participant.ranking.length} items):`);
        entry.participant.ranking.forEach((item, rank) => {
          const prob = entry.participant.probabilities && entry.participant.probabilities[entry.options.indexOf(item.option)];
          const probText = prob !== undefined ? `${Math.round(prob * 100)}%` : 'N/A';
          console.log(`  ${rank + 1}. [${item.tier || 'N/A'}] ${item.option} - Rating: ${item.rating}, Prob: ${probText}`);
        });
      }

      if (entry.participant.probabilities) {
        console.log(`\nProbabilities by option:`);
        entry.options.forEach((option, idx) => {
          const prob = entry.participant.probabilities[idx];
          if (prob !== undefined) {
            console.log(`  ${option}: ${Math.round(prob * 100)}%`);
          }
        });
      }

      console.log('\n');
    });

  } catch (error) {
    console.error('Error fetching recent entries:', error);
  }

  process.exit(0);
}

const minutes = process.argv[2] ? parseInt(process.argv[2]) : 5;
getRecentEntries(minutes);
