#!/usr/bin/env node
// Script to save Oli's data to the poll

const oliProgress = {"participant":"Oli","tiers":{"0":"A","1":"C","2":"B","3":"D","4":"D","5":"C","6":"B","7":"B","8":"C","9":"C","10":"A","11":"D","12":"C","13":"C","14":"C"},"manualTiers":{},"probabilities":{"0":0.5,"1":0.5,"2":0.5,"3":0.5,"4":0.5,"5":0.5,"6":0.5,"7":0.5,"8":0.5,"9":0.5,"10":0.5,"11":0.5,"12":0.5,"13":0.5,"14":0.5},"comparisons":[],"drawnPairs":[],"probabilityComparisons":[],"drawnProbabilityPairs":[],"lowerBounds":{"0":1,"1":-1,"2":0,"3":-2,"4":-2,"5":-1,"6":0,"7":0,"8":-1,"9":-1,"10":1,"11":-2,"12":-1,"13":-1,"14":-1},"upperBounds":{"0":3,"1":1,"2":2,"3":0,"4":0,"5":1,"6":2,"7":2,"8":1,"9":1,"10":3,"11":0,"12":1,"13":1,"14":1},"timestamp":"2025-12-03T18:41:23.541Z"};

const pollData = {"options":["Tiktok implementing AI-written community notes","10x the total AI-written notes on X currently","10x the total number of AI-written notes on videos on X","$100,000 to your expectation of what Nathan would spend it on","Nathan working somewhere that pays him $200k for a year","A new top-5 metaculus AI geopolitical forecaster","A cloud tool which can be given a document and fact-checks all statements","A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking","A prediction market 16 on a set of UK politics questions with £10k liquidity per question","Cofound a company worth $10m","Cofound a company worth $1b","A 5% a month betting strategy on up to 100k for the next year","A 5% a month betting strategy on up to 10m for the next year","Get a job at METR","Get a job at Perplexity"],"participantLinks":[{"created":"2025-12-03T15:00:31.690Z","url":"https://choosing-between-options.vercel.app/?poll=0q7orafmiinboj1&participant=Oli","name":"Oli"}],"participants":[{"enabled":true,"tiers":{"0":"C","1":"C","2":"C","3":"E","4":"D","5":"B","6":"C","7":"C","8":"B","9":"A","10":"S","11":"B","12":"A","13":"B","14":"C"},"ranking":[{"tier":"S","option":"Cofound a company worth $1b","rating":10000000},{"rating":150000,"tier":"A","option":"A 5% a month betting strategy on up to 10m for the next year"},{"tier":"A","option":"Cofound a company worth $10m","rating":100000},{"rating":30000,"tier":"B","option":"Get a job at METR"},{"rating":20000,"tier":"B","option":"A prediction market 16 on a set of UK politics questions with £10k liquidity per question"},{"tier":"B","rating":15000,"option":"A new top-5 metaculus AI geopolitical forecaster"},{"option":"A 5% a month betting strategy on up to 100k for the next year","rating":12000,"tier":"B"},{"rating":8000,"tier":"C","option":"A cloud tool which can be given a document and fact-checks all statements"},{"rating":6000,"option":"A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking","tier":"C"},{"tier":"C","rating":5000,"option":"Tiktok implementing AI-written community notes"},{"option":"Get a job at Perplexity","rating":5000,"tier":"C"},{"option":"10x the total number of AI-written notes on videos on X","tier":"C","rating":4000},{"tier":"C","option":"10x the total AI-written notes on X currently","rating":3000},{"rating":200,"option":"Nathan working somewhere that pays him $200k for a year","tier":"D"},{"tier":"E","option":"$100,000 to your expectation of what Nathan would spend it on","rating":100}],"probabilities":[0.08,0.15,0.12,0.05,0.4,0.25,0.3,0.35,0.45,0.15,0.02,0.25,0.08,0.35,0.4],"comparisons":[{"winner":10,"loser":0},{"winner":10,"loser":5},{"loser":9,"winner":10},{"winner":10,"loser":13},{"winner":12,"loser":6},{"winner":12,"loser":11},{"loser":6,"winner":9},{"winner":9,"loser":13},{"winner":13,"loser":14},{"loser":4,"winner":13},{"loser":6,"winner":8},{"winner":8,"loser":7},{"winner":5,"loser":6},{"winner":5,"loser":7},{"winner":11,"loser":8},{"loser":3,"winner":1},{"loser":3,"winner":0},{"loser":0,"winner":14},{"winner":4,"loser":3}],"timestamp":"2025-11-28T12:58:49.416Z","name":"Claude"},{"enabled":true,"comparisons":[{"loser":1,"winner":0},{"winner":0,"loser":2},{"loser":3,"winner":0},{"winner":0,"loser":4},{"loser":0,"winner":5},{"loser":6,"winner":0},{"winner":0,"loser":7},{"winner":8,"loser":0},{"winner":9,"loser":0},{"loser":0,"winner":10},{"loser":0,"winner":11},{"loser":0,"winner":12},{"loser":13,"winner":0},{"winner":0,"loser":14},{"loser":5,"winner":10},{"winner":1,"loser":3},{"loser":8,"winner":10},{"winner":10,"loser":2},{"winner":10,"loser":4},{"winner":10,"loser":6},{"loser":7,"winner":10},{"loser":13,"winner":10},{"winner":10,"loser":14},{"winner":2,"loser":4},{"loser":7,"winner":6},{"winner":13,"loser":14},{"loser":3,"winner":10},{"loser":9,"winner":10},{"loser":3,"winner":4},{"loser":7,"winner":14},{"winner":10,"loser":11},{"winner":12,"loser":5},{"loser":10,"winner":12},{"loser":6,"winner":1},{"loser":3,"winner":7},{"loser":4,"winner":14},{"loser":9,"winner":8},{"loser":11,"winner":12},{"winner":11,"loser":5},{"loser":1,"winner":2},{"winner":8,"loser":11},{"winner":12,"loser":9},{"loser":4,"winner":12},{"winner":8,"loser":12}],"timestamp":"2025-12-01T16:09:33.509Z","name":"Nathan","tiers":{"0":"C","1":"E","2":"D","3":"F","4":"E","5":"C","6":"E","7":"F","8":"A","9":"B","10":"A","11":"B","12":"A","13":"D","14":"E"},"ranking":[{"rating":152256,"option":"Cofound a company worth $1b","tier":"A"},{"tier":"A","rating":151859,"option":"A 5% a month betting strategy on up to 10m for the next year"},{"rating":147442,"option":"A prediction market 16 on a set of UK politics questions with £10k liquidity per question","tier":"A"},{"rating":10001,"option":"A 5% a month betting strategy on up to 100k for the next year","tier":"B"},{"tier":"B","rating":5869,"option":"Cofound a company worth $10m"},{"rating":2100,"option":"A new top-5 metaculus AI geopolitical forecaster","tier":"C"},{"rating":763,"option":"Tiktok implementing AI-written community notes","tier":"C"},{"rating":189,"option":"10x the total number of AI-written notes on videos on X","tier":"D"},{"option":"Get a job at METR","rating":168,"tier":"D"},{"rating":44,"tier":"E","option":"10x the total AI-written notes on X currently"},{"tier":"E","rating":38,"option":"Get a job at Perplexity"},{"option":"A cloud tool which can be given a document and fact-checks all statements","rating":12,"tier":"E"},{"rating":5,"option":"Nathan working somewhere that pays him $200k for a year","tier":"E"},{"tier":"F","rating":3,"option":"A data-stays-on-computer tool that can be given a document and requests which searches it wants to run before factchecking"},{"tier":"F","rating":1,"option":"$100,000 to your expectation of what Nathan would spend it on"}],"probabilities":[0.19801980198019797,0.39603960396039606,0.601980198019802,0.1659836065573771,0.601980198019802,0.30122950819672134,0.5025140625,0.6,0.3014861995753716,0.09578544061302685,0.025,0.302970297029703,0.19801980198019797,0.1985157699443414,0.1985157699443414]}],"created":"2025-11-28T09:14:19.501Z","id":"0q7orafmiinboj1"};

