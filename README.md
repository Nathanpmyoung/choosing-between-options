# Rank by Pairs

An elegant pairwise comparison ranking tool. Perfect for gathering opinions from multiple people and aggregating their preferences into a group ranking.

## Features

- **Pairwise Comparisons**: Choose between pairs of options to build rankings
- **Individual Rankings**: Each participant gets their own personalized ranking
- **Group Aggregation**: Combine multiple participants with equal weighting
- **Toggle Participants**: Turn people on/off to see how it affects group rankings
- **Data Persistence**: All data saved locally in browser
- **Export**: Download rankings as JSON

## Usage

1. Enter your name
2. List the options you want to rank (one per line)
3. Choose your preference between each pair
4. View your ranking and invite others to add theirs
5. Toggle participants to see how group ranking changes

## Deployment to Vercel

### Option 1: Using Vercel CLI

```bash
# Install Vercel CLI if you haven't already
npm install -g vercel

# Deploy
vercel
```

### Option 2: Using Vercel Dashboard

1. Push this repository to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Deploy (no build configuration needed)

### Option 3: Deploy Button

Or simply connect your GitHub repo and Vercel will auto-deploy on every push to main.

## How It Works

The ranking algorithm uses Elo ratings (similar to chess rankings) to calculate preferences from pairwise comparisons. This gives more accurate results than simple voting, especially when comparing many options.

Group rankings average the Elo ratings across all selected participants, giving each person equal weight.
