# Complete Pairwise Comparison Ranking Algorithm

## Overview
This algorithm estimates relative values (conversion rates) between options using pairwise comparisons with intelligent multipliers to handle items spanning multiple orders of magnitude.

## Key Concepts

### Terms
- **Options**: List of items to be ranked (e.g., "3000", "8489", "550")
- **Price**: Estimated value of an option in arbitrary units (Bradley-Terry output)
- **Multiplier**: Display-time scaling factor (1×, 10×, 100×, etc.) used in comparisons
- **Tier**: Order-of-magnitude bucket (S=1000×, A=100×, B=10×, C=1×, D=0.1×, E=0.01×, F=0.001×)
- **Bounds**: Log-space constraints on each item's value [lowerBound, upperBound]
- **Uncertainty**: How uncertain we are about an item's value (multiplicative factor)

---

## Algorithm Steps

### Phase 1: Initial Setup

#### 1.1 User Input
```
User provides N options (text labels)
Example: ["3000", "8489", "550", "783", "45", "83", "20"]
```

#### 1.2 Tier Assignment
```
User drags each option into a tier (S, A, B, C, D, E, F)
Each tier maps to an initial "base price":
  S → 1,000,000  (1000× baseline)
  A →   100,000  (100× baseline)
  B →    10,000  (10× baseline)
  C →     1,000  (1× baseline = reference point)
  D →       100  (0.1× baseline)
  E →        10  (0.01× baseline)
  F →         1  (0.001× baseline)

Initialize prices array: prices[i] = tierBasePrices[tier[i]]
Initialize bounds: lowerBounds[i] = log10(prices[i]), upperBounds[i] = log10(prices[i])
```

---

### Phase 2: Pairwise Comparisons Loop

For each comparison:

#### 2.1 Select Next Pair
```javascript
function getNextAdaptiveComparison(allowRecompare):
  Calculate current uncertainties from Bradley-Terry or bounds

  if allowRecompare:
    // Focus on high-uncertainty items
    Calculate median log-uncertainty
    Only consider pairs where at least one item > median
    Score pairs by: max(uncertainty_i, uncertainty_j)
  else:
    // First-time comparisons
    Skip pairs already compared
    Score pairs by: (uncertainty_i + uncertainty_j) / 2 × (1 + informativeness × 5)
    where informativeness = p(1-p), p = price_i / (price_i + price_j)

  Return pair [idx1, idx2] with highest score
```

#### 2.2 Calculate Optimal Multiplier
```javascript
function calculateOptimalMultiplier(idx1, idx2):
  // Get estimated log values
  avgLog1 = (lowerBounds[idx1] + upperBounds[idx1]) / 2  // or tier-based if no bounds
  avgLog2 = (lowerBounds[idx2] + upperBounds[idx2]) / 2

  logRatioDiff = |avgLog1 - avgLog2|

  if logRatioDiff < 0.5:
    // Same order of magnitude - no multiplier needed
    return { multiplier: 1, multipliedIndex: null }

  // Determine which to multiply (the smaller one)
  smallerIndex = avgLog1 < avgLog2 ? idx1 : idx2
  idealMultiplierLog = |avgLog2 - avgLog1|

  // Find nearest power of 10
  options = [0.001, 0.01, 0.1, 1, 10, 100, 1000]
  optionLogs = [-3, -2, -1, 0, 1, 2, 3]

  multiplier = argmin over options: |log(option) - idealMultiplierLog|

  return { multiplier, multipliedIndex: smallerIndex }
```

**Example:**
- Comparing options at 40× vs 800×
- avgLog1 ≈ 1.6, avgLog2 ≈ 2.9
- logRatioDiff = 1.3
- Nearest power of 10: 10
- Display: "10× 40 vs 800" (effectively "400 vs 800")

#### 2.3 Display Comparison
```
if multiplier != 1:
  if multipliedIndex == idx1:
    Show: "multiplier× option[idx1]" vs "option[idx2]"
  else:
    Show: "option[idx1]" vs "multiplier× option[idx2]"
else:
  Show: "option[idx1]" vs "option[idx2]"
```

#### 2.4 User Makes Choice
```
User clicks option 1 or option 2
winner = user's choice
loser = other option
```

