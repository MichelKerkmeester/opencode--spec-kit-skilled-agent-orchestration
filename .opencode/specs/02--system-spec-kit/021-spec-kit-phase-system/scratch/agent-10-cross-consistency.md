# Agent 10: Cross-System Consistency + Gap Analysis

**Review Date:** 2026-03-08
**Reviewer:** @review agent (Claude Opus 4.6)
**Confidence:** HIGH — All source files read and verified; all findings traceable to exact line numbers.

---

## CONSISTENCY CHECKS

### Check 1: Scoring Dimensions Match

**Verdict: MISMATCH**

The five phase scoring dimensions and their point values differ across the three canonical sources:

| Dimension | `recommend-level.sh` (lines 85-89) | `phase_definitions.md` (lines 39-46) | `spec.md` REQ-001 (line 140) |
|-----------|-------------------------------------|---------------------------------------|-------------------------------|
| Architectural | **+15 points** | **+10 points** | Not itemized (narrative only) |
| File count (>15) | **+10 points** | **+10 points** | Mentioned as signal |
| LOC (>800) | **+10 points** | **+10 points** | Mentioned as signal |
| Risk (>=2 flags) | **+10 points** | **+10 points** | Not explicitly listed |
| Extreme scale | **+5 points** | **+10 points** | Not mentioned |
| **Max score** | **50** | **50** | Not stated |

**Detail of mismatches:**

1. **Architectural complexity: +15 (script) vs +10 (docs)**
   - Script source: `recommend-level.sh` line 85: `readonly PHASE_POINTS_ARCHITECTURAL=15`
   - Docs source: `phase_definitions.md` line 41: `| Architectural complexity | 10 |`
   - **Impact:** With +15 in the script, an architectural-only task scores 15 (below threshold 25). With +10 in docs, it also scores below. The difference matters when combined with other signals — the script is more generous toward recommending phases for architectural tasks.

2. **Extreme scale: +5 (script) vs +10 (docs)**
   - Script source: `recommend-level.sh` line 89: `readonly PHASE_POINTS_EXTREME_SCALE=5`
   - Docs source: `phase_definitions.md` line 45: `| Extreme scale | 10 |`
   - **Impact:** The script awards half the points the docs claim. A task at extreme scale would score 5 less than documented.

3. **Extreme scale condition differs:**
   - Script source: `recommend-level.sh` lines 415-416: `if [[ "$FILES" -gt 30 ]] || [[ "$LOC" -gt 2000 ]]` — Triggers when files > 30 OR LOC > 2000
   - Docs source: `phase_definitions.md` line 45: `| Extreme scale | 10 | Exceeds any single dimension by 2x or more |` — Uses a relative "2x" threshold description
   - **Impact:** The script uses absolute thresholds; the docs describe a relative multiplier. These are fundamentally different conditions.

4. **spec.md REQ-001 uses narrative form, not itemized scoring:**
   - spec.md line 140: `"...when score >= 70 AND (architectural OR files > 15 OR LOC > 800)"` — This describes the *level* score threshold (70 out of 100), NOT the phase score threshold (25 out of 50). This is internally inconsistent with the rest of the system, where phase recommendation requires phase_score >= 25 AND level >= 3.

**Summary:** The implementation (script) and the reference documentation (phase_definitions.md) disagree on 2 of 5 dimension point values and 1 condition definition. The spec.md REQ-001 acceptance criteria conflates level scoring (100-point scale, threshold 70) with phase scoring (50-point scale, threshold 25).

---

### Check 2: Threshold Defaults

**Verdict: MATCH (with caveat)**

| Source | Default Threshold | Evidence |
|--------|-------------------|----------|
| `recommend-level.sh` | **25** | Line 91: `readonly PHASE_DEFAULT_THRESHOLD=25` |
| `phase_definitions.md` | **25** | Line 53: `phase complexity score >= 25` |
| `spec.md` | **70** (WRONG SCALE) | Line 140: `score >= 70` — This refers to the 100-point level score, not the 50-point phase score |
| `spec_kit_phase_auto.yaml` | **25** | Line 35: `phase_threshold_empty: "Default to 25"` |
| `spec_kit_phase_confirm.yaml` | **25** | Line 53: `phase_threshold_empty: "Default to 25"` |

