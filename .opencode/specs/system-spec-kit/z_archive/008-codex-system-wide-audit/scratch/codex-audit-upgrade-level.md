# Codex Audit: upgrade-level.sh

<!-- AUDIT_DATE: 2026-02-15 -->
<!-- REVIEWER: codex-high (@review agent) -->
<!-- CONFIDENCE: HIGH — all files read, all findings verified against source -->

---

## Scope

| Item | Path |
|------|------|
| **Primary** | `.opencode/skill/system-spec-kit/scripts/spec/upgrade-level.sh` (1511 lines) |
| **Sourced lib** | `.opencode/skill/system-spec-kit/scripts/lib/shell-common.sh` (55 lines) |
| **Templates read** | `templates/core/spec-core.md`, `templates/core/plan-core.md` |
| **Addendum files** | `level2-verify/{spec-level2,plan-level2,checklist}.md`, `level3-arch/{spec-level3-prefix,spec-level3-suffix,plan-level3,decision-record}.md`, `level3plus-govern/{spec-level3plus-suffix,plan-level3plus,checklist-extended}.md` |

**Focus areas**: helper sourcing, metadata/marker update logic, fragment injection, idempotency, error handling, portability.

---

## Method

1. Full read of `upgrade-level.sh` (1511 lines) + `shell-common.sh` (55 lines)
2. Read all 10 addendum template files referenced by the script
3. Read both core templates (`spec-core.md`, `plan-core.md`) to verify section numbering assumptions
4. Traced 3 upgrade paths end-to-end: L1→L2, L2→L3, L3→L3+, and skip-level L1→L3
5. Validated idempotency guards, awk transformations, sed patterns, and marker update logic
6. Evaluated against workflows-code--opencode standards: strict mode, quoting, portability (Bash 3.2), error handling

---

## Confirmed Issues

### P1-01: Instruction Comments Leak Into User Files

| Field | Detail |
|-------|--------|
| **Severity** | P1 — REQUIRED FIX |
| **Files** | `upgrade-level.sh` lines 489, 562 |
| **Confidence** | HIGH — verified against template content |

**Evidence:**

`upgrade_plan()` (line 489) and `upgrade_checklist()` (line 562) strip template headers with:
```bash
fragment_content=$(grep -v '^<!-- SPECKIT_ADDENDUM:' "$fragment_path")
```

This removes ONLY lines starting with `<!-- SPECKIT_ADDENDUM:`. But every addendum template has a SECOND comment line:

```markdown
<!-- SPECKIT_ADDENDUM: Level 2 - Verification -->
<!-- Append after CORE plan.md Section 6 -->     ← NOT STRIPPED
```

Affected templates:
- `plan-level2.md` line 2: `<!-- Append after CORE plan.md Section 6 -->`
- `plan-level3.md` line 2: `<!-- Append after L2 plan sections -->`
- `plan-level3plus.md` line 2: `<!-- Append after L3 plan sections -->`
- `checklist-extended.md` line 2: `<!-- Append to Level 2 checklist.md -->`

**Impact:** Internal build instructions are injected into user-facing files. While invisible in rendered markdown, they appear in source and may confuse users editing markdown directly.

**Contrast:** `upgrade_spec_l1_to_l2()` (lines 712-717) correctly strips ALL leading comments using awk:
```awk
BEGIN { in_header = 1 }
in_header && /^<!--.*-->$/ { next }
in_header && /^[[:space:]]*$/ { next }
{ in_header = 0; print }
```

**Root Cause:** Inconsistent header-stripping strategy between spec.md upgrades (awk — correct) and plan/checklist upgrades (grep — incomplete).

**Patch Plan:**
- `upgrade-level.sh` line 489: Replace `grep -v` with the same awk pattern used at line 712-717
- `upgrade-level.sh` line 562: Same replacement
- Alternative: Add a shared helper function `strip_template_header()` and call it from all three locations

---

### P1-02: `in_complexity` Flag Exit Condition Is Fragile

| Field | Detail |
|-------|--------|
| **Severity** | P1 — code correctness risk |
| **File** | `upgrade-level.sh` lines 918-920 |
| **Confidence** | MEDIUM — no bug in standard template flow, but fragile against custom content |

**Evidence:**

The awk script in `upgrade_spec_l2_to_l3()` tracks whether we're inside the complexity section:
```awk
# line 896: Sets flag
else if (line ~ /^## L2: COMPLEXITY ASSESSMENT/) {
    sub(/^## L2: COMPLEXITY ASSESSMENT/, "## 9. COMPLEXITY ASSESSMENT", line)
    in_complexity = 1
}

# line 918-920: Exit condition
if (line ~ /^## / && line !~ /^## 9/) {
    in_complexity = 0
}
```

