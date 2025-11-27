#!/usr/bin/env node
// Fix polls where participants are missing probability data
const { db } = require('./firebase-admin');

async function fixMissingProbabilities() {
  console.log('Checking for missing probability data...\n');

  try {
    const snapshot = await db.collection('polls').get();
    let fixedCount = 0;
    let totalParticipants = 0;

    for (const doc of snapshot.docs) {
      const data = doc.data();
      const pollId = doc.id;
      let pollUpdated = false;

      if (!data.participants || data.participants.length === 0) {
        continue;
      }

      const updatedParticipants = data.participants.map(participant => {
        totalParticipants++;

        // Check if probabilities are missing or invalid
        if (!participant.probabilities || !Array.isArray(participant.probabilities)) {
          console.log(`  Fixing ${participant.name} in poll ${pollId}`);
          fixedCount++;
          pollUpdated = true;

          // Set default probabilities to 0.5 (50%) for all options
          const optionCount = data.options ? data.options.length : 0;
          participant.probabilities = new Array(optionCount).fill(0.5);
        }

        return participant;
      });

      // Update the poll if any changes were made
      if (pollUpdated) {
        await db.collection('polls').doc(pollId).update({
          participants: updatedParticipants
        });
        console.log(`  ✓ Updated poll ${pollId}`);
      }
    }

    console.log(`\nChecked ${totalParticipants} participants across ${snapshot.size} poll(s)`);
    console.log(`Fixed ${fixedCount} participants with missing probabilities`);

  } catch (error) {
    console.error('Error fixing probabilities:', error);
  }

  process.exit(0);
}

fixMissingProbabilities();
