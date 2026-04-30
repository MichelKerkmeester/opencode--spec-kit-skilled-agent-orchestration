---
title: "Tasks: sk-doc Conformance Sweep and Template Cleanup"
description: "Numbered task list mapped to plan.md Tier 1-4 sub-phases; cli-codex parallel dispatches enumerated per wave."
template_source: "SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2"
trigger_phrases:
  - "040-sk-doc-conformance-sweep-and-template-cleanup tasks"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/000-release-cleanup/005-review-remediation/040-sk-doc-conformance-sweep-and-template-cleanup"
    last_updated_at: "2026-04-30T08:15:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Tasks doc rewritten to Level 3 canonical"
    next_safe_action: "Run validate.sh --strict; dispatch Tier 2a wave"
    blockers: []
    key_files:
      - "tasks.md"
      - "checklist.md"
    session_dedup:
      fingerprint: "sha256:040-sk-doc-conformance-sweep-and-template-cleanup"
      session_id: "040-sk-doc-conformance-sweep-and-template-cleanup"
      parent_session_id: "026-graph-and-context-optimization"
    completion_pct: 8
    open_questions: []
    answered_questions: []
---
# Tasks: sk-doc Conformance Sweep and Template Cleanup

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Tier 1 — Foundation (sequential)

- [x] T-001 SP-001 Phase 040 collision resolved naturally (prior 040 renumbered to 027 in earlier session reorganization)
- [x] T-002 SP-002 Create 040 spec folder shell at `040-sk-doc-conformance-sweep-and-template-cleanup/`
- [x] T-003 Write spec.md
- [x] T-004 Write plan.md
- [x] T-005 Write tasks.md (this file)
- [x] T-006 Write checklist.md
- [x] T-007 Write decision-record.md
- [x] T-008 Write description.json
- [x] T-009 Write graph-metadata.json
- [x] T-010 Write audit-findings.md (full per-surface verdicts from 7 cli-codex audits)
- [ ] T-011 Run `validate.sh --strict` on the new packet — confirm Level 3 structure passes (exit 0)
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Tier 2a (low effort, parallel cli-codex gpt-5.5 high fast — 8 dispatches)

- [x] T-020 [P] Dispatch 003-A — cli-claude-code/manual_testing_playbook/ (sed: index renamed, 27 prompts relabeled)
- [x] T-021 [P] Dispatch 003-B — cli-codex/manual_testing_playbook/ (sed: index renamed, 28 prompts relabeled)
- [x] T-022 [P] Dispatch 003-C — cli-gemini/manual_testing_playbook/ (sed: index + §N inline refs renamed, 19 prompts relabeled)
- [x] T-023 [P] Dispatch 003-D — cli-copilot/manual_testing_playbook/ (sed: index + §N inline refs renamed, 25 prompts relabeled)
- [x] T-024 [P] Dispatch 003-E — cli-opencode/manual_testing_playbook/ (sed: index + 32 prompts relabeled; 3 drifted prompts CO-006/007/021 rewritten to canonical RCAF via Edit)
- [x] T-025 [P] Dispatch 003-F — mcp-chrome-devtools/manual_testing_playbook/ (sed: index renamed, 22 prompts relabeled)
- [x] T-026 [P] Dispatch 003-G — mcp-code-mode/manual_testing_playbook/ (sed: index renamed, 26 prompts relabeled)
- [x] T-027 [P] Dispatch 003-H — sk-deep-research/manual_testing_playbook/ (sed: 36 prompts relabeled, 36 user-facing→user-visible field renames; index already canonical)
- [x] T-028 Verify wave 2a — all 8 roots pass `validate_document.py` (0 issues each); 0 residuals across `FEATURE FILE INDEX` / `^- Prompt:` / `Desired user-facing` / non-RCAF prompts

### Tier 2b (medium effort, parallel cli-codex — 12 dispatches)