The exit condition `!~ /^## 9/` keeps the flag alive for the `## 9. COMPLEXITY ASSESSMENT` heading itself. This is correct. However:

1. **Fragile coupling**: The exit depends on the heading being `## 9.` specifically. If the hardcoded numbering changes (currently 7/8/9), this condition breaks.
2. **Custom content risk**: If a user adds any heading starting with `## 9` below the complexity section (e.g., `## 9.1 Sub-assessment`), the flag won't clear, and the `/70]` → `/100]` gsub will apply to unrelated content.
3. **Standard flow verified**: With spec-core.md having OPEN QUESTIONS at `## 7.`, after L1→L2 it becomes `## 10.`, which doesn't match `## 9`, so the flag clears correctly.

**Root Cause:** The exit condition uses a negative match on the same section number instead of a positive match for "still in this section."

**Patch Plan:**
- `upgrade-level.sh` ~line 918: Replace the fragile exit with:
  ```awk
  if (line ~ /^## / && line !~ /^## 9\. COMPLEXITY/) {
      in_complexity = 0
  }
  ```
  Or better yet, use a section-end sentinel: set `in_complexity = 0` when hitting `^---$` after the table.

---

### P1-03: Dead Code — `SED_INPLACE_FLAG` Variable

| Field | Detail |
|-------|--------|
| **Severity** | P1 — code hygiene |
| **File** | `upgrade-level.sh` lines 664-668 |
| **Confidence** | HIGH — grep confirms variable is never referenced after assignment |

**Evidence:**

```bash
SED_INPLACE_FLAG=""
if [[ "$(uname)" == "Darwin" ]]; then
    SED_INPLACE_FLAG="-i ''"
else
    SED_INPLACE_FLAG="-i"
fi
```

`SED_INPLACE_FLAG` is assigned but **never used anywhere**. The `_sed_inplace()` wrapper function (lines 672-678) handles the same logic independently. This is dead code from a refactor.

Additionally, the assignment `SED_INPLACE_FLAG="-i ''"` is broken even if used — the single quotes would be passed as literal characters to sed, not as an empty-string argument. The `_sed_inplace()` function correctly handles this by calling `sed -i '' "$@"`.

**Patch Plan:**
- `upgrade-level.sh` lines 664-668: Delete the 5-line `SED_INPLACE_FLAG` block entirely
- Optionally add a comment above `_sed_inplace()` noting it replaces the variable approach

---

### P1-04: Level Detection Pattern 4 Too Broad — False Positive Risk

| Field | Detail |
|-------|--------|
| **Severity** | P1 — detection accuracy |
| **File** | `upgrade-level.sh` line 228 |
| **Confidence** | MEDIUM — requires unusual but possible content |

**Evidence:**

```bash
level=$(grep -iE 'level[: ]+[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
```

Pattern 4 is a broad case-insensitive fallback. It matches any line containing `level` followed by colon/space and a digit 1-3. False positive examples:

- `"This is a high-level 2-step refactor"` → matches `level 2`
- `"Set log level: 1 (debug)"` → matches `level: 1`
- `"API compatibility level 3 required"` → matches `level 3`

Since Patterns 0-3 are checked first and are specific, this only fires when all others fail. But when it fires, the false positive risk is real.

**Root Cause:** No word-boundary or line-position anchoring on the Pattern 4 regex.

**Patch Plan:**
- `upgrade-level.sh` line 228: Tighten the regex, e.g.:
  ```bash
  level=$(grep -E '^[Ll]evel[: ]+[123]\+?' "$spec_file" 2>/dev/null | grep -oE '[123]\+?' | head -1 || true)
  ```
  This requires `Level` at start-of-line, eliminating most false positives.

---

### P1-05: No Rollback on Partial Multi-File Update Failure

| Field | Detail |
|-------|--------|
| **Severity** | P1 — data integrity risk |
| **File** | `upgrade-level.sh` `perform_single_upgrade()` lines 1285-1328 |
| **Confidence** | HIGH — structural issue confirmed |

**Evidence:**

`perform_single_upgrade()` executes 5 steps sequentially:
1. Create new files (checklist.md / decision-record.md)
2. Upgrade plan.md
3. Upgrade spec.md
4. Upgrade checklist.md
5. Update SPECKIT_LEVEL markers

If step 3 succeeds but step 4 fails, the spec folder is left with an upgraded spec.md but non-upgraded checklist.md. The backup exists but requires MANUAL restoration — there's no automatic rollback.