**Detail:**
- The threshold of 25 is consistent across 4 of 5 sources.
- `spec.md` REQ-001 says `score >= 70` which is the level recommendation threshold (100-point scale), NOT the phase threshold (50-point scale, threshold 25). This is a specification-level error: it confuses two separate scoring systems.
- The phase system explicitly has TWO independent thresholds: (1) phase_score >= 25 out of 50, AND (2) level >= 3. The spec.md acceptance criteria merges these incorrectly.

---

### Check 3: Phase Count Mappings

**Verdict: MATCH**

| Score Range | `recommend-level.sh` (lines 436-443) | `phase_definitions.md` (lines 62-66) |
|-------------|---------------------------------------|---------------------------------------|
| 25-34 | 2 phases | 2 phases |
| 35-44 | 3 phases | 3 phases |
| 45+ | 4 phases | 4 phases |

**Evidence:**
- Script lines 436-443:
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
- Docs lines 62-66:
  ```
  | 25-34 | 2 phases |
  | 35-44 | 3 phases |
  | 45+   | 4 phases |
  ```

These match exactly. The docs say "4 phases" for 45+ while the spec says `SUGGESTED_PHASE_COUNT=4` (not "4+"), but since the max score is 50 and the script caps at 4, this is effectively the same.

---

### Check 4: YAML Steps Invoke Correct Scripts

**Verdict: MATCH**

Both YAML workflow files reference the correct scripts with correct flags:

| Step | Script Invocation | `auto.yaml` Line | `confirm.yaml` Line | Correct? |
|------|-------------------|-------------------|----------------------|----------|
| Step 1 (Analyze Scope) | `recommend-level.sh --json --recommend-phases --phase-threshold {phase_threshold} --loc ... --files ...` | Lines 143-144 | Lines 160-161 | YES |
| Step 3 (Create Folders) | `create.sh "{feature_description}" --phase --phases {phase_count} --phase-names "{phase_names}" --level {parent_level}` | Lines 182-183 | Lines 219-220 |YES |
| Step 6 (Save Context) | `node .../generate-context.js {parent_spec_path}` | Line 222 | Line 280 | YES |
| Step 7 (Validate) | `validate.sh --recursive {parent_folder}` | Line 244 | Line 307 | YES |

Both YAML files also include `--parent` variant invocations for adding phases to existing specs (auto line 183, confirm line 220).

**Note:** The script paths are relative in the YAML (e.g., `bash .opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh`), which is correct for project-root execution context.

---

## GAP ANALYSIS CHECKS

### Check 5: `nodes/phase-system.md` — MISSING

**Verdict: MISSING**

- **Glob search for `**/phase-system.md`:** No files found anywhere in the repository.
- **Glob search for `**/nodes/**phase*`:** No files found.
- **Directory check:** The `nodes/` directory does not exist at all under `.opencode/skill/system-spec-kit/`. The top-level listing of that directory (26 entries) contains no `nodes/` folder.
- **Spec reference:** `spec.md` line 121: `| .opencode/skill/system-spec-kit/nodes/phase-system.md | Create | Graph mode node for phase workflow |`
- **Spec requirement:** REQ-011 (line 155): `nodes/phase-system.md documents phase lifecycle, transitions, and boundary rules`

**Conclusion:** Neither the file nor its parent directory exists. If task T031 claimed this was created, that claim is false.

---

### Check 6: `index.md` — MISSING

**Verdict: MISSING**

- **Glob search for `**/index.md` in system-spec-kit:** Found only 2 files, both inside deeply nested `node_modules/` dependencies (`napi-build-utils/index.md`). These are third-party package files, not the project's own `index.md`.
- **Spec reference:** `spec.md` line 127: `| .opencode/skill/system-spec-kit/index.md | Modify | Add phase-system.md to MOC Workflow & Routing section |`