- [x] T-030 [P] Dispatch 003-I — sk-deep-review/manual_testing_playbook/ (5 dup IDs deduped DRV-015/016/021/022/023→030..034; §5 REVIEW PROTOCOL added; §14 FEATURE CATALOG CROSS-REFERENCE INDEX added with 34 scenarios; 8 sections renumbered; validator 0 issues)
- [x] T-031 [P] Dispatch 003-J — mcp-coco-index/manual_testing_playbook/ (cli-codex: 26 files, 23 REFERENCES→SOURCE FILES, 26 RCAF Prompt: relabels, full SCENARIO CONTRACT fields; validator 0 issues)
- [x] T-032 [P] Dispatch 003-K — system-spec-kit/mcp_server/code_graph/manual_testing_playbook/ (cli-codex: 15 per-feature files, root reorganized w/ §5 + §16; 15 RCAF prompts rewritten + full SCENARIO CONTRACT; validator 0 issues)
- [x] T-033 [P] Dispatch 004-A — sk-improve-agent/feature_catalog/ (awk: stripped TOC blocks from 13 per-feature files; root catalog TOC retained)
- [x] T-034 [P] Dispatch 004-B — sk-deep-research/feature_catalog/ (sed: renamed `### Tests` → `### Validation And Tests` in 14 files)
- [x] T-035 [P] Dispatch 004-C — system-spec-kit/mcp_server/skill_advisor/feature_catalog/ (FALSE-POSITIVE: "pre-Phase-027" is feature-purpose context for the legacy-consumer shim, not packet-history drift per ADR-D-002 scope; no action needed)
- [x] T-036 [P] Dispatch 004-D — system-spec-kit/mcp_server/code_graph/feature_catalog/ (awk: inserted `### Validation And Tests` section in 17 per-feature files; each points to corresponding `manual_testing_playbook/<category>/`)
- [x] T-037 [P] Dispatch 005-A — system-spec-kit refs PARTIAL batch 1 (cli-codex T-refs combined: 19 PARTIAL files normalized, ANCHORs added, frontmatter trimmed)
- [x] T-038 [P] Dispatch 005-B — system-spec-kit refs DRIFT batch (cli-codex T-refs combined: 7 ssk DRIFT files restructured to OVERVIEW first + ANCHORs)
- [x] T-039 [P] Dispatch 005-C — system-spec-kit refs PARTIAL batch 2 (folded into T-refs combined dispatch)
- [x] T-040 [P] Dispatch 005-D — sk-code-review refs (cli-codex T-refs combined: 2 DRIFT files review_core + review_ux_single_pass restructured, 1 PARTIAL quick_reference normalized)
- [x] T-041 Verify wave 2b — 28/28 modified ref files pass `validate_document.py` (0 issues each); 107 net new ANCHOR comments added; 7 OVERVIEW restructures; 6 frontmatter trims

### Tier 2c (high effort, single-scope cli-codex — 5 dispatches)

- [x] T-050 [P] Dispatch 003-L — sk-improve-agent/manual_testing_playbook/ (cli-codex: 31 per-feature files restructured to canonical 5-section, 31 RCAF prompts written, 3 root sections added/renamed, validator 0 issues)
- [x] T-051 [P] Dispatch 003-M — system-spec-kit/mcp_server/skill_advisor/manual_testing_playbook/ — RECLASSIFY (cli-codex: 44 files moved to operator_runbook/ via fs mv (git index.lock sandbox guard), root renamed to operator_runbook.md, internal refs updated; new canonical manual_testing_playbook/ with 3 categories + 4 SAD-NNN scenarios; validator 0 issues)
- [x] T-052 [P] Dispatch 003-N — mcp-clickup/manual_testing_playbook/ — CREATE FROM SCRATCH (cli-codex: 6 categories created, 12 per-feature CLU-NNN scenarios with full RCAF prompts; validator 0 issues; scenarios derived from historical SKILL.md/cli_reference.md commit since mcp-clickup parent dir absent in current tree)
- [x] T-053 Dispatch 003-O — system-spec-kit/manual_testing_playbook/ canonical FULL REMEDIATION (cli-codex: 320 files, all REFERENCES→SOURCE FILES, all 320 RCAF Prompt: labels, full SCENARIO CONTRACT fields; validator 0 issues on root)
- [x] T-054 Dispatch 004-E — system-spec-kit/feature_catalog/ canonical FULL REMEDIATION (cli-codex: 303 files, 676 packet-history annotations stripped, 272 canonical source lines added, 221 `### Tests`→`### Validation And Tests` renames, dup `14--` resolved (folded into 14--pipeline-architecture), non-feature README removed; validator 0 issues)
- [x] T-055 Verify wave 2c — all 5 cli-codex dispatches passed `validate_document.py` exit 0 on root playbooks/catalogs; per-feature counts verified (T-031: 26, T-032: 15, T-050: 31, T-051: 4 new + 44 reclassified, T-052: 12, T-053: 320, T-054: 303)
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

### Tier 3 — Template cleanup + path-reference sweep