#### 2.5 Update Bounds
```javascript
function updateBoundsFromComparison(winner, loser, multiplier):
  // This function interprets: winner > multiplier × loser
  // In log space: log(winner) > log(multiplier) + log(loser)

  logMultiplier = log10(multiplier)

  // Update lower bound for winner
  lowerBounds[winner] = max(
    lowerBounds[winner],
    lowerBounds[loser] + logMultiplier
  )

  // Update upper bound for loser
  upperBounds[loser] = min(
    upperBounds[loser],
    upperBounds[winner] - logMultiplier
  )

  // Ensure bounds remain valid
  lowerBounds[winner] = min(lowerBounds[winner], upperBounds[winner])
  upperBounds[loser] = max(lowerBounds[loser], upperBounds[loser])
```

**Example:**
- User sees "10× 40 vs 800", picks "800"
- This means: 800 > 10× 40, or 800 > 400
- updateBoundsFromComparison(winner=800_idx, loser=40_idx, multiplier=10)
- lowerBounds[800_idx] = max(old, lowerBounds[40_idx] + log10(10))
- upperBounds[40_idx] = min(old, upperBounds[800_idx] - log10(10))

#### 2.6 Record Comparison
```javascript
comparisonData = {
  winner: winner_idx,
  loser: loser_idx
}

if multiplier != 1:
  comparisonData.multiplier = multiplier
  comparisonData.multipliedIndex = multipliedIndex

comparisons.push(comparisonData)
```

#### 2.7 Stopping Condition
```javascript
function shouldStopComparisons():
  Calculate current uncertainties
  maxUncertainty = max(uncertainties)

  if maxUncertainty < 1.5:  // All items well-constrained
    return true
  return false

if shouldStopComparisons() and not allowRecompareMode:
  Show "Comparisons Complete!" with "More Comparisons" button
else:
  Continue to next comparison
```

---

### Phase 3: Bradley-Terry Price Calculation

Called after each comparison to update estimated prices.

```javascript
function computeBradleyTerryPrices(initialPrices, comparisons, tiers, manualTiers):
  n = number of options
  prices = copy of initialPrices  // Start from tier-based prices

  maxIterations = 20
  learningRate = 0.3

  // Iterative refinement
  for iter in 1..maxIterations:
    adjustments = [1.0, 1.0, ..., 1.0]  // n elements

    for each comparison in comparisons:
      winner = comparison.winner
      loser = comparison.loser
      multiplier = comparison.multiplier || 1
      multipliedIndex = comparison.multipliedIndex

      // Calculate effective prices accounting for multiplier
      effectiveWinnerPrice = prices[winner]
      effectiveLoserPrice = prices[loser]

      if multiplier != 1 and multipliedIndex is defined:
        if multipliedIndex == winner:
          // Comparison was "m× winner > loser"
          effectiveWinnerPrice = multiplier × prices[winner]
        else:
          // Comparison was "winner > m× loser"
          effectiveLoserPrice = multiplier × prices[loser]

      // Bradley-Terry win probability
      pWin = effectiveWinnerPrice / (effectiveWinnerPrice + effectiveLoserPrice)

      // Update rule: winner should win with probability 1.0
      residual = 1.0 - pWin

      adjustments[winner] *= (1 + learningRate × residual)
      adjustments[loser] *= (1 - learningRate × residual)

    // Apply adjustments
    for i in 0..n-1:
      prices[i] *= adjustments[i]
      prices[i] = clamp(prices[i], 0.5, 2000000)  // Keep reasonable

  // Calculate uncertainties using Fisher Information
  uncertainties = [0, 0, ..., 0]

  for i in 0..n-1:
    fisherInfo = 0

    for each comparison in comparisons:
      if winner == i or loser == i:
        opponent = (winner == i) ? loser : winner

        // Account for multiplier
        effectivePriceI = prices[i]
        effectivePriceOpponent = prices[opponent]

        if multiplier != 1 and multipliedIndex is defined:
          if multipliedIndex == i:
            effectivePriceI = multiplier × prices[i]
          else if multipliedIndex == opponent:
            effectivePriceOpponent = multiplier × prices[opponent]

        pWin = effectivePriceI / (effectivePriceI + effectivePriceOpponent)
        fisherInfo += pWin × (1 - pWin)

    if fisherInfo > 0:
      logStdDev = sqrt(1 / fisherInfo)
      uncertainties[i] = exp(logStdDev)  // Multiplicative uncertainty
    else:
      uncertainties[i] = Infinity  // Never compared

  // Update tier assignments based on prices (auto-assign only)
  for i in 0..n-1:
    if i not in manualTiers:
      // Auto-assign tier from price
      if prices[i] >= 450000: tiers[i] = 'S'
      else if prices[i] >= 45000: tiers[i] = 'A'
      else if prices[i] >= 4500: tiers[i] = 'B'
      else if prices[i] >= 450: tiers[i] = 'C'
      else if prices[i] >= 45: tiers[i] = 'D'
      else if prices[i] >= 4.5: tiers[i] = 'E'
      else: tiers[i] = 'F'
    // else: keep manual tier, keep Bradley-Terry price

  return { prices, tiers, uncertainties }
```