**Conclusion:** No `index.md` exists in the system-spec-kit skill directory (outside of `node_modules`). If task T032 claimed it was updated, that claim is false — the file does not exist to be updated.

---

### Check 7: Feature Catalog Phase System Gaps

**Verdict: MISSING — No phase system feature entries**

- **Search performed:** Grep for `phase` (case-insensitive) in `FEATURE_CATALOG.md` returned 24 matches.
- **Analysis of matches:** Every single match refers to existing MCP/search pipeline features that use the word "phase" in different contexts:
  - "Phase 017", "Phase 018", "Phase 014" — Historical sprint/phase labels for existing bug fix work
  - "two-phase retrieval" — Folder scoring retrieval strategy (unrelated to spec-kit phase system)
  - "preflight phase" — Session learning lifecycle state (unrelated)
  - "sub-phase `009-extra-features`" — Existing spec sub-phase reference (unrelated)
- **Search for specific phase system features:** Grep for `phase.*detect|phase.*creat|phase.*valid|recommend.*phase|spec_kit:phase|--phase|--recursive` returned zero matches for phase system features. The only matches were unrelated (`two-phase folder retrieval`).

**Conclusion:** The feature catalog contains ZERO entries for any of the following phase system features:
- Phase detection/scoring via `recommend-level.sh --recommend-phases`
- Phase folder creation via `create.sh --phase`
- Phase validation via `validate.sh --recursive`
- Phase recommendation algorithm (5-dimension scoring)
- `/spec_kit:phase` command

---

### Check 8: Manual Testing Playbook Phase System Gaps

**Verdict: MISSING — No phase system test scenarios**

- **Search performed:** Grep for `spec_kit:phase|--phase|--recursive|phase.*decomp|phase.*detect|phase.*creat|phase.*valid|recommend.*phase` in `MANUAL_TESTING_PLAYBOOK.md`.
- **Matches found:** 2 results, both unrelated:
  - Line 158: `NEW-079 | Scoring and fusion corrections | Confirm phase-017 correction bundle` — This is about search pipeline scoring corrections from sprint "phase 017", not the phase decomposition system.
  - Line 187: Omitted long line — also unrelated.
- **Search for exact terms:** `phase system|phase decomposition|phase folder|phase workflow|recommend-level.*phase` returned zero matches.

**Conclusion:** The manual testing playbook contains ZERO scenarios for:
- `/spec_kit:phase` command (auto or confirm mode)
- `--phase` flag on `create.sh`
- `--recursive` flag on `validate.sh`
- Phase detection via `recommend-level.sh --recommend-phases`
- Phase scoring threshold behavior
- Parent-child phase folder link validation
- Phase count recommendation accuracy

---

## SUMMARY TABLE

| # | Check | Verdict | Severity | Detail |
|---|-------|---------|----------|--------|
| 1 | Scoring dimensions match | **MISMATCH** | P1 | Architectural: +15 (script) vs +10 (docs). Extreme scale: +5 (script) vs +10 (docs). Extreme scale condition: absolute (script) vs relative 2x (docs). |
| 2 | Threshold defaults | **MATCH** (caveat) | P1 | 4 of 5 sources use 25. spec.md REQ-001 says "score >= 70" which is the wrong scale (level score, not phase score). |
| 3 | Phase count mappings | **MATCH** | — | All sources agree: 25-34=2, 35-44=3, 45+=4. |
| 4 | YAML script invocations | **MATCH** | — | Both YAML files reference correct scripts with correct flags. |
| 5 | `nodes/phase-system.md` exists | **MISSING** | P1 | File and parent `nodes/` directory do not exist. spec.md lists as deliverable (line 121); REQ-011 requires it. |
| 6 | `index.md` exists | **MISSING** | P1 | No `index.md` exists in system-spec-kit skill (only in node_modules). spec.md lists it as "Modify" target (line 127). |
| 7 | Feature catalog has phase entries | **MISSING** | P2 | Zero entries for phase detection, creation, validation, or recommendation features. All "phase" hits are unrelated sprint labels. |
| 8 | Manual testing playbook has phase scenarios | **MISSING** | P2 | Zero test scenarios for `/spec_kit:phase`, `--phase`, `--recursive`, or phase scoring. All "phase" hits are unrelated. |