During skip-level chains (L1→L3 = two steps), the risk is amplified: the first step (L1→L2) may complete successfully, but if the second step (L2→L3) fails, markers already say Level 2 but spec.md may be partially L3.

**Root Cause:** No transaction/rollback mechanism. Each file operation is independent.

**Patch Plan:**
- Add a rollback function that restores from `BACKUP_DIR` on any step failure
- In `perform_single_upgrade()`: On failure, call `restore_from_backup "$BACKUP_DIR" "$SPEC_FOLDER"`
- This requires copying backup files back to the spec folder root
- Long-term: Consider two-phase commit (write all to temp, then atomic swap)

---

### P2-01: `find_insert_point()` O(n) Subprocess Overhead

| Field | Detail |
|-------|--------|
| **Severity** | P2 — performance |
| **File** | `upgrade-level.sh` lines 377-432 |
| **Confidence** | HIGH |

**Evidence:**

The function scans backward from end-of-file using:
```bash
line=$(sed -n "${line_num}p" "$file")
```

Each iteration spawns a `sed` process. For a 200-line file, this could spawn up to 200 subprocesses. On typical spec files (80-150 lines), this means 10-50 `sed` calls (scanning from end through trailing blanks/comments).

**Impact:** Noticeable latency on large files or slow systems. Not functionally broken.

**Patch Plan:**
- Replace with `awk` or `mapfile` to read the file once into an array, then scan backward in-memory
- Example: `mapfile -t lines < "$file"` (Bash 4+) or `awk` reverse scan

---

### P2-02: Hardcoded Section Numbers in L2→L3 Rename

| Field | Detail |
|-------|--------|
| **Severity** | P2 — maintainability |
| **File** | `upgrade-level.sh` lines 888-897 |
| **Confidence** | HIGH |

**Evidence:**

The L2→L3 awk transformation hardcodes:
```awk
sub(/^## L2: NON-FUNCTIONAL REQUIREMENTS/, "## 7. NON-FUNCTIONAL REQUIREMENTS", line)
sub(/^## L2: EDGE CASES/, "## 8. EDGE CASES", line)
sub(/^## L2: COMPLEXITY ASSESSMENT/, "## 9. COMPLEXITY ASSESSMENT", line)
```

These numbers (7, 8, 9) assume the core template has exactly 6 numbered sections before L2 addendum sections. Currently true (`spec-core.md` has sections 1-6 before `## 7. OPEN QUESTIONS`). But if the core template ever gains or loses a section, these numbers become wrong.

**Patch Plan:**
- Replace hardcoded numbers with dynamic numbering: detect the last numbered section before the L2: headings, then assign sequential numbers starting from (last + 1).

---

### P2-03: Backup Cleanup Glob Sort Order Is Locale-Dependent

| Field | Detail |
|-------|--------|
| **Severity** | P2 — portability edge case |
| **File** | `upgrade-level.sh` lines 337-342 |
| **Confidence** | LOW — practically safe on all standard locales |

**Evidence:**

```bash
for d in "$SPEC_FOLDER"/.backup-*; do
```

Glob expansion order depends on `LC_COLLATE`. The comment says "sorted by name (which sorts by date due to timestamp format)." On standard C/POSIX/UTF-8 locales, `.backup-20250101-120000` sorts before `.backup-20250215-120000`. On exotic locales, this could theoretically differ.

**Patch Plan:**
- Add `LC_COLLATE=C` before the glob, or sort the array explicitly: `IFS=$'\n' backup_dirs=($(printf '%s\n' "${backup_dirs[@]}" | sort))`

---

### P2-04: `_json_escape()` Missing Control Character Handling

| Field | Detail |
|-------|--------|
| **Severity** | P2 — JSON spec compliance |
| **File** | `shell-common.sh` lines 24-33 |
| **Confidence** | MEDIUM — depends on whether control chars appear in input |

**Evidence:**

The function escapes `\`, `"`, `\n`, `\r`, `\t` but NOT other JSON-special control characters (U+0000-U+001F). JSON spec requires all control chars to be escaped. Characters like form feed (0x0C), backspace (0x08), and NUL (0x00) would produce invalid JSON.

**Impact:** Low — file names and level strings rarely contain control characters. But if error messages contain binary data, the JSON output could be malformed.

**Patch Plan:**
- Add catch-all for remaining control characters, or pipe through a proper JSON encoder for critical output paths.

---

### P2-05: Template Comment Mismatch (Documentation, Not Code)

| Field | Detail |
|-------|--------|
| **Severity** | P2 — documentation accuracy |
| **Files** | `plan-level2.md` line 2, `spec-level2.md` line 2 |
| **Confidence** | HIGH |

**Evidence:**

