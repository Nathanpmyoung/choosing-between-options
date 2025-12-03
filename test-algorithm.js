#!/usr/bin/env node
// Test script to validate the Bradley-Terry algorithm with multipliers

// Helper: Calculate OOM tier from a value
function getTierFromValue(value) {
    if (value >= 3162) return 'S';       // sqrt(10000 * 1000) ≈ 3162
    if (value >= 316) return 'A';        // sqrt(1000 * 100) ≈ 316
    if (value >= 31.6) return 'B';       // sqrt(100 * 10) ≈ 31.6
    if (value >= 3.16) return 'C';       // sqrt(10 * 1) ≈ 3.16
    if (value >= 0.316) return 'D';      // sqrt(1 * 0.1) ≈ 0.316
    if (value >= 0.0316) return 'E';     // sqrt(0.1 * 0.01) ≈ 0.0316
    return 'F';
}

// Helper: Get tier base price
function getTierBasePrice(tier) {
    const tierBasePrices = {
        S: 1000000, A: 100000, B: 10000, C: 1000, D: 100, E: 10, F: 1
    };
    return tierBasePrices[tier];
}

// Helper: Calculate optimal multiplier between two values
function calculateOptimalMultiplier(val1, val2) {
    const log1 = Math.log10(val1);
    const log2 = Math.log10(val2);
    const logRatioDiff = Math.abs(log1 - log2);

    if (logRatioDiff < 0.5) {
        return { multiplier: 1, multipliedIndex: null };
    }

    const smallerIndex = log1 < log2 ? 0 : 1;
    const idealMultiplierLog = Math.abs(log2 - log1);

    const multiplierOptions = [0.001, 0.01, 0.1, 1, 10, 100, 1000];
    const multiplierLogs = [-3, -2, -1, 0, 1, 2, 3];

    let multiplier = 1;
    let minDistance = Infinity;
    for (let i = 0; i < multiplierOptions.length; i++) {
        const distance = Math.abs(multiplierLogs[i] - idealMultiplierLog);
        if (distance < minDistance) {
            minDistance = distance;
            multiplier = multiplierOptions[i];
        }
    }

    return { multiplier, multipliedIndex: smallerIndex };
}

// Bradley-Terry algorithm with multipliers
function computeBradleyTerryPrices(initialPrices, comparisons) {
    const n = initialPrices.length;
    let prices = [...initialPrices];

    const maxIterations = 20;
    const learningRate = 0.3;

    for (let iter = 0; iter < maxIterations; iter++) {
        const adjustments = new Array(n).fill(1.0);

        comparisons.forEach((comparison) => {
            const { winner, loser, multiplier, multipliedIndex } = comparison;

            let effectiveWinnerPrice = prices[winner];
            let effectiveLoserPrice = prices[loser];

            if (multiplier && multiplier !== 1 && multipliedIndex !== undefined) {
                if (multipliedIndex === winner) {
                    effectiveWinnerPrice = multiplier * prices[winner];
                } else {
                    effectiveLoserPrice = multiplier * prices[loser];
                }
            }

            const pWin = effectiveWinnerPrice / (effectiveWinnerPrice + effectiveLoserPrice);
            const residual = 1.0 - pWin;

            adjustments[winner] *= (1 + learningRate * residual);
            adjustments[loser] *= (1 - learningRate * residual);
        });

        for (let i = 0; i < n; i++) {
            prices[i] *= adjustments[i];
            prices[i] = Math.max(0.5, Math.min(2000000, prices[i]));
        }
    }

    return prices;
}

