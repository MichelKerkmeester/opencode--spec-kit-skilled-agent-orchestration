# Agent 3: Functional Correctness — Phase Scoring Algorithm

**Reviewed file:** `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh`
**Reference documents:**
- `.opencode/specs/02--system-spec-kit/021-spec-kit-phase-system/spec.md` (REQ-001)
- `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` (scoring dimensions)

**Date:** 2026-03-08
**Reviewer model:** claude-opus-4-6

---

## Summary

| Check | Result | Severity |
|-------|--------|----------|
| 1. 5-dimension scoring | MISMATCH | P1 |
| 2. Phase count mapping | PASS | -- |
| 3. Dual threshold | PASS | -- |
| 4. CLI flags | PASS | -- |
| 5. JSON output | PASS | -- |
| 6. Max score cap | PASS | -- |
| 7. Scoring dimension mismatch (Architectural) | MISMATCH | P1 |

**Overall result:** 2 mismatches found between the script implementation and `phase_definitions.md`. Both relate to the same root cause: the script uses a different point allocation scheme than the reference document specifies.

---

## Check 1: 5-Dimension Scoring

**Result: MISMATCH**

The script and `phase_definitions.md` agree on using exactly 5 dimensions and a max score of 50. However, the point values diverge on 3 of 5 dimensions.

### Script values (recommend-level.sh, lines 85-89):

| Dimension | Points | Condition |
|-----------|--------|-----------|
| Architectural | **+15** | `HAS_ARCHITECTURAL = true` (line 85, 366-368) |
| File count | +10 | `FILES > 15` (line 86, 372-373) |
| Lines of code | +10 | `LOC > 800` (line 87, 382-383) |
| Multi-domain risk | +10 | `risk_flag_count >= 2` (line 88, 396-397) |
| Extreme scale | **+5** | `FILES > 30 OR LOC > 2000` (line 89, 415-416) |

**Script max:** 15 + 10 + 10 + 10 + 5 = **50** (matches declared PHASE_MAX_SCORE)

### phase_definitions.md values (Section 2, lines 39-46):

| Dimension | Points | Condition |
|-----------|--------|-----------|
| Architectural complexity | **10** | Multiple systems, cross-cutting concerns |
| File count | 10 | Estimated files > 15 |
| Lines of code | 10 | Estimated LOC > 800 |
| Risk level | 10 | Risk score >= 2 |
| Extreme scale | **10** | Exceeds any single dimension by 2x or more |

**Reference max:** 10 + 10 + 10 + 10 + 10 = **50**

### Discrepancies:

| Dimension | Script | Reference | Delta |
|-----------|--------|-----------|-------|
| Architectural | **15** | **10** | +5 in script |
| Extreme scale | **5** | **10** | -5 in script |
| Extreme scale condition | `FILES > 30 OR LOC > 2000` | `Exceeds any single dimension by 2x or more` | Different logic |

The script redistributes 5 points from Extreme scale to Architectural, keeping the max at 50 but with a different weighting. The Extreme scale condition is also defined differently: the script uses concrete thresholds (Files > 30 OR LOC > 2000), while the reference uses a relative measure ("exceeds any single dimension by 2x or more").

**Authoritative source:** `phase_definitions.md` is the reference specification document. It is listed in `spec.md` scope (line 122) as a newly created reference document defining "Phase taxonomy and transition rules." The script should conform to the reference, not the other way around.

---

## Check 2: Phase Count Mapping

**Result: PASS**

Script (lines 436-443):
```bash
if [[ "$PHASE_SCORE" -ge 45 ]]; then
  SUGGESTED_PHASE_COUNT=4
elif [[ "$PHASE_SCORE" -ge 35 ]]; then
  SUGGESTED_PHASE_COUNT=3
else
  # Score 25-34
  SUGGESTED_PHASE_COUNT=2
fi
```

Reference (`phase_definitions.md`, lines 62-66):

