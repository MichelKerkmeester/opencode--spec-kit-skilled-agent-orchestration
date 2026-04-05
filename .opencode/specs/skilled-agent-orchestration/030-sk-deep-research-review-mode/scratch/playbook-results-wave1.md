# Playbook Results -- Wave 1 (DR-031 through DR-034)

**Date:** 2026-03-24
**Tester:** Claude Opus 4.6 (automated read-only inspection)
**Method:** Source file inspection against playbook scenario contracts

---

## DR-031: Review mode kickoff via :review suffix

**Verdict:** PASS

**Evidence:**

1. **`:review` suffix detected in command entrypoint** -- The file `.opencode/command/spec_kit/deep-research.md` (lines 52-58) contains explicit mode-routing logic that checks for `:review` variants FIRST (order matters):
   - `:review:auto` -> functional_mode = "REVIEW", execution_mode = "AUTONOMOUS"
   - `:review:confirm` -> functional_mode = "REVIEW", execution_mode = "INTERACTIVE"
   - `:review` -> functional_mode = "REVIEW", execution_mode = "AUTONOMOUS"

2. **Review-specific setup questions appear** -- When `functional_mode == "REVIEW"` (lines 107-134), the command presents:
   - Q0: Review Target ("What to review?" with examples: spec folder path, `skill:sk-name`, `agent:name`, `track:NN--name`, or file paths/globs)
   - Q1_type: Review Target Type (auto-detected, 5 options: spec-folder, skill, agent, track, files)
   - Q_dims: Review Dimensions (default all 7, or user-specified subset)
   - Q1: Spec Folder, Q2: Execution Mode, Q3: Max Iterations

3. **Routes to correct YAML workflows** -- Lines 262-264 confirm:
   - REVIEW + AUTONOMOUS -> `spec_kit_deep-research_review_auto.yaml`
   - REVIEW + INTERACTIVE -> `spec_kit_deep-research_review_confirm.yaml`
   Both YAML files confirmed to exist at `.opencode/command/spec_kit/assets/`.

4. **README documents the `:review` command** -- The README at `.opencode/skill/sk-deep-research/README.md` has:
   - Quick Start section (ANCHOR:quick-start, lines 57-84) with review examples:
     ```
     /spec_kit:deep-research:review "skill:sk-deep-research"
     /spec_kit:deep-research:review:confirm ".opencode/specs/..."
     /spec_kit:deep-research:review:auto "agent:deep-research" --dimensions security,correctness
     ```

5. **Quick reference lists review commands** -- `.opencode/skill/sk-deep-research/references/quick_reference.md` (ANCHOR:review-mode, lines 220-281) lists:
   - `/spec_kit:deep-research:review "target"` -- Ask which review mode to use
   - `/spec_kit:deep-research:review:auto "target"` -- Autonomous review
   - `/spec_kit:deep-research:review:confirm "target"` -- Interactive review with gates

**Issues:** Minor documentation discrepancy: the quick reference describes `:review` as "Ask which review mode to use" (line 227), but the command entrypoint routes `:review` to AUTONOMOUS by default (line 55). The command behavior is correct per the routing table; the quick reference description is slightly misleading but not materially wrong since it still routes to review mode. The README Features section (line 154) correctly states `:review` or `:review:auto` maps to autonomous.

---

## DR-032: Review scope discovery resolves target to file list

**Verdict:** PASS

**Evidence:**

1. **`phase_init` has scope discovery logic for 5 target types** -- The review auto YAML (`spec_kit_deep-research_review_auto.yaml`) contains `step_scope_discovery` (lines 141-169) with explicit resolution logic for all 5 target types:

   - **spec-folder**: Read spec.md, plan.md, tasks.md, checklist.md, implementation-summary.md; discover implementation files referenced in spec artifacts; discover test files; set scope = all discovered files
   - **skill**: Read SKILL.md from `.opencode/skill/{skill_name}/`; discover references/, assets/, scripts/; find agent definitions across runtimes; find command entry points; set scope = all discovered files
   - **agent**: Find agent definition across all 5 runtimes (`.claude/agents/`, `.opencode/agent/`, `.codex/agents/`, `.agents/`, `.gemini/agents/`); compare for consistency; set scope = all agent files
   - **track**: List all child spec folders under `.opencode/specs/{track}/`; for each read spec.md + checklist.md; set scope = all child spec artifacts
   - **files**: Expand glob patterns from review_target; validate all files exist; discover immediate cross-references (imports, links); set scope = expanded file list + cross-references

   Outputs: `review_scope_files` (list) and `cross_reference_targets` (spec/code/test paths).

