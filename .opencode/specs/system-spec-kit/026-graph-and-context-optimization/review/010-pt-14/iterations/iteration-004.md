# Iteration 004: Maintainability on Preference Order

## Focus
Reviewed the helper preference order and the preservation of the 16-entity cap after deduplication.

## Findings

### P0

### P1

### P2

## Ruled Out
- Helper complexity outweighing the fix: the collision policy stayed small and the `slice(0, 16)` cap remains intact.

## Dead Ends
- Maintainability concerns needed a corpus pass to show whether any edge case remained.

## Recommended Next Focus
Run the active-corpus duplicate scan and then verify the trigger cap.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: maintainability
- Novelty justification: The helper remains compact, but the live corpus still needed verification.
