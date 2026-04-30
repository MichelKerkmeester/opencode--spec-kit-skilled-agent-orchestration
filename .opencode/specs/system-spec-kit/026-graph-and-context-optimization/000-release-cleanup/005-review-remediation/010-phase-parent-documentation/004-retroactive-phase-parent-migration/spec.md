---
title: "Feature Specification: Retroactive Phase-Parent Migration"
template_source: "SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2"
description: "Retrofit the lean-trio policy across all NNN-prefixed phase parents in the repo (active + archived). Synthesize missing spec.md/description.json/graph-metadata.json where absent, refresh metadata where present, preserve heavy docs and manual block per tolerant migration policy. Dispatched via 3 parallel cli-copilot/gpt-5.4-medium workers."
trigger_phrases:
  - "retroactive phase parent migration"
  - "legacy phase parent retrofit"
  - "phase parent backfill"
  - "lean trio retrofit"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/010-phase-parent-documentation/004-retroactive-phase-parent-migration"
    last_updated_at: "2026-04-27T14:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored spec.md after discovery scan + sequential-thinking design pass"
    next_safe_action: "Author plan.md"
    blockers: []
    key_files: ["spec.md"]
    completion_pct: 10
    open_questions: []
    answered_questions: []
---
# Feature Specification: Retroactive Phase-Parent Migration

<!-- SPECKIT_LEVEL: 2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Draft |
| **Created** | 2026-04-27 |
| **Branch** | `main` |
| **Parent Spec** | `../spec.md` |
| **Parent Packet** | `010-phase-parent-documentation` |
| **Predecessor** | `003-references-and-readme-sync` |
| **Successor** | None (current tail of 010) |
| **Handoff Criteria** | Phases 001 + 002 + 003 shipped: validator branches, generator pointer, lean template, content-discipline validator, doc-sync across system-spec-kit + AGENTS triad. This packet retroactively applies the policy to legacy phase parents. |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The lean-trio policy is enforced for new phase parents (validator, template, generator, resume, docs). But the repo already contains 28 legacy phase parents created before the policy: 21 active and 7 archived. They split into two practical states:
- **Category B** (lean trio present + heavy docs): 21 parents — `description.json` + `graph-metadata.json` exist but may be stale; spec.md may be a heavy narrative rather than the lean manifest.
- **Category C** (lean trio incomplete): 7 parents — missing `spec.md` outright (e.g. `023-hybrid-rag-fusion-refinement/`, `024-compact-code-graph/`, `026/000-release-cleanup/`, `026/007-code-graph/`).

Tolerant policy (shipped in 001) prevents validation churn: legacy parents continue to validate. But future readers (human + AI) still see a mixed surface — some parents have proper lean spec.md manifests, others have heavy narrative content or missing files. The pointer mechanism (`derived.last_active_child_id`) is also absent on most legacy parents, so resume falls back to listing rather than redirecting.

