#!/usr/bin/env node
// List all polls in Firebase
const { db } = require('./firebase-admin');

async function listAllPolls() {
  console.log('Fetching all polls from Firebase...\n');

  try {
    const snapshot = await db.collection('polls').get();

    if (snapshot.empty) {
      console.log('No polls found in the database.');
      return;
    }

    console.log(`Found ${snapshot.size} poll(s):\n`);

    snapshot.forEach((doc) => {
      const data = doc.data();
      const participantCount = data.participants ? data.participants.length : 0;
      const optionCount = data.options ? data.options.length : 0;

      console.log(`Poll ID: ${doc.id}`);
      console.log(`  Options: ${optionCount}`);
      console.log(`  Participants: ${participantCount}`);
      console.log(`  Created: ${data.created || 'Unknown'}`);

      if (data.participants && data.participants.length > 0) {
        console.log(`  Participant names: ${data.participants.map(p => p.name).join(', ')}`);
      }

      console.log('');
    });

  } catch (error) {
    console.error('Error fetching polls:', error);
  }

  process.exit(0);
}

listAllPolls();