| Score Range | Suggested Phases |
|-------------|------------------|
| 25-34 | 2 phases |
| 35-44 | 3 phases |
| 45+ | 4 phases |

Script header comment (lines 58-60):
```
# Score 25-34: 2 phases suggested
# Score 35-44: 3 phases suggested
# Score 45+:   4+ phases suggested
```

All three sources agree. The logic correctly implements the ranges:
- `>= 45` catches 45+ -> 4 phases
- `>= 35` (after failing >= 45) catches 35-44 -> 3 phases
- `else` (after failing >= 35, but only entered when score >= 25 due to dual threshold) catches 25-34 -> 2 phases

---

## Check 3: Dual Threshold

**Result: PASS**

Script (line 432):
```bash
if [[ "$PHASE_SCORE" -ge "$PHASE_THRESHOLD" ]] && [[ "$RECOMMENDED_LEVEL" -ge 3 ]]; then
```

Where `PHASE_THRESHOLD` defaults to 25 (line 91: `PHASE_DEFAULT_THRESHOLD=25`).

Reference (`phase_definitions.md`, lines 51-54):
> Phase decomposition is suggested when BOTH conditions are met:
> - Phase score threshold: phase complexity score >= 25
> - Level threshold: documentation level >= 3

Both conditions are checked with `&&`. The function comment (lines 353-354) also states: "Phase is recommended when: Phase score >= PHASE_THRESHOLD (default 25) AND RECOMMENDED_LEVEL >= 3." The function is called after `determine_level()` (line 755 before 762), so `RECOMMENDED_LEVEL` is populated.

---

## Check 4: CLI Flags

**Result: PASS**

### `--recommend-phases` flag
- Defined in argument parser at line 689: `--recommend-phases) RECOMMEND_PHASES=true; shift ;;`
- Default is already `true` (line 124: `RECOMMEND_PHASES=true`)
- Listed in help text at line 177
- Controls whether `determine_phasing()` is called (line 761-763)
- Controls whether phase output sections appear in text/JSON output

### `--no-recommend-phases` flag
- Defined at line 693: `--no-recommend-phases) RECOMMEND_PHASES=false; shift ;;`
- Listed in help text at line 178
- Disables phase scoring entirely

### `--phase-threshold` flag
- Defined at lines 697-703 with value validation
- Listed in help text at line 179
- Stored in `PHASE_THRESHOLD` variable, used at line 432

All three flags exist, are properly parsed, validated, and documented.

---

## Check 5: JSON Output

**Result: PASS**

When `RECOMMEND_PHASES=true`, the JSON output (lines 574-610) includes:
- `"recommended_phases": ${PHASE_RECOMMENDED}` (line 581) — boolean true/false
- `"phase_score": ${PHASE_SCORE}` (line 582) — integer 0-50
- `"phase_reason": "..."` (line 583) — escaped string
- `"suggested_phase_count": ${SUGGESTED_PHASE_COUNT}` (line 584) — integer 0-4

When `RECOMMEND_PHASES=false`, the JSON output (lines 613-646) omits all four phase fields.

**Note on field naming:** spec.md REQ-001 specifies `recommended_phases`, `phase_reason`, and `suggested_phase_count`. The JSON output uses `recommended_phases` (line 581) -- this matches. All three required fields are present.

---

## Check 6: Max Score Cap

**Result: PASS**

Script (lines 424-427):
```bash
if [[ "$PHASE_SCORE" -gt "$PHASE_MAX_SCORE" ]]; then
  PHASE_SCORE=$PHASE_MAX_SCORE
fi
```

Where `PHASE_MAX_SCORE=50` (line 90).

The theoretical maximum from summing all signals is 15+10+10+10+5 = 50, which equals the cap. So the cap is technically redundant with the current point values but serves as a defensive guard. With the reference document's values (10+10+10+10+10 = 50), the cap would also be exact.

The cap is correctly implemented and the max of 50 matches both `phase_definitions.md` and the script header.

