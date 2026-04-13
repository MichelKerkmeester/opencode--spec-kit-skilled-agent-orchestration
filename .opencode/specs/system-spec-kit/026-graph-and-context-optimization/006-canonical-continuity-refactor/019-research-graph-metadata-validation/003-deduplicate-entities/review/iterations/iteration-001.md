# Iteration 001: Shared Helper Correctness Sweep

## Focus
Reviewed the shared helper inside `deriveEntities()` and verified both write sites now use the same collision path.

## Findings

### P0

### P1

### P2

## Ruled Out
- Split write-site regression: both the key-file seeding path and the extracted-entity path now flow through one helper.

## Dead Ends
- Static review alone could not confirm the corpus-wide duplicate count.

## Recommended Next Focus
Check the security angle, then line up the packet claims with the focused tests.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness
- Novelty justification: The first pass confirmed the helper structure without surfacing a new defect.