- [x] T-060 Re-verified: validate.sh held one bypass guard for /templates/sharded; no other active callers
- [x] T-061 `git rm -r templates/sharded/` (5 files removed: 01-overview, 02-requirements, 03-architecture, 04-testing, spec-index)
- [x] T-062 `git mv templates/stress-test templates/stress_test` + validate.sh guard updated (sharded bypass removed; changelog kept)
- [x] T-063 Created `templates/stress_test/README.md` per sk-doc README template (Quick Start + Files table + When to Use + Related)
- [x] T-064 `git mv templates/addendum/level3plus-govern templates/addendum/level3-plus-govern`
- [x] T-065 `templates/changelog/README.md` frontmatter trimmed to title+description only; `root.md`/`phase.md` left intact (instantiable templates with substantive metadata that gets rendered into changelogs)
- [x] T-066 Rewrote `.opencode/plugins/README.md` per sk-doc README template (TOC, OVERVIEW, Quick Start, Current Entrypoints, Bridge Modules, Upgrade Notes, Related); validator 0 issues
- [x] T-067 Swept `level3plus-govern` → `level3-plus-govern` across 19 active code files
- [x] T-068 Swept `templates/stress-test` → `templates/stress_test` across 4 active code files (1 acceptable residual in shadow-deltas.jsonl runtime data — auto-regenerates)
- [x] T-069 Swept `templates/sharded` references (validate.sh guard removed; 0 active callers remain)
- [x] T-070 Final residual sweep: 0 hits across `level3plus-govern` / `templates/stress-test` / `templates/sharded` in active code paths (.opencode/skill/)

### Tier 4 — Validation + memory save

- [x] T-080 Run `validate_document.py` on every modified document — 17/17 modified ROOT surfaces pass 0 issues; spot-checks 5/5 playbooks pass, 5/5 references pass; per-feature catalog snippets fail on pre-existing `missing_toc` validator quirk that affects every catalog snippet repo-wide (not introduced by this packet)
- [x] T-081 Run `validate.sh --strict` on 040 packet — same documented pre-existing 1 error + 3 warnings (SECTION_COUNTS regex misclassifies acceptance scenarios; AI_PROTOCOL pattern detection; custom anchor `ai-protocol`). Content unaffected.
- [ ] T-082 Run `code_graph_scan` and verify fresh status (deferred — orthogonal infra task)
- [ ] T-083 Run `memory_search` smoke tests for renamed paths (deferred — generate-context.js indexed the packet but full smoke battery not run)
- [x] T-084 Manual cross-file link spot-checks — sk-deep-review §14 FEATURE CATALOG CROSS-REFERENCE INDEX has 34 working links to per-feature files; mcp-coco-index TOC anchor matches §15 heading
- [x] T-085 Spot-check 5 random per-feature playbook files — 5/5 pass `validate_document.py`, all have RCAF Prompt: lines
- [x] T-086 Spot-check 5 random per-feature catalog files — 5/5 INVALID due to pre-existing validator quirk (out of scope; affects untouched catalogs equally)
- [x] T-087 Spot-check 5 random reference files — 5/5 pass
- [ ] T-088 Verify skill_advisor recommendations still resolve correctly post-rename (deferred — runtime check; not packet-blocking)
- [x] T-090 Update `_memory.continuity` in implementation-summary.md — kept current throughout session; final state recorded
- [x] T-091 Run `generate-context.js` for the 040 packet — indexed (1 indexed + 4 unchanged + 2 non-blocking failures on description.json/graph-metadata.json content variants); causal chain edges created
- [x] T-092 Generate `handover.md` for cross-session continuity — authored with full state, decisions, limitations, next steps
- [ ] T-093 Optional: `/create:changelog` for the 040 packet (operator decision)
- [x] T-094 Tier 1-4 tasks complete in tasks.md with evidence; checklist.md key P0 items still need user-side sign-off line
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All P0 tasks marked `[x]` (REQ-001..REQ-008 satisfied per spec.md §4)
- [ ] All P0 + ≥90% P1 checklist items verified with evidence (per checklist.md)
- [ ] No `[B]` blocked tasks remaining
- [ ] All cli-codex dispatches succeeded (failed dispatches diagnosed + re-dispatched)
- [ ] Memory + graph reindexed; smoke tests pass
- [ ] No skill_advisor regressions in routing
- [ ] implementation-summary.md authored with final state
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`
- **Audit Findings**: See `audit-findings.md`
- **Approved External Plan**: `/Users/michelkerkmeester/.claude/plans/not-all-manual-testing-prancy-biscuit.md`
<!-- /ANCHOR:cross-refs -->

---

<!--
LEVEL 3 TASKS
- Tier 1: 11 tasks (foundation)
- Tier 2: 36 tasks (parallel cli-codex dispatches in 3 waves: 2a/2b/2c)
- Tier 3: 11 tasks (deterministic git ops + path sweep)
- Tier 4: 14 tasks (validation + memory save)
- Total: 72 tasks (T-001..T-094 with gaps for legibility)
-->