`plan-level2.md` line 2: `<!-- Append after CORE plan.md Section 6 -->`  
`spec-level2.md` line 2: `<!-- Append after CORE spec.md Section 6 -->`

But:
- `plan-core.md` has 7 sections (## 1 through ## 7)
- `spec-core.md` has 7 sections (## 1 through ## 7, with ## 7 being OPEN QUESTIONS)

The comment should say "Insert before Section 7 (OPEN QUESTIONS)" or "Append after Section 6 (RISKS & DEPENDENCIES)." The current wording is slightly misleading but harmless since the code doesn't parse these comments.

---

## Regression Tests

The following test scenarios should exist or be created:

| # | Test | Validates | Priority |
|---|------|-----------|----------|
| RT-01 | L1→L2 upgrade: verify no `<!-- Append after` comments in output plan.md | P1-01 | HIGH |
| RT-02 | L1→L2→L3 chain: verify OPEN QUESTIONS renumbered correctly (should be 12, not 9) | Numbering chain | HIGH |
| RT-03 | L1→L2: idempotency — run twice, second is no-op | Idempotency guards | HIGH |
| RT-04 | L3→L3+ checklist upgrade: verify no instruction comments leak | P1-01 | HIGH |
| RT-05 | L2→L3: verify `in_complexity` doesn't transform content after complexity section | P1-02 | HIGH |
| RT-06 | Spec with custom `## 9.X` subsection after complexity: verify no corruption | P1-02 | MEDIUM |
| RT-07 | DRY RUN: no files modified, no backup created | DRY_RUN flag | MEDIUM |
| RT-08 | Partial failure at step 3/5: verify .tmp files cleaned up by trap | Cleanup trap | MEDIUM |
| RT-09 | L1→L3+ skip-level: verify all intermediate steps execute correctly | Chain upgrade | HIGH |
| RT-10 | Spec with non-standard level detection (Pattern 4): verify false positive rejected | P1-04 | MEDIUM |
| RT-11 | `--json` output: validate JSON is parseable | JSON output | MEDIUM |
| RT-12 | Spec folder with spaces in path | Quoting | MEDIUM |

---

## Open Questions

1. **Is automatic rollback desired?** (P1-05) The current design relies on manual backup restoration. Should `perform_single_upgrade()` auto-restore on failure?

2. **Should `find_insert_point()` be replaced?** (P2-01) The O(n) subprocess approach works for typical spec files (80-150 lines). Is optimization worth the Bash 4+ `mapfile` dependency?

3. **Template versioning**: If the core template gains a section (e.g., section 7 becomes section 8), does the upgrade script need to be version-aware? Currently the hardcoded section numbers (P2-02) would break.

4. **Bash 3.2 vs 4+ decision**: The script explicitly avoids `set -u` for Bash 3.2 compatibility. Is Bash 3.2 still a hard requirement? If Bash 4+ is acceptable, several improvements become possible (mapfile, associative arrays, stricter mode).

5. **Should `level_to_numeric()` handle `CORE` level?** The spec-core.md template uses `<!-- SPECKIT_LEVEL: CORE -->`, not a number. If `detect_level()` reads this marker, it would return `CORE` which `level_to_numeric()` maps to `0`, causing validation failure.

---

## Quality Score

| Dimension | Score | Notes |
|-----------|-------|-------|
| Correctness | 24/30 | Instruction comment leak, fragile complexity flag, numbering assumptions |
| Security | 25/25 | No injection risks, no credential exposure, proper quoting |
| Patterns | 17/20 | Inconsistent header stripping, dead code, otherwise follows project conventions |
| Maintainability | 12/15 | Well-structured, good comments, hardcoded numbers are fragile |
| Performance | 7/10 | `find_insert_point()` subprocess overhead |

**Total: 85/100 — ACCEPTABLE (PASS with notes)**

---

## Summary

The script is well-engineered with good defensive patterns (idempotency checks, dry-run support, backup/cleanup, portable sed handling, JSON output). The architecture — chaining single-step upgrades for skip-levels — is sound.

The primary issues are:
1. **P1-01**: Instruction comments leaking into user files (inconsistent header stripping between spec and plan/checklist paths)
2. **P1-02**: Fragile `in_complexity` exit condition in awk (works for templates but brittle)
3. **P1-03**: Dead `SED_INPLACE_FLAG` variable (cosmetic but signals incomplete refactor)
4. **P1-04**: Overly broad level detection fallback pattern
5. **P1-05**: No automatic rollback on partial upgrade failure

No P0 blockers found. All upgrade paths (L1→L2, L2→L3, L3→L3+, L1→L3, L1→L3+) trace correctly through the standard template flow.
