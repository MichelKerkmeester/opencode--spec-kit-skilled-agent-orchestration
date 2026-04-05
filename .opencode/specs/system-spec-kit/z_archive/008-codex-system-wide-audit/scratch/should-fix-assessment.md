# SHOULD-FIX (P1) Assessment

**Source:** `scratch/audit-conflict-adjudication.md` items 3-10
**Date:** 2026-02-15
**Target file:** `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh`

---

## Assessment Matrix

| # | Item | Verdict | Risk | Effort | Rationale |
|---|------|---------|------|--------|-----------|
| 3 | Add warning when OPEN QUESTIONS heading not found (L2->L3 AWK path, ~line 947) | **SAFE NOW** | Low | Small | Additive: insert `warn()` when `inserted_suffix` is still 0 after AWK completes. No behavior change; prevents silent section drop. |
| 4 | Tighten Multi-Agent row detection to table context only (~line 931) | **SAFE NOW** | Low | Small | Change `line ~ /Multi-Agent/` to `line ~ /^\|.*Multi-Agent/`. Existing CHK-180 catches duplicates as safety net. |
| 5 | Add iteration guard to backward comment scan (`find_insert_point`, lines 397-432) | **SAFE NOW** | Low | Small | Add max-iteration cap (e.g., 200 lines). Only triggers on pathological inputs. Normal behavior unchanged. |
| 6 | Fix instruction comment leak in plan/checklist upgrades (lines 510-512, 583-585) | **SAFE NOW** | Low | Small | `grep -v '^<!-- SPECKIT_ADDENDUM:'` misses instruction comments like `<!-- Append after CORE ... -->`. Spec.md upgrade (line 735-738) already handles this correctly with AWK — align plan/checklist to same pattern. |
| 7 | Remove dead code: `SED_INPLACE_FLAG` variable (lines 687-692) | **SAFE NOW** | Low | 1-line | Variable defined but never referenced. Actual in-place editing uses `_sed_inplace()` function (lines 695-701). Pure dead code removal. |
| 8 | Tighten level detection pattern 4 to reduce false positives (line 232) | **SAFE NOW** | **Medium** | Small | `grep -iE 'level[: ]+[123]\+?'` could match prose ("at this level: 2 items"). Needs word-boundary tightening. **Medium risk because level detection cascades through all upgrade logic** -- must verify with existing test suite. |
| 9 | Tighten `in_complexity` flag exit condition (lines 941-943) | **SAFE NOW** | Low | Small | `line !~ /^## 9/` keeps flag on for `## 9.1` subsections. Tighten to match only `## 9. COMPLEXITY` specifically. Only affects non-standard specs. |
| 10 | Add automatic rollback on partial upgrade failure (lines 1308-1350) | **DEFER** | **High** | Medium-Large | `perform_single_upgrade()` has 5 sequential steps; mid-failure leaves partial state. Requires: step-level file tracking, restore-from-backup logic, failure path testing. Manual recovery via pre-upgrade backup exists today. **This is a feature addition, not a fix -- needs its own spec.** |

---

## Summary

| Category | Count | Items |
|----------|-------|-------|
| **Safe to fix now** | 7 | #3, #4, #5, #6, #7, #8, #9 |
| **Needs deferral** (separate spec) | 1 | #10 (automatic rollback) |

### Recommended execution order (safe-now items, by risk/dependency)

1. **#7** - Dead code removal (zero risk, builds confidence)
2. **#6** - Instruction comment leak (aligns plan/checklist to spec.md pattern)
3. **#4** - Multi-Agent detection tightening (simple regex scope)
4. **#9** - Complexity flag exit (simple regex scope)
5. **#3** - OPEN QUESTIONS warning (additive logging)
6. **#5** - Iteration guard (defensive addition)
7. **#8** - Level detection pattern 4 (last due to medium risk, needs test verification)

### Deferral rationale for #10

Automatic rollback is a **new feature**, not a hardening fix. It requires:
- New function to track per-step file modifications
- Backup restoration logic (risk of data loss if buggy)
- Testing of all 5 failure points x 3 upgrade paths = 15 scenarios
- Current mitigation (pre-upgrade backup dir) is adequate for now

**Recommendation:** Create `specs/system-spec-kit/126-upgrade-rollback/` when scheduling.
