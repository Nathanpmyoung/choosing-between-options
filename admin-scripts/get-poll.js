#!/usr/bin/env node
// Get specific poll data
const { db } = require('./firebase-admin');

async function getPoll(pollId) {
  try {
    const doc = await db.collection('polls').doc(pollId).get();

    if (!doc.exists) {
      console.log(`Poll ${pollId} not found.`);
      process.exit(1);
    }

    const data = doc.data();
    console.log(JSON.stringify(data, null, 2));

  } catch (error) {
    console.error('Error fetching poll:', error);
  }

  process.exit(0);
}

const pollId = process.argv[2];
if (!pollId) {
  console.log('Usage: node get-poll.js <pollId>');
  process.exit(1);
}

getPoll(pollId);
