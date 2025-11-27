# Firebase Admin Scripts

Admin scripts for managing your Firebase database.

## Setup

```bash
cd admin-scripts
npm install
```

## Available Scripts

### List All Polls
View all polls in the database:
```bash
npm run list
```

### Backup All Data
Create a timestamped backup of all Firebase data:
```bash
npm run backup
```
Backups are saved to `backups/backup_YYYY-MM-DD.json`

### Fix Missing Probabilities
Automatically fix participants who are missing probability data (sets to 50% default):
```bash
npm run fix-probabilities
```

## Security Note

The `firebase-admin.js` file contains your service account credentials. Do NOT commit this to a public repository!

Add to `.gitignore`:
```
admin-scripts/firebase-admin.js
admin-scripts/backups/
```