// Calculate Oli's ranking based on tiers and probabilities
const tierBasePrices = {
    S: 1000000, A: 100000, B: 10000, C: 1000, D: 100, E: 10, F: 1
};

const options = pollData.options;
const ranking = options.map((option, idx) => {
    const tier = oliProgress.tiers[idx] || 'C';
    const rating = Math.round(tierBasePrices[tier]);
    return { option, rating, tier };
}).sort((a, b) => b.rating - a.rating);

const probabilitiesArray = options.map((_, idx) => oliProgress.probabilities[idx] !== undefined ? oliProgress.probabilities[idx] : null);

const oliParticipantData = {
    name: "Oli",
    timestamp: oliProgress.timestamp,
    comparisons: oliProgress.comparisons,
    ranking: ranking,
    tiers: oliProgress.tiers,
    probabilities: probabilitiesArray,
    lowerBounds: oliProgress.lowerBounds,
    upperBounds: oliProgress.upperBounds,
    enabled: true
};

// Add Oli to participants
pollData.participants.push(oliParticipantData);

// Output the updated poll data
console.log('Updated poll data with Oli:');
console.log(JSON.stringify(pollData, null, 2));

console.log('\n\n=== TO SAVE THIS DATA ===');
console.log('Run this in the browser console on the live site:');
console.log(`localStorage.setItem('poll_0q7orafmiinboj1', '${JSON.stringify(pollData).replace(/'/g, "\\'")}');`);
console.log('\nThen refresh the page.');
