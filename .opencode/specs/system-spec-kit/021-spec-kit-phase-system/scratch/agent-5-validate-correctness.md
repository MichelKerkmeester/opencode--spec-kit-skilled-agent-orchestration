# Agent 5: Functional Correctness — validate.sh --recursive + check-phase-links.sh

**Reviewer:** @review agent (Claude Opus 4.6)
**Date:** 2026-03-08
**Confidence:** HIGH — All files read, all checks traced to source lines, no gaps.

---

## Reference Requirement

**REQ-003** (from `spec.md`, line 142):
> `validate.sh --recursive` discovers and validates all `[0-9][0-9][0-9]-*/` child phase folders within a parent, producing aggregated results. Exit code reflects worst child; JSON output includes `phases[]` array with per-phase results.

---

## validate.sh Checks

### Check 1: `has_phase_children()` auto-detection

**Verdict: PASS**

**Evidence:** `validate.sh` lines 108-116:
```bash
has_phase_children() {
    local parent_folder="$1"
    for phase_dir in "$parent_folder"/[0-9][0-9][0-9]-*/; do
        if [[ -d "$phase_dir" ]]; then
            return 0
        fi
    done
    return 1
}
```

The function iterates over `[0-9][0-9][0-9]-*/` subdirectories and returns 0 (true) if any exist as directories, 1 (false) otherwise. This is used at line 529 in `main()` for auto-detection:

```bash
if ! $RECURSIVE && ! $RECURSIVE_OPT_OUT && has_phase_children "$FOLDER_PATH"; then
    RECURSIVE=true
    ...
fi
```

Auto-detection correctly enables recursive mode when: (a) `--recursive` was not already set, (b) `--no-recursive` was not used to opt out, and (c) phase children are present.

---

### Check 2: `[0-9][0-9][0-9]-*/` discovery pattern

**Verdict: PASS**

**Evidence:** The exact glob pattern `[0-9][0-9][0-9]-*/` is used consistently in three locations:

| Location | Line | Context |
|----------|------|---------|
| `has_phase_children()` | 110 | Auto-detection in `main()` |
| `run_recursive_validation()` | 462 | Discovery loop for child validation |
| `check-phase-links.sh` | 37 | Phase link validation rule |

All three use the identical `"$folder"/[0-9][0-9][0-9]-*/` pattern, matching three-digit-prefixed directories (e.g., `001-planning/`, `002-implementation/`). The trailing `/` ensures only directories match. The trailing `*` after the dash allows any name suffix.

---

### Check 3: Per-phase independent validation

**Verdict: PASS**

**Evidence:** `validate.sh` lines 476-518 in `run_recursive_validation()`:

For each child phase directory, the function:

1. **Saves parent state** (lines 481-485): Preserves `ERRORS`, `WARNINGS`, `INFOS`, `RESULTS`, `DETECTED_LEVEL` into local variables.
2. **Resets counters** (line 488): `ERRORS=0 WARNINGS=0 INFOS=0 RESULTS=""`
3. **Detects child level independently** (line 493): `detect_level "$phase_dir"` — each child gets its own level detection, not inheriting the parent level.
4. **Runs all rules independently** (line 494): `run_all_rules "$phase_dir" "$DETECTED_LEVEL"` — full rule suite executed against the child folder.
5. **Restores parent state afterward** (lines 513-517): Parent `RESULTS` string is restored (child results go only into `phase_results` JSON, not the top-level `results[]` array).

Each child phase is validated as an independent unit with its own level, counters, and rule execution. State isolation is maintained via save/reset/restore.

---

### Check 4: Combined exit code uses worst (highest) child exit code

**Verdict: PASS**

**Evidence:** The exit code logic works via counter accumulation, not explicit max-tracking, but the outcome is functionally equivalent.

**Accumulation** (lines 514-516):
```bash
ERRORS=$((parent_errors + ERRORS))
WARNINGS=$((parent_warnings + WARNINGS))
INFOS=$((parent_infos + INFOS))
```

After all children are processed, `ERRORS` and `WARNINGS` contain the sum of parent + all children.

**Exit logic** (`main()`, lines 547-550):
```bash
if [[ $ERRORS -gt 0 ]]; then exit 2; fi
if [[ $WARNINGS -gt 0 ]] && $STRICT_MODE; then exit 2; fi
if [[ $WARNINGS -gt 0 ]]; then exit 1; fi
exit 0
```

If ANY child (or the parent) has errors, `ERRORS > 0`, so exit code is 2 (the worst). If any has warnings but no errors anywhere, exit code is 1. Only if all pass cleanly does exit code reach 0. This is functionally identical to "worst child exit code" behavior as specified in REQ-003.

**Note:** The approach is actually stricter than "worst child" — it aggregates ALL errors/warnings. A single child error will produce exit 2 regardless of other children passing. This satisfies the requirement.

---

### Check 5: JSON `"phases":[]` array with per-phase results

**Verdict: PASS**

**Evidence:** `validate.sh` lines 447-450 in `generate_json()`:

```bash
local phases_json=""
if $RECURSIVE && [[ -n "$PHASE_RESULTS" ]]; then
    phases_json=",\"phases\":[$PHASE_RESULTS],\"phaseCount\":$PHASE_COUNT"
fi
echo "{...${phases_json},...}"
```

The `PHASE_RESULTS` string is built at line 510:
```bash
phase_results+="{\"name\":\"...\",\"level\":...,\"errors\":...,\"warnings\":...,\"passed\":...,\"results\":[...]}"
```