2. **Strategy template has "Review Dimensions" checkbox list** -- The deep_review_strategy.md template (`.opencode/skill/sk-deep-research/assets/deep_review_strategy.md`, lines 35-43) contains Section 3 "Review Dimensions (remaining)" with D1-D7 as checkboxes. It also has Section 15 "Files Under Review" (lines 152-158) with a per-file coverage state table.

3. **Config template has `reviewTarget` and `reviewTargetType` fields** -- The YAML `step_create_config` (lines 183-204) populates:
   - `reviewTarget: "{review_target}"`
   - `reviewTargetType: "{review_target_type}"`
   - `reviewDimensions: "{review_dimensions}"`
   - `reviewScopeFiles: "{review_scope_files}"`

   The state_format.md Section 8 (lines 513-543) documents the review config schema with `reviewTarget` (string), `reviewTargetType` (spec-folder/directory/file-list), and `reviewDimensions` (string array).

**Issues:** Minor taxonomy discrepancy: The command entrypoint (deep-research.md line 117) lists 5 target types as `spec-folder, skill, agent, track, files`. The YAML `step_scope_discovery` (line 142) matches this exactly. However, state_format.md Section 8 (line 538) lists `reviewTargetType` as only `spec-folder, directory, file-list` (3 types instead of 5). The YAML is the authoritative runtime contract and has all 5. The state_format.md appears to have been written before the full 5-type taxonomy was finalized. This is a documentation gap in state_format.md but does not affect runtime behavior.

---

## DR-033: Review dimension ordering follows risk priority

**Verdict:** PARTIAL

**Evidence:**

1. **Review auto YAML specifies inventory pass + risk-ordered dimensions** -- `step_order_dimensions` (lines 171-181) in `spec_kit_deep-research_review_auto.yaml` states:
   ```
   1. Iteration 0 (inventory pass): Build artifact map, identify file types, estimate complexity
   2. Subsequent iterations follow risk-ordered deep passes:
      correctness -> security -> spec-alignment -> completeness -> cross-ref-integrity -> patterns -> documentation-quality
   ```
   This matches the expected ordering: inventory first, then D1-D7 in risk priority.

2. **Strategy template lists D1-D7** -- The deep_review_strategy.md template Section 3 (lines 36-42) lists:
   - D1 Correctness
   - D2 Security
   - D3 Spec Alignment
   - D4 Completeness
   - D5 Cross-Reference Integrity
   - D6 Patterns
   - D7 Documentation Quality

3. **Quick reference lists dimensions in priority order** -- The quick_reference.md Review Dimensions table (lines 243-251) lists D1-D7 in the same order.

4. **loop_protocol.md Section 6 documents review dimension ordering** -- Section 6.1 "Review Initialization" (lines 553-554) specifies dimension ordering as:
   ```
   Default order: D2 Security, D1 Correctness, D3 Spec Alignment, D4 Completeness, D5 Cross-Reference Integrity, D6 Patterns, D7 Documentation Quality
   ```

5. **README Features section** -- README.md (lines 161-169) lists dimensions with explicit priority numbers: 1=Correctness, 2=Security, 3=Spec Alignment, 4=Completeness, 5=Cross-Ref Integrity, 6=Patterns, 7=Documentation Quality.

**Issues:** Ordering inconsistency between sources.

The scenario expects: inventory pass -> Correctness -> Security -> Spec Alignment -> Completeness -> Cross-Ref -> Patterns -> Documentation.

- **YAML** (`step_order_dimensions`): correctness -> security -> ... (Correctness first, matches expectation)
- **README Features** (line 161-169): Priority 1=Correctness, 2=Security (Correctness first, matches expectation)
- **Quick reference** (lines 243-251): D1=Correctness, D2=Security (Correctness first, matches expectation)
- **Strategy template** (lines 36-42): D1=Correctness, D2=Security (Correctness first, matches expectation)
- **loop_protocol.md Section 6.1** (line 554): "Default order: D2 Security, D1 Correctness, ..." (Security first -- CONTRADICTS the others)
- **YAML reference appendix** (lines 664-673): priority 1=correctness, priority 2=security (Correctness first)

The loop_protocol.md Section 6.1 has Security first ("D2 Security, D1 Correctness"), which contradicts all other sources (YAML, README, quick reference, strategy template, YAML appendix) that consistently put Correctness first. This is a documentation bug in loop_protocol.md Section 6.1. Since the YAML is the authoritative runtime contract and it has correctness first, the actual runtime behavior is correct. However, the inconsistency means we cannot say "all sources agree" -- verdict is PARTIAL.

