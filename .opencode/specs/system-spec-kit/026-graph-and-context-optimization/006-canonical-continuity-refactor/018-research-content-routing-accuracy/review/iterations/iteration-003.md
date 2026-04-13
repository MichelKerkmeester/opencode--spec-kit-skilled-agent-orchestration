# Iteration 3: Tier-3 cache, fallback, refusal, and merge-mode end-to-end

## Focus
Reviewed the live router for cache scope, fallback penalties, refusal behavior, and merge-mode handling. Paired the code with the focused router tests and the anchor merge helper to confirm the requested Tier-3 end-to-end lane still behaves coherently after the opt-in flag removal.

## Findings

### P0

### P1

### P2

## Ruled Out
- Tier-3 cache reuse disappeared after the flag-removal wave.
- The router no longer refuses low-confidence content safely or loses the expected merge-mode contract.

## Dead Ends
- None.

## Recommended Next Focus
Compare the Tier-3 prompt contract and live config notes so the following doc audit starts from the current runtime truth instead of packet-local assumptions.

## Assessment
- New findings ratio: 0.00
- Dimensions addressed: correctness, maintainability
- Novelty justification: The end-to-end runtime path stayed aligned and produced no new findings beyond the already-open metadata host issue.