Each phase entry includes: `name`, `level`, `errors`, `warnings`, `passed` (boolean), and `results[]` (per-rule results array). The `phaseCount` field provides a count.

The JSON structure produced is:
```json
{
  "version": "2.0.0",
  "folder": "...",
  "results": [...],
  "phases": [
    { "name": "001-planning", "level": 1, "errors": 0, "warnings": 0, "passed": true, "results": [...] },
    ...
  ],
  "phaseCount": 3,
  "summary": { "errors": 0, "warnings": 0, "info": 0 },
  "passed": true
}
```

This fully satisfies REQ-003's `phases[]` array requirement.

---

## check-phase-links.sh Checks

### Check 6: 4 link checks (Phase Documentation Map, back-references, predecessor, successor)

**Verdict: PASS**

**Evidence:** `check-phase-links.sh` implements four distinct checks:

| # | Check | Lines | What It Verifies |
|---|-------|-------|------------------|
| 1 | Phase Documentation Map in parent | 50-57 | `grep -qi "PHASE DOCUMENTATION MAP" "$folder/spec.md"` — Verifies the parent spec.md contains the section header. |
| 2 | Back-references in children | 59-75 | For each child `spec.md`, checks for `../spec.md` path, `| **Parent Spec** |` table row, or `parent:` YAML field. Three alternative formats accepted. |
| 3 | Predecessor links | 77-91 | For each child except the first, checks that the child's `spec.md` contains a reference to the previous phase name (via `grep -qF "$prev_name"`). |
| 4 | Successor links | 93-109 | For each child except the last, checks that the child's `spec.md` contains a reference to the next phase name (via `grep -qF "$next_name"`). |

All four checks specified in the task are implemented and functional.

---

### Check 7: severity=warn for link check failures

**Verdict: PASS**

**Evidence:** Two layers confirm warn severity:

1. **Rule header comment** (line 10): `# Severity: warn`

2. **validate.sh severity mapping** (line 264):
```bash
SECTIONS_PRESENT|SECTIONS|PRIORITY_TAGS|EVIDENCE_CITED|EVIDENCE|PRIORITY|PHASE_LINKS|LINKS_VALID|LINKS) echo "warn" ;;
```

`PHASE_LINKS` is explicitly in the `warn` group. When `run_check()` returns `RULE_STATUS="fail"`, the `run_all_rules()` function at line 388 dispatches through `get_rule_severity()`, and since `PHASE_LINKS` maps to `"warn"`, it calls `log_warn()` — not `log_error()`. This means phase link failures increment `WARNINGS` (not `ERRORS`) and result in exit code 1 (not 2), unless `--strict` is used.

---

### Check 8: State isolation — each link check runs independently

**Verdict: PASS**

**Evidence:** `check-phase-links.sh` lines 48-122.

All four checks are sequentially independent:

1. **No early returns on failure.** When Check 1 fails (missing Phase Documentation Map), it appends to `issues[]` and continues to Check 2. Each check runs regardless of prior check results.
2. **Single accumulator.** All checks append to `local -a issues=()` (line 48). No shared mutable state between checks.
3. **Independent iteration.** Checks 2, 3, and 4 each have their own `for` loop over `phase_dirs[]`. Check 3 uses its own `prev_name` tracker (line 78). Check 4 uses its own index-based loop (line 95).
4. **No conditional skipping.** There is no logic like "if Check 1 failed, skip Check 2." All four always execute.

The final result (lines 115-123) aggregates all issues into a single pass/fail verdict with all details, meaning a failure in one check does not mask or suppress findings from another check.

---

## Summary Table

| # | Check | Verdict | Key Evidence |
|---|-------|---------|--------------|
| 1 | `has_phase_children()` auto-detection | **PASS** | Lines 108-116, 529-532: glob match + auto-enable in `main()` |
| 2 | `[0-9][0-9][0-9]-*/` discovery pattern | **PASS** | Lines 110, 462, 37: identical pattern in 3 locations |
| 3 | Per-phase independent validation | **PASS** | Lines 476-518: save/reset/restore cycle per child |
| 4 | Combined exit code (worst child) | **PASS** | Lines 514-516, 547-550: additive accumulation + threshold exit |
| 5 | JSON `"phases":[]` array | **PASS** | Lines 447-450, 510: per-phase JSON objects with results |
| 6 | 4 link checks in check-phase-links.sh | **PASS** | Lines 50-57, 59-75, 77-91, 93-109: all four implemented |
| 7 | severity=warn for link failures | **PASS** | Line 10 header + validate.sh line 264 mapping |
| 8 | State isolation between checks | **PASS** | Sequential append to `issues[]`, no early returns, no shared state |

**Overall Result: 8/8 PASS** — All checks satisfy the requirements specified in REQ-003 and the task description.

---

## Adversarial Self-Check

No P0 or P1 findings were identified, so the Hunter/Skeptic/Referee protocol produces no findings table. All 8 checks passed with direct evidence from source code.

One minor observation (informational, not a finding): The `RESULTS="$parent_results"` restore at line 517 means child rule results appear only in `phases[]` JSON, not in the top-level `results[]`. This is intentional (per comment at line 512) and correct — it prevents double-counting of child results in parent totals. The top-level `summary.errors` and `summary.warnings` do include child counts (via the additive accumulation), which is consistent with REQ-003's "aggregated results" language.