---

## DR-034: Review iteration produces P0/P1/P2 findings with file:line evidence

**Verdict:** PASS

**Evidence:**

1. **@deep-review agent defines iteration file format with Scorecard, Findings (P0/P1/P2), Cross-Reference Results, Assessment** -- The agent file `.opencode/agent/deep-review.md` Step 5 (lines 149-213) specifies the `research/iterations/iteration-NNN.md` structure including:
   - **Scorecard**: Per-file scoring table (Corr/Sec/Patt/Maint/Perf/Total)
   - **Findings**: Structured by severity with explicit format:
     - P0-NNN: Title + Dimension + Evidence `[SOURCE: file:line]` + Cross-reference + Impact + Hunter/Skeptic/Referee verdicts + Final severity
     - P1-NNN: Title + Dimension + Evidence `[SOURCE: file:line]` + Impact + Skeptic/Referee + Final severity
     - P2-NNN: Title + Dimension + Evidence `[SOURCE: file:line]` + Impact + Final severity
   - **Cross-Reference Results**: Confirmed/Contradictions/Unknowns
   - **Assessment**: Confirmed findings count, new findings ratio, noveltyJustification, dimensions addressed

2. **State format Section 8 defines review JSONL iteration record schema** -- `state_format.md` Section 8 "REVIEW MODE STATE" (lines 471-614) defines:
   - Review-specific JSONL iteration record schema (lines 478-509) with fields including `severityCounts: { P0, P1, P2 }` (mapped as `findingsSummary`), `newFindings` (mapped as `findingsNew`), `findingsRefined`, `newFindingsRatio`, `filesReviewed`, `dimensionScores`, `findingRefs` (array of finding IDs like "P1-001"), `coverage`
   - The JSONL example (deep-review agent, lines 227-229) shows the actual record format with `severityCounts`, `newFindings`, `findingRefs`, `coverage`

3. **Agent rules require file:line evidence for every finding** -- The agent rules section (lines 414-446) states:
   - ALWAYS rule 6: "Cite file:line evidence for every finding"
   - ALWAYS rule 7: "Run Hunter/Skeptic/Referee for P0 candidates"
   - NEVER rule 8: "Fabricate findings or inflate severity (phantom issues)"
   - The quality rule in Step 3 (lines 117-120) mandates:
     - `[SOURCE: path/to/file:line]` for codebase evidence
     - `[SOURCE: spec/checklist reference]` for spec alignment checks
     - `[INFERENCE: based on X and Y]` when deriving from multiple sources

4. **YAML workflow rules confirm** -- The review auto YAML (lines 626-646) has explicit rules:
   - NEVER: `report_p0_without_file_line_evidence`
   - ALWAYS: `run_adversarial_selfcheck_on_p0_p1`

5. **YAML dispatch constraint** -- The dispatch context (line 372) includes:
   - `CONSTRAINT: Append JSONL record with dimension, severityCounts, reviewedArtifacts, newFindingsRatio.`

**Issues:** None. All required sections are present in the agent definition, the JSONL schema includes severity counts and new findings, and file:line evidence is mandated as a hard rule across both the agent definition and the YAML workflow.

---

## Summary

| Scenario | Title | Verdict |
|----------|-------|---------|
| DR-031 | Review mode kickoff via :review suffix | **PASS** |
| DR-032 | Review scope discovery resolves target to file list | **PASS** |
| DR-033 | Review dimension ordering follows risk priority | **PARTIAL** |
| DR-034 | Review iteration produces P0/P1/P2 findings with file:line evidence | **PASS** |

### Actionable Findings

1. **[P2] loop_protocol.md Section 6.1 dimension ordering inconsistency** -- Line 554 lists "D2 Security, D1 Correctness" (security first), but all other sources (YAML, README, quick reference, strategy template) list correctness first. The YAML is the authoritative runtime contract. Recommend aligning loop_protocol.md to match.

2. **[P2] state_format.md reviewTargetType taxonomy gap** -- Section 8 lists only 3 target types (`spec-folder`, `directory`, `file-list`) but the command entrypoint and YAML support 5 types (`spec-folder`, `skill`, `agent`, `track`, `files`). Recommend updating state_format.md to document all 5 types.

3. **[P2] quick_reference.md :review description mismatch** -- Describes `:review` as "Ask which review mode to use" but the command routes `:review` to autonomous by default. Minor wording issue.