**Key Points:**
- Multipliers affect the win probability calculation
- "10× A > B" means we compare (10 × price_A) vs price_B
- Bradley-Terry converges to estimates that make observed outcomes most likely
- Uncertainties decrease as more comparisons involving an item are made

---

### Phase 4: Display Results

#### 4.1 Calculate Display Multipliers
```javascript
// Find baseline (average of C tier items, or 1000 if none)
cTierItems = items where tier == 'C'
baselinePrice = cTierItems.isEmpty() ? 1000 : average(prices[cTierItems])

for each option i:
  displayMultiplier = prices[i] / baselinePrice

  // Format for display
  if displayMultiplier >= 10:
    show "option (${round(displayMultiplier)}×)"
  else if displayMultiplier >= 2:
    show "option (${displayMultiplier.toFixed(1)}×)"
  else if displayMultiplier >= 0.1:
    show "option (${displayMultiplier.toFixed(2)}×)"
  else:
    show "option (1/${round(1/displayMultiplier)})"
```

**Example Output:**
```
S Tier (1000×):
  3000 (3247×) ✓
  8489 (8521×) ✓

A Tier (100×):
  550 (562×) ✓
  783 (771×) ✓

B Tier (10×):
  45 (47×) ✓
  83 (81×) ✓
  20 (22×) ~
```

#### 4.2 Confidence Indicators
```
✓ = High confidence (5+ comparisons involving this item)
~ = Medium confidence (3-4 comparisons)
! = Low confidence (1-2 comparisons)
? = No comparisons yet
```

---

## Mathematical Foundation

### Bradley-Terry Model
The Bradley-Terry model assumes the probability that item i beats item j is:

```
P(i beats j) = price_i / (price_i + price_j)
```

With multipliers, if the comparison is "m× i beats j":

```
P(m×i beats j) = (m × price_i) / (m × price_i + price_j)
```

### Log-Space Bounds
Working in log10 space allows us to handle wide ranges efficiently:

```
log_value ∈ [lowerBound, upperBound]
actual_value ∈ [10^lowerBound, 10^upperBound]
uncertainty_ratio = 10^(upperBound - lowerBound)
```

### Fisher Information
Uncertainty is estimated using Fisher Information:

```
I(price_i) = Σ p_i(1 - p_i) over all comparisons involving i
Var(log(price_i)) ≈ 1 / I(price_i)
multiplicative_uncertainty = exp(sqrt(1 / I(price_i)))
```

---

## User Interactions

### Manual Tier Override
If user drags an item to a different tier:
- `manualTiers[i] = new_tier`
- Bradley-Terry still refines the price within that tier
- The tier label is locked, but the multiplier shows refined value
- Example: Item locked to A tier might show "(142×)" not just "(100×)"

### Continue Comparisons
After "Comparisons Complete!":
- Click "More Comparisons" → `allowRecompareMode = true`
- System focuses on pairs with highest remaining uncertainty
- Median recalculates each comparison to adapt dynamically
- Bounds continue to narrow with each new comparison

### Resume Session
If user returns later:
- Load from localStorage: `comparisons`, `tiers`, `lowerBounds`, `upperBounds`
- Re-run Bradley-Terry to restore prices
- Continue from where they left off

---

## Edge Cases

### No C Tier Items
Use baselinePrice = 1000 as fallback

### All Items Same OOM
Multiplier = 1 for all comparisons (regular pairwise)

### Contradictory Comparisons
Bradley-Terry finds "best fit" prices that minimize prediction error

### Insufficient Comparisons
Items show high uncertainty (large bounds, low confidence)

---

## Performance Characteristics

- **Comparisons needed**: O(n log n) to O(n²) depending on desired confidence
- **Bradley-Terry iterations**: 20 iterations per update, converges quickly
- **Bounds updates**: O(1) per comparison
- **Pair selection**: O(n²) to evaluate all pairs (can be optimized)

---

## Summary

This algorithm combines:
1. **Tier-based initialization** for rough OOM estimates
2. **Smart multipliers** to make all comparisons informative
3. **Bounds tracking** for local constraint propagation
4. **Bradley-Terry** for global consistency and final estimates
5. **Adaptive pair selection** to focus on uncertain items

The result: Efficient, accurate ranking across multiple orders of magnitude using intuitive pairwise comparisons.
