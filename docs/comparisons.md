Terms:
- There is a list of options
- We are trying to figure out the conversion rates between them in some common currency
- The user sets oom tiers
- Then they do pairwise comparisons
- The "price multiple" is figured out by the Terry-bradley algorithm
- The uncertainty shows which pair to compare next
- At any point the user can move an entry to a different tier which resets the "price mutliple" to that tier 

For each comparison: a) Select a pair - getNextAdaptiveComparison() picks the most informative pair based on:

First time: pairs with high combined uncertainty
Recompare mode: pairs where at least one item is above median uncertainty
If none are, then just a random pair

b) Calculate optimal multiplier - calculateOptimalMultiplier(idx1, idx2):
Gets estimated log values for both items (from bounds if available, else from tier)
If they're >0.5 log units apart (different OOMs), apply multiplier to smaller one
Multiplier chosen to bring them into same OOM (nearest power of 10)
Example: 40× vs 800× → apply 10× to get "10× 40 vs 800" = "400 vs 800"

c) User makes choice - clicks option 1 or option 2 d) Update bounds - updateBoundsFromComparison(winner, loser, multiplier):
Uses the multiplier info to constrain bounds
Example: if "10× A > B", then A > 0.1× B
Narrows the log-space bounds for both items

e) Record comparison - comparisons.push({ winner, loser })
Stores the raw winner/loser (NOT the multiplier!)
THIS MIGHT BE THE BUG - we're not storing multiplier info!
Nathan: surely the multiplier is the terry-bradly price


3. Display Tier Screen
When you go back to tier screen or finish comparisons: a) Calculate prices - computeBradleyTerryPrices():
Starts with tier base prices 
Runs Bradley-Terry algorithm on the comparisons
Problem: comparisons only have {winner, loser}, no multiplier info!
So "10× A > B" is treated the same as "A > B"
Iteratively adjusts prices based on win/loss records
Returns refined prices
Should it rerun comparisons or lock all the multiples except the ones that moves? 


b) Calculate multipliers for display:
multiplier = price / baselinePrice
Shows in parentheses like "(3000×)"
4. The Problem
I think the issue is: We're not storing the multiplier in the comparisons array! When we do "10× A > B", we store {winner: A, loser: B}, but Bradley-Terry doesn't know about the 10× multiplier. So it treats it as if A and B are comparable, which they're not.

Yes this does seem like an issue.

hat should happen:
Store multiplier info: {winner: A, loser: B, multiplier: 10, multipliedIndex: A}
Bradley-Terry should interpret this as: "10× A > B" means "A's strength is at least B/10"
Is this the issue you're seeing? The comparisons with multipliers aren't being properly interpreted by Bradley-Terry?