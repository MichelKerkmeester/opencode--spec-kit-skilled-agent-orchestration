# Test Fixture: phase-minimum

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Active |
| **LOC** | 500 |
| **Files** | 16 |

## Problem Statement

Minimum-threshold fixture that just crosses the phase recommendation boundary.
Phase score of 30 (the lowest achievable score >= 25 threshold, since dimensions
are each 10 points) combined with Level 3 (total score 80) satisfies the dual
threshold requirement. Verifies that 2 phases are suggested at the minimum
qualifying score range (25-34).

## Scoring Profile

- Phase score: 30/50 (3 of 5 dimensions triggered)
- Level score: 80/100 (Level 3 - Full)
- Expected: recommended_phases = true, suggested_phase_count = 2

## Dimensions

- Architectural: YES (+10 phase points)
- Many files (>15): YES (+10 phase points, 16 files)
- Large LOC (>800): NO (500 LOC)
- Multi-risk (>=2 flags): YES (+10 phase points, API + DB)
- Extreme scale (>30 files OR >2000 LOC): NO

## Risk Factors

- API changes: YES
- DB changes: YES
- Auth changes: NO

## Scope

### In Scope
- Cross-system API and database integration
