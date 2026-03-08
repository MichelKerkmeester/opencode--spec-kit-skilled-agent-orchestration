# Test Fixture: phase-blocked-by-level

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Status** | Active |
| **LOC** | 801 |
| **Files** | 16 |

## Problem Statement

Dual-threshold guard fixture that has a qualifying phase score (30 >= 25)
but is blocked because the overall level is only 2 (total score 68, below
the Level 3 threshold of 70). Verifies the dual-threshold requirement:
phases require BOTH phase_score >= 25 AND recommended_level >= 3.

## Scoring Profile

- Phase score: 30/50 (3 of 5 dimensions triggered -- qualifies on its own)
- Level score: 68/100 (Level 2 - Verification -- blocks phase recommendation)
- Expected: recommended_phases = false, suggested_phase_count = 0

## Dimensions

- Architectural: YES (+10 phase points)
- Many files (>15): YES (+10 phase points, 16 files)
- Large LOC (>800): YES (+10 phase points, 801 LOC)
- Multi-risk (>=2 flags): NO (0 risk flags)
- Extreme scale (>30 files OR >2000 LOC): NO

## Risk Factors

- API changes: NO
- DB changes: NO
- Auth changes: NO

## Why Blocked

No risk factor flags means complexity_score = 20 (architectural only) and
risk_score = 0, giving a total level score of 68 (just under the Level 3
threshold of 70). The phase score of 30 would qualify, but the level gate
prevents recommendation.

## Scope

### In Scope
- Large refactoring effort without cross-domain risk factors