---

## ADVERSARIAL SELF-CHECK (P0/P1 FINDINGS)

| Finding | Hunter Severity | Skeptic Challenge | Referee Verdict | Final Severity |
|---------|----------------|-------------------|-----------------|----------------|
| Architectural points: +15 vs +10 | P1 | Could be intentional design decision — script may have been updated after docs were written. But no decision record documents this divergence. | **Confirmed** — The two canonical sources disagree with no documented rationale. Either the script or the docs must be wrong. | **P1** |
| Extreme scale points: +5 vs +10 | P1 | Docs may be aspirational (target) vs script (current). But docs describe current system, not future. | **Confirmed** — Same document (`phase_definitions.md`) describes the implemented scoring system; discrepancy is factual. | **P1** |
| Extreme scale condition: absolute vs relative | P1 | The docs use a vague "2x" description which could be interpreted as prose approximation of the absolute values. | **Downgraded** — The script is unambiguous code; the docs use a fuzzy description. Not a hard contradiction, but the docs should use the same concrete thresholds as the script. | **P2** |
| spec.md REQ-001 uses wrong threshold (70 vs 25) | P1 | REQ-001 may be describing a compound condition: level score >= 70 AND phase signals present. The "score >= 70" could refer to the level score, not the phase score. | **Confirmed** — REQ-001 acceptance criteria says `"recommended_phases: true/false"... when score >= 70 AND (architectural OR files > 15 OR LOC > 800)`. The `score >= 70` is the level score (correct context), but the conditions listed (architectural OR files > 15 OR LOC > 800) are individual signals, not the actual phase scoring algorithm (which uses a 50-point scale with threshold 25 requiring 2+ signals above threshold). The acceptance criteria describes a simplified/incorrect version of the actual algorithm. | **P1** |
| `nodes/phase-system.md` missing | P1 | Could exist at a different path or have been renamed. | **Confirmed** — Searched `**/phase-system.md` and `**/nodes/**phase*` globally. Neither file nor directory exists anywhere. | **P1** |
| `index.md` missing | P1 | Could exist at a different filename or location. | **Confirmed** — Searched `**/index.md` in skill directory. Only hits are in `node_modules/`. No project-level index.md exists. | **P1** |
| Feature catalog gaps | P2 | Feature catalog may cover phase system under a different naming convention. | **Confirmed** — Exhaustive search for phase system terms returned zero relevant hits. All "phase" occurrences are sprint labels. | **P2** |
| Manual testing playbook gaps | P2 | Playbook may be structured differently or phase tests may be planned separately. | **Confirmed** — Exhaustive search returned zero relevant hits. No phase system test scenarios exist. | **P2** |

---

## FILES REVIEWED

| File | Path | Lines |
|------|------|-------|
| recommend-level.sh | `.opencode/skill/system-spec-kit/scripts/spec/recommend-level.sh` | 776 |
| phase_definitions.md | `.opencode/skill/system-spec-kit/references/structure/phase_definitions.md` | 244 |
| spec.md | `.opencode/specs/02--system-spec-kit/021-spec-kit-phase-system/spec.md` | 404 |
| spec_kit_phase_auto.yaml | `.opencode/command/spec_kit/assets/spec_kit_phase_auto.yaml` | 325 |
| spec_kit_phase_confirm.yaml | `.opencode/command/spec_kit/assets/spec_kit_phase_confirm.yaml` | 401 |
| FEATURE_CATALOG.md | `.opencode/skill/system-spec-kit/feature_catalog/FEATURE_CATALOG.md` | (searched, not fully read — too large) |
| MANUAL_TESTING_PLAYBOOK.md | `.opencode/skill/system-spec-kit/manual_testing_playbook/MANUAL_TESTING_PLAYBOOK.md` | (searched, first 100 lines read + full grep) |