---

## Check 7: Scoring Dimension Mismatch (Architectural)

**Result: MISMATCH (confirmed)**

This is the specific known potential issue called out in the task.

### Evidence:

**Script** (line 85):
```bash
readonly PHASE_POINTS_ARCHITECTURAL=15
```

**Script header comment** (line 49):
```
#   Architectural flag:     +15 points
```

**phase_definitions.md** (line 41):
```
| Architectural complexity | 10 | Multiple systems, cross-cutting concerns, or architectural decisions |
```

The script uses **+15** for Architectural while the reference document specifies **+10**. This is a confirmed mismatch of 5 points.

### Impact analysis:

The +5 over-weighting of Architectural in the script means:
1. Tasks with the architectural flag reach the phase threshold (25) more easily. Architecture alone gets to 15/25 (60%) in the script vs 10/25 (40%) in the reference.
2. The compensating -5 on Extreme scale (5 vs 10) means tasks at extreme scale are under-weighted relative to the spec.
3. Net effect: the script **favors architectural changes** and **penalizes extreme-scale-only tasks** compared to the reference document's uniform 10-point-per-dimension design.

### Which source is authoritative:

`phase_definitions.md` is the reference specification. It was created as part of the phase system spec (spec.md line 122: "Phase taxonomy and transition rules"). The script should conform to it. However, the script header comments (lines 48-54) are self-consistent with the code -- suggesting the divergence may have been intentional during implementation but was never reconciled back to the reference document.

**Recommendation:** Align the script to match `phase_definitions.md` (change PHASE_POINTS_ARCHITECTURAL from 15 to 10 and PHASE_POINTS_EXTREME_SCALE from 5 to 10), OR update `phase_definitions.md` to reflect the script's intentional weighting with a rationale. One source of truth must prevail.

---

## Adversarial Self-Check (P1 Findings)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Architectural dimension: script +15 vs reference +10 | P1 | Could be intentional rebalancing during implementation; header comments match code | Confirmed: values factually differ between normative reference and implementation; no documented rationale for divergence | P1 |
| Extreme scale dimension: script +5/concrete thresholds vs reference +10/relative measure | P1 | Concrete thresholds may be a valid operationalization of the abstract "2x" concept | Confirmed as MISMATCH on points (+5 vs +10); condition logic difference is a secondary concern since the abstract "2x" must be operationalized somehow | P1 |
| Three-dimensional mismatch (both points + condition) treated as one root cause | -- | Could be separate issues | Referee: same root cause (point redistribution from extreme to architectural); report as single coherent finding with two manifestations | P1 (consolidated) |

---

## Summary of Findings

### Passing Checks (5/7)

1. **Phase count mapping** -- Score ranges correctly map to 2/3/4 phases
2. **Dual threshold** -- Both score >= 25 AND level >= 3 required, correctly implemented
3. **CLI flags** -- All three flags (`--recommend-phases`, `--no-recommend-phases`, `--phase-threshold`) exist and work
4. **JSON output** -- All required phase fields present (`recommended_phases`, `phase_score`, `phase_reason`, `suggested_phase_count`)
5. **Max score cap** -- Correctly capped at 50

### Mismatches (2/7, same root cause)

1. **5-dimension scoring** (P1) -- Point values diverge on 2 of 5 dimensions between script and reference
2. **Architectural dimension** (P1) -- Script uses +15, reference specifies +10; compensating -5 on Extreme scale

### Required Action

Reconcile the point values between `recommend-level.sh` and `phase_definitions.md`. Either:
- **(A)** Update script: `PHASE_POINTS_ARCHITECTURAL=10`, `PHASE_POINTS_EXTREME_SCALE=10` (conform to reference)
- **(B)** Update reference: change Architectural to 15 and Extreme scale to 5 with documented rationale (conform to implementation)

Until reconciled, the script does not faithfully implement the specification in `phase_definitions.md`.
