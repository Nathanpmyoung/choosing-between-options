#!/usr/bin/env node
// Backup all Firebase data to JSON file
const { db } = require('./firebase-admin');
const fs = require('fs');
const path = require('path');

async function backupAllData() {
  console.log('Backing up all Firebase data...\n');

  try {
    const snapshot = await db.collection('polls').get();

    if (snapshot.empty) {
      console.log('No data to backup.');
      process.exit(0);
    }

    const allPolls = {};
    snapshot.forEach((doc) => {
      allPolls[doc.id] = doc.data();
    });

    const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
    const filename = `backup_${timestamp}.json`;
    const filepath = path.join(__dirname, 'backups', filename);

    // Create backups directory if it doesn't exist
    const backupsDir = path.join(__dirname, 'backups');
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir);
    }

    fs.writeFileSync(filepath, JSON.stringify(allPolls, null, 2));

    console.log(`✓ Backed up ${snapshot.size} poll(s) to: ${filepath}`);
    console.log(`Total size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('Error backing up data:', error);
  }

  process.exit(0);
}

backupAllData();
