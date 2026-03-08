# Test Fixture: phase-high

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Active |
| **LOC** | 900 |
| **Files** | 20 |

## Problem Statement

High-complexity fixture that triggers 4 of 5 phase scoring dimensions.
Phase score of 40 falls in the 35-44 range, which maps to 3 suggested phases.
Verifies correct mid-range phase count recommendation.

## Scoring Profile

- Phase score: 40/50 (4 of 5 dimensions triggered)
- Level score: 85/100 (Level 3 - Full)
- Expected: recommended_phases = true, suggested_phase_count = 3

## Dimensions

- Architectural: YES (+10 phase points)
- Many files (>15): YES (+10 phase points, 20 files)
- Large LOC (>800): YES (+10 phase points, 900 LOC)
- Multi-risk (>=2 flags): YES (+10 phase points, API + DB)
- Extreme scale (>30 files OR >2000 LOC): NO (20 files, 900 LOC)

## Risk Factors

- API changes: YES
- DB changes: YES
- Auth changes: NO

## Scope

### In Scope
- Large-scale architectural refactor with API and database changes