### Purpose
Retrofit the lean trio across all 28 legacy phase parents. Synthesize what's missing, refresh what's stale, preserve narrative content (don't rewrite vision/purpose) and preserve heavy docs (tolerant policy stays). Outcome: every phase parent in the repo presents the same surface — lean manifest spec.md + current description.json + current graph-metadata.json with `manual` block intact. Resume pointer fields are populated on the next save naturally; this packet does not pre-populate them.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- **28 NNN-prefixed phase parents** identified by discovery scan (21 active + 7 archived)
- Per-parent action set:
  - If spec.md missing → synthesize from `templates/phase_parent/spec.md` + existing description.json + child enumeration
  - If description.json stale or missing → refresh
  - If graph-metadata.json `derived` block stale → refresh; `manual` block preserved verbatim
  - PHASE DOCUMENTATION MAP populated from filesystem children + their description.json titles
- Tolerant migration: heavy docs (`plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md`) PRESERVED in place; never deleted, never moved
- Narrative preservation: existing parent spec.md vision/purpose content carried forward; not rewritten
- Manual-block preservation: `manual.depends_on/supersedes/related_to` arrays kept verbatim
- Per-parent validate gate: every touched parent passes `validate.sh --strict --no-recursive` (modulo the same baseline forward-reference noise as 001/002/003)
- Worker output: each cli-copilot worker writes JSON report to `004/scratch/worker-N-report.json`

### Out of Scope
- **Spec-collection roots** (e.g. `.opencode/specs/system-spec-kit/`, `.opencode/specs/00--ai-systems/`) — these detect as phase parents but are not themselves spec packets; they're directory containers. No work at this layer.
- **Already-lean A-category parents** (16 parents) — no work needed; they already comply.
- **Heavy-doc deletion** — explicitly NOT done. Tolerant policy preserved. Soft deprecation is a future packet.
- **Soft-deprecation warnings** in validator — no new validator rules; existing PHASE_PARENT_CONTENT advisory is sufficient.
- **Cross-repo mirroring** — only this repo's `.opencode/specs/`. Sibling repos (Barter, fs-enterprises) are out of scope for migration work.
- **Pointer pre-population** — `last_active_child_id` will be populated naturally on next save per parent; not pre-filled by this packet.

### Files to Change

Directly: only this packet's own files (`spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `description.json`, `graph-metadata.json`, plus `scratch/worker-N-report.json` × 3).

Mutated by dispatched cli-copilot workers (per worker JSON report; not enumerated in this spec table because the count is 28 parents × up to 3 files each):

| Worker | Subtree | Phase parent count |
|--------|---------|-------------------:|
| 1 | `022-hybrid-rag-fusion/` + `023-hybrid-rag-fusion-refinement/` | 8 |
| 2 | `00--ai-systems/` + `024-compact-code-graph/` | 8 |
| 3 | `026-graph-and-context-optimization/` (4 phase-parents) + z_archive/z_future entries (~7) | 12 |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every C-category phase parent (lean trio incomplete) gains the missing components. | Post-migration: each of `023-hybrid-rag-fusion-refinement/`, `024-compact-code-graph/`, `026/000-release-cleanup/`, `026/007-code-graph/` (plus archived equivalents) has `spec.md` + `description.json` + `graph-metadata.json` present and valid. `is_phase_parent()` continues to return true. |
| REQ-002 | Every B-category phase parent has refreshed metadata. | `description.json.lastUpdated` is within the migration window; `graph-metadata.json.derived.last_save_at` is fresh; `graph-metadata.json.derived.children_ids` matches the actual filesystem children. |
| REQ-003 | Manual block in `graph-metadata.json` preserved verbatim. | For every touched parent, the post-migration `manual.depends_on`, `manual.supersedes`, `manual.related_to` arrays are byte-equal to the pre-migration values. |
| REQ-004 | Heavy docs preserved at parent level. | For every B-category parent, `plan.md`, `tasks.md`, `checklist.md`, `decision-record.md`, `implementation-summary.md` (whichever existed pre-migration) are still present post-migration with no content changes. |
| REQ-005 | 026 regression preserved. | `validate.sh --strict --json` against `026-graph-and-context-optimization/` after migration shows the same 3 parent-level error rules as the pre-migration baseline (`FRONTMATTER_MEMORY_BLOCK`, `SPEC_DOC_INTEGRITY`, `TEMPLATE_SOURCE`); zero new error classes. |
| REQ-006 | All 3 worker JSON reports filed. | `004/scratch/worker-{1,2,3}-report.json` present, each enumerating processed/skipped/blocked parents and validator status before/after. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-007 | Existing narrative content preserved. | For each B-category parent that had a pre-migration `spec.md` with vision/purpose narrative, the post-migration `spec.md` carries forward that narrative (vision + purpose section; not rewritten). |
| REQ-008 | PHASE DOCUMENTATION MAP populated from filesystem. | Each refreshed parent `spec.md` contains a Phase Documentation Map table listing every NNN-named child folder. Status values may be informational (sourced from each child's `graph-metadata.json` `derived.status` if present, else `unknown`). |
| REQ-009 | Cross-impl detection still agrees. | After migration, `is_phase_parent()` (shell) and `isPhaseParent()` (ESM JS) continue to return identical booleans for every touched parent. |
| REQ-010 | Validator phase-parent branches still fire. | `validate.sh --strict --no-recursive` on each touched parent shows `FILE_EXISTS: Phase parent: spec.md present (lean trio policy)` (i.e. the early-return branch is hit). |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A re-run of the discovery scan classifies all 28 in-scope legacy parents as Category A (lean trio complete) OR B (lean trio + heavy docs present, not C (incomplete).
- **SC-002**: 026 strict validation shows zero NEW error rules vs baseline; the 3 baseline rules unchanged.
- **SC-003**: Spot-check 5 random touched parents — `manual` block in graph-metadata.json byte-equal to pre-migration; spec.md vision/purpose section byte-equal or recognizably preserved (worker may reflow whitespace).
- **SC-004**: All 3 worker JSON reports show `tasks_completed` ≥ assigned chunk minus user-approved skips, `tasks_blocked` empty, no fatal errors.
- **SC-005**: A future `/spec_kit:resume` against any touched legacy parent enters the lean-trio resume path (lists children with statuses; pointer-first when populated by future saves).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Worker overwrites valuable narrative content. | High | Hard constraint in worker brief: preserve existing narrative; carry forward vision/purpose verbatim or near-verbatim. Per-parent diff review on samples. |
| Risk | Worker clobbers `manual` block in graph-metadata.json. | Medium | Hard constraint: read `manual` first, write back unchanged. REQ-003 verifies post-migration. |
| Risk | Concurrent workers touching same path. | Low | Chunked by parent spec collection — each worker has its own subtree. No shared writes by design. |
| Risk | cli-copilot rate limit (>3 concurrent throttles). | Medium | Exactly 3 workers per memory rule. No overage. |
| Risk | Legacy parent with non-standard structure (e.g. unusual folder names) breaks worker logic. | Low | Worker brief instructs SKIP-with-reason on parsing failures rather than blind mutation. Skipped items recorded in JSON report. |
| Risk | 026 regression introduced by accidentally deleting heavy docs. | High | Hard constraint: NEVER delete plan.md/tasks.md/etc. REQ-004 + REQ-005 verify. Pre-migration regression baseline captured at `004/scratch/regression-baseline-pre-004.txt`. |
| Risk | Workers can't read existing description.json (malformed JSON). | Low | Worker treats parse failure as SKIP and reports in JSON. No silent override. |
| Dependency | `templates/phase_parent/spec.md` (lean parent template). | Green | Shipped in 001. |
| Dependency | `is_phase_parent` / `isPhaseParent` detection. | Green | Shipped in 001. |
| Dependency | cli-copilot CLI v1.0.36+ available. | Green | Verified at 1.0.36. |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Total wall-clock for all 3 workers running in parallel: ≤ 30 minutes for 28 parents (≈ 1 minute per parent per worker on average; templated mutations).

### Security
- **NFR-S01**: No new file-write paths beyond the existing canonical save / template scaffolding.
- **NFR-S02**: cli-copilot dispatch via `--allow-all-tools --no-ask-user` (autopilot/autonomous). No interactive prompts; if a worker requires user judgment, it MUST log a SKIP with reason rather than block.

### Reliability
- **NFR-R01**: Each worker writes its JSON report atomically (temp + rename) so partial completion doesn't produce malformed reports.
- **NFR-R02**: All filesystem mutations are reversible via `git checkout -- <path>` because no files outside the spec folder tree are touched by workers.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Phase Parent Edge Cases
- A phase parent with NO `spec.md` and NO `description.json` AND no children has `description.json` (only the discovery rule fired) → SKIP with reason "ambiguous parent state, manual review needed". Record in worker report.
- A phase parent with `description.json` but no `spec.md` → SYNTHESIZE spec.md from description.json content + child enumeration (Category C path).
- A phase parent with stale `children_ids` in graph-metadata.json (children added/removed since last save) → REFRESH derived.children_ids from filesystem.
- A nested phase parent (parent → phase parent → phase parent) → process each level independently. Both levels are subject to the same lean-trio policy.

### Z_archive / z_future Edge Cases
- Folders inside `z_archive/` or `z_future/` are sealed history — touching them is unusual. User explicitly included them in scope. Worker proceeds normally but records that the parent was archived (informational, not a blocker).
- A z_archive parent that has been migrated multiple times (description.json shows multiple memorySequence entries) → preserve the entire memoryNameHistory; only update `lastUpdated`.

### Validator Edge Cases
- After migration, `PHASE_PARENT_CONTENT` may flag legacy parents whose preserved narrative still mentions consolidation/merge/migration history. This is ADVISORY (severity: warn) — not a blocker. Worker proceeds without modifying narrative just to suppress the warning.
- 026 baseline already has 3 parent-level error rules. Migration must not introduce a 4th. Worker validates pre/post and reports.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 18/25 | 28 phase parents touched, ≤3 files per parent, mostly templated |
| Risk | 14/25 | Mass legacy-content mutation; mitigated by tolerant policy + hard constraints + per-parent validate gate |
| Research | 4/20 | Discovery scan complete; design captured in this spec; workers follow templated procedure |
| **Total** | **36/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- Should worker reports be aggregated into a single migration manifest at `004/scratch/migration-manifest.json` for easy auditing? Recommendation: yes — this Claude session aggregates the 3 worker reports into one manifest as part of T015 verification.
- Should we run the migration on z_archive/z_future entries despite their sealed-history convention? Recommendation: yes (per user's explicit ask), but record the archived-status flag in each worker report so future audits can distinguish active migrations from archive backfills.
- Should the spec-collection roots (e.g. `.opencode/specs/system-spec-kit/`) eventually receive a similar lean trio describing what's in them? Recommendation: defer — those aren't spec packets; a separate "spec-roots README" packet can address them.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Parent Spec**: See `../spec.md`
- **Predecessors (shipped)**: See `../001-validator-and-docs/`, `../002-generator-and-polish/`, `../003-references-and-readme-sync/`
- **Discovery scan log**: See `scratch/discovery-scan.txt` (captured 2026-04-27 before authoring this spec)
- **Pre-migration regression baseline**: See `scratch/regression-baseline-pre-004.txt`