// Main test
function runTest() {
    console.log('=== Bradley-Terry Algorithm Test ===');
    console.log(`Seed: ${Date.now()}\n`);

    // Use numbers 1 to 5
    const trueValues = [1, 2, 3, 4, 5];

    // Sort for easier reading
    console.log('UNSORTED TRUE VALUES:');
    trueValues.forEach((val, idx) => {
        console.log(`  Option ${idx}: ${val}`);
    });

    console.log('TRUE VALUES:');
    trueValues.forEach((val, idx) => {
        const tier = getTierFromValue(val);
        console.log(`  Option ${idx}: ${val.toFixed(2)} (Tier ${tier})`);
    });

    // Initialize prices based on OOM tiers
    const initialPrices = trueValues.map(val => {
        const tier = getTierFromValue(val);
        return getTierBasePrice(tier);
    });

    console.log('\nINITIAL PRICES (from tiers):');
    initialPrices.forEach((price, idx) => {
        console.log(`  Option ${idx}: ${price} (${(price/1000).toFixed(0)}×)`);
    });

    // Simulate comparisons - compare every pair once
    const comparisons = [];
    const n = trueValues.length;

    console.log(`\n=== RUNNING ALL PAIRWISE COMPARISONS (${n*(n-1)/2} pairs) ===\n`);

    let compNum = 0;
    for (let idx1 = 0; idx1 < n; idx1++) {
        for (let idx2 = idx1 + 1; idx2 < n; idx2++) {
            compNum++;

        const val1 = trueValues[idx1];
        const val2 = trueValues[idx2];

        // Calculate optimal multiplier
        const { multiplier, multipliedIndex } = calculateOptimalMultiplier(val1, val2);

        // Determine winner based on TRUE values (not multiplied values)
        // The multiplier is ONLY for display purposes to help visualize the comparison
        const winner = val1 > val2 ? idx1 : idx2;
        const loser = winner === idx1 ? idx2 : idx1;

        // For display purposes, calculate effective values
        let effectiveVal1 = val1;
        let effectiveVal2 = val2;

        if (multiplier !== 1 && multipliedIndex !== null) {
            if (multipliedIndex === 0) {
                effectiveVal1 = multiplier * val1;
            } else {
                effectiveVal2 = multiplier * val2;
            }
        }

        // Store comparison
        const comparisonData = { winner, loser };
        if (multiplier !== 1 && multipliedIndex !== null) {
            comparisonData.multiplier = multiplier;
            comparisonData.multipliedIndex = multipliedIndex === 0 ? idx1 : idx2;
        }
        comparisons.push(comparisonData);

        // Display
        let displayStr = '';
        if (multiplier !== 1) {
            if (multipliedIndex === 0) {
                displayStr = `${multiplier}× ${val1.toFixed(2)} vs ${val2.toFixed(2)} → ${effectiveVal1.toFixed(2)} vs ${effectiveVal2.toFixed(2)}`;
            } else {
                displayStr = `${val1.toFixed(2)} vs ${multiplier}× ${val2.toFixed(2)} → ${effectiveVal1.toFixed(2)} vs ${effectiveVal2.toFixed(2)}`;
            }
        } else {
            displayStr = `${val1.toFixed(2)} vs ${val2.toFixed(2)}`;
        }

        console.log(`Comparison ${compNum}: Option ${idx1} vs Option ${idx2}`);
        console.log(`  ${displayStr}`);
        console.log(`  Winner: Option ${winner}\n`);
        }
    }

    // Run Bradley-Terry
    console.log('=== BRADLEY-TERRY RESULTS ===\n');
    const finalPrices = computeBradleyTerryPrices(initialPrices, comparisons);

    // Calculate baseline - use the median value for normalization
    const sortedTrueValues = [...trueValues].sort((a, b) => a - b);
    const trueBaseline = sortedTrueValues[Math.floor(n / 2)];

    const sortedPrices = [...finalPrices].sort((a, b) => a - b);
    const estimatedBaseline = sortedPrices[Math.floor(n / 2)];

    console.log(`TRUE BASELINE (median): ${trueBaseline.toFixed(2)}`);
    console.log(`ESTIMATED BASELINE (median): ${estimatedBaseline.toFixed(2)}\n`);

    // Display results
    console.log('ESTIMATED vs TRUE MULTIPLIERS (relative to median):\n');
    console.log('Option | True Value | True Multiple | Estimated Price | Est Multiple | Multiple Error');
    console.log('-------|------------|---------------|-----------------|--------------|---------------');

    let totalLogError = 0;
    let maxLogError = 0;

    for (let i = 0; i < n; i++) {
        const trueVal = trueValues[i];
        const trueTier = getTierFromValue(trueVal);
        const trueMultiple = trueVal / trueBaseline;

        const estimatedPrice = finalPrices[i];
        const estimatedMultiple = estimatedPrice / estimatedBaseline;

        const multipleError = estimatedMultiple / trueMultiple;
        const logError = Math.abs(Math.log10(multipleError));
        totalLogError += logError;
        maxLogError = Math.max(maxLogError, logError);

        console.log(
            `   ${i}   | ${trueVal.toFixed(2).padEnd(10)} | ${trueMultiple.toFixed(3)}×`.padEnd(26) + ` | ` +
            `${estimatedPrice.toFixed(2).padEnd(15)} | ${estimatedMultiple.toFixed(3)}×`.padEnd(13) + ` | ` +
            `${multipleError.toFixed(3)}×`
        );
    }

    const avgLogError = totalLogError / n;

    console.log('\n=== ERROR ANALYSIS ===\n');
    console.log(`Average Log Error: ${avgLogError.toFixed(3)} (10^${avgLogError.toFixed(3)} ≈ ${Math.pow(10, avgLogError).toFixed(2)}× off)`);
    console.log(`Max Log Error: ${maxLogError.toFixed(3)} (10^${maxLogError.toFixed(3)} ≈ ${Math.pow(10, maxLogError).toFixed(2)}× off)`);

    // Rank correlation
    const trueRanking = trueValues.map((val, idx) => ({ idx, val })).sort((a, b) => b.val - a.val);
    const estimatedRanking = finalPrices.map((price, idx) => ({ idx, price })).sort((a, b) => b.price - a.price);

    let rankErrors = 0;
    for (let i = 0; i < n; i++) {
        const trueRank = trueRanking.findIndex(item => item.idx === i);
        const estRank = estimatedRanking.findIndex(item => item.idx === i);
        rankErrors += Math.abs(trueRank - estRank);
    }

    console.log(`Ranking Error: ${rankErrors} position differences (0 = perfect)`);

    console.log('\nTRUE RANKING:');
    trueRanking.forEach((item, rank) => {
        console.log(`  ${rank + 1}. Option ${item.idx}: ${item.val.toFixed(2)}`);
    });

    console.log('\nESTIMATED RANKING:');
    estimatedRanking.forEach((item, rank) => {
        console.log(`  ${rank + 1}. Option ${item.idx}: ${item.price.toFixed(2)}`);
    });

    console.log('\n=== EXAMPLE CONVERSION RATES ===\n');
    console.log('How many of Option B do you need to equal Option A?\n');

    // Show a few example conversions
    const examples = [
        [4, 0], // Highest vs lowest
        [4, 2], // High vs middle
        [2, 1], // Middle vs low
    ];

    examples.forEach(([idxA, idxB]) => {
        const trueRatio = trueValues[idxA] / trueValues[idxB];
        const estimatedRatio = finalPrices[idxA] / finalPrices[idxB];

        console.log(`Option ${idxA} (${trueValues[idxA].toFixed(0)}) vs Option ${idxB} (${trueValues[idxB].toFixed(0)}):`);
        console.log(`  TRUE: 1 Option ${idxA} = ${trueRatio.toFixed(2)} Option ${idxB}`);
        console.log(`  ESTIMATED: 1 Option ${idxA} = ${estimatedRatio.toFixed(2)} Option ${idxB}`);
        console.log(`  Error: ${(estimatedRatio / trueRatio).toFixed(2)}×\n`);
    });
}

// Run the test
runTest();
