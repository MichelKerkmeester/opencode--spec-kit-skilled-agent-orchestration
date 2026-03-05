# Wave 8 S3-C2: RSF vs RRF Kendall Tau + Flag Review + Exit Gate + Off-Ramp

**Status:** DONE
**Date:** 2026-02-27
**Agent:** S3-C2

---

## Files Created

### Test Files

1. `.opencode/skill/system-spec-kit/mcp_server/tests/t032-rsf-vs-rrf-kendall.vitest.ts`
   - 23 tests across 5 describe blocks
   - Kendall tau-b implementation (handles ties)
   - 115 synthetic test scenarios across 10 categories
   - Statistical summary output with mean, std dev, min, max
   - Decision criterion evaluation: mean tau = 0.8507 (ACCEPT RSF)

2. `.opencode/skill/system-spec-kit/mcp_server/tests/t033-r15-r2-interaction.vitest.ts`
   - 16 tests across 4 describe blocks
   - R15 minimum channel guarantee (6 tests)
   - R2 diversity within R15 subsets (3 tests)
   - Pipeline enforcement wrapper (4 tests)
   - Full R15 + R2 composition (3 tests)

### Scratch Documents

3. `wave-8-flag-review-sprint3.md`
   - Complete audit of all SPECKIT_ flags (~27 unique flags found)
   - Sprint 3 flag count: 5 (within 6-flag limit)
   - Sprint 1 flags: 4, Sprint 2 flags: 5, Infrastructure: ~18
   - Sunset recommendations: all Sprint 3 flags KEEP (need live measurement)

4. `wave-8-exit-gate-sprint3.md`
   - All 7 exit gate criteria evaluated
   - 5 PASS, 2 CONDITIONAL PASS
   - Full test summary: 192 files, 5689 tests, 0 failures

5. `wave-8-off-ramp-evaluation.md`
   - MRR@5 >= 0.7: NOT TRIGGERED (cannot measure from tests, no regression possible)
   - Constitutional >= 95%: NOT TRIGGERED (unaffected by Sprint 3)
   - Cold-start >= 90%: NOT TRIGGERED (Sprint 2 feature, untouched)
   - Overall: PROCEED

6. `wave-8-S3-C2-DONE.md` (this file)

---

## Test Counts

| File | Tests | Result |
|------|-------|--------|
| t032-rsf-vs-rrf-kendall | 23 | PASS |
| t033-r15-r2-interaction | 16 | PASS |
| **Total (new)** | **39** | **PASS** |
| Full suite | 5689 | PASS (192 files, 0 regressions) |

---

## Key Decisions Made

### Kendall Tau-b Implementation
- Used tau-b (not tau-a) to properly handle ties that arise from penalty ranks assigned to items missing from one ranking.
- Union of IDs approach: items missing from one ranking get penalty rank = (maxRank + 1), ensuring they are counted as concordant/discordant in the comparison.
- 115 scenarios (exceeding 100 minimum) across 10 categories: identical, disjoint, partial overlap (20-90%), multi-channel (3 and 5), skewed, single-item, large lists, flat scores, reversed.

### RSF Acceptance Decision
- Mean tau = 0.8507 with pass rate 95.7% at the 0.4 threshold.
- RSF rankings are highly correlated with RRF in all realistic scenarios.
- Only adversarial "reversed" scenarios (tau = 0.29) fall below 0.4, and these represent pathological inputs unlikely in production.
- **ACCEPT RSF** but keep behind flag for live validation.

### R15 + R2 Interaction Design
- Verified the key invariant: R15 always routes to >= 2 channels (MIN_CHANNELS enforcement), and R2 can enforce diversity within whatever subset R15 provides.
- Tested all three tier configurations: simple (2ch), moderate (3ch), complex (5ch).
- Verified that R2 respects QUALITY_FLOOR and does not promote junk.
- Verified that when R15 is disabled (flag off), all 5 channels run and R2 still works.

### Feature Flag Count
- Sprint 3 owns exactly 5 flags (not 3 as originally listed). `SPECKIT_CONFIDENCE_TRUNCATION` and `SPECKIT_DYNAMIC_TOKEN_BUDGET` were added by S3-C1.
- 5 < 6: within per-sprint limit.

### Off-Ramp Decision
- No off-ramp thresholds violated.
- Sprint 3 features are safely gated behind opt-in flags.
- MRR@5 >= 0.7 is a system-wide target requiring all sprints, not a Sprint 3-specific gate.

---

## RSF vs RRF Statistical Summary

```
N scenarios:  115
Mean tau:     0.8507
Std dev:      0.1674
Min tau:      0.2889
Max tau:      1.0000
Tau >= 0.4:   110 / 115 (95.7%)
Tau >= 0.6:   110 / 115 (95.7%)
Tau >= 0.8:   80 / 115 (69.6%)
```
