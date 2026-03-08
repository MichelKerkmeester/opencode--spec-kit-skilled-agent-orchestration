# Test Fixture: phase-maximum

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Status** | Active |
| **LOC** | 2500 |
| **Files** | 35 |

## Problem Statement

Maximum-complexity fixture that triggers all 5 phase scoring dimensions,
achieving the maximum possible phase score of 50. Verifies that 4+ phases
are suggested at the highest scoring tier (score >= 45).

## Scoring Profile

- Phase score: 50/50 (all 5 dimensions triggered)
- Level score: 100/100 (Level 3 - Full)
- Expected: recommended_phases = true, suggested_phase_count = 4

## Dimensions

- Architectural: YES (+10 phase points)
- Many files (>15): YES (+10 phase points, 35 files)
- Large LOC (>800): YES (+10 phase points, 2500 LOC)
- Multi-risk (>=2 flags): YES (+10 phase points, Auth + API + DB)
- Extreme scale (>30 files OR >2000 LOC): YES (+10 phase points, both thresholds exceeded)

## Risk Factors

- API changes: YES
- DB changes: YES
- Auth changes: YES

## Scope

### In Scope
- Enterprise-scale platform migration with full-stack changes
